import { Composition } from "remotion";
import { CustomizeView } from "./CustomizeView";
import { HoverIssue } from "./HoverIssue";
import { ClickToFlag } from "./ClickToFlag";
import { TabsTour } from "./TabsTour";
import { Test } from "./Test";

// Aspect ratio: 490x219 = 2.237:1 — render at 4x for resize-without-loss
// 1960 / 876 = 2.237
const W = 1960;
const H = 876;
const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="CustomizeView"
        component={CustomizeView}
        durationInFrames={FPS * 8}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="HoverIssue"
        component={HoverIssue}
        durationInFrames={150}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="ClickToFlag"
        component={ClickToFlag}
        durationInFrames={FPS * 6}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="TabsTour"
        component={TabsTour}
        durationInFrames={FPS * 6}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="Test"
        component={Test}
        durationInFrames={30}
        fps={FPS}
        width={W}
        height={H}
      />
    </>
  );
};
