// Taimeri arvutusloogika. Ei sõltu Reactist ega brauserist: kõik funktsioonid
// saavad praeguse aja (`now`, millisekundites) argumendina, nii et neid saab
// testida ja taimer jääb täpseks ka siis, kui leht oli vahepeal taustal.

export type TimerStatus = "running" | "paused" | "finished";

export type TimerState = {
  durationMs: number;
  status: TimerStatus;
  /** Enne praegust jooksulõiku kogunenud aeg. */
  elapsedBeforeMs: number;
  /** Praeguse jooksulõigu algushetk; null, kui taimer ei jookse. */
  startedAt: number | null;
  /** Hetk, mil aeg tegelikult täis sai; null, kuni taimer pole lõppenud. */
  finishedAt: number | null;
};

/** Loob uue taimeri, mis hakkab kohe jooksma. */
export function createTimer(durationMs: number, now: number): TimerState {
  return {
    durationMs,
    status: "running",
    elapsedBeforeMs: 0,
    startedAt: now,
    finishedAt: null,
  };
}

/** Möödunud aeg, alati vahemikus 0 kuni kestus. */
export function elapsedMs(state: TimerState, now: number): number {
  if (state.status === "finished") return state.durationMs;
  if (state.status === "paused" || state.startedAt === null) {
    return state.elapsedBeforeMs;
  }
  const running = Math.max(0, now - state.startedAt);
  return Math.min(state.durationMs, state.elapsedBeforeMs + running);
}

/** Järelejäänud aeg; ei lähe kunagi negatiivseks. */
export function remainingMs(state: TimerState, now: number): number {
  return Math.max(0, state.durationMs - elapsedMs(state, now));
}

/** Järelejäänud täissekundid ekraanil näitamiseks (ümardatud üles). */
export function remainingSeconds(state: TimerState, now: number): number {
  return Math.ceil(remainingMs(state, now) / 1000);
}

/** Möödunud aja osakaal vahemikus 0–1 visuaalse loenduri jaoks. */
export function progress(state: TimerState, now: number): number {
  if (state.durationMs <= 0) return 1;
  return elapsedMs(state, now) / state.durationMs;
}

/**
 * Kontrollib, kas aeg on täis. Kui on, tagastab lõppenud oleku; muidu sama
 * objekti. Lõppenud taimeril ei tee midagi, seega lõpp saabub ainult üks kord.
 */
export function tick(state: TimerState, now: number): TimerState {
  if (state.status !== "running" || state.startedAt === null) return state;
  if (state.elapsedBeforeMs + (now - state.startedAt) < state.durationMs) {
    return state;
  }
  return {
    ...state,
    status: "finished",
    elapsedBeforeMs: state.durationMs,
    startedAt: null,
    // Tegelik lõpuhetk, mitte hetk, mil me seda märkasime.
    finishedAt: state.startedAt + (state.durationMs - state.elapsedBeforeMs),
  };
}

/** Paneb jooksva taimeri pausile. */
export function pause(state: TimerState, now: number): TimerState {
  const current = tick(state, now);
  if (current.status !== "running") return current;
  return {
    ...current,
    status: "paused",
    elapsedBeforeMs: elapsedMs(current, now),
    startedAt: null,
  };
}

/** Jätkab pausil olevat taimerit sealt, kus see pooleli jäi. */
export function resume(state: TimerState, now: number): TimerState {
  if (state.status !== "paused") return state;
  return { ...state, status: "running", startedAt: now };
}

/** Taastab valitud kestuse ja jätab taimeri pausile. */
export function restart(state: TimerState): TimerState {
  return {
    durationMs: state.durationMs,
    status: "paused",
    elapsedBeforeMs: 0,
    startedAt: null,
    finishedAt: null,
  };
}

/** Vormindab sekundid kujule MM:SS, näiteks 02:00. */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
