// Loomategelased. Kõik loomad kasutavad sama kehakuju; liik erineb värvide,
// kõrvade ja näo detailide poolest. Uue looma lisamiseks lisa SPECS-i kirje
// (ja soovi korral eridetailid allpool). Tundmatu slug saab üldise tegelase.

export type Mood = "idle" | "happy";
export type ArmPose = "down" | "wave" | "brush" | "cheer";

type EarType = "round" | "small" | "long" | "pointed" | "floppy" | "big" | "horns" | "none";

type Spec = {
  body: string;
  belly: string;
  head?: string;
  limb?: string;
  feet?: string;
  ears: EarType;
  earColor?: string;
  earInner?: string;
  snout?: string;
  nose?: string;
  /** Valge silmamuna tumeda pupilliga (muidu lihtne tume silm). */
  sclera?: boolean;
};

const INK = "#2f3147";
const OUTLINE = { stroke: "rgba(47,49,71,0.22)", strokeWidth: 2 };

const SPECS: Record<string, Spec> = {
  karu: { body: "#b9855a", belly: "#ecd0aa", ears: "round", earInner: "#ecd0aa", snout: "#f3dfc2", nose: "#4a3428" },
  janes: { body: "#ded6cf", belly: "#ffffff", ears: "long", earInner: "#f7b8c6", snout: "#ffffff", nose: "#f08aa0" },
  kass: { body: "#f4b26b", belly: "#fde2bd", ears: "pointed", earInner: "#f7b8c6", snout: "#fde2bd", nose: "#e0707f" },
  koer: { body: "#e3b98a", belly: "#f7e3c8", ears: "floppy", earColor: "#9c6b43", snout: "#f7e3c8", nose: "#3b2b22" },
  rebane: { body: "#f08a4b", belly: "#fff3e6", ears: "pointed", earInner: "#5a3a2a", nose: "#3b2b22" },
  siil: { body: "#f1d3b0", belly: "#fbe9d2", ears: "small", earInner: "#e8b98f", snout: "#fbe9d2", nose: "#3b2b22" },
  panda: { body: "#ffffff", belly: "#ffffff", limb: "#2f2f3a", ears: "round", earColor: "#2f2f3a", snout: "#ffffff", nose: "#2f2f3a", sclera: true },
  lovi: { body: "#f6c95c", belly: "#fde9b0", ears: "round", earInner: "#fde9b0", snout: "#fde9b0", nose: "#8a4b2a" },
  elevant: { body: "#a9bfd6", belly: "#c9d8e8", ears: "big", earInner: "#f3c4d0" },
  kaelkirjak: { body: "#f6d06a", belly: "#fde9b0", ears: "horns", snout: "#fbe3b5", nose: "#8a5a2a" },
  pingviin: { body: "#3d4a66", belly: "#ffffff", feet: "#f5a742", ears: "none" },
  konn: { body: "#8fcf6e", belly: "#d9f2b8", ears: "none", sclera: true },
};

const FALLBACK: Spec = {
  body: "#c9b8f0",
  belly: "#efe8ff",
  ears: "round",
  earInner: "#efe8ff",
  snout: "#ffffff",
  nose: "#5b45a3",
};

/** Siili okkad: sakiline kuju keha ja pea taga. */
function spikePoints(): string {
  const points: string[] = [];
  const count = 26;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const outer = i % 2 === 0;
    const rx = outer ? 90 : 74;
    const ry = outer ? 108 : 92;
    points.push(
      `${(100 + Math.cos(angle) * rx).toFixed(1)},${(108 + Math.sin(angle) * ry).toFixed(1)}`,
    );
  }
  return points.join(" ");
}
const SPIKES = spikePoints();

const ARM_RIGHT: Record<ArmPose, string> = {
  down: "",
  wave: "aj-arm-wave",
  brush: "aj-arm-brush",
  cheer: "aj-arm-cheer-r",
};

type Props = {
  slug: string;
  mood?: Mood;
  arm?: ArmPose;
  /** Kui antud, loetakse pilt ekraanilugerile ette; muidu on see dekoratiivne. */
  title?: string;
  className?: string;
};

