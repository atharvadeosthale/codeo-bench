import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SCENE_DURATION } from "../constants";
import { GROTESK, MONO } from "../fonts";
import { CutFlash } from "./Overlays";
import { usePop } from "./Reveal";

export type ScenePalette = {
  base: string;
  blobA: string;
  blobB: string;
  accent: string;
  grid?: boolean;
  stripes?: boolean;
};

const Blob: React.FC<{
  color: string;
  size: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  speed: number;
}> = ({ color, size, x, y, driftX, driftY, speed }) => {
  const frame = useCurrentFrame();
  const dx = Math.sin(frame * speed) * driftX;
  const dy = Math.cos(frame * speed * 0.8) * driftY;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        transform: `translate(${dx}px, ${dy}px)`,
        filter: "blur(40px)",
      }}
    />
  );
};

export const SceneBackground: React.FC<{ palette: ScenePalette }> = ({
  palette,
}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, SCENE_DURATION], [1.06, 1.0]);
  return (
    <AbsoluteFill style={{ background: palette.base, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Blob
          color={palette.blobA}
          size={1300}
          x={-250}
          y={-450}
          driftX={70}
          driftY={50}
          speed={0.02}
        />
        <Blob
          color={palette.blobB}
          size={1100}
          x={1050}
          y={250}
          driftX={90}
          driftY={60}
          speed={0.016}
        />
        <Blob
          color={palette.blobA}
          size={700}
          x={650}
          y={650}
          driftX={50}
          driftY={80}
          speed={0.025}
        />
        {palette.grid ? (
          <AbsoluteFill
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "90px 90px",
              maskImage:
                "radial-gradient(ellipse 70% 70% at 50% 40%, black 30%, transparent 80%)",
            }}
          />
        ) : null}
        {palette.stripes ? (
          <AbsoluteFill
            style={{
              backgroundImage: `repeating-linear-gradient(115deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 2px, transparent 2px, transparent 110px)`,
              transform: `translateX(${(frame * 0.6) % 110}px)`,
              left: -220,
              width: "130%",
            }}
          />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Top-left index tag + giant ghost numeral that anchor each chapter. */
export const SceneTag: React.FC<{
  index: number;
  name: string;
  accent: string;
}> = ({ index, name, accent }) => {
  const frame = useCurrentFrame();
  const pop = usePop(8);
  const ghostPop = usePop(4, 60);
  const exit = interpolate(
    frame,
    [SCENE_DURATION - 14, SCENE_DURATION - 4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const num = String(index + 1).padStart(2, "0");
  return (
    <>
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: -110,
          fontFamily: GROTESK,
          fontWeight: 700,
          fontSize: 560,
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "2px rgba(255,255,255,0.09)",
          transform: `translateY(${(1 - ghostPop) * 120 + exit * 80}px)`,
          opacity: (1 - exit) * 0.9,
          userSelect: "none",
        }}
      >
        {num}
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 84,
          display: "flex",
          alignItems: "center",
          gap: 20,
          transform: `translateX(${(1 - pop) * -40}px)`,
          opacity: pop * (1 - exit),
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            background: accent,
            transform: "rotate(45deg)",
            boxShadow: `0 0 18px ${accent}`,
          }}
        />
        <div
          style={{
            fontFamily: MONO,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: 8,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {num} / {name.toUpperCase()}
        </div>
        <div
          style={{
            height: 1,
            width: 180 * pop,
            background: "rgba(255,255,255,0.3)",
          }}
        />
      </div>
    </>
  );
};

export const SceneShell: React.FC<{
  index: number;
  name: string;
  palette: ScenePalette;
  children: React.ReactNode;
}> = ({ index, name, palette, children }) => {
  return (
    <AbsoluteFill>
      <SceneBackground palette={palette} />
      <SceneTag index={index} name={name} accent={palette.accent} />
      {children}
      <CutFlash />
    </AbsoluteFill>
  );
};
