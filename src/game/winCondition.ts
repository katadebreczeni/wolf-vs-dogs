import type { GameState, GameResult } from '../types/game';
import { getValidMoves } from './moves';

/**
 * Check game result after every move.
 * Order: (1) wolf trapped → Dogs Win
 *        (2) wolf broke through → Wolf Wins
 *        (3) dogs cannot move (on their turn) → Wolf Wins
 */
export function checkGameResult(state: GameState): GameResult {
  if (!state.wolf) {
    return { isOver: false };
  }

  // 1. Wolf trapped? (no valid moves)
  const wolfMoves = getValidMoves(state.wolf, state);
  if (wolfMoves.length === 0) {
    return { isOver: true, winner: 'dogPlayer', reason: 'wolfTrapped' };
  }

  // 2. Wolf broke through? (wolf row <= min dog row)
  const minDogRow = Math.min(...state.dogs.map((d) => d.position.row));
  if (state.wolf.position.row <= minDogRow) {
    return { isOver: true, winner: 'wolfPlayer', reason: 'wolfBrokeThrough' };
  }

  // 3. Dogs cannot move? (checked when it's dog player's turn)
  if (state.currentPlayer === 'dogPlayer') {
    const anyDogCanMove = state.dogs.some(
      (d) => getValidMoves(d, state).length > 0
    );
    if (!anyDogCanMove) {
      return { isOver: true, winner: 'wolfPlayer', reason: 'dogsCannotMove' };
    }
  }

  return { isOver: false };
}

