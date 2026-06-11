import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const grotesk = loadSpaceGrotesk("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const playfairItalic = loadPlayfair("italic", {
  weights: ["500", "600"],
  subsets: ["latin"],
});
const mono = loadMono("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export const INTER = inter.fontFamily;
export const GROTESK = grotesk.fontFamily;
export const PLAYFAIR_ITALIC = playfairItalic.fontFamily;
export const MONO = mono.fontFamily;
