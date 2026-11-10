"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, RefreshCw, Trash2 } from "lucide-react";
import { AnimalFigure } from "@/components/AnimalFigure";
import { SoundToggle } from "@/components/SoundToggle";
import { clearHistory, fetchHistory } from "@/lib/api";
import { groupByDay, type DayGroup } from "@/lib/historyGroups";
import { activityName, animalName, getMessages, minutesLabel } from "@/lib/i18n";
import type { HistoryEntry } from "@/lib/sessions";
import { getTheme } from "@/lib/themes";

type State =
  | { phase: "loading" }
  | { phase: "error" }
  | { phase: "ready"; entries: HistoryEntry[]; loadedAt: number };

const dayFormat = new Intl.DateTimeFormat("et-EE", { day: "numeric", month: "long" });
const timeFormat = new Intl.DateTimeFormat("et-EE", { hour: "2-digit", minute: "2-digit" });

/** Vaade „Minu tegevused": selle seadme lõpetatud tegevused päevade kaupa. */
export function HistoryView() {
  const messages = getMessages();
  const [state, setState] = useState<State>({ phase: "loading" });
  const [clearFailed, setClearFailed] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const load = useCallback(async () => {
    setState({ phase: "loading" });
    try {
      const entries = await fetchHistory();
      setState({ phase: "ready", entries, loadedAt: Date.now() });
    } catch {
      setState({ phase: "error" });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmClear = async () => {
    dialogRef.current?.close();
    setClearFailed(false);
    try {
      await clearHistory();
      setState({ phase: "ready", entries: [], loadedAt: Date.now() });
    } catch {
      setClearFailed(true);
    }
  };

  const dayTitle = (group: DayGroup) =>
    group.kind === "today"
      ? messages.history.today
      : group.kind === "yesterday"
        ? messages.history.yesterday
        : dayFormat.format(group.dayStart);

  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex items-center gap-3">
        <Link
          href="/"
          className="aj-press flex min-h-16 items-center gap-2 rounded-full bg-white px-6 text-xl font-bold shadow-sm"
        >
          <ArrowLeft aria-hidden="true" className="size-7" strokeWidth={3} />
          {messages.steps.back}
        </Link>
        <h1 className="flex-1 text-center text-2xl font-extrabold sm:text-4xl">
          {messages.history.title}
        </h1>
        <SoundToggle />
      </header>

      {state.phase === "loading" && (
        <p role="status" className="py-16 text-center text-2xl font-bold">
          {messages.history.loading}
        </p>
      )}

      {state.phase === "error" && (
        <section role="alert" className="rounded-3xl bg-pink-soft p-8 text-center shadow-sm">
          <AnimalFigure slug="siil" className="mx-auto h-auto w-32" />
          <p className="mt-2 text-2xl font-bold text-pink-deep">{messages.history.loadError}</p>
          <button
            type="button"
            onClick={() => void load()}
            className="aj-press mx-auto mt-6 flex min-h-16 items-center gap-2 rounded-full bg-white px-8 text-xl font-bold text-pink-deep shadow"
          >
            <RefreshCw aria-hidden="true" className="size-6" />
            {messages.errors.retry}
          </button>
        </section>
      )}

      {state.phase === "ready" && state.entries.length === 0 && (
        <section className="rounded-3xl bg-lavender-soft p-8 text-center shadow-sm">
          <AnimalFigure slug="karu" arm="wave" className="aj-scene mx-auto h-auto w-40" />
          <h2 className="mt-2 text-3xl font-extrabold text-lavender-deep">
            {messages.history.emptyTitle}
          </h2>
          <p className="mt-2 text-xl">{messages.history.emptyBody}</p>
          <Link
            href="/"
            className="aj-press mt-6 inline-flex min-h-16 items-center rounded-full bg-lavender-deep px-8 text-xl font-bold text-white shadow"
          >
            {messages.history.chooseActivity}
          </Link>
        </section>
      )}

      {state.phase === "ready" && state.entries.length > 0 && (
        <>
          {groupByDay(state.entries, state.loadedAt).map((group) => (
            <section key={group.dayStart} aria-labelledby={`day-${group.dayStart}`}>
              <h2 id={`day-${group.dayStart}`} className="mb-3 text-2xl font-extrabold">
                {dayTitle(group)}
              </h2>
              <ul className="flex flex-col gap-3">
                {group.entries.map((entry) => {
                  const theme = getTheme(entry.activity.color);
                  return (
                    <li
                      key={entry.id}
                      className={`flex items-center gap-4 rounded-3xl p-3 shadow-sm sm:p-4 ${theme.card}`}
                    >
                      <AnimalFigure slug={entry.animal.slug} className="h-auto w-20 shrink-0 sm:w-24" />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xl font-extrabold leading-tight sm:text-2xl ${theme.text}`}>
                          {activityName(entry.activity, messages)}
                        </p>
                        <p className="text-lg font-bold">{animalName(entry.animal, messages)}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 text-lg">
                          <span>{minutesLabel(entry.durationSeconds / 60, messages)}</span>
                          <span className="flex items-center gap-1">
                            <Clock aria-hidden="true" className="size-5" />
                            <time dateTime={entry.completedAt}>
                              {timeFormat.format(new Date(entry.completedAt))}
                            </time>
                          </span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {clearFailed && (
            <p role="alert" className="rounded-2xl bg-pink-soft p-4 text-center text-lg font-bold text-pink-deep">
              {messages.history.clearError}
            </p>
          )}

          <button
            type="button"
            onClick={() => dialogRef.current?.showModal()}
            className="aj-press mx-auto mt-4 flex min-h-14 items-center gap-2 rounded-full bg-white px-6 text-lg font-bold shadow-sm"
          >
            <Trash2 aria-hidden="true" className="size-6" />
            {messages.history.clear}
          </button>
        </>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="clear-title"
        className="m-auto w-[min(92vw,28rem)] rounded-3xl bg-cream p-6 text-center text-ink shadow-xl backdrop:bg-ink/50"
      >
        <h2 id="clear-title" className="text-2xl font-extrabold">
          {messages.history.confirmTitle}
        </h2>
        <p className="mt-2 text-lg">{messages.history.confirmBody}</p>
        <div className="mt-6 flex flex-col gap-3">
          {/* Ohutu valik on suur ja esimene; kustutamine väiksem. */}
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
            className="aj-press min-h-20 rounded-full bg-lavender-deep px-8 text-2xl font-extrabold text-white shadow"
          >
            {messages.history.keep}
          </button>
          <button
            type="button"
            onClick={() => void confirmClear()}
            className="aj-press mx-auto flex min-h-14 items-center gap-2 rounded-full bg-white px-6 text-lg font-bold text-pink-deep shadow-sm"
          >
            <Trash2 aria-hidden="true" className="size-5" />
            {messages.history.remove}
          </button>
        </div>
      </dialog>
    </main>
  );
}
