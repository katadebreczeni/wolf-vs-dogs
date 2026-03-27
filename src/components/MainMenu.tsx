import type { PlayerRole, GameStats } from '../types/game';
import { StatsDisplay } from './StatsDisplay';
import { DifficultySelector } from './DifficultySelector';

interface MainMenuProps {
  onSelectRole: (role: PlayerRole) => void;
  onSelectDifficulty: (level: number) => void;
  stats: GameStats;
}

export function MainMenu({ onSelectRole, onSelectDifficulty, stats }: MainMenuProps) {
  return (
    <div className="main-menu">
      <div className="main-menu__emojis">🐺 ⚔️ 🐶</div>
      <h1 className="main-menu__title">Wolfs vs Dog</h1>

      <DifficultySelector
        currentLevel={stats.selectedLevel}
        totalWins={stats.humanWins}
        onSelect={onSelectDifficulty}
      />

      <p className="main-menu__subtitle">Choose your side:</p>

      <div className="main-menu__buttons">
        <button
          className="btn btn--wolf main-menu__role-btn"
          onClick={() => onSelectRole('wolfPlayer')}
        >
          🐺 Play as Wolf
        </button>
        <button
          className="btn btn--dog main-menu__role-btn"
          onClick={() => onSelectRole('dogPlayer')}
        >
          🐶 Play as Dogs
        </button>
      </div>

      <div className="main-menu__stats">
        <StatsDisplay stats={stats} />
      </div>
    </div>
  );
}
