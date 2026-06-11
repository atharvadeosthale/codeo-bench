import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

export const myCompSchema = z.object({});

const palette = {
  ink: "#05060b",
  panel: "#10131e",
  panel2: "#171b29",
  white: "#f8fbff",
  muted: "#aab6c8",
  red: "#ff254d",
  cyan: "#29f1ff",
  violet: "#a769ff",
  mint: "#2fffb4",
  gold: "#ffd166",
  orange: "#ff7a2f",
  pink: "#ff4fd8",
};

const sceneDuration = 112;
const introDuration = 116;
const recapDuration = 126;

const timing = {
  intro: 0,
  creator: 98,
  live: 202,
  tech: 306,
  podcast: 410,
  gaming: 514,
  recap: 620,
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const clamped = (
  frame: number,
  input: [number, number],
  output: [number, number],
) =>
  interpolate(frame, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const ramp = (frame: number, start: number, length: number) =>
  clamped(frame, [start, start + length], [0, 1]);

const sceneOpacity = (frame: number, duration: number) =>
  Math.min(ramp(frame, 0, 18), clamped(frame, [duration - 18, duration], [1, 0]));

const px = (value: number) => `${value}px`;

const noiseDots = Array.from({ length: 72 }, (_, index) => ({
  id: index,
  x: (index * 139) % 1920,
  y: (index * 211) % 1080,
  size: 1 + (index % 3),
  opacity: 0.09 + (index % 5) * 0.025,
}));

const bars = Array.from({ length: 18 }, (_, index) => index);

const miniBars = Array.from({ length: 22 }, (_, index) => index);

type SceneShellProps = {
  children: ReactNode;
  duration: number;
  label: string;
  deck: string;
  index: string;
  accent: string;
};

const SceneShell = ({
  children,
  duration,
  label,
  deck,
  index,
  accent,
}: SceneShellProps) => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, duration);
  const lift = clamped(frame, [0, 26], [44, 0]);
  const scale = clamped(frame, [0, duration], [1.035, 1]);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateY(${px(lift)}) scale(${scale})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 76,
          display: "flex",
          alignItems: "center",
          gap: 18,
          color: palette.white,
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${accent}, rgba(255,255,255,0.08))`,
            display: "grid",
            placeItems: "center",
            boxShadow: `0 0 42px ${accent}66`,
          }}
        >
          {index}
        </div>
        <div>
          <div style={{ fontSize: 18, color: palette.muted, fontWeight: 600 }}>
            LOWER THIRD SYSTEM
          </div>
          <div style={{ fontSize: 32, lineHeight: 1.05 }}>{label}</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 64,
          right: 78,
          color: palette.muted,
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 22,
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        {deck}
      </div>

      <PreviewWindow accent={accent}>{children}</PreviewWindow>
    </AbsoluteFill>
  );
};

const PreviewWindow = ({
  children,
  accent,
}: {
  children: ReactNode;
  accent: string;
}) => {
  const frame = useCurrentFrame();
  const shimmer = interpolate(frame % 90, [0, 90], [-420, 1800], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 156,
        top: 134,
        width: 1608,
        height: 842,
        overflow: "hidden",
        borderRadius: 34,
        background:
          "linear-gradient(145deg, rgba(22,28,44,0.96), rgba(7,9,16,0.98))",
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: `0 48px 130px rgba(0,0,0,0.62), 0 0 92px ${accent}24`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 22% 20%, rgba(255,255,255,0.16), transparent 23%), radial-gradient(circle at 74% 36%, rgba(255,255,255,0.08), transparent 18%), linear-gradient(135deg, rgba(255,255,255,0.05), transparent 50%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: shimmer,
          width: 300,
          height: "100%",
          transform: "skewX(-18deg)",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 54,
          background: "rgba(6,8,14,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          gap: 12,
        }}
      >
        {[palette.red, palette.gold, palette.mint].map((color) => (
          <div
            key={color}
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: color,
              boxShadow: `0 0 18px ${color}66`,
            }}
          />
        ))}
        <div
          style={{
            marginLeft: 18,
            height: 24,
            width: 610,
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.52)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 20,
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          youtube.com/watch/design-premiere
        </div>
      </div>
      <div style={{ position: "absolute", inset: "54px 0 0 0" }}>
        {children}
      </div>
    </div>
  );
};

const CinematicBackground = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 746], [0, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 12%, rgba(255,37,77,0.22), transparent 26%), radial-gradient(circle at 82% 18%, rgba(41,241,255,0.20), transparent 28%), radial-gradient(circle at 58% 86%, rgba(167,105,255,0.22), transparent 28%), #05060b",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: `translate(${px(-drift * 0.35)}, ${px(drift * 0.2)})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -260 + drift,
          top: 120,
          width: 680,
          height: 680,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,37,77,0.24), rgba(255,37,77,0.03) 56%, transparent 72%)",
          filter: "blur(8px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -220 - drift * 0.4,
          bottom: -80,
          width: 780,
          height: 780,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(41,241,255,0.21), rgba(41,241,255,0.03) 52%, transparent 72%)",
          filter: "blur(8px)",
        }}
      />
      {noiseDots.map((dot) => (
        <div
          key={dot.id}
          style={{
            position: "absolute",
            left: (dot.x + drift * (0.2 + (dot.id % 4) * 0.06)) % 1920,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            borderRadius: "50%",
            opacity: dot.opacity,
            background: palette.white,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.52))",
        }}
      />
    </AbsoluteFill>
  );
};

