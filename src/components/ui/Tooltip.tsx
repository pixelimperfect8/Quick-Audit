"use client";

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

type Side = "top" | "bottom";

interface TooltipProps {
  /** Text label to display */
  label: string;
  /** Preferred side — defaults to "bottom" */
  side?: Side;
  children: React.ReactNode;
}

/**
 * Wraps any element and shows a styled dark-pill tooltip on hover.
 * Uses a portal so the tooltip escapes any overflow container.
 */
export default function Tooltip({
  label,
  side = "bottom",
  children,
}: TooltipProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const handleEnter = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = side === "top" ? rect.top - 4 : rect.bottom + 4;
    setPos({ x, y });
  }, [side]);

  return (
    <div
      ref={wrapperRef}
      className="inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos &&
        createPortal(
          <div
            className="fixed z-[9999] px-3 py-1.5 rounded-lg bg-grey-900 text-white text-sm font-medium shadow-lg whitespace-nowrap pointer-events-none"
            style={{
              left: pos.x,
              top: pos.y,
              transform: side === "top"
                ? "translate(-50%, -100%)"
                : "translateX(-50%)",
            }}
          >
            {label}
          </div>,
          document.body,
        )}
    </div>
  );
}
