import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Background } from "./components/Background";
import { fadeEdges } from "./helpers";
import { C } from "./theme";
import { Intro } from "./scenes/Intro";
import { Jsx } from "./scenes/Jsx";
import { VirtualDom } from "./scenes/VirtualDom";
import { Fiber } from "./scenes/Fiber";
import { Scheduling } from "./scenes/Scheduling";
import { Reconciliation } from "./scenes/Reconciliation";
import { Commit } from "./scenes/Commit";
import { Outro } from "./scenes/Outro";

const SCENES: { comp: React.FC; dur: number; name: string }[] = [
  { comp: Intro, dur: 210, name: "intro" },
  { comp: Jsx, dur: 360, name: "jsx" },
  { comp: VirtualDom, dur: 300, name: "elements" },
  { comp: Fiber, dur: 390, name: "fiber" },
  { comp: Scheduling, dur: 330, name: "schedule" },
  { comp: Reconciliation, dur: 360, name: "diff" },
  { comp: Commit, dur: 330, name: "commit" },
  { comp: Outro, dur: 240, name: "outro" },
];

export const TOTAL_DURATION = SCENES.reduce((a, s) => a + s.dur, 0);

const SceneFade: React.FC<{ dur: number; last: boolean; children: React.ReactNode }> = ({
  dur,
  last,
  children,
}) => {
  const frame = useCurrentFrame();
  // the outro handles its own fade-to-black ending
  const opacity = fadeEdges(frame, dur, 12, last ? 0.001 : 14);
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  let offset = 0;
  const progress = frame / TOTAL_DURATION;

  return (
    <AbsoluteFill>
      <Background />
      {SCENES.map((s, i) => {
        const from = offset;
        offset += s.dur;
        const SceneComp = s.comp;
        return (
          <Sequence key={s.name} from={from} durationInFrames={s.dur} name={s.name}>
            <SceneFade dur={s.dur} last={i === SCENES.length - 1}>
              <SceneComp />
            </SceneFade>
          </Sequence>
        );
      })}
      {/* full-video progress hairline */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 5,
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${C.cyan}, ${C.purple})`,
          boxShadow: `0 0 12px ${C.cyan}88`,
          zIndex: 50,
        }}
      />
    </AbsoluteFill>
  );
};
