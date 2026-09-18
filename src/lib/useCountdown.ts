import { useEffect, useState } from 'react';
import { computeCountdown, type CountdownSnapshot } from './countdown';

/**
 * Subscribes a component to the timestamp-based countdown. Recomputes from
 * `Date.now()` on an interval AND immediately whenever the tab regains
 * visibility, so background-tab throttling never leaves a stale value on
 * screen for long.
 */
export function useCountdown(startTime: number, endTime: number, tickMs = 250): CountdownSnapshot {
  const [snapshot, setSnapshot] = useState(() => computeCountdown(startTime, endTime));

  useEffect(() => {
    const tick = () => setSnapshot(computeCountdown(startTime, endTime));
    tick();

    const id = setInterval(tick, tickMs);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [startTime, endTime, tickMs]);

  return snapshot;
}
