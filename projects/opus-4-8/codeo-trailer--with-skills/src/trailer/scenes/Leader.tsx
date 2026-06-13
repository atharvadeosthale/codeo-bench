import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, display, mono, seg, prog, EASE } from "../theme";

// Academy-leader cold open: a sweeping countdown reticle ticking 3 · 2 · 1.
// Pure film language — sets the screening-room tone before a single word.
export const Leader: React.FC<{ length: number }> = ({ length }) => {
  const frame = useCurrentFrame();

  const blockLen = 26;
  const count = 3 - Math.min(2, Math.floor(frame / blockLen)); // 3,2,1
  const inBlock = frame % blockLen;
  const sweepDeg = (inBlock / blockLen) * 360;

  // each numeral punches in then eases to rest
  const numIn = prog(inBlock, 0, 7, EASE.pop);
  const numScale = 0.86 + numIn * 0.14;
  const numOpacity = seg(inBlock, 0, 5, 0, 1) * seg(inBlock, blockLen - 5, blockLen - 1, 1, 0.2);

  const ringSize = 560;
  const flash = seg(frame, length - 4, length - 1, 0, 1);
  const intro = prog(frame, 0, 14, EASE.out);

  return (
    <AbsoluteFill style={{ background: C.bgDeep }}>
      {/* full-frame crosshair */}
      <AbsoluteFill style={{ opacity: 0.5 * intro }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: 1,
            background: C.line,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 1,
            background: C.line,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            width: ringSize,
            height: ringSize,
            opacity: intro,
            transform: `scale(${0.96 + intro * 0.04})`,
          }}
        >
          {/* sweeping wipe */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `conic-gradient(from -90deg, ${C.accentSoft} 0deg, transparent ${sweepDeg}deg, transparent 360deg)`,
              maskImage:
                "radial-gradient(circle, black 0 99%, transparent 99%)",
              WebkitMaskImage:
                "radial-gradient(circle, black 0 99%, transparent 99%)",
            }}
          />
          {/* outer + inner rings */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `1.5px solid ${C.lineStrong}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: ringSize * 0.16,
              borderRadius: "50%",
              border: `1px solid ${C.line}`,
            }}
          />
          {/* sweep hand */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: ringSize / 2,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${C.accent})`,
              transformOrigin: "left center",
              transform: `rotate(${sweepDeg - 90}deg)`,
            }}
          />
          {/* center hub */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 8,
              height: 8,
              marginLeft: -4,
              marginTop: -4,
              borderRadius: 999,
              background: C.accent,
            }}
          />
          {/* numeral */}
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <span
              style={{
                fontFamily: display,
                fontWeight: 800,
                fontSize: 300,
                lineHeight: 1,
                color: C.ink,
                opacity: numOpacity,
                transform: `scale(${numScale})`,
                fontVariationSettings: '"opsz" 96',
              }}
            >
              {count}
            </span>
          </AbsoluteFill>
        </div>
      </AbsoluteFill>

      {/* corner slate text */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: mono,
          fontSize: 18,
          letterSpacing: "0.5em",
          textIndent: "0.5em",
          color: C.inkDim,
          opacity: intro * 0.9,
        }}
      >
        SCREENING&nbsp;REEL
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: mono,
          fontSize: 16,
          letterSpacing: "0.32em",
          color: C.inkFaint,
          opacity: intro * 0.8,
        }}
      >
        A&nbsp;VISUAL&nbsp;BENCHMARK&nbsp;OF&nbsp;AI-GENERATED&nbsp;VIDEO
      </div>

      {/* cut flash */}
      <AbsoluteFill style={{ background: C.ink, opacity: flash }} />
    </AbsoluteFill>
  );
};
