import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLORS = {
  bg: "#0a0b07",
  bgDeep: "#050603",
  raised: "#11130c",
  ink: "#eef0e2",
  inkDim: "#91957e",
  inkFaint: "#565a47",
  line: "rgba(238, 240, 226, 0.12)",
  lineStrong: "rgba(238, 240, 226, 0.22)",
  accent: "#d4ff3f",
  accentSoft: "rgba(212, 255, 63, 0.16)",
  rec: "#ff4438",
  ok: "#57d984",
};

const SANS =
  '"Bricolage Grotesque", "Inter", ui-sans-serif, system-ui, sans-serif';
const MONO =
  '"IBM Plex Mono", "SF Mono", "Cascadia Mono", ui-monospace, monospace';

const protocol = [
  {
    n: "01",
    label: "One canonical prompt",
    body: "Every model gets the same brief. No per-model tweaks.",
  },
  {
    n: "02",
    label: "Pinned Remotion 4.0.475",
    body: "Same scaffold. Same engine. Same starting line.",
  },
  {
    n: "03",
    label: "Untouched output",
    body: "The model writes the code. The render ships as-is.",
  },
  {
    n: "04",
    label: "You are the judge",
    body: "No scores. No leaderboard. Watch the work.",
  },
];

const entries = [
  {
    model: "Claude Fable 5",
    task: "Codeo Trailer",
    template: "base",
    status: "published",
    color: "#d4ff3f",
  },
  {
    model: "Claude Fable 5",
    task: "React Under the Hood",
    template: "skills",
    status: "published",
    color: "#57d984",
  },
  {
    model: "Claude Fable 5",
    task: "YouTube Lower Thirds",
    template: "base",
    status: "published",
    color: "#ff4438",
  },
  {
    model: "GPT-5.5",
    task: "Codeo Trailer",
    template: "base",
    status: "pending",
    color: "#eef0e2",
  },
  {
    model: "GPT-5.5",
    task: "React Under the Hood",
    template: "base",
    status: "pending",
    color: "#d4ff3f",
  },
  {
    model: "GPT-5.5",
    task: "YouTube Lower Thirds",
    template: "skills",
    status: "pending",
    color: "#57d984",
  },
];

