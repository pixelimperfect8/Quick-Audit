"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface TruncatedTextProps {
  children: string;
  /** HTML element to render — defaults to "span" */
  as?: "span" | "h3" | "p";
  className?: string;
}

/**
 * Renders text with `truncate` and shows a portal-based dark tooltip
 * on hover when the text is actually overflowing.
 */
export default function TruncatedText({
  children,
  as: Tag = "span",
  className = "",
}: TruncatedTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const checkTruncation = useCallback(() => {
    const el = textRef.current;
    if (el) setIsTruncated(el.scrollWidth > el.clientWidth);
  }, []);

  useEffect(() => {
    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [checkTruncation]);

  const handleMouseEnter = useCallback(() => {
    if (!isTruncated || !textRef.current) return;
    const rect = textRef.current.getBoundingClientRect();
    setTooltipPos({ x: rect.left, y: rect.bottom + 4 });
  }, [isTruncated]);

  return (
    <>
      <Tag
        ref={
          textRef as React.RefObject<
            HTMLElement & HTMLHeadingElement & HTMLSpanElement & HTMLParagraphElement
          >
        }
        className={`truncate ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setTooltipPos(null)}
      >
        {children}
      </Tag>
      {tooltipPos &&
        createPortal(
          <div
            className="fixed z-[9999] px-3 py-1.5 rounded-lg bg-grey-900 text-white text-sm font-medium shadow-lg whitespace-nowrap pointer-events-none"
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}
