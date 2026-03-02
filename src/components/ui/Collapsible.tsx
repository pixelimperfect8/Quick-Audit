"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "../icons";

interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function Collapsible({ title, defaultOpen = true, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-grey-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-grey-50 transition-colors"
      >
        <h3 className="text-grey-700 text-base font-medium">{title}</h3>
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
