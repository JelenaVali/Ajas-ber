import { describe, expect, it } from "vitest";
import { groupByDay } from "./historyGroups";
import type { HistoryEntry } from "./sessions";

function entry(id: string, date: Date): HistoryEntry {
  return {
    id,
    completedAt: date.toISOString(),
    durationSeconds: 120,
    activity: { slug: "hambapesu", name: "Hambapesu", color: "sky" },
    animal: { slug: "karu", name: "Karu" },
  };
}

describe("ajaloo rühmitamine päevade kaupa", () => {
  // Kohalik aeg, et test ei sõltuks masina ajavööndist.
  const now = new Date(2026, 10, 10, 20, 0, 0);

  it("eristab tänast, eilset ja varasemat", () => {
    const groups = groupByDay(
      [
        entry("a", new Date(2026, 10, 10, 19, 42)),
        entry("b", new Date(2026, 10, 10, 7, 15)),
        entry("c", new Date(2026, 10, 9, 20, 5)),
        entry("d", new Date(2026, 10, 3, 8, 0)),
      ],
      now.getTime(),
    );
    expect(groups.map((group) => group.kind)).toEqual(["today", "yesterday", "earlier"]);
    expect(groups.map((group) => group.entries.map((item) => item.id))).toEqual([
      ["a", "b"],
      ["c"],
      ["d"],
    ]);
  });

  it("tühi ajalugu annab tühja loendi", () => {
    expect(groupByDay([], now.getTime())).toEqual([]);
  });
});
