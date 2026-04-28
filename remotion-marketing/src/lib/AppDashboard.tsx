import React from "react";
import Dashboard from "@/components/Dashboard";
import SmartAssistOption3Sidebar from "@/components/sidebar-improvements/SmartAssistOption3Sidebar";
import SmartAssistEditSummary from "@/components/sidebar-improvements/SmartAssistEditSummary";
import { EditIcon, SettingsIcon } from "@/components/icons";
import { RPAFormOverlay } from "@/components/sidebar-improvements/RPAFormPages";
import {
  DEFAULT_HIDDEN_FIELDS,
  DEFAULT_SECTION_ORDER,
  ALL_CONTACTS,
  DEFAULT_CONTACTS,
  type SectionId,
} from "@/components/sidebar-improvements/SmartAssistOption2TransactionContent";

/* ----------------------------------------------------------------- */
/*  Dashboard mirror of /smart-assist-enhancements/option-3.          */
/*                                                                    */
/*  All state injected per-frame so the render is deterministic.      */
/* ----------------------------------------------------------------- */

const CHECKLIST_SECTIONS = [
  {
    title: "Sales Documentation",
    documents: [
      {
        number: 1,
        name: "California Residential Purchase Agreement",
        status: "Flagged" as const,
        files: [{ name: "CAR_RPA_456Oak.pdf", date: "2 days ago" }],
      },
      { number: 2, name: "Addendums", status: "Complete" as const },
      { number: 3, name: "Agency Disclosure", status: "Complete" as const },
      { number: 4, name: "Seller Property Disclosure", status: "Flagged" as const },
      { number: 5, name: "Transfer Disclosure Statement", status: "Pending" as const },
    ],
  },
  {
    title: "Disclosure Documentation",
    documents: [
      { number: 6, name: "Natural Hazard Disclosure", status: "Complete" as const },
      { number: 7, name: "Lead Based Paint", status: "Complete" as const },
      { number: 8, name: "Fair Housing Advisory", status: "Complete" as const },
      { number: 9, name: "Home Inspection Report", status: "Pending" as const },
      { number: 10, name: "Termite Inspection Report", status: "Required" as const },
      { number: 11, name: "Home Warranty", status: "Pending" as const },
    ],
  },
  {
    title: "Title & Escrow",
    documents: [
      { number: 12, name: "Preliminary Title Report", status: "Complete" as const },
      { number: 13, name: "Escrow Instructions", status: "Pending" as const },
      { number: 14, name: "Wire Transfer Instructions", status: "Required" as const },
    ],
  },
  {
    title: "Financing",
    documents: [
      { number: 15, name: "Loan Estimate", status: "Complete" as const },
      { number: 16, name: "Proof of Funds", status: "Pending" as const },
      { number: 17, name: "Appraisal Report", status: "Required" as const },
    ],
  },
  {
    title: "Commission & Compliance",
    documents: [
      { number: 18, name: "Commission Agreement", status: "Complete" as const },
    ],
  },
];

// Option-3 default hidden fields (mirrors option-3 page)
const OPTION3_CONTACT_ROLES = Array.from(new Set(ALL_CONTACTS.map((c) => c.role)));
const OPTION3_DEFAULT_VISIBLE_ROLES = new Set(DEFAULT_CONTACTS.map((c) => c.role));
const OPTION3_HIDDEN_ROLES_BY_DEFAULT = OPTION3_CONTACT_ROLES.filter(
  (r) => !OPTION3_DEFAULT_VISIBLE_ROLES.has(r),
);
export const OPTION3_DEFAULT_HIDDEN_FIELDS = new Set([
  ...Array.from(DEFAULT_HIDDEN_FIELDS).filter(
    (k) => !ALL_CONTACTS.some((c) => c.name === k),
  ),
  ...OPTION3_HIDDEN_ROLES_BY_DEFAULT,
]);
export const OPTION3_SECTION_FIELDS_OVERRIDE = {
  contacts: OPTION3_CONTACT_ROLES,
};

const noop = () => {};

interface AppDashboardProps {
  /** Selected flag ID (drives PDF highlight + sidebar selected row) */
  selectedFlagId?: string | null;
  /** Hidden fields in sidebar (from CustomizeView) */
  hiddenFields?: Set<string>;
  /** Field reorder for CustomizeView */
  fieldOrder?: Record<string, string[]>;
  /** Edit-mode controls Customize Panel slide-in */
  editMode?: boolean;
  /** External slide progress 0..1 — when set, overrides editMode-driven slide */
  slideProgress?: number;
  /** Selected form field for Hover demos */
  selectedFormField?: string | null;
  /** Initial active section in the sidebar tabs (Summary/Dates/Contacts/Commission) */
  initialActiveSection?: SectionId;
  /** Vertical scroll offset of the form (for ClickToFlag's scroll-to-page) */
  formScrollY?: number;
  /** Page indicator label (e.g., "Page 5") */
  pageLabel?: string;
  /** Optional flag highlight on a specific page */
  formHighlight?: import("@/components/sidebar-improvements/RPAFormPages").RPAFormPageHighlight | null;
  /** Initial expanded sections in the Customize Panel (drives section accordion) */
  editSummaryDefaultExpanded?: SectionId[];
}

