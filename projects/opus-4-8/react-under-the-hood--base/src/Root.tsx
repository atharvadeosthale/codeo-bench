import "./index.css";
import { Composition } from "remotion";
import { ReactUnderTheHood, TOTAL_FRAMES } from "./ReactUnderTheHood";

// meta.json pins the composition id to "HelloWorld" — keep it.
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
