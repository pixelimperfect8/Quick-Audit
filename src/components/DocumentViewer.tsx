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

/* ────────────────────────────────────────────────────────────────
   Document skeletons
   Each document gets a unique layout composed from shared primitives
   so switching tabs always shows a visually distinct skeleton.
   ──────────────────────────────────────────────────────────────── */

function getSkeletonVariant(documentId: string): string {
  return documentId;
}

function SkeletonHeader({ title = "band" }: { title?: "band" | "centered" | "report" }) {
  if (title === "centered") {
    return (
      <>
        <div className="flex flex-col items-center gap-1.5">
          <div className="h-4 w-64 bg-grey-300 rounded" />
          <div className="h-2.5 w-40 bg-grey-200 rounded" />
          <div className="h-2 w-32 bg-grey-100 rounded" />
        </div>
        <div className="h-px bg-grey-200 w-full" />
      </>
    );
  }
  if (title === "report") {
    return (
      <>
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-56 bg-grey-300 rounded" />
            <div className="h-2.5 w-44 bg-grey-200 rounded" />
            <div className="h-2 w-36 bg-grey-100 rounded" />
          </div>
          <div className="w-14 h-14 bg-grey-100 border border-grey-200 rounded" />
        </div>
        <div className="h-px bg-grey-300 w-full" />
      </>
    );
  }
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

function Heading({ widthPct = 40, size = "md" }: { widthPct?: number; size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "h-4" : size === "sm" ? "h-2.5" : "h-3.5";
  return <div className={`${h} bg-grey-300 rounded`} style={{ width: `${widthPct}%` }} />;
}

function Paragraph({ lines = 3, seed = 0 }: { lines?: number; seed?: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: lines }, (_, i) => {
        const isLast = i === lines - 1;
        const w = isLast ? 55 + ((seed + i * 11) % 35) : 88 + ((seed + i * 7) % 12);
        return <div key={i} className="h-2 bg-grey-100 rounded" style={{ width: `${w}%` }} />;
      })}
    </div>
  );
}

