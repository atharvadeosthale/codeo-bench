import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, display, mono, seg, prog, EASE } from "../theme";

// The payoff line, using the site's signature solid-over-outline lockup.
export const Thesis: React.FC<{ length: number }> = ({ length }) => {
  const frame = useCurrentFrame();

  const l1 = prog(frame, 4, 28, EASE.expo);
  const l2 = prog(frame, 20, 50, EASE.expo);
  const push = 1 + prog(frame, 0, length, EASE.inOut) * 0.05;
  const ruleW = prog(frame, 30, 58, EASE.out);
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
      <div style={{ textAlign: "center", transform: `scale(${push})` }}>
        <div
          style={{
            fontFamily: mono,
            fontSize: 18,
            letterSpacing: "0.4em",
            textIndent: "0.4em",
            color: C.inkDim,
            marginBottom: 30,
            opacity: seg(frame, 0, 18, 0, 1),
          }}
        >
          THE&nbsp;SAME&nbsp;BRIEF
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 168,
            lineHeight: 0.96,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            color: C.ink,
            clipPath: `inset(0 0 ${(1 - l1) * 100}% 0)`,
            fontVariationSettings: '"opsz" 96',
          }}
        >
          Many models.
        </div>
        <div
          style={{
            height: 3,
            width: 520,
            margin: "26px auto",
            background: C.lineStrong,
            transformOrigin: "center",
            transform: `scaleX(${ruleW})`,
          }}
        />
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: 168,
            lineHeight: 0.96,
            letterSpacing: "-0.035em",
            textTransform: "uppercase",
            color: "transparent",
            WebkitTextStroke: `2px ${C.accent}`,
            filter: "drop-shadow(0 0 26px rgba(212,255,63,0.28))",
            clipPath: `inset(0 0 ${(1 - l2) * 100}% 0)`,
            fontVariationSettings: '"opsz" 96',
          }}
        >
          One vision each.
        </div>
      </div>
    </AbsoluteFill>
  );
};
