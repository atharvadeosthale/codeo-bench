import { loadFont as loadDisplay } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const display = loadDisplay("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

const mono = loadMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const fonts = {
  display: display.fontFamily,
  mono: mono.fontFamily,
};

export const colors = {
  bg0: "#05070D",
  bg1: "#0A0F1E",
  panel: "rgba(13, 19, 34, 0.85)",
  panelBorder: "rgba(97, 218, 251, 0.16)",
  line: "rgba(139, 151, 172, 0.55)",
  grid: "rgba(97, 218, 251, 0.05)",
  accent: "#61DAFB",
  purple: "#C792EA",
  violet: "#A78BFA",
  green: "#4ADE80",
  orange: "#FFB454",
  red: "#FF6B6B",
  yellow: "#FFCB6B",
  blue: "#82AAFF",
  text: "#E8EFF9",
  muted: "#8B97AC",
  faint: "#5B6B82",
};
