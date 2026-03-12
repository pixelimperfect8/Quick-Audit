"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CloseIcon, UndoIcon } from "@/components/icons";

interface FlagCardProps {
  children: React.ReactNode;
  /** Red border when selected, grey when not */
  selected?: boolean;
  /** Issue has been dismissed — strikethrough text, muted background */
  rejected?: boolean;
  /** Dismiss / undo callback */
  onReject?: () => void;
  /** Click to select this card */
  onSelect?: () => void;
  /** Optional collapsible "Sources" content */
  sources?: React.ReactNode;
}

export default function FlagCard({
  children,
  selected = false,
  rejected = false,
  onReject,
  onSelect,
  sources,
}: FlagCardProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={`rounded-lg p-4 cursor-pointer transition-colors ${
        rejected
          ? "bg-grey-50 border border-grey-300"
          : selected
            ? "border border-red-400"
            : "border border-grey-300"
      }`}
    >
      {/* Top row: description + dismiss/undo button */}
      <div className="flex items-start justify-between gap-3">
        <div className={`text-grey-800 text-base font-medium leading-6 flex-1 min-w-0 ${rejected ? "line-through" : ""}`}>
          {children}
        </div>
        {onReject && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject();
            }}
            className="w-8 h-8 flex items-center justify-center rounded shrink-0 transition-colors text-grey-800 hover:bg-grey-100 hover:text-grey-900"
            aria-label={rejected ? "Undo dismiss" : "Dismiss issue"}
          >
            {rejected ? (
              <UndoIcon className="w-4 h-4" />
            ) : (
              <CloseIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Sources toggle + content (only when sources provided) */}
      {sources && (
        <>
          <div className="mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSourcesOpen(!sourcesOpen);
              }}
              className="flex items-center gap-2 text-grey-800 text-base font-medium hover:text-grey-900 transition-colors"
            >
              Sources
              {sourcesOpen ? (
                <ChevronUp className="w-[18px] h-[18px]" />
              ) : (
                <ChevronDown className="w-[18px] h-[18px]" />
              )}
            </button>
          </div>

          {sourcesOpen && (
            <div className="mt-4 bg-grey-100 rounded-lg py-2">
              {sources}
            </div>
          )}
        </>
      )}
    </div>
  );
}
