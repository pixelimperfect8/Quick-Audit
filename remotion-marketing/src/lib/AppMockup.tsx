import React from "react";

/* ------------------------------------------------------------------- */
/*  Faithful option-3 sidebar mockup                                    */
/*                                                                      */
/*  Mirrors:                                                            */
/*    - SmartAssistOption3Sidebar.tsx (search bar + footer)             */
/*    - FormDataBySectionTabs.tsx (section tabs + content + Issues +    */
/*      Successful checks)                                              */
/*                                                                      */
/*  Natural width: 460px (matches app's right sidebar width).           */
/* ------------------------------------------------------------------- */

export const SIDEBAR_WIDTH = 460;
export const SIDEBAR_HEIGHT = 760;

type SectionId = "summary" | "dates" | "contacts" | "commission";

interface Field {
  label: string;
  value: string;
  isLink?: boolean;
  flagged?: boolean;
  hidden?: boolean;
  /** 0..1 entrance progress (for animated reveal of reordered rows) */
  entranceProgress?: number;
  /** 0..1 exit progress (for animated hide of fields) */
  exitProgress?: number;
}

interface Issue {
  id: string;
  description: string;
}

const DEFAULT_CONTACTS = [
  { role: "Buyer", name: "Rachael Laurolla", flagged: true },
  { role: "Buyer", name: "Rob Laurolla", flagged: false },
  { role: "Lender", name: "Mark Roberts", flagged: false },
];

// Person icon for contact rows
const PersonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M4 21c0-4 4-7 8-7s8 3 8 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const DEFAULT_SUMMARY: Field[] = [
  { label: "Status", value: "Pending" },
  { label: "File name", value: "3969 Harvord Boulevard" },
  { label: "Type", value: "Purchase" },
  { label: "Agent", value: "Aaron Smith" },
  { label: "MLS #", value: "1234567" },
  { label: "Year Built", value: "1965" },
  { label: "Purchase Price", value: "$450,000.00" },
];

const DEFAULT_ISSUES: Issue[] = [
  { id: "flag-1", description: "The buyer's name doesn't match the name on file." },
  { id: "flag-2", description: "The property address doesn't match the address on file or MLS." },
  { id: "flag-3", description: "The purchase price does not match the purchase price on file." },
  { id: "flag-6", description: "Buyer broker license number is missing." },
];

const SUCCESSFUL_CHECKS = [
  "Type",
  "Agent",
  "MLS #",
  "Year Built",
  "Close of Escrow",
  "Acceptance Date",
  "Loan Type",
  "Property Type",
  "Home Warranty",
  "Buyer Brokerage",
  "Seller Brokerage",
  "Seller Broker License",
  "Loan Contingency",
];

interface SidebarProps {
  /** Search input value */
  searchValue?: string;
  searchFocused?: boolean;
  /** Active section tab */
  activeSection?: SectionId;
  /** Issues filter */
  issuesFilter?: "current" | "all";
  /** Selected flag (red highlight on row) */
  selectedFlagId?: string;
  /** 0..1 progress of the selected-row red bg fade-in */
  selectedFlagProgress?: number;
  /** Hovered field — show source tooltip */
  hoveredField?: string | null;
  /** Custom field list (e.g. reordered or with hidden) */
  fields?: Field[];
  /** Override issues list */
  issues?: Issue[];
  /** Customize Panel button active state */
  customizeActive?: boolean;
  /** Slide-in customize panel overlay (renders ON TOP) */
  customizePanelOverlay?: React.ReactNode;
}

