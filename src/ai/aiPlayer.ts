import type { GameState, Position, PlayerRole } from '../types/game';
import type { AiMove, AiPlayerConfig, LearningData, MinimaxConfig, DifficultyLevel } from '../types/ai';
import { getAllDarkSquares } from '../game/board';
import { evaluatePosition, DEFAULT_WEIGHTS } from './evaluation';
import { iterativeDeepeningMinimax } from './minimax';
import { generateAllMoves } from '../game/moves';

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

/**
 * Compute AI move with difficulty-based blunder system.
 * Lower levels intentionally make random moves at a given probability.
 */
export function computeAiMoveWithDifficulty(
  state: GameState,
  difficulty: DifficultyLevel,
  aiRole: PlayerRole,
  learningData: LearningData
): AiMove {
  // 1. Blunder check: should AI make a random move?
  if (difficulty.blunderChance > 0 && Math.random() < difficulty.blunderChance) {
    const allMoves = generateAllMoves(state, aiRole);
    if (allMoves.length > 0) {
      return allMoves[Math.floor(Math.random() * allMoves.length)];
    }
  }

  // 2. Normal minimax with difficulty-limited config
  const config: MinimaxConfig = {
    maxDepth: difficulty.maxDepth,
    maxTimeMs: difficulty.maxTimeMs,
    useIterativeDeepening: true,
    useTranspositionTable: difficulty.useTranspositionTable,
    useMoveSorting: difficulty.useMoveSorting,
  };

  const weights = difficulty.useLearning
    ? learningData.weights
    : DEFAULT_WEIGHTS;

  return computeAiMove(
    state,
    { role: aiRole, minimaxConfig: config },
    { ...learningData, weights }
  );
}
