import type { GameState } from '../types/game';
import type { TranspositionEntry, AiMove } from '../types/ai';

/** Pre-generated Zobrist random keys */
const ZOBRIST_KEYS: Record<string, number> = {};
let zobristInitialized = false;

/** Pseudo-random number generator (deterministic seed for consistency) */
function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Initialize Zobrist hash keys */
function initZobristKeys(): void {
  if (zobristInitialized) return;
  const rng = mulberry32(42);

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      for (const type of ['wolf', 'dog'] as const) {
        ZOBRIST_KEYS[`${row}-${col}-${type}`] = Math.floor(
          rng() * 0xffffffff
        );
      }
    }
  }
  ZOBRIST_KEYS['currentPlayer-wolfPlayer'] = Math.floor(rng() * 0xffffffff);
  ZOBRIST_KEYS['currentPlayer-dogPlayer'] = Math.floor(rng() * 0xffffffff);
  zobristInitialized = true;
}

/** Compute Zobrist hash for a game state */
export function hashPosition(state: GameState): number {
  initZobristKeys();

  let hash = 0;
  if (state.wolf) {
    const key = `${state.wolf.position.row}-${state.wolf.position.col}-wolf`;
    hash ^= ZOBRIST_KEYS[key] ?? 0;
  }
  for (const dog of state.dogs) {
    const key = `${dog.position.row}-${dog.position.col}-dog`;
    hash ^= ZOBRIST_KEYS[key] ?? 0;
  }
  hash ^= ZOBRIST_KEYS[`currentPlayer-${state.currentPlayer}`] ?? 0;

  return hash;
}

const MAX_TABLE_SIZE = 100_000;

/** Transposition table for caching minimax results */
export class TranspositionTable {
  private table: Map<number, TranspositionEntry> = new Map();

  get(hash: number, minDepth: number): TranspositionEntry | null {
    const entry = this.table.get(hash);
    if (entry && entry.depth >= minDepth) {
      return entry;
    }
    return null;
  }

  set(
    hash: number,
    score: number,
    depth: number,
    flag: 'exact' | 'lowerBound' | 'upperBound',
    bestMove: AiMove | null
  ): void {
    // Eviction: if full, remove entries with lower depth
    if (this.table.size >= MAX_TABLE_SIZE) {
      const keysToDelete: number[] = [];
      for (const [key, entry] of this.table) {
        if (entry.depth <= depth) {
          keysToDelete.push(key);
        }
        if (keysToDelete.length >= MAX_TABLE_SIZE / 4) break;
      }
      for (const key of keysToDelete) {
        this.table.delete(key);
      }
    }

    this.table.set(hash, { hash, depth, score, flag, bestMove });
  }

  clear(): void {
    this.table.clear();
  }

  get size(): number {
    return this.table.size;
  }
}

