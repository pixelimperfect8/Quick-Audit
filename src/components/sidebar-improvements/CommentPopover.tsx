"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { SendIcon } from "@/components/icons";
import type { Comment } from "./commentsData";

interface CommentPopoverProps {
  comments: Comment[];
  onSend: (text: string) => void;
  onViewAll: () => void;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export default function CommentPopover({
  comments,
  onSend,
  onViewAll,
  onClose,
  anchorEl,
}: CommentPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState("");
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Position the popover next to the anchor
  useEffect(() => {
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();
    const popoverWidth = 300;
    const popoverHeight = 260;

    let top = rect.bottom + 6;
    let left = rect.left - popoverWidth / 2 + rect.width / 2;

    // Keep within viewport
    if (left < 8) left = 8;
    if (left + popoverWidth > window.innerWidth - 8) left = window.innerWidth - popoverWidth - 8;
    if (top + popoverHeight > window.innerHeight - 8) {
      top = rect.top - popoverHeight - 6;
    }

    setPos({ top, left });
  }, [anchorEl]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, anchorEl]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    onSend(text);
    setInputText("");
  }, [inputText, onSend]);

  if (!pos) return null;

  const latest = comments[comments.length - 1];

  return createPortal(
    <div
      ref={popoverRef}
      style={{ top: pos.top, left: pos.left }}
      className="fixed z-[9999] w-[300px] bg-white rounded-lg shadow-lg border border-grey-300 flex flex-col animate-in fade-in slide-in-from-top-1 duration-150"
    >
      {/* Latest comment */}
      <div className="px-4 pt-3 pb-2 flex-1 min-h-0">
        {latest ? (
          <div className="flex flex-col gap-1">
            <p className="text-grey-900 text-sm font-bold leading-5">{latest.author}</p>
            <p className="text-grey-900 text-sm font-medium leading-5 line-clamp-3">{latest.text}</p>
            <p className="text-grey-800 text-xs font-medium">{latest.time}</p>
          </div>
        ) : (
          <p className="text-grey-800 text-sm">No comments yet</p>
        )}
      </div>

      {/* Reply input */}
      <div className="px-3 pb-2">
        <div className="flex items-end gap-1 border border-grey-300 rounded-lg focus-within:border-blue-800 transition-colors">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Reply..."
            rows={1}
            className="flex-1 text-sm font-medium text-grey-900 placeholder:text-grey-600 outline-none resize-none bg-transparent px-3 py-2 leading-5"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-1.5 mr-1 mb-1 rounded-full transition-colors ${
              inputText.trim() ? "text-blue-800 hover:bg-grey-100" : "text-grey-400"
            }`}
            aria-label="Send reply"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* View all link */}
      {comments.length > 0 && (
        <button
          onClick={() => {
            onViewAll();
          }}
          className="border-t border-grey-200 px-4 py-2.5 text-blue-800 text-sm font-bold hover:bg-grey-50 transition-colors text-left"
        >
          View all {comments.length} comment{comments.length !== 1 ? "s" : ""}
        </button>
      )}
    </div>,
    document.body,
  );
}
