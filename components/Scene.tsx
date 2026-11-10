import { ActivityProp, armPoseFor } from "@/components/ActivityProp";
import { AnimalFigure } from "@/components/AnimalFigure";

type Props = {
  animalSlug: string;
  activitySlug: string;
  /** Peatab animatsioonid (taimer on pausil). */
  paused?: boolean;
  /** Liikumatu pilt, näiteks tegevuskaardil. */
  still?: boolean;
  title?: string;
  className?: string;
};

/** Loom, kes teeb tegevust: loomategelane ja selle peale tegevuse rekvisiidid. */
export function Scene({ animalSlug, activitySlug, paused, still, title, className = "" }: Props) {
  const state = still ? "aj-still" : paused ? "aj-paused" : "";
  return (
    <div
      className={`aj-scene relative aspect-[5/6] ${state} ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
    >
      <AnimalFigure
        slug={animalSlug}
        arm={armPoseFor(activitySlug)}
        className="absolute inset-0 h-full w-full"
      />
      <ActivityProp
        slug={activitySlug}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}
