import React from "react";
import type { CSSProperties } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";

// ————— Panel: window-style card with traffic lights and title —————
export const Panel: React.FC<{
  title?: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  enter?: number; // 0..1
  accent?: string;
  children?: React.ReactNode;
  style?: CSSProperties;
}> = ({ title, x, y, w, h, enter = 1, accent = C.cyan, children, style }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: C.panel,
        border: `1px solid ${C.panelBorder}`,
        borderRadius: 18,
        boxShadow: `0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.02) inset`,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 36}px) scale(${0.96 + enter * 0.04})`,
        overflow: "hidden",
        ...style,
      }}
    >
      {title !== undefined && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 20px",
            backgroundColor: C.panelHeader,
            borderBottom: `1px solid ${C.stroke}`,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div
              key={c}
              style={{
                width: 11,
                height: 11,
                borderRadius: "50%",
                backgroundColor: c,
                opacity: 0.85,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 10,
              fontFamily: MONO,
              fontSize: 19,
              color: C.dim,
              letterSpacing: 0.5,
            }}
          >
            {title}
          </span>
          <div
            style={{
              marginLeft: "auto",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: accent,
              boxShadow: `0 0 10px ${accent}`,
            }}
          />
        </div>
      )}
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
};

// ————— SceneHeader: kicker + big title, springs in at scene start —————
export const SceneHeader: React.FC<{
  kicker: string;
  title: string;
  accent?: string;
}> = ({ kicker, title, accent = C.cyan }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 24 });
  const s2 = spring({
    frame,
    fps,
    delay: 8,
    config: { damping: 200 },
    durationInFrames: 26,
  });
  return (
    <div style={{ position: "absolute", left: 90, top: 64, fontFamily: FONT }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: s,
          transform: `translateX(${(1 - s) * -30}px)`,
        }}
      >
        <div
          style={{
            width: 34,
            height: 3,
            backgroundColor: accent,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 24,
            letterSpacing: 5,
            color: accent,
            fontWeight: 600,
          }}
        >
          {kicker}
        </span>
      </div>
      <div
        style={{
          marginTop: 10,
          fontSize: 58,
          fontWeight: 700,
          color: C.text,
          letterSpacing: -0.5,
          opacity: s2,
          transform: `translateY(${(1 - s2) * 24}px)`,
        }}
      >
        {title}
      </div>
    </div>
  );
};

// ————— Caption: bottom-centered explainer line —————
export const Caption: React.FC<{
  at: number;
  children: React.ReactNode;
  y?: number;
}> = ({ at, children, y = 990 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame,
    fps,
    delay: at,
    config: { damping: 200 },
    durationInFrames: 26,
  });
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        opacity: s,
        transform: `translateY(${(1 - s) * 26}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 30,
          color: C.text,
          backgroundColor: "rgba(10, 16, 30, 0.85)",
          border: `1px solid ${C.stroke}`,
          borderRadius: 999,
          padding: "14px 36px",
          maxWidth: 1500,
          textAlign: "center",
          boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ————— Chip: small pill label —————
export const Chip: React.FC<{
  color?: string;
  enter?: number;
  mono?: boolean;
  size?: number;
  children: React.ReactNode;
  style?: CSSProperties;
}> = ({ color = C.cyan, enter = 1, mono = true, size = 22, children, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontFamily: mono ? MONO : FONT,
      fontSize: size,
      color,
      backgroundColor: `${color}14`,
      border: `1px solid ${color}55`,
      borderRadius: 10,
      padding: "8px 16px",
      opacity: enter,
      transform: `scale(${0.85 + 0.15 * enter})`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

// ————— NodeCard: a tree/graph node —————
export const NodeCard: React.FC<{
  x: number; // center x
  y: number; // center y
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  color?: string;
  enter?: number;
  highlight?: number; // 0..1 glow ring
  highlightColor?: string;
  dimmed?: boolean;
}> = ({
  x,
  y,
  w = 190,
  h = 78,
  label,
  sub,
  color = C.cyan,
  enter = 1,
  highlight = 0,
  highlightColor,
  dimmed = false,
}) => {
  const hc = highlightColor ?? color;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        borderRadius: 14,
        backgroundColor: dimmed ? "rgba(11, 18, 33, 0.6)" : C.panel,
        border: `2px solid ${highlight > 0.05 ? hc : `${color}66`}`,
        boxShadow:
          highlight > 0.05
            ? `0 0 ${18 + highlight * 22}px ${hc}66, 0 10px 30px rgba(0,0,0,0.4)`
            : "0 10px 30px rgba(0,0,0,0.35)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        opacity: enter * (dimmed ? 0.45 : 1),
        transform: `scale(${0.7 + 0.3 * enter})`,
        zIndex: 2,
      }}
    >
      <span
        style={{
          fontFamily: MONO,
          fontSize: 26,
          fontWeight: 700,
          color: highlight > 0.05 ? hc : color,
        }}
      >
        {label}
      </span>
      {sub ? (
        <span style={{ fontFamily: MONO, fontSize: 16, color: C.dim }}>{sub}</span>
      ) : null}
    </div>
  );
};

// ————— Cursor click ripple —————
export const ClickRipple: React.FC<{ x: number; y: number; at: number }> = ({
  x,
  y,
  at,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (t <= 0 || t >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x - 50,
        top: y - 50,
        width: 100,
        height: 100,
        borderRadius: "50%",
        border: `3px solid ${C.cyan}`,
        opacity: 1 - t,
        transform: `scale(${0.2 + t * 1.1})`,
        zIndex: 10,
      }}
    />
  );
};
