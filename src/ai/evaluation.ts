import type { GameState } from '../types/game';
import type { EvalWeights, EvalScore, EvalComponents } from '../types/ai';
import { getValidMoves } from '../game/moves';

/** Default evaluation weights (starting point for learning) */
export const DEFAULT_WEIGHTS: EvalWeights = {
  wolfMobility: 3.0,
  dogMobility: 1.5,
  wolfRowAdvance: 4.0,
  dogFormation: 2.5,
  wolfDistanceToDogs: 1.0,
  wolfEscapeRoutes: 5.0,
  dogCoverage: 2.0,
  wolfTrappedPenalty: 1.0,
  centerControlWolf: 1.5,
  centerControlDogs: 1.0,
};

/**
 * Compute raw evaluation components (before weighting).
 * Used both for evaluation and for learning updates.
 */
export function computeEvalComponents(state: GameState): EvalComponents {
  const wolf = state.wolf!;
  const dogs = state.dogs;

  // Wolf mobility (0-4)
  const wolfMobility = getValidMoves(wolf, state).length;

  // Dog total mobility (0-8)
  const dogMobility = dogs.reduce(
    (sum, d) => sum + getValidMoves(d, state).length,
    0
  );

  // Wolf row progress (7 = worst, 0 = best for wolf)
  const wolfRowAdvance = 7 - wolf.position.row;

  // Dog formation: std deviation of dog rows (lower = tighter wall)
  const dogRows = dogs.map((d) => d.position.row);
  const avgDogRow = dogRows.reduce((a, b) => a + b, 0) / 4;
  const dogFormation = Math.sqrt(
    dogRows.reduce((sum, r) => sum + (r - avgDogRow) ** 2, 0) / 4
  );

  // Wolf escape routes: diagonals leading behind all dogs
  const minDogRow = Math.min(...dogRows);
  const escapeRoutes = countEscapeRoutes(wolf.position.row, wolf.position.col, minDogRow, state);

  // Dog column coverage
  const coveredColumns = new Set(dogs.map((d) => d.position.col)).size;

  // Wolf trapped penalty
  const trappedPenalty =
    wolfMobility === 0 ? -100 : wolfMobility === 1 ? -30 : 0;

  // Center control (columns 2-5)
  const centerControlWolf =
    wolf.position.col >= 2 && wolf.position.col <= 5 ? 1 : 0;
  const centerControlDogs = dogs.filter(
    (d) => d.position.col >= 2 && d.position.col <= 5
  ).length;

  // Distance from wolf to dogs (average manhattan-ish)
  const wolfDistanceToDogs =
    dogs.reduce(
      (sum, d) =>
        sum +
        Math.abs(wolf.position.row - d.position.row) +
        Math.abs(wolf.position.col - d.position.col),
      0
    ) / dogs.length;

  return {
    wolfMobility,
    dogMobility,
    wolfRowAdvance,
    dogFormation,
    wolfDistanceToDogs,
    wolfEscapeRoutes: escapeRoutes,
    dogCoverage: coveredColumns,
    wolfTrappedPenalty: trappedPenalty,
    centerControlWolf,
    centerControlDogs,
  };
}

/** Count escape routes: free diagonal paths that lead behind all dogs */
function countEscapeRoutes(
  wolfRow: number,
  wolfCol: number,
  minDogRow: number,
  state: GameState
): number {
  let routes = 0;
  const directions: [number, number][] = [
    [-1, -1],
    [-1, 1],
  ];

  for (const [dr, dc] of directions) {
    let r = wolfRow + dr;
    let c = wolfCol + dc;
    let blocked = false;

    while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
      if (
        state.dogs.some(
          (d) => d.position.row === r && d.position.col === c
        )
      ) {
        blocked = true;
        break;
      }
      if (r <= minDogRow) {
        routes++;
        break;
      }
      r += dr;
      c += dc;
    }

    if (!blocked && r < 0) {
      routes++;
    }
  }

  return routes;
}

/**
 * Evaluate a board position.
 * Positive = good for wolf, Negative = good for dogs.
 */
export function evaluatePosition(
  state: GameState,
  weights: EvalWeights
): EvalScore {
  if (!state.wolf) return 0;

  const c = computeEvalComponents(state);

  return (
    weights.wolfMobility * c.wolfMobility +
    weights.dogMobility * -c.dogMobility +
    weights.wolfRowAdvance * c.wolfRowAdvance +
    weights.dogFormation * (-1 / (c.dogFormation + 0.1)) +
    weights.wolfEscapeRoutes * c.wolfEscapeRoutes +
    weights.dogCoverage * -c.dogCoverage +
    weights.wolfTrappedPenalty * c.wolfTrappedPenalty +
    weights.centerControlWolf * c.centerControlWolf +
    weights.centerControlDogs * -c.centerControlDogs +
    weights.wolfDistanceToDogs * (c.wolfDistanceToDogs > 4 ? 1 : -1)
  );
}

