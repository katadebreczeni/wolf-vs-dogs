import type { PieceType } from '../types/game';

interface PieceProps {
  type: PieceType;
  isSelected: boolean;
  isAiPiece: boolean;
  justMoved: boolean;
}

export function Piece({ type, isSelected, isAiPiece, justMoved }: PieceProps) {
  const classNames = [
    'piece',
    type === 'wolf' ? 'piece--wolf' : 'piece--dog',
    isSelected ? 'piece--selected' : '',
    isAiPiece ? 'piece--ai' : '',
    justMoved ? 'piece--just-moved' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const emoji = type === 'wolf' ? '🐺' : '🐶';

  return (
    <div className={classNames}>
      <span className="piece__emoji">{emoji}</span>
    </div>
  );
}

