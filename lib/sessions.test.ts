import { describe, expect, it } from "vitest";
import { completionPayload, shouldPlayChime } from "./completion";
import {
  clearSessions,
  listSessions,
  MAX_SESSIONS_PER_DEVICE,
  saveCompletedSession,
  type HistoryEntry,
  type NewSession,
  type SessionStore,
} from "./sessions";
import { createTimer, pause, tick } from "./timer";

const NOW = Date.UTC(2026, 10, 10, 18, 0, 0);
const DEVICE_A = "11111111-1111-4111-8111-111111111111";
const DEVICE_B = "22222222-2222-4222-8222-222222222222";

function sessionId(n: number): string {
  return `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
}

/** Mälus töötav hoidla, mis käitub nagu andmebaas (unikaalne clientSessionId). */
function createFakeStore() {
  const rows: NewSession[] = [];
  const store: SessionStore = {
    isActiveActivity: async (id) => id === "act-1",
    isActiveAnimal: async (id) => id === "animal-1",
    create: async (session) => {
      if (rows.some((row) => row.clientSessionId === session.clientSessionId)) {
        return "duplicate";
      }
      rows.push(session);
      return "created";
    },
    prune: async (deviceId, keep) => {
      const own = rows
        .filter((row) => row.deviceId === deviceId)
        .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
      for (const extra of own.slice(keep)) {
        rows.splice(rows.indexOf(extra), 1);
      }
    },
    list: async (deviceId, limit) =>
      rows
        .filter((row) => row.deviceId === deviceId)
        .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
        .slice(0, limit)
        .map(
          (row): HistoryEntry => ({
            id: row.clientSessionId,
            completedAt: row.completedAt.toISOString(),
            durationSeconds: row.durationSeconds,
            activity: { slug: "hambapesu", name: "Hambapesu", color: "sky" },
            animal: { slug: "karu", name: "Karu" },
          }),
        ),
    clear: async (deviceId) => {
      const before = rows.length;
      for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].deviceId === deviceId) rows.splice(i, 1);
      }
      return before - rows.length;
    },
  };
  return { store, rows };
}

function body(overrides: Record<string, unknown> = {}) {
  return {
    clientSessionId: sessionId(1),
    activityId: "act-1",
    animalId: "animal-1",
    durationSeconds: 120,
    completedAt: NOW - 1000,
    ...overrides,
  };
}

describe("lõpetatud tegevuse salvestamine", () => {
  it("salvestab korrektse lõpetatud tegevuse", async () => {
    const { store, rows } = createFakeStore();
    const result = await saveCompletedSession(store, DEVICE_A, body(), NOW);
    expect(result).toEqual({ ok: true, status: "created" });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      deviceId: DEVICE_A,
      activityId: "act-1",
      animalId: "animal-1",
      durationSeconds: 120,
    });
    expect(rows[0].completedAt.getTime()).toBe(NOW - 1000);
  });

  it("kasutab serveri aega, kui seadme lõpuhetk pole usutav", async () => {
    const { store, rows } = createFakeStore();
    await saveCompletedSession(store, DEVICE_A, body({ completedAt: NOW + 3_600_000 }), NOW);
    await saveCompletedSession(
      store,
      DEVICE_A,
      body({ clientSessionId: sessionId(2), completedAt: "eile" }),
      NOW,
    );
    expect(rows.map((row) => row.completedAt.getTime())).toEqual([NOW, NOW]);
  });

  it("säilitab tegeliku lõpuhetke, kui telefon oli tunde lukus", async () => {
    const { store, rows } = createFakeStore();
    const threeHoursAgo = NOW - 3 * 3_600_000;
    await saveCompletedSession(store, DEVICE_A, body({ completedAt: threeHoursAgo }), NOW);
    expect(rows[0].completedAt.getTime()).toBe(threeHoursAgo);
  });
});

describe("serveripoolne valideerimine", () => {
  const invalid = { ok: false, reason: "invalid" };

  it("keeldub lubamatust kestusest", async () => {
    const { store, rows } = createFakeStore();
    for (const durationSeconds of [0, 30, 90, 660, -60, "120", null]) {
      expect(
        await saveCompletedSession(store, DEVICE_A, body({ durationSeconds }), NOW),
      ).toEqual(invalid);
    }
    expect(rows).toHaveLength(0);
  });

  it("keeldub tundmatust või peidetud tegevusest ja loomast", async () => {
    const { store, rows } = createFakeStore();
    expect(
      await saveCompletedSession(store, DEVICE_A, body({ activityId: "puudub" }), NOW),
    ).toEqual(invalid);
    expect(
      await saveCompletedSession(store, DEVICE_A, body({ animalId: "puudub" }), NOW),
    ).toEqual(invalid);
    expect(rows).toHaveLength(0);
  });

  it("keeldub vigasest seadme või taimerikorra tunnusest", async () => {
    const { store, rows } = createFakeStore();
    expect(await saveCompletedSession(store, "minu-telefon", body(), NOW)).toEqual(invalid);
    expect(await saveCompletedSession(store, undefined, body(), NOW)).toEqual(invalid);
    expect(
      await saveCompletedSession(store, DEVICE_A, body({ clientSessionId: "abc" }), NOW),
    ).toEqual(invalid);
    expect(await saveCompletedSession(store, DEVICE_A, "tekst", NOW)).toEqual(invalid);
    expect(await saveCompletedSession(store, DEVICE_A, null, NOW)).toEqual(invalid);
    expect(rows).toHaveLength(0);
  });
});

describe("duplikaatkirjete vältimine", () => {
  it("sama taimerikorra teine salvestus ei tekita uut kirjet", async () => {
    const { store, rows } = createFakeStore();
    const first = await saveCompletedSession(store, DEVICE_A, body(), NOW);
    const second = await saveCompletedSession(store, DEVICE_A, body(), NOW + 500);
    const third = await saveCompletedSession(store, DEVICE_A, body(), NOW + 5000);
    expect(first).toEqual({ ok: true, status: "created" });
    expect(second).toEqual({ ok: true, status: "duplicate" });
    expect(third).toEqual({ ok: true, status: "duplicate" });
    expect(rows).toHaveLength(1);
  });

  it("kaks eri taimerikorda salvestuvad eraldi", async () => {
    const { store, rows } = createFakeStore();
    await saveCompletedSession(store, DEVICE_A, body(), NOW);
    await saveCompletedSession(store, DEVICE_A, body({ clientSessionId: sessionId(2) }), NOW);
    expect(rows).toHaveLength(2);
  });
});

describe("katkestatud tegevuse mittesalvestamine", () => {
  const run = {
    clientSessionId: sessionId(1),
    activityId: "act-1",
    animalId: "animal-1",
    durationSeconds: 60,
  };

  it("jooksev või pausil taimer ei anna salvestatavaid andmeid", () => {
    const running = createTimer(60_000, NOW);
    expect(completionPayload(running, run)).toBeNull();
    expect(completionPayload(pause(running, NOW + 30_000), run)).toBeNull();
  });

  it("nulli jõudnud taimer annab andmed koos tegeliku lõpuhetkega", () => {
    const finished = tick(createTimer(60_000, NOW), NOW + 90_000);
    expect(completionPayload(finished, run)).toEqual({ ...run, completedAt: NOW + 60_000 });
  });
});

describe("seadmepõhine ajalugu", () => {
  it("näitab ainult selle seadme kirjeid, uuemad eespool", async () => {
    const { store } = createFakeStore();
    await saveCompletedSession(store, DEVICE_A, body({ completedAt: NOW - 5000 }), NOW);
    await saveCompletedSession(
      store,
      DEVICE_A,
      body({ clientSessionId: sessionId(2), completedAt: NOW - 1000 }),
      NOW,
    );
    await saveCompletedSession(store, DEVICE_B, body({ clientSessionId: sessionId(3) }), NOW);

    const history = await listSessions(store, DEVICE_A);
    expect(history?.map((entry) => entry.id)).toEqual([sessionId(2), sessionId(1)]);
    expect(await listSessions(store, "vigane")).toBeNull();
  });

  it("tühjendamine kustutab ainult selle seadme kirjed", async () => {
    const { store, rows } = createFakeStore();
    await saveCompletedSession(store, DEVICE_A, body(), NOW);
    await saveCompletedSession(store, DEVICE_B, body({ clientSessionId: sessionId(2) }), NOW);

    expect(await clearSessions(store, DEVICE_A)).toBe(1);
    expect(rows).toHaveLength(1);
    expect(rows[0].deviceId).toBe(DEVICE_B);
    expect(await clearSessions(store, "vigane")).toBeNull();
  });

  it("hoiab seadme kohta alles ainult uusimad kirjed", async () => {
    const { store, rows } = createFakeStore();
    const total = MAX_SESSIONS_PER_DEVICE + 5;
    for (let i = 0; i < total; i++) {
      await saveCompletedSession(
        store,
        DEVICE_A,
        body({ clientSessionId: sessionId(i), completedAt: NOW - (total - i) * 1000 }),
        NOW,
      );
    }
    expect(rows).toHaveLength(MAX_SESSIONS_PER_DEVICE);
    // Vanimad viis on kustutatud.
    expect(rows.some((row) => row.clientSessionId === sessionId(0))).toBe(false);
    expect(rows.some((row) => row.clientSessionId === sessionId(total - 1))).toBe(true);
  });
});

describe("lõpuheli", () => {
  it("mängib ainult siis, kui heli on sisse lülitatud", () => {
    expect(shouldPlayChime(true, NOW, NOW + 200)).toBe(true);
    expect(shouldPlayChime(false, NOW, NOW + 200)).toBe(false);
  });

  it("jääb ära, kui lõpust on möödas üle minuti või taimer pole lõppenud", () => {
    expect(shouldPlayChime(true, NOW, NOW + 59_000)).toBe(true);
    expect(shouldPlayChime(true, NOW, NOW + 61_000)).toBe(false);
    expect(shouldPlayChime(true, null, NOW)).toBe(false);
  });
});
