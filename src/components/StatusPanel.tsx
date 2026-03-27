import type { GameState } from '../types/game';
import { getDifficultyById } from '../ai/difficulty';

interface StatusPanelProps {
  state: GameState;
}

export function StatusPanel({ state }: StatusPanelProps) {
  const { message, isAiTurn, currentPlayer, phase, difficultyLevel } = state;
  const difficulty = getDifficultyById(difficultyLevel);

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
      {phase !== 'menu' && (
        <span className="status-panel__level" title={`AI: ${difficulty.name}`}>
          {difficulty.icon}
        </span>
      )}
      <span>
        {message}
        {isAiTurn && phase !== 'gameOver' && phase !== 'menu' && (
          <span className="thinking-dots" />
        )}
      </span>
    </div>
  );
}
