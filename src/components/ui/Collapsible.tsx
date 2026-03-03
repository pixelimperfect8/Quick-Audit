"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "../icons";

interface CollapsibleProps {
  title: string;
  /** Optional icon rendered before the title */
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function Collapsible({ title, icon, defaultOpen = true, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-grey-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-grey-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-grey-700 text-base font-medium">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-grey-700" />
        ) : (
          <ChevronDown className="w-5 h-5 text-grey-700" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
