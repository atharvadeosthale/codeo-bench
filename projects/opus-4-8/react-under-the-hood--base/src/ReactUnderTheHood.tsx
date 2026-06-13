import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "./theme";
import { Background, hexA } from "./components/Background";
import { Intro } from "./scenes/Intro";
import { JsxToElement } from "./scenes/JsxToElement";
import { VirtualDom } from "./scenes/VirtualDom";
import { InitialRender } from "./scenes/InitialRender";
import { StateUpdate } from "./scenes/StateUpdate";
import { Reconciliation } from "./scenes/Reconciliation";
import { Fiber } from "./scenes/Fiber";
import { Commit } from "./scenes/Commit";
import { Recap } from "./scenes/Recap";

const OVERLAP = 18;

const SCENES: { c: React.FC; dur: number; accent: string; label: string }[] = [
  { c: Intro, dur: 130, accent: COLORS.react, label: "" },
  { c: JsxToElement, dur: 280, accent: COLORS.jsx, label: "01 · JSX" },
  { c: VirtualDom, dur: 230, accent: COLORS.react, label: "02 · Virtual DOM" },
  { c: InitialRender, dur: 230, accent: COLORS.commit, label: "03 · Mount" },
  { c: StateUpdate, dur: 220, accent: COLORS.change, label: "04 · State" },
  { c: Reconciliation, dur: 280, accent: COLORS.add, label: "05 · Reconcile" },
  { c: Fiber, dur: 280, accent: COLORS.fiber, label: "06 · Fiber" },
  { c: Commit, dur: 220, accent: COLORS.commit, label: "07 · Commit" },
  { c: Recap, dur: 300, accent: COLORS.react, label: "08 · The Loop" },
];

const starts: number[] = [];
SCENES.reduce((acc, s, i) => {
  starts[i] = acc;
  return acc + s.dur - OVERLAP;
}, 0);

export const TOTAL_FRAMES =
  starts[SCENES.length - 1] + SCENES[SCENES.length - 1].dur;

const SceneFade: React.FC<{ dur: number; children: React.ReactNode }> = ({
  dur,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, OVERLAP, dur - OVERLAP, dur],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: 4,
        width: `${p * 100}%`,
        background: `linear-gradient(90deg, ${COLORS.react}, ${COLORS.jsx})`,
        boxShadow: `0 0 12px ${hexA(COLORS.react, 0.8)}`,
      }}
    />
  );
};

export const ReactUnderTheHood: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Background accent={COLORS.react} />
      {SCENES.map((s, i) => {
        const Comp = s.c;
        return (
          <Sequence key={i} from={starts[i]} durationInFrames={s.dur}>
            <SceneFade dur={s.dur}>
              <Comp />
            </SceneFade>
          </Sequence>
        );
      })}
      <ProgressBar />
    </AbsoluteFill>
  );
};
