import React from "react";

/* ----------------------------------------------------------------- */
/*  Focused shell: PDF area + Right sidebar + Bottom action bar.      */
/*  Matches the Figma "Starting frames" board — no top bar, no left   */
/*  checklist. The GIF viewport is just the cards on screen.           */
/* ----------------------------------------------------------------- */

export const APP_W = 1960;
export const APP_H = 876;

const BOTTOM_H = 66;
export const RIGHT_W = 460;
export const CENTER_W = APP_W - RIGHT_W; // 1500
export const MIDDLE_H = APP_H - BOTTOM_H; // 810

/* ----------------------------------------------------------------- */
/*  Center PDF mockup with toolbar                                    */
/* ----------------------------------------------------------------- */

interface FlagOverlay {
  id: string;
  /** Percentages of the page area */
  top: string;
  left: string;
  width: string;
  height: string;
  /** Pulse / selected highlight */
  highlighted?: boolean;
  /** Faded visibility */
  fade?: number;
  /** Entrance scale for pop-in animation */
  scale?: number;
}

const PDFToolbar: React.FC = () => (
  <div className="bg-white border-b border-grey-300 flex items-center justify-end px-4 h-11 gap-2 shrink-0">
    {/* doc tab on left */}
    <div className="absolute left-3 flex items-center gap-2 px-3 py-1.5 bg-white rounded-t border border-b-0 border-grey-300 text-sm font-medium text-grey-900" style={{ marginTop: 6 }}>
      <DocIcon />
      <span>CAR_RPA_456Oak.pdf</span>
      <span className="text-grey-500 ml-1">×</span>
    </div>
    <div className="flex-1" />
    {/* Zoom out */}
    <ToolbarBtn>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M8 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </ToolbarBtn>
    {/* Zoom level */}
    <span className="text-grey-800 text-sm font-medium px-2">100%</span>
    {/* Zoom in */}
    <ToolbarBtn>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </ToolbarBtn>
    {/* Eye / hide overlays */}
    <ToolbarBtn>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </ToolbarBtn>
    {/* Download */}
    <ToolbarBtn>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </ToolbarBtn>
    {/* Print */}
    <ToolbarBtn>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 9V3h12v6M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14h12v7H6v-7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </ToolbarBtn>
    {/* More (>>) */}
    <ToolbarBtn>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l6 6-6 6M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </ToolbarBtn>
  </div>
);

const ToolbarBtn: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center justify-center w-8 h-8 text-grey-700">
    {children}
  </span>
);

const DocIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#0A2642" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M14 2v6h6" stroke="#0A2642" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

interface CenterPDFProps {
  page?: number;
  flags?: FlagOverlay[];
}

