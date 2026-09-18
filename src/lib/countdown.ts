export interface CountdownSnapshot {
  remainingMs: number;
  elapsedMs: number;
  totalMs: number;
  progress: number; // 0..1
  isComplete: boolean;
}

/**
 * Pure timestamp-based countdown math: remaining = endTime - now.
 * Never decrements a counter, so a refresh, a backgrounded tab, or
 * temporary lag never resets or desyncs the countdown — it just
 * recomputes from the same two fixed timestamps every time.
 */
export function computeCountdown(startTime: number, endTime: number, now: number = Date.now()): CountdownSnapshot {
  const totalMs = Math.max(0, endTime - startTime);
  const remainingMs = Math.max(0, endTime - now);
  const elapsedMs = Math.min(totalMs, Math.max(0, now - startTime));
  return {
    remainingMs,
    elapsedMs,
    totalMs,
    progress: totalMs > 0 ? elapsedMs / totalMs : 0,
    isComplete: now >= endTime,
  };
}
