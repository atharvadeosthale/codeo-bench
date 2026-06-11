import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, EASE_OUT, EASE_SNAP, FONT_MONO, SMPTE } from "../theme";
import { DashRule } from "../ui/Type";

const COLLIDE = 44;
const BARS_AT = 196;
const BLACK_AT = 200;

const word: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 224,
  lineHeight: 1,
  letterSpacing: "-0.03em",
  textTransform: "uppercase",
  color: C.ink,
};

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ---- outro: SMPTE flash, then end-of-reel black ----
  if (frame >= BARS_AT && frame < BLACK_AT) {
    return (
      <AbsoluteFill style={{ display: "flex", flexDirection: "row" }}>
        {SMPTE.map((c) => (
          <div key={c} style={{ flex: 1, background: c }} />
        ))}
      </AbsoluteFill>
    );
  }
  if (frame >= BLACK_AT) {
    const o = interpolate(frame, [BLACK_AT + 3, BLACK_AT + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return (
      <AbsoluteFill
        style={{
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT_MONO,
            fontSize: 21,
            letterSpacing: "0.5em",
            textIndent: "0.5em",
            color: C.inkFaint,
            opacity: o,
          }}
        >
          END&nbsp;OF&nbsp;REEL&nbsp;01
        </div>
      </AbsoluteFill>
    );
  }

  // ---- approach: CODE + VIDEO slam together ----
  if (frame < COLLIDE) {
    const t = interpolate(frame, [4, COLLIDE], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE_SNAP,
    });
    const inOp = interpolate(frame, [4, 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const left = interpolate(t, [0, 1], [-560, -252]);
    const right = interpolate(t, [0, 1], [560, 285]);
    const plus = interpolate(t, [0.85, 1], [1, 0], {
      extrapolateLeft: "clamp",
    });
    return (
      <AbsoluteFill
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: inOp,
        }}
      >
        <div style={{ position: "relative", height: 240, width: "100%" }}>
          <div
            style={{
              ...word,
              position: "absolute",
              left: "50%",
              transform: `translateX(calc(-50% + ${left.toFixed(1)}px))`,
            }}
          >
            code
          </div>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) scale(${plus.toFixed(3)})`,
              fontFamily: FONT_MONO,
              fontSize: 70,
              color: C.accent,
              opacity: plus,
            }}
          >
            +
          </div>
          <div
            style={{
              ...word,
              position: "absolute",
              left: "50%",
              transform: `translateX(calc(-50% + ${right.toFixed(1)}px))`,
            }}
          >
            video
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // ---- resolved title card ----
  const settle = interpolate(frame, [COLLIDE, COLLIDE + 16], [1.05, 1], {
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const tagPop = spring({
    frame: frame - (COLLIDE + 16),
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.7 },
  });
  const subIn = interpolate(frame, [COLLIDE + 42, COLLIDE + 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const specIn = interpolate(frame, [COLLIDE + 66, COLLIDE + 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
  const cueIn = interpolate(frame, [COLLIDE + 84, COLLIDE + 98], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cueDrop = ((frame - COLLIDE) % 54) / 54;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          transform: `scale(${settle.toFixed(4)})`,
        }}
      >
        {/* wordmark */}
        <div
          style={{ display: "flex", alignItems: "baseline", gap: 30 }}
        >
          <div style={word}>codeo</div>
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 46,
              fontWeight: 600,
              letterSpacing: "0.18em",
              padding: "10px 22px",
              color: C.bg,
              background: C.accent,
              borderRadius: 8,
              transform: `translateY(-14px) rotate(${(-3 * tagPop).toFixed(2)}deg) scale(${Math.max(0, tagPop).toFixed(3)})`,
              boxShadow: "0 14px 44px rgba(212,255,63,0.3)",
            }}
          >
            BENCH
          </div>
        </div>

        {/* subtitle between dashed rules */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            width: 1020,
            opacity: subIn,
          }}
        >
          <DashRule grow={subIn} />
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 24,
              letterSpacing: "0.42em",
              textIndent: "0.42em",
              whiteSpace: "nowrap",
              textTransform: "uppercase",
              color: C.inkDim,
            }}
          >
            the remotion benchmark
          </div>
          <DashRule grow={subIn} />
        </div>

        {/* spec line */}
        <div
          style={{
            display: "flex",
            gap: 18,
            fontFamily: FONT_MONO,
            fontSize: 20,
            letterSpacing: "0.16em",
            color: C.inkFaint,
            opacity: specIn,
            transform: `translateY(${((1 - specIn) * 14).toFixed(1)}px)`,
          }}
        >
          {["V1", "REMOTION 4.0.475", "1920×1080", "30 FPS", "NO SCORES"].map(
            (s, i) => (
              <React.Fragment key={s}>
                {i > 0 ? <span style={{ color: C.inkFaint }}>·</span> : null}
                <span style={{ color: i === 4 ? C.accent : undefined }}>
                  {s}
                </span>
              </React.Fragment>
            ),
          )}
        </div>

        {/* roll-tape cue */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            opacity: cueIn,
            marginTop: 6,
          }}
        >
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 18,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.inkDim,
            }}
          >
            roll tape
          </div>
          <div
            style={{
              position: "relative",
              width: 2,
              height: 64,
              background: C.lineStrong,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                width: "100%",
                height: "50%",
                top: `${(cueDrop * 160 - 50).toFixed(1)}%`,
                background: C.accent,
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