const IntroScene = () => {
  const frame = useCurrentFrame();
  const titleIn = ramp(frame, 8, 30);
  const titleY = clamped(frame, [8, 42], [70, 0]);
  const subtitleOpacity = ramp(frame, 42, 20);
  const slash = ramp(frame, 16, 42);
  const lowerThirdY = clamped(frame, [52, 82], [120, 0]);
  const lowerThirdOpacity = ramp(frame, 46, 22);
  const exit = clamped(frame, [introDuration - 18, introDuration], [1, 0]);

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <div
        style={{
          position: "absolute",
          top: 136,
          left: 132,
          width: 1120,
          color: palette.white,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            transform: `translateY(${px(titleY)})`,
            opacity: titleIn,
            fontSize: 126,
            lineHeight: 0.92,
            fontWeight: 900,
            textShadow: "0 28px 80px rgba(0,0,0,0.52)",
          }}
        >
          YouTube lower thirds that announce the moment.
        </div>
        <div
          style={{
            marginTop: 34,
            width: 840,
            color: palette.muted,
            fontSize: 31,
            lineHeight: 1.24,
            opacity: subtitleOpacity,
            fontWeight: 650,
          }}
        >
          Five custom component systems, staged like a channel trailer.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 120,
          top: 132,
          width: 414,
          height: 414,
          borderRadius: 46,
          border: "1px solid rgba(255,255,255,0.14)",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
          boxShadow: "0 40px 120px rgba(0,0,0,0.42)",
          overflow: "hidden",
          opacity: ramp(frame, 28, 26),
          transform: `translateY(${px(clamped(frame, [28, 60], [60, 0]))})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 50,
            borderRadius: 34,
            background:
              "radial-gradient(circle at 50% 36%, rgba(255,255,255,0.22), transparent 30%), linear-gradient(135deg, rgba(255,37,77,0.72), rgba(41,241,255,0.72))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 166,
            top: 140,
            width: 112,
            height: 128,
            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
            background: palette.white,
            boxShadow: "0 0 42px rgba(255,255,255,0.62)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 88,
            background:
              "linear-gradient(90deg, rgba(255,37,77,0.94), rgba(255,209,102,0.92), rgba(41,241,255,0.94))",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          bottom: 118,
          height: 178,
          opacity: lowerThirdOpacity,
          transform: `translateY(${px(lowerThirdY)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            width: 790 + slash * 760,
            height: 178,
            borderRadius: 32,
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))",
            border: "1px solid rgba(255,255,255,0.17)",
            overflow: "hidden",
            boxShadow: "0 34px 100px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(255,37,77,0.5), transparent 28%, transparent 68%, rgba(41,241,255,0.42))",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 34,
              width: 110,
              height: 110,
              borderRadius: 28,
              background:
                "linear-gradient(135deg, rgba(255,37,77,0.96), rgba(167,105,255,0.96))",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 174,
              top: 42,
              width: 520,
              height: 30,
              borderRadius: 999,
              background: "rgba(255,255,255,0.8)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 174,
              top: 94,
              width: 760,
              height: 22,
              borderRadius: 999,
              background: "rgba(255,255,255,0.32)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 34,
              top: 40,
              width: 210,
              height: 54,
              borderRadius: 999,
              background: palette.red,
              boxShadow: `0 0 44px ${palette.red}88`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CreatorScene = () => {
  const frame = useCurrentFrame();

  return (
    <SceneShell
      duration={sceneDuration}
      label="Creator Signature"
      deck="identity, subscribe, kinetic brand bar"
      index="01"
      accent={palette.red}
    >
      <CreatorSet frame={frame} />
    </SceneShell>
  );
};

const CreatorSet = ({ frame }: { frame: number }) => {
  const avatarScale = spring({
    frame: frame - 20,
    fps: 30,
    config: { damping: 16, stiffness: 120, mass: 0.8 },
  });
  const track = clamped(frame, [10, 44], [-260, 0]);
  const width = clamped(frame, [16, 48], [420, 1110]);
  const badge = ramp(frame, 44, 18);
  const videoPan = clamped(frame, [0, sceneDuration], [-26, 26]);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, rgba(13,17,28,0.55), rgba(22,6,12,0.74)), radial-gradient(circle at 74% 18%, rgba(255,37,77,0.18), transparent 26%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${px(videoPan)})`,
        }}
      >
        <HeroChannelCard />
      </div>
      <CreatorLowerThird
        frame={frame}
        avatarScale={avatarScale}
        track={track}
        width={width}
        badge={badge}
      />
    </AbsoluteFill>
  );
};

const HeroChannelCard = () => (
  <div
    style={{
      position: "absolute",
      left: 104,
      top: 102,
      width: 810,
      height: 450,
      borderRadius: 36,
      overflow: "hidden",
      background:
        "linear-gradient(135deg, rgba(255,37,77,0.28), rgba(167,105,255,0.16)), #111522",
      border: "1px solid rgba(255,255,255,0.13)",
      boxShadow: "0 44px 100px rgba(0,0,0,0.38)",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 52,
        width: 260,
        height: 330,
        borderRadius: 36,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 104,
        width: 160,
        height: 160,
        borderRadius: "50%",
        background:
          "radial-gradient(circle at 52% 42%, #ffd7c7, #d67a84 58%, #442133 62%)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 66,
        top: 74,
        width: 350,
        height: 34,
        borderRadius: 999,
        background: "rgba(255,255,255,0.78)",
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 116,
        top: 134,
        width: 300,
        height: 22,
        borderRadius: 999,
        background: "rgba(255,255,255,0.26)",
      }}
    />
    <div
      style={{
        position: "absolute",
        right: 64,
        bottom: 70,
        width: 418,
        height: 160,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 14,
      }}
    >
      {[palette.red, palette.gold, palette.cyan].map((color, index) => (
        <div
          key={color}
          style={{
            borderRadius: 24,
            background: `linear-gradient(145deg, ${color}80, rgba(255,255,255,0.06))`,
            border: "1px solid rgba(255,255,255,0.12)",
            opacity: 0.85 - index * 0.08,
          }}
        />
      ))}
    </div>
  </div>
);

const CreatorLowerThird = ({
  frame,
  avatarScale,
  track,
  width,
  badge,
}: {
  frame: number;
  avatarScale: number;
  track: number;
  width: number;
  badge: number;
}) => {
  const redLine = clamped(frame, [38, 72], [0, 1]);
  const float = Math.sin(frame / 8) * 3;

  return (
    <div
      style={{
        position: "absolute",
        left: 132,
        bottom: 98,
        width,
        height: 182,
        transform: `translateX(${px(track)}) translateY(${px(float)})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 34,
          background:
            "linear-gradient(90deg, rgba(8,10,18,0.92), rgba(28,16,30,0.82), rgba(8,10,18,0.58))",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow:
            "0 28px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: `${redLine * 100}%`,
            height: 8,
            background:
              "linear-gradient(90deg, #ff254d, #ffd166, rgba(255,255,255,0))",
            boxShadow: `0 0 36px ${palette.red}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -70,
            top: -90,
            width: 310,
            height: 310,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,37,77,0.32), transparent 68%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 26,
          width: 130,
          height: 130,
          borderRadius: 36,
          background:
            "linear-gradient(145deg, rgba(255,37,77,1), rgba(167,105,255,1))",
          boxShadow: `0 0 54px ${palette.red}99`,
          transform: `scale(${avatarScale})`,
          display: "grid",
          placeItems: "center",
          color: palette.white,
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 50,
          fontWeight: 900,
        }}
      >
        MC
      </div>
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 38,
          color: palette.white,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 46, lineHeight: 1, fontWeight: 900 }}>
          Maya Chen
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 23,
            color: palette.muted,
            fontWeight: 700,
          }}
        >
          @maya.designs · cinematic edits weekly
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 34,
          top: 42,
          width: 220,
          height: 72,
          borderRadius: 999,
          background: palette.red,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          color: palette.white,
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 24,
          fontWeight: 900,
          opacity: badge,
          boxShadow: `0 16px 42px ${palette.red}55`,
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "11px solid transparent",
            borderBottom: "11px solid transparent",
            borderLeft: "18px solid white",
          }}
        />
        SUBSCRIBE
      </div>
    </div>
  );
};

const LiveScene = () => {
  const frame = useCurrentFrame();

  return (
    <SceneShell
      duration={sceneDuration}
      label="Live Stream Pulse"
      deck="live chip, topic rail, chat momentum"
      index="02"
      accent={palette.cyan}
    >
      <LiveSet frame={frame} />
    </SceneShell>
  );
};

const LiveSet = ({ frame }: { frame: number }) => {
  const barsHeight = miniBars.map((index) => {
    return 36 + Math.sin(frame / 5 + index * 0.65) * 22 + (index % 4) * 9;
  });
  const panelY = clamped(frame, [12, 40], [160, 0]);
  const pulse = 0.65 + Math.sin(frame / 5) * 0.18;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 28%, rgba(41,241,255,0.2), transparent 24%), linear-gradient(145deg, rgba(6,18,28,0.92), rgba(4,8,18,0.96))",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 98,
          top: 110,
          width: 620,
          height: 360,
          borderRadius: 34,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 50,
            right: 50,
            bottom: 50,
            borderRadius: 34,
            background:
              "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.18), transparent 28%), linear-gradient(135deg, rgba(41,241,255,0.34), rgba(167,105,255,0.2))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 205,
            top: 108,
            width: 206,
            height: 150,
            clipPath: "polygon(0 0, 100% 50%, 0 100%)",
            background: "rgba(255,255,255,0.92)",
            filter: "drop-shadow(0 0 22px rgba(41,241,255,0.55))",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          right: 126,
          top: 106,
          width: 528,
          height: 380,
          display: "flex",
          alignItems: "flex-end",
          gap: 11,
          opacity: ramp(frame, 20, 28),
        }}
      >
        {barsHeight.map((height, index) => (
          <div
            key={index}
            style={{
              width: 14,
              height,
              borderRadius: 999,
              background:
                index % 3 === 0
                  ? palette.cyan
                  : "rgba(255,255,255,0.22)",
              boxShadow:
                index % 3 === 0 ? `0 0 26px ${palette.cyan}66` : undefined,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          right: 98,
          bottom: 294,
          width: 380,
          display: "grid",
          gap: 12,
          opacity: ramp(frame, 44, 20),
        }}
      >
        {["This overlay is crisp", "Drop the color preset", "Replay that workflow"].map(
          (message, index) => (
            <div
              key={message}
              style={{
                height: 52,
                borderRadius: 18,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: index === 0 ? palette.white : palette.muted,
                fontFamily: "Inter, Arial, sans-serif",
                fontSize: 18,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                paddingLeft: 18,
                transform: `translateX(${px(clamped(frame, [44 + index * 7, 64 + index * 7], [70, 0]))})`,
              }}
            >
              {message}
            </div>
          ),
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: 100,
          right: 100,
          bottom: 86,
          height: 166,
          transform: `translateY(${px(panelY)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 24,
            background:
              "linear-gradient(90deg, rgba(2,7,15,0.94), rgba(8,28,42,0.91), rgba(2,7,15,0.92))",
            border: "1px solid rgba(41,241,255,0.36)",
            boxShadow: `0 24px 90px rgba(0,0,0,0.55), 0 0 58px ${palette.cyan}33`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -80 + (frame % 80) * 18,
              top: 0,
              width: 220,
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(41,241,255,0.22), transparent)",
              transform: "skewX(-22deg)",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 34,
            top: 32,
            width: 158,
            height: 72,
            borderRadius: 999,
            background: palette.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            color: palette.white,
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 26,
            fontWeight: 950,
            boxShadow: `0 0 ${px(36 + pulse * 18)} ${palette.red}77`,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: palette.white,
              opacity: pulse,
            }}
          />
          LIVE
        </div>
        <div
          style={{
            position: "absolute",
            left: 224,
            top: 32,
            color: palette.white,
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          <div style={{ fontSize: 38, fontWeight: 920, lineHeight: 1 }}>
            Designing a logo in real time
          </div>
          <div
            style={{
              marginTop: 14,
              color: palette.muted,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            24.8K watching · Q&A open · new superchat
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 38,
            top: 40,
            width: 310,
            height: 58,
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.13)",
            color: palette.cyan,
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 22,
            fontWeight: 850,
            display: "grid",
            placeItems: "center",
          }}
        >
          CHAT MOVING FAST
        </div>
      </div>
    </AbsoluteFill>
  );
};

