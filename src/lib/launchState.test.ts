import { beforeEach, describe, expect, it, vi } from 'vitest';

function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, value),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

vi.stubGlobal('localStorage', createMemoryStorage());

const { loadLaunch, saveLaunch, clearLaunch } = await import('./launchState');

describe('launchState', () => {
  beforeEach(() => {
    clearLaunch();
  });

  it('returns null when nothing has been launched yet', () => {
    expect(loadLaunch()).toBeNull();
  });

  it('round-trips a saved launch record', () => {
    saveLaunch({ startTime: 1000, endTime: 2000 });
    expect(loadLaunch()).toEqual({ startTime: 1000, endTime: 2000 });
  });

  it('clears a saved record', () => {
    saveLaunch({ startTime: 1000, endTime: 2000 });
    clearLaunch();
    expect(loadLaunch()).toBeNull();
  });

  it('ignores malformed stored data instead of throwing', () => {
    localStorage.setItem('techsurge-kalachakra-launch', '{"not":"valid"}');
    expect(loadLaunch()).toBeNull();
  });
});
