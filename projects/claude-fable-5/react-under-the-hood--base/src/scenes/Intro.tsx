import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, MONO } from "../theme";
import { ramp } from "../helpers";

const ORBITS = [0, 60, 120];

const electronPos = (
  rx: number,
  ry: number,
  rotDeg: number,
  theta: number,
): [number, number] => {
  const rot = (rotDeg * Math.PI) / 180;
  const px = rx * Math.cos(theta);
  const py = ry * Math.sin(theta);
  return [px * Math.cos(rot) - py * Math.sin(rot), px * Math.sin(rot) + py * Math.cos(rot)];
};

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cx = 960;
  const cy = 360;
  const rx = 210;
  const ry = 80;

  const orbitDraw = ramp(frame, 6, 50);
  const nucleus = spring({
    frame,
    fps,
    delay: 18,
    config: { damping: 11, mass: 0.7 },
    durationInFrames: 40,
  });
  const spin = frame * 0.6;

  const title = "REACT";
  const subSpring = spring({
    frame,
    fps,
    delay: 78,
    config: { damping: 200 },
    durationInFrames: 30,
  });
  const tagSpring = spring({
    frame,
    fps,
    delay: 112,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="introGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform={`translate(${cx} ${cy}) rotate(${spin / 8})`}>
          {ORBITS.map((rot, i) => (
            <ellipse
              key={rot}
              rx={rx}
              ry={ry}
              transform={`rotate(${rot})`}
              fill="none"
              stroke={C.cyan}
              strokeWidth={4}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - Math.min(1, Math.max(0, orbitDraw * 1.4 - i * 0.2))}
              opacity={0.9}
              filter="url(#introGlow)"
            />
          ))}
          {/* electrons */}
          {ORBITS.map((rot, i) => {
            const theta = spin / 14 + (i * Math.PI * 2) / 3;
            const [ex, ey] = electronPos(rx, ry, rot, theta);
            const visible = orbitDraw >= 1 ? 1 : 0;
            return (
              <circle
                key={`e${rot}`}
                cx={ex}
                cy={ey}
                r={9}
                fill="#fff"
                opacity={visible}
                filter="url(#introGlow)"
              />
            );
          })}
          {/* nucleus */}
          <circle
            r={26 * nucleus}
            fill={C.cyan}
            filter="url(#introGlow)"
            opacity={nucleus}
          />
        </g>
      </svg>

      {/* Title letters */}
      <div
        style={{
          position: "absolute",
          top: 565,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          gap: 10,
          fontFamily: FONT,
        }}
      >
        {title.split("").map((ch, i) => {
          const s = spring({
            frame,
            fps,
            delay: 40 + i * 5,
            config: { damping: 13, mass: 0.6 },
            durationInFrames: 38,
          });
          return (
            <span
              key={i}
              style={{
                fontSize: 168,
                fontWeight: 800,
                letterSpacing: 8,
                color: C.text,
                opacity: s,
                transform: `translateY(${(1 - s) * 70}px) scale(${0.8 + 0.2 * s})`,
                textShadow: "0 14px 50px rgba(97, 218, 251, 0.25)",
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          top: 790,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 52,
          fontWeight: 600,
          letterSpacing: 22,
          color: C.cyan,
          opacity: subSpring,
          transform: `translateY(${(1 - subSpring) * 24}px)`,
          textShadow: `0 0 30px ${C.cyan}44`,
        }}
      >
        UNDER THE HOOD
      </div>

      <div
        style={{
          position: "absolute",
          top: 890,
          width: "100%",
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 27,
          color: C.dim,
          opacity: tagSpring,
          transform: `translateY(${(1 - tagSpring) * 18}px)`,
        }}
      >
        {"// what actually happens when your component renders"}
      </div>

      {/* converging intro flash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 33%, ${C.cyan}26 0%, transparent 45%)`,
          opacity: interpolate(frame, [0, 30], [1, 0], {
            extrapolateRight: "clamp",
          }),
        }}
      />
    </AbsoluteFill>
  );
};
