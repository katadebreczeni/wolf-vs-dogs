import { useState, useCallback } from 'react';
import type { GameStats, PlayerRole } from '../types/game';
import { getHighestUnlockedLevel } from '../ai/difficulty';

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
    highestUnlockedLevel: 1,
    selectedLevel: 1,
  };
}

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return getDefaultStats();
    const parsed = JSON.parse(raw) as GameStats;
    // Ensure new fields have defaults for backwards compatibility
    if (!parsed.highestUnlockedLevel) parsed.highestUnlockedLevel = 1;
    if (!parsed.selectedLevel) parsed.selectedLevel = 1;
    // Ensure selectedLevel doesn't exceed unlocked
    if (parsed.selectedLevel > parsed.highestUnlockedLevel) {
      parsed.selectedLevel = parsed.highestUnlockedLevel;
    }
    return parsed;
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
        const newHumanWins = prev.humanWins + (humanWon ? 1 : 0);
        const newHighest = getHighestUnlockedLevel(newHumanWins);
        const newStats: GameStats = {
          totalGames: prev.totalGames + 1,
          humanWins: newHumanWins,
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
          highestUnlockedLevel: newHighest.id,
          selectedLevel: prev.selectedLevel,
        };
        saveStats(newStats);
        return newStats;
      });
    },
    []
  );

  const setSelectedLevel = useCallback((level: number) => {
    setStats((prev) => {
      const clamped = Math.min(level, prev.highestUnlockedLevel);
      const newStats = { ...prev, selectedLevel: clamped };
      saveStats(newStats);
      return newStats;
    });
  }, []);

  return { stats, recordGame, setSelectedLevel };
}
