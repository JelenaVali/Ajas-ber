"use client";

import { isUuid } from "@/lib/sessions";

const STORAGE_KEY = "ajasober:deviceId";

let memoryFallback: string | null = null;

/** Juhuslik UUID; töötab ka brauseris, kus crypto.randomUUID puudub. */
export function newUuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Selle seadme anonüümne tunnus. Luuakse esimesel kasutamisel juhuslikult ja
 * hoitakse brauseri mälus; ei sisalda mingit infot seadme ega kasutaja kohta.
 * Kui brauseri mälu pole lubatud, kehtib tunnus kuni lehe sulgemiseni.
 */
export function getDeviceId(): string {
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (isUuid(existing)) return existing;
    const created = newUuid();
    window.localStorage.setItem(STORAGE_KEY, created);
    return created;
  } catch {
    memoryFallback ??= newUuid();
    return memoryFallback;
  }
}
