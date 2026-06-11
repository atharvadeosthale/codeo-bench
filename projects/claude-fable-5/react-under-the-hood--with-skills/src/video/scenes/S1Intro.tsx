import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors as C, fonts } from "../theme";
import { Background, ReactLogo, ez, POP } from "../ui";

export const S1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const titleLetters = "REACT".split("");
  const subP = ez(frame, 60, 35);
  const tagP = ez(frame, 110, 30);
  const lineP = ez(frame, 50, 40);

  return (
    <AbsoluteFill style={{ fontFamily: fonts.display }}>
      <Background seed={1} />
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 400,
          transform: "translate(-50%, -50%)",
        }}
      >
        <ReactLogo size={460} at={5} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 618,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 150, fontWeight: 700, color: C.text, letterSpacing: 26 }}>
          {titleLetters.map((ch, i) => {
            const p = ez(frame, 35 + i * 4, 30, POP);
            const o = ez(frame, 35 + i * 4, 18);
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: o,
                  transform: `translateY(${(1 - p) * 60}px) scale(${0.7 + p * 0.3})`,
                  textShadow: "0 0 60px rgba(97,218,251,0.35)",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        <div
          style={{
            margin: "10px auto 0",
            width: lineP * 560,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`,
          }}
        />

        <div
          style={{
            marginTop: 22,
            fontFamily: fonts.mono,
            fontSize: 36,
            fontWeight: 700,
            color: C.accent,
            letterSpacing: 8 + subP * 14,
            opacity: subP,
          }}
        >
          UNDER THE HOOD
        </div>

        <div
          style={{
            marginTop: 36,
            fontSize: 30,
            color: C.muted,
            opacity: tagP,
            transform: `translateY(${(1 - tagP) * 20}px)`,
          }}
        >
          What actually happens when you render?
        </div>
      </div>
    </AbsoluteFill>
  );
};
