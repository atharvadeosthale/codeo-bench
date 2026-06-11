import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  INTRO_DURATION,
  OUTRO_DURATION,
  SCENE_DURATION,
  sceneStart,
} from "./constants";
import { Intro } from "./components/Intro";
import { Outro } from "./components/Outro";
import { Grain, Vignette, YouTubeChrome } from "./components/Overlays";
import { SceneShell, type ScenePalette } from "./components/SceneShell";
import { GlassLowerThird } from "./lowerthirds/Glass";
import { NeonLowerThird } from "./lowerthirds/Neon";
import { EditorialLowerThird } from "./lowerthirds/Editorial";
import { StreamLowerThird } from "./lowerthirds/Stream";
import { BroadcastLowerThird } from "./lowerthirds/Broadcast";

type SceneDef = {
  name: string;
  palette: ScenePalette;
  lowerThird: React.FC<{ delay?: number; exitAt?: number }>;
};

const SCENES: SceneDef[] = [
  {
    name: "Glass",
    palette: {
      base: "#171036",
      blobA: "rgba(124,58,237,0.55)",
      blobB: "rgba(56,189,248,0.4)",
      accent: "#c084fc",
      grid: true,
    },
    lowerThird: GlassLowerThird,
  },
  {
    name: "Neon",
    palette: {
      base: "#06060f",
      blobA: "rgba(34,228,255,0.22)",
      blobB: "rgba(255,43,214,0.2)",
      accent: "#22e4ff",
      stripes: true,
    },
    lowerThird: NeonLowerThird,
  },
  {
    name: "Editorial",
    palette: {
      base: "#1c1814",
      blobA: "rgba(231,200,115,0.18)",
      blobB: "rgba(120,90,60,0.3)",
      accent: "#e7c873",
    },
    lowerThird: EditorialLowerThird,
  },
  {
    name: "Stream",
    palette: {
      base: "#0d1208",
      blobA: "rgba(200,255,46,0.16)",
      blobB: "rgba(255,31,76,0.18)",
      accent: "#c8ff2e",
      stripes: true,
    },
    lowerThird: StreamLowerThird,
  },
  {
    name: "Broadcast",
    palette: {
      base: "#091126",
      blobA: "rgba(214,19,46,0.22)",
      blobB: "rgba(36,72,160,0.45)",
      accent: "#f5b81c",
      grid: true,
    },
    lowerThird: BroadcastLowerThird,
  },
];

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence durationInFrames={INTRO_DURATION} name="Intro">
        <Intro />
      </Sequence>

      {SCENES.map((scene, i) => {
        const LT = scene.lowerThird;
        return (
          <Sequence
            key={scene.name}
            from={sceneStart(i)}
            durationInFrames={SCENE_DURATION}
            name={`${i + 1} — ${scene.name}`}
          >
            <SceneShell index={i} name={scene.name} palette={scene.palette}>
              <div style={{ position: "absolute", left: 96, bottom: 110 }}>
                <LT delay={16} exitAt={SCENE_DURATION - 16} />
              </div>
            </SceneShell>
          </Sequence>
        );
      })}

      <Sequence
        from={sceneStart(SCENES.length)}
        durationInFrames={OUTRO_DURATION}
        name="Outro"
      >
        <Outro />
      </Sequence>

      <YouTubeChrome />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
