import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT } from "../theme";
import { Caption, Panel, SceneHeading } from "../components/ui";
import { AppUI } from "../components/AppUI";
import { springIn } from "../components/anim";
import { hexA } from "../components/Background";

const domNodes = [
  { label: "div.post", indent: 0, patched: false },
  { label: "img.avatar", indent: 1, patched: false },
  { label: "h2.title", indent: 1, patched: false },
  { label: "button.btn", indent: 1, patched: false },
  { label: '#text "Likes: 43"', indent: 2, patched: true },
];

const PATCH = 110;

export const Commit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const patched = frame >= PATCH;
  const flash = patched
    ? interpolate(frame, [PATCH, PATCH + 12, PATCH + 45], [0, 1, 0], { extrapolateRight: "clamp" })
    : 0;
  const count = patched ? 43 : 42;

  return (
    <AbsoluteFill style={{ padding: "70px 80px" }}>
      <SceneHeading
        kicker="Step 07"
        title="Commit — one surgical DOM mutation"
        accent={COLORS.commit}
      />

      {/* effect list */}
      <Panel
        accent={COLORS.commit}
        glow={0.5}
        style={{
          position: "absolute",
          top: 300,
          left: 80,
          width: 540,
          padding: "24px 22px",
          opacity: springIn(frame, fps, 10, 16),
        }}
      >
        <div style={{ fontFamily: FONT.mono, fontSize: 16, letterSpacing: 2, color: COLORS.commit, fontWeight: 700, marginBottom: 18 }}>
          EFFECT LIST — what actually changes
        </div>
        <div
          style={{
            opacity: springIn(frame, fps, 40),
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 18px",
            borderRadius: 12,
            border: `2px solid ${COLORS.change}`,
            background: hexA(COLORS.change, 0.14),
            boxShadow: `0 0 ${flash * 30}px ${hexA(COLORS.change, flash * 0.6)}`,
          }}
        >
          <span style={{ fontFamily: FONT.mono, color: COLORS.change, fontWeight: 800, fontSize: 18 }}>UPDATE</span>
          <span style={{ fontFamily: FONT.mono, color: COLORS.text, fontSize: 20 }}>
            text → <span style={{ color: COLORS.add }}>"Likes: 43"</span>
          </span>
        </div>
        <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: 18, color: COLORS.textFaint, lineHeight: 1.7 }}>
          <div>· no nodes created</div>
          <div>· no nodes removed</div>
          <div>· 1 text mutation</div>
        </div>
      </Panel>

      {/* real DOM tree */}
      <div style={{ position: "absolute", top: 300, left: 700, width: 460 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 16, letterSpacing: 2, color: COLORS.textDim, fontWeight: 700, marginBottom: 18, opacity: springIn(frame, fps, 30) }}>
          REAL DOM
        </div>
        {domNodes.map((n, i) => {
          const appear = springIn(frame, fps, 34 + i * 6, 14);
          const isHot = n.patched && patched;
          const col = isHot ? COLORS.add : COLORS.textDim;
          return (
            <div
              key={n.label}
              style={{
                opacity: appear,
                marginLeft: n.indent * 28,
                marginBottom: 12,
                padding: "10px 16px",
                borderRadius: 10,
                fontFamily: FONT.mono,
                fontSize: 20,
                color: col,
                border: `1.5px solid ${isHot ? COLORS.add : hexA(COLORS.textDim, 0.25)}`,
                background: isHot ? hexA(COLORS.add, 0.16) : hexA(COLORS.textDim, 0.04),
                boxShadow: isHot ? `0 0 ${20 + flash * 30}px ${hexA(COLORS.add, 0.4 + flash * 0.5)}` : "none",
                transform: `scale(${isHot ? 1 + flash * 0.04 : 1})`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{n.label}</span>
              {isHot && <span style={{ color: COLORS.add, fontSize: 16 }}>◀ patched</span>}
            </div>
          );
        })}
      </div>

      {/* app */}
      <div style={{ position: "absolute", top: 320, right: 110, opacity: springIn(frame, fps, 60) }}>
        <AppUI count={count} flash={flash} liked={patched} width={500} />
      </div>

      <div style={{ position: "absolute", bottom: 56, left: 80, right: 80 }}>
        <Caption accent={COLORS.commit} delay={PATCH + 14}>
          The commit phase runs in one synchronous pass and touches{" "}
          <b style={{ color: COLORS.add }}>only the nodes that differ</b>. That's why
          React feels fast — the expensive DOM is barely touched.
        </Caption>
      </div>
    </AbsoluteFill>
  );
};
