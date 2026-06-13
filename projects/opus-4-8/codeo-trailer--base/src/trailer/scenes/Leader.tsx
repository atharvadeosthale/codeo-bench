import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { MONO, SANS } from "../fonts";
import { C } from "../theme";
import { weave } from "../util";

// Academy-style countdown leader: crosshair, rotating sweep that fills once
// per second, a punching 3·2·1, a cue-mark "cigarette burn", then a cut-flash.
const SEC = 30; // frames per count

export const Leader: React.FC = () => {
  const frame = useCurrentFrame();

  const count = 3 - Math.floor(frame / SEC); // 3, 2, 1
  const secFrame = frame % SEC;

  // sweep hand wipes 0→360° across each second
  const angle = (secFrame / SEC) * 360;

  // number punch-in on every new count
  const scale = interpolate(secFrame, [0, 9], [1.24, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const numOpacity = interpolate(
    secFrame,
    [0, 4, 24, SEC],
    [0, 1, 1, 0.7],
    { extrapolateRight: "clamp" },
  );

  // cue dot flashes in the last 8 frames of every second (top-right of frame)
  const cueOn = secFrame > SEC - 6 ? 1 : 0;

  // gate weave
  const wx = weave(frame, 3) * 3;
  const wy = weave(frame, 9) * 2;

  // final cut to white
  const flash = interpolate(frame, [86, 92, 96], [0, 0.95, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const D = 620; // leader disc diameter

  return (
    <AbsoluteFill style={{ background: C.bgDeep }}>
      <AbsoluteFill
        style={{
          transform: `translate(${wx}px, ${wy}px)`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* full-frame crosshair */}
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: C.line }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: C.line }} />

        <div style={{ position: "relative", width: D, height: D }}>
          {/* outer + inner rings */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `2px solid ${C.lineStrong}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 70,
              borderRadius: "50%",
              border: `1px solid ${C.line}`,
            }}
          />

          {/* sweep fill — conic wedge that grows then resets each second */}
          <div
            style={{
              position: "absolute",
              inset: 2,
              borderRadius: "50%",
              background: `conic-gradient(from -90deg, ${C.accentSoft} 0deg, rgba(212,255,63,0.04) ${angle}deg, transparent ${angle}deg)`,
            }}
          />

          {/* leading spoke */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 3,
              height: D / 2 - 2,
              background: C.accent,
              transformOrigin: "top center",
              transform: `translate(-50%, 0) rotate(${angle + 180}deg)`,
              boxShadow: `0 0 14px ${C.accent}`,
            }}
          />

          {/* the count */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 300,
              lineHeight: 1,
              color: C.ink,
              transform: `scale(${scale})`,
              opacity: numOpacity,
              textShadow: "0 0 60px rgba(0,0,0,0.6)",
            }}
          >
            {count > 0 ? count : ""}
          </div>
        </div>

        {/* labels */}
        <div
          style={{
            position: "absolute",
            top: 150,
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: "0.42em",
            color: C.inkDim,
          }}
        >
          PICTURE&nbsp;START
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 150,
            fontFamily: MONO,
            fontSize: 20,
            letterSpacing: "0.3em",
            color: C.inkFaint,
          }}
        >
          REEL 01 — CODEO BENCH
        </div>
      </AbsoluteFill>

      {/* cue mark */}
      <div
        style={{
          position: "absolute",
          top: 120,
          right: 220,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: C.ink,
          opacity: cueOn * 0.85,
          filter: "blur(1px)",
        }}
      />

      <AbsoluteFill style={{ background: "#f4ffe0", opacity: flash }} />
    </AbsoluteFill>
  );
};
