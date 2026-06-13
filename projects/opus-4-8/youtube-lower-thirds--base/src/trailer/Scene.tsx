import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fonts } from "./theme";
import { useStage, pad2 } from "./util";

// One showcase beat: a moving background, a tasteful monitor HUD, and the
// lower third itself. The whole scene cross-fades at its edges.
export const Scene: React.FC<{
  index: number;
  total: number;
  label: string;
  accent: string;
  duration: number;
  hudDark?: boolean; // dark HUD text for light backgrounds
  background: React.ReactNode;
  children: React.ReactNode;
}> = ({ index, total, label, accent, duration, hudDark, background, children }) => {
  const frame = useCurrentFrame();
  const { present } = useStage(duration, { enterDur: 14, exitDur: 12 });

  const idx = pad2(index);
  const tot = pad2(total);
  const hud = hudDark ? "rgba(10,12,18,0.78)" : "rgba(255,255,255,0.82)";
  const hudW = interpolate(frame, [4, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const M = 70; // hud margin

  return (
    <AbsoluteFill style={{ opacity: present }}>
      {background}

      {/* corner ticks */}
      {(
        [
          { top: M, left: M, bt: true, bl: true },
          { top: M, right: M, bt: true, br: true },
          { bottom: M, left: M, bb: true, bl: true },
          { bottom: M, right: M, bb: true, br: true },
        ] as Array<{
          top?: number;
          bottom?: number;
          left?: number;
          right?: number;
          bt?: boolean;
          bb?: boolean;
          bl?: boolean;
          br?: boolean;
        }>
      ).map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 22,
            height: 22,
            top: c.top,
            left: c.left,
            right: c.right,
            bottom: c.bottom,
            borderTop: c.bt ? `2px solid ${hud}` : undefined,
            borderBottom: c.bb ? `2px solid ${hud}` : undefined,
            borderLeft: c.bl ? `2px solid ${hud}` : undefined,
            borderRight: c.br ? `2px solid ${hud}` : undefined,
            opacity: 0.5 * hudW,
          }}
        />
      ))}

      {/* top-left index */}
      <div style={{ position: "absolute", top: M - 4, left: M + 36, opacity: hudW }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 40, fontWeight: 700, color: hud, lineHeight: 1 }}>
            {idx}
          </span>
          <span style={{ fontFamily: fonts.mono, fontSize: 16, color: hud, opacity: 0.6 }}>/ {tot}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <span style={{ width: 22, height: 3, background: accent, boxShadow: `0 0 10px ${accent}` }} />
          <span style={{ fontFamily: fonts.sans, fontSize: 15, letterSpacing: 6, color: hud, textTransform: "uppercase", fontWeight: 600 }}>
            {label}
          </span>
        </div>
      </div>

      {/* top-right rec tag */}
      <div style={{ position: "absolute", top: M, right: M + 36, display: "flex", alignItems: "center", gap: 10, opacity: hudW }}>
        <span style={{ fontFamily: fonts.mono, fontSize: 15, letterSpacing: 4, color: hud, fontWeight: 600 }}>
          LOWER · THIRDS
        </span>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: accent, boxShadow: `0 0 8px ${accent}`, opacity: 0.6 + 0.4 * Math.sin(frame / 5) }} />
      </div>

      {children}

      {/* bottom progress sliver */}
      <div style={{ position: "absolute", left: M, right: M, bottom: M, height: 2, background: hudDark ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.15)", opacity: hudW }}>
        <div
          style={{
            height: "100%",
            width: `${interpolate(frame, [0, duration], [0, 100], { extrapolateRight: "clamp" })}%`,
            background: accent,
            boxShadow: `0 0 10px ${accent}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
