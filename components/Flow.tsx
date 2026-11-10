"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, Minus, Play, Plus } from "lucide-react";
import { AnimalFigure } from "@/components/AnimalFigure";
import { Scene } from "@/components/Scene";
import { TimerScreen } from "@/components/TimerScreen";
import {
  clampMinutes,
  DEFAULT_MINUTES,
  MAX_MINUTES,
  MIN_MINUTES,
  PRESET_MINUTES,
} from "@/lib/duration";
import { activityName, animalName, getMessages, minutesLabel } from "@/lib/i18n";
import { getTheme } from "@/lib/themes";
import type { ActivityItem, AnimalItem } from "@/lib/types";

type Step = "activity" | "animal" | "time" | "timer";

type Props = {
  activities: ActivityItem[];
  animals: AnimalItem[];
};

/** Kogu lapse teekond: tegevus → loom → aeg → taimer → kiitus. */
export function Flow({ activities, animals }: Props) {
  const messages = getMessages();
  const [step, setStep] = useState<Step>("activity");
  const [activity, setActivity] = useState<ActivityItem | null>(null);
  const [animal, setAnimal] = useState<AnimalItem | null>(null);
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);

  // Iga uus ekraan algab ülevalt.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const startOver = () => {
    setActivity(null);
    setAnimal(null);
    setMinutes(DEFAULT_MINUTES);
    setStep("activity");
  };

  if (step === "timer" && activity && animal) {
    return (
      <TimerScreen activity={activity} animal={animal} minutes={minutes} onExit={startOver} />
    );
  }

  if (step === "time" && activity && animal) {
    const theme = getTheme(activity.color);
    return (
      <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-8">
        <StepHeader title={messages.steps.chooseTime} onBack={() => setStep("animal")} />

        <div className={`mx-auto w-full max-w-sm rounded-3xl p-4 ${theme.card}`}>
          <Scene
            animalSlug={animal.slug}
            activitySlug={activity.slug}
            title={`${animalName(animal, messages)} – ${activityName(activity, messages)}`}
            className="mx-auto w-[min(52vw,30vh)]"
          />
        </div>

        <ul className="grid grid-cols-5 gap-2 sm:gap-4">
          {PRESET_MINUTES.map((preset) => {
            const selected = preset === minutes;
            return (
              <li key={preset}>
                <button
                  type="button"
                  aria-pressed={selected}
                  aria-label={minutesLabel(preset, messages)}
                  onClick={() => setMinutes(preset)}
                  className={`aj-press relative flex aspect-square w-full flex-col items-center justify-center rounded-3xl text-4xl font-extrabold shadow-sm sm:text-5xl ${
                    selected
                      ? `${theme.solid} text-white ring-4 ring-ink ring-offset-2 ring-offset-cream`
                      : `${theme.card} ${theme.text}`
                  }`}
                >
                  {preset}
                  <span className="text-sm font-bold sm:text-base">min</span>
                  {selected && (
                    <Check
                      aria-hidden="true"
                      className="absolute -right-2 -top-2 size-8 rounded-full bg-ink p-1 text-white"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label={messages.time.less}
            disabled={minutes <= MIN_MINUTES}
            onClick={() => setMinutes((value) => clampMinutes(value - 1))}
            className="aj-press flex size-20 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-40"
          >
            <Minus aria-hidden="true" className="size-10" strokeWidth={3} />
          </button>
          <p
            aria-live="polite"
            aria-label={`${messages.time.selected}: ${minutesLabel(minutes, messages)}`}
            className="min-w-44 text-center text-4xl font-extrabold sm:text-5xl"
          >
            {minutesLabel(minutes, messages)}
          </p>
          <button
            type="button"
            aria-label={messages.time.more}
            disabled={minutes >= MAX_MINUTES}
            onClick={() => setMinutes((value) => clampMinutes(value + 1))}
            className="aj-press flex size-20 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-40"
          >
            <Plus aria-hidden="true" className="size-10" strokeWidth={3} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setStep("timer")}
          className={`aj-press mx-auto flex min-h-24 w-full max-w-md items-center justify-center gap-4 rounded-full px-10 text-4xl font-extrabold text-white shadow-lg ${theme.solid}`}
        >
          <Play aria-hidden="true" className="size-10 fill-current" />
          {messages.time.start}
        </button>
      </main>
    );
  }

  if (step === "animal" && activity) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-4xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-8">
        <StepHeader title={messages.steps.chooseAnimal} onBack={() => setStep("activity")} />
        <ul className="grid grid-cols-3 gap-3 sm:gap-5 md:grid-cols-4">
          {animals.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setAnimal(item);
                  setStep("time");
                }}
                className="aj-press flex w-full flex-col items-center gap-1 rounded-3xl bg-white p-2 shadow-sm sm:p-4"
              >
                <AnimalFigure slug={item.slug} className="h-auto w-full" />
                <span className="text-lg font-bold sm:text-xl">
                  {animalName(item, messages)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <header className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-lavender-deep sm:text-6xl">
          {messages.app.name}
        </h1>
        <p className="mt-2 text-2xl font-bold sm:text-3xl">{messages.app.greeting}</p>
      </header>

      <section aria-labelledby="choose-activity">
        <h2 id="choose-activity" className="sr-only">
          {messages.home.chooseActivity}
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {activities.map((item, index) => {
            const theme = getTheme(item.color);
            // Igal kaardil näitab tegevust ette eri loom.
            const guide = animals[(index * 2) % animals.length];
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActivity(item);
                    setStep("animal");
                  }}
                  className={`aj-press flex h-full w-full flex-col items-center gap-2 rounded-3xl p-3 shadow-sm sm:p-5 ${theme.card}`}
                >
                  <Scene
                    animalSlug={guide.slug}
                    activitySlug={item.slug}
                    still
                    className="w-[78%]"
                  />
                  <span className={`text-xl font-extrabold leading-tight sm:text-2xl ${theme.text}`}>
                    {activityName(item, messages)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

function StepHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const messages = getMessages();
  return (
    <header className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        className="aj-press flex min-h-16 items-center gap-2 rounded-full bg-white px-6 text-xl font-bold shadow-sm"
      >
        <ArrowLeft aria-hidden="true" className="size-7" strokeWidth={3} />
        {messages.steps.back}
      </button>
      <h1 className="flex-1 text-center text-3xl font-extrabold sm:text-4xl">{title}</h1>
      {/* Tasakaalustab tagasinuppu, et pealkiri jääks keskele. */}
      <span aria-hidden="true" className="hidden w-32 sm:block" />
    </header>
  );
}
