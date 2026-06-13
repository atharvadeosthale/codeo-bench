import { AbsoluteFill, Sequence } from "remotion";
import { z } from "zod";
import { palette } from "./trailer/theme";
import { Scene } from "./trailer/Scene";
import { Intro } from "./trailer/Intro";
import { Outro } from "./trailer/Outro";
import { Grain, Vignette } from "./trailer/Overlays";
import {
  AuroraBG,
  NewsroomBG,
  GridBG,
  MeshBG,
  StudioBG,
  PaperBG,
} from "./trailer/Backgrounds";
import {
  GlassLowerThird,
  BreakingNewsLowerThird,
  NeonLowerThird,
  MinimalLowerThird,
  GradientPillLowerThird,
  TerminalLowerThird,
  LuxuryLowerThird,
  SocialLowerThird,
} from "./trailer/LowerThirds";

export const trailerSchema = z.object({});

const INTRO_DUR = 96;
const SCENE_DUR = 122;
const OVERLAP = 14;
const OUTRO_DUR = 150;
const STEP = SCENE_DUR - OVERLAP;
const FIRST = INTRO_DUR - OVERLAP;

// Intro(96) → 8 scenes(122 each, 108 step) → outro(150), all edge-overlapped.
// lastSceneEnd = 82 + 7*108 + 122 = 960; outro runs 946→1096. Tail to 1100.
export const TRAILER_DURATION = 1100;

const scenes = [
  {
    label: "Glassmorphism",
    accent: palette.cyan,
    background: <AuroraBG a={palette.cyan} b={palette.violet} />,
    lt: <GlassLowerThird duration={SCENE_DUR} />,
  },
  {
    label: "Breaking News",
    accent: palette.red,
    background: <NewsroomBG />,
    lt: <BreakingNewsLowerThird duration={SCENE_DUR} />,
  },
  {
    label: "Neon · Cyber",
    accent: palette.magenta,
    background: <GridBG accent={palette.magenta} />,
    lt: <NeonLowerThird duration={SCENE_DUR} />,
  },
  {
    label: "Editorial",
    accent: "#16181d",
    hudDark: true,
    background: <PaperBG />,
    lt: <MinimalLowerThird duration={SCENE_DUR} />,
  },
  {
    label: "Gradient Pill",
    accent: palette.violet,
    background: <MeshBG a={palette.magenta} b={palette.violet} c={palette.blue} />,
    lt: <GradientPillLowerThird duration={SCENE_DUR} />,
  },
  {
    label: "Terminal",
    accent: palette.lime,
    background: <GridBG accent={palette.emerald} />,
    lt: <TerminalLowerThird duration={SCENE_DUR} />,
  },
  {
    label: "Luxury",
    accent: palette.gold,
    background: <StudioBG />,
    lt: <LuxuryLowerThird duration={SCENE_DUR} />,
  },
  {
    label: "Social",
    accent: "#FF0033",
    background: <MeshBG a="#FF0033" b={palette.magenta} c={palette.violet} />,
    lt: <SocialLowerThird duration={SCENE_DUR} />,
  },
];

export const Trailer: React.FC<z.infer<typeof trailerSchema>> = () => {
  const total = scenes.length;
  const lastSceneEnd = FIRST + (total - 1) * STEP + SCENE_DUR;

  return (
    <AbsoluteFill style={{ backgroundColor: "#04050a" }}>
      <Sequence durationInFrames={INTRO_DUR}>
        <Intro duration={INTRO_DUR} />
      </Sequence>

      {scenes.map((s, i) => (
        <Sequence
          key={s.label}
          from={FIRST + i * STEP}
          durationInFrames={SCENE_DUR}
        >
          <Scene
            index={i + 1}
            total={total}
            label={s.label}
            accent={s.accent}
            duration={SCENE_DUR}
            hudDark={s.hudDark}
            background={s.background}
          >
            {s.lt}
          </Scene>
        </Sequence>
      ))}

      <Sequence from={lastSceneEnd - OVERLAP} durationInFrames={OUTRO_DUR}>
        <Outro duration={OUTRO_DUR} />
      </Sequence>

      <Vignette strength={0.5} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
