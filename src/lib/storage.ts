import { z } from 'zod';
import { footprintInputSchema, goalSchema, historySchema } from './schemas';
import type { FootprintInput, Goal, HistoryEntry } from './schemas';

/**
 * Safe localStorage layer.
 *
 * SECURITY: localStorage is treated as UNTRUSTED. Every value read back is parsed
 * and validated against its Zod schema; anything malformed, tampered with, or of
 * the wrong shape fails closed (returns null / empty), never throwing into the UI.
 * All access is also guarded so the module is safe to import during SSR, in private
 * browsing, or when storage is disabled or over quota.
 */

const KEYS = {
  input: 'ecotrack-ai:input',
  goal: 'ecotrack-ai:goal',
  history: 'ecotrack-ai:history',
} as const;

/** Cap stored history so a single browser key can never grow without bound. */
const MAX_HISTORY = 100;

function getStorage(): Storage | null {
  try {
    const g = globalThis as { localStorage?: Storage };
    return g.localStorage ?? null;
  } catch {
    // Accessing localStorage can throw in sandboxed iframes / strict privacy modes.
    return null;
  }
}

export function isStorageAvailable(): boolean {
  return getStorage() !== null;
}

function writeRaw(key: string, value: unknown): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // e.g. QuotaExceededError
    return false;
  }
}

function readValidated<S extends z.ZodTypeAny>(key: string, schema: S): z.infer<S> | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    const result = schema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    // Invalid JSON, etc.
    return null;
  }
}

function removeRaw(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    /* no-op */
  }
}

export function saveInput(input: FootprintInput): boolean {
  return writeRaw(KEYS.input, input);
}

export function loadInput(): FootprintInput | null {
  return readValidated(KEYS.input, footprintInputSchema);
}

export function saveGoal(goal: Goal): boolean {
  return writeRaw(KEYS.goal, goal);
}

export function loadGoal(): Goal | null {
  return readValidated(KEYS.goal, goalSchema);
}

export function clearGoal(): void {
  removeRaw(KEYS.goal);
}

export function loadHistory(): HistoryEntry[] {
  return readValidated(KEYS.history, historySchema) ?? [];
}

/**
 * Append an entry to history, capped at MAX_HISTORY, and return the new list.
 *
 * Consecutive duplicates are skipped: if the footprint is unchanged from the most
 * recent entry, no new point is recorded. This keeps the trend meaningful and
 * stops the table filling with identical rows when results are revisited or the
 * questionnaire is re-submitted without edits.
 */
export function addHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const history = loadHistory();
  const last = history[history.length - 1];
  if (last && last.totalKg === entry.totalKg) return history;
  const next = [...history, entry].slice(-MAX_HISTORY);
  writeRaw(KEYS.history, next);
  return next;
}

export function clearHistory(): void {
  removeRaw(KEYS.history);
}

export { KEYS as STORAGE_KEYS };
