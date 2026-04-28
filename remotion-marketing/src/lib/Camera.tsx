import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface Keyframe {
  /** Frame at which this keyframe is reached */
  frame: number;
  /** Scale factor — 1 = natural size, 1.5 = 150% zoom-in */
  scale: number;
  /** Focal point in unscaled mockup coordinates (x, y in pixels) */
  focal: { x: number; y: number };
  /** Easing curve for the segment STARTING at this keyframe (default: easeInOutCubic) */
  ease?: "linear" | "easeOut" | "easeInOut";
}

interface CameraProps {
  /** Composition viewport width */
  width: number;
  /** Composition viewport height */
  height: number;
  /** Width of the un-scaled mockup */
  mockupWidth: number;
  /** Height of the un-scaled mockup */
  mockupHeight: number;
  keyframes: Keyframe[];
  children: React.ReactNode;
}

const easings: Record<string, (t: number) => number> = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

/**
 * Cinematic camera — zooms and pans across a larger mockup as a function of frame.
 * Translate is computed to keep the focal point at the viewport center.
 */
export const Camera: React.FC<CameraProps> = ({
  width,
  height,
  mockupWidth,
  mockupHeight,
  keyframes,
  children,
}) => {
  const frame = useCurrentFrame();

  // Find the segment we're in
  let from = keyframes[0];
  let to = keyframes[0];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (frame >= keyframes[i].frame && frame < keyframes[i + 1].frame) {
      from = keyframes[i];
      to = keyframes[i + 1];
      break;
    }
    if (frame >= keyframes[i + 1].frame) {
      from = keyframes[i + 1];
      to = keyframes[i + 1];
    }
  }

  const segLen = Math.max(1, to.frame - from.frame);
  const rawT = (frame - from.frame) / segLen;
  const ease = easings[from.ease ?? "easeInOut"];
  const t = from === to ? 1 : Math.min(1, Math.max(0, ease(rawT)));

  const scale = from.scale + (to.scale - from.scale) * t;
  const fx = from.focal.x + (to.focal.x - from.focal.x) * t;
  const fy = from.focal.y + (to.focal.y - from.focal.y) * t;

  // Translate so the focal point lands at the viewport center
  const tx = width / 2 - fx * scale;
  const ty = height / 2 - fy * scale;

  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        overflow: "hidden",
        background: "#F4F8FC",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: mockupWidth,
          height: mockupHeight,
          left: 0,
          top: 0,
          transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          transformOrigin: "0 0",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};
