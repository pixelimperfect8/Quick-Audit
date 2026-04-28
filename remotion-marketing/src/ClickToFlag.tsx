import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera } from "./lib/Camera";
import { Cursor } from "./lib/Cursor";
import { AppDashboard } from "./lib/AppDashboard";
import { PAGE_SCROLL_Y } from "@/components/sidebar-improvements/RPAFormPages";

/* ------------------------------------------------------------------------ */
/*  ClickToFlag (180f @ 30fps = 6s, 1960×876)                                */
/*                                                                           */
/*  Click "Seller's initials missing" issue (5th in the list, flag-4).      */
/*  Form scrolls from page 1 → page 5 (SIGNATURES section). A red highlight */
/*  pulses on the empty Seller signature line.                              */
/* ------------------------------------------------------------------------ */

const W = 1960;
const H = 876;
const APP_CENTER = { x: W / 2, y: H / 2 };

const SIDEBAR_W = 372;
const SIDEBAR_X = W - SIDEBAR_W;
const SIDEBAR_Y = 56;

// Issue rows in real sidebar — 5th issue = flag-4 ("Seller's initials missing")
const issueRowY = (idx: number) => SIDEBAR_Y + 576 + idx * 32;
const SELLER_INITIALS_IDX = 4; // 5th in DEFAULT_ISSUES order

// Camera focal during the form-pan phase — keep the right edge flush with the
// sidebar so both the Seller field on the form AND the selected issue row in
// the sidebar stay visible.
const PDF_CLOSE_SCALE = 1.4;
const pdfFocalX = W - W / (2 * PDF_CLOSE_SCALE); // = 1260 at scale 1.4
const pdfFocalY = H / 2;

export const ClickToFlag: React.FC = () => {
  const frame = useCurrentFrame();

  const flagClickFrame = 45;
  // Form starts scrolling as soon as the click registers, finishes ~1s later
  const scrollStart = 46;
  const scrollEnd = 78;
  const highlightStart = 82;
  const highlightFullAt = 96;

  const selectedFlagId = frame >= flagClickFrame ? "flag-4" : null;

  // Scroll the form from page 1 → page 5 over 45 frames after the click
  const targetScroll = PAGE_SCROLL_Y(5);
  const formScrollY = interpolate(frame, [scrollStart, scrollEnd], [0, targetScroll], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Compute current page label based on scroll position
  const currentPageNum = Math.min(5, Math.max(1, Math.round(formScrollY / 1214) + 1));

  // Flag highlight on Page 5 — Seller signature line
  const highlightProgress = interpolate(frame, [highlightStart, highlightFullAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulseT = interpolate(frame, [highlightStart, highlightStart + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const highlightScale = interpolate(highlightProgress, [0, 1], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const formHighlight =
    highlightProgress > 0
      ? {
          page: 5,
          // Just the empty Seller signature underline (after the "Seller:" label,
          // not including the Date field).
          top: "32%",
          left: "12.5%",
          width: "46%",
          height: "1.8%",
          progress: highlightProgress,
          scale: highlightScale,
          pulseProgress: pulseT,
        }
      : null;

  // ── Camera ──────────────────────────────────────────────────────────
  const baseScale = 1.0;
  const issuesCloseScale = 1.65;
  const pdfCloseScale = PDF_CLOSE_SCALE;

  // Issues focal: pin sidebar flush right, focal y on the 5th issue row
  const issuesFocal = {
    x: W - W / (2 * issuesCloseScale),
    y: issueRowY(SELLER_INITIALS_IDX),
  };
  const pdfFocal = { x: pdfFocalX, y: pdfFocalY };

  // Camera holds on Issues briefly to register click, then pans to PDF as scroll runs
  const cameraKeyframes = [
    { frame: 0,   scale: baseScale,        focal: APP_CENTER },
    { frame: 18,  scale: baseScale,        focal: APP_CENTER },
    { frame: 45,  scale: issuesCloseScale, focal: issuesFocal },
    { frame: 55,  scale: issuesCloseScale, focal: issuesFocal },
    { frame: 90,  scale: pdfCloseScale,    focal: pdfFocal },
    { frame: 150, scale: pdfCloseScale,    focal: pdfFocal },
    { frame: 178, scale: baseScale,        focal: APP_CENTER, ease: "easeOut" as const },
    { frame: 180, scale: baseScale,        focal: APP_CENTER },
  ];

  const flagRowY = issueRowY(SELLER_INITIALS_IDX);
  const flagRowX = SIDEBAR_X + 80;

  const cursorWaypoints = [
    { frame: 0,   x: SIDEBAR_X - 200,           y: H / 2 + 200 },
    { frame: 42,  x: flagRowX,                  y: flagRowY },
    { frame: 60,  x: flagRowX,                  y: flagRowY },
    { frame: 100, x: pdfFocal.x + 60,           y: pdfFocal.y + 14 },
    { frame: 180, x: pdfFocal.x + 60,           y: pdfFocal.y + 14 },
  ];

  const clicks = [flagClickFrame];

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
          selectedFlagId={selectedFlagId}
          formScrollY={formScrollY}
          pageLabel={`Page ${currentPageNum}`}
          formHighlight={formHighlight}
        />
        <Cursor waypoints={cursorWaypoints} clicks={clicks} />
      </Camera>
    </AbsoluteFill>
  );
};
