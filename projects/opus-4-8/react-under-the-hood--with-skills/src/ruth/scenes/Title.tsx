import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { AtomLogo } from "../AtomLogo";
import { COLORS, FONT_MONO, FONT_SANS } from "../theme";
import { SceneShell } from "../ui";

export const TitleScene: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();

  const titleP = interpolate(frame, [18, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const subP = interpolate(frame, [44, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const logoP = interpolate(frame, [0, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <SceneShell durationInFrames={durationInFrames}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            opacity: logoP,
            transform: `scale(${interpolate(logoP, [0, 1], [0.6, 1])})`,
            marginBottom: 24,
          }}
        >
          <AtomLogo size={300} speed={1.1} />
        </div>

        <div
          style={{
            fontFamily: FONT_MONO,
            color: COLORS.react,
            letterSpacing: 14,
            fontSize: 24,
            opacity: subP,
            marginBottom: 14,
            textTransform: "uppercase",
          }}
        >
          React · Internals
        </div>

        <h1
          style={{
            fontFamily: FONT_SANS,
            fontSize: 124,
            fontWeight: 800,
            letterSpacing: -3,
            margin: 0,
            lineHeight: 1,
            color: COLORS.white,
            opacity: titleP,
            transform: `translateY(${interpolate(titleP, [0, 1], [40, 0])}px)`,
            background: `linear-gradient(95deg, #eef4fb 0%, ${COLORS.react} 60%, ${COLORS.violet} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Under the Hood
        </h1>

        <div
          style={{
            marginTop: 22,
            fontFamily: FONT_SANS,
            fontSize: 30,
            color: COLORS.muted,
            opacity: subP,
            maxWidth: 880,
            textAlign: "center",
          }}
        >
          How your components actually become pixels on screen.
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
