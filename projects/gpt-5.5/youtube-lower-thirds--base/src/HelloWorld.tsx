import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
} from "remotion";
import { z } from "zod";

export const myCompSchema = z.object({});

const FPS = 30;
const DURATION = 660;
const FONT =
  'Inter, "Avenir Next", "Helvetica Neue", Arial, system-ui, sans-serif';
const MONO =
  '"SFMono-Regular", "SF Mono", Consolas, "Liberation Mono", monospace';
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

type Theme = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  dark: string;
  soft: string;
};

type SceneKind =
  | "creator"
  | "live"
  | "chapter"
  | "comment"
  | "stats"
  | "toolkit";

type SceneShellProps = {
  children: ReactNode;
  duration: number;
  eyebrow: string;
  kind: SceneKind;
  kicker: string;
  title: string;
  theme: Theme;
};

const themes: Record<SceneKind, Theme> = {
  creator: {
    name: "Creator identity",
    primary: "#7dd3fc",
    secondary: "#a78bfa",
    accent: "#f8fafc",
    glow: "rgba(125, 211, 252, 0.5)",
    dark: "#07111f",
    soft: "rgba(125, 211, 252, 0.16)",
  },
  live: {
    name: "Live stream",
    primary: "#ff2f53",
    secondary: "#ffb84d",
    accent: "#fff5f6",
    glow: "rgba(255, 47, 83, 0.55)",
    dark: "#19070c",
    soft: "rgba(255, 47, 83, 0.16)",
  },
  chapter: {
    name: "Chapter marker",
    primary: "#f7f0da",
    secondary: "#93c5fd",
    accent: "#ffffff",
    glow: "rgba(247, 240, 218, 0.34)",
    dark: "#10100c",
    soft: "rgba(247, 240, 218, 0.16)",
  },
  comment: {
    name: "Comment spotlight",
    primary: "#34d399",
    secondary: "#f472b6",
    accent: "#f0fdf4",
    glow: "rgba(52, 211, 153, 0.5)",
    dark: "#061410",
    soft: "rgba(52, 211, 153, 0.15)",
  },
  stats: {
    name: "Performance stats",
    primary: "#38bdf8",
    secondary: "#facc15",
    accent: "#eff6ff",
    glow: "rgba(56, 189, 248, 0.46)",
    dark: "#061221",
    soft: "rgba(56, 189, 248, 0.14)",
  },
  toolkit: {
    name: "Tutorial toolkit",
    primary: "#c084fc",
    secondary: "#22d3ee",
    accent: "#faf5ff",
    glow: "rgba(192, 132, 252, 0.46)",
    dark: "#120820",
    soft: "rgba(192, 132, 252, 0.15)",
  },
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const progress = (
  frame: number,
  from: number,
  duration: number,
  easing = easeOut,
) =>
  interpolate(frame, [from, from + duration], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const fadeWindow = (frame: number, duration: number) => {
  const intro = progress(frame, 0, 22);
  const outro = progress(frame, duration - 22, 22, easeIn);
  return intro * (1 - outro);
};

const surface: CSSProperties = {
  position: "absolute",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.16)",
  boxShadow:
    "0 34px 90px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.16)",
};

export const HelloWorld = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={styles.stage}>
      <AmbientBackground frame={frame} />
      <Sequence durationInFrames={95} premountFor={FPS}>
        <IntroScene />
      </Sequence>
      <Sequence from={78} durationInFrames={105} premountFor={FPS}>
        <CreatorScene duration={105} />
      </Sequence>
      <Sequence from={160} durationInFrames={105} premountFor={FPS}>
        <LiveScene duration={105} />
      </Sequence>
      <Sequence from={242} durationInFrames={105} premountFor={FPS}>
        <ChapterScene duration={105} />
      </Sequence>
      <Sequence from={324} durationInFrames={105} premountFor={FPS}>
        <CommentScene duration={105} />
      </Sequence>
      <Sequence from={406} durationInFrames={105} premountFor={FPS}>
        <StatsScene duration={105} />
      </Sequence>
      <Sequence from={488} durationInFrames={105} premountFor={FPS}>
        <ToolkitScene duration={105} />
      </Sequence>
      <Sequence from={570} durationInFrames={90} premountFor={FPS}>
        <FinaleScene />
      </Sequence>
      <TrailerHud frame={frame} />
      <FilmTexture />
    </AbsoluteFill>
  );
};

