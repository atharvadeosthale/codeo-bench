import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, display, mono, seg, prog, EASE } from "../theme";

const NEGATIONS = ["NO SCORES", "NO RUBRICS", "NO ELO"];

const Stamp: React.FC<{ text: string; start: number; frame: number }> = ({
  text,
  start,
  frame,
}) => {
  const s = interpolate(
    prog(frame, start, start + 7, EASE.pop),
    [0, 1],
    [1.45, 1],
  );
  const op = seg(frame, start, start + 4, 0, 1);
  const rot = interpolate(prog(frame, start, start + 7, EASE.out), [0, 1], [-5, -2.2]);
  const strike = prog(frame, start + 3, start + 13, EASE.out);

  return (
    <div
      style={{
        position: "relative",
        opacity: op,
        transform: `scale(${s}) rotate(${rot}deg)`,
      }}
    >
      <span
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 96,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color: C.inkDim,
        }}
      >
        {text}
      </span>
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: -10,
          right: -10,
          height: 7,
          background: C.rec,
          transformOrigin: "left center",
          transform: `scaleX(${strike})`,
          boxShadow: `0 0 16px ${C.rec}`,
        }}
      />
    </div>
  );
};

// No scores, no rubrics, no Elo — struck out one by one — then the verdict
// lands on the only metric that matters here: you.
export const Manifesto: React.FC<{ length: number }> = ({ length }) => {
  const frame = useCurrentFrame();
  const starts = [8, 30, 52];

  const listExit = seg(frame, 78, 92, 0, 1);
  const payoff = prog(frame, 92, 124, EASE.expo);
  const judge = prog(frame, 108, 142, EASE.expo);
  const out = seg(frame, length - 16, length - 2, 1, 0);

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        alignItems: "center",
        justifyContent: "center",
        opacity: out,
      }}
    >
      {/* negations */}
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 12,
          opacity: 1 - listExit,
          transform: `translateY(${listExit * -50}px) scale(${1 - listExit * 0.06})`,
        }}
      >
        {NEGATIONS.map((t, i) => (
          <Stamp key={t} text={t} start={starts[i]} frame={frame} />
        ))}
      </div>

      {/* verdict */}
      <div
        style={{
          position: "absolute",
          textAlign: "center",
          opacity: payoff,
          transform: `scale(${interpolate(payoff, [0, 1], [0.92, 1])})`,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 18,
            letterSpacing: "0.4em",
            textIndent: "0.4em",
            color: C.inkDim,
            marginBottom: 24,
          }}
        >
          THE&nbsp;ONLY&nbsp;METRIC
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 150,
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            color: C.ink,
            fontVariationSettings: '"opsz" 96',
          }}
        >
          You are the{" "}
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: `2px ${C.accent}`,
              filter: "drop-shadow(0 0 24px rgba(212,255,63,0.3))",
              clipPath: `inset(0 ${(1 - judge) * 100}% 0 0)`,
              display: "inline-block",
            }}
          >
            judge.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
