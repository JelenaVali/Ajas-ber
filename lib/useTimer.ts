"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createTimer,
  pause as pauseTimer,
  progress,
  remainingSeconds,
  restart as restartTimer,
  resume as resumeTimer,
  tick,
  type TimerState,
} from "@/lib/timer";

/**
 * Ühendab taimeri loogika (lib/timer.ts) Reactiga. Intervall ainult värskendab
 * ekraani; aeg ise arvutatakse alati algushetkest, mitte tiksude loendamisest.
 */
export function useTimer(durationSeconds: number) {
  const [state, setState] = useState<TimerState>(() =>
    createTimer(durationSeconds * 1000, Date.now()),
  );
  const [now, setNow] = useState(() => Date.now());

  const refresh = useCallback(() => {
    const current = Date.now();
    setNow(current);
    setState((previous) => tick(previous, current));
  }, []);

  const isRunning = state.status === "running";

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(refresh, 200);
    // Taustalt tagasi tulles värskenda kohe, mitte järgmise tiksu ajal.
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [isRunning, refresh]);

  const pause = useCallback(() => {
    const current = Date.now();
    setNow(current);
    setState((previous) => pauseTimer(previous, current));
  }, []);

  const resume = useCallback(() => {
    const current = Date.now();
    setNow(current);
    setState((previous) => resumeTimer(previous, current));
  }, []);

  const restart = useCallback(() => {
    setNow(Date.now());
    setState((previous) => restartTimer(previous));
  }, []);

  return {
    status: state.status,
    finishedAt: state.finishedAt,
    secondsLeft: remainingSeconds(state, now),
    progress: progress(state, now),
    pause,
    resume,
    restart,
  };
}
