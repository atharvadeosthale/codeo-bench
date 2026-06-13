import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const Blob: React.FC<{
  color: string;
  size: number;
  x: number;
  y: number;
  drift: number;
  speed?: number;
  opacity?: number;
}> = ({ color, size, x, y, drift, speed = 1, opacity = 0.6 }) => {
  const frame = useCurrentFrame();
  const t = frame * 0.018 * speed;
  const dx = Math.sin(t) * drift;
  const dy = Math.cos(t * 0.8) * drift * 0.6;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(90px)",
        opacity,
        transform: `translate(${dx}px, ${dy}px)`,
      }}
    />
  );
};

const Grid: React.FC<{ color: string; opacity?: number }> = ({
  color,
  opacity = 0.12,
}) => {
  const frame = useCurrentFrame();
  const shift = (frame * 0.4) % 64;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: "64px 64px",
        backgroundPosition: `${shift}px ${shift}px`,
        opacity,
        maskImage:
          "radial-gradient(120% 100% at 50% 30%, black 30%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(120% 100% at 50% 30%, black 30%, transparent 80%)",
      }}
    />
  );
};

/** Deterministic floating dust particles. */
const Particles: React.FC<{ count?: number; color: string }> = ({
  count = 40,
  color,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill>
      {Array.from({ length: count }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rx = seed / 233280;
        const ry = ((i * 4271 + 7) % 233280) / 233280;
        const sz = 1.5 + rx * 3;
        const speed = 0.2 + ry * 0.5;
        const y = (height - ((frame * speed * 6 + ry * height) % height)) | 0;
        const x = (rx * width + Math.sin(frame * 0.02 + i) * 18) | 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz,
              borderRadius: "50%",
              background: color,
              opacity: 0.18 + rx * 0.4,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export type BackdropVariant =
  | "tech"
  | "gaming"
  | "editorial"
  | "studio"
  | "social"
  | "news"
  | "music";

const Base: React.FC<{ gradient: string; children?: React.ReactNode }> = ({
  gradient,
  children,
}) => (
  <AbsoluteFill style={{ background: gradient, overflow: "hidden" }}>
    {children}
  </AbsoluteFill>
);

export const Backdrop: React.FC<{ variant: BackdropVariant }> = ({
  variant,
}) => {
  const frame = useCurrentFrame();
  switch (variant) {
    case "tech":
      return (
        <Base gradient="radial-gradient(130% 110% at 70% 10%, #11203A 0%, #070B14 55%, #04060B 100%)">
          <Grid color="rgba(125,249,255,0.18)" opacity={0.18} />
          <Blob color="#1E6BFF" size={620} x={55} y={-10} drift={50} opacity={0.5} />
          <Blob color="#7DF9FF" size={420} x={8} y={45} drift={60} speed={0.7} opacity={0.35} />
          <Particles color="#7DF9FF" count={36} />
        </Base>
      );
    case "gaming":
      return (
        <Base gradient="radial-gradient(120% 120% at 30% 80%, #2A0935 0%, #0B0414 60%, #050208 100%)">
          <Grid color="rgba(255,46,151,0.16)" opacity={0.2} />
          <Blob color="#FF2E97" size={560} x={5} y={50} drift={70} opacity={0.55} />
          <Blob color="#00F5A0" size={460} x={70} y={5} drift={60} speed={1.3} opacity={0.4} />
          <Particles color="#FF6AD5" count={44} />
        </Base>
      );
    case "editorial":
      return (
        <Base gradient="radial-gradient(120% 110% at 25% 20%, #1A1712 0%, #0C0A07 60%, #060504 100%)">
          <Blob color="#E8C37A" size={520} x={12} y={10} drift={36} opacity={0.28} />
          <Blob color="#8A6B2E" size={460} x={68} y={55} drift={44} speed={0.6} opacity={0.22} />
          <Particles color="#E8C37A" count={26} />
        </Base>
      );
    case "studio":
      return (
        <Base gradient="radial-gradient(110% 120% at 50% 0%, #161A24 0%, #0A0D14 55%, #050609 100%)">
          <Grid color="rgba(255,255,255,0.10)" opacity={0.1} />
          <Blob color="#FF0033" size={500} x={60} y={20} drift={40} opacity={0.32} />
          <Blob color="#3B82F6" size={460} x={6} y={50} drift={46} speed={0.8} opacity={0.3} />
        </Base>
      );
    case "social":
      return (
        <Base gradient="radial-gradient(120% 110% at 75% 25%, #0A2740 0%, #061522 55%, #04090F 100%)">
          <Grid color="rgba(56,189,248,0.16)" opacity={0.16} />
          <Blob color="#38BDF8" size={540} x={62} y={8} drift={56} opacity={0.45} />
          <Blob color="#22D3EE" size={420} x={10} y={55} drift={50} speed={0.9} opacity={0.34} />
          <Particles color="#7DD3FC" count={34} />
        </Base>
      );
    case "news": {
      const sweep = (frame * 0.6) % 200;
      return (
        <Base gradient="radial-gradient(120% 120% at 50% 10%, #131A2C 0%, #0A0F1C 55%, #05070D 100%)">
          <Grid color="rgba(239,68,68,0.12)" opacity={0.14} />
          <Blob color="#EF4444" size={520} x={8} y={10} drift={36} opacity={0.3} />
          <Blob color="#1D4ED8" size={520} x={66} y={50} drift={44} speed={0.7} opacity={0.32} />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${sweep - 30}%`,
              width: 160,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
              transform: "skewX(-12deg)",
            }}
          />
        </Base>
      );
    }
    case "music":
      return (
        <Base gradient="radial-gradient(120% 120% at 50% 90%, #25103F 0%, #100726 55%, #060311 100%)">
          <Blob color="#B14BFF" size={560} x={20} y={45} drift={64} opacity={0.5} />
          <Blob color="#FF8A3D" size={440} x={68} y={12} drift={56} speed={1.2} opacity={0.38} />
          <Particles color="#D7A6FF" count={38} />
        </Base>
      );
  }
};