const AmbientBackground = ({ frame }: { frame: number }) => {
  const sweep = (frame / DURATION) * 100;
  const slow = Math.sin(frame / 48);
  const orbit = Math.cos(frame / 62);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 42%, rgba(24, 31, 48, 0.88) 0%, rgba(5, 7, 12, 1) 55%, #020203 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -180,
          background: `conic-gradient(from ${frame * 0.18}deg at 50% 50%, rgba(125, 211, 252, 0.03), rgba(255, 47, 83, 0.13), rgba(192, 132, 252, 0.08), rgba(52, 211, 153, 0.11), rgba(125, 211, 252, 0.03))`,
          filter: "blur(26px)",
          transform: `scale(${1.05 + slow * 0.02}) rotate(${orbit * 2}deg)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 940,
          height: 940,
          left: -240 + slow * 42,
          top: -260 + orbit * 32,
          borderRadius: 940,
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.16), rgba(56, 189, 248, 0) 64%)",
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1120,
          height: 1120,
          right: -420 + orbit * 48,
          bottom: -520 + slow * 34,
          borderRadius: 1120,
          background:
            "radial-gradient(circle, rgba(244, 114, 182, 0.16), rgba(244, 114, 182, 0) 63%)",
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.034) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          transform: `translate(${-(frame % 72)}px, ${-(frame % 72) / 2}px)`,
          opacity: 0.34,
          maskImage:
            "radial-gradient(circle at 50% 46%, rgba(0,0,0,1), transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 46%, rgba(0,0,0,1), transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${sweep - 25}%`,
          top: -260,
          width: 290,
          height: 1600,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          transform: "rotate(18deg)",
          filter: "blur(20px)",
          opacity: 0.65,
        }}
      />
    </AbsoluteFill>
  );
};

