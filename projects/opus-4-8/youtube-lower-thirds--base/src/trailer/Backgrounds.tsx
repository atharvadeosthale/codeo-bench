import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { palette } from "./theme";

// A slow, always-moving blob. Returns a positioned radial-gradient div.
const Blob: React.FC<{
  color: string;
  size: number;
  x: number;
  y: number;
  ax: number;
  ay: number;
  speed: number;
  phase: number;
  opacity?: number;
}> = ({ color, size, x, y, ax, ay, speed, phase, opacity = 0.7 }) => {
  const frame = useCurrentFrame();
  const t = (frame * speed) / 100 + phase;
  const dx = Math.sin(t) * ax;
  const dy = Math.cos(t * 0.8) * ay;
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px)`,
        background: `radial-gradient(circle at center, ${color} 0%, transparent 65%)`,
        opacity,
        filter: "blur(8px)",
      }}
    />
  );
};

// Subtle continuous zoom so static layers feel like footage (Ken Burns).
const useKenBurns = (amount = 0.06, duration = 130) => {
  const frame = useCurrentFrame();
  const scale = 1 + interpolate(frame % duration, [0, duration], [0, amount]);
  return scale;
};

export const AuroraBG: React.FC<{ a: string; b: string }> = ({ a, b }) => {
  const scale = useKenBurns(0.08);
  return (
    <AbsoluteFill style={{ background: "#070a14", transform: `scale(${scale})` }}>
      <Blob color={a} size={1100} x={28} y={32} ax={70} ay={50} speed={0.6} phase={0} opacity={0.55} />
      <Blob color={b} size={1300} x={74} y={62} ax={90} ay={70} speed={0.5} phase={2} opacity={0.5} />
      <Blob color={palette.indigo} size={900} x={55} y={20} ax={60} ay={80} speed={0.7} phase={4} opacity={0.35} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 90% at 50% 120%, rgba(0,0,0,0.6), transparent 60%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const NewsroomBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = useKenBurns(0.05);
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #0a1530 0%, #0c1b3e 45%, #071126 100%)",
        transform: `scale(${scale})`,
      }}
    >
      {/* sweeping light streaks */}
      {[0, 1, 2, 3].map((i) => {
        const x = ((frame * (0.9 + i * 0.25) + i * 480) % 2400) - 400;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: x,
              width: 3,
              height: "100%",
              background:
                "linear-gradient(180deg, transparent, rgba(120,170,255,0.35), transparent)",
              filter: "blur(2px)",
            }}
          />
        );
      })}
      <Blob color="#1e40af" size={1200} x={20} y={75} ax={40} ay={30} speed={0.4} phase={1} opacity={0.6} />
      <Blob color="#0ea5e9" size={900} x={85} y={25} ax={50} ay={40} speed={0.5} phase={3} opacity={0.4} />
    </AbsoluteFill>
  );
};

export const GridBG: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const offset = (frame * 1.4) % 80;
  return (
    <AbsoluteFill style={{ background: "#06060c", overflow: "hidden" }}>
      <Blob color={accent} size={1400} x={50} y={120} ax={30} ay={20} speed={0.3} phase={0} opacity={0.5} />
      {/* perspective floor grid */}
      <div
        style={{
          position: "absolute",
          inset: "40% -50% -60% -50%",
          backgroundImage: `linear-gradient(${accent}55 1px, transparent 1px), linear-gradient(90deg, ${accent}55 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${offset}px`,
          transform: "perspective(600px) rotateX(70deg)",
          transformOrigin: "top center",
          maskImage:
            "linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(80% 60% at 50% 30%, transparent, rgba(0,0,0,0.7))",
        }}
      />
    </AbsoluteFill>
  );
};

export const StudioBG: React.FC = () => {
  const scale = useKenBurns(0.06, 150);
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(110% 120% at 50% 18%, #2a2118 0%, #15110b 45%, #0a0805 100%)",
        transform: `scale(${scale})`,
      }}
    >
      <Blob color="#a9822f" size={1000} x={50} y={10} ax={20} ay={20} speed={0.3} phase={0} opacity={0.45} />
      <Blob color="#6b4f1d" size={1300} x={30} y={85} ax={30} ay={20} speed={0.25} phase={2} opacity={0.4} />
      {/* soft bokeh dots */}
      {[...Array(7)].map((_, i) => (
        <Blob
          key={i}
          color="#e8c372"
          size={120 + i * 30}
          x={12 + i * 12}
          y={20 + ((i * 37) % 60)}
          ax={25}
          ay={25}
          speed={0.4 + i * 0.05}
          phase={i}
          opacity={0.12}
        />
      ))}
    </AbsoluteFill>
  );
};

export const MeshBG: React.FC<{ a: string; b: string; c: string }> = ({
  a,
  b,
  c,
}) => {
  const scale = useKenBurns(0.07);
  return (
    <AbsoluteFill style={{ background: "#0a0712", transform: `scale(${scale})` }}>
      <Blob color={a} size={1200} x={22} y={28} ax={80} ay={60} speed={0.6} phase={0} opacity={0.75} />
      <Blob color={b} size={1100} x={78} y={36} ax={90} ay={70} speed={0.55} phase={2.5} opacity={0.7} />
      <Blob color={c} size={1000} x={55} y={80} ax={70} ay={60} speed={0.5} phase={5} opacity={0.6} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 100% at 50% 120%, rgba(0,0,0,0.55), transparent 55%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const PaperBG: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = useKenBurns(0.04, 160);
  const drift = Math.sin(frame / 60) * 18;
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(160deg, #fbfbf9 0%, #f1f0ec 60%, #e7e6e0 100%)",
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `calc(70% + ${drift}px)`,
          top: "30%",
          width: 900,
          height: 900,
          transform: "translate(-50%,-50%)",
          background:
            "radial-gradient(circle, rgba(0,0,0,0.05), transparent 60%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 90% at 50% 110%, rgba(0,0,0,0.06), transparent 55%)",
        }}
      />
    </AbsoluteFill>
  );
};
