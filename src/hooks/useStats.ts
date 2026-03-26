import { useState, useCallback } from 'react';
import type { GameStats, PlayerRole } from '../types/game';

const STATS_STORAGE_KEY = 'wolfs-vs-dog-stats';

function getDefaultStats(): GameStats {
  return {
    totalGames: 0,
    humanWins: 0,
    aiWins: 0,
    humanWinsAsWolf: 0,
    humanWinsAsDog: 0,
    aiWinsAsWolf: 0,
    aiWinsAsDog: 0,
  };
}

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return getDefaultStats();
    return JSON.parse(raw) as GameStats;
  } catch {
    return getDefaultStats();
  }
}

function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // silently fail
  }
}

export function useStats() {
  const [stats, setStats] = useState<GameStats>(loadStats);

  const recordGame = useCallback(
    (winner: PlayerRole, humanRole: PlayerRole) => {
      setStats((prev) => {
        const humanWon = winner === humanRole;
        const newStats: GameStats = {
          totalGames: prev.totalGames + 1,
          humanWins: prev.humanWins + (humanWon ? 1 : 0),
          aiWins: prev.aiWins + (humanWon ? 0 : 1),
          humanWinsAsWolf:
            prev.humanWinsAsWolf +
            (humanWon && humanRole === 'wolfPlayer' ? 1 : 0),
          humanWinsAsDog:
            prev.humanWinsAsDog +
            (humanWon && humanRole === 'dogPlayer' ? 1 : 0),
          aiWinsAsWolf:
            prev.aiWinsAsWolf +
            (!humanWon && humanRole === 'dogPlayer' ? 1 : 0),
          aiWinsAsDog:
            prev.aiWinsAsDog +
            (!humanWon && humanRole === 'wolfPlayer' ? 1 : 0),
        };
        saveStats(newStats);
        return newStats;
      });
    },
    []
  );

  return { stats, recordGame };
}

