"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IconButton, Tooltip } from "./ui";
import { ChevronDown, DownloadIcon, PrintIcon, DoubleArrowRight, ZoomInIcon, ZoomOutIcon, VisibilityIcon, VisibilityOffIcon } from "./icons";
import { FLAG_ISSUES } from "./sidebar-improvements/flagsData";
import { ALL_FIELDS } from "./sidebar-improvements/FormDataByPage";
import type { FormFieldHighlight } from "./sidebar-improvements/FormDataByPage";
import EmptyTabState from "./EmptyTabState";
import type { DocumentInfo } from "./documentTabs/types";
import { DOCUMENT_REGISTRY } from "./documentTabs/types";

const MIN_ZOOM = 50;
const MAX_ZOOM = 400;
const ZOOM_STEP = 25;
const PAGE_HEIGHT = 792; // US Letter height in px at 1x
const PAGE_GAP = 24; // gap between pages in px

interface DocumentViewerProps {
  /** Currently selected flag ID for highlight styling */
  selectedFlagId?: string | null;
  /** Callback when a flag highlight is clicked */
  onFlagSelect?: (id: string) => void;
  /** Show red flag highlight overlays */
  showFlags?: boolean;
  /** Flag IDs that have been rejected — their highlights are hidden */
  rejectedFlagIds?: Set<string>;
  /** Document to display. null = empty state, undefined = default document */
  document?: DocumentInfo | null;
  /** Show light blue form data highlight overlays */
  showFormHighlights?: boolean;
  /** Currently selected form field label for highlight styling */
  selectedFormField?: string | null;
  /** Callback when a form data highlight is clicked */
  onFormFieldSelect?: (label: string) => void;
  /** Whether overlays are manually hidden by user */
  overlaysHidden?: boolean;
  /** Toggle overlay visibility */
  onToggleOverlays?: () => void;
}

