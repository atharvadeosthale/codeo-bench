import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, palette } from "./theme";
import { useStage, staggerSpring, clamp01, formatThousands } from "./util";

type LTProps = { duration: number };

// All lower thirds anchor to this band so they read like real broadcast graphics.
const ANCHOR: React.CSSProperties = {
  position: "absolute",
  left: 130,
  bottom: 150,
};

const LiveDot: React.FC<{ color?: string; size?: number }> = ({
  color = palette.red,
  size = 10,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <span style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          transform: `scale(${1 + pulse})`,
          opacity: 0.35 * (1 - pulse),
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 ${8 + pulse * 6}px ${color}`,
        }}
      />
    </span>
  );
};

/* ──────────────────────────────  01 · GLASS  ────────────────────────────── */
export const GlassLowerThird: React.FC<LTProps> = ({ duration }) => {
  const { enter, present } = useStage(duration);
  const x = interpolate(enter, [0, 1], [-90, 0]);
  const blur = interpolate(enter, [0, 1], [22, 0]);
  const barH = interpolate(enter, [0, 1], [0, 96]);

  return (
    <div style={{ ...ANCHOR, opacity: present, transform: `translateX(${x}px)` }}>
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 22,
          padding: "26px 40px 26px 28px",
          borderRadius: 22,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: `blur(${18}px) saturate(160%)`,
          WebkitBackdropFilter: `blur(${18}px) saturate(160%)`,
          boxShadow:
            "0 30px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
          filter: `blur(${blur}px)`,
        }}
      >
        <div
          style={{
            width: 6,
            alignSelf: "center",
            height: barH,
            borderRadius: 6,
            background: `linear-gradient(${palette.cyan}, ${palette.violet})`,
            boxShadow: `0 0 18px ${palette.cyan}`,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <LiveDot color={palette.cyan} />
            <span
              style={{
                fontFamily: fonts.sans,
                fontSize: 15,
                letterSpacing: 4,
                fontWeight: 700,
                color: palette.cyan,
                textTransform: "uppercase",
              }}
            >
              On Air
            </span>
          </div>
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 46,
              fontWeight: 800,
              color: palette.white,
              letterSpacing: -0.5,
              lineHeight: 1,
            }}
          >
            Ava Marlowe
          </span>
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 21,
              fontWeight: 500,
              color: "rgba(255,255,255,0.72)",
              marginTop: 8,
            }}
          >
            Creative Director · Studio North
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────  02 · BREAKING  ──────────────────────────── */
export const BreakingNewsLowerThird: React.FC<LTProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { enter, present } = useStage(duration);
  const x = interpolate(enter, [0, 1], [-700, 0]);
  const tagW = interpolate(enter, [0.3, 1], [0, 168], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tickerText =
    "MARKETS RALLY AS TECH SECTOR SURGES  •  NEW STUDIO ALBUM BREAKS STREAMING RECORDS  •  WEATHER: CLEAR SKIES THROUGH THE WEEKEND  •  ";
  const tickerX = -((frame * 4) % 1600);

  return (
    <div style={{ position: "absolute", left: 0, bottom: 120, width: "100%", opacity: present }}>
      <div style={{ display: "flex", alignItems: "stretch", transform: `translateX(${x}px)`, marginLeft: 100, width: 980 }}>
        <div
          style={{
            background: palette.red,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 26px",
            overflow: "hidden",
          }}
        >
          <LiveDot color="#fff" size={12} />
          <span
            style={{
              fontFamily: fonts.sans,
              fontWeight: 800,
              fontSize: 24,
              color: "#fff",
              letterSpacing: 2,
              width: tagW,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            BREAKING
          </span>
        </div>
        <div
          style={{
            flex: 1,
            background: "linear-gradient(180deg,#fff,#f2f3f5)",
            padding: "18px 30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          }}
        >
          <span style={{ fontFamily: fonts.sans, fontSize: 16, fontWeight: 700, color: palette.red, letterSpacing: 3 }}>
            WORLD NEWS · LIVE
          </span>
          <span style={{ fontFamily: fonts.sans, fontSize: 34, fontWeight: 800, color: "#0b1020", lineHeight: 1.05, marginTop: 4 }}>
            Global Summit Reaches Historic Climate Accord
          </span>
        </div>
      </div>
      {/* ticker */}
      <div
        style={{
          marginTop: 10,
          marginLeft: 100,
          width: 980,
          height: 44,
          background: "#0b1020",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          transform: `translateX(${x}px)`,
          borderLeft: `6px solid ${palette.red}`,
        }}
      >
        <div style={{ whiteSpace: "nowrap", transform: `translateX(${tickerX}px)`, color: "#dfe5ee", fontFamily: fonts.sans, fontWeight: 600, fontSize: 18, letterSpacing: 1 }}>
          {tickerText.repeat(3)}
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────  03 · NEON CYBER  ─────────────────────────── */
export const NeonLowerThird: React.FC<LTProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { enter, present } = useStage(duration);
  // glitch jitter only during the first ~12 frames
  const glitch = frame < 12 ? (Math.sin(frame * 9) * (12 - frame)) / 2 : 0;
  const flick = 0.85 + 0.15 * Math.sin(frame / 3);
  const cyan = palette.cyan;
  const mag = palette.magenta;
  const reveal = clamp01(enter);

  const Corner: React.FC<{ s: React.CSSProperties }> = ({ s }) => (
    <span style={{ position: "absolute", width: 26, height: 26, borderColor: cyan, ...s }} />
  );

  return (
    <div style={{ ...ANCHOR, opacity: present, transform: `translateX(${glitch}px)` }}>
      <div
        style={{
          position: "relative",
          padding: "28px 46px",
          clipPath:
            "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px))",
          background: "rgba(8,10,20,0.55)",
          border: `1.5px solid ${cyan}`,
          boxShadow: `0 0 30px ${cyan}55, inset 0 0 24px ${cyan}22`,
          overflow: "hidden",
        }}
      >
        {/* scanlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px)",
            opacity: 0.6,
          }}
        />
        <Corner s={{ top: 8, left: 8, borderTop: "2px solid", borderLeft: "2px solid", borderColor: mag }} />
        <Corner s={{ bottom: 8, right: 8, borderBottom: "2px solid", borderRight: "2px solid", borderColor: mag }} />
        <div style={{ position: "relative" }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 14, color: mag, letterSpacing: 6, textShadow: `0 0 10px ${mag}` }}>
            // SYSTEM_ONLINE
          </span>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 50,
              fontWeight: 800,
              color: "#eafcff",
              letterSpacing: 1,
              marginTop: 6,
              opacity: flick,
              textShadow: `0 0 8px ${cyan}, 0 0 24px ${cyan}, 0 0 2px #fff`,
              clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
            }}
          >
            NEO_RUNNER
          </div>
          <span style={{ fontFamily: fonts.mono, fontSize: 18, color: cyan, letterSpacing: 3, textShadow: `0 0 8px ${cyan}` }}>
            ◈ NIGHT CITY BROADCAST · CH.404
          </span>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────  04 · MINIMAL EDITORIAL  ─────────────────────── */
