import { describe, expect, it } from 'vitest';
import { computeCountdown } from './countdown';

const HOUR = 3_600_000;

describe('computeCountdown', () => {
  it('reports the full 24 hours remaining at the exact start', () => {
    const start = 0;
    const end = start + 24 * HOUR;
    const snap = computeCountdown(start, end, start);
    expect(snap.remainingMs).toBe(24 * HOUR);
    expect(snap.isComplete).toBe(false);
  });

  it('reports 1 hour remaining partway through', () => {
    const start = 0;
    const end = 24 * HOUR;
    const now = 23 * HOUR;
    expect(computeCountdown(start, end, now).remainingMs).toBe(HOUR);
  });

  it('reports 1 minute remaining', () => {
    const start = 0;
    const end = HOUR;
    const now = end - 60_000;
    expect(computeCountdown(start, end, now).remainingMs).toBe(60_000);
  });

  it('reports 1 second remaining', () => {
    const start = 0;
    const end = HOUR;
    const now = end - 1000;
    expect(computeCountdown(start, end, now).remainingMs).toBe(1000);
  });

  it('reports exactly zero at the end timestamp and marks complete', () => {
    const start = 0;
    const end = HOUR;
    const snap = computeCountdown(start, end, end);
    expect(snap.remainingMs).toBe(0);
    expect(snap.isComplete).toBe(true);
  });

  it('never goes negative past the end time', () => {
    const start = 0;
    const end = HOUR;
    const snap = computeCountdown(start, end, end + 5 * HOUR);
    expect(snap.remainingMs).toBe(0);
    expect(snap.remainingMs).toBeGreaterThanOrEqual(0);
    expect(snap.isComplete).toBe(true);
  });

  it('recovers the correct remaining time purely from timestamps after a simulated refresh', () => {
    const start = 0;
    const end = 5 * HOUR;
    const refreshNow = 2 * HOUR + 15 * 60_000;
    expect(computeCountdown(start, end, refreshNow).remainingMs).toBe(end - refreshNow);
  });

  it('is unaffected by how the caller got to "now" — same instant, same result', () => {
    const start = 0;
    const end = 5 * HOUR;
    const now = 3 * HOUR;
    const a = computeCountdown(start, end, now);
    const b = computeCountdown(start, end, now);
    expect(a).toEqual(b);
  });
});
