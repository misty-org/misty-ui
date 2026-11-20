import { useCallback, useSyncExternalStore } from "react";

/**
 * Where components keep what a person chose for this device (a collection's view, its filters).
 * By default it is the browser's localStorage; an app with its own settings store (Misty keeps
 * them in `misty.db`) hands one in once at startup with `setUiStorage`.
 */
export type UiStorage = {
  /** The whole stored value of a scope, or undefined when nothing is stored. */
  read(scope: string): unknown;
  write(scope: string, value: unknown): void;
  /** Called when the scope changes, here or in another window. Returns the unsubscribe. */
  subscribe(scope: string, listener: () => void): () => void;
};

const prefix = "misty-ui:";
const listeners = new Map<string, Set<() => void>>();

function notify(scope: string) {
  listeners.get(scope)?.forEach((listener) => listener());
}

const localStorageBackend: UiStorage = {
  read(scope) {
    try {
      const raw = globalThis.localStorage?.getItem(prefix + scope);
      return raw ? (JSON.parse(raw) as unknown) : undefined;
    } catch {
      return undefined;
    }
  },
  write(scope, value) {
    try {
      globalThis.localStorage?.setItem(prefix + scope, JSON.stringify(value));
    } catch {
      // Storage refused (a private window): the value lasts as long as the page.
    }
    notify(scope);
  },
  subscribe(scope, listener) {
    const set = listeners.get(scope) ?? new Set();
    set.add(listener);
    listeners.set(scope, set);
    const onStorage = (event: StorageEvent) => {
      if (event.key === prefix + scope) listener();
    };
    globalThis.addEventListener?.("storage", onStorage);
    return () => {
      set.delete(listener);
      globalThis.removeEventListener?.("storage", onStorage);
    };
  },
};

let storage: UiStorage = localStorageBackend;

/** Hands the components an app's own settings store. Call it once, before anything renders. */
export function setUiStorage(next: UiStorage) {
  storage = next;
}

type Entries<T> = Record<string, T>;

const own = <T>(entries: Entries<T>, key: string): T | undefined =>
  Object.prototype.hasOwnProperty.call(entries, key) ? entries[key] : undefined;

/**
 * One remembered entry per open-ended key (a table, a Space), all kept in one storage scope.
 * Only the most recently changed entries stay, so it can't grow without end.
 */
export function createUiMemory<T>(options: {
  scope: string;
  /** Turns one stored entry into a valid value, or undefined to drop it. */
  normalize: (stored: unknown) => T | undefined;
  /** How many entries are kept; the ones changed longest ago go first. */
  limit?: number;
}) {
  const limit = options.limit ?? 200;
  let cache: { raw: unknown; entries: Entries<T> } | undefined;

  const entries = (): Entries<T> => {
    const raw = storage.read(options.scope);
    if (cache && cache.raw === raw) return cache.entries;
    const next: Entries<T> = {};
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      for (const [key, value] of Object.entries(raw)) {
        const entry = options.normalize(value);
        if (entry !== undefined) next[key] = entry;
      }
    }
    cache = { raw, entries: next };
    return next;
  };

  const get = (key: string): T | undefined => own(entries(), key);

  /** Changes one entry (undefined removes it) and moves it to the newest end. */
  const set = (key: string, next: T | undefined | ((current: T | undefined) => T | undefined)) => {
    const current = entries();
    const value =
      typeof next === "function"
        ? (next as (current: T | undefined) => T | undefined)(own(current, key))
        : next;
    const rest = Object.entries(current).filter(([name]) => name !== key);
    if (value !== undefined) rest.push([key, value]);
    storage.write(options.scope, Object.fromEntries(rest.slice(-limit)));
  };

  /** One entry, kept current across windows; no key reads nothing. */
  function useEntry(key: string | undefined): T | undefined {
    const subscribe = useCallback(
      (listener: () => void) =>
        key === undefined ? () => {} : storage.subscribe(options.scope, listener),
      [key],
    );
    return useSyncExternalStore(subscribe, () => (key === undefined ? undefined : get(key)));
  }

  return { get, set, useEntry };
}
