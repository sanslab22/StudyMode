import TimerModal from './TimerModal';
import { useTimer } from '../context/TimerContext';
import './Home.css';

const TIPS = [
  'Take a 5-minute break every 25 minutes to stay focused.',
  'Write summaries in your own words to boost retention.',
  'Teach what you learn — explaining it cements the knowledge.',
  'Avoid multitasking: one subject at a time works best.',
  'Review notes within 24 hours to lock them into long-term memory.',
];

const todayTip = TIPS[new Date().getDay() % TIPS.length];

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function Home() {
  const {
    timerStep, setTimerStep,
    timerType, setTimerType,
    remaining,
    sessionConfig,
    currentSession,
    phase,
    handleStart,
    handleStop,
  } = useTimer();

  const phaseLabel = phase === 'break' ? 'BREAK' : timerType;
  const sessionInfo = sessionConfig?.sessions > 1
    ? `Session ${currentSession} / ${sessionConfig.sessions}`
    : null;

  return (
    <div className="home">
      {/* Tip of the Day */}
      <div className="tip-card">
        <span className="tip-label">Tip of the Day</span>
        <p className="tip-text">{todayTip}</p>
      </div>

      {/* Timer Widget */}
      <div
        className={`timer-widget ${(timerStep === 'running' || timerStep === 'paused') ? 'timer-widget--running' : ''}`}
        onClick={() => { if (timerStep === 'idle') setTimerStep('select'); }}
      >
        {(timerStep === 'running' || timerStep === 'paused') ? (
          <>
            <p className="timer-type-label">{phaseLabel}</p>
            {sessionInfo && <p className="timer-session-info">{sessionInfo}</p>}
            <p className={`timer-display ${timerStep === 'paused' ? 'timer-display--paused' : ''}`}>{formatTime(remaining)}</p>
            <div className="timer-btn-row">
              <button className="timer-pause-btn" onClick={(e) => { e.stopPropagation(); setTimerStep(timerStep === 'running' ? 'paused' : 'running'); }}>
                {timerStep === 'running' ? '⏸' : '▶'}
              </button>
              <button className="timer-stop-btn" onClick={(e) => { e.stopPropagation(); handleStop(); }}>
                Stop
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="timer-idle-icon">⏱</p>
            <p className="timer-idle-text">Start Timer</p>
          </>
        )}
      </div>

      {/* Link Placeholders */}
      <div className="link-row">
        <button className="link-btn">Link</button>
        <button className="link-btn">Link</button>
        <button className="link-btn">Link</button>
      </div>

      {/* Timer Modal */}
      {(timerStep === 'select' || timerStep === 'config') && (
        <TimerModal
          step={timerStep}
          selectedType={timerType}
          onSelectType={(type) => { setTimerType(type); setTimerStep('config'); }}
          onBack={() => { setTimerType(null); setTimerStep('select'); }}
          onStart={handleStart}
          onClose={() => setTimerStep('idle')}
        />
      )}
    </div>
  );
}

export default Home;
