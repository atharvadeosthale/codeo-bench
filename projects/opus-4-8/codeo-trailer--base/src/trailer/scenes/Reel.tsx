import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { MONO, SANS } from "../fonts";
import { C } from "../theme";

const CELL_W = 320;
const CELL_H = 182;
const GAP = 20;
const COUNT = 11;

// Each cell is an abstract "take" — a different little motion, so the strip
// reads as many videos from many models rather than one repeated tile.
const CellArt: React.FC<{ i: number; frame: number }> = ({ i, frame }) => {
  const p = frame * 0.11 + i * 1.7;
  const variant = i % 4;

  if (variant === 0) {
    const x = (Math.sin(p) * 0.5 + 0.5) * (CELL_W - 30);
    return (
      <>
        <div style={{ position: "absolute", left: x, top: 16, bottom: 16, width: 6, background: C.accent }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: C.line }} />
      </>
    );
  }
  if (variant === 1) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {[0, 1, 2].map((k) => {
          const s = ((p + k * 0.9) % 3) / 3;
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                width: 30 + s * 150,
                height: 30 + s * 150,
                borderRadius: "50%",
                border: `2px solid ${C.accent}`,
                opacity: (1 - s) * 0.8,
              }}
            />
          );
        })}
      </div>
    );
  }
  if (variant === 2) {
    return (
      <div style={{ position: "absolute", inset: 28, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <div
            key={k}
            style={{
              width: 22,
              height: 20 + (Math.sin(p + k * 0.7) * 0.5 + 0.5) * 100,
              background: k % 2 ? C.accent : C.inkDim,
            }}
          />
        ))}
      </div>
    );
  }
  const glyph = "RMTNXKVO".charAt(i % 8);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: 120,
        color: "transparent",
        WebkitTextStroke: `2px ${C.inkDim}`,
        transform: `translateX(${Math.sin(p) * 8}px)`,
      }}
    >
      {glyph}
    </div>
  );
};

const Cell: React.FC<{ i: number; frame: number }> = ({ i, frame }) => (
  <div
    style={{
      position: "relative",
      width: CELL_W,
      height: CELL_H,
      flex: "none",
      borderRadius: 6,
      overflow: "hidden",
      background: "linear-gradient(160deg, #171a10, #0b0c08)",
      border: `1px solid ${C.lineStrong}`,
      boxShadow: "inset 0 0 22px rgba(0,0,0,0.5)",
    }}
  >
    <CellArt i={i} frame={frame} />
    {/* lime sheen, matching the site's reel panels */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(180deg, rgba(212,255,63,0.08), transparent 36%), linear-gradient(0deg, rgba(5,6,3,0.5), transparent 45%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 8,
        right: 8,
        bottom: 6,
        display: "flex",
        justifyContent: "space-between",
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: "0.14em",
        color: C.inkDim,
      }}
    >
      <span>FR {String(i + 1).padStart(2, "0")}</span>
      <span>30 FPS</span>
    </div>
  </div>
);

// One perforation band (top or bottom of the strip).
const Sprockets: React.FC = () => (
  <div
    style={{
      height: 34,
      background: "#0c0e08",
      backgroundImage:
        "radial-gradient(circle at 21px 50%, rgba(238,240,226,0.18) 6px, transparent 7px)",
      backgroundSize: "42px 100%",
      backgroundRepeat: "repeat-x",
      borderBlock: `1px solid ${C.line}`,
    }}
  />
);

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();

  const fade = interpolate(frame, [0, 8, 100, 114], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // strip decelerates in from the right, then keeps a slow drift
  const stripW = COUNT * (CELL_W + GAP);
  const intro = interpolate(frame, [0, 60], [stripW * 0.5, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const drift = frame * 1.6;
  const scroll = -(intro + drift);

  // tilt settles over the scene for a touch of life
  const ry = interpolate(frame, [0, 90], [-20, -12], { extrapolateRight: "clamp" });
  const rx = interpolate(frame, [0, 90], [-14, -8], { extrapolateRight: "clamp" });

  const headWipe = interpolate(frame, [6, 26], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background: C.bg, opacity: fade }}>
      {/* heading */}
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", zIndex: 3 }}>
        <div style={{ clipPath: `inset(0 0 ${headWipe}% 0)` }}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 132,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: C.ink,
              lineHeight: 1,
            }}
          >
            THE <span style={{ color: C.accent }}>REEL</span>
          </div>
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 20,
            letterSpacing: "0.28em",
            color: C.inkDim,
            marginTop: 18,
          }}
        >
          EVERY VIDEO WRITTEN BY A MODEL · RENDERED UNTOUCHED
        </div>
      </div>

      {/* the 35mm strip */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1600 }}>
        <div
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
            marginTop: 120,
          }}
        >
          <div style={{ transform: `rotateX(${rx}deg) rotateY(${ry}deg) scale(0.92)`, transformStyle: "preserve-3d" }}>
            <div
              style={{
                background: "#070803",
                padding: "0",
                border: `1px solid ${C.lineStrong}`,
                borderRadius: 4,
                boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
              }}
            >
              <Sprockets />
              <div style={{ display: "flex", gap: GAP, padding: `18px ${GAP}px`, transform: `translateX(${scroll}px)` }}>
                {Array.from({ length: COUNT }, (_, i) => (
                  <Cell key={i} i={i} frame={frame} />
                ))}
              </div>
              <Sprockets />
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* floor glow, like the site's reel shadow */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 110,
          width: 760,
          height: 70,
          transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(212,255,63,0.08), transparent 70%)",
          filter: "blur(10px)",
        }}
      />
    </AbsoluteFill>
  );
};
