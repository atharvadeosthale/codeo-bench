import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Background } from "./ui";
import { COLORS } from "./theme";
import { TitleScene } from "./scenes/Title";
import { JsxScene } from "./scenes/Jsx";
import { CreateElementScene } from "./scenes/CreateElement";
import { VirtualDomScene } from "./scenes/VirtualDom";
import { RenderScene } from "./scenes/Render";
import { FiberScene } from "./scenes/Fiber";
import { ReconcileScene } from "./scenes/Reconcile";
import { CommitScene } from "./scenes/Commit";
import { StateLoopScene } from "./scenes/StateLoop";
import { OutroScene } from "./scenes/Outro";

const FADE = 18;

type SceneDef = {
  Comp: React.FC<{ durationInFrames: number }>;
  d: number;
  hue: string;
};

const SCENES: SceneDef[] = [
  { Comp: TitleScene, d: 110, hue: COLORS.react },
  { Comp: JsxScene, d: 165, hue: COLORS.react },
  { Comp: CreateElementScene, d: 175, hue: COLORS.violet },
  { Comp: VirtualDomScene, d: 175, hue: COLORS.react },
  { Comp: RenderScene, d: 165, hue: COLORS.violet },
  { Comp: FiberScene, d: 205, hue: COLORS.react },
  { Comp: ReconcileScene, d: 185, hue: COLORS.orange },
  { Comp: CommitScene, d: 155, hue: COLORS.green },
  { Comp: StateLoopScene, d: 205, hue: COLORS.react },
  { Comp: OutroScene, d: 150, hue: COLORS.react },
];

export const TOTAL_FRAMES =
  SCENES.reduce((a, s) => a + s.d, 0) - (SCENES.length - 1) * FADE;

export const ReactUnderTheHood: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg0 }}>
      <TransitionSeries>
        {SCENES.flatMap((s, i) => {
          const { Comp } = s;
          const seq = (
            <TransitionSeries.Sequence key={`s${i}`} durationInFrames={s.d}>
              <AbsoluteFill>
                <Background hue={s.hue} />
                <Comp durationInFrames={s.d} />
              </AbsoluteFill>
            </TransitionSeries.Sequence>
          );
          if (i === SCENES.length - 1) return [seq];
          return [
            seq,
            <TransitionSeries.Transition
              key={`t${i}`}
              presentation={fade()}
              timing={linearTiming({ durationInFrames: FADE })}
            />,
          ];
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
