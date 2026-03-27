import type { Position, GameState, PlayerRole } from './game';

// --- AI Move ---

/** An AI move: which piece moves where */
export interface AiMove {
  pieceId: string;
  from: Position;
  to: Position;
}

/** AI move for wolf placement (setup phase) */
export interface AiPlacement {
  position: Position;
}

// --- Evaluation ---

/** Raw evaluation score: positive = good for wolf, negative = good for dogs */
export type EvalScore = number;

/** Evaluation weights (tunable, learnable) */
export interface EvalWeights {
  wolfMobility: number;
  dogMobility: number;
  wolfRowAdvance: number;
  dogFormation: number;
  wolfDistanceToDogs: number;
  wolfEscapeRoutes: number;
  dogCoverage: number;
  wolfTrappedPenalty: number;
  centerControlWolf: number;
  centerControlDogs: number;
}

// --- Learning Store ---

/** Persistent data stored in localStorage */
export interface LearningData {
  version: number;
  gamesPlayed: number;
  weights: EvalWeights;
  positionHistory: PositionMemory[];
}

/** Remembered position outcome */
export interface PositionMemory {
  hash: string;
  score: EvalScore;
  result: 'wolfWin' | 'dogWin';
  visits: number;
}

// --- Minimax ---

export interface MinimaxResult {
  score: EvalScore;
  move: AiMove | null;
  depth: number;
  nodesSearched: number;
}

export interface MinimaxConfig {
  maxDepth: number;
  maxTimeMs: number;
  useIterativeDeepening: boolean;
  useTranspositionTable: boolean;
  useMoveSorting: boolean;
}

// --- Transposition Table ---

export interface TranspositionEntry {
  hash: number;
  depth: number;
  score: EvalScore;
  flag: 'exact' | 'lowerBound' | 'upperBound';
  bestMove: AiMove | null;
}

// --- AI Player Config ---

export interface AiPlayerConfig {
  role: PlayerRole;
  minimaxConfig: MinimaxConfig;
}

/** Evaluation components for learning */
export interface EvalComponents {
  wolfMobility: number;
  dogMobility: number;
  wolfRowAdvance: number;
  dogFormation: number;
  wolfDistanceToDogs: number;
  wolfEscapeRoutes: number;
  dogCoverage: number;
  wolfTrappedPenalty: number;
  centerControlWolf: number;
  centerControlDogs: number;
}

/** Generate all possible moves for a player */
export interface MoveGeneration {
  state: GameState;
  playerRole: PlayerRole;
}

// --- Difficulty Levels ---

/** Difficulty level configuration */
export interface DifficultyLevel {
  id: number;                    // 1-5
  name: string;                  // 'Seedling', 'Sprout', etc.
  icon: string;                  // emoji
  maxDepth: number;              // minimax search depth
  maxTimeMs: number;             // time limit per move
  blunderChance: number;         // 0.0 - 1.0 (probability of random move)
  useTranspositionTable: boolean;
  useMoveSorting: boolean;
  useLearning: boolean;          // whether AI learns from games at this level
  winsToUnlock: number;          // cumulative wins needed to unlock
  beanstalkStage: number;        // beanstalk growth stage (0-4)
}
