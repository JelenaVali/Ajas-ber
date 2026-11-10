// Lubatud taimeri kestus. Sama reeglit kasutavad nii kasutajaliides kui server.

export const MIN_MINUTES = 1;
export const MAX_MINUTES = 10;
export const PRESET_MINUTES = [1, 2, 3, 4, 5] as const;
export const DEFAULT_MINUTES = 2;

/** Hoiab minutite arvu lubatud vahemikus ja täisarvuna. */
export function clampMinutes(minutes: number): number {
  if (!Number.isFinite(minutes)) return DEFAULT_MINUTES;
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, Math.round(minutes)));
}

/** Kestus sekundites on lubatud, kui see on täisminut vahemikus 1–10 minutit. */
export function isValidDurationSeconds(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value % 60 === 0 &&
    value >= MIN_MINUTES * 60 &&
    value <= MAX_MINUTES * 60
  );
}
