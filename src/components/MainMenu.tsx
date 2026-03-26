import type { PlayerRole, GameStats } from '../types/game';
import { StatsDisplay } from './StatsDisplay';

interface MainMenuProps {
  onSelectRole: (role: PlayerRole) => void;
  stats: GameStats;
}

export function MainMenu({ onSelectRole, stats }: MainMenuProps) {
  return (
    <div className="main-menu">
      <div className="main-menu__emojis">🐺 ⚔️ 🐶</div>
      <h1 className="main-menu__title">Wolfs vs Dog</h1>
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

