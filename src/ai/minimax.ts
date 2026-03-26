import type { GameState } from '../types/game';
import type { MinimaxResult, MinimaxConfig, EvalWeights, AiMove } from '../types/ai';
import { checkGameResult } from '../game/winCondition';
import { generateAllMoves, applyMove } from '../game/moves';
import { evaluatePosition } from './evaluation';
import { TranspositionTable, hashPosition } from './transpositionTable';

const WIN_SCORE = 10000;

/**
 * Minimax with alpha-beta pruning.
 * Wolf maximizes (positive), Dogs minimize (negative).
 */
function minimaxSearch(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  weights: EvalWeights,
  transTable: TranspositionTable,
  nodesSearched: { count: number },
  startTime: number,
  maxTimeMs: number
): { score: number; move: AiMove | null } {
  nodesSearched.count++;

  // Time check
  if (performance.now() - startTime > maxTimeMs) {
    return { score: evaluatePosition(state, weights), move: null };
  }

  // Terminal state check
  const result = checkGameResult(state);
  if (result.isOver) {
    const score = result.winner === 'wolfPlayer' ? WIN_SCORE + depth : -(WIN_SCORE + depth);
    return { score, move: null };
  }

  // Depth limit → static evaluation
  if (depth === 0) {
    return { score: evaluatePosition(state, weights), move: null };
  }

  // Transposition table lookup
  const hash = hashPosition(state);
  const cached = transTable.get(hash, depth);
  if (cached) {
    if (cached.flag === 'exact') {
      return { score: cached.score, move: cached.bestMove };
    }
    if (cached.flag === 'lowerBound') {
      alpha = Math.max(alpha, cached.score);
    } else if (cached.flag === 'upperBound') {
      beta = Math.min(beta, cached.score);
    }
    if (alpha >= beta) {
      return { score: cached.score, move: cached.bestMove };
    }
  }

  // Generate and sort moves
  const playerRole = isMaximizing ? 'wolfPlayer' : 'dogPlayer';
  const moves = generateAllMoves(state, playerRole);

  if (moves.length === 0) {
    // No moves = lose
    const score = isMaximizing ? -(WIN_SCORE + depth) : WIN_SCORE + depth;
    return { score, move: null };
  }

  // Move ordering: put transposition table best move first
  if (cached?.bestMove) {
    const bestIdx = moves.findIndex(
      (m) =>
        m.pieceId === cached.bestMove!.pieceId &&
        m.to.row === cached.bestMove!.to.row &&
        m.to.col === cached.bestMove!.to.col
    );
    if (bestIdx > 0) {
      const [best] = moves.splice(bestIdx, 1);
      moves.unshift(best);
    }
  }

  // Sort remaining by quick heuristic
  sortMovesByHeuristic(moves, state, isMaximizing, weights);

  let bestMove = moves[0];
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of moves) {
    const newState = applyMove(state, move);
    const { score } = minimaxSearch(
      newState,
      depth - 1,
      alpha,
      beta,
      !isMaximizing,
      weights,
      transTable,
      nodesSearched,
      startTime,
      maxTimeMs
    );

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, bestScore);
    }

    // Alpha-Beta cutoff
    if (beta <= alpha) break;

    // Time check
    if (performance.now() - startTime > maxTimeMs) break;
  }

  // Store in transposition table
  let flag: 'exact' | 'lowerBound' | 'upperBound' = 'exact';
  if (bestScore <= alpha) flag = 'upperBound';
  else if (bestScore >= beta) flag = 'lowerBound';

  transTable.set(hash, bestScore, depth, flag, bestMove);

  return { score: bestScore, move: bestMove };
}

/** Quick heuristic sort for move ordering */
function sortMovesByHeuristic(
  moves: AiMove[],
  state: GameState,
  isMaximizing: boolean,
  weights: EvalWeights
): void {
  // Simple: evaluate resulting position at depth 0
  const scores = moves.map((move) => {
    const newState = applyMove(state, move);
    return evaluatePosition(newState, weights);
  });

  // Sort: maximizing wants highest first, minimizing wants lowest first
  const indices = moves.map((_, i) => i);
  indices.sort((a, b) =>
    isMaximizing ? scores[b] - scores[a] : scores[a] - scores[b]
  );

  const sorted = indices.map((i) => moves[i]);
  for (let i = 0; i < moves.length; i++) {
    moves[i] = sorted[i];
  }
}

/**
 * Iterative deepening minimax.
 * Searches depth 1, 2, 3... until time runs out.
 */
export function iterativeDeepeningMinimax(
  state: GameState,
  config: MinimaxConfig,
  weights: EvalWeights
): MinimaxResult {
  const transTable = new TranspositionTable();
  const isMaximizing = state.currentPlayer === 'wolfPlayer';
  const startTime = performance.now();

  let bestResult: MinimaxResult = {
    score: 0,
    move: null,
    depth: 0,
    nodesSearched: 0,
  };

  for (let depth = 1; depth <= config.maxDepth; depth++) {
    const nodesSearched = { count: 0 };
    const { score, move } = minimaxSearch(
      state,
      depth,
      -Infinity,
      Infinity,
      isMaximizing,
      weights,
      transTable,
      nodesSearched,
      startTime,
      config.maxTimeMs
    );

    if (move) {
      bestResult = {
        score,
        move,
        depth,
        nodesSearched: nodesSearched.count,
      };
    }

    // Time check
    if (performance.now() - startTime > config.maxTimeMs) break;
  }

  return bestResult;
}

