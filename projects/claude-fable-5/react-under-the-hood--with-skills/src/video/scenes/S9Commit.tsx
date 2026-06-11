import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors as C, fonts } from "../theme";
import { SceneShell, Caption, ez, EASE_INOUT, POP } from "../ui";

const BTN_CX = 540;
const BTN_CY = 610;

export const S9Commit: React.FC = () => {
  const frame = useCurrentFrame();
  const browserP = ez(frame, 22, 28);

  // Patch instruction flies from the right into the button.
  const flyP = ez(frame, 70, 42, EASE_INOUT);
  const chipX = interpolate(flyP, [0, 1], [1280, BTN_CX]);
  const chipY = interpolate(flyP, [0, 1], [330, BTN_CY - 118]);
  const chipO = ez(frame, 64, 12) - ez(frame, 150, 20);

  const flash = ez(frame, 112, 8) - ez(frame, 124, 26);
  const flipOut = ez(frame, 110, 12);
  const flipIn = ez(frame, 116, 16, POP);

  const steps = [
    { label: "mutate DOM", color: C.green },
    { label: "useLayoutEffect", color: C.violet },
    { label: "browser paint", color: C.accent },
    { label: "useEffect (async)", color: C.yellow },
  ];

  return (
    <SceneShell index="08" kicker="COMMIT" title="The DOM gets the minimal patch" seed={9}>
      {/* browser mock */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 300,
          width: 800,
          height: 510,
          opacity: browserP,
          transform: `translateY(${(1 - browserP) * 30}px)`,
          background: "rgba(13, 19, 34, 0.92)",
          border: `1px solid ${C.panelBorder}`,
          borderRadius: 20,
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 22px",
            borderBottom: "1px solid rgba(97,218,251,0.08)",
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
          <div
            style={{
              marginLeft: 14,
              flex: 1,
              fontFamily: fonts.mono,
              fontSize: 19,
              color: C.muted,
              background: "rgba(139,151,172,0.1)",
              borderRadius: 8,
              padding: "6px 16px",
            }}
          >
            localhost:3000
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            inset: "62px 0 0 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `rgba(97,218,251,${Math.max(0, flash) * 0.07})`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 42,
              fontWeight: 700,
              color: "#06121f",
              background: C.accent,
              borderRadius: 16,
              padding: "22px 48px",
              boxShadow: `0 0 ${24 + Math.max(0, flash) * 50}px ${C.accent}${
                flash > 0.05 ? "aa" : "44"
              }`,
              display: "flex",
              gap: 0,
            }}
          >
            Count:&nbsp;
            <span style={{ position: "relative", display: "inline-block", width: 30 }}>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  opacity: 1 - flipOut,
                  transform: `translateY(${flipOut * -34}px)`,
                }}
              >
                0
              </span>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  opacity: flipIn,
                  transform: `translateY(${(1 - flipIn) * 34}px) scale(${0.7 + flipIn * 0.3})`,
                }}
              >
                1
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* flying patch instruction */}
      <div
        style={{
          position: "absolute",
          left: chipX,
          top: chipY,
          transform: "translate(-50%, -50%)",
          opacity: Math.max(0, chipO),
          fontFamily: fonts.mono,
          fontSize: 23,
          fontWeight: 700,
          color: C.orange,
          background: "rgba(7,11,22,0.95)",
          border: `1.5px solid ${C.orange}`,
          borderRadius: 12,
          padding: "10px 20px",
          boxShadow: `0 0 26px ${C.orange}44`,
          whiteSpace: "nowrap",
        }}
      >
        textNode.data = “1”
      </div>

      {/* what happens after, in order */}
      <div
        style={{
          position: "absolute",
          left: 1130,
          top: 318,
          opacity: ez(frame, 140, 22),
          fontFamily: fonts.mono,
          fontSize: 21,
          letterSpacing: 5,
          color: C.muted,
        }}
      >
        THE COMMIT SEQUENCE
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <line
          x1={1160}
          y1={400}
          x2={1160}
          y2={400 + 3 * 105 * ez(frame, 165, 110, EASE_INOUT)}
          stroke={C.line}
          strokeWidth={2}
        />
      </svg>
      {steps.map((s, i) => {
        const at = 155 + i * 30;
        const p = ez(frame, at, 22, POP);
        const o = ez(frame, at, 14);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 1130,
              top: 400 + i * 105 - 28,
              display: "flex",
              alignItems: "center",
              gap: 22,
              opacity: o,
              transform: `translateX(${(1 - p) * 30}px)`,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: "rgba(7,11,22,0.95)",
                border: `2px solid ${s.color}`,
                boxShadow: `0 0 18px ${s.color}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.mono,
                fontSize: 24,
                fontWeight: 700,
                color: s.color,
              }}
            >
              {i + 1}
            </div>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 28,
                fontWeight: 700,
                color: s.color,
              }}
            >
              {s.label}
            </div>
          </div>
        );
      })}

      <Caption at={278}>
        One text node changed — so one text node is touched. Nothing else moves.
      </Caption>
    </SceneShell>
  );
};
