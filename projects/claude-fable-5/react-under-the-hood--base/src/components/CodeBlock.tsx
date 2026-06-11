import React from "react";
import { useCurrentFrame } from "remotion";
import { C, MONO } from "../theme";

export type Token = { t: string; c?: string };
export type Line = Token[];

// Shorthand token constructors
export const kw = (t: string): Token => ({ t, c: C.purple }); // keyword
export const fn = (t: string): Token => ({ t, c: C.blue }); // function
export const cmp = (t: string): Token => ({ t, c: C.yellow }); // Component
export const tag = (t: string): Token => ({ t, c: C.pink }); // <tag>
export const att = (t: string): Token => ({ t, c: C.cyan }); // attribute
export const str = (t: string): Token => ({ t, c: C.green }); // "string"
export const num = (t: string): Token => ({ t, c: C.orange }); // number
export const pl = (t: string): Token => ({ t, c: C.text }); // plain
export const pun = (t: string): Token => ({ t, c: C.dim }); // punctuation
export const com = (t: string): Token => ({ t, c: C.faint }); // comment

const lineChars = (line: Line): number =>
  line.reduce((acc, tok) => acc + tok.t.length, 0);

export const totalChars = (lines: Line[]): number =>
  lines.reduce((acc, l) => acc + lineChars(l) + 1, 0);

// Renders tokenized code. `visibleChars` controls the typewriter reveal
// (pass Infinity / a big number for fully revealed).
export const CodeBlock: React.FC<{
  lines: Line[];
  visibleChars?: number;
  fontSize?: number;
  lineHeight?: number;
  showCursor?: boolean;
  highlightLines?: number[];
  highlightColor?: string;
}> = ({
  lines,
  visibleChars = 1e9,
  fontSize = 24,
  lineHeight = 1.55,
  showCursor = false,
  highlightLines = [],
  highlightColor = C.cyan,
}) => {
  const frame = useCurrentFrame();
  const cursorOn = Math.floor(frame / 14) % 2 === 0;
  let consumed = 0;
  const total = totalChars(lines);
  const typing = visibleChars < total;

  return (
    <div style={{ fontFamily: MONO, fontSize, lineHeight }}>
      {lines.map((line, li) => {
        const before = consumed;
        consumed += lineChars(line) + 1; // +1 for the newline
        const lineVisible = Math.max(0, visibleChars - before);
        const isLast =
          typing && visibleChars > before && visibleChars < consumed;
        const highlighted = highlightLines.includes(li);
        let used = 0;
        return (
          <div
            key={li}
            style={{
              display: "flex",
              backgroundColor: highlighted ? `${highlightColor}14` : undefined,
              borderLeft: highlighted
                ? `3px solid ${highlightColor}`
                : "3px solid transparent",
              paddingLeft: 8,
              marginLeft: -11,
              borderRadius: 4,
              minHeight: fontSize * lineHeight,
            }}
          >
            <span
              style={{
                color: C.faint,
                width: fontSize * 1.7,
                textAlign: "right",
                marginRight: fontSize * 0.9,
                userSelect: "none",
                flexShrink: 0,
              }}
            >
              {lineVisible > 0 ? li + 1 : ""}
            </span>
            <span style={{ whiteSpace: "pre" }}>
              {line.map((tok, ti) => {
                const avail = Math.max(0, Math.min(tok.t.length, lineVisible - used));
                used += tok.t.length;
                if (avail <= 0) return null;
                return (
                  <span key={ti} style={{ color: tok.c ?? C.text }}>
                    {tok.t.slice(0, avail)}
                  </span>
                );
              })}
              {isLast && showCursor && cursorOn ? (
                <span
                  style={{
                    display: "inline-block",
                    width: fontSize * 0.55,
                    height: fontSize * 1.1,
                    backgroundColor: C.cyan,
                    verticalAlign: "text-bottom",
                    boxShadow: `0 0 10px ${C.cyan}`,
                  }}
                />
              ) : null}
            </span>
          </div>
        );
      })}
    </div>
  );
};
