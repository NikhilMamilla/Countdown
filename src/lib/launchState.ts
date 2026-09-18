const STORAGE_KEY = 'techsurge-kalachakra-launch';

export interface LaunchRecord {
  startTime: number;
  endTime: number;
}

/**
 * Persists the moment the organizer actually pressed Start, so a page
 * refresh resumes the live countdown instead of replaying the launch
 * screen. Wrapped in try/catch — a private window or blocked storage
 * degrades to "always show the launch screen", never a crash.
 */
export function loadLaunch(): LaunchRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<LaunchRecord>;
    if (typeof parsed.startTime === 'number' && typeof parsed.endTime === 'number') {
      return { startTime: parsed.startTime, endTime: parsed.endTime };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveLaunch(record: LaunchRecord): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable — the countdown still runs for this session,
    // it just won't survive a refresh.
  }
}

export function clearLaunch(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
