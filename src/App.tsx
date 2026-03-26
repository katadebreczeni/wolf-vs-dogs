import './styles/main.scss';
import { useGameState } from './hooks/useGameState';
import { useAI } from './hooks/useAI';
import { useStats } from './hooks/useStats';
import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { StatusPanel } from './components/StatusPanel';
import { GameOverModal } from './components/GameOverModal';
import { useEffect, useRef } from 'react';
import { loadLearningData, saveLearningData, updateWeightsAfterGame } from './ai/learningStore';
import type { GameState } from './types/game';

function App() {
  const [state, dispatch] = useGameState();
  const { stats, recordGame } = useStats();

  // AI hook – auto-plays when it's AI's turn
  useAI(state, dispatch);

  // Track game history for AI learning
  const gameHistory = useRef<GameState[]>([]);

  useEffect(() => {
    if (state.phase === 'playing' || state.phase === 'setup') {
      gameHistory.current.push({ ...state });
    }
  }, [state.phase, state.wolf, state.dogs, state.currentPlayer]);

  // Handle game over: record stats + AI learning
  const gameOverHandled = useRef(false);
  useEffect(() => {
    if (state.phase === 'gameOver' && state.winner && state.humanRole && !gameOverHandled.current) {
      gameOverHandled.current = true;
      recordGame(state.winner, state.humanRole);

      // AI learning update
      const result = state.winner === 'wolfPlayer' ? 'wolfWin' as const : 'dogWin' as const;
      const aiRole = state.humanRole === 'wolfPlayer' ? 'dogPlayer' as const : 'wolfPlayer' as const;
      const learningData = loadLearningData();
      const updatedData = updateWeightsAfterGame(learningData, gameHistory.current, result, aiRole);
      saveLearningData(updatedData);
    }
  }, [state.phase, state.winner, state.humanRole, recordGame]);

  // Reset tracking on new game
  useEffect(() => {
    if (state.phase === 'menu') {
      gameHistory.current = [];
      gameOverHandled.current = false;
    }
  }, [state.phase]);

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  const handlePlayAgain = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  return (
    <div className="app">
      {/* MENU PHASE */}
      {state.phase === 'menu' && (
        <MainMenu
          onSelectRole={(role) => dispatch({ type: 'SELECT_ROLE', role })}
          stats={stats}
        />
      )}

      {/* SETUP / PLAYING / GAME_OVER PHASES */}
      {state.phase !== 'menu' && (
        <>
          <h2 className="title title--small">🐺 Wolfs vs Dog 🐶</h2>

          <GameBoard state={state} dispatch={dispatch} />

          <StatusPanel state={state} />

          <div className="game-controls">
            <button className="btn btn--small" onClick={handleNewGame}>
              🏠 Main Menu
            </button>
            {state.phase !== 'gameOver' && (
              <button
                className="btn btn--small"
                onClick={() => {
                  if (state.humanRole) {
                    dispatch({ type: 'SELECT_ROLE', role: state.humanRole });
                  }
                }}
              >
                🔄 Restart
              </button>
            )}
          </div>

          {/* GAME OVER MODAL */}
          {state.phase === 'gameOver' && state.winner && state.humanRole && (
            <GameOverModal
              winner={state.winner}
              humanRole={state.humanRole}
              onPlayAgain={handlePlayAgain}
              onMainMenu={handleNewGame}
              stats={stats}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
