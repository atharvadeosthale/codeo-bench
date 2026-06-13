import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, display, mono, seg, prog, EASE } from "../theme";

const CLAPPER =
  `repeating-linear-gradient(-45deg, ${C.accent} 0 22px, ${C.bg} 22px 44px)`;

// Final lockup: the wordmark assembles (solid CODEO over outline BENCH, the
// site's exact treatment), the version chip snaps in, then a clapperboard
// closes the take.
export const Lockup: React.FC<{ length: number }> = ({ length }) => {
  const frame = useCurrentFrame();

  const codeo = prog(frame, 8, 34, EASE.expo);
  const bench = prog(frame, 24, 56, EASE.expo);
  const chip = interpolate(prog(frame, 48, 66, EASE.pop), [0, 1], [0, 1]);
  const tagIn = seg(frame, 64, 84, 0, 1);
  const ctaIn = seg(frame, 80, 102, 0, 1);

  // clapperboard snap
  const armRot = interpolate(prog(frame, length - 40, length - 22, EASE.in), [0, 1], [-20, 0]);
  const contact = frame >= length - 22;
  const snapFlash = seg(frame, length - 22, length - 20, 1, 0) * (contact ? 1 : 0);
  const shake = contact ? Math.sin((frame - (length - 22)) * 3) * (4 * seg(frame, length - 22, length - 12, 1, 0)) : 0;
  const toBlack = seg(frame, length - 20, length - 6, 0, 1);

  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${shake}px)`,
        }}
      >
        <div style={{ position: "relative", textAlign: "center" }}>
          {/* version chip */}
          <div
            style={{
              position: "absolute",
              top: -28,
              right: -64,
              fontFamily: mono,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.16em",
              padding: "8px 16px",
              color: C.bg,
              background: C.accent,
              borderRadius: 5,
              transform: `scale(${chip}) rotate(${(1 - chip) * -10 - 4}deg)`,
              boxShadow: "0 10px 30px rgba(212,255,63,0.32)",
            }}
          >
            v1
          </div>

          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 240,
              lineHeight: 0.86,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: C.ink,
              clipPath: `inset(0 0 ${(1 - codeo) * 100}% 0)`,
              fontVariationSettings: '"opsz" 96',
            }}
          >
            Codeo
          </div>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: 240,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: "transparent",
              WebkitTextStroke: `2.5px ${C.accent}`,
              filter: "drop-shadow(0 0 30px rgba(212,255,63,0.28))",
              clipPath: `inset(0 0 ${(1 - bench) * 100}% 0)`,
              fontVariationSettings: '"opsz" 96',
            }}
          >
            Bench
          </div>
        </div>

        <div
          style={{
            marginTop: 34,
            fontFamily: mono,
            fontSize: 20,
            letterSpacing: "0.36em",
            textIndent: "0.36em",
            color: C.inkDim,
            textTransform: "uppercase",
            opacity: tagIn,
            transform: `translateY(${(1 - tagIn) * 10}px)`,
          }}
        >
          Code&nbsp;+&nbsp;Video&nbsp;·&nbsp;The&nbsp;Remotion&nbsp;Benchmark
        </div>

        <div
          style={{
            marginTop: 30,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: ctaIn,
            transform: `translateY(${(1 - ctaIn) * 10}px)`,
          }}
        >
          <span
            style={{
              width: 0,
              height: 0,
              borderTop: "11px solid transparent",
              borderBottom: "11px solid transparent",
              borderLeft: `18px solid ${C.accent}`,
            }}
          />
          <span
            style={{
              fontFamily: display,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: "-0.01em",
              color: C.ink,
            }}
          >
            Press play. Judge for yourself.
          </span>
        </div>
      </AbsoluteFill>

      {/* credit */}
      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: mono,
          fontSize: 15,
          letterSpacing: "0.24em",
          color: C.inkFaint,
          textTransform: "uppercase",
          opacity: ctaIn,
        }}
      >
        Built&nbsp;by&nbsp;@atharvabuilds
      </div>

      {/* clapperboard arm snapping shut */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "140%",
          height: 64,
          background: CLAPPER,
          transformOrigin: "left top",
          transform: `rotate(${armRot}deg)`,
          opacity: frame >= length - 42 ? 1 : 0,
          boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
        }}
      />
      {/* snap flash + cut to black */}
      <AbsoluteFill style={{ background: C.ink, opacity: snapFlash }} />
      <AbsoluteFill style={{ background: "#000", opacity: toBlack }} />
    </AbsoluteFill>
  );
};
