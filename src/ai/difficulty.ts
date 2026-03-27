import type { DifficultyLevel } from '../types/ai';

/** All 5 difficulty levels – from beginner to master */
export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    id: 1, name: 'Seedling', icon: '🌱',
    maxDepth: 1, maxTimeMs: 500, blunderChance: 0.6,
    useTranspositionTable: false, useMoveSorting: false, useLearning: false,
    winsToUnlock: 0, beanstalkStage: 0,
  },
  {
    id: 2, name: 'Sprout', icon: '🌿',
    maxDepth: 3, maxTimeMs: 800, blunderChance: 0.35,
    useTranspositionTable: false, useMoveSorting: false, useLearning: false,
    winsToUnlock: 3, beanstalkStage: 1,
  },
  {
    id: 3, name: 'Sapling', icon: '🌳',
    maxDepth: 5, maxTimeMs: 1200, blunderChance: 0.15,
    useTranspositionTable: true, useMoveSorting: false, useLearning: false,
    winsToUnlock: 8, beanstalkStage: 2,
  },
  {
    id: 4, name: 'Tree', icon: '🌲',
    maxDepth: 8, maxTimeMs: 1800, blunderChance: 0.05,
    useTranspositionTable: true, useMoveSorting: true, useLearning: true,
    winsToUnlock: 15, beanstalkStage: 3,
  },
  {
    id: 5, name: 'Giant', icon: '🏰',
    maxDepth: 12, maxTimeMs: 2500, blunderChance: 0.0,
    useTranspositionTable: true, useMoveSorting: true, useLearning: true,
    winsToUnlock: 25, beanstalkStage: 4,
  },
];

/** Get a difficulty level by its id (1-5) */
export function getDifficultyById(id: number): DifficultyLevel {
  const level = DIFFICULTY_LEVELS.find((l) => l.id === id);
  return level ?? DIFFICULTY_LEVELS[0];
}

/** Get all levels that are unlocked given a total win count */
export function getUnlockedLevels(totalWins: number): DifficultyLevel[] {
  return DIFFICULTY_LEVELS.filter((l) => l.winsToUnlock <= totalWins);
}

/** Get the highest level unlocked by a given win count */
export function getHighestUnlockedLevel(totalWins: number): DifficultyLevel {
  const unlocked = getUnlockedLevels(totalWins);
  return unlocked[unlocked.length - 1];
}

/** Get the wins needed for the next level, or null if already at max */
export function getNextLevelUnlockWins(
  currentLevelId: number,
  totalWins: number
): number | null {
  const nextLevel = DIFFICULTY_LEVELS.find((l) => l.id === currentLevelId + 1);
  if (!nextLevel) return null;
  return Math.max(0, nextLevel.winsToUnlock - totalWins);
}

/** Check if a specific level is unlocked */
export function isLevelUnlocked(levelId: number, totalWins: number): boolean {
  const level = getDifficultyById(levelId);
  return level.winsToUnlock <= totalWins;
}

