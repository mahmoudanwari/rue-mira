/**
 * Versioned, validated, failure-tolerant localStorage wrapper.
 * If storage is unavailable (private mode, blocked cookies, quota), values live in memory
 * for the current session only and `storageAvailable()` reports false.
 */
const PREFIX = "rue-mira:";
const memory = new Map<string, string>();
let available: boolean | null = null;

export function storageAvailable(): boolean {
  if (available !== null) return available;
  try {
    if (typeof window === "undefined") return false;
    const k = PREFIX + "__probe";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

/** Test hook: force the availability probe to re-run. */
export function __resetStorageProbe() {
  available = null;
  memory.clear();
}

interface Envelope<T> {
  v: number;
  data: T;
}

export function readStore<T>(key: string, version: number, validate: (raw: unknown) => T | null, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = storageAvailable() ? window.localStorage.getItem(PREFIX + key) : (memory.get(key) ?? null);
  } catch {
    raw = memory.get(key) ?? null;
  }
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Envelope<unknown>;
    if (!parsed || typeof parsed !== "object" || parsed.v !== version) return fallback;
    const ok = validate(parsed.data);
    return ok ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(key: string, version: number, data: T): void {
  const raw = JSON.stringify({ v: version, data } satisfies Envelope<T>);
  memory.set(key, raw);
  try {
    if (storageAvailable()) window.localStorage.setItem(PREFIX + key, raw);
  } catch {
    // Quota or access error: keep the in-memory copy for this session.
  }
}

export function removeStore(key: string): void {
  memory.delete(key);
  try {
    if (storageAvailable()) window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}
