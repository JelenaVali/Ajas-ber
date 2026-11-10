import { describe, expect, it } from "vitest";
import {
  createTimer,
  elapsedMs,
  formatClock,
  pause,
  progress,
  remainingMs,
  remainingSeconds,
  restart,
  resume,
  tick,
} from "./timer";

const MINUTE = 60_000;
const T0 = 1_000_000;

describe("taimeri käivitamine", () => {
  it("algab valitud kestusega ja jookseb kohe", () => {
    const timer = createTimer(2 * MINUTE, T0);
    expect(timer.status).toBe("running");
    expect(remainingMs(timer, T0)).toBe(2 * MINUTE);
    expect(remainingSeconds(timer, T0)).toBe(120);
  });

  it("järelejäänud aeg väheneb vastavalt möödunud ajale", () => {
    const timer = createTimer(2 * MINUTE, T0);
    expect(remainingMs(timer, T0 + 30_000)).toBe(90_000);
    expect(progress(timer, T0 + 30_000)).toBe(0.25);
  });

  it("jääb täpseks ka pärast pikka taustal olemist", () => {
    const timer = createTimer(5 * MINUTE, T0);
    // Ühtegi vahepealset kontrolli ei toimunud, aeg arvutatakse algushetkest.
    expect(remainingMs(timer, T0 + 4 * MINUTE + 500)).toBe(59_500);
  });
});

describe("paus ja jätkamine", () => {
  it("paus peatab aja kulgemise", () => {
    const paused = pause(createTimer(2 * MINUTE, T0), T0 + 20_000);
    expect(paused.status).toBe("paused");
    expect(remainingMs(paused, T0 + 20_000)).toBe(100_000);
    expect(remainingMs(paused, T0 + 10 * MINUTE)).toBe(100_000);
  });

  it("jätkamine ei arvesta pausil oldud aega", () => {
    const paused = pause(createTimer(2 * MINUTE, T0), T0 + 20_000);
    const resumed = resume(paused, T0 + 5 * MINUTE);
    expect(resumed.status).toBe("running");
    expect(remainingMs(resumed, T0 + 5 * MINUTE + 10_000)).toBe(90_000);
  });

  it("mitu pausi järjest summeerivad jooksuaja õigesti", () => {
    let timer = createTimer(MINUTE, T0);
    timer = pause(timer, T0 + 10_000);
    timer = resume(timer, T0 + 100_000);
    timer = pause(timer, T0 + 115_000);
    timer = resume(timer, T0 + 200_000);
    expect(elapsedMs(timer, T0 + 205_000)).toBe(30_000);
  });

  it("jooksva taimeri jätkamine ja pausil oleva peatamine ei muuda midagi", () => {
    const running = createTimer(MINUTE, T0);
    expect(resume(running, T0 + 5_000)).toBe(running);
    const paused = pause(running, T0 + 5_000);
    expect(pause(paused, T0 + 9_000)).toBe(paused);
  });
});

describe("nulli jõudmine", () => {
  it("lõpeb, kui aeg saab täis", () => {
    const timer = createTimer(MINUTE, T0);
    expect(tick(timer, T0 + MINUTE - 1).status).toBe("running");
    const finished = tick(timer, T0 + MINUTE);
    expect(finished.status).toBe("finished");
    expect(remainingMs(finished, T0 + MINUTE)).toBe(0);
  });

  it("ei lähe negatiivseks", () => {
    const timer = createTimer(MINUTE, T0);
    expect(remainingMs(timer, T0 + 10 * MINUTE)).toBe(0);
    expect(remainingSeconds(timer, T0 + 10 * MINUTE)).toBe(0);
    expect(progress(timer, T0 + 10 * MINUTE)).toBe(1);
  });

  it("lõpp saabub ainult üks kord", () => {
    const finished = tick(createTimer(MINUTE, T0), T0 + MINUTE);
    // Korduv kontroll tagastab sama objekti, seega olek ei muutu uuesti.
    expect(tick(finished, T0 + 2 * MINUTE)).toBe(finished);
    expect(tick(finished, T0 + 3 * MINUTE)).toBe(finished);
  });

  it("salvestab tegeliku lõpuhetke, mitte märkamise hetke", () => {
    const timer = createTimer(MINUTE, T0);
    // Leht oli taustal ja märkas lõppu alles tund hiljem.
    const finished = tick(timer, T0 + 60 * MINUTE);
    expect(finished.finishedAt).toBe(T0 + MINUTE);
  });

  it("arvestab tegeliku lõpuhetke juures pause", () => {
    let timer = createTimer(MINUTE, T0);
    timer = pause(timer, T0 + 20_000);
    timer = resume(timer, T0 + 100_000);
    const finished = tick(timer, T0 + 500_000);
    expect(finished.finishedAt).toBe(T0 + 140_000);
  });

  it("lõppenud taimerit ei saa peatada ega jätkata", () => {
    const finished = tick(createTimer(MINUTE, T0), T0 + MINUTE);
    expect(pause(finished, T0 + 2 * MINUTE)).toBe(finished);
    expect(resume(finished, T0 + 2 * MINUTE)).toBe(finished);
  });

  it("paus pärast aja täitumist lõpetab taimeri, mitte ei peata seda", () => {
    const timer = createTimer(MINUTE, T0);
    expect(pause(timer, T0 + 2 * MINUTE).status).toBe("finished");
  });
});

describe("uuesti alustamine", () => {
  it("taastab valitud kestuse ja jätab taimeri pausile", () => {
    const timer = pause(createTimer(3 * MINUTE, T0), T0 + 50_000);
    const fresh = restart(timer);
    expect(fresh.status).toBe("paused");
    expect(remainingMs(fresh, T0 + 99_000)).toBe(3 * MINUTE);
    expect(fresh.finishedAt).toBeNull();
  });

  it("pärast uuesti alustamist jookseb täiskestus", () => {
    const fresh = restart(tick(createTimer(MINUTE, T0), T0 + MINUTE));
    const resumed = resume(fresh, T0 + 5 * MINUTE);
    expect(tick(resumed, T0 + 5 * MINUTE + 59_000).status).toBe("running");
    expect(tick(resumed, T0 + 6 * MINUTE).status).toBe("finished");
  });
});

describe("kellaaja vormindamine", () => {
  it("näitab minuteid ja sekundeid kahe numbriga", () => {
    expect(formatClock(120)).toBe("02:00");
    expect(formatClock(65)).toBe("01:05");
    expect(formatClock(600)).toBe("10:00");
    expect(formatClock(0)).toBe("00:00");
    expect(formatClock(-5)).toBe("00:00");
  });
});
