import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, display, mono, seg, prog, EASE } from "../theme";

const LINES: Array<[string, string]> = [
  ["ONE", "PROMPT."],
  ["ONE", "TEMPLATE."],
  ["EVERY", "MODEL."],
];

const BuildLine: React.FC<{
  lead: string;
  key2: string;
  start: number;
  frame: number;
}> = ({ lead, key2, start, frame }) => {
  const reveal = prog(frame, start, start + 22, EASE.expo);
  const x = seg(frame, start, start + 26, -34, 0, EASE.out);
  const underline = prog(frame, start + 14, start + 40, EASE.out);

  return (
    <div
      style={{
        position: "relative",
        transform: `translateX(${x}px)`,
        opacity: seg(frame, start, start + 8, 0, 1),
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: 138,
          lineHeight: 1.04,
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
          color: C.ink,
          clipPath: `inset(0 ${(1 - reveal) * 100}% -0.2em 0)`,
          fontVariationSettings: '"opsz" 96',
        }}
      >
        {lead} <span style={{ color: C.accent }}>{key2}</span>
      </div>
      <div
        style={{
          height: 4,
          width: 116,
          marginTop: 14,
          background: C.accent,
          transformOrigin: "left center",
          transform: `scaleX(${underline})`,
          opacity: 0.85,
        }}
      />
    </div>
  );
};

// The thesis, built line by line: one prompt, one template, every model.
export const Brief: React.FC<{ length: number }> = ({ length }) => {
  const frame = useCurrentFrame();
  const starts = [10, 48, 86];

  const subIn = seg(frame, 120, 140, 0, 1);
  const blockExit = seg(frame, length - 22, length - 4, 0, 1);

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {/* faint kicker */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 240,
          fontFamily: mono,
          fontSize: 18,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: C.accent,
          opacity: seg(frame, 0, 14, 0, 1),
        }}
      >
        The Protocol
      </div>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          paddingLeft: 240,
          transform: `translateY(${blockExit * -40}px)`,
          opacity: 1 - blockExit,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {LINES.map(([lead, key2], i) => (
            <BuildLine
              key={key2}
              lead={lead}
              key2={key2}
              start={starts[i]}
              frame={frame}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 56,
            maxWidth: 720,
            fontFamily: mono,
            fontSize: 22,
            lineHeight: 1.7,
            letterSpacing: "0.02em",
            color: C.inkDim,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 12}px)`,
          }}
        >
          Same prompt. Same pinned Remotion template.
          <br />
          Every video written by an AI model — rendered untouched.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