export const MinimalLowerThird: React.FC<LTProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { enter, present } = useStage(duration, { enterDur: 26 });
  const lineW = interpolate(enter, [0, 1], [0, 360]);
  const words = ["Eleanor", "Voss"];

  return (
    <div style={{ ...ANCHOR, opacity: present }}>
      <div style={{ height: 2, width: lineW, background: "#16181d", marginBottom: 22 }} />
      <div style={{ display: "flex", gap: 16, overflow: "hidden" }}>
        {words.map((w, i) => {
          const s = staggerSpring(frame, fps, i, 6, 6);
          return (
            <span
              key={w}
              style={{
                fontFamily: fonts.serif,
                fontSize: 58,
                fontWeight: 400,
                color: "#14161b",
                letterSpacing: -1,
                lineHeight: 1,
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 16,
          fontFamily: fonts.sans,
          fontSize: 18,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: "#5c606a",
          opacity: interpolate(enter, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" }),
        }}
      >
        Photographer · Essayist
      </div>
    </div>
  );
};

/* ───────────────────────────  05 · GRADIENT PILL  ───────────────────────── */
export const GradientPillLowerThird: React.FC<LTProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { enter, present } = useStage(duration);
  const scale = interpolate(enter, [0, 1], [0.7, 1]);
  const sheen = ((frame * 6) % 520) - 160;

  return (
    <div style={{ ...ANCHOR, opacity: present, transform: `scale(${scale})`, transformOrigin: "left bottom" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "16px 40px 16px 16px",
          borderRadius: 999,
          background: `linear-gradient(110deg, ${palette.magenta}, ${palette.violet} 55%, ${palette.blue})`,
          boxShadow: `0 24px 60px ${palette.violet}66, inset 0 1px 0 rgba(255,255,255,0.4)`,
          overflow: "hidden",
        }}
      >
        {/* moving sheen */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: sheen,
            width: 90,
            background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.45), transparent)",
            transform: "skewX(-18deg)",
          }}
        />
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: "50%",
            background: "conic-gradient(from 220deg, #fff, #ffe0f0, #fff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.sans,
            fontWeight: 800,
            fontSize: 32,
            color: palette.violet,
            boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.6)",
          }}
        >
          LR
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: fonts.sans, fontSize: 40, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
            Luna Rey
          </div>
          <div style={{ fontFamily: fonts.sans, fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>
            @lunarey · Music Producer
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────  06 · TERMINAL  ──────────────────────────── */
export const TerminalLowerThird: React.FC<LTProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { enter, present } = useStage(duration);
  const y = interpolate(enter, [0, 1], [40, 0]);
  const green = palette.lime;

  const line1 = "const host = 'Kai Tanaka'";
  const line2 = "role: 'Software Engineer @ Hyperloop'";
  const typed1 = line1.slice(0, Math.max(0, Math.floor((frame - 8) * 1.6)));
  const typed2 = line2.slice(0, Math.max(0, Math.floor((frame - 42) * 1.6)));
  const cursor = Math.floor(frame / 8) % 2 === 0;

  return (
    <div style={{ ...ANCHOR, opacity: present, transform: `translateY(${y}px)` }}>
      <div
        style={{
          width: 660,
          borderRadius: 14,
          overflow: "hidden",
          background: "rgba(12,16,22,0.92)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
          fontFamily: fonts.mono,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ marginLeft: 10, color: "#7b8290", fontSize: 14 }}>~/guests/host.ts</span>
        </div>
        <div style={{ padding: "20px 22px", fontSize: 22, lineHeight: 1.7 }}>
          <div style={{ color: "#8b93a7" }}>
            <span style={{ color: green }}>$</span> whoami
          </div>
          <div style={{ color: "#e6edf3" }}>
            <span style={{ color: palette.magenta }}>const</span>{" "}
            <span style={{ color: palette.cyan }}>host</span> ={" "}
            <span style={{ color: green }}>{typed1.replace("const host = ", "")}</span>
            {typed1.length < line1.length && cursor && <span style={{ color: green }}>▋</span>}
          </div>
          <div style={{ color: "#8b93a7" }}>
            {typed2}
            {typed1.length >= line1.length && typed2.length < line2.length && cursor && (
              <span style={{ color: green }}>▋</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────  07 · LUXURY SERIF  ────────────────────────── */
export const LuxuryLowerThird: React.FC<LTProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { enter, present } = useStage(duration, { enterDur: 28 });
  const scale = interpolate(enter, [0, 1], [1.08, 1]);
  const lineW = interpolate(enter, [0.2, 1], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shimmer = (frame * 3) % 200;
  const gold = `linear-gradient(100deg, #8a6b2e, #f3e3a3 ${shimmer / 2}%, #e8c372, #b8902f)`;

  return (
    <div style={{ ...ANCHOR, opacity: present, transform: `scale(${scale})`, transformOrigin: "left bottom", textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
        <div style={{ width: lineW, height: 1, background: palette.gold }} />
        <span style={{ fontFamily: fonts.serif, fontSize: 16, letterSpacing: 8, color: palette.gold, textTransform: "uppercase" }}>
          Maison Étoile
        </span>
      </div>
      <div
        style={{
          fontFamily: fonts.serif,
          fontSize: 64,
          fontWeight: 400,
          letterSpacing: 1,
          lineHeight: 1,
          background: gold,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 2px 30px rgba(232,195,114,0.25)",
        }}
      >
        Vivienne Laurent
      </div>
      <div style={{ marginTop: 16, fontFamily: fonts.sans, fontSize: 17, letterSpacing: 10, textTransform: "uppercase", color: "rgba(232,195,114,0.8)" }}>
        Couturière · Paris
      </div>
    </div>
  );
};

/* ───────────────────────────  08 · SOCIAL MEDIA  ────────────────────────── */
export const SocialLowerThird: React.FC<LTProps> = ({ duration }) => {
  const frame = useCurrentFrame();
  const { enter, present } = useStage(duration);
  const x = interpolate(enter, [0, 1], [-80, 0]);
  const count = Math.floor(interpolate(enter, [0, 1], [0, 2_480_000]));
  const subPulse = 1 + 0.05 * Math.max(0, Math.sin(frame / 7));

  return (
    <div style={{ ...ANCHOR, opacity: present, transform: `translateX(${x}px)` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "18px 22px",
          borderRadius: 18,
          background: "rgba(15,15,18,0.78)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* YouTube glyph */}
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: 18,
            background: "#FF0033",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(255,0,51,0.45)",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#fff">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: fonts.sans, fontSize: 34, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
              PixelForge
            </span>
            {/* verified check */}
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill={palette.cyan} d="M12 1l2.6 1.9 3.2-.3 1 3.1 2.7 1.8-1 3.1 1 3.1-2.7 1.8-1 3.1-3.2-.3L12 23l-2.6-1.9-3.2.3-1-3.1L2.5 16.7l1-3.1-1-3.1L5.2 8.7l1-3.1 3.2.3z" />
              <path fill="#0b1020" d="M10.6 14.6l-2.3-2.3 1.1-1.1 1.2 1.2 3-3 1.1 1.1z" />
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 10 }}>
            <div
              style={{
                background: "#FF0033",
                color: "#fff",
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: 1,
                padding: "9px 20px",
                borderRadius: 999,
                transform: `scale(${subPulse})`,
                boxShadow: "0 0 0 0 rgba(255,0,51,0.4)",
              }}
            >
              SUBSCRIBE
            </div>
            <span style={{ fontFamily: fonts.sans, fontSize: 19, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
              {formatThousands(count)} subscribers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
