import { loadFont as loadSora } from "@remotion/google-fonts/Sora";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

export const sora = loadSora("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;

export const mono = loadJetBrainsMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
}).fontFamily;

export const serif = loadPlayfair("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
}).fontFamily;

export const oswald = loadOswald("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
}).fontFamily;
