"use client";

import { useLayoutEffect, useRef, useState } from "react";

interface TabsProps<T extends string> {
  items: readonly T[];
  activeItem: T;
  onTabChange: (item: T) => void;
  variant?: "underline" | "pill";
  height?: string;
  renderExtra?: (tab: T) => React.ReactNode;
}

export default function Tabs<T extends string>({
  items,
  activeItem,
  onTabChange,
  variant = "underline",
  height = "h-[45px]",
  renderExtra,
}: TabsProps<T>) {
  if (variant === "pill") {
    return <PillTabs items={items} activeItem={activeItem} onTabChange={onTabChange} height={height} />;
  }

  // underline variant
  return (
    <div className={`flex border-b border-grey-300 shrink-0 sticky top-0 z-10 bg-white ${height}`}>
      {items.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 text-base font-medium text-center transition-colors flex items-center justify-center gap-1 ${
            activeItem === tab
              ? "text-blue-800 border-b-2 border-blue-800 font-bold"
              : "text-grey-700 hover:text-grey-900"
          }`}
        >
          {tab}
          {renderExtra?.(tab)}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pill variant — animated sliding indicator                          */
/* ------------------------------------------------------------------ */

function PillTabs<T extends string>({
  items,
  activeItem,
  onTabChange,
  height,
}: {
  items: readonly T[];
  activeItem: T;
  onTabChange: (item: T) => void;
  height: string;
}) {
  const btnRefs = useRef<Map<T, HTMLButtonElement | null>>(new Map());
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const el = btnRefs.current.get(activeItem);
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeItem, items.length]);

  return (
    <div
      className={`relative inline-flex items-center p-[2px] bg-grey-50 border border-grey-300 rounded-lg ${height}`}
    >
      {indicator && (
        <div
          aria-hidden
          className="absolute top-[2px] bottom-[2px] bg-white border-[0.5px] border-grey-300 rounded-md transition-[left,width] duration-200 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {items.map((tab) => {
        const isActive = activeItem === tab;
        return (
          <button
            key={tab}
            ref={(el) => {
              btnRefs.current.set(tab, el);
            }}
            onClick={() => onTabChange(tab)}
            className={`relative z-10 h-full px-4 lg:px-6 text-sm lg:text-base rounded-md transition-colors ${
              isActive
                ? "text-blue-800 font-bold"
                : "text-grey-800 font-medium hover:text-grey-900"
            }`}
          >
            <span className="grid">
              <span className="col-start-1 row-start-1 invisible font-bold" aria-hidden>
                {tab}
              </span>
              <span className="col-start-1 row-start-1">{tab}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
