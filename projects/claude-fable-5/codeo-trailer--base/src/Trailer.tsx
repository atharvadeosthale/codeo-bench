import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT_SANS } from "./theme";
import { Gate, Grain, HUD, Stage } from "./ui/Chrome";
import { Hook } from "./scenes/Hook";
import { Judge } from "./scenes/Judge";
import { Leader } from "./scenes/Leader";
import { Protocol } from "./scenes/Protocol";
import { Reel } from "./scenes/Reel";
import { TitleCard } from "./scenes/TitleCard";

// timeline (30 fps)
const LEADER = 80;
const HOOK = 165;
const PROTOCOL = 210;
const REEL = 195;
const JUDGE = 150;
const TITLE = 220;

export const TRAILER_DURATION =
  LEADER + HOOK + PROTOCOL + REEL + JUDGE + TITLE; // 1020

const T_HOOK = LEADER;
const T_PROTOCOL = T_HOOK + HOOK;
const T_REEL = T_PROTOCOL + PROTOCOL;
const T_JUDGE = T_REEL + REEL;
const T_TITLE = T_JUDGE + JUDGE;

// hard cuts that get a 2-frame exposure pop
const CUTS = [
  T_HOOK,
  T_HOOK + 82, // inside Hook
  T_PROTOCOL,
  T_REEL,
  T_JUDGE,
  T_JUDGE + 42,
  T_JUDGE + 84,
  T_TITLE,
  T_TITLE + 44, // CODE+VIDEO collision
];

const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const hit = CUTS.some((c) => frame === c || frame === c + 1);
  if (!hit) return null;
  return (
    <AbsoluteFill
      style={{ background: "#eef0e2", opacity: 0.13, pointerEvents: "none" }}
    />
  );
};

export const Trailer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hudOpacity =
    interpolate(frame, [LEADER + 4, LEADER + 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }) *
    interpolate(frame, [T_TITLE + 192, T_TITLE + 200], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const showRec = frame >= T_PROTOCOL && frame < T_JUDGE;
  const grainAmount = frame < LEADER ? 0.13 : 0.055;

  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT_SANS }}>
      <Stage />
      <Gate amount={frame < LEADER ? 2.2 : 0.8}>
        <Sequence durationInFrames={LEADER}>
          <Leader />
        </Sequence>
        <Sequence from={T_HOOK} durationInFrames={HOOK}>
          <Hook />
        </Sequence>
        <Sequence from={T_PROTOCOL} durationInFrames={PROTOCOL}>
          <Protocol />
        </Sequence>
        <Sequence from={T_REEL} durationInFrames={REEL}>
          <Reel />
        </Sequence>
        <Sequence from={T_JUDGE} durationInFrames={JUDGE}>
          <Judge />
        </Sequence>
        <Sequence from={T_TITLE} durationInFrames={TITLE}>
          <TitleCard />
        </Sequence>

        <div style={{ opacity: hudOpacity }}>
          <HUD fps={fps} showRec={showRec} />
        </div>
      </Gate>
      <CutFlash />
      <Grain opacity={grainAmount} />
    </AbsoluteFill>
  );
};
