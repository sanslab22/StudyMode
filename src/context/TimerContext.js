import { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext(null);

// Single shared AudioContext — created once on first user interaction,
// then reused so the browser's autoplay policy doesn't block it.
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new AudioContext();
  if (_audioCtx.state === 'suspended') _audioCtx.resume();
  return _audioCtx;
}

function playBell() {
  try {
    const ctx = getAudioCtx();
    [0, 0.35, 0.7].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = [880, 1100, 880][i];
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.5);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 1.5);
    });
  } catch (e) {}
}

function playPing() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 660;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {}
}

export function TimerProvider({ children }) {
  const [timerStep, setTimerStep] = useState('idle'); // idle | select | config | running | paused
  const [timerType, setTimerType] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [sessionConfig, setSessionConfig] = useState(null);
  const [currentSession, setCurrentSession] = useState(1);
  const [phase, setPhase] = useState('study'); // 'study' | 'break'

  useEffect(() => {
    if (timerStep !== 'running') return;
    if (remaining > 0) {
      const id = setInterval(() => setRemaining(prev => prev - 1), 1000);
      return () => clearInterval(id);
    }
    // remaining hit 0 — transition phase
    if (phase === 'study') {
      if (currentSession < sessionConfig.sessions) {
        playPing();
        setPhase('break');
        setRemaining(sessionConfig.breakMins * 60);
      } else {
        playBell();
        setTimerStep('idle');
        setPhase('study');
        setCurrentSession(1);
      }
    } else {
      playPing();
      setCurrentSession(s => s + 1);
      setPhase('study');
      setRemaining(sessionConfig.studyMins * 60);
    }
  }, [timerStep, remaining, phase, currentSession, sessionConfig]);

  const handleStart = (config) => {
    getAudioCtx(); // warm up inside user gesture so browser allows later playback
    setSessionConfig(config);
    setCurrentSession(1);
    setPhase('study');
    setRemaining(config.studyMins * 60);
    setTimerStep('running');
  };

  const handleStop = () => {
    setTimerStep('idle');
    setPhase('study');
    setCurrentSession(1);
  };

  return (
    <TimerContext.Provider value={{
      timerStep, setTimerStep,
      timerType, setTimerType,
      remaining,
      sessionConfig,
      currentSession,
      phase,
      handleStart,
      handleStop,
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  return useContext(TimerContext);
}