const CenterPDF: React.FC<CenterPDFProps> = ({ flags = [] }) => {
  return (
    <div
      style={{ width: CENTER_W, height: MIDDLE_H }}
      className="bg-grey-100 flex flex-col overflow-hidden shrink-0 relative"
    >
      <PDFToolbar />
      {/* Page area */}
      <div className="flex-1 flex items-start justify-center pt-8 overflow-hidden">
        <div
          style={{
            width: 740,
            minHeight: 920,
            background: "white",
            boxShadow: "0 4px 16px rgba(10,38,66,0.08)",
            position: "relative",
          }}
          className="rounded-sm"
        >
          {/* Page header */}
          <div className="px-10 pt-7 pb-4 border-b border-grey-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-grey-700 text-xs font-bold uppercase">CALIFORNIA ASSOCIATION OF REALTORS®</span>
              <span className="text-grey-700 text-xs font-bold">RPA</span>
            </div>
            <h1 className="text-grey-900 text-base font-bold uppercase tracking-wide leading-tight">
              California Residential Purchase Agreement
            </h1>
            <p className="text-grey-700 text-xs mt-1">and Joint Escrow Instructions</p>
          </div>
          {/* Page body — stylized form lines */}
          <div className="px-10 py-6 flex flex-col gap-5">
            <FormFieldLine label="Property Address" value="3969 Harvord Boulevard, Venture, CA 93001" />
            <FormFieldLine label="Buyer(s)" value="Rachael Laurolla, Rob Laurolla" />
            <FormFieldLine label="Seller(s)" value="James Thompson, Mary Thompson" />
            <FormFieldLine label="Purchase Price" value="$500,000.00" />
            <FormFieldLine label="Loan Type" value="Conventional" />
            <FormFieldLine label="Year Built" value="1965" />
            <FormFieldLine label="Close of Escrow" value="11/29/2023" />
            <div className="flex items-center justify-end gap-3 pt-8">
              <span className="text-grey-600 text-xs">Buyer Initials</span>
              <span className="w-12 h-7 border border-grey-300" />
              <span className="text-grey-600 text-xs ml-3">Seller Initials</span>
              <span className="w-12 h-7 border border-grey-300" />
            </div>
          </div>

          {/* Flag overlays */}
          {flags.map((flag) => (
            <div
              key={flag.id}
              data-flag-overlay={flag.id}
              style={{
                position: "absolute",
                top: flag.top,
                left: flag.left,
                width: flag.width,
                height: flag.height,
                background: flag.highlighted
                  ? "rgba(255, 82, 85, 0.32)"
                  : "rgba(255, 82, 85, 0.18)",
                border: flag.highlighted
                  ? "2px solid #ff5255"
                  : "1.5px solid rgba(255, 82, 85, 0.65)",
                borderRadius: 3,
                opacity: flag.fade ?? 1,
                boxShadow: flag.highlighted ? "0 0 0 4px rgba(255, 82, 85, 0.18)" : undefined,
                transform: flag.scale ? `scale(${flag.scale})` : undefined,
                transformOrigin: "center",
                pointerEvents: "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FormFieldLine: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-grey-700 text-xs font-bold uppercase tracking-wide w-32 shrink-0">{label}</span>
    <span className="text-grey-900 text-sm flex-1 border-b border-grey-300 pb-0.5">{value}</span>
  </div>
);

/* ----------------------------------------------------------------- */
/*  Bottom action bar                                                 */
/* ----------------------------------------------------------------- */

interface BottomBarProps {
  issueCount?: number;
  issuesActive?: boolean;
}

const BottomBar: React.FC<BottomBarProps> = ({ issueCount = 4 }) => (
  <div
    style={{ height: BOTTOM_H }}
    className="bg-white border-t border-grey-300 flex items-center justify-between px-6 shrink-0"
  >
    <span className="text-grey-700 text-sm">Page 1 of 5</span>
    <button
      className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold"
      style={{ background: "transparent", color: "#FA4515", border: "1px solid #FA4515" }}
    >
      <WarningIcon /> {issueCount} Issues Found
    </button>
    <div className="flex items-center gap-6">
      <button className="flex items-center gap-1.5 text-sm text-grey-800 font-bold">
        <EditIcon /> Customize Panel
      </button>
      <button className="flex items-center gap-2 text-sm text-grey-800 font-bold">
        <SettingsIcon /> Settings
      </button>
    </div>
  </div>
);

const WarningIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 21h22L12 2z" />
  </svg>
);
const EditIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M14 4l6 6-9 9H5v-6l9-9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
const SettingsIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M19 12a7 7 0 0 0-.1-1.2l2.1-1.6-2-3.4-2.4 1a7 7 0 0 0-2.1-1.2L14 3h-4l-.5 2.6c-.8.3-1.5.7-2.1 1.2l-2.4-1-2 3.4L5.1 10.8A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2.1 1.6 2 3.4 2.4-1c.6.5 1.3.9 2.1 1.2L10 21h4l.5-2.6c.8-.3 1.5-.7 2.1-1.2l2.4 1 2-3.4-2.1-1.6c.1-.4.1-.8.1-1.2z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

/* ----------------------------------------------------------------- */
/*  AppShell                                                          */
/* ----------------------------------------------------------------- */

interface AppShellProps {
  rightSidebar: React.ReactNode;
  flags?: FlagOverlay[];
  issuesActive?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ rightSidebar, flags = [], issuesActive }) => {
  return (
    <div
      style={{ width: APP_W, height: APP_H, background: "#ffffff" }}
      className="flex flex-col overflow-hidden"
    >
      <div className="flex" style={{ height: MIDDLE_H }}>
        <CenterPDF flags={flags} />
        <div
          style={{ width: RIGHT_W, height: MIDDLE_H, position: "relative" }}
          className="border-l border-grey-300 shrink-0 overflow-hidden"
        >
          {rightSidebar}
        </div>
      </div>
      <BottomBar issuesActive={issuesActive} />
    </div>
  );
};

export const APP_GEOMETRY = {
  W: APP_W,
  H: APP_H,
  BOTTOM_H,
  MIDDLE_H,
  CENTER_W,
  RIGHT_W,
  RIGHT_LEFT: CENTER_W, // sidebar starts after PDF (no top bar/checklist)
  TOP_H: 0,
  CENTER_LEFT: 0,
  LEFT_W: 0,
};
