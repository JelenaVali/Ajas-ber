import { describe, expect, it } from "vitest";
import { clampMinutes, isValidDurationSeconds } from "./duration";

describe("lubatud aja valideerimine", () => {
  it("lubab täisminutid vahemikus 1–10 minutit", () => {
    for (let minutes = 1; minutes <= 10; minutes++) {
      expect(isValidDurationSeconds(minutes * 60)).toBe(true);
    }
  });

  it("keelab liiga lühikese ja liiga pika aja", () => {
    expect(isValidDurationSeconds(0)).toBe(false);
    expect(isValidDurationSeconds(30)).toBe(false);
    expect(isValidDurationSeconds(660)).toBe(false);
    expect(isValidDurationSeconds(-60)).toBe(false);
  });

  it("keelab poolikud minutid ja valet tüüpi väärtused", () => {
    expect(isValidDurationSeconds(90)).toBe(false);
    expect(isValidDurationSeconds(120.5)).toBe(false);
    expect(isValidDurationSeconds("120")).toBe(false);
    expect(isValidDurationSeconds(null)).toBe(false);
    expect(isValidDurationSeconds(Number.NaN)).toBe(false);
  });

  it("hoiab pluss- ja miinusnupu väärtuse vahemikus", () => {
    expect(clampMinutes(0)).toBe(1);
    expect(clampMinutes(11)).toBe(10);
    expect(clampMinutes(4)).toBe(4);
    expect(clampMinutes(Number.NaN)).toBe(2);
  });
});
