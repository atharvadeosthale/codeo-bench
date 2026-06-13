import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../theme";
import { ReactLogo } from "../components/ReactLogo";
import { hexA } from "../components/Background";
import { fadeUp, ramp, springIn } from "../components/anim";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoP = springIn(frame, fps, 6, 12);
  const titleLine = ramp(frame, 30, 55);
  const out = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const words = ["UNDER", "THE", "HOOD"];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: out,
      }}
    >
      <div
        style={{
          opacity: logoP,
          transform: `scale(${interpolate(logoP, [0, 1], [0.4, 1])})`,
          marginBottom: 10,
        }}
      >
        <ReactLogo size={300} speed={1.1} />
      </div>

      <div
        style={{
          ...fadeUp(frame, fps, 20),
          fontFamily: FONT.mono,
          fontSize: 30,
          letterSpacing: 14,
          color: COLORS.react,
          fontWeight: 700,
          textShadow: `0 0 24px ${hexA(COLORS.react, 0.7)}`,
        }}
      >
        R E A C T
      </div>

      <div
        style={{
          display: "flex",
          gap: 26,
          marginTop: 14,
        }}
      >
        {words.map((w, i) => {
          const p = springIn(frame, fps, 34 + i * 7, 13);
          return (
            <span
              key={w}
              style={{
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
                fontFamily: FONT.sans,
                fontSize: 96,
                fontWeight: 900,
                color: COLORS.text,
                letterSpacing: -2,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>

      <div
        style={{
          height: 4,
          width: interpolate(titleLine, [0, 1], [0, 560]),
          marginTop: 26,
          borderRadius: 4,
          background: `linear-gradient(90deg, ${hexA(COLORS.react, 0)}, ${COLORS.react}, ${hexA(COLORS.jsx, 0.8)}, ${hexA(COLORS.react, 0)})`,
          boxShadow: `0 0 20px ${hexA(COLORS.react, 0.6)}`,
        }}
      />

      <div
        style={{
          ...fadeUp(frame, fps, 60),
          marginTop: 30,
          fontFamily: FONT.sans,
          fontSize: 30,
          color: COLORS.textDim,
          maxWidth: 900,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        From JSX to pixels — how React turns your code into a living interface.
      </div>
    </AbsoluteFill>
  );
};
