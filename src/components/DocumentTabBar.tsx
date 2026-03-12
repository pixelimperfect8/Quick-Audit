"use client";

import { useRef, useState, useEffect } from "react";
import { CloseIcon, PlusIcon } from "./icons";
import { TruncatedText, Tooltip } from "./ui";
import type { DocumentTab } from "./documentTabs/types";

/** Minimum width of a single tab including internal padding + close icon */
const MIN_TAB_WIDTH = 140;
/** Gap between tabs in px */
const TAB_GAP = 20;
/** Size of the + button */
const PLUS_BTN_SIZE = 30;
/** Horizontal padding of the tab row */
const ROW_PX = 15;

interface DocumentTabBarProps {
  tabs: DocumentTab[];
  activeTabId: string;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
}

export default function DocumentTabBar({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
}: DocumentTabBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxTabs, setMaxTabs] = useState(Infinity);

  // Calculate max tabs based on container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const availableWidth =
          entry.contentRect.width - ROW_PX * 2 - PLUS_BTN_SIZE - 5;
        const count = Math.max(
          1,
          Math.floor((availableWidth + TAB_GAP) / (MIN_TAB_WIDTH + TAB_GAP)),
        );
        setMaxTabs(count);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isMaxReached = tabs.length >= maxTabs;
  const isSingleTab = tabs.length === 1;

  return (
    <div ref={containerRef} className="bg-grey-200 shrink-0">
      {/* Tab row — items aligned to bottom so active tab connects to bar */}
      <div className="flex items-end px-[15px] pt-[7px]">
        {/* Tabs */}
        <div className="flex items-end gap-5 min-w-0">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;

            return (
              <button
                key={tab.id}
                onClick={() => onTabSelect(tab.id)}
                className={`group relative flex items-center gap-4 shrink-0 max-w-[220px] h-10 text-base transition-colors ${
                  isActive
                    ? `bg-white text-grey-900 font-medium rounded-t-lg z-[1] ${isSingleTab ? "px-6" : "pl-6 pr-[13px]"}`
                    : "text-grey-900 font-medium rounded-lg pl-6 pr-[13px] mb-1 hover:bg-white/50"
                }`}
              >
                <TruncatedText className="leading-6">{tab.label}</TruncatedText>

                {/* Close button — hidden on the last remaining tab */}
                {!isSingleTab && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTabClose(tab.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onTabClose(tab.id);
                      }
                    }}
                    className="shrink-0 p-0.5 rounded-sm transition-colors text-grey-800 hover:text-grey-900"
                    aria-label={`Close ${tab.label}`}
                  >
                    <CloseIcon className="w-[18px] h-[18px]" />
                  </span>
                )}

                {/* Outward border radius curves — Chrome tab style */}
                {isActive && (
                  <>
                    <svg
                      className="absolute -left-[10px] bottom-0 w-[10px] h-[10px] pointer-events-none"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path d="M10 0 Q10 10 0 10 L10 10 Z" fill="white" />
                    </svg>
                    <svg
                      className="absolute -right-[10px] bottom-0 w-[10px] h-[10px] pointer-events-none"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path d="M0 0 Q0 10 10 10 L0 10 Z" fill="white" />
                    </svg>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Add new tab button — gap matches bottom margin */}
        <Tooltip label={isMaxReached ? "You've reached the maximum amount of open tabs." : "New tab"}>
          <button
            onClick={isMaxReached ? undefined : onNewTab}
            disabled={isMaxReached}
            className={`shrink-0 w-[30px] h-[30px] ml-[5px] mb-[5px] flex items-center justify-center rounded transition-colors ${
              isMaxReached
                ? "bg-grey-300 text-grey-800 cursor-not-allowed opacity-50"
                : "bg-white text-grey-800 hover:text-grey-900"
            }`}
            aria-label="New tab"
          >
            <PlusIcon className="w-[18px] h-[18px]" />
          </button>
        </Tooltip>
      </div>

      {/* Bottom bar connecting active tab to content */}
      <div className="h-1 bg-white" />
    </div>
  );
}
