import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { z } from "zod";
import { C } from "./trailer/theme";
import { FilmOverlay, GateWeave } from "./trailer/FilmOverlay";
import { Hud } from "./trailer/Hud";
import { Leader } from "./trailer/scenes/Leader";
import { Brief } from "./trailer/scenes/Brief";
import { Thesis } from "./trailer/scenes/Thesis";
import { Reel } from "./trailer/scenes/Reel";
import { Manifesto } from "./trailer/scenes/Manifesto";
import { Lockup } from "./trailer/scenes/Lockup";

export const myCompSchema = z.object({});

// Scene cuts (30fps). Lengths chosen for a trailer's accelerate-then-resolve
// rhythm: a film leader, the thesis, the reel centerpiece, the verdict, lockup.
const LEADER = 80;
const BRIEF = 170;
const THESIS = 90;
const REEL = 250;
const MANIFESTO = 160;
const LOCKUP = 160;

const cuts = {
  leader: 0,
  brief: LEADER,
  thesis: LEADER + BRIEF,
  reel: LEADER + BRIEF + THESIS,
  manifesto: LEADER + BRIEF + THESIS + REEL,
  lockup: LEADER + BRIEF + THESIS + REEL + MANIFESTO,
};

export const TOTAL = cuts.lockup + LOCKUP; // 910

const hudLabel = (frame: number) => {
  if (frame < cuts.brief) return "LEADER · 3·2·1";
  if (frame < cuts.thesis) return "THE PROTOCOL";
  if (frame < cuts.reel) return "THE BRIEF";
  if (frame < cuts.manifesto) return "THE REEL";
  if (frame < cuts.lockup) return "THE VERDICT";
  return "SCREENING";
};

export const HelloWorld: React.FC<z.infer<typeof myCompSchema>> = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: C.bgDeep }}>
      <GateWeave amount={0.8}>
        <Sequence from={cuts.leader} durationInFrames={LEADER}>
          <Leader length={LEADER} />
        </Sequence>
        <Sequence from={cuts.brief} durationInFrames={BRIEF}>
          <Brief length={BRIEF} />
        </Sequence>
        <Sequence from={cuts.thesis} durationInFrames={THESIS}>
          <Thesis length={THESIS} />
        </Sequence>
        <Sequence from={cuts.reel} durationInFrames={REEL}>
          <Reel length={REEL} />
        </Sequence>
        <Sequence from={cuts.manifesto} durationInFrames={MANIFESTO}>
          <Manifesto length={MANIFESTO} />
        </Sequence>
        <Sequence from={cuts.lockup} durationInFrames={LOCKUP}>
          <Lockup length={LOCKUP} />
        </Sequence>
      </GateWeave>

      <Hud label={hudLabel(frame)} />
      <FilmOverlay />
    </AbsoluteFill>
  );
};
