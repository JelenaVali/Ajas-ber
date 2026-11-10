"use client";

import { useSyncExternalStore } from "react";

// ---------- Heli seadistus (jääb selle seadme brauserisse meelde) ----------

const STORAGE_KEY = "ajasober:sound";
const listeners = new Set<() => void>();
let memoryValue: boolean | null = null;

/** Heli on vaikimisi sees. */
export function isSoundOn(): boolean {
  if (memoryValue !== null) return memoryValue;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean) {
  memoryValue = on;
  try {
    window.localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Brauseri mälu pole lubatud; valik kehtib kuni lehe sulgemiseni.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Heli seadistus Reacti komponendis; serveris ja esimesel joonistusel sees. */
export function useSoundSetting(): boolean {
  return useSyncExternalStore(subscribe, isSoundOn, () => true);
}

// ---------- Lõpumeloodia (tekitatakse brauseris, helifaili pole) ----------

let context: AudioContext | null = null;

/**
 * Valmistab heli ette. Brauser lubab heli alles pärast kasutaja vajutust,
 * seega kutsutakse seda nupuvajutuse sees (näiteks „Start!").
 */
export function unlockAudio() {
  try {
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    context ??= new AudioContextClass();
    if (context.state === "suspended") void context.resume();
  } catch {
    // Heli pole saadaval; rakendus töötab ilma.
  }
}

/** Lühike rõõmus meloodia: neli tõusvat nooti, mõõduka valjusega. */
export function playChime() {
  if (!context) return;
  try {
    if (context.state === "suspended") void context.resume();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const start = context.currentTime + 0.05;
    notes.forEach((frequency, index) => {
      const oscillator = context!.createOscillator();
      const gain = context!.createGain();
      const from = start + index * 0.17;
      const length = index === notes.length - 1 ? 0.6 : 0.22;
      oscillator.type = "triangle";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, from);
      gain.gain.exponentialRampToValueAtTime(0.18, from + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, from + length);
      oscillator.connect(gain).connect(context!.destination);
      oscillator.start(from);
      oscillator.stop(from + length + 0.05);
    });
  } catch {
    // Heli ebaõnnestus; kiitus ja kõik muu toimib edasi.
  }
}
