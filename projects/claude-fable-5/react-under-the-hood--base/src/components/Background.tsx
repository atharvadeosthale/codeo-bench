import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { rand } from "../helpers";

const PARTICLES = new Array(28).fill(0).map((_, i) => ({
  x: rand(i * 7 + 1) * 1920,
  y0: rand(i * 13 + 2) * 1080,
  size: 1.5 + rand(i * 3 + 5) * 2.5,
  speed: 0.12 + rand(i * 11 + 9) * 0.35,
  alpha: 0.08 + rand(i * 17 + 4) * 0.18,
  drift: rand(i * 23 + 7) * 60 - 30,
}));

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  const g1x = 960 + Math.sin(frame / 140) * 280;
  const g1y = 360 + Math.cos(frame / 170) * 120;
  const g2x = 600 + Math.cos(frame / 190) * 320;
  const g2y = 820 + Math.sin(frame / 150) * 140;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      {/* base vertical gradient */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, #070C18 0%, ${C.bg} 45%, ${C.bgDeep} 100%)`,
        }}
      />
      {/* drifting glows */}
      <div
        style={{
          position: "absolute",
          left: g1x - 600,
          top: g1y - 600,
          width: 1200,
          height: 1200,
          background: `radial-gradient(circle, ${C.cyan}10 0%, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: g2x - 500,
          top: g2y - 500,
          width: 1000,
          height: 1000,
          background: `radial-gradient(circle, ${C.purple}0d 0%, transparent 60%)`,
        }}
      />
      {/* dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle, rgba(130, 160, 210, 0.13) 1.2px, transparent 1.2px)`,
          backgroundSize: "46px 46px",
          backgroundPosition: "23px 23px",
        }}
      />
      {/* floating particles */}
      {PARTICLES.map((p, i) => {
        const y = ((p.y0 - frame * p.speed) % 1180) + (((p.y0 - frame * p.speed) % 1180) < -100 ? 1180 : 0);
        const x = p.x + Math.sin(frame / 90 + i) * p.drift * 0.2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: C.cyan,
              opacity: p.alpha * (0.7 + 0.3 * Math.sin(frame / 25 + i * 2)),
            }}
          />
        );
      })}
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 45%, transparent 55%, rgba(2, 4, 9, 0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
