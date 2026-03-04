"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { IconButton } from "./ui";
import { ChevronDown, DownloadIcon, PrintIcon, DoubleArrowRight, ZoomInIcon, ZoomOutIcon } from "./icons";
import { FLAG_ISSUES } from "./sidebar-improvements/flagsData";
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
}

export default function DocumentViewer({
  selectedFlagId,
  onFlagSelect,
  showFlags = false,
  rejectedFlagIds,
  document: documentProp,
}: DocumentViewerProps) {
  // Resolve document: undefined → default, null → empty state
  const doc = documentProp === undefined ? DOCUMENT_REGISTRY[0] : documentProp;
  const totalPages = doc?.pageCount ?? 5;

  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const flagRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
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
      <div className="bg-grey-100 border-b border-grey-300 px-3 py-2 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-grey-900 text-sm font-medium whitespace-nowrap">
            Page {currentPage}
          </span>
          <ChevronDown className="w-4 h-4 text-grey-700 shrink-0" />
        </div>

        <p className="text-grey-900 text-sm font-medium truncate hidden sm:block">
          {doc.shortName}
        </p>

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

            return (
              <div
                key={pageNum}
                ref={(el) => {
                  if (el) pageRefs.current.set(pageNum, el);
                }}
                className="relative bg-white shadow-lg rounded-sm w-full max-w-[612px] overflow-hidden"
                style={{ minHeight: PAGE_HEIGHT }}
              >
                {/* Page content — wrapper clips the PDF's native scrollbar */}
                {pageNum === 1 ? (
                  <div className="overflow-hidden w-full" style={{ height: PAGE_HEIGHT }}>
                    <object
                      data={`${doc.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&page=1`}
                      type="application/pdf"
                      className="rounded-sm pointer-events-none"
                      style={{ width: "calc(100% + 20px)", height: PAGE_HEIGHT }}
                    >
                      <p className="p-8 text-grey-800 text-sm text-center">
                        Unable to display PDF.{" "}
                        <a href={doc.pdfUrl} className="text-blue-800 underline">Download</a>
                      </p>
                    </object>
                  </div>
                ) : (
                  <PagePlaceholder page={pageNum} />
                )}

                {/* Flag highlight overlays for this page */}
                {pageFlags.map((flag) => {
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
                      className={`absolute rounded transition-colors cursor-pointer ${
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

/** Placeholder content for pages 2-5 that looks like a real form */
function PagePlaceholder({ page }: { page: number }) {
  return (
    <div className="p-10 flex flex-col gap-5" style={{ minHeight: PAGE_HEIGHT }}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <div className="h-3 w-48 bg-grey-200 rounded" />
          <div className="h-2 w-32 bg-grey-100 rounded" />
        </div>
        <div className="h-3 w-20 bg-grey-200 rounded" />
      </div>

      <div className="h-px bg-grey-200 w-full" />

      {/* Section title */}
      <div className="h-3.5 w-56 bg-grey-300 rounded" />

      {/* Form rows */}
      {Array.from({ length: 6 + page }, (_, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-2.5 w-36 bg-grey-200 rounded" />
          <div className="h-8 w-full border border-grey-200 rounded" />
        </div>
      ))}

      {/* Paragraph block */}
      <div className="flex flex-col gap-1.5 mt-2">
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-full bg-grey-100 rounded" />
        <div className="h-2 w-4/5 bg-grey-100 rounded" />
      </div>

      {/* More form rows */}
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

      {/* Checkbox rows */}
      <div className="flex flex-col gap-3 mt-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={`c-${i}`} className="flex items-center gap-3">
            <div className="w-4 h-4 border border-grey-300 rounded-sm shrink-0" />
            <div className="h-2 bg-grey-100 rounded" style={{ width: `${55 + (i * 12) % 40}%` }} />
          </div>
        ))}
      </div>

      {/* Signature area */}
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
    </div>
  );
}
