import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { S1Intro } from "./scenes/S1Intro";
import { S2Jsx } from "./scenes/S2Jsx";
import { S3Elements } from "./scenes/S3Elements";
import { S4Tree } from "./scenes/S4Tree";
import { S5StateUpdate } from "./scenes/S5StateUpdate";
import { S6Diff } from "./scenes/S6Diff";
import { S7Fiber } from "./scenes/S7Fiber";
import { S8Phases } from "./scenes/S8Phases";
import { S9Commit } from "./scenes/S9Commit";
import { S10Outro } from "./scenes/S10Outro";

const TRANSITION = 15;

const SCENES: { component: React.FC; duration: number }[] = [
  { component: S1Intro, duration: 210 },
  { component: S2Jsx, duration: 330 },
  { component: S3Elements, duration: 300 },
  { component: S4Tree, duration: 330 },
  { component: S5StateUpdate, duration: 300 },
  { component: S6Diff, duration: 390 },
  { component: S7Fiber, duration: 390 },
  { component: S8Phases, duration: 330 },
  { component: S9Commit, duration: 330 },
  { component: S10Outro, duration: 330 },
];

export const TOTAL_DURATION =
  SCENES.reduce((acc, s) => acc + s.duration, 0) - (SCENES.length - 1) * TRANSITION;

export const Main: React.FC = () => {
  return (
    <TransitionSeries>
      {SCENES.map((scene, i) => {
        const Comp = scene.component;
        return (
          <React.Fragment key={i}>
            {i > 0 ? (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION })}
              />
            ) : null}
            <TransitionSeries.Sequence durationInFrames={scene.duration}>
              <Comp />
            </TransitionSeries.Sequence>
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};
