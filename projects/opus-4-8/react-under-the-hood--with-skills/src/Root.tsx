import "./index.css";
import { Composition } from "remotion";
import { ReactUnderTheHood, TOTAL_FRAMES } from "./ruth";

// The benchmark renders the "HelloWorld" composition id (see meta.json).
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HelloWorld"
      component={ReactUnderTheHood}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
