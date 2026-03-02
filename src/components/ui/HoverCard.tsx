"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

interface HoverCardProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  side?: "top" | "bottom";
  className?: string;
  /** Use a portal to escape overflow containers (default: true) */
  portal?: boolean;
}

export default function HoverCard({
  trigger,
  children,
  align = "center",
  side = "bottom",
  className = "",
  portal = true,
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const clearTimers = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const handleEnter = useCallback(() => {
    clearTimers();
    showTimer.current = setTimeout(() => setOpen(true), 150);
  }, [clearTimers]);

  const handleLeave = useCallback(() => {
    clearTimers();
    hideTimer.current = setTimeout(() => setOpen(false), 100);
  }, [clearTimers]);

  // Position the portal card relative to the trigger
  useEffect(() => {
    if (!open || !portal || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top: number;
    let left: number;

    if (side === "top") {
      top = rect.top + window.scrollY - 8; // mb-2 gap
    } else {
      top = rect.bottom + window.scrollY + 8; // mt-2 gap
    }

    if (align === "left") {
      left = rect.left + window.scrollX;
    } else if (align === "right") {
      left = rect.right + window.scrollX;
    } else {
      left = rect.left + window.scrollX + rect.width / 2;
    }

    setPos({ top, left });
  }, [open, portal, side, align]);

  // Adjust for top-side: move card up by its own height once rendered
  useEffect(() => {
    if (!open || !portal || side !== "top" || !cardRef.current || !pos) return;
    const cardHeight = cardRef.current.offsetHeight;
    setPos((prev) => prev ? { ...prev, top: prev.top - cardHeight } : prev);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, portal, side, pos?.left]);

  const alignTransform =
    align === "left"
      ? ""
      : align === "right"
        ? "translateX(-100%)"
        : "translateX(-50%)";

  // Non-portal fallback (for DesignSystemViewer demos, etc.)
  if (!portal) {
    const alignClass =
      align === "left"
        ? "left-0"
        : align === "right"
          ? "right-0"
          : "left-1/2 -translate-x-1/2";

    const sideClass = side === "top" ? "bottom-full mb-2" : "top-full mt-2";

    return (
      <div
        className="relative"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {trigger}
        <div
          className={`absolute ${sideClass} ${alignClass} z-50 bg-white border border-grey-300 rounded-lg shadow-lg transition-all duration-150 ${
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : side === "top"
                ? "opacity-0 translate-y-1 pointer-events-none"
                : "opacity-0 -translate-y-1 pointer-events-none"
          } ${className}`}
        >
          {children}
        </div>
      </div>
    );
  }

  // Portal version — renders the card to document.body
  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {trigger}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            ref={cardRef}
            className={`fixed z-50 bg-white border border-grey-300 rounded-lg shadow-lg transition-all duration-150 ${
              open
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            } ${className}`}
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              transform: alignTransform,
            }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            {children}
          </div>,
          document.body
        )}
    </div>
  );
}
