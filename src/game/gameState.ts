import type { GameState, GameAction, Dog } from '../types/game';
import { INITIAL_DOGS, createWolf, isDarkSquare, isOccupied } from './board';
import { getValidMoves } from './moves';
import { checkGameResult } from './winCondition';

/** Initial game state */
export const INITIAL_STATE: GameState = {
  phase: 'menu',
  humanRole: null,
  currentPlayer: 'wolfPlayer',
  wolf: null,
  dogs: INITIAL_DOGS.map((d) => ({ ...d, position: { ...d.position } })),
  selectedPieceId: null,
  validMoves: [],
  winner: null,
  message: 'Choose your side!',
  isAiTurn: false,
  lastMove: null,
};

function freshDogs(): Dog[] {
  return INITIAL_DOGS.map((d) => ({ ...d, position: { ...d.position } }));
}

/** Main game reducer */
export function gameReducer(
  state: GameState,
  action: GameAction
): GameState {
  switch (action.type) {
    // ── ROLE SELECTION ──────────────────────────────────────
    case 'SELECT_ROLE': {
      const humanRole = action.role;
      const isHumanWolf = humanRole === 'wolfPlayer';
      return {
        ...state,
        phase: 'setup',
        humanRole,
        currentPlayer: 'wolfPlayer',
        wolf: null,
        dogs: freshDogs(),
        selectedPieceId: null,
        validMoves: [],
        winner: null,
        lastMove: null,
        isAiTurn: !isHumanWolf,
        message: isHumanWolf
          ? '🐺 Place your wolf on any dark square!'
          : '🤔 AI is placing the wolf...',
      };
    }

    // ── WOLF PLACEMENT (HUMAN) ──────────────────────────────
    case 'PLACE_WOLF': {
      const { position } = action;

      // Validate placement
      if (!isDarkSquare(position)) {
        return {
          ...state,
          message:
            '❌ Invalid placement! You can only place the wolf on a dark square.',
        };
      }
      if (position.row < 1) {
        return {
          ...state,
          message:
            "❌ Invalid placement! The wolf cannot be placed on the dogs' starting row.",
        };
      }
      if (isOccupied(position, state)) {
        return {
          ...state,
          message:
            '❌ Invalid placement! This square is already occupied.',
        };
      }

      const wolf = createWolf(position);
      const newState: GameState = {
        ...state,
        phase: 'playing',
        wolf,
        currentPlayer: 'dogPlayer',
        selectedPieceId: null,
        validMoves: [],
        lastMove: null,
      };

      // Dog player is AI?
      const aiIsDog = state.humanRole === 'wolfPlayer';
      newState.isAiTurn = aiIsDog;
      newState.message = aiIsDog
        ? '🤔 AI is thinking...'
        : '🐶 Your turn – select a dog to move.';

      return newState;
    }

    // ── WOLF PLACEMENT (AI) ─────────────────────────────────
    case 'AI_PLACE_WOLF': {
      const wolf = createWolf(action.position);
      return {
        ...state,
        phase: 'playing',
        wolf,
        currentPlayer: 'dogPlayer',
        selectedPieceId: null,
        validMoves: [],
        lastMove: null,
        isAiTurn: state.humanRole === 'wolfPlayer',
        message:
          state.humanRole === 'dogPlayer'
            ? '🐶 Your turn – select a dog to move.'
            : '🤔 AI is thinking...',
      };
    }

    // ── SELECT PIECE ────────────────────────────────────────
    case 'SELECT_PIECE': {
      if (state.isAiTurn || state.phase !== 'playing') return state;

      const { pieceId } = action;
      const isHumanWolf = state.humanRole === 'wolfPlayer';
      const isHumanDog = state.humanRole === 'dogPlayer';

      // Find the piece
      let piece = null;
      if (pieceId === 'wolf' && state.wolf) {
        piece = state.wolf;
      } else {
        piece = state.dogs.find((d) => d.id === pieceId) ?? null;
      }

      if (!piece) return state;

      // Check ownership
      const isWolfPiece = piece.type === 'wolf';
      const ownsThisPiece =
        (isHumanWolf && isWolfPiece) || (isHumanDog && !isWolfPiece);

      if (!ownsThisPiece) {
        return {
          ...state,
          message: "❌ That's not your piece!",
        };
      }

      // It's the right player's turn?
      const currentPlayerOwns =
        (state.currentPlayer === 'wolfPlayer' && isWolfPiece) ||
        (state.currentPlayer === 'dogPlayer' && !isWolfPiece);

      if (!currentPlayerOwns) {
        return {
          ...state,
          message: "❌ It's not your turn to move that piece!",
        };
      }

      const validMoves = getValidMoves(piece, state);

      return {
        ...state,
        selectedPieceId: pieceId,
        validMoves,
        message: 'Selected! Click a highlighted square to move.',
      };
    }

    // ── DESELECT PIECE ──────────────────────────────────────
    case 'DESELECT_PIECE': {
      const isHumanWolf = state.humanRole === 'wolfPlayer';
      return {
        ...state,
        selectedPieceId: null,
        validMoves: [],
        message: isHumanWolf
          ? '🐺 Your turn – select the wolf to move.'
          : '🐶 Your turn – select a dog to move.',
      };
    }

    // ── MOVE PIECE (HUMAN) ──────────────────────────────────
    case 'MOVE_PIECE': {
      const { to } = action;

      if (!state.selectedPieceId) {
        return { ...state, message: '❌ Select a piece first!' };
      }

      // Check if target is a valid move
      const isValid = state.validMoves.some(
        (m) => m.row === to.row && m.col === to.col
      );

      if (!isValid) {
        return { ...state, message: '❌ Invalid move! Try again.' };
      }

      // Find the piece and its current position
      let fromPos = { row: 0, col: 0 };
      let newState = { ...state };

      if (state.selectedPieceId === 'wolf' && state.wolf) {
        fromPos = { ...state.wolf.position };
        newState.wolf = { ...state.wolf, position: { ...to } };
      } else {
        const dogIndex = state.dogs.findIndex(
          (d) => d.id === state.selectedPieceId
        );
        if (dogIndex >= 0) {
          fromPos = { ...state.dogs[dogIndex].position };
          newState.dogs = state.dogs.map((d, i) =>
            i === dogIndex ? { ...d, position: { ...to } } : d
          );
        }
      }

      newState.lastMove = { from: fromPos, to: { ...to }, by: 'human' };
      newState.selectedPieceId = null;
      newState.validMoves = [];
      newState.currentPlayer =
        state.currentPlayer === 'wolfPlayer' ? 'dogPlayer' : 'wolfPlayer';

      // Check win condition
      const result = checkGameResult(newState);
      if (result.isOver) {
        const humanWon = result.winner === state.humanRole;
        newState.phase = 'gameOver';
        newState.winner = result.winner;
        newState.isAiTurn = false;
        newState.message = humanWon
          ? '🎉 You win! Congratulations!'
          : '💀 AI wins! Better luck next time!';
      } else {
        newState.isAiTurn = true;
        newState.message = '🤔 AI is thinking...';
      }

      return newState;
    }

    // ── AI MOVE ─────────────────────────────────────────────
    case 'AI_MOVE': {
      const { from, to } = action;
      let newState = { ...state };

      // Find and move the piece at 'from'
      if (
        state.wolf &&
        state.wolf.position.row === from.row &&
        state.wolf.position.col === from.col
      ) {
        newState.wolf = { ...state.wolf, position: { ...to } };
      } else {
        newState.dogs = state.dogs.map((d) =>
          d.position.row === from.row && d.position.col === from.col
            ? { ...d, position: { ...to } }
            : d
        );
      }

      newState.lastMove = { from: { ...from }, to: { ...to }, by: 'ai' };
      newState.selectedPieceId = null;
      newState.validMoves = [];
      newState.currentPlayer =
        state.currentPlayer === 'wolfPlayer' ? 'dogPlayer' : 'wolfPlayer';

      // Check win condition
      const result = checkGameResult(newState);
      if (result.isOver) {
        const humanWon = result.winner === state.humanRole;
        newState.phase = 'gameOver';
        newState.winner = result.winner;
        newState.isAiTurn = false;
        newState.message = humanWon
          ? '🎉 You win! Congratulations!'
          : '💀 AI wins! Better luck next time!';
      } else {
        newState.isAiTurn = false;
        const isHumanWolf = state.humanRole === 'wolfPlayer';
        newState.message = isHumanWolf
          ? '🐺 Your turn – select the wolf to move.'
          : '🐶 Your turn – select a dog to move.';
      }

      return newState;
    }

    // ── SET WINNER (external check) ─────────────────────────
    case 'SET_WINNER': {
      return {
        ...state,
        phase: 'gameOver',
        winner: action.winner,
        isAiTurn: false,
        message: action.message,
      };
    }

    // ── INVALID ACTION ──────────────────────────────────────
    case 'INVALID_ACTION': {
      return {
        ...state,
        message: action.message,
      };
    }

    // ── NEW GAME ────────────────────────────────────────────
    case 'NEW_GAME': {
      return {
        ...INITIAL_STATE,
        dogs: freshDogs(),
      };
    }

    default:
      return state;
  }
}

