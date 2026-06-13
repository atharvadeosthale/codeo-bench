// Palette lifted verbatim from the site's design system (src/styles.css).
// Keeping the trailer on-brand: dark screening-room, lime accent, film red.
export const C = {
  bg: "#0a0b07",
  bgRaised: "#11130c",
  bgDeep: "#050603",
  ink: "#eef0e2",
  inkDim: "#91957e",
  inkFaint: "#565a47",
  line: "rgba(238, 240, 226, 0.09)",
  lineStrong: "rgba(238, 240, 226, 0.19)",
  accent: "#d4ff3f",
  accentSoft: "rgba(212, 255, 63, 0.12)",
  rec: "#ff4438",
  ok: "#57d984",
} as const;

// The site's body background gradient — used as the trailer's base canvas.
export const PAGE_BG =
  "radial-gradient(1100px 540px at 50% -10%, rgba(212, 255, 63, 0.06), transparent 62%)," +
  "radial-gradient(900px 600px at 92% 112%, rgba(255, 68, 56, 0.035), transparent 60%)," +
  "linear-gradient(180deg, #0c0d09 0%, #0a0b07 32%, #050603 100%)";
