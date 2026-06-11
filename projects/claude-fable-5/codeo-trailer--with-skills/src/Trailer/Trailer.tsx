import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  BRIEF,
  JUDGE,
  LEADER,
  REEL,
  SLAM1,
  SLAM2,
  SLAM3,
  ST1,
  ST2,
  ST3,
  TITLE,
} from "./timeline";
import { C, SANS } from "./theme";
import { Grain, Letterbox, Vignette } from "./ui";
import { Brief } from "./scenes/Brief";
import { Judge } from "./scenes/Judge";
import { Leader } from "./scenes/Leader";
import { Reel } from "./scenes/Reel";
import { Slam } from "./scenes/Slam";
import { Statement } from "./scenes/Statement";
import { Title } from "./scenes/Title";

export const Trailer: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bgDeep,
        fontFamily: SANS,
        color: C.ink,
        overflow: "hidden",
      }}
    >
      <Sequence from={LEADER.from} durationInFrames={LEADER.dur}>
        <Leader />
      </Sequence>

      <Sequence from={ST1.from} durationInFrames={ST1.dur}>
        <Statement
          index="01/03"
          ghost="01"
          glowX={36}
          lines={[[{ t: "SAME" }, { t: "PROMPT." }]]}
        />
      </Sequence>
      <Sequence from={ST2.from} durationInFrames={ST2.dur}>
        <Statement
          index="02/03"
          ghost="02"
          glowX={64}
          lines={[[{ t: "SAME" }, { t: "TEMPLATE." }]]}
        />
      </Sequence>
      <Sequence from={ST3.from} durationInFrames={ST3.dur}>
        <Statement
          index="03/03"
          ghost="03"
          glowX={50}
          lines={[
            [{ t: "DIFFERENT", outline: true }],
            [{ t: "MINDS.", outline: true }],
          ]}
        />
      </Sequence>

      <Sequence from={BRIEF.from} durationInFrames={BRIEF.dur}>
        <Brief />
      </Sequence>

      <Sequence from={REEL.from} durationInFrames={REEL.dur}>
        <Reel />
      </Sequence>

      <Sequence from={SLAM1.from} durationInFrames={SLAM1.dur}>
        <Slam text="NO SCORES." seed="slam1" glowX={30} />
      </Sequence>
      <Sequence from={SLAM2.from} durationInFrames={SLAM2.dur}>
        <Slam text="NO RANKINGS." seed="slam2" glowX={70} />
      </Sequence>
      <Sequence from={SLAM3.from} durationInFrames={SLAM3.dur}>
        <Slam
          text="NO MERCY."
          accent
          seed="slam3"
          sub="BROKEN RENDERS STAY ON THE BOARD"
        />
      </Sequence>

      <Sequence from={JUDGE.from} durationInFrames={JUDGE.dur}>
        <Judge />
      </Sequence>

      <Sequence from={TITLE.from} durationInFrames={TITLE.dur}>
        <Title />
      </Sequence>

      <Vignette />
      <Letterbox />
      <Grain />
    </AbsoluteFill>
  );
};
