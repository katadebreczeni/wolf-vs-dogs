import type { ReactNode } from 'react';

interface SquareProps {
  row: number;
  col: number;
  isDark: boolean;
  isSelected: boolean;
  isValidTarget: boolean;
  isLastMove: boolean;
  isLastMoveAi: boolean;
  isClickable: boolean;
  isSetupTarget: boolean;
  onClick: (row: number, col: number) => void;
  children?: ReactNode;
}

export function Square({
  row,
  col,
  isDark,
  isSelected,
  isValidTarget,
  isLastMove,
  isLastMoveAi,
  isClickable,
  isSetupTarget,
  onClick,
  children,
}: SquareProps) {
  const classNames = [
    'square',
    isDark ? 'square--dark' : 'square--light',
    isSelected ? 'square--selected' : '',
    isValidTarget ? 'square--valid-target' : '',
    isLastMove && !isLastMoveAi ? 'square--last-move' : '',
    isLastMoveAi ? 'square--last-move-ai' : '',
    isClickable ? 'square--clickable' : '',
    isSetupTarget ? 'square--setup-target' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classNames}
      data-row={row}
      data-col={col}
      onClick={() => onClick(row, col)}
    >
      {children}
    </div>
  );
}

