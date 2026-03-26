import type { EvalWeights } from '../types/ai';
import type { LearningData } from '../types/ai';
import { DEFAULT_WEIGHTS, computeEvalComponents, evaluatePosition } from './evaluation';
import type { GameState, PlayerRole } from '../types/game';

const LEARNING_STORAGE_KEY = 'wolfs-vs-dog-ai-learning';
const CURRENT_VERSION = 1;
const MAX_POSITION_HISTORY = 500;

/** Get default learning data */
export function getDefaultLearningData(): LearningData {
  return {
    version: CURRENT_VERSION,
    gamesPlayed: 0,
    weights: { ...DEFAULT_WEIGHTS },
    positionHistory: [],
  };
}

/** Load learning data from localStorage */
export function loadLearningData(): LearningData {
  try {
    const raw = localStorage.getItem(LEARNING_STORAGE_KEY);
    if (!raw) return getDefaultLearningData();

    const parsed = JSON.parse(raw) as LearningData;
    if (parsed.version !== CURRENT_VERSION) return getDefaultLearningData();
    return parsed;
  } catch {
    return getDefaultLearningData();
  }
}

/** Save learning data to localStorage */
export function saveLearningData(data: LearningData): void {
  try {
    localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable – silently fail
  }
}

/** Update weights after a game based on the result */
export function updateWeightsAfterGame(
  learningData: LearningData,
  gameHistory: GameState[],
  result: 'wolfWin' | 'dogWin',
  aiRole: PlayerRole
): LearningData {
  const learningRate = Math.max(
    0.01,
    0.1 / Math.sqrt(learningData.gamesPlayed + 1)
  );
  const aiWon =
    (aiRole === 'wolfPlayer' && result === 'wolfWin') ||
    (aiRole === 'dogPlayer' && result === 'dogWin');

  const newWeights: EvalWeights = { ...learningData.weights };

  // Update weights based on game positions
  const statesToAnalyze = gameHistory.filter((s) => s.wolf !== null);
  const sampleSize = Math.min(statesToAnalyze.length, 20);
  const step = Math.max(1, Math.floor(statesToAnalyze.length / sampleSize));

  for (let i = 0; i < statesToAnalyze.length; i += step) {
    const state = statesToAnalyze[i];
    const currentEval = evaluatePosition(state, learningData.weights);
    const targetEval = aiWon ? currentEval : -currentEval * 0.5;
    const error = targetEval - currentEval;

    const components = computeEvalComponents(state);

    for (const key of Object.keys(components) as (keyof EvalWeights)[]) {
      const component = components[key];
      newWeights[key] += learningRate * error * component;
      // Clamp weights
      newWeights[key] = Math.max(-20, Math.min(20, newWeights[key]));
    }
  }

  // Update position memory (ring buffer)
  const newHistory = [...learningData.positionHistory];
  const positionsToRemember = statesToAnalyze.filter((_, i) => i % step === 0).slice(0, 10);

  for (const state of positionsToRemember) {
    const hash = simpleHash(state);
    const existing = newHistory.find((p) => p.hash === hash);
    if (existing) {
      existing.visits += 1;
      existing.result = result;
      existing.score = evaluatePosition(state, newWeights);
    } else {
      if (newHistory.length >= MAX_POSITION_HISTORY) {
        newHistory.shift();
      }
      newHistory.push({
        hash,
        score: evaluatePosition(state, newWeights),
        result,
        visits: 1,
      });
    }
  }

  return {
    version: CURRENT_VERSION,
    gamesPlayed: learningData.gamesPlayed + 1,
    weights: newWeights,
    positionHistory: newHistory,
  };
}

/** Simple string hash for position memory */
function simpleHash(state: GameState): string {
  const wolfPos = state.wolf
    ? `w${state.wolf.position.row}${state.wolf.position.col}`
    : 'w--';
  const dogPos = state.dogs
    .map((d) => `d${d.position.row}${d.position.col}`)
    .sort()
    .join('');
  return `${wolfPos}${dogPos}${state.currentPlayer[0]}`;
}

