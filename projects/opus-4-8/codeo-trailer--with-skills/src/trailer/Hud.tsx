import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, mono, seg, timecode } from "./theme";

const bracket = (corner: "tl" | "tr" | "bl" | "br"): React.CSSProperties => {
  const s = 26;
  const t = 2;
  const base: React.CSSProperties = { position: "absolute", width: s, height: s };
  const edges = {
    tl: { top: 0, left: 0, borderTop: `${t}px solid`, borderLeft: `${t}px solid` },
    tr: { top: 0, right: 0, borderTop: `${t}px solid`, borderRight: `${t}px solid` },
    bl: { bottom: 0, left: 0, borderBottom: `${t}px solid`, borderLeft: `${t}px solid` },
    br: { bottom: 0, right: 0, borderBottom: `${t}px solid`, borderRight: `${t}px solid` },
  } as const;
  return { ...base, ...edges[corner], borderColor: C.accent };
};

// A persistent camera-viewfinder frame: registration brackets, a blinking REC
// dot, a running timecode, and a per-act slug. Frames every scene as "footage".
export const Hud: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // settle in over the first beat, then ride along; clear out for the lockup
  const intro = seg(frame, 6, 26, 0, 1);
  const outro = seg(frame, durationInFrames - 70, durationInFrames - 40, 1, 0);
  const opacity = intro * outro;

  const recOn = frame % 30 < 20; // ~1Hz blink, render-stable
  const cellPad = 54;

  return (
    <AbsoluteFill style={{ zIndex: 70, opacity, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: cellPad }}>
        <div style={bracket("tl")} />
        <div style={bracket("tr")} />
        <div style={bracket("bl")} />
        <div style={bracket("br")} />
      </div>

      {/* top-left: REC */}
      <div
        style={{
          position: "absolute",
          top: cellPad,
          left: cellPad + 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: mono,
          fontSize: 18,
          letterSpacing: "0.22em",
          color: C.ink,
        }}
      >
        <span
          style={{
            width: 11,
            height: 11,
            borderRadius: 999,
            background: C.rec,
            opacity: recOn ? 1 : 0.18,
            boxShadow: recOn ? `0 0 12px ${C.rec}` : "none",
          }}
        />
        REC
      </div>

      {/* top-right: timecode */}
      <div
        style={{
          position: "absolute",
          top: cellPad,
          right: cellPad + 40,
          fontFamily: mono,
          fontSize: 18,
          letterSpacing: "0.14em",
          color: C.accent,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        TC {timecode(frame, fps)}
      </div>

      {/* bottom-left: stock label */}
      <div
        style={{
          position: "absolute",
          bottom: cellPad,
          left: cellPad + 40,
          fontFamily: mono,
          fontSize: 16,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: C.inkDim,
        }}
      >
        CODEO&nbsp;BENCH · v1
      </div>

      {/* bottom-center: current act slug */}
      <div
        style={{
          position: "absolute",
          bottom: cellPad,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: mono,
          fontSize: 16,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: C.inkDim,
        }}
      >
        {label}
      </div>

      {/* bottom-right: engine */}
      <div
        style={{
          position: "absolute",
          bottom: cellPad,
          right: cellPad + 40,
          fontFamily: mono,
          fontSize: 16,
          letterSpacing: "0.16em",
          color: C.inkDim,
        }}
      >
        REMOTION 4.0.475
      </div>
    </AbsoluteFill>
  );
};