export const AppDashboard: React.FC<AppDashboardProps> = ({
  selectedFlagId = null,
  hiddenFields = OPTION3_DEFAULT_HIDDEN_FIELDS,
  fieldOrder = {},
  editMode = false,
  slideProgress,
  selectedFormField = null,
  initialActiveSection,
  formScrollY,
  pageLabel,
  formHighlight,
  editSummaryDefaultExpanded,
}) => {
  const editSummaryProps = {
    hiddenFields,
    hiddenSections: new Set<string>(),
    sectionOrder: [...DEFAULT_SECTION_ORDER] as SectionId[],
    fieldOrder,
    onToggleField: noop,
    onToggleSection: noop,
    onReorderSections: noop,
    onReorderFields: noop,
    onResetToDefaults: noop,
    onClose: noop,
    title: "Customize Panel",
    sectionFieldsOverride: OPTION3_SECTION_FIELDS_OVERRIDE,
    defaultExpandedSections: editSummaryDefaultExpanded ?? [],
  };

  // Custom document viewer slot — replaces the live DocumentViewer entirely.
  // Renders the RPA form mockup with real panel data inside the same area
  // (toolbar above + form 24px below the toolbar, both inside the container).
  const documentViewerSlot = (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#F4F8FC",
        overflow: "hidden",
      }}
    >
      {/* Mock the white toolbar at the top of the document viewer */}
      <div
        style={{
          height: 44,
          background: "#ffffff",
          borderBottom: "1px solid #DEE5ED",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          fontSize: 13,
          color: "#3F5B77",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontWeight: 600 }}>{pageLabel ?? "Page 1"}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ZoomOutIcon /> <span style={{ fontWeight: 600 }}>100%</span> <ZoomInIcon />
          <EyeIcon /> <DownloadIcon /> <PrintIcon /> <DoubleArrowIcon />
        </div>
      </div>
      <RPAFormOverlay
        top={72}
        width={920}
        scrollY={formScrollY}
        pageHighlight={formHighlight ?? null}
      />
    </div>
  );

  return (
    <Dashboard
      checklistSections={CHECKLIST_SECTIONS}
      documentViewerOverride={documentViewerSlot}
      documentViewerProps={{
        selectedFlagId,
        showFlags: true,
        showFormHighlights: true,
        selectedFormField,
        overlaysHidden: false,
      }}
      actionBarProps={{}}
      topNavToggles={[
        {
          label: "Tiered Commission",
          checked: false,
          onChange: noop,
        },
      ]}
      rightSidebarContent={({ activeDocumentId }) => (
        <div className="relative w-full h-full">
          <SmartAssistOption3Sidebar
            onContactClick={noop}
            onViewLog={noop}
            checklistSections={CHECKLIST_SECTIONS}
            hiddenFields={hiddenFields}
            fieldOrder={fieldOrder}
            editMode={false /* slide-in handled externally below */}
            sectionFieldsOverride={OPTION3_SECTION_FIELDS_OVERRIDE}
            selectedFlagId={selectedFlagId}
            currentDocumentId={activeDocumentId}
            selectedFormField={selectedFormField}
            initialActiveSection={initialActiveSection}
          />
          {slideProgress !== undefined && slideProgress > 0.001 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "white",
                transform: `translateX(${(1 - slideProgress) * 100}%)`,
                zIndex: 30,
              }}
            >
              <SmartAssistEditSummary {...editSummaryProps} />
            </div>
          )}
        </div>
      )}
      sidebarFooter={
        <div className="bg-white border-t border-grey-300 px-4 flex items-center gap-3 shrink-0 h-[57px]">
          <button
            className={`flex items-center gap-1.5 text-sm font-bold ${
              editMode ? "text-blue-800" : "text-grey-800"
            }`}
          >
            <EditIcon className="w-4 h-4" />
            <span>{editMode ? "Done" : "Customize Panel"}</span>
          </button>
          <div className="flex-1" />
          <button className="flex items-center gap-2 text-sm text-grey-800 font-bold">
            <SettingsIcon className="w-5 h-5 text-grey-700" />
            <span>Settings</span>
          </button>
        </div>
      }
    />
  );
};

/* Toolbar icon helpers — match the real DocumentViewer's toolbar visually */
const ZoomOutIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 11h6M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const ZoomInIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 11h6M11 8v6M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const EyeIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const DownloadIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PrintIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6 9V3h12v6M6 17H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14h12v7H6v-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const DoubleArrowIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6 6l6 6-6 6M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
