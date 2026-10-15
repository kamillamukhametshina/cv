export const catchStorageKey = 'portfolio-fly-catches';
export function createCatchCounter(storage) {
  const read = () => {
    try { const n = Number(storage.getItem(catchStorageKey)); return Number.isSafeInteger(n) && n >= 0 ? n : 0; } catch { return 0; }
  };
  let value = read();
  return {
    get value() { return value; },
    refresh() { value = read(); return value; },
    increment() {
      value = Math.min(Number.MAX_SAFE_INTEGER, Math.max(value, read()) + 1);
      try { storage.setItem(catchStorageKey, String(value)); } catch { /* Keep the session playable when storage is blocked. */ }
      return value;
    },
  };
}
