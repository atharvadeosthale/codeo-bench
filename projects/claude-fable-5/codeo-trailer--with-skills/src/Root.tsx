import "./index.css";
import { Composition } from "remotion";
import { Trailer } from "./Trailer/Trailer";
import { DURATION, FPS, HEIGHT, WIDTH } from "./Trailer/timeline";

// The benchmark harness renders the composition id pinned in meta.json
// ("HelloWorld"), so the trailer registers under that id.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HelloWorld"
      component={Trailer}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
