import { AbsoluteFill } from "remotion";
import { AppDashboard } from "./lib/AppDashboard";

export const Test: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#ffffff" }}>
      <AppDashboard />
    </AbsoluteFill>
  );
};