function FormRow({ labelPct = 30, double = false }: { labelPct?: number; double?: boolean }) {
  if (double) {
    return (
      <div className="flex gap-4">
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-2.5 w-28 bg-grey-200 rounded" />
          <div className="h-8 w-full border border-grey-200 rounded" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-2.5 w-24 bg-grey-200 rounded" />
          <div className="h-8 w-full border border-grey-200 rounded" />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="h-2.5 bg-grey-200 rounded" style={{ width: `${labelPct}%` }} />
      <div className="h-8 w-full border border-grey-200 rounded" />
    </div>
  );
}

function YNRows({ count, seed = 0 }: { count: number; seed?: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div
            className="flex-1 h-2.5 bg-grey-100 rounded"
            style={{ width: `${50 + (seed + i * 7) % 45}%` }}
          />
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-4 h-4 border border-grey-300 rounded-sm" />
            <div className="h-2 w-4 bg-grey-200 rounded" />
            <div className="w-4 h-4 border border-grey-300 rounded-sm" />
            <div className="h-2 w-4 bg-grey-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CheckRows({ count, seed = 0 }: { count: number; seed?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-4 h-4 border border-grey-300 rounded-sm shrink-0 mt-0.5" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-2 bg-grey-100 rounded" style={{ width: `${70 + (seed + i * 9) % 25}%` }} />
            <div className="h-2 bg-grey-100 rounded" style={{ width: `${45 + (seed + i * 13) % 35}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function NumberedList({ count, seed = 0 }: { count: number; seed?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-grey-100 border border-grey-200 shrink-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-grey-300 rounded" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-2.5 bg-grey-200 rounded" style={{ width: `${40 + (seed + i * 11) % 30}%` }} />
            <div className="h-2 bg-grey-100 rounded" style={{ width: `${85 + (seed + i * 5) % 10}%` }} />
            <div className="h-2 bg-grey-100 rounded" style={{ width: `${55 + (seed + i * 7) % 30}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Bullets({ count, seed = 0 }: { count: number; seed?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-grey-400 mt-1.5 shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="h-2 bg-grey-100 rounded" style={{ width: `${70 + (seed + i * 9) % 25}%` }} />
            <div className="h-2 bg-grey-100 rounded" style={{ width: `${50 + (seed + i * 11) % 35}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Table({
  rows,
  cols = 4,
  seed = 0,
  striped = true,
}: {
  rows: number;
  cols?: number;
  seed?: number;
  striped?: boolean;
}) {
  return (
    <div className="border border-grey-200 rounded overflow-hidden">
      {/* Header */}
      <div className="flex bg-grey-100 border-b border-grey-200">
        {Array.from({ length: cols }, (_, c) => (
          <div
            key={c}
            className={`${c === 0 ? "flex-[2]" : "flex-1"} px-3 py-2 ${c > 0 ? "border-l border-grey-200" : ""}`}
          >
            <div className="h-2 bg-grey-300 rounded" style={{ width: `${40 + (c * 17) % 40}%` }} />
          </div>
        ))}
      </div>
      {/* Body */}
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className={`flex border-b border-grey-200 last:border-b-0 ${
            striped && i % 2 === 1 ? "bg-grey-50" : ""
          }`}
        >
          {Array.from({ length: cols }, (_, c) => (
            <div
              key={c}
              className={`${c === 0 ? "flex-[2]" : "flex-1"} px-3 py-2 ${c > 0 ? "border-l border-grey-200" : ""}`}
            >
              <div
                className="h-2 bg-grey-200 rounded"
                style={{
                  width: `${40 + (seed + i * 7 + c * 13) % 45}%`,
                  marginLeft: c === cols - 1 ? "auto" : undefined,
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function PhotoGrid({
  cols,
  rows,
  circle = true,
}: {
  cols: number;
  rows: number;
  circle?: boolean;
}) {
  return (
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="h-24 w-full bg-grey-100 border border-grey-200 rounded flex items-center justify-center">
            {circle ? (
              <div className="w-10 h-10 rounded-full bg-grey-200" />
            ) : (
              <div className="w-12 h-8 bg-grey-200 rounded" />
            )}
          </div>
          <div className="h-2 w-24 bg-grey-200 rounded" />
        </div>
      ))}
    </div>
  );
}

function MapBlock() {
  return (
    <div className="relative h-44 w-full border border-grey-300 rounded bg-grey-50 overflow-hidden">
      {/* Roads / contours */}
      <div className="absolute top-8 left-0 h-[2px] w-full bg-grey-200" />
      <div className="absolute top-24 left-0 h-[2px] w-4/5 bg-grey-200" />
      <div className="absolute top-0 left-1/3 h-full w-[2px] bg-grey-200" />
      <div className="absolute top-0 left-2/3 h-full w-[2px] bg-grey-200" />
      {/* Zone shading */}
      <div className="absolute top-10 left-10 w-20 h-14 bg-grey-200/70 rounded" />
      <div className="absolute top-20 right-14 w-24 h-12 bg-grey-300/60 rounded" />
      {/* Pin */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
        <div className="w-3 h-3 rounded-full bg-grey-500 border-2 border-white" />
      </div>
      {/* Legend */}
      <div className="absolute bottom-2 right-2 bg-white border border-grey-300 rounded px-2 py-1 flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 bg-grey-300 rounded-sm" />
        <div className="h-2 w-10 bg-grey-200 rounded" />
      </div>
    </div>
  );
}

function DiagramBlock() {
  return (
    <div className="relative h-40 w-full border border-grey-300 rounded bg-white overflow-hidden p-4">
      {/* House floor plan outline */}
      <div className="relative w-full h-full border-2 border-grey-400">
        <div className="absolute top-0 left-1/3 w-[2px] h-2/3 bg-grey-400" />
        <div className="absolute top-2/3 left-0 h-[2px] w-full bg-grey-400" />
        {/* Labels */}
        <div className="absolute top-2 left-2 h-2 w-10 bg-grey-200 rounded" />
        <div className="absolute top-2 right-2 h-2 w-12 bg-grey-200 rounded" />
        <div className="absolute bottom-2 left-2 h-2 w-14 bg-grey-200 rounded" />
        {/* X marks for infestation */}
        <div className="absolute top-8 left-10 w-4 h-4 flex items-center justify-center text-grey-500 text-xs">✕</div>
        <div className="absolute top-20 right-16 w-4 h-4 flex items-center justify-center text-grey-500 text-xs">✕</div>
      </div>
    </div>
  );
}

function SignatureBlock({ dual = true }: { dual?: boolean }) {
  return (
    <div className="mt-auto flex gap-8 pt-6 border-t border-grey-200">
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-px bg-grey-300 w-full mt-6" />
        <div className="h-2 w-20 bg-grey-200 rounded" />
      </div>
      {dual && (
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-px bg-grey-300 w-full mt-6" />
          <div className="h-2 w-16 bg-grey-200 rounded" />
        </div>
      )}
    </div>
  );
}

function TotalsRow({ count = 1 }: { count?: number }) {
  return (
    <div className="flex justify-end gap-8 mt-1">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2.5 w-16 bg-grey-300 rounded" />
          <div className="h-2.5 w-20 bg-grey-200 rounded" />
        </div>
      ))}
    </div>
  );
}

function StampBlock() {
  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 rounded-full border-2 border-grey-300 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border border-grey-200 flex items-center justify-center">
          <div className="h-2 w-8 bg-grey-200 rounded" />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-2 w-3/4 bg-grey-200 rounded" />
        <div className="h-2 w-1/2 bg-grey-100 rounded" />
      </div>
    </div>
  );
}

/**
 * Per-document skeleton layouts. Each documentId returns a visually distinct
 * layout. Falls back to a generic form layout for unknown IDs.
 */
function renderDocSkeleton(documentId: string, page: number): React.ReactNode {
  switch (documentId) {
    // ─── Sales Documentation ───────────────────────────────
    case "doc-ca-rpa":
      // Dense contract: numbered form rows with paragraph blocks
      return (
        <>
          <Heading widthPct={45} size="md" />
          <Paragraph lines={3} seed={page} />
          <Heading widthPct={35} size="sm" />
          {Array.from({ length: 3 + page }, (_, i) => (
            <FormRow key={i} labelPct={30 + (i * 8) % 20} />
          ))}
          <FormRow double />
          <FormRow double />
          <SignatureBlock dual />
        </>
      );

    case "doc-addendums":
      // Numbered addendum items
      return (
        <>
          <Heading widthPct={55} size="lg" />
          <Paragraph lines={2} seed={page + 3} />
          <NumberedList count={3 + page} seed={page} />
          <SignatureBlock />
        </>
      );

    case "doc-agency-disclosure":
      // Narrative-heavy acknowledgment + yes/no confirmations
      return (
        <>
          <Heading widthPct={60} size="md" />
          <Paragraph lines={4} seed={page + 1} />
          <Heading widthPct={30} size="sm" />
          <Paragraph lines={3} seed={page + 5} />
          <YNRows count={4} seed={page} />
          <SignatureBlock dual />
        </>
      );

    case "doc-seller-disclosure":
      // Long Y/N disclosure — the SPD look
      return (
        <>
          <Heading widthPct={65} size="lg" />
          <Paragraph lines={2} seed={page} />
          <Heading widthPct={28} size="sm" />
          <YNRows count={9 + page} seed={page} />
          <Heading widthPct={25} size="sm" />
          <YNRows count={5} seed={page + 7} />
          <SignatureBlock dual />
        </>
      );

    case "doc-tds":
      // Categorical Y/N sections: Roof, Foundation, etc.
      return (
        <>
          <Heading widthPct={55} size="md" />
          <Heading widthPct={20} size="sm" />
          <YNRows count={4} seed={page} />
          <Heading widthPct={24} size="sm" />
          <YNRows count={5} seed={page + 3} />
          <Heading widthPct={22} size="sm" />
          <YNRows count={4} seed={page + 6} />
          <SignatureBlock dual />
        </>
      );

    // ─── Disclosure Documentation ───────────────────────────
    case "doc-nhd":
      // Map + zone checkboxes
      return (
        <>
          <Heading widthPct={55} size="md" />
          <Paragraph lines={2} seed={page} />
          <MapBlock />
          <Heading widthPct={30} size="sm" />
          <YNRows count={6} seed={page + 2} />
          <SignatureBlock />
        </>
      );

    case "doc-lead-paint":
      // Certification-heavy with initial checkboxes
      return (
        <>
          <SkeletonHeader title="centered" />
          <Heading widthPct={50} size="sm" />
          <Paragraph lines={3} seed={page + 2} />
          <CheckRows count={4} seed={page} />
          <Heading widthPct={30} size="sm" />
          <Paragraph lines={2} seed={page + 4} />
          <SignatureBlock dual />
        </>
      );

    case "doc-fair-housing":
      // Paragraph-heavy advisory + bullet rights list
      return (
        <>
          <Heading widthPct={70} size="lg" />
          <Paragraph lines={5} seed={page + 1} />
          <Heading widthPct={35} size="sm" />
          <Bullets count={5} seed={page} />
          <Paragraph lines={2} seed={page + 7} />
          <SignatureBlock />
        </>
      );

    case "doc-home-inspection":
      // Inspection report: narrative + photos + bullet findings
      return (
        <>
          <SkeletonHeader title="report" />
          <Heading widthPct={45} size="md" />
          <Paragraph lines={3} seed={page} />
          <PhotoGrid cols={2} rows={1 + (page % 2)} />
          <Heading widthPct={30} size="sm" />
          <Bullets count={4 + (page % 2)} seed={page} />
        </>
      );

    case "doc-termite":
      // Floor-plan diagram + infestation table
      return (
        <>
          <Heading widthPct={55} size="md" />
          <Paragraph lines={2} seed={page} />
          <DiagramBlock />
          <Heading widthPct={30} size="sm" />
          <Table rows={4 + (page % 2)} cols={3} seed={page} />
          <StampBlock />
        </>
      );

    case "doc-home-warranty":
      // Coverage table + optional add-ons as checkboxes
      return (
        <>
          <Heading widthPct={50} size="md" />
          <Paragraph lines={2} seed={page} />
          <Heading widthPct={28} size="sm" />
          <Table rows={6 + (page % 2)} cols={4} seed={page} />
          <Heading widthPct={34} size="sm" />
          <CheckRows count={4} seed={page + 2} />
        </>
      );

    // ─── Title & Escrow ─────────────────────────────────────
    case "doc-prelim-title":
      // Big table with legal description block
      return (
        <>
          <Heading widthPct={60} size="md" />
          <Paragraph lines={2} seed={page} />
          <Heading widthPct={32} size="sm" />
          <Table rows={7 + (page % 2)} cols={4} seed={page} striped={false} />
          <Heading widthPct={30} size="sm" />
          <Paragraph lines={4} seed={page + 9} />
        </>
      );

    case "doc-escrow-instructions":
      // Numbered instructions
      return (
        <>
          <Heading widthPct={55} size="lg" />
          <Paragraph lines={2} seed={page} />
          <NumberedList count={4 + (page % 2)} seed={page + 3} />
          <SignatureBlock dual />
        </>
      );

    case "doc-wire-instructions":
      // Routing fields + warning paragraph + confirmation
      return (
        <>
          <Heading widthPct={55} size="md" />
          <div className="border-2 border-grey-300 rounded p-4 flex flex-col gap-3 bg-grey-50">
            <div className="h-2.5 w-24 bg-grey-300 rounded" />
            <Paragraph lines={2} seed={page} />
          </div>
          <Heading widthPct={30} size="sm" />
          <FormRow />
          <FormRow />
          <FormRow double />
          <FormRow />
          <FormRow double />
          <SignatureBlock />
        </>
      );

    // ─── Financing ──────────────────────────────────────────
    case "doc-loan-estimate":
      // 3-column financial summary
      return (
        <>
          <Heading widthPct={55} size="lg" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="h-2 w-16 bg-grey-200 rounded" />
                <div className="h-4 w-24 bg-grey-300 rounded" />
              </div>
            ))}
          </div>
          <Heading widthPct={30} size="sm" />
          <Table rows={5 + (page % 2)} cols={3} seed={page} />
          <TotalsRow count={2} />
          <Bullets count={2} seed={page + 2} />
        </>
      );

    case "doc-proof-of-funds":
      // Account header + transaction rows + balance
      return (
        <>
          <Heading widthPct={50} size="md" />
          <div className="border border-grey-300 rounded p-4 flex gap-6 bg-grey-50">
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-2 w-16 bg-grey-200 rounded" />
              <div className="h-3 w-32 bg-grey-300 rounded" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-2 w-20 bg-grey-200 rounded" />
              <div className="h-3 w-24 bg-grey-300 rounded" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-2 w-14 bg-grey-200 rounded" />
              <div className="h-3 w-28 bg-grey-300 rounded" />
            </div>
          </div>
          <Heading widthPct={28} size="sm" />
          <Table rows={6 + (page % 2)} cols={4} seed={page} />
          <TotalsRow count={1} />
        </>
      );

    case "doc-appraisal":
      // Property card + comparable sales + photos
      return (
        <>
          <SkeletonHeader title="report" />
          <div className="grid grid-cols-2 gap-4 border border-grey-300 rounded p-4 bg-grey-50">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="h-2 w-20 bg-grey-200 rounded" />
                <div className="h-2.5 w-32 bg-grey-300 rounded" />
              </div>
            ))}
          </div>
          <Heading widthPct={30} size="sm" />
          <Table rows={3 + (page % 2)} cols={4} seed={page} />
          <PhotoGrid cols={3} rows={1} circle={false} />
        </>
      );

    // ─── Commission & Compliance ───────────────────────────
    case "doc-commission-agreement":
      // Compact form + small split table
      return (
        <>
          <Heading widthPct={55} size="md" />
          <Paragraph lines={2} seed={page} />
          <FormRow double />
          <FormRow />
          <FormRow double />
          <Heading widthPct={28} size="sm" />
          <Table rows={3} cols={3} seed={page} />
          <TotalsRow count={1} />
          <SignatureBlock dual />
        </>
      );

    // ─── Fallback ──────────────────────────────────────────
    default:
      return (
        <>
          <Heading widthPct={40} size="md" />
          {Array.from({ length: 4 + page }, (_, i) => (
            <FormRow key={i} />
          ))}
          <Paragraph lines={3} seed={page} />
          <SignatureBlock />
        </>
      );
  }
}

/** Placeholder content for a single page, keyed to the document ID. */
function PagePlaceholder({ page, variant }: { page: number; variant: string }) {
  // Appraisal / Home inspection / Lead paint render their own header block.
  const customHeaderDocs = new Set([
    "doc-home-inspection",
    "doc-appraisal",
    "doc-lead-paint",
  ]);
  const showDefaultHeader = !customHeaderDocs.has(variant);

  return (
    <div className="p-10 flex flex-col gap-5" style={{ minHeight: PAGE_HEIGHT }}>
      {showDefaultHeader && <SkeletonHeader />}
      {renderDocSkeleton(variant, page)}
    </div>
  );
}
