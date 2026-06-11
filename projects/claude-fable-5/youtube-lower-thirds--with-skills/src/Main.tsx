import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  AuroraBackdrop,
  EmberBackdrop,
  GridBackdrop,
  PaperBackdrop,
  StripesBackdrop,
} from "./backdrops/Backdrops";
import { SceneChrome } from "./components/SceneChrome";
import { BroadcastLowerThird } from "./lower-thirds/BroadcastLowerThird";
import { GlassLowerThird } from "./lower-thirds/GlassLowerThird";
import { LuxeLowerThird } from "./lower-thirds/LuxeLowerThird";
import { MinimalLowerThird } from "./lower-thirds/MinimalLowerThird";
import { NeonLowerThird } from "./lower-thirds/NeonLowerThird";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";

const INTRO = 85;
const SCENE = 110;
const OUTRO = 115;
const TRANSITION = 12;
const ENTER_AT = 16; // lower third entrance inside each scene

export const TOTAL_DURATION =
  INTRO + SCENE * 5 + OUTRO - TRANSITION * 6; // 678

type ShowcaseConfig = {
  index: string;
  title: string;
  accent: string;
  light?: boolean;
  Backdrop: React.FC;
  lowerThird: React.ReactNode;
};

const SHOWCASES: ShowcaseConfig[] = [
  {
    index: "01",
    title: "FROSTED GLASS",
    accent: "#8b5cf6",
    Backdrop: AuroraBackdrop,
    lowerThird: <GlassLowerThird />,
  },
  {
    index: "02",
    title: "NEON PULSE",
    accent: "#22d3ee",
    Backdrop: GridBackdrop,
    lowerThird: <NeonLowerThird />,
  },
  {
    index: "03",
    title: "BREAKING NEWS",
    accent: "#e11d48",
    Backdrop: StripesBackdrop,
    lowerThird: <BroadcastLowerThird />,
  },
  {
    index: "04",
    title: "EDITORIAL",
    accent: "#1a1714",
    light: true,
    Backdrop: PaperBackdrop,
    lowerThird: <MinimalLowerThird />,
  },
  {
    index: "05",
    title: "GOLD LUXE",
    accent: "#d9b97c",
    Backdrop: EmberBackdrop,
    lowerThird: <LuxeLowerThird />,
  },
];

const Showcase: React.FC<ShowcaseConfig> = ({
  index,
  title,
  accent,
  light,
  Backdrop,
  lowerThird,
}) => {
  return (
    <AbsoluteFill>
      <Backdrop />
      <SceneChrome
        index={index}
        title={title}
        accent={accent}
        light={light}
        sceneDuration={SCENE}
      />
      <Sequence from={ENTER_AT}>{lowerThird}</Sequence>
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO}>
          <Intro />
        </TransitionSeries.Sequence>
        {SHOWCASES.map((config) => (
          <React.Fragment key={config.index}>
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION })}
            />
            <TransitionSeries.Sequence durationInFrames={SCENE}>
              <Showcase {...config} />
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION })}
        />
        <TransitionSeries.Sequence durationInFrames={OUTRO}>
          <Outro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
