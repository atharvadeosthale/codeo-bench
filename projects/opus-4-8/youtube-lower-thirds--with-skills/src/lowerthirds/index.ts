import type React from "react";
import { Aurora } from "./Aurora";
import { Pulse } from "./Pulse";
import { Editorial } from "./Editorial";
import { Subscribe } from "./Subscribe";
import { Connect } from "./Connect";
import { Breaking } from "./Breaking";
import { Spectrum } from "./Spectrum";
import { accents } from "../theme";
import type { BackdropVariant } from "../components/Backdrops";

export type LowerThird = {
  id: string;
  title: string;
  kind: string;
  accent: { a: string; b: string; glow: string };
  backdrop: BackdropVariant;
  context: string;
  Component: React.FC<{ enterAt?: number }>;
};

export const LOWER_THIRDS: LowerThird[] = [
  {
    id: "aurora",
    title: "AURORA",
    kind: "Glass Name Card",
    accent: accents.aurora,
    backdrop: "tech",
    context: "TECH REVIEW",
    Component: Aurora,
  },
  {
    id: "pulse",
    title: "PULSE",
    kind: "Live Gaming Bar",
    accent: accents.pulse,
    backdrop: "gaming",
    context: "LIVE STREAM",
    Component: Pulse,
  },
  {
    id: "editorial",
    title: "EDITORIAL",
    kind: "Documentary Plate",
    accent: accents.editorial,
    backdrop: "editorial",
    context: "DOCUMENTARY",
    Component: Editorial,
  },
  {
    id: "subscribe",
    title: "SUBSCRIBE",
    kind: "Channel CTA",
    accent: accents.subscribe,
    backdrop: "studio",
    context: "END SCREEN",
    Component: Subscribe,
  },
  {
    id: "connect",
    title: "CONNECT",
    kind: "Social Rail",
    accent: accents.connect,
    backdrop: "social",
    context: "OUTRO",
    Component: Connect,
  },
  {
    id: "breaking",
    title: "BREAKING",
    kind: "News Lower Band",
    accent: accents.breaking,
    backdrop: "news",
    context: "BROADCAST",
    Component: Breaking,
  },
  {
    id: "spectrum",
    title: "SPECTRUM",
    kind: "Now Playing",
    accent: accents.spectrum,
    backdrop: "music",
    context: "MUSIC VIDEO",
    Component: Spectrum,
  },
];
