import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, CLAMP, MONO, SANS } from "../theme";
import { FadeUp, MaskRise, SceneBg } from "../ui";

const SMPTE = ["#a8a8a0", "#aaa83e", "#3ba8a4", "#3ca83e", "#a43ca4", "#a33b3b", "#2f2fa6"];

// Title card: the site's hero rebuilt as an end card — wordmark pop,
// giant solid/outline lines, roll-tape cue, then fade to FIN.
export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagPop = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 11, stiffness: 170 },
  });
  const contentFade = interpolate(frame, [124, 142], [1, 0], CLAMP);
  const push = interpolate(frame, [0, 142], [1, 1.035], CLAMP);

  // roll-tape cue: lime segment dropping down a hairline, on loop
  const cueT = ((frame - 64 + 540) % 54) / 54;
  const cueTop = interpolate(cueT, [0, 1], [-50, 110]);

  return (
    <AbsoluteFill>
      <SceneBg glowX={50} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: contentFade,
          transform: `scale(${push})`,
        }}
      >
        {/* wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            marginBottom: 54,
          }}
        >
          <MaskRise at={28} dur={18}>
            <span
              style={{
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 54,
                letterSpacing: "-0.01em",
                color: C.ink,
              }}
            >
              CODEO
            </span>
          </MaskRise>
          <span
            style={{
              fontFamily: MONO,
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: "0.18em",
              padding: "6px 13px",
              color: C.bg,
              background: C.accent,
              borderRadius: 4,
              display: "inline-block",
              opacity: frame < 40 ? 0 : 1,
              transform: `translateY(-6px) scale(${tagPop}) rotate(${(1 - tagPop) * -14 - 3}deg)`,
              boxShadow: "0 8px 26px rgba(212, 255, 63, 0.3)",
            }}
          >
            BENCH
          </span>
        </div>
        {/* hero giant */}
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "-0.035em",
            lineHeight: 0.94,
            fontSize: 188,
            textAlign: "center",
          }}
        >
          <MaskRise at={6} dur={24} style={{ display: "block" }}>
            <span style={{ color: C.ink }}>Remotion</span>
          </MaskRise>
          <MaskRise at={14} dur={24} style={{ display: "block" }}>
            <span
              style={{
                color: "transparent",
                WebkitTextStroke: `3px ${C.accent}`,
                filter: "drop-shadow(0 0 28px rgba(212, 255, 63, 0.22))",
              }}
            >
              Benchmark
            </span>
          </MaskRise>
        </div>
        <FadeUp at={50} dur={18} style={{ marginTop: 52 }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: C.inkDim,
            }}
          >
            SAME PROMPT · SAME TEMPLATE · YOUR VERDICT
          </span>
        </FadeUp>
        {/* roll-tape scroll cue */}
        <FadeUp at={66} dur={16} style={{ marginTop: 44 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 17,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: C.accent,
              }}
            >
              roll tape
            </span>
            <div
              style={{
                width: 1,
                height: 52,
                background: C.lineStrong,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  width: "100%",
                  height: "50%",
                  top: `${cueTop}%`,
                  background: C.accent,
                }}
              />
            </div>
          </div>
        </FadeUp>
      </AbsoluteFill>
      {/* footer color bars, a last wink of the site's footer */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 56,
          height: 6,
          display: "flex",
          opacity: 0.7 * contentFade,
        }}
      >
        {SMPTE.map((c) => (
          <span key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
      {/* FIN */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <FadeUp at={150} dur={14}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 19,
              letterSpacing: "0.5em",
              textIndent: "0.5em",
              textTransform: "uppercase",
              color: C.inkFaint,
            }}
          >
            FIN — CODEO BENCH · V1 · 2026
          </span>
        </FadeUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
