import "./index.css";
import React from "react";
import { Composition, Folder } from "remotion";
import { Trailer } from "./Trailer";
import { Single } from "./scenes/Single";
import { LOWER_THIRDS } from "./lowerthirds";
import { FPS, TOTAL } from "./timeline";

const W = 1920;
const H = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main trailer — rendered by the benchmark harness. */}
      <Composition
        id="HelloWorld"
        component={Trailer}
        durationInFrames={TOTAL}
        fps={FPS}
        width={W}
        height={H}
      />

      {/* Each lower third on its own, for inspection. */}
      <Folder name="Components">
        {LOWER_THIRDS.map((entry) => (
          <Composition
            key={entry.id}
            id={`LT-${entry.title}`}
            component={Single}
            durationInFrames={150}
            fps={FPS}
            width={W}
            height={H}
            defaultProps={{ id: entry.id }}
          />
        ))}
      </Folder>
    </>
  );
};
