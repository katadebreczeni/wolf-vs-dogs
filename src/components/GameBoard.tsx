import { useCallback } from 'react';
import type { GameState, GameAction, Position } from '../types/game';
import { isDarkSquare } from '../game/board';
import { Square } from './Square';
import { Piece } from './Piece';

interface GameBoardProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const COL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ROW_LABELS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export function GameBoard({ state, dispatch }: GameBoardProps) {
  const {
    phase,
    wolf,
    dogs,
    selectedPieceId,
    validMoves,
    isAiTurn,
    lastMove,
    humanRole,
  } = state;

  const isHumanWolf = humanRole === 'wolfPlayer';

  // ── Click handler ──────────────────────────────────
  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (isAiTurn) return;

      // SETUP phase: human places wolf
      if (phase === 'setup' && isHumanWolf) {
        dispatch({ type: 'PLACE_WOLF', position: { row, col } });
        return;
      }

      // PLAYING phase
      if (phase !== 'playing') return;

      // Find piece at this position
      const pieceAtPos = findPieceAt(row, col);

      if (selectedPieceId) {
        // Already have a selected piece

        // Clicked on a valid move target?
        const isValidTarget = validMoves.some(
          (m) => m.row === row && m.col === col
        );
        if (isValidTarget) {
          dispatch({ type: 'MOVE_PIECE', to: { row, col } });
          return;
        }

        // Clicked on the same piece? Deselect
        if (pieceAtPos && pieceAtPos.id === selectedPieceId) {
          dispatch({ type: 'DESELECT_PIECE' });
          return;
        }

        // Clicked on another own piece? Switch selection
        if (pieceAtPos && isOwnPiece(pieceAtPos.id)) {
          dispatch({ type: 'SELECT_PIECE', pieceId: pieceAtPos.id });
          return;
        }

        // Invalid move
        dispatch({
          type: 'INVALID_ACTION',
          message: '❌ Invalid move! Try again.',
        });
      } else {
        // No piece selected yet
        if (!pieceAtPos) {
          dispatch({
            type: 'INVALID_ACTION',
            message: '❌ Select a piece first!',
          });
          return;
        }

        if (!isOwnPiece(pieceAtPos.id)) {
          dispatch({
            type: 'INVALID_ACTION',
            message: "❌ That's not your piece!",
          });
          return;
        }

        dispatch({ type: 'SELECT_PIECE', pieceId: pieceAtPos.id });
      }
    },
    [phase, isAiTurn, isHumanWolf, selectedPieceId, validMoves, dispatch, wolf, dogs, humanRole]
  );

  // ── Helpers ────────────────────────────────────────
  function findPieceAt(row: number, col: number) {
    if (wolf && wolf.position.row === row && wolf.position.col === col) {
      return wolf;
    }
    return dogs.find(
      (d) => d.position.row === row && d.position.col === col
    ) ?? null;
  }

  function isOwnPiece(pieceId: string): boolean {
    if (isHumanWolf) return pieceId === 'wolf';
    return pieceId.startsWith('dog');
  }

  function isValidTarget(pos: Position): boolean {
    return validMoves.some((m) => m.row === pos.row && m.col === pos.col);
  }

  function isLastMoveSquare(row: number, col: number): boolean {
    if (!lastMove) return false;
    return (
      (lastMove.from.row === row && lastMove.from.col === col) ||
      (lastMove.to.row === row && lastMove.to.col === col)
    );
  }

  function isLastMoveAiSquare(row: number, col: number): boolean {
    if (!lastMove || lastMove.by !== 'ai') return false;
    return (
      (lastMove.from.row === row && lastMove.from.col === col) ||
      (lastMove.to.row === row && lastMove.to.col === col)
    );
  }

  function isJustMoved(row: number, col: number): boolean {
    if (!lastMove) return false;
    return lastMove.to.row === row && lastMove.to.col === col;
  }

  // ── Render ─────────────────────────────────────────
  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const dark = isDarkSquare({ row, col });
      const piece = findPieceAt(row, col);
      const selected = piece ? piece.id === selectedPieceId : false;
      const validTarget = dark && isValidTarget({ row, col });
      const lastMv = isLastMoveSquare(row, col);
      const lastMvAi = isLastMoveAiSquare(row, col);
      const isSetup = phase === 'setup' && isHumanWolf && dark && row >= 1 && !piece;

      const isClickable =
        dark &&
        !isAiTurn &&
        (phase === 'playing' || (phase === 'setup' && isHumanWolf));

      squares.push(
        <Square
          key={`${row}-${col}`}
          row={row}
          col={col}
          isDark={dark}
          isSelected={selected}
          isValidTarget={validTarget}
          isLastMove={lastMv}
          isLastMoveAi={lastMvAi}
          isClickable={isClickable}
          isSetupTarget={isSetup}
          onClick={handleSquareClick}
        >
          {piece && (
            <Piece
              type={piece.type}
              isSelected={selected}
              isAiPiece={!isOwnPiece(piece.id)}
              justMoved={isJustMoved(row, col)}
            />
          )}
        </Square>
      );
    }
  }

  const boardClass = ['board', isAiTurn ? 'board--ai-turn' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className="board-wrapper">
      {/* Role display */}
      <div className="role-display">
        You: {isHumanWolf ? '🐺 Wolf' : '🐶 Dogs'} &nbsp;|&nbsp; AI:{' '}
        {isHumanWolf ? '🐶 Dogs' : '🐺 Wolf'}
      </div>

      {/* Column labels top */}
      <div className="board-labels-col">
        {COL_LABELS.map((label) => (
          <span key={label} className="board-labels-col__label">
            {label}
          </span>
        ))}
      </div>

      {/* Board with row labels */}
      <div className="board-with-rows">
        <div className="board-labels-row">
          {ROW_LABELS.map((label) => (
            <span key={label} className="board-labels-row__label">
              {label}
            </span>
          ))}
        </div>

        <div className={boardClass}>{squares}</div>
      </div>
    </div>
  );
}

