"use client";

import { Volume2, VolumeX } from "lucide-react";
import { getMessages } from "@/lib/i18n";
import { setSoundOn, unlockAudio, useSoundSetting } from "@/lib/sound";

/** Helinupp: kõlar = heli sees, läbikriipsutatud kõlar = heli väljas. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const messages = getMessages();
  const on = useSoundSetting();
  const label = on ? messages.sound.on : messages.sound.off;

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      title={label}
      onClick={() => {
        if (!on) unlockAudio();
        setSoundOn(!on);
      }}
      className={`aj-press flex size-16 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ${
        on ? "" : "opacity-70"
      } ${className}`}
    >
      {on ? (
        <Volume2 aria-hidden="true" className="size-8" />
      ) : (
        <VolumeX aria-hidden="true" className="size-8" />
      )}
    </button>
  );
}
