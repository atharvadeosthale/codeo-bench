import "./index.css";
import { Composition } from "remotion";
import { Trailer, trailerSchema, TRAILER_DURATION } from "./Trailer";

// The benchmark renders the "HelloWorld" composition (see meta.json), so the
// Lower Thirds trailer is registered under that id.
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HelloWorld"
      component={Trailer}
      durationInFrames={TRAILER_DURATION}
      fps={30}
      width={1920}
      height={1080}
      schema={trailerSchema}
      defaultProps={{}}
    />
  );
};
