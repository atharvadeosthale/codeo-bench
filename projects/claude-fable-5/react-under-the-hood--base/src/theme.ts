export const C = {
  bg: "#05080F",
  bgDeep: "#03050A",
  panel: "rgba(11, 18, 33, 0.92)",
  panelHeader: "rgba(18, 28, 50, 0.9)",
  panelBorder: "rgba(97, 218, 251, 0.16)",
  stroke: "#1D2B45",
  cyan: "#61DAFB",
  blue: "#60A5FA",
  purple: "#C4B5FD",
  pink: "#F472B6",
  yellow: "#FBBF24",
  green: "#4ADE80",
  red: "#F87171",
  orange: "#FB923C",
  text: "#EAF1FB",
  dim: "#8295B5",
  faint: "#42547A",
} as const;

export const FONT = `"Avenir Next", "Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif`;
export const MONO = `"SF Mono", Menlo, "Cascadia Code", Consolas, "Courier New", monospace`;

export const glow = (color: string, size = 24): string =>
  `0 0 ${size}px ${color}55, 0 0 ${size * 2.5}px ${color}22`;
