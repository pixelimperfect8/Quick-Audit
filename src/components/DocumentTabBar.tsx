"use client";

import { CloseIcon, PlusIcon } from "./icons";
import type { DocumentTab } from "./documentTabs/types";

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
  return (
    <div className="bg-grey-100 border-b border-grey-300 h-10 shrink-0 flex items-center">
      {/* Scrollable tab list */}
      <div className="flex-1 flex items-stretch overflow-x-auto min-w-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              onClick={() => onTabSelect(tab.id)}
              className={`group relative flex items-center gap-1.5 px-3 shrink-0 max-w-[180px] text-sm transition-colors border-b-[3px] ${
                isActive
                  ? "bg-white text-grey-900 font-bold border-blue-800"
                  : "text-grey-800 font-medium border-transparent hover:bg-grey-200"
              }`}
              title={tab.label}
            >
              <span className="truncate">{tab.label}</span>

              {/* Close button */}
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
                className={`shrink-0 p-0.5 rounded-sm transition-colors ${
                  isActive
                    ? "text-grey-500 hover:text-grey-700 hover:bg-grey-200"
                    : "text-grey-400 hover:text-grey-700 hover:bg-grey-300 opacity-0 group-hover:opacity-100"
                }`}
                aria-label={`Close ${tab.label}`}
              >
                <CloseIcon className="w-3.5 h-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Add new tab button — always visible */}
      <button
        onClick={onNewTab}
        className="shrink-0 px-2.5 h-full flex items-center text-grey-600 hover:text-grey-900 transition-colors"
        aria-label="New tab"
        title="New tab"
      >
        <PlusIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