const TechScene = () => {
  const frame = useCurrentFrame();

  return (
    <SceneShell
      duration={sceneDuration}
      label="Tech Review Spec Card"
      deck="chapter, metrics, verdict highlight"
      index="03"
      accent={palette.mint}
    >
      <TechSet frame={frame} />
    </SceneShell>
  );
};

const TechSet = ({ frame }: { frame: number }) => {
  const rotate = clamped(frame, [0, sceneDuration], [-6, 5]);
  const meter = clamped(frame, [36, 84], [0, 1]);
  const lift = clamped(frame, [10, 36], [130, 0]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 74% 16%, rgba(47,255,180,0.16), transparent 26%), linear-gradient(135deg, rgba(7,18,16,0.94), rgba(5,8,18,0.96))",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 154,
          top: 90,
          width: 470,
          height: 470,
          borderRadius: 58,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))",
          border: "1px solid rgba(255,255,255,0.14)",
          transform: `rotate(${rotate}deg)`,
          boxShadow: "0 48px 100px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 52,
            borderRadius: 44,
            background:
              "linear-gradient(145deg, rgba(47,255,180,0.45), rgba(41,241,255,0.17))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 126,
            top: 166,
            width: 220,
            height: 96,
            borderRadius: 26,
            border: "2px solid rgba(255,255,255,0.7)",
            color: palette.white,
            display: "grid",
            placeItems: "center",
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 54,
            fontWeight: 950,
          }}
        >
          4K
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 128,
          top: 126,
          width: 610,
          color: palette.white,
          fontFamily: "Inter, Arial, sans-serif",
          opacity: ramp(frame, 22, 24),
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 950, lineHeight: 0.96 }}>
          Ultra-wide lens review
        </div>
        <div
          style={{
            marginTop: 26,
            width: 470,
            color: palette.muted,
            fontSize: 25,
            lineHeight: 1.28,
            fontWeight: 650,
          }}
        >
          Sample frame, spec metadata, score chips, and chapter context all
          working as one component.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 124,
          right: 124,
          bottom: 82,
          height: 194,
          transform: `translateY(${px(lift)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 28,
            background:
              "linear-gradient(90deg, rgba(4,11,13,0.94), rgba(13,35,30,0.92), rgba(4,11,13,0.86))",
            border: "1px solid rgba(47,255,180,0.32)",
            boxShadow: `0 24px 90px rgba(0,0,0,0.56), 0 0 50px ${palette.mint}24`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 34,
            top: 34,
            width: 152,
            height: 126,
            borderRadius: 26,
            background:
              "linear-gradient(145deg, rgba(47,255,180,0.98), rgba(41,241,255,0.82))",
            color: "#031510",
            display: "grid",
            placeItems: "center",
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 40,
            fontWeight: 950,
          }}
        >
          9.4
        </div>
        <div
          style={{
            position: "absolute",
            left: 222,
            top: 38,
            color: palette.white,
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          <div style={{ fontSize: 42, lineHeight: 1, fontWeight: 940 }}>
            Verdict: flagship image, travel-size body
          </div>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 12,
            }}
          >
            {["Sharpness", "Stabilization", "Low light"].map((label, index) => (
              <SpecChip
                key={label}
                label={label}
                value={Math.round((82 + index * 6) * meter)}
                color={index === 1 ? palette.cyan : palette.mint}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 42,
            top: 42,
            width: 300,
            height: 108,
            borderRadius: 22,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            padding: 16,
            display: "flex",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          {bars.slice(0, 10).map((bar) => (
            <div
              key={bar}
              style={{
                flex: 1,
                height: `${(26 + ((bar * 17) % 70)) * meter}px`,
                borderRadius: 999,
                background:
                  bar % 2 === 0
                    ? palette.mint
                    : "rgba(255,255,255,0.28)",
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SpecChip = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div
    style={{
      height: 48,
      borderRadius: 999,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: palette.white,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 18px",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 18,
      fontWeight: 800,
    }}
  >
    <span style={{ color }}>{value}%</span>
    <span style={{ color: palette.muted }}>{label}</span>
  </div>
);

const PodcastScene = () => {
  const frame = useCurrentFrame();

  return (
    <SceneShell
      duration={sceneDuration}
      label="Podcast Guest Plate"
      deck="speaker identity, waveform, episode tag"
      index="04"
      accent={palette.gold}
    >
      <PodcastSet frame={frame} />
    </SceneShell>
  );
};

const PodcastSet = ({ frame }: { frame: number }) => {
  const leftX = clamped(frame, [12, 42], [-180, 0]);
  const rightX = clamped(frame, [18, 48], [180, 0]);
  const waveOpacity = ramp(frame, 46, 22);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 32%, rgba(255,209,102,0.18), transparent 24%), linear-gradient(135deg, rgba(26,17,12,0.92), rgba(8,8,16,0.98))",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 126,
          right: 126,
          top: 96,
          height: 392,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 34,
        }}
      >
        <SpeakerCard
          name="Andre Park"
          role="Host"
          color={palette.gold}
          initials="AP"
          transform={`translateX(${px(leftX)})`}
        />
        <SpeakerCard
          name="Nia Sol"
          role="Guest"
          color={palette.pink}
          initials="NS"
          transform={`translateX(${px(rightX)})`}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 122,
          right: 122,
          bottom: 84,
          height: 182,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 32,
            background:
              "linear-gradient(90deg, rgba(9,8,14,0.96), rgba(33,22,12,0.93), rgba(9,8,14,0.82))",
            border: "1px solid rgba(255,209,102,0.34)",
            boxShadow: "0 30px 100px rgba(0,0,0,0.58)",
            overflow: "hidden",
            transform: `translateY(${px(clamped(frame, [16, 44], [150, 0]))})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "0 0 auto 0",
              height: 7,
              background: `linear-gradient(90deg, ${palette.gold}, ${palette.pink}, transparent)`,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 32,
            width: 168,
            height: 118,
            borderRadius: 26,
            background:
              "linear-gradient(145deg, rgba(255,209,102,1), rgba(255,79,216,0.82))",
            color: "#160b12",
            display: "grid",
            placeItems: "center",
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 30,
            fontWeight: 950,
          }}
        >
          EP. 128
        </div>
        <div
          style={{
            position: "absolute",
            left: 230,
            top: 38,
            width: 730,
            color: palette.white,
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          <div style={{ fontSize: 36, lineHeight: 1.05, fontWeight: 940 }}>
            Creator Economy: what actually converts
          </div>
          <div
            style={{
              marginTop: 16,
              color: palette.muted,
              fontSize: 22,
              fontWeight: 750,
            }}
          >
            The Frame Perfect Podcast · New episode every Friday
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 38,
            top: 44,
            width: 320,
            height: 94,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: waveOpacity,
          }}
        >
          {miniBars.slice(0, 18).map((bar) => (
            <div
              key={bar}
              style={{
                width: 9,
                height: 16 + Math.abs(Math.sin(frame / 4 + bar)) * 64,
                borderRadius: 999,
                background:
                  bar % 3 === 0 ? palette.gold : "rgba(255,255,255,0.24)",
              }}
            />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SpeakerCard = ({
  name,
  role,
  color,
  initials,
  transform,
}: {
  name: string;
  role: string;
  color: string;
  initials: string;
  transform: string;
}) => (
  <div
    style={{
      position: "relative",
      borderRadius: 34,
      background:
        "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
      border: "1px solid rgba(255,255,255,0.13)",
      boxShadow: "0 36px 90px rgba(0,0,0,0.36)",
      overflow: "hidden",
      transform,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 34,
        top: 34,
        width: 170,
        height: 170,
        borderRadius: "50%",
        background: `linear-gradient(145deg, ${color}, rgba(255,255,255,0.18))`,
        boxShadow: `0 0 54px ${color}55`,
        display: "grid",
        placeItems: "center",
        color: palette.white,
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 48,
        fontWeight: 950,
      }}
    >
      {initials}
    </div>
    <div
      style={{
        position: "absolute",
        left: 236,
        top: 62,
        fontFamily: "Inter, Arial, sans-serif",
        color: palette.white,
      }}
    >
      <div style={{ color, fontSize: 23, fontWeight: 900 }}>{role}</div>
      <div style={{ marginTop: 12, fontSize: 46, fontWeight: 950 }}>{name}</div>
      <div
        style={{
          marginTop: 22,
          width: 300,
          height: 16,
          borderRadius: 999,
          background: "rgba(255,255,255,0.18)",
        }}
      />
      <div
        style={{
          marginTop: 14,
          width: 210,
          height: 16,
          borderRadius: 999,
          background: "rgba(255,255,255,0.12)",
        }}
      />
    </div>
  </div>
);

const GamingScene = () => {
  const frame = useCurrentFrame();

  return (
    <SceneShell
      duration={sceneDuration}
      label="Gaming Impact Strip"
      deck="rank badge, score burst, angular motion"
      index="05"
      accent={palette.pink}
    >
      <GamingSet frame={frame} />
    </SceneShell>
  );
};

const GamingSet = ({ frame }: { frame: number }) => {
  const shake =
    frame > 40 && frame < 62 ? Math.sin(frame * 1.8) * (62 - frame) * 0.35 : 0;
  const panelX = clamped(frame, [12, 36], [-620, 0]) + shake;
  const score = Math.round(clamped(frame, [40, 72], [0, 18450]));
  const rays = ramp(frame, 38, 18);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 72% 28%, rgba(255,79,216,0.2), transparent 26%), linear-gradient(135deg, rgba(10,7,22,0.95), rgba(3,13,16,0.98))",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(115deg, transparent 0 46%, rgba(255,255,255,0.05) 46% 47%, transparent 47% 100%)",
          backgroundSize: "140px 140px",
          transform: `translateX(${px((frame % 80) * -2)})`,
          opacity: 0.9,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 118,
          top: 112,
          color: palette.white,
          fontFamily: "Inter, Arial, sans-serif",
          opacity: ramp(frame, 20, 20),
        }}
      >
        <div style={{ fontSize: 76, lineHeight: 0.96, fontWeight: 960 }}>
          Final round highlight
        </div>
        <div
          style={{
            marginTop: 22,
            color: palette.muted,
            fontSize: 27,
            fontWeight: 700,
          }}
        >
          Fast readable data, big energy, no HUD clutter.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 150,
          top: 124,
          width: 420,
          height: 420,
          opacity: rays,
        }}
      >
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 196,
              top: 196,
              width: 16,
              height: 220,
              borderRadius: 999,
              transform: `rotate(${index * 36}deg) translateY(${px(-70 - rays * 24)})`,
              transformOrigin: "8px 14px",
              background:
                index % 2 === 0
                  ? "rgba(255,79,216,0.34)"
                  : "rgba(47,255,180,0.28)",
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 104,
          right: 104,
          bottom: 82,
          height: 190,
          transform: `translateX(${px(panelX)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%, 5% 50%)",
            background:
              "linear-gradient(90deg, rgba(255,79,216,0.96), rgba(16,16,28,0.94) 24%, rgba(16,35,34,0.95) 72%, rgba(47,255,180,0.96))",
            boxShadow: "0 34px 100px rgba(0,0,0,0.6)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 42,
            top: 30,
            width: 132,
            height: 132,
            clipPath: "polygon(50% 0, 100% 26%, 100% 74%, 50% 100%, 0 74%, 0 26%)",
            background: "#05060b",
            border: "2px solid rgba(255,255,255,0.72)",
            color: palette.gold,
            display: "grid",
            placeItems: "center",
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 42,
            fontWeight: 950,
          }}
        >
          MVP
        </div>
        <div
          style={{
            position: "absolute",
            left: 214,
            top: 40,
            color: palette.white,
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          <div style={{ fontSize: 46, lineHeight: 1, fontWeight: 960 }}>
            NovaStrike wins the clutch
          </div>
          <div
            style={{
              marginTop: 16,
              color: palette.muted,
              fontSize: 23,
              fontWeight: 750,
            }}
          >
            6 eliminations · 1v3 comeback · match point
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 92,
            top: 42,
            width: 300,
            height: 108,
            borderRadius: 24,
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: palette.white,
            display: "grid",
            placeItems: "center",
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          <div style={{ color: palette.mint, fontSize: 25, fontWeight: 900 }}>
            SCORE BURST
          </div>
          <div style={{ marginTop: -12, fontSize: 42, fontWeight: 960 }}>
            {score.toLocaleString("en-US")}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const RecapScene = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, recapDuration);
  const titleY = clamped(frame, [0, 28], [54, 0]);

  const cards = [
    { title: "Creator", color: palette.red },
    { title: "Live", color: palette.cyan },
    { title: "Tech", color: palette.mint },
    { title: "Podcast", color: palette.gold },
    { title: "Gaming", color: palette.pink },
  ];

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          left: 118,
          top: 82,
          color: palette.white,
          fontFamily: "Inter, Arial, sans-serif",
          transform: `translateY(${px(titleY)})`,
        }}
      >
        <div style={{ fontSize: 88, lineHeight: 0.95, fontWeight: 960 }}>
          A component pack for every channel moment.
        </div>
        <div
          style={{
            marginTop: 24,
            color: palette.muted,
            fontSize: 29,
            fontWeight: 700,
          }}
        >
          Brandable, readable, motion-rich lower thirds built from scratch.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 118,
          right: 118,
          bottom: 112,
          height: 520,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 20,
        }}
      >
        {cards.map((card, index) => {
          const cardIn = ramp(frame, 20 + index * 7, 24);
          const y = clamped(frame, [20 + index * 7, 46 + index * 7], [90, 0]);
          return (
            <MiniCard
              key={card.title}
              title={card.title}
              color={card.color}
              progress={cardIn}
              style={{
                transform: `translateY(${px(y)})`,
                opacity: cardIn,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 118,
          right: 118,
          bottom: 38,
          height: 36,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, #ff254d, #ffd166, #2fffb4, #29f1ff, #ff4fd8)",
          boxShadow: "0 0 44px rgba(255,255,255,0.22)",
          transform: `scaleX(${ramp(frame, 62, 40)})`,
          transformOrigin: "left center",
        }}
      />
    </AbsoluteFill>
  );
};

const MiniCard = ({
  title,
  color,
  progress,
  style,
}: {
  title: string;
  color: string;
  progress: number;
  style: CSSProperties;
}) => (
  <div
    style={{
      ...style,
      position: "relative",
      borderRadius: 28,
      background:
        "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 30px 90px rgba(0,0,0,0.36)",
      overflow: "hidden",
      fontFamily: "Inter, Arial, sans-serif",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 22,
        borderRadius: 22,
        background: `radial-gradient(circle at 50% 32%, ${color}55, transparent 42%), rgba(0,0,0,0.22)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 28,
        top: 32,
        color: palette.white,
        fontSize: 28,
        fontWeight: 950,
      }}
    >
      {title}
    </div>
    <div
      style={{
        position: "absolute",
        left: 28,
        right: 28,
        bottom: 116,
        height: 92,
        borderRadius: 18,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.11)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          width: 54,
          height: 54,
          borderRadius: 16,
          background: color,
          boxShadow: `0 0 30px ${color}66`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 22,
          width: `${progress * 112}px`,
          height: 16,
          borderRadius: 999,
          background: palette.white,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 52,
          width: `${progress * 150}px`,
          height: 12,
          borderRadius: 999,
          background: "rgba(255,255,255,0.28)",
        }}
      />
    </div>
    <div
      style={{
        position: "absolute",
        left: 28,
        right: 28,
        bottom: 32,
        height: 54,
        borderRadius: 999,
        background: `linear-gradient(90deg, ${color}, rgba(255,255,255,0.12))`,
        transform: `scaleX(${progress})`,
        transformOrigin: "left center",
      }}
    />
  </div>
);

