import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  STORAGE_KEYS,
  addHistoryEntry,
  clearGoal,
  clearHistory,
  isStorageAvailable,
  loadGoal,
  loadHistory,
  loadInput,
  saveGoal,
  saveInput,
} from './storage';
import { defaultFootprintInput, type Goal } from './schemas';

function createMockStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => (map.has(key) ? (map.get(key) as string) : null),
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, String(value));
    },
  };
}

const globalRef = globalThis as { localStorage?: Storage };
let original: Storage | undefined;

beforeEach(() => {
  original = globalRef.localStorage;
  globalRef.localStorage = createMockStorage();
});

afterEach(() => {
  if (original === undefined) {
    delete globalRef.localStorage;
  } else {
    globalRef.localStorage = original;
  }
});

describe('storage availability', () => {
  it('reports available when localStorage exists', () => {
    expect(isStorageAvailable()).toBe(true);
  });

  it('fails closed when storage is unavailable', () => {
    delete globalRef.localStorage;
    expect(isStorageAvailable()).toBe(false);
    expect(loadInput()).toBeNull();
    expect(saveInput(defaultFootprintInput)).toBe(false);
    expect(loadHistory()).toEqual([]);
  });
});

describe('input persistence', () => {
  it('returns null when nothing is stored', () => {
    expect(loadInput()).toBeNull();
  });

  it('round-trips a valid input', () => {
    expect(saveInput(defaultFootprintInput)).toBe(true);
    expect(loadInput()).toEqual(defaultFootprintInput);
  });

  it('returns null for tampered (invalid JSON) data', () => {
    globalRef.localStorage?.setItem(STORAGE_KEYS.input, '{not valid json');
    expect(loadInput()).toBeNull();
  });

  it('returns null for well-formed JSON with the wrong shape', () => {
    globalRef.localStorage?.setItem(STORAGE_KEYS.input, JSON.stringify({ foo: 'bar' }));
    expect(loadInput()).toBeNull();
  });
});

describe('goal persistence', () => {
  it('saves, loads, and clears a goal', () => {
    const goal: Goal = { targetTonnes: 2, baselineTonnes: 5, createdAt: '2026-01-01' };
    expect(saveGoal(goal)).toBe(true);
    expect(loadGoal()).toEqual(goal);
    clearGoal();
    expect(loadGoal()).toBeNull();
  });
});

describe('history persistence', () => {
  it('appends entries and can be cleared', () => {
    addHistoryEntry({ date: 'd1', totalKg: 1000, totalTonnes: 1 });
    addHistoryEntry({ date: 'd2', totalKg: 2000, totalTonnes: 2 });
    expect(loadHistory()).toHaveLength(2);
    clearHistory();
    expect(loadHistory()).toHaveLength(0);
  });

  it('skips a consecutive entry with an unchanged footprint', () => {
    addHistoryEntry({ date: 'd1', totalKg: 1500, totalTonnes: 1.5 });
    addHistoryEntry({ date: 'd2', totalKg: 1500, totalTonnes: 1.5 }); // duplicate total → skipped
    addHistoryEntry({ date: 'd3', totalKg: 1800, totalTonnes: 1.8 }); // changed → recorded
    const history = loadHistory();
    expect(history).toHaveLength(2);
    expect(history.map((h) => h.totalKg)).toEqual([1500, 1800]);
    expect(history[0]?.date).toBe('d1'); // the first occurrence is kept
  });

  it('caps history at 100 entries, keeping the most recent', () => {
    for (let i = 0; i < 105; i += 1) {
      addHistoryEntry({ date: `d${i}`, totalKg: i, totalTonnes: i / 1000 });
    }
    const history = loadHistory();
    expect(history).toHaveLength(100);
    expect(history[0]?.date).toBe('d5');
    expect(history[history.length - 1]?.date).toBe('d104');
  });
});