const IntroScene = () => {
  const frame = useCurrentFrame();
  const titleIn = progress(frame, 8, 30);
  const secondLine = progress(frame, 22, 24);
  const cardsIn = progress(frame, 38, 24);
  const exit = progress(frame, 76, 16, easeIn);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        transform: `scale(${1 - exit * 0.04})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 112,
          top: 116,
          fontFamily: MONO,
          fontSize: 20,
          letterSpacing: 5,
          color: "rgba(255,255,255,0.58)",
          textTransform: "uppercase",
          opacity: titleIn,
        }}
      >
        YouTube motion pack / lower third trailer
      </div>
      <div
        style={{
          position: "absolute",
          left: 106,
          top: 188,
          width: 1280,
          color: "white",
          fontSize: 126,
          lineHeight: 0.9,
          fontWeight: 900,
          letterSpacing: -3,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 44}px)`,
        }}
      >
        LOWER THIRDS
        <br />
        <span
          style={{
            color: "transparent",
            WebkitTextStroke: "2px rgba(255,255,255,0.72)",
            opacity: secondLine,
          }}
        >
          WITH RANGE.
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 472,
          width: 820,
          color: "rgba(255,255,255,0.68)",
          fontSize: 33,
          lineHeight: 1.32,
          fontWeight: 500,
          opacity: secondLine,
          transform: `translateY(${(1 - secondLine) * 28}px)`,
        }}
      >
        Six purpose-built YouTube lower thirds, treated like product reveals:
        identity, live, chapters, comments, analytics, and tutorials.
      </div>
      <div
        style={{
          position: "absolute",
          right: 104,
          top: 164,
          width: 580,
          height: 740,
          opacity: cardsIn,
          transform: `translateX(${(1 - cardsIn) * 80}px) rotateY(${(1 - cardsIn) * -12}deg)`,
          perspective: 1200,
        }}
      >
        {[
          ["CREATOR", themes.creator.primary, 0],
          ["LIVE", themes.live.primary, 1],
          ["CHAPTER", themes.chapter.primary, 2],
          ["COMMENT", themes.comment.primary, 3],
          ["STATS", themes.stats.primary, 4],
          ["TOOLKIT", themes.toolkit.primary, 5],
        ].map(([label, color, index]) => {
          const y = Number(index) * 86;
          const pulse = Math.sin((frame + Number(index) * 15) / 18) * 6;
          return (
            <div
              key={label}
              style={{
                ...surface,
                left: Number(index) % 2 === 0 ? 0 : 52,
                top: 46 + y + pulse,
                width: 500,
                height: 78,
                borderRadius: 24,
                background: `linear-gradient(100deg, rgba(255,255,255,0.1), rgba(255,255,255,0.04)), linear-gradient(90deg, ${color}44, rgba(255,255,255,0.03))`,
                transform: `rotate(${Number(index) % 2 === 0 ? -2 : 2}deg)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 28,
                  top: 25,
                  width: 120,
                  height: 9,
                  borderRadius: 8,
                  background: String(color),
                  boxShadow: `0 0 30px ${color}`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 170,
                  top: 17,
                  color: "white",
                  fontFamily: MONO,
                  fontSize: 20,
                  letterSpacing: 4,
                  fontWeight: 800,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 24,
                  top: 22,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  border: `1px solid ${color}`,
                  background: `${color}22`,
                }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CreatorScene = ({ duration }: { duration: number }) => (
  <SceneShell
    duration={duration}
    eyebrow="01 / Creator identity"
    kind="creator"
    kicker="For channels where the host is the brand."
    theme={themes.creator}
    title="Glass identity plate"
  >
    <CreatorLowerThird />
  </SceneShell>
);

const LiveScene = ({ duration }: { duration: number }) => (
  <SceneShell
    duration={duration}
    eyebrow="02 / Live stream"
    kind="live"
    kicker="Status, viewers, title, and audio movement in one glance."
    theme={themes.live}
    title="Broadcast live strip"
  >
    <LiveLowerThird />
  </SceneShell>
);

const ChapterScene = ({ duration }: { duration: number }) => (
  <SceneShell
    duration={duration}
    eyebrow="03 / Chapter marker"
    kind="chapter"
    kicker="A restrained editorial marker for essay videos and deep dives."
    theme={themes.chapter}
    title="Editorial chapter tag"
  >
    <ChapterLowerThird />
  </SceneShell>
);

const CommentScene = ({ duration }: { duration: number }) => (
  <SceneShell
    duration={duration}
    eyebrow="04 / Community"
    kind="comment"
    kicker="Turn a viewer comment into a polished on-screen moment."
    theme={themes.comment}
    title="Pinned comment feature"
  >
    <CommentLowerThird />
  </SceneShell>
);

const StatsScene = ({ duration }: { duration: number }) => (
  <SceneShell
    duration={duration}
    eyebrow="05 / Analytics"
    kind="stats"
    kicker="Big metrics and stat cells for creator updates or sports cuts."
    theme={themes.stats}
    title="Data-driven stat slab"
  >
    <StatsLowerThird />
  </SceneShell>
);

const ToolkitScene = ({ duration }: { duration: number }) => (
  <SceneShell
    duration={duration}
    eyebrow="06 / Tutorial"
    kind="toolkit"
    kicker="Step modules, shortcut callouts, and progress in one compact bar."
    theme={themes.toolkit}
    title="Tutorial command bar"
  >
    <ToolkitLowerThird />
  </SceneShell>
);

const SceneShell = ({
  children,
  duration,
  eyebrow,
  kind,
  kicker,
  theme,
  title,
}: SceneShellProps) => {
  const frame = useCurrentFrame();
  const opacity = fadeWindow(frame, duration);
  const enter = progress(frame, 2, 28);
  const label = progress(frame, 12, 18);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `scale(${0.985 + enter * 0.015})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 94,
          top: 80,
          zIndex: 5,
          color: theme.primary,
          fontFamily: MONO,
          fontSize: 18,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: label,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 118,
          zIndex: 5,
          width: 470,
          color: "white",
          fontSize: 48,
          lineHeight: 0.96,
          fontWeight: 880,
          letterSpacing: -1,
          opacity: label,
          transform: `translateY(${(1 - label) * 24}px)`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          left: 94,
          top: 232,
          zIndex: 5,
          width: 360,
          color: "rgba(255,255,255,0.58)",
          fontSize: 21,
          lineHeight: 1.28,
          fontWeight: 520,
          opacity: label,
        }}
      >
        {kicker}
      </div>
      <MockYouTubeFrame kind={kind} theme={theme}>
        {children}
      </MockYouTubeFrame>
    </AbsoluteFill>
  );
};

const MockYouTubeFrame = ({
  children,
  kind,
  theme,
}: {
  children: ReactNode;
  kind: SceneKind;
  theme: Theme;
}) => {
  const frame = useCurrentFrame();
  const stageIn = progress(frame, 7, 30);
  const tilt = Math.sin(frame / 54) * 0.8;

  return (
    <div
      style={{
        position: "absolute",
        left: 286,
        top: 130,
        width: 1520,
        height: 856,
        borderRadius: 36,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.04))",
        padding: 16,
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: `0 60px 160px rgba(0,0,0,0.58), 0 0 130px ${theme.glow}`,
        opacity: stageIn,
        transform: `translate(${(1 - stageIn) * 90}px, ${(1 - stageIn) * 26}px) rotate(${tilt}deg)`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 26,
          overflow: "hidden",
          background: "#05060a",
        }}
      >
        <SceneBackdrop kind={kind} theme={theme} />
        <div
          style={{
            position: "absolute",
            left: 28,
            top: 26,
            display: "flex",
            gap: 10,
            opacity: 0.8,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
            <div
              key={color}
              style={{
                width: 14,
                height: 14,
                borderRadius: 14,
                background: color,
                boxShadow: `0 0 18px ${color}66`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            right: 34,
            top: 24,
            color: "rgba(255,255,255,0.55)",
            fontFamily: MONO,
            fontSize: 15,
            letterSpacing: 3,
          }}
        >
          3840 X 2160 / DESIGN PREVIEW
        </div>
        <div
          style={{
            position: "absolute",
            left: 42,
            right: 42,
            bottom: 26,
            height: 6,
            borderRadius: 6,
            background: "rgba(255,255,255,0.12)",
          }}
        >
          <div
            style={{
              width: `${38 + progress(frame, 0, 95, easeInOut) * 58}%`,
              height: "100%",
              borderRadius: 6,
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
              boxShadow: `0 0 24px ${theme.glow}`,
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

const SceneBackdrop = ({
  kind,
  theme,
}: {
  kind: SceneKind;
  theme: Theme;
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 34);
  const alternate = Math.cos(frame / 42);
  const palette = {
    creator:
      "linear-gradient(135deg, rgba(11, 24, 43, 0.95), rgba(17, 14, 38, 0.98))",
    live: "linear-gradient(135deg, rgba(24, 5, 11, 0.96), rgba(36, 18, 4, 0.98))",
    chapter:
      "linear-gradient(135deg, rgba(17, 17, 13, 0.96), rgba(4, 13, 24, 0.98))",
    comment:
      "linear-gradient(135deg, rgba(4, 22, 17, 0.96), rgba(28, 8, 24, 0.98))",
    stats:
      "linear-gradient(135deg, rgba(4, 17, 33, 0.98), rgba(21, 18, 3, 0.94))",
    toolkit:
      "linear-gradient(135deg, rgba(22, 7, 38, 0.98), rgba(3, 23, 28, 0.95))",
  };

  return (
    <AbsoluteFill
      style={{
        background: palette[kind],
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 160 + drift * 26,
          top: 116 + alternate * 20,
          width: 790,
          height: 500,
          borderRadius: 42,
          border: `1px solid ${theme.primary}44`,
          transform: `rotate(${-9 + drift * 2}deg)`,
          boxShadow: `0 0 90px ${theme.glow}`,
          background: `linear-gradient(135deg, ${theme.soft}, rgba(255,255,255,0.02))`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 140 + alternate * 28,
          top: 140 + drift * 28,
          width: 420,
          height: 420,
          borderRadius: 420,
          background: `radial-gradient(circle, ${theme.glow}, transparent 68%)`,
          filter: "blur(18px)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 112,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${theme.primary}88, transparent)`,
          opacity: 0.54,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "100% 42px",
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 120,
          bottom: 110,
          fontFamily: MONO,
          color: "rgba(255,255,255,0.08)",
          fontSize: 148,
          lineHeight: 0.88,
          fontWeight: 900,
          letterSpacing: -5,
          textAlign: "right",
          textTransform: "uppercase",
        }}
      >
        {theme.name}
      </div>
    </AbsoluteFill>
  );
};

const CreatorLowerThird = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 16, 24);
  const detail = progress(frame, 31, 18);
  const exit = progress(frame, 86, 16, easeIn);
  const active = enter * (1 - exit);
  const shine = progress(frame, 44, 28, easeInOut);

  return (
    <div
      style={{
        ...surface,
        left: 78,
        bottom: 84,
        width: 840,
        height: 154,
        borderRadius: 28,
        background:
          "linear-gradient(110deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06) 48%, rgba(125,211,252,0.17))",
        backdropFilter: "blur(24px)",
        opacity: active,
        transform: `translateX(${(1 - enter) * -140 + exit * -80}px) scale(${0.94 + enter * 0.06})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(110deg, transparent ${shine * 80 - 20}%, rgba(255,255,255,0.28) ${shine * 80}%, transparent ${shine * 80 + 18}%)`,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 24,
          width: 106,
          height: 106,
          borderRadius: 32,
          background:
            "radial-gradient(circle at 32% 28%, #ffffff, #7dd3fc 34%, #312e81 70%)",
          boxShadow: "0 0 38px rgba(125,211,252,0.74)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#06111f",
          fontSize: 44,
          fontWeight: 950,
          transform: `rotate(${-10 + enter * 10}deg)`,
        }}
      >
        M
      </div>
      <div
        style={{
          position: "absolute",
          left: 158,
          top: 25,
          color: "rgba(255,255,255,0.62)",
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: detail,
        }}
      >
        Verified creator
      </div>
      <div
        style={{
          position: "absolute",
          left: 156,
          top: 52,
          color: "white",
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: -1,
          clipPath: `inset(0 ${100 - detail * 100}% 0 0)`,
        }}
      >
        Mira Chen
      </div>
      <div
        style={{
          position: "absolute",
          left: 158,
          top: 104,
          color: "rgba(255,255,255,0.68)",
          fontSize: 22,
          fontWeight: 560,
          opacity: detail,
        }}
      >
        Design systems, filmed weekly
      </div>
      <div
        style={{
          position: "absolute",
          right: 26,
          top: 34,
          width: 168,
          height: 82,
          borderRadius: 24,
          background: "linear-gradient(135deg, #ffffff, #7dd3fc)",
          color: "#06111f",
          fontFamily: MONO,
          fontSize: 16,
          fontWeight: 950,
          letterSpacing: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textTransform: "uppercase",
          boxShadow: "0 18px 44px rgba(125,211,252,0.36)",
          opacity: detail,
          transform: `translateY(${(1 - detail) * 16}px)`,
        }}
      >
        Subscribe
      </div>
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          bottom: 0,
          height: 3,
          background: "rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            width: `${detail * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #7dd3fc, #a78bfa)",
            boxShadow: "0 0 18px rgba(125,211,252,0.82)",
          }}
        />
      </div>
    </div>
  );
};

const LiveLowerThird = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 14, 22);
  const exit = progress(frame, 86, 16, easeIn);
  const active = enter * (1 - exit);
  const ticker = -((frame * 4) % 330);

  return (
    <div
      style={{
        ...surface,
        left: 76,
        bottom: 82,
        width: 980,
        height: 132,
        borderRadius: 22,
        background:
          "linear-gradient(100deg, rgba(15,15,18,0.92), rgba(38,9,14,0.9) 48%, rgba(255,47,83,0.2))",
        opacity: active,
        transform: `translateY(${(1 - enter) * 120 + exit * 80}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 22,
          width: 144,
          height: 88,
          borderRadius: 18,
          background: "#ff2f53",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: MONO,
          fontSize: 28,
          fontWeight: 950,
          letterSpacing: 3,
          boxShadow: "0 0 50px rgba(255,47,83,0.72)",
          transform: `scale(${1 + Math.sin(frame / 6) * 0.025})`,
        }}
      >
        LIVE
      </div>
      <div
        style={{
          position: "absolute",
          left: 192,
          top: 21,
          color: "rgba(255,255,255,0.62)",
          fontFamily: MONO,
          fontSize: 15,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        28,409 watching now
      </div>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 52,
          color: "white",
          fontSize: 37,
          lineHeight: 1,
          fontWeight: 900,
          letterSpacing: -0.8,
        }}
      >
        Building a studio from scratch
      </div>
      <div
        style={{
          position: "absolute",
          left: 192,
          top: 98,
          width: 486,
          height: 22,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.54)",
            fontFamily: MONO,
            fontSize: 15,
            letterSpacing: 2,
            whiteSpace: "nowrap",
            transform: `translateX(${ticker}px)`,
          }}
        >
          CHAT HIGHLIGHT / NEW MEMBER / Q AND A OPEN / POLL LIVE / CHAT
          HIGHLIGHT / NEW MEMBER /
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 26,
          top: 30,
          width: 230,
          height: 74,
          display: "flex",
          alignItems: "end",
          gap: 8,
          justifyContent: "center",
        }}
      >
        {Array.from({ length: 18 }).map((_, index) => {
          const h =
            16 +
            Math.abs(Math.sin((frame + index * 9) / 7)) * 46 +
            (index % 3) * 4;
          return (
            <div
              key={index}
              style={{
                width: 7,
                height: h,
                borderRadius: 8,
                background:
                  index % 2 === 0
                    ? "linear-gradient(180deg, #ffb84d, #ff2f53)"
                    : "linear-gradient(180deg, #ffffff, #ff2f53)",
                boxShadow: "0 0 18px rgba(255,47,83,0.62)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const ChapterLowerThird = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 14, 26);
  const line = progress(frame, 30, 24);
  const exit = progress(frame, 86, 16, easeIn);
  const active = enter * (1 - exit);

  return (
    <div
      style={{
        position: "absolute",
        left: 82,
        bottom: 88,
        width: 890,
        height: 130,
        opacity: active,
        transform: `translateX(${(1 - enter) * -88 + exit * 90}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 10,
          width: 112,
          height: 112,
          borderRadius: 112,
          border: "1px solid rgba(247,240,218,0.5)",
          boxShadow: "0 0 50px rgba(247,240,218,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f7f0da",
          fontFamily: MONO,
          fontSize: 35,
          fontWeight: 900,
        }}
      >
        04
      </div>
      <div
        style={{
          position: "absolute",
          left: 144,
          top: 13,
          color: "rgba(247,240,218,0.74)",
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: 5,
          textTransform: "uppercase",
        }}
      >
        Chapter marker / 08:26
      </div>
      <div
        style={{
          position: "absolute",
          left: 144,
          top: 42,
          color: "#fffdf4",
          fontSize: 43,
          fontWeight: 860,
          letterSpacing: -0.8,
          clipPath: `inset(0 ${100 - line * 100}% 0 0)`,
        }}
      >
        Color grading the final pass
      </div>
      <div
        style={{
          position: "absolute",
          left: 145,
          right: 0,
          bottom: 18,
          height: 2,
          background: "rgba(247,240,218,0.16)",
        }}
      >
        <div
          style={{
            width: `${line * 100}%`,
            height: 2,
            background: "linear-gradient(90deg, #f7f0da, #93c5fd)",
            boxShadow: "0 0 20px rgba(247,240,218,0.5)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 144,
          bottom: 28,
          color: "rgba(255,255,255,0.48)",
          fontSize: 19,
          opacity: line,
        }}
      >
        Lift the highlights, protect skin tones, then sharpen the story.
      </div>
    </div>
  );
};

const CommentLowerThird = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 13, 24);
  const reveal = progress(frame, 32, 20);
  const exit = progress(frame, 86, 16, easeIn);
  const active = enter * (1 - exit);

  return (
    <div
      style={{
        ...surface,
        left: 78,
        bottom: 82,
        width: 940,
        height: 164,
        borderRadius: 32,
        background:
          "linear-gradient(110deg, rgba(4,22,17,0.9), rgba(255,255,255,0.09), rgba(244,114,182,0.16))",
        opacity: active,
        transform: `translateY(${(1 - enter) * 80 + exit * 70}px) rotate(${(1 - enter) * -3}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 24,
          width: 116,
          height: 116,
          borderRadius: 34,
          background:
            "linear-gradient(135deg, #34d399, #f0fdf4 42%, #f472b6)",
          color: "#03110d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 42,
          fontWeight: 950,
          boxShadow: "0 0 46px rgba(52,211,153,0.5)",
        }}
      >
        AJ
      </div>
      <div
        style={{
          position: "absolute",
          left: 168,
          top: 22,
          padding: "8px 13px",
          borderRadius: 999,
          background: "rgba(52,211,153,0.16)",
          color: "#bbf7d0",
          fontFamily: MONO,
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: 3,
          textTransform: "uppercase",
          opacity: reveal,
        }}
      >
        Pinned comment
      </div>
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 66,
          width: 650,
          color: "white",
          fontSize: 31,
          lineHeight: 1.12,
          fontWeight: 820,
          letterSpacing: -0.4,
          clipPath: `inset(0 ${100 - reveal * 100}% 0 0)`,
        }}
      >
        This made the whole edit finally click. More breakdowns like this,
        please.
      </div>
      <div
        style={{
          position: "absolute",
          right: 28,
          top: 31,
          width: 72,
          height: 72,
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f0fdf4",
          fontSize: 25,
          fontWeight: 900,
          transform: `scale(${0.9 + reveal * 0.1}) rotate(${Math.sin(frame / 12) * 4}deg)`,
        }}
      >
        9.8
      </div>
      <div
        style={{
          position: "absolute",
          right: 37,
          top: 108,
          color: "rgba(255,255,255,0.5)",
          fontFamily: MONO,
          fontSize: 13,
          letterSpacing: 2,
        }}
      >
        SENTIMENT
      </div>
    </div>
  );
};

const StatsLowerThird = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 12, 24);
  const cells = progress(frame, 30, 22);
  const exit = progress(frame, 86, 16, easeIn);
  const active = enter * (1 - exit);
  const retention = Math.round(interpolate(cells, [0, 1], [0, 72]));
  const ctr = interpolate(cells, [0, 1], [0, 9.4]).toFixed(1);
  const saves = Math.round(interpolate(cells, [0, 1], [0, 1280]));

  return (
    <div
      style={{
        ...surface,
        left: 78,
        bottom: 84,
        width: 1020,
        height: 148,
        borderRadius: 18,
        background:
          "linear-gradient(100deg, rgba(6,18,33,0.96), rgba(9,19,29,0.96) 45%, rgba(250,204,21,0.13))",
        opacity: active,
        transform: `translateX(${(1 - enter) * -150 + exit * 100}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 18,
          background: "linear-gradient(180deg, #38bdf8, #facc15)",
          boxShadow: "0 0 34px rgba(56,189,248,0.7)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 26,
          color: "rgba(255,255,255,0.58)",
          fontFamily: MONO,
          fontSize: 15,
          letterSpacing: 4,
          textTransform: "uppercase",
        }}
      >
        Post upload report
      </div>
      <div
        style={{
          position: "absolute",
          left: 42,
          top: 58,
          color: "white",
          fontSize: 39,
          fontWeight: 900,
          letterSpacing: -0.8,
        }}
      >
        How the cold open performed
      </div>
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 20,
          height: 108,
          display: "flex",
          gap: 12,
        }}
      >
        {[
          ["RETENTION", `${retention}%`, "#38bdf8"],
          ["CTR", `${ctr}%`, "#facc15"],
          ["SAVES", `${saves}`, "#93c5fd"],
        ].map(([label, value, color], index) => (
          <div
            key={label}
            style={{
              width: 150,
              height: 108,
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: 16,
              opacity: cells,
              transform: `translateY(${(1 - cells) * (24 + index * 8)}px)`,
            }}
          >
            <div
              style={{
                color: String(color),
                fontSize: 34,
                lineHeight: 1,
                fontWeight: 950,
                letterSpacing: -1,
              }}
            >
              {value}
            </div>
            <div
              style={{
                marginTop: 18,
                color: "rgba(255,255,255,0.52)",
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: 2,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ToolkitLowerThird = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 12, 22);
  const reveal = progress(frame, 28, 24);
  const exit = progress(frame, 86, 16, easeIn);
  const active = enter * (1 - exit);
  const fill = clamp((frame - 34) / 54);

  return (
    <div
      style={{
        ...surface,
        left: 78,
        bottom: 84,
        width: 1000,
        height: 142,
        borderRadius: 30,
        background:
          "linear-gradient(105deg, rgba(18,8,32,0.96), rgba(255,255,255,0.08), rgba(34,211,238,0.16))",
        opacity: active,
        transform: `translateY(${(1 - enter) * 92 + exit * 80}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 24,
          width: 92,
          height: 92,
          borderRadius: 26,
          background: "linear-gradient(135deg, #c084fc, #22d3ee)",
          boxShadow: "0 0 48px rgba(192,132,252,0.58)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          padding: 21,
        }}
      >
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            style={{
              borderRadius: 5,
              background: index === 0 ? "#ffffff" : "rgba(255,255,255,0.5)",
              transform: `scale(${0.8 + Math.abs(Math.sin((frame + index * 5) / 10)) * 0.2})`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 144,
          top: 26,
          color: "rgba(255,255,255,0.58)",
          fontFamily: MONO,
          fontSize: 15,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: reveal,
        }}
      >
        Step 3 of 5 / shortcut callout
      </div>
      <div
        style={{
          position: "absolute",
          left: 142,
          top: 58,
          color: "white",
          fontSize: 38,
          fontWeight: 900,
          letterSpacing: -0.8,
          clipPath: `inset(0 ${100 - reveal * 100}% 0 0)`,
        }}
      >
        Magnetic timeline selection
      </div>
      <div
        style={{
          position: "absolute",
          left: 144,
          bottom: 25,
          width: 525,
          height: 9,
          borderRadius: 9,
          background: "rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            width: `${fill * 100}%`,
            height: "100%",
            borderRadius: 9,
            background: "linear-gradient(90deg, #c084fc, #22d3ee)",
            boxShadow: "0 0 18px rgba(34,211,238,0.62)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 28,
          top: 32,
          height: 78,
          display: "flex",
          gap: 10,
          alignItems: "center",
          opacity: reveal,
        }}
      >
        {["CMD", "SHIFT", "M"].map((key, index) => (
          <div
            key={key}
            style={{
              minWidth: index === 2 ? 72 : 116,
              height: 70,
              borderRadius: 18,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.18)",
              color: index === 2 ? "#22d3ee" : "rgba(255,255,255,0.78)",
              fontFamily: MONO,
              fontSize: 18,
              fontWeight: 950,
              letterSpacing: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                index === 2 ? "0 0 28px rgba(34,211,238,0.36)" : undefined,
            }}
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
};

const FinaleScene = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 25);
  const stack = progress(frame, 16, 30);
  const title = progress(frame, 34, 24);

  return (
    <AbsoluteFill
      style={{
        opacity: fadeWindow(frame, 90),
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 108,
          color: "white",
          width: 840,
          fontSize: 90,
          lineHeight: 0.92,
          fontWeight: 930,
          letterSpacing: -2.2,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 34}px)`,
        }}
      >
        Six lower thirds.
        <br />
        Trailer-grade system.
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 360,
          width: 650,
          color: "rgba(255,255,255,0.62)",
          fontSize: 30,
          lineHeight: 1.3,
          opacity: title,
        }}
      >
        Built from scratch with frame-driven motion, layered glass, editorial
        type, live data, and creator-native pacing.
      </div>
      <div
        style={{
          position: "absolute",
          right: 112,
          top: 138,
          width: 820,
          height: 770,
          perspective: 1100,
        }}
      >
        {[
          ["Creator glass", themes.creator.primary],
          ["Live broadcast", themes.live.primary],
          ["Chapter marker", themes.chapter.primary],
          ["Pinned comment", themes.comment.primary],
          ["Stats slab", themes.stats.primary],
          ["Tutorial keys", themes.toolkit.primary],
        ].map(([label, color], index) => {
          const local = clamp(stack * 1.35 - index * 0.12);
          return (
            <div
              key={label}
              style={{
                ...surface,
                left: 64 + index * 18,
                top: 72 + index * 86,
                width: 650,
                height: 104,
                borderRadius: 24,
                background: `linear-gradient(100deg, ${String(color)}40, rgba(255,255,255,0.08), rgba(0,0,0,0.36))`,
                opacity: local,
                transform: `translateX(${(1 - local) * 180}px) rotateX(${(1 - local) * 18}deg) rotateZ(${-6 + index * 2}deg)`,
                boxShadow: `0 30px 90px rgba(0,0,0,0.36), 0 0 48px ${String(color)}44`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 26,
                  top: 28,
                  width: 58,
                  height: 48,
                  borderRadius: 16,
                  background: String(color),
                  boxShadow: `0 0 32px ${String(color)}`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 108,
                  top: 29,
                  color: "white",
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: -0.5,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 28,
                  top: 38,
                  color: "rgba(255,255,255,0.52)",
                  fontFamily: MONO,
                  fontSize: 14,
                  letterSpacing: 3,
                }}
              >
                READY
              </div>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 112,
          bottom: 92,
          color: "rgba(255,255,255,0.5)",
          fontFamily: MONO,
          fontSize: 19,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: title,
        }}
      >
        Component showcase / 1920 x 1080 / Remotion
      </div>
    </AbsoluteFill>
  );
};

const TrailerHud = ({ frame }: { frame: number }) => {
  const pct = Math.round((frame / (DURATION - 1)) * 100);

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 40,
          top: 40,
          color: "rgba(255,255,255,0.42)",
          fontFamily: MONO,
          fontSize: 13,
          letterSpacing: 3,
        }}
      >
        LOWER THIRD LAB / {String(pct).padStart(2, "0")}%
      </div>
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          bottom: 32,
          height: 2,
          background: "rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background:
              "linear-gradient(90deg, #7dd3fc, #ff2f53, #34d399, #c084fc)",
            boxShadow: "0 0 20px rgba(125,211,252,0.5)",
          }}
        />
      </div>
    </>
  );
};

const FilmTexture = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      backgroundImage:
        "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.05) 0 1px, transparent 1px), radial-gradient(circle at 70% 40%, rgba(255,255,255,0.035) 0 1px, transparent 1px)",
      backgroundSize: "5px 5px, 7px 7px",
      opacity: 0.28,
      mixBlendMode: "overlay",
    }}
  />
);

const styles = {
  stage: {
    backgroundColor: "#020203",
    color: "white",
    fontFamily: FONT,
    overflow: "hidden",
  },
} satisfies Record<string, CSSProperties>;
