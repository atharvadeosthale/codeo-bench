import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { MONO, SANS } from "../fonts";
import { C } from "../theme";

type Seg = { t: string; a?: boolean };
type Beat = { idx: string; label: string; rows: Seg[][] };

const BEATS: Beat[] = [
  { idx: "01", label: "THE TASK", rows: [[{ t: "ONE " }, { t: "PROMPT.", a: true }]] },
  {
    idx: "02",
    label: "THE STAGE",
    rows: [[{ t: "ONE PINNED " }, { t: "TEMPLATE.", a: true }]],
  },
  {
    idx: "03",
    label: "THE FIELD",
    rows: [[{ t: "EVERY MODEL," }], [{ t: "THE " }, { t: "SAME BRIEF.", a: true }]],
  },
  {
    idx: "04",
    label: "THE RULE",
    rows: [[{ t: "RENDERED" }], [{ t: "UNTOUCHED.", a: true }]],
  },
  {
    idx: "05",
    label: "THE VERDICT",
    rows: [[{ t: "NO SCORES." }], [{ t: "NO RANKINGS.", a: true }]],
  },
];

const BEAT_LEN = 37;

const Row: React.FC<{ segs: Seg[]; local: number; delay: number }> = ({
  segs,
  local,
  delay,
}) => {
  const t = local - delay;
  const wipe = interpolate(t, [0, 13], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const x = interpolate(t, [0, 16], [-46, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        clipPath: `inset(0 ${wipe}% 0 0)`,
        transform: `translateX(${x}px)`,
        whiteSpace: "nowrap",
      }}
    >
      {segs.map((s, i) => (
        <span key={i} style={{ color: s.a ? C.accent : C.ink }}>
          {s.t}
        </span>
      ))}
    </div>
  );
};

export const Manifesto: React.FC = () => {
  const frame = useCurrentFrame();
  const beatIndex = Math.min(Math.floor(frame / BEAT_LEN), BEATS.length - 1);
  const beatLocal = frame - beatIndex * BEAT_LEN;
  const beat = BEATS[beatIndex];

  // one-frame cut flash on every hard cut
  const flash = beatLocal < 2 ? 0.16 : 0;

  // giant ghost numeral parallax behind the line
  const ghostX = interpolate(beatLocal, [0, 30], [60, -30]);

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* faint editorial grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px)`,
          backgroundSize: "100% 180px",
          opacity: 0.5,
        }}
      />

      {/* huge ghost index numeral */}
      <div
        style={{
          position: "absolute",
          right: -40,
          top: 40,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 760,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: `2px ${C.line}`,
          transform: `translateX(${ghostX}px)`,
        }}
      >
        {beat.idx}
      </div>

      {/* moving accent bar that re-keys each beat */}
      <div
        style={{
          position: "absolute",
          left: 196,
          top: "50%",
          width: 6,
          height: interpolate(beatLocal, [0, 14], [0, 230], {
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }),
          transform: "translateY(-50%)",
          background: C.accent,
          boxShadow: `0 0 18px ${C.accentSoft}`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 244,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: "0.34em",
            color: C.inkDim,
            marginBottom: 26,
          }}
        >
          {beat.idx} / {beat.label}
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 158,
            lineHeight: 0.96,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
          }}
        >
          {beat.rows.map((segs, i) => (
            <Row key={i} segs={segs} local={beatLocal} delay={i * 6} />
          ))}
        </div>
      </div>

      {/* beat ticker */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 244,
          display: "flex",
          gap: 12,
        }}
      >
        {BEATS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === beatIndex ? 38 : 14,
              height: 4,
              background: i <= beatIndex ? C.accent : C.lineStrong,
            }}
          />
        ))}
      </div>

      <AbsoluteFill style={{ background: "#f4ffe0", opacity: flash }} />
    </AbsoluteFill>
  );
};
