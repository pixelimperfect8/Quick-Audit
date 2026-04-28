import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface Waypoint {
  /** Frame at which the cursor should ARRIVE here */
  frame: number;
  x: number;
  y: number;
}

interface CursorProps {
  waypoints: Waypoint[];
  /** Show a click ripple at this frame (or array of frames) */
  clicks?: number[];
}

/**
 * Spring-driven animated cursor that moves between waypoints.
 * Position is a pure function of useCurrentFrame() — no CSS transitions.
 */
export const Cursor: React.FC<CursorProps> = ({ waypoints, clicks = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Find the segment we're currently in
  let from = waypoints[0];
  let to = waypoints[0];
  for (let i = 0; i < waypoints.length - 1; i++) {
    if (frame >= waypoints[i].frame && frame < waypoints[i + 1].frame) {
      from = waypoints[i];
      to = waypoints[i + 1];
      break;
    }
    if (frame >= waypoints[i + 1].frame) {
      from = waypoints[i + 1];
      to = waypoints[i + 1];
    }
  }

  // Spring progress between from and to
  const segmentLen = Math.max(1, to.frame - from.frame);
  const segmentFrame = frame - from.frame;
  const progress =
    from === to
      ? 1
      : spring({
          frame: segmentFrame,
          fps,
          config: { damping: 18, stiffness: 90, mass: 0.8 },
          durationInFrames: segmentLen,
        });

  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress;

  // Cursor press feedback: shrink ~12% for the 4 frames around any click
  const pressScale = (() => {
    for (const clickFrame of clicks) {
      const d = frame - clickFrame;
      if (d >= -1 && d <= 4) {
        // Down 0..2 frames, hold, up 3..4 frames
        if (d <= 1) return 1 - 0.12 * Math.max(0, d + 1) / 2;
        return 0.88 + 0.12 * Math.min(1, (d - 1) / 3);
      }
    }
    return 1;
  })();

  return (
    <>
      {/* Click ripples */}
      {clicks.map((clickFrame) => {
        const elapsed = frame - clickFrame;
        if (elapsed < 0 || elapsed > 22) return null;
        const t = elapsed / 22;
        const radius = interpolate(t, [0, 1], [10, 48]);
        const opacity = interpolate(t, [0, 1], [0.6, 0]);
        return (
          <div
            key={clickFrame}
            style={{
              position: "absolute",
              left: x - radius,
              top: y - radius,
              width: radius * 2,
              height: radius * 2,
              borderRadius: "50%",
              background: "rgba(0, 89, 218, 0.28)",
              border: "3px solid #0059DA",
              opacity,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Cursor SVG (macOS-style arrow) — scales down on click for press feedback */}
      <svg
        width="36"
        height="48"
        viewBox="0 0 24 32"
        style={{
          position: "absolute",
          left: x,
          top: y,
          pointerEvents: "none",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
          transform: `scale(${pressScale})`,
          transformOrigin: "2px 2px", // tip of the arrow
        }}
      >
        <path
          d="M2 1 L2 24 L7.5 19 L11 27.5 L14.5 26 L11 17.5 L18.5 17.5 Z"
          fill="#ffffff"
          stroke="#0A2642"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};
