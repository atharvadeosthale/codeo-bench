import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, display, mono, seg, prog, EASE } from "../theme";

type Entry = { model: string; task: string; skills: boolean };

const ENTRIES: Entry[] = [
  { model: "GPT-5.2", task: "codeo-trailer", skills: true },
  { model: "Opus 4.8", task: "react-under-the-hood", skills: true },
  { model: "Gemini 3 Pro", task: "youtube-lower-thirds", skills: false },
  { model: "Sonnet 4.6", task: "codeo-trailer", skills: false },
  { model: "Grok 4", task: "react-under-the-hood", skills: true },
  { model: "Llama 4.1", task: "youtube-lower-thirds", skills: false },
  { model: "GPT-5.2", task: "youtube-lower-thirds", skills: false },
  { model: "Opus 4.8", task: "codeo-trailer", skills: true },
  { model: "Gemini 3 Pro", task: "codeo-trailer", skills: true },
  { model: "Sonnet 4.6", task: "react-under-the-hood", skills: false },
  { model: "Grok 4", task: "youtube-lower-thirds", skills: false },
  { model: "Llama 4.1", task: "codeo-trailer", skills: true },
];

const COUNT = ENTRIES.length;
const ANGLE = 360 / COUNT;
const PANEL_W = 376;
const PANEL_H = 212;
const RADIUS = 720;

