import type { GameStats } from '../types/game';

interface StatsDisplayProps {
  stats: GameStats;
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  if (stats.totalGames === 0) {
    return (
      <div className="stats">
        <div className="stats__title">📊 Stats</div>
        <div className="stats__row">
          <span className="stats__label">No games played yet!</span>
        </div>
      </div>
    );
  }

  const winRate =
    stats.totalGames > 0
      ? Math.round((stats.humanWins / stats.totalGames) * 100)
      : 0;

  return (
    <div className="stats">
      <div className="stats__title">📊 Stats</div>

      <div className="stats__row">
        <span className="stats__label">Total Games</span>
        <span className="stats__value">{stats.totalGames}</span>
      </div>
      <div className="stats__row">
        <span className="stats__label">Your Wins</span>
        <span className="stats__value">{stats.humanWins}</span>
      </div>
      <div className="stats__row">
        <span className="stats__label">AI Wins</span>
        <span className="stats__value">{stats.aiWins}</span>
      </div>

      <hr className="stats__divider" />

      <div className="stats__row">
        <span className="stats__label">🐺 Won as Wolf</span>
        <span className="stats__value">{stats.humanWinsAsWolf}</span>
      </div>
      <div className="stats__row">
        <span className="stats__label">🐶 Won as Dogs</span>
        <span className="stats__value">{stats.humanWinsAsDog}</span>
      </div>

      <div className="stats__winrate">Win Rate: {winRate}%</div>
    </div>
  );
}

