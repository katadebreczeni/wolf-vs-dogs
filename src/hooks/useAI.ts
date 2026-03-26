import { useEffect } from 'react';
import type { GameState, GameAction } from '../types/game';
import { computeAiMove, computeWolfPlacement, DEFAULT_MINIMAX_CONFIG } from '../ai/aiPlayer';
import { loadLearningData } from '../ai/learningStore';

/**
 * AI hook – watches game state and triggers AI moves when it's AI's turn.
 * Handles both wolf placement (setup) and regular moves (playing).
 */
export function useAI(
  state: GameState,
  dispatch: React.Dispatch<GameAction>
): void {
  useEffect(() => {
    if (!state.isAiTurn) return;
    if (state.phase === 'gameOver' || state.phase === 'menu') return;

    const controller = new AbortController();

    const doAiTurn = async () => {
      // Artificial delay for natural feeling
      const delay = 400 + Math.random() * 400;
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (controller.signal.aborted) return;

      const learningData = loadLearningData();

      if (state.phase === 'setup') {
        // AI places wolf
        const position = computeWolfPlacement(state, learningData);
        if (!controller.signal.aborted) {
          dispatch({ type: 'AI_PLACE_WOLF', position });
        }
      } else if (state.phase === 'playing') {
        // AI makes a move
        const aiRole =
          state.humanRole === 'wolfPlayer' ? 'dogPlayer' : 'wolfPlayer';

        try {
          const move = computeAiMove(
            state,
            { role: aiRole, minimaxConfig: DEFAULT_MINIMAX_CONFIG },
            learningData
          );

          if (!controller.signal.aborted) {
            dispatch({ type: 'AI_MOVE', from: move.from, to: move.to });
          }
        } catch {
          // Fallback – shouldn't happen, but be safe
          console.error('AI failed to compute a move');
        }
      }
    };

    doAiTurn();

    return () => controller.abort();
  }, [state.isAiTurn, state.phase, dispatch, state]);
}

