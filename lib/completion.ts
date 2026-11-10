// Mis juhtub taimeri lõpus: mida salvestada ja kas mängida heli.

import type { TimerStatus } from "@/lib/timer";

/** Kui lõpust on möödas rohkem, jääb heli ära (leht oli kaua taustal). */
export const LATE_CHIME_LIMIT_MS = 60 * 1000;

export type CompletionPayload = {
  clientSessionId: string;
  activityId: string;
  animalId: string;
  durationSeconds: number;
  /** Tegelik lõpuhetk millisekundites. */
  completedAt: number;
};

/**
 * Tagastab salvestatavad andmed ainult siis, kui taimer jõudis päriselt nulli.
 * Jooksva, pausil oleva või käsitsi lõpetatud taimeri korral null, seega
 * katkestatud tegevus ajalukku ei jõua.
 */
export function completionPayload(
  timer: { status: TimerStatus; finishedAt: number | null },
  run: {
    clientSessionId: string;
    activityId: string;
    animalId: string;
    durationSeconds: number;
  },
): CompletionPayload | null {
  if (timer.status !== "finished" || timer.finishedAt === null) return null;
  return { ...run, completedAt: timer.finishedAt };
}

/** Lõpuheli mängitakse ainult siis, kui heli on sees ja lõpp oli äsja. */
export function shouldPlayChime(
  soundOn: boolean,
  finishedAt: number | null,
  now: number,
): boolean {
  if (!soundOn || finishedAt === null) return false;
  return now - finishedAt < LATE_CHIME_LIMIT_MS;
}
