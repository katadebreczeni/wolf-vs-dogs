import './styles/main.scss';
import { useGameState } from './hooks/useGameState';
import { useAI } from './hooks/useAI';
import { useStats } from './hooks/useStats';
import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { StatusPanel } from './components/StatusPanel';
import { GameOverModal } from './components/GameOverModal';
import { Beanstalk } from './components/Beanstalk';
import { useEffect, useRef } from 'react';
import { loadLearningData, saveLearningData, updateWeightsAfterGame } from './ai/learningStore';
import { getDifficultyById, getNextLevelUnlockWins } from './ai/difficulty';
import type { GameState } from './types/game';

function App() {
  const [state, dispatch] = useGameState();
  const { stats, recordGame, setSelectedLevel } = useStats();

  // AI hook – auto-plays when it's AI's turn
  useAI(state, dispatch);

  // Track game history for AI learning
  const gameHistory = useRef<GameState[]>([]);
  const previousHighestLevel = useRef(stats.highestUnlockedLevel);

  useEffect(() => {
    if (state.phase === 'playing' || state.phase === 'setup') {
      gameHistory.current.push({ ...state });
    }
  }, [state.phase, state.wolf, state.dogs, state.currentPlayer]);

  // Handle game over: record stats + conditional AI learning
  const gameOverHandled = useRef(false);
  useEffect(() => {
    if (state.phase === 'gameOver' && state.winner && state.humanRole && !gameOverHandled.current) {
      gameOverHandled.current = true;
      recordGame(state.winner, state.humanRole);

      // AI learning update – only on levels that use learning (4-5)
      const difficulty = getDifficultyById(state.difficultyLevel);
      if (difficulty.useLearning) {
        const result = state.winner === 'wolfPlayer' ? 'wolfWin' as const : 'dogWin' as const;
        const aiRole = state.humanRole === 'wolfPlayer' ? 'dogPlayer' as const : 'wolfPlayer' as const;
        const learningData = loadLearningData();
        const updatedData = updateWeightsAfterGame(learningData, gameHistory.current, result, aiRole);
        saveLearningData(updatedData);
      }
    }
  }, [state.phase, state.winner, state.humanRole, state.difficultyLevel, recordGame]);

  // Reset tracking on new game
  useEffect(() => {
    if (state.phase === 'menu') {
      gameHistory.current = [];
      gameOverHandled.current = false;
      previousHighestLevel.current = stats.highestUnlockedLevel;
    }
  }, [state.phase, stats.highestUnlockedLevel]);

  // Sync difficulty level from stats on menu
  const handleSelectDifficulty = (level: number) => {
    setSelectedLevel(level);
    dispatch({ type: 'SELECT_DIFFICULTY', level });
  };

  // When entering menu, sync difficulty from stats
  useEffect(() => {
    if (state.phase === 'menu' && state.difficultyLevel !== stats.selectedLevel) {
      dispatch({ type: 'SELECT_DIFFICULTY', level: stats.selectedLevel });
    }
  }, [state.phase, stats.selectedLevel, state.difficultyLevel, dispatch]);

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  const handlePlayAgain = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  // Beanstalk props
  const currentDifficulty = getDifficultyById(state.difficultyLevel);
  const nextUnlock = getNextLevelUnlockWins(state.difficultyLevel, stats.humanWins);

  return (
    <div className="app">
      {/* MENU PHASE */}
      {state.phase === 'menu' && (
        <MainMenu
          onSelectRole={(role) => dispatch({ type: 'SELECT_ROLE', role })}
          onSelectDifficulty={handleSelectDifficulty}
          stats={stats}
        />
      )}

      {/* SETUP / PLAYING / GAME_OVER PHASES */}
      {state.phase !== 'menu' && (
        <>
          <h2 className="title title--small">🐺 Wolfs vs Dog 🐶</h2>

          <div className="game-layout">
            <GameBoard state={state} dispatch={dispatch} />

            <Beanstalk
              stage={currentDifficulty.beanstalkStage}
              currentLevel={currentDifficulty}
              totalWins={stats.humanWins}
              nextUnlockAt={nextUnlock}
            />
          </div>

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
              previousHighestLevel={previousHighestLevel.current}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
