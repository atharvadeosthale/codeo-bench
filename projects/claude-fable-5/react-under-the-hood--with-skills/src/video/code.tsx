import React from "react";
import { useCurrentFrame } from "remotion";
import { colors as C, fonts } from "./theme";
import { ez } from "./ui";

// Token constructors for syntax-highlighted code lines.
export type Tok = { t: string; c: string };
export type CodeLine = Tok[];

export const K = (t: string): Tok => ({ t, c: C.purple }); // keyword
export const F = (t: string): Tok => ({ t, c: C.blue }); // function
export const S = (t: string): Tok => ({ t, c: "#C3E88D" }); // string
export const N = (t: string): Tok => ({ t, c: "#F78C6C" }); // number
export const TAG = (t: string): Tok => ({ t, c: C.accent }); // jsx tag
export const A = (t: string): Tok => ({ t, c: C.yellow }); // attribute / prop
export const P = (t: string): Tok => ({ t, c: C.muted }); // punctuation
export const X = (t: string): Tok => ({ t, c: C.text }); // plain
export const CM = (t: string): Tok => ({ t, c: C.faint }); // comment

export const CodeBlock: React.FC<{
  lines: CodeLine[];
  at: number; // panel entrance frame
  typeAt?: number; // when typing/stagger starts (default: at + 8)
  mode?: "type" | "stagger";
  cps?: number; // chars per frame in "type" mode
  x: number;
  y: number;
  width: number;
  fontSize?: number;
  title?: string;
  // line index -> frame at which the line gets a glow flash
  flash?: { line: number; at: number; color?: string }[];
}> = ({
  lines,
  at,
  typeAt,
  mode = "type",
  cps = 2.2,
  x,
  y,
  width,
  fontSize = 27,
  title,
  flash = [],
}) => {
  const frame = useCurrentFrame();
  const enter = ez(frame, at, 24);
  const t0 = typeAt ?? at + 8;

  const lineLens = lines.map((l) => l.reduce((acc, tok) => acc + tok.t.length, 0));
  const cumBefore: number[] = [];
  lineLens.reduce((acc, len, i) => {
    cumBefore[i] = acc;
    return acc + len;
  }, 0);
  const totalRevealed = Math.max(0, (frame - t0) * cps);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 30}px)`,
        background: C.panel,
        border: `1px solid ${C.panelBorder}`,
        borderRadius: 18,
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 20px",
          borderBottom: `1px solid rgba(97,218,251,0.08)`,
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
        ))}
        {title ? (
          <div
            style={{
              marginLeft: 12,
              fontFamily: fonts.mono,
              fontSize: 19,
              color: C.muted,
            }}
          >
            {title}
          </div>
        ) : null}
      </div>
      <div style={{ padding: "20px 26px 24px" }}>
        {lines.map((line, li) => {
          const flashEntry = flash.find((f) => f.line === li);
          let flashOpacity = 0;
          if (flashEntry) {
            const fp = ez(frame, flashEntry.at, 12);
            const fout = ez(frame, flashEntry.at + 40, 25);
            flashOpacity = fp - fout * 0.7;
          }

          let revealed: number;
          let lineOpacity = 1;
          let lineShift = 0;
          if (mode === "type") {
            revealed = Math.max(0, Math.min(totalRevealed - cumBefore[li], lineLens[li]));
          } else {
            revealed = lineLens[li];
            const lp = ez(frame, t0 + li * 5, 16);
            lineOpacity = lp;
            lineShift = (1 - lp) * 18;
          }
          const isTyping =
            mode === "type" && revealed > 0 && revealed < lineLens[li];
          const caretOn = isTyping || (mode === "type" && totalRevealed <= 0 && li === 0);

          let used = 0;
          return (
            <div
              key={li}
              style={{
                display: "flex",
                opacity: lineOpacity,
                transform: `translateX(${lineShift}px)`,
                background:
                  flashOpacity > 0.02
                    ? `${flashEntry?.color ?? C.accent}${Math.round(
                        Math.max(0, Math.min(flashOpacity, 1)) * 40,
                      )
                        .toString(16)
                        .padStart(2, "0")}`
                    : "transparent",
                borderRadius: 6,
                padding: "1px 8px",
                margin: "0 -8px",
              }}
            >
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontSize: fontSize * 0.62,
                  color: C.faint,
                  width: 38,
                  flexShrink: 0,
                  textAlign: "right",
                  marginRight: 22,
                  lineHeight: `${fontSize * 1.62}px`,
                  userSelect: "none",
                }}
              >
                {li + 1}
              </span>
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontSize,
                  lineHeight: 1.62,
                  whiteSpace: "pre",
                }}
              >
                {line.map((tok, ti) => {
                  const take = Math.max(0, Math.min(tok.t.length, revealed - used));
                  used += tok.t.length;
                  if (take <= 0) {
                    return null;
                  }
                  return (
                    <span key={ti} style={{ color: tok.c }}>
                      {tok.t.slice(0, take)}
                    </span>
                  );
                })}
                {caretOn ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: fontSize * 0.55,
                      height: fontSize * 1.1,
                      verticalAlign: "text-bottom",
                      background: C.accent,
                      opacity: Math.floor(frame / 14) % 2 === 0 ? 0.9 : 0.15,
                    }}
                  />
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
