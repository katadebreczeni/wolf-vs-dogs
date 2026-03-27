import type { DifficultyLevel } from '../types/ai';

interface BeanstalkProps {
  stage: number;
  currentLevel: DifficultyLevel;
  totalWins: number;
  nextUnlockAt: number | null;
}

export function Beanstalk({ stage, currentLevel, totalWins, nextUnlockAt }: BeanstalkProps) {
  const className = `beanstalk beanstalk--stage-${stage}`;
  const leafCount = stage === 0 ? 0 : stage + 1;

  const leaves = Array.from({ length: leafCount }, (_, i) => {
    const side = i % 2 === 0 ? 'left' : 'right';
    const bottomPct = 15 + (i * 70) / Math.max(leafCount, 1);
    return (
      <div
        key={i}
        className={`beanstalk__leaf beanstalk__leaf--${side}`}
        style={{ bottom: `${bottomPct}%`, animationDelay: `${i * 0.3}s` }}
      />
    );
  });

  return (
    <div className={className}>
      {stage >= 4 && (
        <div className="beanstalk__top">
          <span className="beanstalk__clouds">☁️</span>
          <span className="beanstalk__castle">🏰</span>
          <span className="beanstalk__clouds">☁️</span>
        </div>
      )}
      <div className="beanstalk__level-badge">{currentLevel.icon}</div>
      <div className="beanstalk__vine-container">
        <div className="beanstalk__vine" />
        {leaves}
      </div>
      <div className="beanstalk__ground" />
      <div className="beanstalk__progress">
        {nextUnlockAt !== null ? (
          <>
            <div className="beanstalk__progress-bar">
              <div
                className="beanstalk__progress-fill"
                style={{
                  width: `${nextUnlockAt > 0 ? ((totalWins / (totalWins + nextUnlockAt)) * 100) : 100}%`,
                }}
              />
            </div>
            <span className="beanstalk__progress-text">
              {nextUnlockAt} more {nextUnlockAt === 1 ? 'win' : 'wins'}
            </span>
          </>
        ) : (
          <span className="beanstalk__progress-text beanstalk__progress-text--max">MAX LEVEL</span>
        )}
      </div>
    </div>
  );
}

