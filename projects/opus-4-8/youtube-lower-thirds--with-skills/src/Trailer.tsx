import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Intro } from "./scenes/Intro";
import { Montage } from "./scenes/Montage";
import { Outro } from "./scenes/Outro";
import { FilmChrome } from "./components/Chrome";
import { track } from "./lib/anim";
import {
  BLOCK_CROSS,
  INTRO,
  MONTAGE_FROM,
  MONTAGE_LEN,
  OUTRO,
  OUTRO_FROM,
} from "./timeline";

const FadeBlock: React.FC<{
  length: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
  children: React.ReactNode;
}> = ({ length, fadeIn, fadeOut, children }) => {
  const frame = useCurrentFrame();
  const inP = fadeIn ? track(frame, [0, BLOCK_CROSS], [0, 1]) : 1;
  const outP = fadeOut ? track(frame, [length - BLOCK_CROSS, length], [1, 0]) : 1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(inP, outP) }}>{children}</AbsoluteFill>
  );
};

export const Trailer: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#050609" }}>
      <Sequence durationInFrames={INTRO}>
        <FadeBlock length={INTRO} fadeOut>
          <Intro />
        </FadeBlock>
      </Sequence>

      <Sequence from={MONTAGE_FROM} durationInFrames={MONTAGE_LEN}>
        <Montage />
      </Sequence>

      <Sequence from={OUTRO_FROM} durationInFrames={OUTRO}>
        <FadeBlock length={OUTRO} fadeIn>
          <Outro />
        </FadeBlock>
      </Sequence>

      <FilmChrome />
    </AbsoluteFill>
  );
};
