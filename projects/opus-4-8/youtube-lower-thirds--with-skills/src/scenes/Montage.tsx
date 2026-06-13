import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Scene } from "./Scene";
import { HUD, ProgressBar } from "../components/Chrome";
import { LOWER_THIRDS } from "../lowerthirds";
import {
  FPS,
  MONTAGE_FROM,
  MONTAGE_LEN,
  SCENE,
  SCENE_CROSS,
  sceneFrom,
} from "../timeline";

const timecode = (totalFrames: number) => {
  const f = totalFrames % FPS;
  const s = Math.floor(totalFrames / FPS) % 60;
  const m = Math.floor(totalFrames / (FPS * 60));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(m)}:${p(s)}:${p(f)}`;
};

export const Montage: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(
    LOWER_THIRDS.length - 1,
    Math.max(0, Math.floor(frame / (SCENE - SCENE_CROSS))),
  );
  const current = LOWER_THIRDS[idx];
  const progress = Math.min(1, frame / MONTAGE_LEN);

  return (
    <AbsoluteFill style={{ background: "#050609" }}>
      {LOWER_THIRDS.map((entry, i) => (
        <Sequence key={entry.id} from={sceneFrom(i)} durationInFrames={SCENE}>
          <Scene entry={entry} />
        </Sequence>
      ))}

      <HUD
        index={idx + 1}
        total={LOWER_THIRDS.length}
        label={current.kind.toUpperCase()}
        timecode={timecode(frame + MONTAGE_FROM)}
        color={current.accent.a}
      />
      <ProgressBar progress={progress} color={current.accent.a} />
    </AbsoluteFill>
  );
};