// A desaturated abstract "frame" standing in for a rendered entry —
// monochrome with a single lime tell, matching the site's reel panels.
const Thumb: React.FC<{ i: number }> = ({ i }) => {
  const motif = i % 4;
  const tone = 0.1 + (i % 3) * 0.04;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #171a10, #0b0c08)`,
        filter: "grayscale(0.4) brightness(0.82) contrast(1.05)",
      }}
    >
      <AbsoluteFill style={{ opacity: 0.9 }}>
        {motif === 0 && (
          <div style={{ padding: 30, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, height: "100%" }}>
            {[0.9, 0.62, 0.74, 0.4].map((w, k) => (
              <div key={k} style={{ height: 12, width: `${w * 100}%`, borderRadius: 3, background: k === 1 ? C.accent : `rgba(238,240,226,${0.14 + tone})` }} />
            ))}
          </div>
        )}
        {motif === 1 && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            {[0.85, 0.62, 0.4, 0.2].map((s, k) => (
              <div key={k} style={{ position: "absolute", width: `${s * 100}%`, height: `${s * 165}%`, borderRadius: "50%", border: `2px solid ${k === 2 ? C.accent : `rgba(238,240,226,${0.12 + tone})`}` }} />
            ))}
          </AbsoluteFill>
        )}
        {motif === 2 && (
          <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center", gap: 10, paddingBottom: 34 }}>
            {[0.3, 0.55, 0.8, 1, 0.7, 0.45, 0.6, 0.35].map((h, k) => (
              <div key={k} style={{ width: 18, height: `${h * 60}%`, borderRadius: 3, background: k === 3 ? C.accent : `rgba(238,240,226,${0.13 + tone})` }} />
            ))}
          </AbsoluteFill>
        )}
        {motif === 3 && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "46%", height: "70%", borderRadius: 14, border: `2px solid rgba(238,240,226,${0.16 + tone})` }} />
            <div style={{ position: "absolute", width: 0, height: 0, borderTop: "22px solid transparent", borderBottom: "22px solid transparent", borderLeft: `34px solid ${C.accent}`, marginLeft: 8 }} />
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      {/* lime sheen + bottom falloff so panels read as one material */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(212,255,63,0.09), transparent 36%), linear-gradient(0deg, rgba(5,6,3,0.6), transparent 46%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Panel: React.FC<{ i: number; ring: number }> = ({ i, ring }) => {
  const world = ((i * ANGLE + ring) * Math.PI) / 180;
  const front = Math.cos(world); // 1 = facing camera
  const dim = interpolate(front, [-1, 1], [0.16, 1]);
  const e = ENTRIES[i];

  return (
    <div
      style={{
        position: "absolute",
        width: PANEL_W,
        height: PANEL_H,
        left: "50%",
        top: "50%",
        marginLeft: -PANEL_W / 2,
        marginTop: -PANEL_H / 2,
        transform: `rotateY(${i * ANGLE}deg) translateZ(${RADIUS}px)`,
        borderRadius: 10,
        overflow: "hidden",
        border: `1px solid rgba(238,240,226,0.14)`,
        boxShadow: "0 0 0 1px rgba(0,0,0,0.55), inset 0 0 26px rgba(0,0,0,0.5)",
        opacity: dim,
        backfaceVisibility: "hidden",
      }}
    >
      <Thumb i={i} />
      {/* panel label strip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 12px",
          fontFamily: mono,
          fontSize: 12,
          letterSpacing: "0.1em",
          color: C.ink,
          textTransform: "uppercase",
        }}
      >
        <span>{e.model}</span>
        <span style={{ color: e.skills ? C.accent : C.inkDim }}>
          {e.skills ? "with-skills" : "base"}
        </span>
      </div>
    </div>
  );
};

// The reel: a slowly turning zoetrope of entries — a direct homage to the
// 3D ring on the site's homepage, here as the trailer's centerpiece.
export const Reel: React.FC<{ length: number }> = ({ length }) => {
  const frame = useCurrentFrame();

  // continuous rotation; gentle push-in across the scene
  const ring = -frame * 0.82 - 8;
  const scale = interpolate(
    prog(frame, 0, length, EASE.inOut),
    [0, 1],
    [0.62, 0.94],
  );
  const tilt = interpolate(prog(frame, 0, 60, EASE.out), [0, 1], [4, -13]);
  const intro = prog(frame, 0, 24, EASE.out);
  const out = seg(frame, length - 18, length - 2, 1, 0);

  // which entry is currently facing the camera → lower-third readout
  const frontIndex = ((Math.round(-ring / ANGLE) % COUNT) + COUNT) % COUNT;
  const lead = ENTRIES[frontIndex];

  return (
    <AbsoluteFill style={{ background: C.bgDeep, opacity: out }}>
      {/* heading */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: intro,
        }}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 18,
            letterSpacing: "0.4em",
            textIndent: "0.4em",
            color: C.accent,
          }}
        >
          THE&nbsp;REEL
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: display,
            fontWeight: 800,
            fontSize: 64,
            letterSpacing: "-0.03em",
            color: C.ink,
            textTransform: "uppercase",
          }}
        >
          Every entry, rendered untouched
        </div>
      </div>

      {/* 3D ring */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          perspective: 1600,
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `translateY(-66px) scale(${scale}) rotateX(${tilt}deg)`,
          }}
        >
          <div
            style={{
              position: "relative",
              width: PANEL_W,
              height: PANEL_H,
              transformStyle: "preserve-3d",
              transform: `rotateY(${ring}deg)`,
            }}
          >
            {ENTRIES.map((_, i) => (
              <Panel key={i} i={i} ring={ring} />
            ))}
          </div>
        </div>
        {/* floor glow */}
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            width: 760,
            height: 90,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(212,255,63,0.08), transparent 70%)",
            filter: "blur(12px)",
          }}
        />
      </AbsoluteFill>

      {/* lower third: now showing */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: seg(frame, 40, 60, 0, 1) * out,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "14px 26px",
            background: "rgba(10,11,7,0.72)",
            border: `1px solid ${C.lineStrong}`,
            borderLeft: `3px solid ${C.accent}`,
            borderRadius: 8,
            backdropFilter: "blur(6px)",
          }}
        >
          <span style={{ fontFamily: mono, fontSize: 14, letterSpacing: "0.2em", color: C.inkDim }}>
            NOW&nbsp;SHOWING
          </span>
          <span style={{ fontFamily: display, fontWeight: 700, fontSize: 26, color: C.ink, letterSpacing: "-0.01em" }}>
            {lead.model}
          </span>
          <span style={{ width: 1, height: 22, background: C.lineStrong }} />
          <span style={{ fontFamily: mono, fontSize: 16, color: C.accent, letterSpacing: "0.08em" }}>
            {lead.task}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
