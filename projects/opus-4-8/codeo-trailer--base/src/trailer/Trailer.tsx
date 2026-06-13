import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { FilmOverlay } from "./FilmOverlay";
import { Leader } from "./scenes/Leader";
import { TitleCard } from "./scenes/TitleCard";
import { Manifesto } from "./scenes/Manifesto";
import { Reel } from "./scenes/Reel";
import { EndCard } from "./scenes/EndCard";
import { PAGE_BG } from "./theme";
import { weave } from "./util";

// Scene cut list (30 fps). 600 frames total ≈ 20s.
const LEADER = 96;
const TITLE = 120;
const MANIFESTO = 185;
const REEL = 114;
const END = 85;

export const Trailer: React.FC = () => {
  const frame = useCurrentFrame();

  // a subtle, ever-present projector gate-weave ties the cuts together
  const wx = weave(frame, 1) * 1.4;
  const wy = weave(frame, 5) * 1.0;

  let t = 0;
  const at = (len: number) => {
    const from = t;
    t += len;
    return from;
  };

  return (
    <AbsoluteFill style={{ background: PAGE_BG }}>
      <AbsoluteFill style={{ transform: `translate(${wx}px, ${wy}px)` }}>
        <Sequence from={at(LEADER)} durationInFrames={LEADER}>
          <Leader />
        </Sequence>
        <Sequence from={at(TITLE)} durationInFrames={TITLE}>
          <TitleCard />
        </Sequence>
        <Sequence from={at(MANIFESTO)} durationInFrames={MANIFESTO}>
          <Manifesto />
        </Sequence>
        <Sequence from={at(REEL)} durationInFrames={REEL}>
          <Reel />
        </Sequence>
        <Sequence from={at(END)} durationInFrames={END}>
          <EndCard />
        </Sequence>
      </AbsoluteFill>

      <FilmOverlay />
    </AbsoluteFill>
  );
};