export function AnimalFigure({ slug, mood = "idle", arm = "down", title, className }: Props) {
  const s = SPECS[slug] ?? FALLBACK;
  const head = s.head ?? s.body;
  const limb = s.limb ?? s.body;
  const feet = s.feet ?? limb;
  const earColor = s.earColor ?? head;
  const happy = mood === "happy";
  const isFrog = slug === "konn";
  const eyeY = isFrog ? 40 : 74;
  const eyeLine = slug === "panda" ? "#ffffff" : INK;

  return (
    <svg
      viewBox="0 -20 200 240"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g className={happy ? "aj-jump" : "aj-bob"}>
        {/* Keha taga olevad osad */}
        {slug === "siil" && <polygon points={SPIKES} fill="#8a5a3c" {...OUTLINE} />}
        {slug === "lovi" && (
          <circle cx="100" cy="78" r="57" fill="#d98b3a" stroke="#c9772b" strokeWidth="14" strokeDasharray="15 9" strokeLinecap="round" />
        )}
        {slug === "rebane" && (
          <g transform="rotate(28 158 186)">
            <ellipse cx="158" cy="186" rx="20" ry="36" fill={s.body} {...OUTLINE} />
            <ellipse cx="158" cy="160" rx="13" ry="14" fill="#ffffff" />
          </g>
        )}
        {slug === "kass" && (
          <path d="M146 196 C182 198 186 160 168 150" fill="none" stroke={s.body} strokeWidth="13" strokeLinecap="round" />
        )}
        {s.ears === "big" && (
          <>
            <circle cx="40" cy="78" r="35" fill={earColor} {...OUTLINE} />
            <circle cx="160" cy="78" r="35" fill={earColor} {...OUTLINE} />
            <circle cx="42" cy="80" r="22" fill={s.earInner} />
            <circle cx="158" cy="80" r="22" fill={s.earInner} />
          </>
        )}

        {/* Jalad ja keha */}
        <ellipse cx="76" cy="208" rx="19" ry="9" fill={feet} {...OUTLINE} />
        <ellipse cx="124" cy="208" rx="19" ry="9" fill={feet} {...OUTLINE} />
        <ellipse cx="100" cy="160" rx="52" ry="50" fill={s.body} {...OUTLINE} />
        <ellipse cx="100" cy="168" rx="34" ry="35" fill={s.belly} />
        {slug === "kaelkirjak" && (
          <g fill="#c98a3a">
            <circle cx="62" cy="150" r="7" />
            <circle cx="140" cy="158" r="8" />
            <circle cx="66" cy="184" r="6" />
            <circle cx="136" cy="190" r="5" />
          </g>
        )}

        {/* Kõrvad, mis jäävad pea taha */}
        {s.ears === "round" && (
          <>
            <circle cx="62" cy="40" r="17" fill={earColor} {...OUTLINE} />
            <circle cx="138" cy="40" r="17" fill={earColor} {...OUTLINE} />
            {s.earInner && (
              <>
                <circle cx="62" cy="41" r="9" fill={s.earInner} />
                <circle cx="138" cy="41" r="9" fill={s.earInner} />
              </>
            )}
          </>
        )}
        {s.ears === "small" && (
          <>
            <circle cx="64" cy="44" r="11" fill={earColor} {...OUTLINE} />
            <circle cx="136" cy="44" r="11" fill={earColor} {...OUTLINE} />
            <circle cx="64" cy="45" r="5" fill={s.earInner} />
            <circle cx="136" cy="45" r="5" fill={s.earInner} />
          </>
        )}
        {s.ears === "long" && (
          <>
            <ellipse cx="80" cy="20" rx="12" ry="36" fill={earColor} {...OUTLINE} transform="rotate(-8 80 20)" />
            <ellipse cx="120" cy="20" rx="12" ry="36" fill={earColor} {...OUTLINE} transform="rotate(8 120 20)" />
            <ellipse cx="80" cy="22" rx="5" ry="25" fill={s.earInner} transform="rotate(-8 80 20)" />
            <ellipse cx="120" cy="22" rx="5" ry="25" fill={s.earInner} transform="rotate(8 120 20)" />
          </>
        )}
        {s.ears === "pointed" && (
          <>
            <polygon points="56,60 50,10 94,36" fill={earColor} strokeLinejoin="round" {...OUTLINE} />
            <polygon points="144,60 150,10 106,36" fill={earColor} strokeLinejoin="round" {...OUTLINE} />
            <polygon points="62,48 58,24 80,38" fill={s.earInner} />
            <polygon points="138,48 142,24 120,38" fill={s.earInner} />
          </>
        )}
        {s.ears === "horns" && (
          <>
            <ellipse cx="50" cy="56" rx="13" ry="7" fill={earColor} {...OUTLINE} transform="rotate(-24 50 56)" />
            <ellipse cx="150" cy="56" rx="13" ry="7" fill={earColor} {...OUTLINE} transform="rotate(24 150 56)" />
            <g stroke="#c98a3a" strokeWidth="6" strokeLinecap="round">
              <line x1="84" y1="38" x2="80" y2="12" />
              <line x1="116" y1="38" x2="120" y2="12" />
            </g>
            <circle cx="80" cy="10" r="6" fill="#8a5a2a" />
            <circle cx="120" cy="10" r="6" fill="#8a5a2a" />
          </>
        )}

        {/* Pea */}
        <circle cx="100" cy="78" r="48" fill={head} {...OUTLINE} />

        {/* Liigile omased näo osad */}
        {slug === "pingviin" && (
          <g fill="#ffffff">
            <circle cx="83" cy="78" r="24" />
            <circle cx="117" cy="78" r="24" />
            <ellipse cx="100" cy="96" rx="30" ry="22" />
          </g>
        )}
        {slug === "panda" && (
          <g fill="#2f2f3a">
            <ellipse cx="80" cy="74" rx="13" ry="16" transform="rotate(-14 80 74)" />
            <ellipse cx="120" cy="74" rx="13" ry="16" transform="rotate(14 120 74)" />
          </g>
        )}
        {slug === "koer" && <circle cx="120" cy="72" r="17" fill="#9c6b43" />}
        {slug === "rebane" && (
          <path d="M55 88 Q100 68 145 88 Q139 124 100 126 Q61 124 55 88Z" fill="#ffffff" />
        )}
        {slug === "kass" && (
          <g stroke="#d98a3a" strokeWidth="4" strokeLinecap="round">
            <line x1="100" y1="34" x2="100" y2="48" />
            <line x1="86" y1="37" x2="88" y2="49" />
            <line x1="114" y1="37" x2="112" y2="49" />
          </g>
        )}
        {slug === "kaelkirjak" && (
          <g fill="#c98a3a">
            <circle cx="66" cy="62" r="6" />
            <circle cx="136" cy="60" r="7" />
            <circle cx="100" cy="42" r="5" />
          </g>
        )}
        {isFrog && (
          <>
            <circle cx="72" cy="40" r="20" fill={head} {...OUTLINE} />
            <circle cx="128" cy="40" r="20" fill={head} {...OUTLINE} />
          </>
        )}
        {s.ears === "floppy" && (
          <>
            <ellipse cx="52" cy="76" rx="14" ry="32" fill={earColor} {...OUTLINE} transform="rotate(12 52 76)" />
            <ellipse cx="148" cy="76" rx="14" ry="32" fill={earColor} {...OUTLINE} transform="rotate(-12 148 76)" />
          </>
        )}

        {/* Põsed */}
        <circle cx="66" cy="95" r="7" fill="#ff9fb5" opacity="0.55" />
        <circle cx="134" cy="95" r="7" fill="#ff9fb5" opacity="0.55" />

        {/* Silmad */}
        {happy ? (
          <g fill="none" stroke={eyeLine} strokeWidth="4" strokeLinecap="round">
            <path d={`M75 ${eyeY + 3} q7 -10 14 0`} />
            <path d={`M111 ${eyeY + 3} q7 -10 14 0`} />
          </g>
        ) : (
          <g className="aj-eyes">
            {s.sclera && (
              <>
                <circle cx="82" cy={eyeY} r={isFrog ? 12 : 8} fill="#ffffff" />
                <circle cx="118" cy={eyeY} r={isFrog ? 12 : 8} fill="#ffffff" />
              </>
            )}
            <circle cx="82" cy={eyeY} r={s.sclera ? 5 : 6} fill={INK} />
            <circle cx="118" cy={eyeY} r={s.sclera ? 5 : 6} fill={INK} />
            <circle cx="84" cy={eyeY - 2} r="2" fill="#ffffff" />
            <circle cx="120" cy={eyeY - 2} r="2" fill="#ffffff" />
          </g>
        )}

        {/* Nina ja suu */}
        {slug === "elevant" ? (
          <path d="M100 84 C100 108 95 118 104 127" fill="none" stroke="#93abc4" strokeWidth="15" strokeLinecap="round" />
        ) : slug === "pingviin" ? (
          <polygon points="89,86 111,86 100,101" fill="#f5a742" strokeLinejoin="round" {...OUTLINE} />
        ) : isFrog ? (
          <>
            <circle cx="94" cy="76" r="2" fill={INK} />
            <circle cx="106" cy="76" r="2" fill={INK} />
            {happy ? (
              <path d="M72 90 q28 26 56 0z" fill="#8a3344" />
            ) : (
              <path d="M72 90 q28 20 56 0" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
            )}
          </>
        ) : (
          <>
            {s.snout && <ellipse cx="100" cy="95" rx="18" ry="13" fill={s.snout} />}
            {slug === "kass" && (
              <g stroke={INK} strokeWidth="1.8" strokeLinecap="round" opacity="0.6">
                <line x1="78" y1="93" x2="56" y2="89" />
                <line x1="78" y1="98" x2="56" y2="101" />
                <line x1="122" y1="93" x2="144" y2="89" />
                <line x1="122" y1="98" x2="144" y2="101" />
              </g>
            )}
            <ellipse cx="100" cy="89" rx="6.5" ry="4.5" fill={s.nose ?? INK} />
            {happy ? (
              <path d="M90 97 q10 14 20 0z" fill="#8a3344" />
            ) : (
              <path d="M92 98 q8 7 16 0" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            )}
            {slug === "janes" && !happy && (
              <rect x="96" y="102" width="8" height="7" rx="1.5" fill="#ffffff" stroke="rgba(47,49,71,0.3)" strokeWidth="1" />
            )}
            {slug === "koer" && happy && <ellipse cx="100" cy="106" rx="5" ry="6" fill="#f08aa0" />}
          </>
        )}

        {/* Käed: vasak ripub või rõõmustab, parem teeb tegevust */}
        <g className={arm === "cheer" ? "aj-arm-cheer-l" : undefined}>
          <ellipse cx="50" cy="156" rx="11" ry="24" fill={limb} {...OUTLINE} transform="rotate(14 50 156)" />
        </g>
        <g className={ARM_RIGHT[arm] || undefined}>
          <ellipse cx="150" cy="156" rx="11" ry="24" fill={limb} {...OUTLINE} transform="rotate(-14 150 156)" />
        </g>
      </g>
    </svg>
  );
}
