import type { HistoryEntry } from "@/lib/sessions";

export type DayKind = "today" | "yesterday" | "earlier";

export type DayGroup = {
  /** Päeva algus seadme ajavööndis (millisekundites); sobib võtmeks. */
  dayStart: number;
  kind: DayKind;
  entries: HistoryEntry[];
};

function startOfDay(time: number): number {
  const date = new Date(time);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Rühmitab ajaloo päevade kaupa seadme ajavööndis. Eeldab, et kirjed on juba
 * järjestatud uuemast vanemani, nagu server need annab.
 */
export function groupByDay(entries: HistoryEntry[], now: number): DayGroup[] {
  const today = startOfDay(now);
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.getTime();

  const groups: DayGroup[] = [];
  for (const entry of entries) {
    const dayStart = startOfDay(new Date(entry.completedAt).getTime());
    let group = groups[groups.length - 1];
    if (!group || group.dayStart !== dayStart) {
      const kind: DayKind =
        dayStart === today ? "today" : dayStart === yesterday ? "yesterday" : "earlier";
      group = { dayStart, kind, entries: [] };
      groups.push(group);
    }
    group.entries.push(entry);
  }
  return groups;
}
