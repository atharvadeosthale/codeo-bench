import "./index.css";
import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { DURATION_IN_FRAMES, FPS, HEIGHT, WIDTH } from "./ReactUnderTheHood";

export const RemotionRoot = () => {
  return (
    <Composition
      id="HelloWorld"
      component={HelloWorld}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
