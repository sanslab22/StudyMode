'use client';

import { TimerProvider } from '../context/TimerContext';

export function Providers({ children }) {
  return <TimerProvider>{children}</TimerProvider>;
}
