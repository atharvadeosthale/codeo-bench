import "./index.css";
import { Composition } from "remotion";
import { Trailer } from "./trailer/Trailer";

// The render target id is "HelloWorld" (see meta.json) — the Codeo Bench trailer.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HelloWorld"
      component={Trailer}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
