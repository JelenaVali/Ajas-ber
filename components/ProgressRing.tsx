const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
  /** Möödunud aja osakaal vahemikus 0–1. */
  progress: number;
  className?: string;
};

/** Visuaalne loendur: värviline ring, mis aja möödudes tühjeneb. */
export function ProgressRing({ progress, className }: Props) {
  const done = Math.min(1, Math.max(0, progress));
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r={RADIUS} fill="#ffffff" stroke="rgba(47,49,71,0.1)" strokeWidth="6" />
      <circle
        cx="50"
        cy="50"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * done}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 200ms linear" }}
      />
    </svg>
  );
}
