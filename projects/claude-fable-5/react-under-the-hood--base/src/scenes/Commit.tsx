import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../theme";
import { ramp } from "../helpers";
import { Panel, SceneHeader, Caption, Chip } from "../components/ui";

const PHASES = [
  { name: "before mutation", from: 40, to: 100, color: C.purple, note: "snapshot the DOM", w: 4.5 },
  { name: "mutation", from: 100, to: 230, color: C.orange, note: "apply every change", w: 6.5 },
  { name: "layout effects", from: 230, to: 262, color: C.cyan, note: "useLayoutEffect", w: 4.5 },
];

const EFFECTS = [
  { label: 'Update   <h1> → "Hello!"', color: C.yellow, at: 108, ty: 432 },
  { label: 'Placement <li key="d">', color: C.green, at: 148, ty: 655 },
  { label: 'Update   <button> → "4"', color: C.yellow, at: 188, ty: 738 },
];

const PAINT_AT = 240;
const HOOKS_AT = 272;

export const Commit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barEnter = spring({ frame, fps, delay: 14, config: { damping: 200 }, durationInFrames: 22 });
  const listEnter = spring({ frame, fps, delay: 30, config: { damping: 200 }, durationInFrames: 24 });
  const winEnter = spring({ frame, fps, delay: 44, config: { damping: 200 }, durationInFrames: 24 });

  const flyP = (at: number) =>
    spring({ frame, fps, delay: at, config: { damping: 15, mass: 0.8 }, durationInFrames: 26 });

  const arrived = (at: number) => frame >= at + 22;
  const flash = (at: number) =>
    interpolate(frame, [at + 22, at + 30, at + 52], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  const paintP = ramp(frame, PAINT_AT, 26);
  const hooksS = spring({ frame, fps, delay: HOOKS_AT, config: { damping: 200 }, durationInFrames: 24 });

  const h1Done = arrived(EFFECTS[0].at);
  const liDone = arrived(EFFECTS[1].at);
  const btnDone = arrived(EFFECTS[2].at);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <SceneHeader kicker="06 · COMMIT" title="Flush to the DOM — all at once" accent={C.orange} />

      {/* phase bar */}
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 222,
          width: 1680,
          display: "flex",
          gap: 10,
          opacity: barEnter,
          transform: `translateY(${(1 - barEnter) * 18}px)`,
        }}
      >
        {PHASES.map((ph) => {
          const active = frame >= ph.from && frame < ph.to;
          const done = frame >= ph.to;
          const fill = interpolate(frame, [ph.from, ph.to], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div key={ph.name} style={{ flex: ph.w }}>
              <div
                style={{
                  height: 46,
                  borderRadius: 10,
                  border: `1.5px solid ${active || done ? ph.color : C.stroke}`,
                  backgroundColor: "rgba(5,9,18,0.6)",
                  overflow: "hidden",
                  boxShadow: active ? `0 0 22px ${ph.color}44` : undefined,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: `${fill * 100}%`,
                    background: `linear-gradient(90deg, ${ph.color}33, ${ph.color}66)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    fontFamily: MONO,
                    fontSize: 20,
                    color: active || done ? ph.color : C.faint,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {ph.name}
                  <span style={{ fontWeight: 400, fontSize: 17, color: C.dim }}>{ph.note}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* effect list */}
      <Panel title="effect list — collected during render" x={110} y={330} w={660} h={420} enter={listEnter} accent={C.yellow}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, paddingTop: 6 }}>
          {EFFECTS.map((e) => {
            const done = arrived(e.at);
            return (
              <div
                key={e.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontFamily: MONO,
                  fontSize: 23,
                  color: done ? C.faint : e.color,
                  border: `1.5px solid ${done ? C.stroke : `${e.color}55`}`,
                  backgroundColor: done ? "transparent" : `${e.color}0d`,
                  borderRadius: 11,
                  padding: "16px 20px",
                  textDecoration: done ? "line-through" : "none",
                }}
              >
                <span style={{ whiteSpace: "pre" }}>{e.label}</span>
                <span style={{ color: done ? C.green : C.faint, fontSize: 20 }}>
                  {done ? "applied ✓" : "pending"}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: FONT,
            fontSize: 21,
            color: C.dim,
            lineHeight: 1.5,
            opacity: ramp(frame, 92, 18),
          }}
        >
          Commit is <span style={{ color: C.orange }}>synchronous</span> — no yielding here,
          so the user never sees a half-applied UI.
        </div>
      </Panel>

      {/* flying effect dots */}
      {EFFECTS.map((e, i) => {
        const p = flyP(e.at);
        if (frame < e.at || p >= 0.98) return null;
        const x = interpolate(p, [0, 1], [740, 1060]);
        const y = interpolate(p, [0, 1], [420 + i * 70, e.ty]);
        return (
          <div
            key={`fly${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 16,
              height: 16,
              borderRadius: "50%",
              backgroundColor: e.color,
              boxShadow: `0 0 18px ${e.color}`,
              zIndex: 20,
            }}
          />
        );
      })}

      {/* browser window */}
      <div
        style={{
          position: "absolute",
          left: 980,
          top: 330,
          width: 830,
          height: 510,
          borderRadius: 18,
          border: `1px solid ${C.panelBorder}`,
          backgroundColor: "#0E1524",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          opacity: winEnter,
          transform: `translateY(${(1 - winEnter) * 30}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 18px",
            backgroundColor: C.panelHeader,
            borderBottom: `1px solid ${C.stroke}`,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: c }} />
          ))}
          <div
            style={{
              marginLeft: 12,
              fontFamily: MONO,
              fontSize: 18,
              color: C.dim,
              backgroundColor: "rgba(5,9,18,0.7)",
              borderRadius: 8,
              padding: "5px 16px",
              flex: 1,
            }}
          >
            localhost:3000 — the real DOM
          </div>
        </div>
        <div style={{ padding: "30px 40px", position: "relative", height: "100%" }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 46,
              fontWeight: 700,
              color: C.text,
              backgroundColor: `rgba(251, 191, 36, ${flash(EFFECTS[0].at) * 0.25})`,
              borderRadius: 8,
              display: "inline-block",
              padding: "2px 10px",
              marginLeft: -10,
            }}
          >
            {h1Done ? "Hello!" : "Hello"}
          </div>
          <ul
            style={{
              fontFamily: FONT,
              fontSize: 29,
              color: C.dim,
              lineHeight: 1.85,
              marginTop: 18,
              paddingLeft: 34,
            }}
          >
            <li>Bread</li>
            <li>Apples</li>
            <li>Coffee</li>
            {liDone ? (
              <li
                style={{
                  color: C.green,
                  backgroundColor: `rgba(74, 222, 128, ${flash(EFFECTS[1].at) * 0.2})`,
                  borderRadius: 6,
                  transform: `scale(${0.8 + 0.2 * Math.min(1, (frame - EFFECTS[1].at - 22) / 10)})`,
                  transformOrigin: "left center",
                }}
              >
                Dates
              </li>
            ) : null}
          </ul>
          <div
            style={{
              marginTop: 16,
              display: "inline-block",
              fontFamily: MONO,
              fontSize: 25,
              color: "#0B1220",
              backgroundColor: btnDone ? C.green : C.cyan,
              borderRadius: 10,
              padding: "10px 26px",
              fontWeight: 700,
              boxShadow: flash(EFFECTS[2].at) > 0.1 ? `0 0 24px ${C.green}` : undefined,
            }}
          >
            count: {btnDone ? 4 : 3}
          </div>
          {/* paint sweep */}
          {paintP > 0 && paintP < 1 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(105deg, transparent ${paintP * 130 - 30}%, rgba(255,255,255,0.14) ${paintP * 130 - 12}%, transparent ${paintP * 130}%)`,
              }}
            />
          ) : null}
        </div>
      </div>

      {/* paint + effect hooks */}
      <div
        style={{
          position: "absolute",
          left: 980,
          top: 866,
          width: 830,
          display: "flex",
          gap: 16,
          justifyContent: "center",
          opacity: hooksS,
          transform: `translateY(${(1 - hooksS) * 20}px)`,
        }}
      >
        <Chip color={C.purple} size={20}>
          useLayoutEffect — before paint
        </Chip>
        <Chip color={C.cyan} size={20}>
          useEffect — after paint
        </Chip>
      </div>
      <div
        style={{
          position: "absolute",
          left: 980,
          top: 866,
          width: 830,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 21,
          color: C.text,
          opacity: interpolate(frame, [PAINT_AT + 10, PAINT_AT + 24, HOOKS_AT - 4, HOOKS_AT + 4], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        browser paints ✦
      </div>

      <Caption at={296}>
        Render is interruptible. Commit never is. That contract keeps the screen consistent.
      </Caption>
    </AbsoluteFill>
  );
};
