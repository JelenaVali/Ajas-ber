// Lõpetatud tegevuste salvestamise reeglid. Andmebaasi poole pöördutakse
// SessionStore liidese kaudu, et loogikat saaks testida ilma andmebaasita.

import { isValidDurationSeconds } from "@/lib/duration";

export const MAX_SESSIONS_PER_DEVICE = 200;

/** Lõpuhetk võib olla minevikus (telefon jäi lukku), aga mitte piiramatult. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
/** Lubatud kellade erinevus seadme ja serveri vahel. */
const MAX_FUTURE_MS = 60 * 1000;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export type NewSession = {
  clientSessionId: string;
  deviceId: string;
  activityId: string;
  animalId: string;
  durationSeconds: number;
  completedAt: Date;
};

export type HistoryEntry = {
  id: string;
  completedAt: string;
  durationSeconds: number;
  activity: { slug: string; name: string; color: string };
  animal: { slug: string; name: string };
};

export type SessionStore = {
  isActiveActivity(id: string): Promise<boolean>;
  isActiveAnimal(id: string): Promise<boolean>;
  /** Tagastab "duplicate", kui sama clientSessionId on juba salvestatud. */
  create(session: NewSession): Promise<"created" | "duplicate">;
  /** Kustutab seadme vanimad kirjed, jättes alles `keep` uusimat. */
  prune(deviceId: string, keep: number): Promise<void>;
  list(deviceId: string, limit: number): Promise<HistoryEntry[]>;
  clear(deviceId: string): Promise<number>;
};

export type SaveResult =
  | { ok: true; status: "created" | "duplicate" }
  | { ok: false; reason: "invalid" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 64;
}

/** Kasutab seadme teatatud lõpuhetke, kui see on usutav; muidu serveri aega. */
function resolveCompletedAt(value: unknown, now: number): Date {
  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value <= now + MAX_FUTURE_MS &&
    value >= now - MAX_AGE_MS
  ) {
    return new Date(Math.min(value, now));
  }
  return new Date(now);
}

/**
 * Salvestab lõpuni tehtud tegevuse. Kontrollib seadme tunnust, kestust ning
 * tegevuse ja looma olemasolu. Sama taimerikorra teine salvestus ei tekita
 * uut kirjet.
 */
export async function saveCompletedSession(
  store: SessionStore,
  deviceId: unknown,
  body: unknown,
  now: number,
): Promise<SaveResult> {
  if (!isUuid(deviceId) || !isRecord(body)) return { ok: false, reason: "invalid" };

  const { clientSessionId, activityId, animalId, durationSeconds, completedAt } = body;
  if (
    !isUuid(clientSessionId) ||
    !isId(activityId) ||
    !isId(animalId) ||
    !isValidDurationSeconds(durationSeconds)
  ) {
    return { ok: false, reason: "invalid" };
  }

  const [activityOk, animalOk] = await Promise.all([
    store.isActiveActivity(activityId),
    store.isActiveAnimal(animalId),
  ]);
  if (!activityOk || !animalOk) return { ok: false, reason: "invalid" };

  const status = await store.create({
    clientSessionId,
    deviceId,
    activityId,
    animalId,
    durationSeconds,
    completedAt: resolveCompletedAt(completedAt, now),
  });

  if (status === "created") {
    await store.prune(deviceId, MAX_SESSIONS_PER_DEVICE);
  }
  return { ok: true, status };
}

/** Seadme ajalugu, uuemad eespool. Vigase tunnuse korral null. */
export async function listSessions(
  store: SessionStore,
  deviceId: unknown,
): Promise<HistoryEntry[] | null> {
  if (!isUuid(deviceId)) return null;
  return store.list(deviceId, MAX_SESSIONS_PER_DEVICE);
}

/** Kustutab ainult selle seadme ajaloo. Vigase tunnuse korral null. */
export async function clearSessions(
  store: SessionStore,
  deviceId: unknown,
): Promise<number | null> {
  if (!isUuid(deviceId)) return null;
  return store.clear(deviceId);
}
