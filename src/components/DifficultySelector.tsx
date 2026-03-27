import { DIFFICULTY_LEVELS, isLevelUnlocked } from '../ai/difficulty';

interface DifficultySelectorProps {
  currentLevel: number;
  totalWins: number;
  onSelect: (level: number) => void;
}

export function DifficultySelector({
  currentLevel,
  totalWins,
  onSelect,
}: DifficultySelectorProps) {
  return (
    <div className="difficulty-selector">
      <div className="difficulty-selector__title">Difficulty</div>
      <div className="difficulty-selector__levels">
        {DIFFICULTY_LEVELS.map((level) => {
          const unlocked = isLevelUnlocked(level.id, totalWins);
          const selected = level.id === currentLevel;
          const className = [
            'difficulty-selector__level',
            unlocked ? 'difficulty-selector__level--unlocked' : 'difficulty-selector__level--locked',
            selected ? 'difficulty-selector__level--selected' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={level.id}
              className={className}
              onClick={() => unlocked && onSelect(level.id)}
              disabled={!unlocked}
              title={
                unlocked
                  ? `${level.name} – Depth ${level.maxDepth}`
                  : `Need ${level.winsToUnlock} wins to unlock`
              }
            >
              <span className="difficulty-selector__icon">{level.icon}</span>
              <span className="difficulty-selector__name">{level.name}</span>
              <span className="difficulty-selector__status">
                {unlocked ? '✅' : `🔒`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

