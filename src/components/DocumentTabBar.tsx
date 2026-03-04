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
    <div className="bg-grey-200 shrink-0 flex items-center gap-2 px-3 py-1.5">
      {/* Scrollable tab list */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto min-w-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              onClick={() => onTabSelect(tab.id)}
              className={`group relative flex items-center gap-2 shrink-0 max-w-[200px] h-10 px-6 text-base transition-colors rounded-lg ${
                isActive
                  ? "bg-white text-grey-900 font-medium shadow-sm"
                  : "text-grey-900 font-medium hover:bg-white/50"
              }`}
              title={tab.label}
            >
              <span className="truncate leading-6">{tab.label}</span>

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
                    ? "text-grey-800 hover:text-grey-900"
                    : "text-grey-800 opacity-0 group-hover:opacity-100"
                }`}
                aria-label={`Close ${tab.label}`}
              >
                <CloseIcon className="w-[10px] h-[10px]" />
              </span>
            </button>
          );
        })}
      </div>

      {/* Add new tab button — white rounded square */}
      <button
        onClick={onNewTab}
        className="shrink-0 w-[30px] h-[30px] flex items-center justify-center bg-white rounded text-grey-800 hover:text-grey-900 transition-colors"
        aria-label="New tab"
        title="New tab"
      >
        <PlusIcon className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
}
