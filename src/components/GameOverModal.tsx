import type { PlayerRole, GameStats } from '../types/game';
import { StatsDisplay } from './StatsDisplay';
import { DIFFICULTY_LEVELS, getDifficultyById } from '../ai/difficulty';

interface GameOverModalProps {
  winner: PlayerRole;
  humanRole: PlayerRole;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  stats: GameStats;
  previousHighestLevel: number;
}

export function GameOverModal({
  winner,
  humanRole,
  onPlayAgain,
  onMainMenu,
  stats,
  previousHighestLevel,
}: GameOverModalProps) {
  const humanWon = winner === humanRole;

  // Check if a new level was unlocked
  const newLevelUnlocked = stats.highestUnlockedLevel > previousHighestLevel;
  const unlockedLevel = newLevelUnlocked
    ? getDifficultyById(stats.highestUnlockedLevel)
    : null;

  // Next level info
  const nextLevel = DIFFICULTY_LEVELS.find((l) => l.id === stats.highestUnlockedLevel + 1);

  // Generate confetti elements for victory
  const confetti = humanWon
    ? Array.from({ length: 20 }, (_, i) => {
        const colors = ['#F4D03F', '#C0392B', '#1A6B5A', '#D4A017', '#5B7FA5', '#C97B84'];
        const color = colors[i % colors.length];
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const size = 8 + Math.random() * 8;
        return (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: i % 3 === 0 ? '50%' : '2px',
            }}
          />
        );
      })
    : null;

  return (
    <div className="game-over-overlay">
      {confetti}
      <div className="game-over-modal">
        {humanWon && <div className="game-over-modal__stars">⭐ ⭐ ⭐</div>}

        <div
          className={`game-over-modal__result ${
            humanWon
              ? 'game-over-modal__result--win'
              : 'game-over-modal__result--lose'
          }`}
        >
          {humanWon ? '🎉 VICTORY!' : '💀 DEFEATED!'}
        </div>

        <div className="game-over-modal__reason">
          {humanWon
            ? 'You win! Congratulations!'
            : 'AI wins! Better luck next time!'}
        </div>

        {/* Level up notification */}
        {newLevelUnlocked && unlockedLevel && (
          <div className="game-over-modal__level-up">
            <span className="game-over-modal__level-up-text">
              🎉 New level unlocked: {unlockedLevel.name} {unlockedLevel.icon}!
            </span>
          </div>
        )}

        {/* Next level progress */}
        {nextLevel && (
          <div className="game-over-modal__next-level">
            Next: {nextLevel.icon} {nextLevel.name} – need {nextLevel.winsToUnlock} total wins
          </div>
        )}

        {!nextLevel && (
          <div className="game-over-modal__next-level game-over-modal__next-level--max">
            🏰 You've reached the top of the beanstalk!
          </div>
        )}

        <StatsDisplay stats={stats} />

        <div className="game-over-modal__actions">
          <button className="btn btn--gold" onClick={onPlayAgain}>
            🔄 Play Again
          </button>
          <button className="btn btn--small" onClick={onMainMenu}>
            🏠 Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}
