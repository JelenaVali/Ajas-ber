// Tegevuste rekvisiidikihid. Iga kiht joonistatakse looma peale samas
// koordinaadistikus (viewBox 0 -20 200 240), nii et see sobib iga loomaga.
// Uue tegevuse lisamiseks lisa siia kiht ja käe asend; tundmatu slug saab
// lihtsalt lehvitava looma ilma rekvisiidita.

import type { ArmPose } from "@/components/AnimalFigure";

const ARM_POSES: Record<string, ArmPose> = {
  hambapesu: "brush",
  riietumine: "wave",
  "vannis-pesemine": "wave",
  mangimine: "wave",
  koristamine: "wave",
  pidzaama: "down",
};

export function armPoseFor(activitySlug: string): ArmPose {
  return ARM_POSES[activitySlug] ?? "wave";
}

const SOFT = { stroke: "rgba(47,49,71,0.22)", strokeWidth: 2 };

function Toothbrushing() {
  return (
    <>
      <g className="aj-brush">
        <rect x="106" y="96" width="50" height="7" rx="3.5" fill="#4aa9e0" {...SOFT} />
        <rect x="94" y="91" width="20" height="10" rx="3" fill="#ffffff" {...SOFT} />
      </g>
      <g fill="#ffffff" stroke="rgba(74,169,224,0.6)" strokeWidth="1.5">
        <circle className="aj-foam" cx="88" cy="106" r="6" />
        <circle className="aj-foam aj-delay-1" cx="99" cy="111" r="5" />
        <circle className="aj-foam aj-delay-2" cx="80" cy="99" r="4" />
        <circle className="aj-foam aj-delay-3" cx="110" cy="108" r="3.5" />
      </g>
      <g fill="#ffd95a">
        <path className="aj-twinkle" d="M168 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
        <path className="aj-twinkle aj-delay-2" d="M26 52 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" />
      </g>
    </>
  );
}

function Shirt({ fill, children }: { fill: string; children?: React.ReactNode }) {
  return (
    <g>
      <path
        d="M58 136 Q100 118 142 136 L158 166 L144 174 L142 196 Q100 210 58 196 L56 174 L42 166 Z"
        fill={fill}
        strokeLinejoin="round"
        {...SOFT}
      />
      <path d="M84 127 Q100 142 116 127" fill="none" stroke="rgba(47,49,71,0.25)" strokeWidth="3" strokeLinecap="round" />
      {children}
    </g>
  );
}

function Dressing() {
  return (
    <>
      <g className="aj-dress">
        <Shirt fill="#ff9fb5">
          <g stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.85">
            <line x1="62" y1="158" x2="138" y2="158" />
            <line x1="60" y1="176" x2="140" y2="176" />
          </g>
        </Shirt>
      </g>
      {/* Sokk ja müts ootavad kõrval oma järjekorda */}
      <g className="aj-hop">
        <path d="M14 172 h16 v22 q14 2 14 12 q0 8 -10 8 h-12 q-8 0 -8 -8z" fill="#7cc7f0" strokeLinejoin="round" {...SOFT} />
        <rect x="14" y="172" width="16" height="7" fill="#ffffff" opacity="0.8" />
      </g>
      <g className="aj-hop aj-delay-2">
        <path d="M160 214 q0 -26 18 -26 q18 0 18 26z" fill="#ffd95a" strokeLinejoin="round" {...SOFT} />
        <circle cx="178" cy="186" r="6" fill="#ff9fb5" {...SOFT} />
      </g>
    </>
  );
}

function Bathing() {
  return (
    <>
      <g className="aj-bob">
        <g fill="#ffffff" stroke="rgba(74,169,224,0.5)" strokeWidth="1.5">
          <circle cx="88" cy="30" r="11" />
          <circle cx="104" cy="24" r="13" />
          <circle cx="118" cy="32" r="9" />
        </g>
      </g>
      <g fill="rgba(255,255,255,0.75)" stroke="#7cc7f0" strokeWidth="2">
        <circle className="aj-bubble" cx="30" cy="140" r="8" />
        <circle className="aj-bubble aj-delay-1" cx="172" cy="130" r="10" />
        <circle className="aj-bubble aj-delay-2" cx="52" cy="120" r="6" />
        <circle className="aj-bubble aj-delay-3" cx="152" cy="146" r="7" />
        <circle className="aj-bubble aj-delay-4" cx="16" cy="110" r="5" />
      </g>
      <rect x="20" y="206" width="14" height="14" rx="5" fill="#b9c4d6" />
      <rect x="166" y="206" width="14" height="14" rx="5" fill="#b9c4d6" />
      <path d="M12 160 H188 V186 Q188 214 160 214 H40 Q12 214 12 186 Z" fill="#ffffff" strokeLinejoin="round" {...SOFT} />
      <rect x="6" y="152" width="188" height="14" rx="7" fill="#7cc7f0" {...SOFT} />
      <g fill="#ffffff" stroke="rgba(74,169,224,0.5)" strokeWidth="1.5">
        <circle cx="40" cy="152" r="10" />
        <circle cx="56" cy="148" r="8" />
        <circle cx="140" cy="149" r="9" />
        <circle cx="158" cy="153" r="11" />
        <circle cx="100" cy="151" r="7" />
      </g>
      <g className="aj-hop">
        <ellipse cx="34" cy="196" rx="12" ry="9" fill="#ffd95a" {...SOFT} />
        <circle cx="42" cy="186" r="7" fill="#ffd95a" {...SOFT} />
        <path d="M47 186 l8 2 -8 3z" fill="#f5a742" />
        <circle cx="43" cy="184" r="1.5" fill="#2f3147" />
      </g>
    </>
  );
}

