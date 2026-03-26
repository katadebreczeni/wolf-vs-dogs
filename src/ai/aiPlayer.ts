import type { GameState, Position } from '../types/game';
import type { AiMove, AiPlayerConfig, LearningData, MinimaxConfig } from '../types/ai';
import { getAllDarkSquares } from '../game/board';
import { evaluatePosition } from './evaluation';
import { iterativeDeepeningMinimax } from './minimax';

/** Default minimax configuration */
export const DEFAULT_MINIMAX_CONFIG: MinimaxConfig = {
  maxDepth: 10,
  maxTimeMs: 2000,
  useIterativeDeepening: true,
  useTranspositionTable: true,
  useMoveSorting: true,
};

/**
 * Compute the best AI move for the current state.
 */
export function computeAiMove(
  state: GameState,
  config: AiPlayerConfig,
  learningData: LearningData
): AiMove {
  const result = iterativeDeepeningMinimax(
    state,
    config.minimaxConfig,
    learningData.weights
  );

  if (result.move) {
    return result.move;
  }

  // Fallback: shouldn't happen, but pick any valid move
  throw new Error('AI could not find a valid move');
}

/**
 * Compute wolf placement for the AI in SETUP phase.
 * Evaluates all valid dark squares and picks the best.
 */
export function computeWolfPlacement(
  state: GameState,
  learningData: LearningData
): Position {
  const validSquares = getAllDarkSquares().filter((pos) => pos.row >= 1);

  let bestPos = validSquares[0];
  let bestScore = -Infinity;

  for (const pos of validSquares) {
    const testState: GameState = {
      ...state,
      wolf: { id: 'wolf', type: 'wolf', position: pos },
    };
    const score = evaluatePosition(testState, learningData.weights);
    if (score > bestScore) {
      bestScore = score;
      bestPos = pos;
    }
  }

  return bestPos;
}

