// --- Board ---

/** Column index (0-7) */
export type Col = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Row index (0-7) */
export type Row = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** A position on the board */
export interface Position {
  row: number;
  col: number;
}

// --- Pieces ---

export type PieceType = 'wolf' | 'dog';

export interface Piece {
  id: string;
  type: PieceType;
  position: Position;
}

export interface Wolf extends Piece {
  type: 'wolf';
}

export interface Dog extends Piece {
  type: 'dog';
}

// --- Players ---

export type PlayerRole = 'wolfPlayer' | 'dogPlayer';

export type ControlledBy = 'human' | 'ai';

// --- Game Phases ---

export type GamePhase = 'menu' | 'setup' | 'playing' | 'gameOver';

// --- Game State ---

export interface GameState {
  phase: GamePhase;
  humanRole: PlayerRole | null;
  currentPlayer: PlayerRole;
  wolf: Wolf | null;
  dogs: Dog[];
  selectedPieceId: string | null;
  validMoves: Position[];
  winner: PlayerRole | null;
  message: string;
  isAiTurn: boolean;
  lastMove: {
    from: Position;
    to: Position;
    by: ControlledBy;
  } | null;
}

// --- Actions ---

export type GameAction =
  | { type: 'SELECT_ROLE'; role: PlayerRole }
  | { type: 'PLACE_WOLF'; position: Position }
  | { type: 'SELECT_PIECE'; pieceId: string }
  | { type: 'DESELECT_PIECE' }
  | { type: 'MOVE_PIECE'; to: Position }
  | { type: 'AI_MOVE'; from: Position; to: Position }
  | { type: 'AI_PLACE_WOLF'; position: Position }
  | { type: 'INVALID_ACTION'; message: string }
  | { type: 'SET_WINNER'; winner: PlayerRole; message: string }
  | { type: 'NEW_GAME' };

// --- Stats ---

export interface GameStats {
  totalGames: number;
  humanWins: number;
  aiWins: number;
  humanWinsAsWolf: number;
  humanWinsAsDog: number;
  aiWinsAsWolf: number;
  aiWinsAsDog: number;
}

// --- Win Condition ---

export type GameResult =
  | { isOver: false }
  | { isOver: true; winner: PlayerRole; reason: WinReason };

export type WinReason =
  | 'wolfTrapped'
  | 'wolfBrokeThrough'
  | 'dogsCannotMove';