const stats = [
  ["ENTRIES", "14"],
  ["MODELS", "03"],
  ["TASKS", "05"],
  ["BENCHMARK", "v1"],
  ["REMOTION", "4.0.475"],
];

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);
const snap = Easing.bezier(0.34, 1.56, 0.64, 1);

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const progress = (
  frame: number,
  start: number,
  duration: number,
  easing = easeOut,
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const exitProgress = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const sceneOpacity = (
  frame: number,
  start: number,
  end: number,
  fadeIn = 18,
  fadeOut = 18,
) => {
  const enter = fadeIn <= 0 ? 1 : progress(frame, start, fadeIn);
  const leave = fadeOut <= 0 ? 1 : 1 - exitProgress(frame, end - fadeOut, fadeOut);
  return Math.min(enter, leave);
};

const timecode = (frame: number, fps: number) => {
  const totalSeconds = Math.floor(frame / fps);
  const ff = String(Math.max(0, frame % fps)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  return `00:${mm}:${ss}:${ff}`;
};

const track = (frame: number, offset: number, speed: number, range: number) =>
  ((frame * speed + offset) % range) - range / 2;

const frameStyle = (style: CSSProperties): CSSProperties => style;

const writeAscii = (view: DataView, offset: number, text: string) => {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
};

const noise = (sample: number) => {
  const x = Math.sin(sample * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const decay = (time: number, hit: number, length: number) => {
  const delta = time - hit;
  if (delta < 0 || delta > length) {
    return 0;
  }
  return Math.exp(-delta * 8) * (1 - delta / length);
};

const makeSoundtrack = () => {
  const sampleRate = 22050;
  const durationSeconds = 14;
  const channels = 1;
  const bitsPerSample = 16;
  const sampleCount = sampleRate * durationSeconds;
  const bytesPerSample = bitsPerSample / 8;
  const buffer = new ArrayBuffer(44 + sampleCount * bytesPerSample);
  const view = new DataView(buffer);

  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + sampleCount * bytesPerSample, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * bytesPerSample, true);
  view.setUint16(32, channels * bytesPerSample, true);
  view.setUint16(34, bitsPerSample, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, sampleCount * bytesPerSample, true);

  const hits = [0.16, 2.55, 4.9, 7.18, 9.66, 11.28, 12.62];
  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleRate;
    const fadeIn = clamp(t / 0.6, 0, 1);
    const fadeOut = clamp((durationSeconds - t) / 1.2, 0, 1);
    const gate = fadeIn * fadeOut;
    const projector =
      0.045 * Math.sin(t * Math.PI * 2 * 48) +
      0.024 * Math.sin(t * Math.PI * 2 * 96);
    const tickPhase = t % 0.5;
    const tick =
      tickPhase < 0.028
        ? Math.exp(-tickPhase * 92) *
          (0.22 * Math.sin(t * Math.PI * 2 * 1300) +
            0.1 * (noise(i) - 0.5))
        : 0;
    const impact = hits.reduce((sum, hit, index) => {
      const env = decay(t, hit, index === 0 ? 0.28 : 0.48);
      return (
        sum +
        env *
          (0.5 * Math.sin(t * Math.PI * 2 * 54) +
            0.22 * Math.sin(t * Math.PI * 2 * 108) +
            0.05 * (noise(i + index * 41) - 0.5))
      );
    }, 0);
    const scan = ((Math.floor(t * 4) + Math.floor(t * 13)) % 7 === 0 ? 1 : 0) *
      0.015 *
      Math.sin(t * Math.PI * 2 * 410);
    const mixed = clamp((projector + tick + impact + scan) * gate, -0.92, 0.92);
    view.setInt16(44 + i * bytesPerSample, mixed * 32767, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
  }

  return `data:audio/wav;base64,${btoa(binary)}`;
};

const soundtrack = makeSoundtrack();

const TinyLabel: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: MONO,
      fontSize: 18,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: COLORS.accent,
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionRule: React.FC<{ label: string; frame: number; start: number }> = ({
  label,
  frame,
  start,
}) => {
  const p = progress(frame, start, 22);
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        right: 110,
        top: 118,
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`,
      }}
    >
      <TinyLabel>{label}</TinyLabel>
      <div
        style={{
          height: 1,
          flex: 1,
          background: COLORS.lineStrong,
          transform: `scaleX(${p})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sweep = track(frame, 0, 18, 2600);
  const pulse = (Math.sin(frame / 13) + 1) / 2;

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background:
          "radial-gradient(1100px 540px at 50% -10%, rgba(212, 255, 63, 0.06), transparent 62%), radial-gradient(900px 600px at 92% 112%, rgba(255, 68, 56, 0.04), transparent 60%), linear-gradient(180deg, #0c0d09 0%, #0a0b07 36%, #050603 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.42,
          backgroundImage:
            "linear-gradient(rgba(238,240,226,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(238,240,226,0.035) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: `translate(${(frame % 80) * -0.18}px, ${
            (frame % 80) * -0.12
          }px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(238, 240, 226, 0.018) 5px, transparent 6px)",
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: sweep,
          width: 260,
          background:
            "linear-gradient(90deg, transparent, rgba(212, 255, 63, 0.09), transparent)",
          filter: "blur(6px)",
          opacity: 0.42,
        }}
      />
      {Array.from({ length: 72 }, (_, i) => {
        const x = (i * 163 + 47) % 1920;
        const y = (i * 97 + 31) % 1080;
        const flicker = 0.02 + (((i * 11 + frame) % 17) / 17) * 0.07;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: i % 5 === 0 ? 3 : 2,
              height: i % 7 === 0 ? 8 : 2,
              opacity: flicker,
              background: COLORS.ink,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 26,
          top: 32,
          bottom: 32,
          width: 36,
          borderLeft: `1px solid ${COLORS.line}`,
          borderRight: `1px solid ${COLORS.line}`,
        }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 34,
              margin: "34px auto",
              borderRadius: 3,
              border: `1px solid ${COLORS.lineStrong}`,
              opacity: 0.5 + ((i + frame) % 3) * 0.1,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: 26,
          top: 32,
          bottom: 32,
          width: 36,
          borderLeft: `1px solid ${COLORS.line}`,
          borderRight: `1px solid ${COLORS.line}`,
        }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 34,
              margin: "34px auto",
              borderRadius: 3,
              border: `1px solid ${COLORS.lineStrong}`,
              opacity: 0.42 + ((i + frame + 1) % 3) * 0.1,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          bottom: 54,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: MONO,
          fontSize: 18,
          color: COLORS.inkDim,
          opacity: 0.78,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: COLORS.rec,
              boxShadow: `0 0 ${8 + pulse * 16}px ${COLORS.rec}`,
            }}
          />
          REC {timecode(frame, fps)}
        </div>
        <div>1920x1080 / 30FPS / RENDER AS-IS</div>
      </div>
    </AbsoluteFill>
  );
};