export default function DocumentViewer({
  selectedFlagId,
  onFlagSelect,
  showFlags = false,
  rejectedFlagIds,
  document: documentProp,
  showFormHighlights = false,
  selectedFormField,
  onFormFieldSelect,
  overlaysHidden = false,
  onToggleOverlays,
}: DocumentViewerProps) {
  // Resolve document: undefined → default, null → empty state
  const doc = documentProp === undefined ? DOCUMENT_REGISTRY[0] : documentProp;
  const totalPages = doc?.pageCount ?? 5;

  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const flagRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const formFieldRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Track current page based on scroll position
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scale = zoom / 100;
    const scaledPageHeight = PAGE_HEIGHT * scale;
    const scaledGap = PAGE_GAP * scale;

    // Find which page is most visible
    const pageIndex = Math.floor(scrollTop / (scaledPageHeight + scaledGap));
    const page = Math.min(Math.max(pageIndex + 1, 1), totalPages);

    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [zoom, currentPage]);

  // Scroll to selected flag when it changes
  useEffect(() => {
    if (!selectedFlagId) return;

    const flagEl = flagRefs.current.get(selectedFlagId);
    if (flagEl) {
      flagEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedFlagId]);

  // Scroll to selected form field when it changes
  useEffect(() => {
    if (!selectedFormField) return;

    const fieldEl = formFieldRefs.current.get(selectedFormField);
    if (fieldEl) {
      fieldEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedFormField]);

  // Form field labels that are covered by flag overlays (flags take priority)
  const flagCoveredLabels = new Set(
    FLAG_ISSUES.flatMap((f) => f.formFieldLabels ?? [])
  );

  // Group form fields with highlights by page, excluding those covered by flags
  const formFieldsByPage = showFormHighlights
    ? ALL_FIELDS
        .filter((f): f is typeof f & { highlight: FormFieldHighlight } =>
          !!f.highlight && !flagCoveredLabels.has(f.label)
        )
        .reduce<Record<number, typeof ALL_FIELDS>>((acc, field) => {
          const page = field.highlight!.page;
          (acc[page] ||= []).push(field);
          return acc;
        }, {})
    : {};

  // Group visible (non-rejected) flags by page
  const flagsByPage = showFlags
    ? FLAG_ISSUES
        .filter((flag) => !rejectedFlagIds?.has(flag.id))
        .reduce<Record<number, typeof FLAG_ISSUES>>((acc, flag) => {
          (acc[flag.page] ||= []).push(flag);
          return acc;
        }, {})
    : {};

  // Empty state when no document is loaded
  if (!doc) {
    return <EmptyTabState />;
  }

  return (
    <div className="flex flex-col h-full bg-grey-200 min-w-0">
      {/* Toolbar */}
      <div className="bg-white border-b border-grey-300 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-grey-900 text-sm font-medium whitespace-nowrap">
            Page {currentPage}
          </span>
          <ChevronDown className="w-4 h-4 text-grey-700 shrink-0" />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <IconButton
            icon={<ZoomOutIcon className="w-4 h-4" />}
            label="Zoom out"
            onClick={() => setZoom(Math.max(MIN_ZOOM, zoom - ZOOM_STEP))}
          />
          <span className="text-grey-900 text-xs sm:text-sm font-medium min-w-[40px] text-center">
            {zoom}%
          </span>
          <IconButton
            icon={<ZoomInIcon className="w-4 h-4" />}
            label="Zoom in"
            onClick={() => setZoom(Math.min(MAX_ZOOM, zoom + ZOOM_STEP))}
          />
          {onToggleOverlays && (
            <Tooltip label={overlaysHidden ? "Show Highlights" : "Hide Highlights"}>
              <IconButton
                icon={overlaysHidden ? <VisibilityOffIcon className="w-5 h-5" /> : <VisibilityIcon className="w-5 h-5" />}
                label={overlaysHidden ? "Show Highlights" : "Hide Highlights"}
                onClick={onToggleOverlays}
              />
            </Tooltip>
          )}
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <IconButton icon={<DownloadIcon className="w-5 h-5" />} label="Download" />
            <IconButton icon={<PrintIcon className="w-5 h-5" />} label="Print" />
            <IconButton icon={<DoubleArrowRight className="w-5 h-5" />} label="Expand" />
          </div>
        </div>
      </div>

      {/* Document area — scrollable container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8"
      >
        <div
          className="flex flex-col items-center gap-6"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
        >
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            const pageFlags = flagsByPage[pageNum] || [];
            const pageFormFields = formFieldsByPage[pageNum] || [];

            return (
              <div
                key={pageNum}
                ref={(el) => {
                  if (el) pageRefs.current.set(pageNum, el);
                }}
                className="relative bg-white shadow-lg rounded-sm w-full max-w-[612px] overflow-hidden"
                style={{ minHeight: PAGE_HEIGHT }}
              >
                {/* Page 1 stays blank when flag/form overlays are active so they
                    don't visually clash with the skeleton. Otherwise render the
                    skeleton so the page doesn't look empty. */}
                {pageNum === 1 && (showFlags || showFormHighlights) ? (
                  <div className="w-full" style={{ height: PAGE_HEIGHT }} />
                ) : (
                  <PagePlaceholder page={pageNum} variant={getSkeletonVariant(doc.id)} />
                )}

                {/* Form data highlight overlays for this page (rendered first, below flags) */}
                {!overlaysHidden && pageFormFields.map((field) => {
                  if (!field.highlight) return null;
                  const isSelected = field.label === selectedFormField;
                  return (
                    <button
                      key={field.label}
                      ref={(el) => {
                        if (el) formFieldRefs.current.set(field.label, el);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onFormFieldSelect?.(field.label);
                      }}
                      className={`absolute rounded transition-colors cursor-pointer ${
                        field.mismatch
                          ? isSelected
                            ? "bg-red-400/30 border-2 border-red-400 ring-2 ring-red-400/50"
                            : "bg-red-400/15 border-2 border-red-400 hover:bg-red-400/25"
                          : isSelected
                            ? "bg-blue-200/40 border-2 border-blue-400 ring-2 ring-blue-300/50"
                            : "bg-blue-200/20 border border-blue-300/60 hover:bg-blue-200/30"
                      }`}
                      style={{
                        top: field.highlight.top,
                        left: field.highlight.left,
                        width: field.highlight.width,
                        height: field.highlight.height,
                      }}
                      aria-label={`Form field: ${field.label}`}
                    />
                  );
                })}

                {/* Flag highlight overlays for this page (rendered last, on top — clicks go to Flags tab) */}
                {!overlaysHidden && pageFlags.map((flag) => {
                  const isSelected = flag.id === selectedFlagId;
                  return (
                    <button
                      key={flag.id}
                      ref={(el) => {
                        if (el) flagRefs.current.set(flag.id, el);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onFlagSelect?.(flag.id);
                      }}
                      className={`absolute z-10 rounded transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-red-400/30 border-2 border-red-500 ring-2 ring-red-400/50"
                          : "bg-red-400/15 border-2 border-red-400 hover:bg-red-400/25"
                      }`}
                      style={{
                        top: flag.highlight.top,
                        left: flag.highlight.left,
                        width: flag.highlight.width,
                        height: flag.highlight.height,
                      }}
                      aria-label={`Flag: ${flag.description}`}
                    />
                  );
                })}

                {/* Page number label */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-grey-800 text-xs font-medium">
                  Page {pageNum} of {totalPages}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type SkeletonVariant = "form" | "checklist" | "report" | "table";

/**
 * Map a document ID to a skeleton layout so each form looks visually distinct
 * when switching tabs. Keep the mapping deterministic per document.
 */
function getSkeletonVariant(documentId: string): SkeletonVariant {
  const CHECKLIST_DOCS = new Set([
    "doc-lead-paint",
    "doc-fair-housing",
    "doc-seller-disclosure",
    "doc-tds",
    "doc-nhd",
    "doc-agency-disclosure",
  ]);
  const REPORT_DOCS = new Set([
    "doc-home-inspection",
    "doc-termite",
    "doc-appraisal",
    "doc-home-warranty",
  ]);
  const TABLE_DOCS = new Set([
    "doc-prelim-title",
    "doc-loan-estimate",
    "doc-proof-of-funds",
    "doc-wire-instructions",
    "doc-commission-agreement",
    "doc-escrow-instructions",
  ]);

  if (CHECKLIST_DOCS.has(documentId)) return "checklist";
  if (REPORT_DOCS.has(documentId)) return "report";
  if (TABLE_DOCS.has(documentId)) return "table";
  return "form";
}

function SkeletonHeader() {
  return (
    <>
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="h-3 w-48 bg-grey-200 rounded" />
          <div className="h-2 w-32 bg-grey-100 rounded" />
        </div>
        <div className="h-3 w-20 bg-grey-200 rounded" />
      </div>
      <div className="h-px bg-grey-200 w-full" />
    </>
  );
}

function SkeletonSignature() {
  return (
    <div className="mt-auto flex gap-8 pt-6 border-t border-grey-200">
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-px bg-grey-300 w-full mt-6" />
        <div className="h-2 w-20 bg-grey-200 rounded" />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-px bg-grey-300 w-full mt-6" />
        <div className="h-2 w-16 bg-grey-200 rounded" />
      </div>
    </div>
  );
}

/** Placeholder content for pages 2-5 that looks like a real form */
function PagePlaceholder({ page, variant }: { page: number; variant: SkeletonVariant }) {
  return (
    <div className="p-10 flex flex-col gap-5" style={{ minHeight: PAGE_HEIGHT }}>
      <SkeletonHeader />
      {variant === "form" && <FormVariant page={page} />}
      {variant === "checklist" && <ChecklistVariant page={page} />}
      {variant === "report" && <ReportVariant page={page} />}
      {variant === "table" && <TableVariant page={page} />}
      <SkeletonSignature />
    </div>
  );
}

/** Label + input row style — standard contract/agreement look. */
function FormVariant({ page }: { page: number }) {
  return (
    <>
      <div className="h-3.5 w-56 bg-grey-300 rounded" />
      {Array.from({ length: 6 + page }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-2.5 w-36 bg-grey-200 rounded" />
          <div className="h-8 w-full border border-grey-200 rounded" />
        </div>
      ))}
      <div className="flex flex-col gap-1.5 mt-2">
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-4/5 bg-grey-100 rounded" />
      </div>
      {Array.from({ length: 3 }, (_, i) => (
        <div key={`b-${i}`} className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-2.5 w-28 bg-grey-200 rounded" />
            <div className="h-8 w-full border border-grey-200 rounded" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="h-2.5 w-24 bg-grey-200 rounded" />
            <div className="h-8 w-full border border-grey-200 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

/** Mostly checkbox rows with Y/N marks — disclosure look. */
function ChecklistVariant({ page }: { page: number }) {
  const rowCount = 10 + page;
  return (
    <>
      <div className="h-3.5 w-64 bg-grey-300 rounded" />
      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-5/6 bg-grey-100 rounded" />
      </div>
      <div className="flex flex-col gap-2.5 mt-1">
        {Array.from({ length: rowCount }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex-1 h-2.5 bg-grey-100 rounded" style={{ width: `${50 + (i * 7) % 45}%` }} />
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-4 h-4 border border-grey-300 rounded-sm" />
              <div className="h-2 w-4 bg-grey-200 rounded" />
              <div className="w-4 h-4 border border-grey-300 rounded-sm" />
              <div className="h-2 w-4 bg-grey-200 rounded" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-3 w-44 bg-grey-300 rounded mt-3" />
      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-11/12 bg-grey-100 rounded" />
        <div className="h-2 w-3/4 bg-grey-100 rounded" />
      </div>
    </>
  );
}

/** Header + photo blocks + narrative text — inspection/appraisal look. */
function ReportVariant({ page }: { page: number }) {
  return (
    <>
      <div className="h-4 w-72 bg-grey-300 rounded" />
      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-11/12 bg-grey-100 rounded" />
        <div className="h-2 w-4/5 bg-grey-100 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {Array.from({ length: 2 + (page % 2) }, (_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-24 w-full bg-grey-100 border border-grey-200 rounded flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-grey-200" />
            </div>
            <div className="h-2 w-24 bg-grey-200 rounded" />
          </div>
        ))}
      </div>
      <div className="h-3 w-56 bg-grey-300 rounded mt-3" />
      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-5/6 bg-grey-100 rounded" />
      </div>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={`bullet-${i}`} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-grey-400 mt-1.5 shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-2 bg-grey-100 rounded" style={{ width: `${70 + (i * 9) % 25}%` }} />
            <div className="h-2 bg-grey-100 rounded" style={{ width: `${50 + (i * 11) % 35}%` }} />
          </div>
        </div>
      ))}
    </>
  );
}

/** Multi-column tabular data — title report / loan estimate / wire look. */
function TableVariant({ page }: { page: number }) {
  const rows = 8 + page;
  return (
    <>
      <div className="h-4 w-60 bg-grey-300 rounded" />
      <div className="flex flex-col gap-1">
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-3/4 bg-grey-100 rounded" />
      </div>

      {/* Table */}
      <div className="border border-grey-200 rounded overflow-hidden mt-2">
        {/* Header row */}
        <div className="flex bg-grey-100 border-b border-grey-200">
          <div className="flex-[2] px-3 py-2">
            <div className="h-2 w-20 bg-grey-300 rounded" />
          </div>
          <div className="flex-1 px-3 py-2 border-l border-grey-200">
            <div className="h-2 w-12 bg-grey-300 rounded" />
          </div>
          <div className="flex-1 px-3 py-2 border-l border-grey-200">
            <div className="h-2 w-14 bg-grey-300 rounded" />
          </div>
          <div className="flex-1 px-3 py-2 border-l border-grey-200">
            <div className="h-2 w-10 bg-grey-300 rounded" />
          </div>
        </div>
        {/* Body rows */}
        {Array.from({ length: rows }, (_, i) => (
          <div
            key={i}
            className={`flex border-b border-grey-200 last:border-b-0 ${
              i % 2 === 1 ? "bg-grey-50" : ""
            }`}
          >
            <div className="flex-[2] px-3 py-2">
              <div className="h-2 bg-grey-200 rounded" style={{ width: `${55 + (i * 7) % 40}%` }} />
            </div>
            <div className="flex-1 px-3 py-2 border-l border-grey-200">
              <div className="h-2 w-16 bg-grey-200 rounded" />
            </div>
            <div className="flex-1 px-3 py-2 border-l border-grey-200">
              <div className="h-2 w-12 bg-grey-200 rounded" />
            </div>
            <div className="flex-1 px-3 py-2 border-l border-grey-200">
              <div className="h-2 w-14 bg-grey-200 rounded ml-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Totals row */}
      <div className="flex justify-end gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 bg-grey-300 rounded" />
          <div className="h-2 w-20 bg-grey-200 rounded" />
        </div>
      </div>
    </>
  );
}
