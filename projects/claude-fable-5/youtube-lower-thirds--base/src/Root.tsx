import "./index.css";
import { Composition } from "remotion";
import { Main } from "./Main";
import { FPS, TOTAL_DURATION } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HelloWorld"
      component={Main}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
