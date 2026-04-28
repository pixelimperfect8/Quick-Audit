import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera } from "./lib/Camera";
import { Cursor } from "./lib/Cursor";
import { AppDashboard } from "./lib/AppDashboard";
import type { SectionId } from "@/components/sidebar-improvements/SmartAssistOption2TransactionContent";

/* ------------------------------------------------------------------------ */
/*  TabsTour (180f @ 30fps = 6s, 1960×876)                                   */
/*                                                                           */
/*  Cursor clicks through Summary → Dates → Contacts → Commission.          */
/*  Active section is driven per-frame via initialActiveSection prop on the */
/*  real FormDataBySectionTabs (since each Remotion frame remounts fresh).  */
/*                                                                           */
/*  Storyboard:                                                             */
/*    0  – 22  Cursor moves toward sidebar; Summary tab active by default   */
/*    22 – 50 Camera zooms IN to section tabs + content area                */
/*    50      Click Dates → Dates content shows                             */
/*    50 – 90 Hold Dates                                                    */
/*    90      Click Contacts → Contacts shows                               */
/*    90 – 130 Hold Contacts                                                */
/*    130     Click Commission → Commission shows                           */
/*    130– 165 Hold Commission                                              */
/*    165– 180 Camera returns to base                                        */
/* ------------------------------------------------------------------------ */

const W = 1960;
const H = 876;
const APP_CENTER = { x: W / 2, y: H / 2 };

// Right sidebar bounds in real Dashboard layout
const SIDEBAR_W = 372;
const SIDEBAR_X = W - SIDEBAR_W; // 1588
// SIDEBAR_Y = Header only (~56), TopNav is now hidden
const SIDEBAR_Y = 56;

// SectionTabBar (`flex items-center px-2`) wraps 4 buttons (`flex-1 px-2 py-3`).
// Bar inner width = sidebar width - 2 * 8 (px-2 outer padding).
// Each button width = inner / 4.
const TAB_BAR_PAD = 8;
const TAB_W = (SIDEBAR_W - 2 * TAB_BAR_PAD) / 4; // = 89
// Tab bar sits just below the search bar (~44 tall) inside the sidebar.
// Each tab is `py-3` (12px top + 12px bottom + ~20 text) ≈ 44 tall.
// Tab bar center y = SIDEBAR_Y + searchBar(44) + tabBar/2(22) = SIDEBAR_Y + 66.
const TAB_Y = SIDEBAR_Y + 66;

// Center x of tab N — lands the cursor in the geometric middle of each button.
const tabX = (idx: number) =>
  SIDEBAR_X + TAB_BAR_PAD + TAB_W / 2 + idx * TAB_W;

// Close-up scale + focal: pin the right edge of the viewport to the right
// edge of the app so the sidebar sits flush right (no empty space beyond it).
// At scale s, viewport width in app coords = W/s. For right edge alignment:
//   focal_x = W - W/(2*s)
const CLOSE_SCALE = 1.7;
const contentFocal = {
  x: W - W / (2 * CLOSE_SCALE),
  y: SIDEBAR_Y + 260,
};

const SECTION_BY_FRAME = (frame: number): SectionId => {
  if (frame >= 130) return "commission";
  if (frame >= 90) return "contacts";
  if (frame >= 50) return "dates";
  return "summary";
};

export const TabsTour: React.FC = () => {
  const frame = useCurrentFrame();

  const datesClickFrame = 50;
  const contactsClickFrame = 90;
  const commissionClickFrame = 130;

  const activeSection = SECTION_BY_FRAME(frame);

  // Camera
  const baseScale = 1.0;
  const closeScale = CLOSE_SCALE;

  const cameraKeyframes = [
    { frame: 0,   scale: baseScale,  focal: APP_CENTER },
    { frame: 22,  scale: baseScale,  focal: APP_CENTER },
    { frame: 48,  scale: closeScale, focal: contentFocal },
    { frame: 162, scale: closeScale, focal: contentFocal },
    { frame: 178, scale: baseScale,  focal: APP_CENTER, ease: "easeOut" as const },
    { frame: 180, scale: baseScale,  focal: APP_CENTER },
  ];

  // Cursor settles on each tab BEFORE the click, holds AFTER, then moves on.
  // Click frames: Dates=50, Contacts=90, Commission=130.
  const cursorWaypoints = [
    { frame: 0,   x: SIDEBAR_X - 200, y: H / 2 + 100 },
    { frame: 22,  x: tabX(0),         y: TAB_Y },  // Summary (already active)
    { frame: 45,  x: tabX(1),         y: TAB_Y },  // arrive Dates (5 frames before click@50)
    { frame: 82,  x: tabX(1),         y: TAB_Y },  // hold on Dates
    { frame: 87,  x: tabX(2),         y: TAB_Y },  // arrive Contacts (3 before click@90)
    { frame: 122, x: tabX(2),         y: TAB_Y },  // hold on Contacts
    { frame: 127, x: tabX(3),         y: TAB_Y },  // arrive Commission (3 before click@130)
    { frame: 175, x: tabX(3),         y: TAB_Y },  // hold on Commission
    { frame: 180, x: tabX(3),         y: TAB_Y },
  ];

  const clicks = [datesClickFrame, contactsClickFrame, commissionClickFrame];

  return (
    <AbsoluteFill style={{ background: "#EBF1F6" }}>
      <Camera
        width={W}
        height={H}
        mockupWidth={W}
        mockupHeight={H}
        keyframes={cameraKeyframes}
      >
        <AppDashboard initialActiveSection={activeSection} />
        <Cursor waypoints={cursorWaypoints} clicks={clicks} />
      </Camera>
    </AbsoluteFill>
  );
};