export const Sidebar3Mockup: React.FC<SidebarProps> = ({
  searchValue = "",
  searchFocused = false,
  activeSection = "summary",
  issuesFilter = "current",
  selectedFlagId,
  hoveredField,
  fields = DEFAULT_SUMMARY,
  issues = DEFAULT_ISSUES,
  customizeActive,
  customizePanelOverlay,
  selectedFlagProgress = 1,
}) => {
  const isSearchActive = searchFocused || !!searchValue;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
      className="flex flex-col"
    >
      {/* SEARCH BAR */}
      <div
        className={`flex items-center px-4 py-2.5 border-b ${
          isSearchActive ? "bg-white border-blue-800" : "bg-grey-50 border-grey-300"
        }`}
      >
        <span className="flex-1 text-base font-medium leading-6">
          {searchValue ? (
            <span className="text-grey-900">{searchValue}</span>
          ) : (
            <span className="text-grey-800">Search...</span>
          )}
        </span>
        {isSearchActive ? (
          <CloseIcon className="w-4 h-4 text-grey-700 ml-2" />
        ) : (
          <SearchIcon className="w-[18px] h-[18px] text-grey-800 ml-2" />
        )}
      </div>

      {/* SECTION TAB BAR */}
      <div className="bg-white border-b border-grey-300 flex items-center px-2">
        {(["summary", "dates", "contacts", "commission"] as SectionId[]).map((id) => {
          const isActive = activeSection === id;
          const labels: Record<SectionId, string> = {
            summary: "Summary",
            dates: "Dates",
            contacts: "Contacts",
            commission: "Commission",
          };
          return (
            <div
              key={id}
              className={`flex-1 px-2 py-3 border-b-2 text-sm text-center ${
                isActive
                  ? "border-blue-800 text-blue-800 font-bold"
                  : "border-transparent text-grey-800 font-medium"
              }`}
            >
              {labels[id]}
            </div>
          );
        })}
      </div>

      {/* SECTION CONTENT */}
      {activeSection === "contacts" ? (
        <div className="px-4 py-4 flex flex-col gap-1 border-b border-grey-300">
          {DEFAULT_CONTACTS.map((c) => {
            const isHovered = hoveredField === c.name;
            return (
              <div
                key={c.name}
                data-field={c.name}
                className={`flex items-start gap-3 px-2 -mx-2 py-0.5 rounded ${
                  isHovered ? "bg-grey-50" : ""
                }`}
              >
                <span className="text-grey-900 text-base font-bold w-[120px] shrink-0 leading-6">
                  {c.role}
                </span>
                <span className="flex items-center gap-1.5 min-w-0 flex-1">
                  <PersonIcon className="w-4 h-4 text-grey-700 shrink-0" />
                  <span
                    className={`text-grey-900 text-base font-medium leading-6 ${
                      c.flagged ? "rounded-sm bg-red-50/80 px-0.5 -mx-0.5" : ""
                    }`}
                  >
                    {c.name}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      ) : (
      <div className="px-4 py-4 flex flex-col gap-1 border-b border-grey-300">
        {fields.map((field) => {
          // Animated hide: when exitProgress > 0, collapse height + fade out
          const exit = field.exitProgress ?? 0;
          if (exit >= 1) return null;
          const enter = field.entranceProgress ?? 1;
          const isHovered = hoveredField === field.label;
          const isStatus = field.label === "Status";
          return (
            <div
              key={field.label}
              data-field={field.label}
              style={{
                opacity: (1 - exit) * enter,
                maxHeight: (1 - exit) * 36,
                overflow: "hidden",
                transition: "none",
              }}
              className={`flex items-start gap-3 px-2 -mx-2 py-0.5 rounded ${
                isHovered ? "bg-grey-50" : ""
              }`}
            >
              <span className="text-grey-900 text-base font-bold w-[120px] shrink-0 leading-6">
                <span className={field.flagged ? "rounded-sm bg-red-50/80 px-0.5 -mx-0.5" : ""}>
                  {field.label}
                </span>
              </span>
              {isStatus ? (
                <span className="inline-flex items-center rounded bg-yellow-200 px-2 py-0.5 text-sm font-medium text-grey-900">
                  Pending
                </span>
              ) : (
                <span
                  className={`text-grey-900 text-base font-medium leading-6 break-words min-w-0 flex-1 ${
                    field.isLink ? "underline" : ""
                  }`}
                >
                  <span className={field.flagged ? "rounded-sm bg-red-50/80 px-0.5 -mx-0.5" : ""}>
                    {field.value}
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* ISSUES (collapsible) */}
      <div className="border-b border-grey-200 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ChevronDown />
            <WarningIcon className="w-4 h-4 text-orange-200" />
            <h3 className="text-grey-900 text-base font-bold">
              Issues ({issues.length})
            </h3>
          </div>
          {/* Current/All toggle */}
          <div className="flex items-center gap-1.5 p-[2px] bg-grey-50 border border-grey-300 rounded-md">
            {(["current", "all"] as const).map((mode) => {
              const isActive = issuesFilter === mode;
              const count = mode === "current" ? issues.length : issues.length + 2;
              return (
                <span
                  key={mode}
                  className={`px-2 py-0.5 text-sm rounded ${
                    isActive
                      ? "bg-white border border-grey-300/50 text-blue-800 font-bold"
                      : "text-grey-800 font-medium"
                  }`}
                >
                  {mode === "current" ? "Current" : "All"} ({count})
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {issues.map((issue) => {
            const isSelected = selectedFlagId === issue.id;
            return (
              <div
                key={issue.id}
                data-flag={issue.id}
                style={{
                  background: isSelected
                    ? `rgba(255, 82, 85, ${0.10 * selectedFlagProgress})`
                    : undefined,
                }}
                className="flex items-center gap-2 px-4 py-1 -mx-4 rounded-sm"
              >
                <WarningIcon className="w-4 h-4 text-orange-200 shrink-0" />
                <span className="text-grey-900 text-base font-medium leading-6 truncate">
                  {issue.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SUCCESSFUL CHECKS (collapsible) */}
      <div className="border-b border-grey-200 px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <ChevronDown />
          <CheckIcon className="w-4 h-4 text-green-600" />
          <h3 className="text-grey-900 text-base font-bold">
            Successful checks ({SUCCESSFUL_CHECKS.length})
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          {SUCCESSFUL_CHECKS.slice(0, 4).map((label) => (
            <div key={label} className="flex items-center gap-2 px-4 py-1 -mx-4">
              <CheckIcon className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-grey-900 text-base font-medium leading-6">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-white border-t border-grey-300 px-4 flex items-center gap-3 h-[57px] mt-auto">
        <button
          className={`flex items-center gap-1.5 text-sm font-bold ${
            customizeActive ? "text-blue-800" : "text-grey-800"
          }`}
        >
          <EditIcon className="w-4 h-4" />
          <span>{customizeActive ? "Done" : "Customize Panel"}</span>
        </button>
        <div className="flex-1" />
        <button className="flex items-center gap-2 text-sm text-grey-800 font-bold">
          <SettingsIcon className="w-5 h-5 text-grey-700" />
          <span>Settings</span>
        </button>
      </div>

      {/* Slide-in Customize Panel overlay — wrapped in a clipping container
          so partial-translateX doesn't leak past the sidebar's right edge */}
      {customizePanelOverlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          {customizePanelOverlay}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------- */
/*  Customize Panel slide-in (mirrors SmartAssistEditSummary)           */
/* ------------------------------------------------------------------- */

interface CustomizePanelField {
  label: string;
  hidden?: boolean;
  /** Show drag-lift visual */
  dragging?: boolean;
  dragOffsetY?: number;
}

export const CustomizePanel: React.FC<{
  /** 0..1 — how far the panel has slid in (0 = hidden, 1 = fully in) */
  slideProgress: number;
  fields: CustomizePanelField[];
}> = ({ slideProgress, fields }) => {
  // Fade + small slide-in (avoids partial-translate escape from clipping bug)
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#ffffff",
        zIndex: 30,
        opacity: slideProgress,
        transform: `translateX(${(1 - slideProgress) * 24}px)`,
        transition: "none",
      }}
      className="flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-grey-300">
        <h2 className="text-grey-900 text-base font-bold">Customize Panel</h2>
        <button className="text-grey-700">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Section heading */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-grey-900 text-sm font-bold uppercase tracking-wider">
          Summary
        </h3>
      </div>

      {/* Field list with drag handles + visibility toggles */}
      <div className="px-4 flex flex-col gap-1">
        {fields.map((field) => (
          <div
            key={field.label}
            style={{
              transform: field.dragging
                ? `translateY(${field.dragOffsetY ?? 0}px)`
                : undefined,
              opacity: field.dragging ? 0.85 : 1,
              boxShadow: field.dragging
                ? "0 8px 16px rgba(10,38,66,0.18)"
                : undefined,
              background: field.dragging ? "#F4F8FC" : "#ffffff",
              zIndex: field.dragging ? 10 : 1,
              position: "relative",
              borderRadius: 4,
            }}
            className="flex items-center gap-3 py-2 px-2"
          >
            <DragHandleIcon className="w-4 h-4 text-grey-500" />
            <span
              className={`flex-1 text-base font-medium ${
                field.hidden ? "text-grey-500" : "text-grey-900"
              }`}
            >
              {field.label}
            </span>
            {field.hidden ? (
              <VisibilityOffIcon className="w-[18px] h-[18px] text-grey-600" />
            ) : (
              <VisibilityIcon className="w-[18px] h-[18px] text-grey-700" />
            )}
          </div>
        ))}
      </div>

      {/* Footer with Reset */}
      <div className="mt-auto border-t border-grey-300 px-4 py-3 flex items-center">
        <button className="text-blue-800 text-sm font-bold">
          Reset to defaults
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------- */
/*  Source-diff tooltip (HoverIssue GIF)                                */
/* ------------------------------------------------------------------- */

export const SourceDiffTooltip: React.FC<{
  label: string;
  formValue: string;
  fileValue: string;
  page?: string;
  /** 0..1 entrance progress */
  progress: number;
}> = ({ label, formValue, fileValue, page, progress }) => {
  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * 6}px)`,
      }}
      className="bg-white border border-grey-300 rounded-lg shadow-xl p-4 w-72"
    >
      <div className="flex items-center gap-1.5 mb-3">
        <WarningIcon className="w-4 h-4 text-orange-200" />
        <span className="text-grey-900 text-sm font-bold">{label}</span>
      </div>
      <div className="flex flex-col gap-2.5 pt-2 border-t border-grey-200">
        <div className="flex flex-col gap-0.5">
          <span className="text-grey-800 text-sm font-medium">RPA</span>
          <span className="text-grey-900 text-base font-medium leading-5">
            {formValue}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-grey-800 text-sm font-medium">File</span>
          <span className="text-grey-900 text-base font-medium leading-5">
            {fileValue}
          </span>
        </div>
      </div>
      {page && (
        <p className="text-grey-600 text-sm mt-3 pt-2 border-t border-grey-200">
          {page}
        </p>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------- */
/*  Inline icon helpers                                                 */
/* ------------------------------------------------------------------- */

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const WarningIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 21h22L12 2zm0 6l8 14H4l8-14zm0 4v4m0 2v.01" stroke="currentColor" strokeWidth="0" />
    <path
      d="M12 4.6L3.6 19.4h16.8L12 4.6zm-1 5.4h2v5h-2v-5zm0 6h2v2h-2v-2z"
      fill="#FA4515"
    />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#2a7349" />
    <path d="M7 12l3.5 3.5L17 9" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke="#0A2642" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M14 4l6 6-9 9H5v-6l9-9z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M19 12a7 7 0 0 0-.1-1.2l2.1-1.6-2-3.4-2.4 1a7 7 0 0 0-2.1-1.2L14 3h-4l-.5 2.6c-.8.3-1.5.7-2.1 1.2l-2.4-1-2 3.4L5.1 10.8A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2.1 1.6 2 3.4 2.4-1c.6.5 1.3.9 2.1 1.2L10 21h4l.5-2.6c.8-.3 1.5-.7 2.1-1.2l2.4 1 2-3.4-2.1-1.6c.1-.4.1-.8.1-1.2z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const DragHandleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="9" cy="6" r="1.6" />
    <circle cx="15" cy="6" r="1.6" />
    <circle cx="9" cy="12" r="1.6" />
    <circle cx="15" cy="12" r="1.6" />
    <circle cx="9" cy="18" r="1.6" />
    <circle cx="15" cy="18" r="1.6" />
  </svg>
);

const VisibilityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const VisibilityOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 3l18 18M10.6 6.1A11 11 0 0 1 22 12s-1.4 2.8-4.1 4.9M6 6.5C3.4 8.5 2 12 2 12s3.5 7 10 7c1.6 0 3-.3 4.3-.7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);
