import type { Position, Dog, Wolf, GameState } from '../types/game';

/** Check if a position is a dark (playable) square */
export function isDarkSquare(pos: Position): boolean {
  return (pos.row + pos.col) % 2 === 1;
}

/** Check if a position is within board boundaries */
export function isInBounds(pos: Position): boolean {
  return pos.row >= 0 && pos.row <= 7 && pos.col >= 0 && pos.col <= 7;
}

/** Check if a position is occupied by any piece */
export function isOccupied(pos: Position, state: GameState): boolean {
  if (
    state.wolf &&
    state.wolf.position.row === pos.row &&
    state.wolf.position.col === pos.col
  ) {
    return true;
  }
  return state.dogs.some(
    (d) => d.position.row === pos.row && d.position.col === pos.col
  );
}

/** Get all dark squares on the board */
export function getAllDarkSquares(): Position[] {
  const squares: Position[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        squares.push({ row, col });
      }
    }
  }
  return squares;
}

/** Initial dog positions (row 0, dark squares) */
export const INITIAL_DOGS: Dog[] = [
  { id: 'dog-0', type: 'dog', position: { row: 0, col: 1 } },
  { id: 'dog-1', type: 'dog', position: { row: 0, col: 3 } },
  { id: 'dog-2', type: 'dog', position: { row: 0, col: 5 } },
  { id: 'dog-3', type: 'dog', position: { row: 0, col: 7 } },
];

/** Create a new wolf piece at a given position */
export function createWolf(position: Position): Wolf {
  return { id: 'wolf', type: 'wolf', position };
}

/** Check if position is valid for wolf placement */
export function isValidWolfPlacement(pos: Position, state: GameState): boolean {
  return isDarkSquare(pos) && pos.row >= 1 && !isOccupied(pos, state);
}

/** Get column label (A-H) */
export function getColLabel(col: number): string {
  return String.fromCharCode(65 + col);
}

/** Get row label (1-8) */
export function getRowLabel(row: number): string {
  return String(row + 1);
}

/** Format a position for display, e.g. "B3" */
export function formatPosition(pos: Position): string {
  return `${getColLabel(pos.col)}${getRowLabel(pos.row)}`;
}