const TimecodeRail = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;

  return (
    <div
      style={{
        position: "absolute",
        left: 78,
        right: 78,
        bottom: 34,
        height: 2,
        background: "rgba(255,255,255,0.11)",
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          background:
            "linear-gradient(90deg, #ff254d, #ffd166, #2fffb4, #29f1ff, #ff4fd8)",
          boxShadow: "0 0 18px rgba(255,255,255,0.38)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 14,
          color: "rgba(255,255,255,0.5)",
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        LOWER THIRD TRAILER
      </div>
    </div>
  );
};

export const HelloWorld: React.FC<z.infer<typeof myCompSchema>> = () => {
  return (
    <AbsoluteFill>
      <CinematicBackground />
      <Sequence from={timing.intro} durationInFrames={introDuration}>
        <IntroScene />
      </Sequence>
      <Sequence from={timing.creator} durationInFrames={sceneDuration}>
        <CreatorScene />
      </Sequence>
      <Sequence from={timing.live} durationInFrames={sceneDuration}>
        <LiveScene />
      </Sequence>
      <Sequence from={timing.tech} durationInFrames={sceneDuration}>
        <TechScene />
      </Sequence>
      <Sequence from={timing.podcast} durationInFrames={sceneDuration}>
        <PodcastScene />
      </Sequence>
      <Sequence from={timing.gaming} durationInFrames={sceneDuration}>
        <GamingScene />
      </Sequence>
      <Sequence from={timing.recap} durationInFrames={recapDuration}>
        <RecapScene />
      </Sequence>
      <TimecodeRail />
    </AbsoluteFill>
  );
};
