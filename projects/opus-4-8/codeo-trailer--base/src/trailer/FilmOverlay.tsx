import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MONO } from "./fonts";
import { C } from "./theme";
import { timecode, weave } from "./util";

// Animated film grain. Re-seeding feTurbulence every frame makes the grain
// actually crawl instead of sitting as a static texture.
const Grain: React.FC<{ frame: number }> = ({ frame }) => (
  <svg
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      opacity: 0.06,
      mixBlendMode: "overlay",
      pointerEvents: "none",
    }}
  >
    <filter id="trailer-grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves={2}
        seed={frame % 73}
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#trailer-grain)" />
  </svg>
);

// Corner registration / framing marks — the cropped-print look.
const CornerMark: React.FC<{ corner: "tl" | "tr" | "bl" | "br" }> = ({
  corner,
}) => {
  const v = corner[0] === "t" ? "top" : "bottom";
  const h = corner[1] === "l" ? "left" : "right";
  const len = 26;
  const thick = 2;
  return (
    <div style={{ position: "absolute", [v]: 54, [h]: 54, width: len, height: len }}>
      <div
        style={{
          position: "absolute",
          [v]: 0,
          [h]: 0,
          width: len,
          height: thick,
          background: C.lineStrong,
        }}
      />
      <div
        style={{
          position: "absolute",
          [v]: 0,
          [h]: 0,
          width: thick,
          height: len,
          background: C.lineStrong,
        }}
      />
    </div>
  );
};

// Persistent overlays: grain, vignette, scanlines, framing marks and the
// timecode HUD. Sits above the scenes, reads the global frame.
export const FilmOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // HUD fades in once the leader hands off, dips out before the very end.
  const hud = interpolate(
    frame,
    [86, 104, durationInFrames - 40, durationInFrames - 16],
    [0, 0.62, 0.62, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // REC dot blinks roughly once per second; flicker rides projector noise.
  const recBlink = 0.45 + 0.55 * (Math.sin(frame * 0.42) > 0.1 ? 1 : 0.2);
  const flicker = 1 + weave(frame, 12) * 0.012;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* tiny global brightness flicker, like a running projector lamp */}
      <AbsoluteFill style={{ background: "#000", opacity: (1 - flicker) * 0.6 }} />

      {/* scanlines */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 1px, transparent 2px, transparent 3px)",
          opacity: 0.35,
          mixBlendMode: "multiply",
        }}
      />

      <Grain frame={frame} />

      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 100% at 50% 50%, transparent 52%, rgba(5,6,3,0.55) 100%)",
        }}
      />

      {/* HUD */}
      <AbsoluteFill style={{ opacity: hud }}>
        <CornerMark corner="tl" />
        <CornerMark corner="tr" />
        <CornerMark corner="bl" />
        <CornerMark corner="br" />

        <div
          style={{
            position: "absolute",
            top: 50,
            left: 92,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: MONO,
            fontSize: 19,
            letterSpacing: "0.14em",
            color: C.inkDim,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: C.rec,
              opacity: recBlink,
              boxShadow: `0 0 12px ${C.rec}`,
            }}
          />
          <span style={{ color: C.rec, opacity: recBlink }}>REC</span>
          <span>{timecode(frame, fps)}</span>
        </div>

        <div
          style={{
            position: "absolute",
            top: 50,
            right: 92,
            fontFamily: MONO,
            fontSize: 19,
            letterSpacing: "0.18em",
            color: C.inkDim,
          }}
        >
          CODEO&nbsp;BENCH <span style={{ color: C.accent }}>/ v1</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 50,
            left: 92,
            fontFamily: MONO,
            fontSize: 17,
            letterSpacing: "0.2em",
            color: C.inkFaint,
          }}
        >
          REMOTION 4.0.475
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 92,
            fontFamily: MONO,
            fontSize: 17,
            letterSpacing: "0.2em",
            color: C.inkFaint,
          }}
        >
          1920 × 1080 · 30 FPS
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
