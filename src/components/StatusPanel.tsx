import type { GameState } from '../types/game';

interface StatusPanelProps {
  state: GameState;
}

export function StatusPanel({ state }: StatusPanelProps) {
  const { message, isAiTurn, currentPlayer, phase } = state;

  const panelClass = [
    'status-panel',
    isAiTurn && phase === 'playing' ? 'status-panel--ai-thinking' : '',
    !isAiTurn && currentPlayer === 'wolfPlayer' && phase === 'playing'
      ? 'status-panel--wolf-turn'
      : '',
    !isAiTurn && currentPlayer === 'dogPlayer' && phase === 'playing'
      ? 'status-panel--dog-turn'
      : '',
    message.startsWith('❌') ? 'status-panel--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={panelClass}>
      <span>
        {message}
        {isAiTurn && phase !== 'gameOver' && phase !== 'menu' && (
          <span className="thinking-dots" />
        )}
      </span>
    </div>
  );
}

