import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera } from "./lib/Camera";
import { Cursor } from "./lib/Cursor";
import { AppDashboard } from "./lib/AppDashboard";
import { WarningIcon } from "@/components/icons";
import { FLAG_ISSUES } from "@/components/sidebar-improvements/flagsData";

/* ------------------------------------------------------------------------ */
/*  HoverIssue (150f @ 30fps = 5s, 1960×876)                                 */
/*  Real Dashboard + manual flag-details popover positioned over Issue row. */
/* ------------------------------------------------------------------------ */

const W = 1960;
const H = 876;
const APP_CENTER = { x: W / 2, y: H / 2 };

const SIDEBAR_X = W - 372;
const SIDEBAR_Y = 96;

// Issues collapsible — sits below summary content. First issue row at ~y 576.
const issueRowY = (idx: number) => SIDEBAR_Y + 576 + idx * 32;
const issueRowX = SIDEBAR_X + 200;

export const HoverIssue: React.FC = () => {
  const frame = useCurrentFrame();
  const hoveredIssueIdx = 0;
  const hoveredIssue = FLAG_ISSUES[hoveredIssueIdx];

  const popoverInStart = 53;
  const popoverInEnd = 65;
  const popoverOutStart = 110;
  const popoverOutEnd = 122;

  const popoverIn = interpolate(frame, [popoverInStart, popoverInEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const popoverOut = interpolate(frame, [popoverOutStart, popoverOutEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const popoverProgress = Math.max(0, popoverIn - popoverOut);

  const baseScale = 1.0;
  const closeScale = 1.75;
  const closeFocal = { x: SIDEBAR_X + 186, y: issueRowY(hoveredIssueIdx) + 40 };

  const cameraKeyframes = [
    { frame: 0,   scale: baseScale,  focal: APP_CENTER },
    { frame: 22,  scale: baseScale,  focal: APP_CENTER },
    { frame: 55,  scale: closeScale, focal: closeFocal },
    { frame: 120, scale: closeScale, focal: closeFocal },
    { frame: 148, scale: baseScale,  focal: APP_CENTER, ease: "easeOut" as const },
    { frame: 150, scale: baseScale,  focal: APP_CENTER },
  ];

  const cursorWaypoints = [
    { frame: 0,   x: SIDEBAR_X - 200,                  y: H / 2 + 200 },
    { frame: 48,  x: issueRowX,                         y: issueRowY(hoveredIssueIdx) },
    { frame: 110, x: issueRowX,                         y: issueRowY(hoveredIssueIdx) },
    { frame: 130, x: SIDEBAR_X + 320,                   y: H - 60 },
    { frame: 150, x: SIDEBAR_X + 320,                   y: H - 60 },
  ];

  return (
    <AbsoluteFill style={{ background: "#EBF1F6" }}>
      <Camera
        width={W}
        height={H}
        mockupWidth={W}
        mockupHeight={H}
        keyframes={cameraKeyframes}
      >
        <AppDashboard />

        {/* Flag-details popover overlay */}
        {popoverProgress > 0.001 && hoveredIssue && (
          <div
            style={{
              position: "absolute",
              left: SIDEBAR_X + 60,
              top: issueRowY(hoveredIssueIdx) + 26,
              width: 260,
              opacity: popoverProgress,
              transform: `translateY(${(1 - popoverProgress) * 6}px)`,
              background: "white",
              border: "1px solid #DEE5ED",
              borderRadius: 8,
              boxShadow: "0 12px 32px rgba(10,38,66,0.18), 0 4px 12px rgba(10,38,66,0.10)",
            }}
            className="p-3"
          >
            <div
              style={{
                position: "absolute",
                left: 100,
                top: -7,
                width: 14,
                height: 14,
                background: "#ffffff",
                borderTop: "1px solid #DEE5ED",
                borderLeft: "1px solid #DEE5ED",
                transform: "rotate(45deg)",
              }}
            />
            <div className="flex items-center gap-1.5 mb-2 relative">
              <WarningIcon className="w-3.5 h-3.5 text-orange-200 shrink-0" />
              <span className="text-grey-900 text-sm font-bold leading-5">Flag details</span>
            </div>
            <p className="text-grey-900 text-sm font-medium leading-5 mb-2 relative">
              {hoveredIssue.description}
            </p>
            {hoveredIssue.sources && hoveredIssue.sources.length > 0 && (
              <div className="flex flex-col gap-1.5 pt-2 border-t border-grey-200 relative">
                {hoveredIssue.sources.map((src) => (
                  <div key={src.label} className="flex flex-col gap-0.5">
                    <span className="text-grey-800 text-xs font-medium uppercase tracking-wide">
                      {src.label}
                    </span>
                    <span className="text-grey-900 text-sm font-medium leading-5">
                      {src.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Cursor waypoints={cursorWaypoints} clicks={[]} />
      </Camera>
    </AbsoluteFill>
  );
};
