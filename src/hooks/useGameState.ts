import { useReducer } from 'react';
import { gameReducer, INITIAL_STATE } from '../game/gameState';
import type { GameState, GameAction } from '../types/game';

/** Main game state hook using useReducer */
export function useGameState(): [GameState, React.Dispatch<GameAction>] {
  return useReducer(gameReducer, INITIAL_STATE);
}