const HeaderChrome: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 8, 24);

  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 96,
        top: 42,
        height: 52,
        display: "flex",
        alignItems: "center",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [-18, 0])}px)`,
        color: COLORS.ink,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          fontFamily: SANS,
          fontSize: 28,
          fontWeight: 800,
          letterSpacing: 0,
        }}
      >
        CODEO
        <span
          style={{
            fontFamily: MONO,
            fontSize: 14,
            letterSpacing: 3,
            color: COLORS.bg,
            background: COLORS.accent,
            borderRadius: 3,
            padding: "5px 9px",
          }}
        >
          BENCH
        </span>
      </div>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          gap: 34,
          fontFamily: MONO,
          fontSize: 15,
          letterSpacing: 3,
          color: COLORS.inkDim,
        }}
      >
        <span>GALLERY</span>
        <span>ABOUT</span>
        <span style={{ color: COLORS.accent }}>v1</span>
      </div>
    </div>
  );
};

const OpeningSlate: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 0, 92, 8, 22);
  const clapper = progress(frame, 0, 24, snap);
  const title = progress(frame, 18, 34);
  const subtitle = progress(frame, 44, 20);
  const bite = progress(frame, 64, 12);
  const jaw = interpolate(clapper, [0, 1], [-28, 0]);
  const titleY = interpolate(title, [0, 1], [90, 0]);
  const mask = interpolate(title, [0, 1], [0, 100]);

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          left: 214,
          top: 196,
          width: 410,
          height: 294,
          transform: `translateX(${interpolate(clapper, [0, 1], [-140, 0])}px) rotate(${interpolate(
            clapper,
            [0, 1],
            [-5, -1.5],
          )}deg)`,
          opacity: clapper,
          filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.55))",
        }}
      >
        <div
          style={{
            height: 44,
            border: `1px solid ${COLORS.lineStrong}`,
            background:
              "repeating-linear-gradient(-45deg, #d4ff3f 0 28px, #0a0b07 28px 56px)",
            transformOrigin: "24px 44px",
            transform: `rotate(${jaw}deg)`,
          }}
        />
        <div
          style={{
            height: 250,
            border: `1px solid ${COLORS.lineStrong}`,
            borderTop: 0,
            background: COLORS.raised,
            padding: 28,
          }}
        >
          <TinyLabel style={{ color: COLORS.inkFaint }}>production</TinyLabel>
          <div
            style={{
              marginTop: 18,
              fontFamily: MONO,
              color: COLORS.ink,
              fontSize: 28,
              letterSpacing: 2,
            }}
          >
            CODEO BENCH
          </div>
          <div
            style={{
              marginTop: 34,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              fontFamily: MONO,
              fontSize: 14,
              color: COLORS.inkDim,
              letterSpacing: 2,
            }}
          >
            <span>TAKE 01</span>
            <span>FPS 30</span>
            <span>ENGINE 4.0.475</span>
            <span>STATUS LIVE</span>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 710,
          top: 210,
          right: 130,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            clipPath: `inset(0 ${100 - mask}% 0 0)`,
          }}
        >
          <div
            style={{
              fontFamily: SANS,
              color: COLORS.ink,
              fontSize: 132,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: 0,
              textTransform: "uppercase",
            }}
          >
            Remotion
          </div>
          <div
            style={{
              fontFamily: SANS,
              color: "transparent",
              WebkitTextStroke: `2px ${COLORS.accent}`,
              fontSize: 132,
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: 0,
              textTransform: "uppercase",
              filter: "drop-shadow(0 0 22px rgba(212,255,63,0.22))",
            }}
          >
            Benchmark
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 724,
          top: 510,
          width: 610,
          fontFamily: SANS,
          fontSize: 31,
          lineHeight: 1.35,
          color: COLORS.inkDim,
          opacity: subtitle,
          transform: `translateY(${interpolate(subtitle, [0, 1], [28, 0])}px)`,
        }}
      >
        Same prompt. Same pinned template. Watch what each model makes when the
        render is left untouched.
      </div>
      <div
        style={{
          position: "absolute",
          left: 724,
          top: 642,
          display: "flex",
          gap: 12,
          opacity: bite,
          transform: `translateY(${interpolate(bite, [0, 1], [20, 0])}px)`,
        }}
      >
        {["NO SCORES", "NO RANKINGS", "PRESS PLAY"].map((word, i) => (
          <div
            key={word}
            style={{
              fontFamily: MONO,
              fontSize: 15,
              letterSpacing: 2,
              color: i === 2 ? COLORS.bg : COLORS.ink,
              background: i === 2 ? COLORS.accent : "rgba(238,240,226,0.06)",
              border: `1px solid ${i === 2 ? COLORS.accent : COLORS.line}`,
              borderRadius: 3,
              padding: "10px 13px",
            }}
          >
            {word}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const ProtocolScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 72, 172, 18, 24);
  const panelIn = progress(frame, 80, 26);
  const promptReveal = clamp(Math.floor(progress(frame, 92, 56) * 132), 0, 132);
  const prompt =
    "Create a trailer for CodeoBench: the Remotion benchmark. The website lives in ../../../. Make it highly animated. Make it real.";

  return (
    <AbsoluteFill style={{ opacity }}>
      <SectionRule label="protocol" frame={frame} start={76} />
      <div
        style={{
          position: "absolute",
          left: 128,
          top: 210,
          width: 658,
          height: 558,
          border: `1px solid ${COLORS.lineStrong}`,
          background:
            "linear-gradient(180deg, rgba(17,19,12,0.96), rgba(5,6,3,0.88))",
          boxShadow: "0 36px 90px rgba(0,0,0,0.52)",
          transform: `translateY(${interpolate(panelIn, [0, 1], [55, 0])}px)`,
          opacity: panelIn,
        }}
      >
        <div
          style={{
            height: 24,
            background:
              "repeating-linear-gradient(-45deg, #d4ff3f 0 26px, #0a0b07 26px 52px)",
          }}
        />
        <div style={{ padding: 34 }}>
          <TinyLabel>task prompt</TinyLabel>
          <div
            style={{
              marginTop: 30,
              minHeight: 182,
              fontFamily: SANS,
              fontSize: 38,
              lineHeight: 1.16,
              color: COLORS.ink,
            }}
          >
            {prompt.slice(0, promptReveal)}
            <span style={{ color: COLORS.accent }}>
              {promptReveal < prompt.length ? "_" : ""}
            </span>
          </div>
          <div
            style={{
              marginTop: 38,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              background: COLORS.line,
              borderTop: `1px solid ${COLORS.line}`,
            }}
          >
            {[
              ["template", "base"],
              ["engine", "Remotion 4.0.475"],
              ["model", "GPT-5.5"],
              ["status", "pending"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  padding: "18px 20px",
                  background: COLORS.raised,
                  fontFamily: MONO,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: COLORS.inkFaint,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    marginTop: 7,
                    fontSize: 20,
                    color: value === "pending" ? COLORS.accent : COLORS.ink,
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 875,
          top: 194,
          right: 126,
        }}
      >
        {protocol.map((item, i) => {
          const row = progress(frame, 94 + i * 13, 22);
          return (
            <div
              key={item.n}
              style={{
                display: "grid",
                gridTemplateColumns: "88px 1fr",
                gap: 28,
                alignItems: "start",
                minHeight: 118,
                borderBottom: `1px solid ${COLORS.line}`,
                padding: "26px 0",
                opacity: row,
                transform: `translateX(${interpolate(row, [0, 1], [90, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 56,
                  lineHeight: 1,
                  color: item.n === "03" ? COLORS.accent : COLORS.inkFaint,
                }}
              >
                {item.n}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: SANS,
                    fontSize: 38,
                    lineHeight: 1.05,
                    color: COLORS.ink,
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: SANS,
                    fontSize: 25,
                    lineHeight: 1.32,
                    color: COLORS.inkDim,
                  }}
                >
                  {item.body}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {[
        { text: "FAILURES ARE RESULTS", x: 1010, y: 790, r: -5 },
        { text: "RENDERED UNTOUCHED", x: 1265, y: 720, r: 4 },
      ].map((stamp, i) => {
        const p = progress(frame, 132 + i * 14, 14, snap);
        return (
          <div
            key={stamp.text}
            style={{
              position: "absolute",
              left: stamp.x,
              top: stamp.y,
              border: `2px solid ${COLORS.rec}`,
              color: COLORS.rec,
              fontFamily: MONO,
              fontSize: 24,
              letterSpacing: 3,
              padding: "12px 16px",
              transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(${stamp.r}deg)`,
              opacity: p,
              boxShadow: "0 0 30px rgba(255,68,56,0.12)",
            }}
          >
            {stamp.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const ReelPanel: React.FC<{
  index: number;
  frame: number;
  total: number;
  spin: number;
}> = ({ index, frame, total, spin }) => {
  const entry = entries[index % entries.length];
  const angle = (360 / total) * index + spin;
  const pulse = (Math.sin((frame + index * 7) / 12) + 1) / 2;
  const isFront = Math.cos((angle * Math.PI) / 180) > 0.42;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 286,
        height: 162,
        marginLeft: -143,
        marginTop: -81,
        border: `1px solid ${isFront ? COLORS.lineStrong : COLORS.line}`,
        borderRadius: 8,
        overflow: "hidden",
        background:
          "linear-gradient(155deg, rgba(23,26,16,0.98), rgba(7,8,5,0.94))",
        transform: `rotateY(${angle}deg) translateZ(545px)`,
        backfaceVisibility: "hidden",
        boxShadow: isFront
          ? "0 34px 70px rgba(0,0,0,0.55), 0 0 34px rgba(212,255,63,0.08)"
          : "0 18px 36px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(238,240,226,0.08), transparent 12%, transparent 88%, rgba(238,240,226,0.08)), repeating-linear-gradient(0deg, transparent 0 8px, rgba(238,240,226,0.035) 8px 9px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 14,
          right: 14,
          height: 64,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 7,
        }}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            style={{
              background:
                i % 2 === 0
                  ? `linear-gradient(135deg, ${entry.color}44, transparent)`
                  : "rgba(238,240,226,0.08)",
              border: "1px solid rgba(238,240,226,0.08)",
              opacity: 0.58 + pulse * 0.28,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 38,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 18,
          lineHeight: 1.06,
          color: COLORS.ink,
        }}
      >
        {entry.task}
      </div>
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 13,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: 1.4,
          color: COLORS.inkDim,
          textTransform: "uppercase",
        }}
      >
        <span>{entry.template}</span>
        <span style={{ color: entry.status === "published" ? COLORS.ok : COLORS.accent }}>
          {entry.status}
        </span>
      </div>
    </div>
  );
};

const ReelScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 144, 272, 20, 28);
  const title = progress(frame, 152, 26);
  const spin = -frame * 1.42;
  const pull = progress(frame, 196, 70, easeInOut);

  return (
    <AbsoluteFill style={{ opacity, perspective: 1500 }}>
      <SectionRule label="the reel" frame={frame} start={150} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 160,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 130,
          fontWeight: 800,
          lineHeight: 0.92,
          textTransform: "uppercase",
          color: COLORS.ink,
          opacity: title,
          transform: `translateY(${interpolate(title, [0, 1], [70, 0])}px) scale(${interpolate(
            title,
            [0, 1],
            [0.96, 1],
          )})`,
        }}
      >
        Same brief.
        <br />
        Different motion.
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 330,
          height: 360,
          transformStyle: "preserve-3d",
          transform: `translateZ(${interpolate(pull, [0, 1], [0, 120])}px) rotateX(${-12 + pull * 4}deg) rotateY(${
            -14 + pull * 9
          }deg)`,
        }}
      >
        {Array.from({ length: 14 }, (_, i) => (
          <ReelPanel key={i} index={i} frame={frame} total={14} spin={spin} />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 290,
          right: 290,
          bottom: 160,
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 1,
          background: COLORS.line,
          borderTop: `1px solid ${COLORS.line}`,
          borderBottom: `1px solid ${COLORS.line}`,
          opacity: progress(frame, 194, 28),
        }}
      >
        {stats.map(([label, value], i) => {
          const p = progress(frame, 198 + i * 4, 18);
          return (
            <div
              key={label}
              style={{
                background: COLORS.bg,
                padding: "21px 18px",
                transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
                opacity: p,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 13,
                  letterSpacing: 2.4,
                  color: COLORS.inkFaint,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: MONO,
                  fontSize: label === "REMOTION" ? 25 : 37,
                  color: label === "BENCHMARK" ? COLORS.accent : COLORS.ink,
                }}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const TimelineStrip: React.FC<{ frame: number; start: number }> = ({
  frame,
  start,
}) => {
  const p = progress(frame, start, 28);
  const playhead = interpolate(progress(frame, start + 16, 76, easeInOut), [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        left: 112,
        right: 112,
        bottom: 126,
        height: 94,
        border: `1px solid ${COLORS.lineStrong}`,
        background: "rgba(5,6,3,0.78)",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 18,
          top: 14,
          fontFamily: MONO,
          fontSize: 13,
          letterSpacing: 2,
          color: COLORS.inkFaint,
        }}
      >
        TIMELINE / HOVER PREVIEWS / ZERO IDLE MEDIA
      </div>
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 17,
          height: 30,
          display: "grid",
          gridTemplateColumns: "1fr 0.74fr 1.2fr 0.9fr 1.1fr",
          gap: 7,
        }}
      >
        {[COLORS.accent, COLORS.rec, COLORS.ok, COLORS.inkDim, COLORS.accent].map(
          (color, i) => (
            <div
              key={`${color}-${i}`}
              style={{
                background: `${color}22`,
                border: `1px solid ${color}55`,
              }}
            />
          ),
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: `calc(18px + ${(playhead * 96).toFixed(2)}%)`,
          top: 7,
          bottom: 7,
          width: 2,
          background: COLORS.accent,
          boxShadow: "0 0 18px rgba(212,255,63,0.4)",
        }}
      />
    </div>
  );
};

const GalleryCard: React.FC<{
  index: number;
  frame: number;
  start: number;
  selected: boolean;
}> = ({ index, frame, start, selected }) => {
  const entry = entries[index];
  const p = progress(frame, start + index * 5, 24);
  const hover = selected ? progress(frame, start + 50, 16) : 0;
  const failedSweep = interpolate(
    (frame + index * 11) % 80,
    [0, 80],
    [-60, 360],
  );

  return (
    <div
      style={{
        position: "relative",
        height: 244,
        border: `1px solid ${selected ? COLORS.accent : COLORS.line}`,
        background:
          "linear-gradient(180deg, rgba(17,19,12,0.98), rgba(8,9,5,0.94))",
        boxShadow: selected
          ? "0 0 0 1px rgba(212,255,63,0.35), 0 26px 70px rgba(0,0,0,0.55)"
          : "0 20px 42px rgba(0,0,0,0.36)",
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [62, 0])}px) scale(${interpolate(
          hover,
          [0, 1],
          [1, 1.025],
        )})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "14px 14px 72px",
          background:
            "linear-gradient(135deg, rgba(238,240,226,0.12), rgba(238,240,226,0.02)), repeating-linear-gradient(90deg, transparent 0 34px, rgba(238,240,226,0.03) 34px 35px)",
          border: `1px solid ${COLORS.line}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: failedSweep,
            top: 0,
            bottom: 0,
            width: 66,
            background: `linear-gradient(90deg, transparent, ${entry.color}44, transparent)`,
            transform: "skewX(-18deg)",
            opacity: 0.68,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 18,
            top: 14,
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: 2,
            color: entry.status === "published" ? COLORS.ok : COLORS.accent,
          }}
        >
          {entry.status.toUpperCase()}
        </div>
        <div
          style={{
            position: "absolute",
            right: 17,
            top: 14,
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: 2,
            color: COLORS.inkDim,
          }}
        >
          {entry.template.toUpperCase()}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          bottom: 19,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1.05,
            color: COLORS.ink,
          }}
        >
          {entry.task}
        </div>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: 1.6,
            color: COLORS.inkDim,
          }}
        >
          <span>{entry.model}</span>
          <span>{String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
};

const GalleryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 246, 358, 20, 28);
  const headline = progress(frame, 254, 28);
  const inspector = progress(frame, 302, 26);

  return (
    <AbsoluteFill style={{ opacity }}>
      <SectionRule label="the gallery" frame={frame} start={252} />
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 196,
          width: 1086,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 18,
        }}
      >
        {entries.map((entry, i) => (
          <GalleryCard
            key={entry.task + entry.template + entry.model}
            index={i}
            frame={frame}
            start={262}
            selected={i === 3}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 1240,
          top: 198,
          width: 558,
          opacity: headline,
          transform: `translateX(${interpolate(headline, [0, 1], [76, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 0.94,
            color: COLORS.ink,
            textTransform: "uppercase",
          }}
        >
          Not a leaderboard.
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: SANS,
            fontSize: 30,
            lineHeight: 1.28,
            color: COLORS.inkDim,
          }}
        >
          A visual benchmark for taste: timing, easing, composition, restraint.
          The things numbers flatten.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1242,
          top: 558,
          width: 548,
          height: 244,
          border: `1px solid ${COLORS.lineStrong}`,
          background: "rgba(17,19,12,0.88)",
          opacity: inspector,
          transform: `translateY(${interpolate(inspector, [0, 1], [46, 0])}px)`,
        }}
      >
        <div
          style={{
            height: 36,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            borderBottom: `1px solid ${COLORS.line}`,
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: 2,
            color: COLORS.accent,
          }}
        >
          SELECTED ENTRY / GPT-5.5
        </div>
        {[
          ["task", "Codeo Trailer"],
          ["template", "base"],
          ["composition", "HelloWorld"],
          ["status", "pending"],
        ].map(([label, value], i) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "17px 18px",
              borderBottom: i === 3 ? 0 : `1px solid ${COLORS.line}`,
              fontFamily: MONO,
              fontSize: 17,
              color: COLORS.ink,
            }}
          >
            <span style={{ color: COLORS.inkFaint, textTransform: "uppercase" }}>
              {label}
            </span>
            <span style={{ color: value === "pending" ? COLORS.accent : COLORS.ink }}>
              {value}
            </span>
          </div>
        ))}
      </div>
      <TimelineStrip frame={frame} start={286} />
    </AbsoluteFill>
  );
};

const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = sceneOpacity(frame, 338, 420, 22, 0);
  const punch = progress(frame, 350, 28);
  const word = progress(frame, 382, 22, snap);
  const line = progress(frame, 394, 16);

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: "absolute",
          left: 116,
          top: 196,
          right: 116,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 146,
            lineHeight: 0.92,
            textTransform: "uppercase",
            color: COLORS.ink,
            transform: `translateY(${interpolate(punch, [0, 1], [80, 0])}px)`,
            opacity: punch,
          }}
        >
          Press play.
          <br />
          Judge by eye.
        </div>
        <div
          style={{
            margin: "48px auto 0",
            width: 820,
            fontFamily: SANS,
            fontSize: 32,
            lineHeight: 1.34,
            color: COLORS.inkDim,
            opacity: line,
            transform: `translateY(${interpolate(line, [0, 1], [34, 0])}px)`,
          }}
        >
          AI-generated Remotion videos, rendered from one pinned benchmark and
          shown for humans to compare.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 196,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 18,
          opacity: word,
          transform: `scale(${interpolate(word, [0, 1], [0.86, 1])})`,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 58,
            fontWeight: 800,
            color: COLORS.ink,
          }}
        >
          CODEO
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: 4,
            color: COLORS.bg,
            background: COLORS.accent,
            borderRadius: 4,
            padding: "9px 15px",
            boxShadow: "0 0 38px rgba(212,255,63,0.22)",
          }}
        >
          BENCH
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 578,
          right: 578,
          bottom: 126,
          height: 1,
          background: COLORS.lineStrong,
          transform: `scaleX(${line})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 82,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 16,
          letterSpacing: 3,
          color: COLORS.inkDim,
          opacity: line,
        }}
      >
        GALLERY / ABOUT / v1 / REMOTION 4.0.475
      </div>
    </AbsoluteFill>
  );
};

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        fontFamily: SANS,
        color: COLORS.ink,
        background: COLORS.bgDeep,
        overflow: "hidden",
      }}
    >
      <Audio src={soundtrack} volume={0.42} />
      <Background />
      <HeaderChrome />
      <OpeningSlate />
      <ProtocolScene />
      <ReelScene />
      <GalleryScene />
      <FinalScene />
      <div
        style={frameStyle({
          position: "absolute",
          inset: 0,
          border: "1px solid rgba(238,240,226,0.08)",
          boxShadow: `inset 0 0 ${90 + Math.sin(frame / 20) * 16}px rgba(0,0,0,0.72)`,
          pointerEvents: "none",
        })}
      />
    </AbsoluteFill>
  );
};
