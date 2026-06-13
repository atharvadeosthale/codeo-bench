import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema, TOTAL } from "./HelloWorld";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HelloWorld"
      component={HelloWorld}
      durationInFrames={TOTAL}
      fps={30}
      width={1920}
      height={1080}
      schema={myCompSchema}
      defaultProps={{}}
    />
  );
};