function Playing() {
  return (
    <>
      <rect x="6" y="184" width="30" height="30" rx="5" fill="#7cc7f0" {...SOFT} />
      <rect x="20" y="156" width="28" height="28" rx="5" fill="#ffd95a" {...SOFT} />
      <rect x="2" y="158" width="20" height="26" rx="5" fill="#ff9fb5" {...SOFT} />
      <polygon points="34,156 20,132 6,158" fill="#8fcf6e" strokeLinejoin="round" {...SOFT} />
      <ellipse cx="176" cy="216" rx="14" ry="3" fill="rgba(47,49,71,0.15)" />
      <g className="aj-bounce">
        <circle cx="176" cy="196" r="18" fill="#ff8a7a" {...SOFT} />
        <path d="M160 190 Q176 204 192 190" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <circle cx="170" cy="188" r="3" fill="#ffffff" opacity="0.7" />
      </g>
    </>
  );
}

function Tidying() {
  return (
    <>
      <rect className="aj-fly" x="8" y="186" width="20" height="20" rx="4" fill="#7cc7f0" {...SOFT} />
      <rect className="aj-fly aj-delay-2" x="14" y="190" width="18" height="18" rx="4" fill="#ffd95a" {...SOFT} />
      <circle className="aj-fly aj-delay-4" cx="22" cy="198" r="10" fill="#ff8a7a" {...SOFT} />
      <path d="M136 172 H198 L194 216 H140 Z" fill="#f0a35e" strokeLinejoin="round" {...SOFT} />
      <rect x="132" y="166" width="68" height="12" rx="5" fill="#d98848" {...SOFT} />
      <path d="M167 184 l4 9 10 1 -8 6 3 10 -9 -6 -9 6 3 -10 -8 -6 10 -1z" fill="#ffe9a8" />
      <g fill="#ffd95a">
        <path className="aj-twinkle" d="M182 138 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" />
        <path className="aj-twinkle aj-delay-2" d="M150 146 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
      </g>
    </>
  );
}

function Pyjamas() {
  return (
    <>
      <g className="aj-bob">
        <Shirt fill="#b9a6ee">
          <g fill="#ffe9a8">
            <circle cx="76" cy="154" r="4" />
            <circle cx="122" cy="150" r="4" />
            <circle cx="100" cy="170" r="4" />
            <circle cx="70" cy="184" r="4" />
            <circle cx="130" cy="184" r="4" />
          </g>
        </Shirt>
      </g>
      <path d="M176 -6 a20 20 0 1 0 16 30 a16 16 0 0 1 -16 -30z" fill="#ffe08a" {...SOFT} />
      <g fill="#ffd95a">
        <path className="aj-twinkle" d="M22 4 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" />
        <path className="aj-twinkle aj-delay-2" d="M150 40 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
        <path className="aj-twinkle aj-delay-4" d="M44 48 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
      </g>
      {/* Kaisukaru */}
      <g className="aj-rock">
        <circle cx="14" cy="166" r="6" fill="#c9966b" {...SOFT} />
        <circle cx="38" cy="166" r="6" fill="#c9966b" {...SOFT} />
        <ellipse cx="26" cy="200" rx="16" ry="15" fill="#c9966b" {...SOFT} />
        <circle cx="26" cy="176" r="14" fill="#c9966b" {...SOFT} />
        <ellipse cx="26" cy="181" rx="6" ry="4.5" fill="#f0d9b8" />
        <circle cx="21" cy="174" r="1.8" fill="#2f3147" />
        <circle cx="31" cy="174" r="1.8" fill="#2f3147" />
        <circle cx="26" cy="180" r="1.8" fill="#2f3147" />
      </g>
    </>
  );
}

const LAYERS: Record<string, () => React.ReactNode> = {
  hambapesu: Toothbrushing,
  riietumine: Dressing,
  "vannis-pesemine": Bathing,
  mangimine: Playing,
  koristamine: Tidying,
  pidzaama: Pyjamas,
};

export function ActivityProp({ slug, className }: { slug: string; className?: string }) {
  const Layer = LAYERS[slug];
  if (!Layer) return null;
  return (
    <svg viewBox="0 -20 200 240" className={className} aria-hidden="true">
      <Layer />
    </svg>
  );
}
