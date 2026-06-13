// Same two typefaces the website uses: Bricolage Grotesque (display) + IBM Plex
// Mono (labels). Loaded through @remotion/google-fonts so they're guaranteed
// present on every rendered frame (it wires up delayRender internally).
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";

const bricolage = loadBricolage("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

const plexMono = loadPlexMono("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const SANS = bricolage.fontFamily;
export const MONO = plexMono.fontFamily;
