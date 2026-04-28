import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera } from "./lib/Camera";
import { Cursor } from "./lib/Cursor";
import { AppDashboard, OPTION3_DEFAULT_HIDDEN_FIELDS } from "./lib/AppDashboard";

/* ------------------------------------------------------------------------ */
/*  CustomizeView (240f @ 30fps = 8s, 1960×876)                              */
/*                                                                           */
/*  Storyboard:                                                              */
/*    0   – 22  Cursor moves to "Customize Panel" footer button             */
/*    25       Click trigger → panel slides in (300ms)                       */
/*    65  – 85 Cursor moves to Transaction Summary section header           */
/*    90       Click section → Summary expands                              */
/*    115 – 145 Cursor moves to Type eye icon                                */
/*    150      Click Type eye → Type hidden                                  */
/*    155 – 185 Cursor moves to Buyer Broker License eye icon (idx 15)      */
/*    190      Click → Buyer Broker License shown (un-hidden)               */
/*    195 – 215 Cursor moves to Done footer button                           */
/*    220      Click Done → panel slides out (300ms)                         */
/*    220 – 240 Panel exits; sidebar Summary now reflects new visibility    */
/* ------------------------------------------------------------------------ */

const W = 1960;
const H = 876;
const APP_CENTER = { x: W / 2, y: H / 2 };

const SIDEBAR_W = 372;
const SIDEBAR_X = W - SIDEBAR_W;
const SIDEBAR_Y = 56;

// Footer (Customize Panel / Done button) — the right sidebar's footer is the
// last 57px of the viewport (sidebar content has overflow:hidden, footer is a
// flex-col sibling that anchors to the bottom).
// Sidebar header (Header) is ~56 tall, sidebar fills the rest:
//   sidebar y range: [56, 876], footer y range: [819, 876].
// Center the cursor in the lower half of the footer for unambiguous click.
const FOOTER_Y = 855;
const customizeBtnX = SIDEBAR_X + 80; // mid of "Customize Panel"/"Done" text
const customizeBtnY = FOOTER_Y;

// Customize Panel layout (calibrated)
const panelTop = SIDEBAR_Y + 95;
const SECTION_CARD_H = 50;
const FIELD_ROW_H = 33;
// Cursor Y for section header — centered on the section header card
const summaryHeaderY = panelTop + 26;
const summaryHeaderX = SIDEBAR_X + 100;
// Cursor Y for field row idx — at the row's vertical center.
// First row top sits at panelTop + SECTION_CARD_H + ~16, center adds ~14 more.
const fieldRowY = (idx: number) =>
  panelTop + SECTION_CARD_H + 16 + 14 + idx * FIELD_ROW_H;

// Field indices (matches ALL_SUMMARY_DETAILS order, with Close of Escrow + Acceptance Date filtered)
//   0 Status, 1 File name, 2 Type, 3 Checklist Type, 4 Agent, 5 MLS #,
//   6 Escrow #, 7 Email, 8 Year Built, 9 Purchase Price, 10 File ID,
//   11 Property Type, 12 Seller Brokerage, 13 Seller Broker License,
//   14 Buyer Brokerage, 15 Buyer Broker License, 16 Rep Type, ...
const TYPE_IDX = 2;
const BUYER_BROKER_LICENSE_IDX = 15;

// Eye icon X (right edge of field row)
const eyeX = SIDEBAR_X + SIDEBAR_W - 30;

export const CustomizeView: React.FC = () => {
  const frame = useCurrentFrame();

  const customizeClickFrame = 25;
  const expandClickFrame = 90;
  const typeClickFrame = 150;
  const bblClickFrame = 190;
  const doneClickFrame = 220;

  // 300ms slide each way (= 9 frames at 30fps)
  const slideInStart = 26;
  const slideInEnd = 35;
  const slideOutStart = 221;
  const slideOutEnd = 230;

  const slideIn = interpolate(frame, [slideInStart, slideInEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideOut = interpolate(frame, [slideOutStart, slideOutEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideProgress = Math.max(0, slideIn - slideOut);

  const summaryExpanded = frame >= expandClickFrame;

  // Hidden fields — accumulate as user clicks eye icons
  const hiddenFields = (() => {
    const s = new Set(OPTION3_DEFAULT_HIDDEN_FIELDS);
    // Hide Type after Type-eye click
    if (frame >= typeClickFrame) s.add("Type");
    // Show Buyer Broker License after its eye click (un-hide it from defaults)
    if (frame >= bblClickFrame) s.delete("Buyer Broker License");
    return s;
  })();

  const editMode = frame >= customizeClickFrame && frame < doneClickFrame + 3;

  // Camera — closer zoom (1.25), focal pans down at the end so footer Done button stays in view.
  const baseScale = 1.0;
  const closeScale = 1.25;
  const focalX = W - W / (2 * closeScale); // flush right
  const focalYpanel = 460; // covers panel header → BBL field
  const focalYfooter = 555; // covers Done footer button

  const cameraKeyframes = [
    { frame: 0,   scale: baseScale,  focal: APP_CENTER },
    { frame: 22,  scale: baseScale,  focal: APP_CENTER },
    { frame: 45,  scale: closeScale, focal: { x: focalX, y: focalYpanel } },
    { frame: 200, scale: closeScale, focal: { x: focalX, y: focalYpanel } },
    { frame: 215, scale: closeScale, focal: { x: focalX, y: focalYfooter } },
    { frame: 232, scale: closeScale, focal: { x: focalX, y: focalYfooter } },
    { frame: 238, scale: baseScale,  focal: APP_CENTER, ease: "easeOut" as const },
    { frame: 240, scale: baseScale,  focal: APP_CENTER },
  ];

  const cursorWaypoints = [
    { frame: 0,   x: SIDEBAR_X - 200,             y: H / 2 + 200 },
    { frame: 22,  x: customizeBtnX,               y: customizeBtnY },
    { frame: 60,  x: customizeBtnX,               y: customizeBtnY },
    { frame: 85,  x: summaryHeaderX,              y: summaryHeaderY },
    { frame: 115, x: summaryHeaderX,              y: summaryHeaderY },
    { frame: 145, x: eyeX,                        y: fieldRowY(TYPE_IDX) },
    { frame: 170, x: eyeX,                        y: fieldRowY(TYPE_IDX) },
    { frame: 185, x: eyeX,                        y: fieldRowY(BUYER_BROKER_LICENSE_IDX) },
    { frame: 210, x: eyeX,                        y: fieldRowY(BUYER_BROKER_LICENSE_IDX) },
    { frame: 215, x: customizeBtnX,               y: customizeBtnY },
    { frame: 240, x: customizeBtnX,               y: customizeBtnY },
  ];

  const clicks = [
    customizeClickFrame,
    expandClickFrame,
    typeClickFrame,
    bblClickFrame,
    doneClickFrame,
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
        <AppDashboard
          key={summaryExpanded ? "expanded" : "collapsed"}
          hiddenFields={hiddenFields}
          editMode={editMode}
          slideProgress={slideProgress}
          editSummaryDefaultExpanded={summaryExpanded ? ["summary"] : []}
        />
        <Cursor waypoints={cursorWaypoints} clicks={clicks} />
      </Camera>
    </AbsoluteFill>
  );
};
