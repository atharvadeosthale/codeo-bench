import { interpolate } from "remotion";
import { COLORS, FONT } from "../theme";
import { hexA } from "./Background";

// A small browser window rendering a "Post" card with a Like button.
// `count` drives the like number; `flash` (0..1) highlights the changed node.
export const AppUI: React.FC<{
  count: number;
  width?: number;
  build?: number; // 0..1 mount progress
  flash?: number; // 0..1 highlight on the like button
  liked?: boolean;
}> = ({ count, width = 540, build = 1, flash = 0, liked = false }) => {
  const rows = [
    interpolate(build, [0, 0.3], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
    interpolate(build, [0.25, 0.6], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
    interpolate(build, [0.55, 1], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
  ];

  return (
    <div
      style={{
        width,
        borderRadius: 16,
        overflow: "hidden",
        background: "#0f1626",
        border: `1px solid ${hexA(COLORS.react, 0.25)}`,
        boxShadow: `0 30px 70px rgba(0,0,0,0.5), 0 0 40px ${hexA(COLORS.react, 0.15)}`,
        fontFamily: FONT.sans,
      }}
    >
      {/* chrome */}
      <div
        style={{
          height: 40,
          background: "#0a0f1c",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          borderBottom: `1px solid ${hexA(COLORS.react, 0.12)}`,
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 12,
            fontFamily: FONT.mono,
            fontSize: 14,
            color: COLORS.textFaint,
          }}
        >
          localhost:3000
        </div>
      </div>

      {/* body */}
      <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
        {/* author row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: rows[0] }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: `linear-gradient(135deg, ${COLORS.react}, ${COLORS.jsx})`,
            }}
          />
          <div>
            <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 22 }}>Ada Lovelace</div>
            <div style={{ color: COLORS.textFaint, fontSize: 16 }}>@ada · 2h</div>
          </div>
        </div>

        {/* text lines */}
        <div style={{ opacity: rows[1], display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ color: COLORS.text, fontSize: 22, lineHeight: 1.4 }}>
            React keeps the UI in sync with your data. ✨
          </div>
          <div style={{ height: 12, width: "75%", borderRadius: 6, background: hexA(COLORS.textDim, 0.18) }} />
        </div>

        {/* like button */}
        <div style={{ opacity: rows[2], marginTop: 4 }}>
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 22px",
              borderRadius: 999,
              border: `2px solid ${liked ? COLORS.change : hexA(COLORS.textDim, 0.4)}`,
              background: liked ? hexA(COLORS.change, 0.16) : "transparent",
              color: liked ? COLORS.change : COLORS.textDim,
              fontFamily: FONT.sans,
              fontSize: 22,
              fontWeight: 700,
              boxShadow: `0 0 ${flash * 40}px ${hexA(COLORS.change, flash * 0.9)}`,
              transform: `scale(${1 + flash * 0.06})`,
            }}
          >
            <span style={{ fontSize: 24 }}>{liked ? "♥" : "♡"}</span>
            Likes: {count}
          </button>
        </div>
      </div>
    </div>
  );
};
