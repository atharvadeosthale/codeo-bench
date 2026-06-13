import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
const sora = loadSora("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});
const grotesk = loadGrotesk("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});
const mono = loadMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export const fonts = {
  display: anton.fontFamily,
  head: sora.fontFamily,
  ui: grotesk.fontFamily,
  mono: mono.fontFamily,
};

export const palette = {
  void: "#050609",
  ink: "#0A0C12",
  panel: "rgba(16, 18, 26, 0.72)",
  white: "#F4F7FB",
  mute: "#8B94A8",
  line: "rgba(255,255,255,0.10)",
};

/** Per-component signature palettes. */
export const accents = {
  aurora: { a: "#7DF9FF", b: "#A98BFF", glow: "#7DF9FF" },
  pulse: { a: "#FF2E97", b: "#00F5A0", glow: "#FF2E97" },
  editorial: { a: "#E8C37A", b: "#FFFFFF", glow: "#E8C37A" },
  subscribe: { a: "#FF0033", b: "#FF5252", glow: "#FF0033" },
  connect: { a: "#38BDF8", b: "#22D3EE", glow: "#38BDF8" },
  breaking: { a: "#EF4444", b: "#F97316", glow: "#EF4444" },
  spectrum: { a: "#B14BFF", b: "#FF8A3D", glow: "#B14BFF" },
} as const;
