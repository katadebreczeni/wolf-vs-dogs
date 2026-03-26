import type { Piece, Position, GameState } from '../types/game';
import type { AiMove } from '../types/ai';
import { isInBounds, isOccupied } from './board';

/** Direction offsets for wolf (all 4 diagonals) */
const WOLF_DIRECTIONS: [number, number][] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

/** Direction offsets for dog (forward only – increasing row) */
const DOG_DIRECTIONS: [number, number][] = [
  [1, -1],
  [1, 1],
];

/** Get valid moves for a given piece */
export function getValidMoves(
  piece: Piece,
  state: GameState
): Position[] {
  const directions =
    piece.type === 'wolf' ? WOLF_DIRECTIONS : DOG_DIRECTIONS;

  return directions
    .map(([dr, dc]) => ({
      row: piece.position.row + dr,
      col: piece.position.col + dc,
    }))
    .filter((pos) => isInBounds(pos) && !isOccupied(pos, state));
}

/** Check if a specific move is valid */
export function isValidMove(
  piece: Piece,
  to: Position,
  state: GameState
): boolean {
  const validMoves = getValidMoves(piece, state);
  return validMoves.some((m) => m.row === to.row && m.col === to.col);
}

/** Apply a move to a game state (returns new state, immutable) */
export function applyMove(
  state: GameState,
  move: AiMove
): GameState {
  const newState = { ...state };

  if (move.pieceId === 'wolf' && state.wolf) {
    newState.wolf = {
      ...state.wolf,
      position: { ...move.to },
    };
  } else {
    newState.dogs = state.dogs.map((dog) =>
      dog.id === move.pieceId
        ? { ...dog, position: { ...move.to } }
        : dog
    );
  }

  // Toggle current player
  newState.currentPlayer =
    state.currentPlayer === 'wolfPlayer' ? 'dogPlayer' : 'wolfPlayer';

  return newState;
}

/** Generate all possible moves for a given player role */
export function generateAllMoves(
  state: GameState,
  playerRole: 'wolfPlayer' | 'dogPlayer'
): AiMove[] {
  const moves: AiMove[] = [];

  if (playerRole === 'wolfPlayer' && state.wolf) {
    const validMoves = getValidMoves(state.wolf, state);
    for (const to of validMoves) {
      moves.push({
        pieceId: state.wolf.id,
        from: { ...state.wolf.position },
        to,
      });
    }
  } else if (playerRole === 'dogPlayer') {
    for (const dog of state.dogs) {
      const validMoves = getValidMoves(dog, state);
      for (const to of validMoves) {
        moves.push({
          pieceId: dog.id,
          from: { ...dog.position },
          to,
        });
      }
    }
  }

  return moves;
}

