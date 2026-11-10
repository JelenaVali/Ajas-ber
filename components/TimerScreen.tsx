"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, X } from "lucide-react";
import { AnimalFigure } from "@/components/AnimalFigure";
import { ProgressRing } from "@/components/ProgressRing";
import { Scene } from "@/components/Scene";
import { SoundToggle } from "@/components/SoundToggle";
import { saveSession } from "@/lib/api";
import { completionPayload, shouldPlayChime } from "@/lib/completion";
import { newUuid } from "@/lib/deviceId";
import { activityName, animalName, getMessages } from "@/lib/i18n";
import { isSoundOn, playChime, unlockAudio } from "@/lib/sound";
import { getTheme } from "@/lib/themes";
import { formatClock } from "@/lib/timer";
import type { ActivityItem, AnimalItem } from "@/lib/types";
import { useTimer } from "@/lib/useTimer";
import { useWakeLock } from "@/lib/useWakeLock";

const CONFETTI_COLORS = ["#ff9fb5", "#7cc7f0", "#ffd95a", "#8fcf6e", "#b9a6ee", "#ffb07a"];
const CONFETTI = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 53 + 7) % 100}%`,
  delay: `${((index * 37) % 30) / 10}s`,
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
}));

type Props = {
  activity: ActivityItem;
  animal: AnimalItem;
  minutes: number;
  /** Laps lõpetas enne aega või valib pärast kiitust järgmise tegevuse. */
  onExit: () => void;
};

export function TimerScreen({ activity, animal, minutes, onExit }: Props) {
  const messages = getMessages();
  const theme = getTheme(activity.color);
  const timer = useTimer(minutes * 60);
  useWakeLock(timer.status === "running");

  // Kiitus valitakse üks kord ekraani avamisel, et see lõpus ei vahetuks.
  const [praise] = useState(
    () => messages.done.praises[Math.floor(Math.random() * messages.done.praises.length)],
  );

  // Ühe taimerikorra tunnus: server salvestab sama tunnusega kirje ainult korra.
  const [clientSessionId] = useState(newUuid);
  const completionHandled = useRef(false);

  // Taimeri lõpp: heli ja salvestamine toimuvad täpselt üks kord. Kiitus ei
  // oota salvestamist ja salvestamise viga lapsele ei näidata.
  useEffect(() => {
    if (completionHandled.current) return;
    const payload = completionPayload(
      { status: timer.status, finishedAt: timer.finishedAt },
      {
        clientSessionId,
        activityId: activity.id,
        animalId: animal.id,
        durationSeconds: minutes * 60,
      },
    );
    if (!payload) return;
    completionHandled.current = true;
    if (shouldPlayChime(isSoundOn(), payload.completedAt, Date.now())) playChime();
    void saveSession(payload);
  }, [timer.status, timer.finishedAt, clientSessionId, activity.id, animal.id, minutes]);

  const title = `${animalName(animal, messages)} – ${activityName(activity, messages)}`;

  if (timer.status === "finished") {
    return (
      <main
        className={`relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-4 py-8 text-center ${theme.card}`}
      >
        <SoundToggle className="absolute right-4 top-4 z-10" />
        <div aria-hidden="true">
          {CONFETTI.map((piece, index) => (
            <span
              key={index}
              className="aj-confetti"
              style={{ left: piece.left, animationDelay: piece.delay, background: piece.color }}
            />
          ))}
        </div>
        <div className="aj-scene w-[min(62vw,38vh)]">
          <AnimalFigure slug={animal.slug} mood="happy" arm="cheer" className="h-auto w-full" />
        </div>
        <h1
          role="status"
          className={`aj-pop text-5xl font-extrabold sm:text-6xl ${theme.text}`}
        >
          {praise}
        </h1>
        <button
          type="button"
          onClick={onExit}
          autoFocus
          className={`aj-press relative z-10 min-h-20 rounded-full px-10 py-5 text-2xl font-extrabold text-white shadow-lg sm:text-3xl ${theme.solid}`}
        >
          {messages.done.next}
        </button>
      </main>
    );
  }

  const paused = timer.status === "paused";

  return (
    <main
      className={`aj-timer ${theme.card}`}
    >
      <div className="flex w-full max-w-3xl flex-col gap-2 [grid-area:head]">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onExit}
            className="aj-press flex min-h-16 items-center gap-2 rounded-full bg-white px-5 text-lg font-bold shadow-sm"
          >
            <X aria-hidden="true" className="size-6" />
            {messages.timer.finish}
          </button>
          <SoundToggle />
        </div>
        <h1 tabIndex={-1} className={`text-center text-2xl font-extrabold outline-none sm:text-3xl ${theme.text}`}>
          {activityName(activity, messages)}
        </h1>
      </div>

      {/* Ring võtab enda alla ruumi, mis nuppudest ja numbritest üle jääb,
          nii et nupud mahuvad ekraanile ka väikesel telefonil. */}
      <div className="flex h-full min-h-0 w-full items-center justify-center [grid-area:ring]">
        <div className={`relative aspect-square h-full max-h-[34rem] max-w-full ${theme.text}`}>
          <ProgressRing progress={timer.progress} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Scene
              animalSlug={animal.slug}
              activitySlug={activity.slug}
              paused={paused}
              title={title}
              className="aj-timer-scene"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center [grid-area:clock]">
        <p
          role="timer"
          aria-label={messages.timer.timeLeft}
          className="text-[clamp(3.25rem,15vmin,6rem)] font-extrabold leading-none tabular-nums tracking-tight"
        >
          {formatClock(timer.secondsLeft)}
        </p>
        {/* Reserveeritud kõrgus, et nupud pausi ajal ei hüppaks. */}
        <p aria-live="polite" className={`h-7 text-xl font-bold ${theme.text}`}>
          {paused ? messages.timer.paused : ""}
        </p>
      </div>

      <div className="flex w-full max-w-xl items-stretch gap-3 [grid-area:ctrl]">
        <button
          type="button"
          onClick={() => {
            unlockAudio();
            if (paused) timer.resume();
            else timer.pause();
          }}
          className={`aj-press flex min-h-20 flex-1 items-center justify-center gap-3 rounded-full px-5 text-2xl font-extrabold text-white shadow-lg sm:text-3xl ${theme.solid}`}
        >
          {paused ? (
            <Play aria-hidden="true" className="size-9 fill-current" />
          ) : (
            <Pause aria-hidden="true" className="size-9 fill-current" />
          )}
          {paused ? messages.timer.resume : messages.timer.pause}
        </button>
        <button
          type="button"
          onClick={timer.restart}
          className="aj-press flex min-h-20 max-w-[42%] items-center justify-center gap-2 rounded-full bg-white px-4 text-base font-bold leading-tight shadow-sm sm:px-6 sm:text-xl"
        >
          <RotateCcw aria-hidden="true" className="size-7 shrink-0" />
          {messages.timer.restart}
        </button>
      </div>
    </main>
  );
}
