"use client";

import { useEffect } from "react";

/**
 * Hoiab ekraani ärkvel, kuni `active` on tõene (taimer jookseb).
 * Kui brauser seda ei toeta või keeldub, ei juhtu midagi: taimer töötab ikka.
 */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const lock = await navigator.wakeLock.request("screen");
        if (cancelled) {
          void lock.release();
        } else {
          sentinel = lock;
        }
      } catch {
        // Näiteks akusäästurežiim. Ekraan võib kustuda, taimer jääb täpseks.
      }
    };

    void request();
    // Brauser vabastab luku, kui leht läheb taustale; tagasi tulles küsi uuesti.
    document.addEventListener("visibilitychange", request);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", request);
      void sentinel?.release().catch(() => {});
    };
  }, [active]);
}
