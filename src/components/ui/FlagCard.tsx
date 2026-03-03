"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ThumbUp, ThumbDown, ThumbUpOutline, ThumbDownOutline } from "@/components/icons";

interface FlagCardProps {
  children: React.ReactNode;
  /** Purple border when selected, grey when not */
  selected?: boolean;
  /** Issue has been rejected/dismissed — strikethrough text, muted background */
  rejected?: boolean;
  /** Thumbs-down callback */
  onReject?: () => void;
  /** Thumbs-up callback */
  onAccept?: () => void;
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
  onAccept,
  onSelect,
  sources,
}: FlagCardProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const hasActions = onReject || onAccept;

  return (
    <div
      onClick={onSelect}
      className={`rounded-lg p-4 cursor-pointer transition-colors ${
        rejected
          ? "bg-grey-50 border border-grey-300"
          : selected
            ? "border border-purple-600"
            : "border border-grey-300"
      }`}
    >
      {/* When no sources: single row with text + actions inline */}
      {!sources ? (
        <div className="flex items-center justify-between gap-4">
          <div className={`text-grey-800 text-base font-medium leading-6 flex-1 min-w-0 ${rejected ? "line-through" : ""}`}>
            {children}
          </div>
          {hasActions && (
            <div className="flex items-center gap-2 shrink-0">
              {onReject && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject();
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                    rejected
                      ? "bg-grey-200 text-grey-800"
                      : "bg-grey-100 text-grey-800 hover:bg-grey-200"
                  }`}
                  aria-label="Reject issue"
                >
                  {rejected ? (
                    <ThumbDown className="w-[19px] h-[19px]" />
                  ) : (
                    <ThumbDownOutline className="w-[19px] h-[19px]" />
                  )}
                </button>
              )}
              {onAccept && !rejected && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAccept();
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded bg-grey-100 text-grey-800 hover:bg-grey-200 transition-colors"
                  aria-label="Accept issue"
                >
                  <ThumbUpOutline className="w-[19px] h-[19px]" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Content */}
          <div className={`text-grey-800 text-base font-medium leading-6 ${rejected ? "line-through" : ""}`}>
            {children}
          </div>

          {/* Bottom row: Sources toggle + action buttons */}
          <div className="flex items-end justify-between mt-4">
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

            {hasActions && (
              <div className="flex items-center gap-2">
                {onReject && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject();
                    }}
                    className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                      rejected
                        ? "bg-grey-200 text-grey-800"
                        : "bg-grey-100 text-grey-800 hover:bg-grey-200"
                    }`}
                    aria-label="Reject issue"
                  >
                    {rejected ? (
                      <ThumbDown className="w-[19px] h-[19px]" />
                    ) : (
                      <ThumbDownOutline className="w-[19px] h-[19px]" />
                    )}
                  </button>
                )}
                {onAccept && !rejected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAccept();
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded bg-grey-100 text-grey-800 hover:bg-grey-200 transition-colors"
                    aria-label="Accept issue"
                  >
                    <ThumbUpOutline className="w-[19px] h-[19px]" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Expanded sources content */}
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
