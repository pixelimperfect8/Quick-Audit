"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "../icons";

interface CollapsibleProps {
  title: string;
  /** Optional icon rendered before the title */
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  /**
   * Optional content rendered in the header row, to the left of the chevron.
   * Clicks inside this slot don't toggle the collapsible.
   */
  headerRight?: React.ReactNode;
}

export default function Collapsible({
  title,
  icon,
  defaultOpen = true,
  children,
  headerRight,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-grey-300">
      <div className="w-full flex items-center gap-2 px-4 py-3 hover:bg-grey-50 transition-colors">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
        >
          {icon}
          <h3 className="text-grey-800 text-base font-medium">{title}</h3>
        </button>
        {headerRight && (
          <div
            className="shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {headerRight}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="shrink-0"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-grey-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-grey-700" />
          )}
        </button>
      </div>
      {isOpen && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
