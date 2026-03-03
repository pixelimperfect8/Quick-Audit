"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Option2IconTabBar, { type Option2IconTab } from "./Option2IconTabBar";
import Option2TransactionContent from "./Option2TransactionContent";
import { FLAG_ISSUES, type FlagIssue, type FlagSource } from "./flagsData";
import { WarningIcon, SendIcon } from "@/components/icons";
import FormDataContent from "./FormDataContent";
import { TextInput, FlagCard } from "@/components/ui";

interface Option2RightSidebarProps {
  onContactClick: (contact: { type?: string }) => void;
  onViewLog: () => void;
  selectedFlagId?: string | null;
  onFlagSelect?: (id: string) => void;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
  isNew: boolean;
}

const INITIAL_COMMENTS: Comment[] = [
  { id: 1, author: "Rob Smith", text: "The seller missed checkboxes for yes/no on page 4 of the seller disclosure for XYZ question. Please work with them to fill the form out correctly and re-upload to SkySlope. Thanks!", time: "May 25, 2024 at 9:18am", isNew: false },
  { id: 2, author: "Kristen Turner", text: "Sending out for signature again.", time: "1 day ago", isNew: false },
  { id: 3, author: "Kristen Turner", text: "Ready for review.", time: "1 min ago", isNew: true },
];

function CommentItem({ comment }: { comment: Comment }) {
  const [highlighted, setHighlighted] = useState(comment.isNew);

  useEffect(() => {
    if (!comment.isNew) return;
    const timer = setTimeout(() => setHighlighted(false), 3000);
    return () => clearTimeout(timer);
  }, [comment.isNew]);

  return (
    <div
      className={`rounded-lg p-4 flex flex-col gap-3 transition-colors duration-700 ${
        highlighted ? "bg-grey-100" : "bg-transparent"
      }`}
    >
      <p className="text-grey-900 text-base font-bold leading-6">{comment.author}</p>
      <p className="text-grey-900 text-base font-medium leading-6">{comment.text}</p>
      <p className="text-grey-800 text-sm font-medium leading-6">{comment.time}</p>
    </div>
  );
}

/** Group issues by page number */
function groupByPage(issues: FlagIssue[]): Map<number, FlagIssue[]> {
  const groups = new Map<number, FlagIssue[]>();
  for (const issue of issues) {
    const existing = groups.get(issue.page) || [];
    existing.push(issue);
    groups.set(issue.page, existing);
  }
  return groups;
}

/** Render structured sources in the Figma style */
function SourcesList({ sources }: { sources: FlagSource[] }) {
  return (
    <>
      {sources.map((src) => (
        <div key={src.label} className="px-4 py-2">
          <p className="text-grey-900 text-base font-bold leading-6">{src.label}:</p>
          <p className="text-grey-800 text-base font-medium leading-6">{src.value}</p>
        </div>
      ))}
    </>
  );
}

function FlagsPanel({
  selectedFlagId,
  onFlagSelect,
}: {
  selectedFlagId?: string | null;
  onFlagSelect?: (id: string) => void;
}) {
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedFlagId && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedFlagId]);

  const pageGroups = groupByPage(FLAG_ISSUES);

  function handleReject(id: string) {
    setRejectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6 pt-4 pb-6">
      {Array.from(pageGroups.entries()).map(([page, issues]) => (
        <div key={page} className="flex flex-col gap-4">
          <p className="text-grey-800 text-base font-medium leading-6 px-4">
            Page {page}
          </p>
          <div className="flex flex-col gap-4 px-2">
            {issues.map((issue) => {
              const isRejected = rejectedIds.has(issue.id);
              return (
                <div
                  key={issue.id}
                  ref={issue.id === selectedFlagId ? selectedRef : undefined}
                >
                  <FlagCard
                    selected={issue.id === selectedFlagId}
                    rejected={isRejected}
                    onSelect={() => onFlagSelect?.(issue.id)}
                    onReject={() => handleReject(issue.id)}
                    onAccept={isRejected ? undefined : () => {}}
                    sources={
                      issue.sources ? (
                        <SourcesList sources={issue.sources} />
                      ) : undefined
                    }
                  >
                    {issue.description}
                  </FlagCard>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Draggable Split Pane                                               */
/* ------------------------------------------------------------------ */

function SplitPane({
  top,
  bottom,
  topLabel,
  bottomLabel,
}: {
  top: React.ReactNode;
  bottom: React.ReactNode;
  topLabel?: string;
  bottomLabel?: string;
}) {
  const [splitPercent, setSplitPercent] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const percent = (y / rect.height) * 100;
      setSplitPercent(Math.min(80, Math.max(20, percent)));
    }

    function handleMouseUp() {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      {/* Top pane */}
      <div
        className="overflow-y-auto min-h-0"
        style={{ height: `${splitPercent}%` }}
      >
        {top}
      </div>

      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className="shrink-0 flex items-center justify-center cursor-row-resize group border-y border-grey-300 bg-grey-50 hover:bg-grey-100 transition-colors"
        style={{ height: "10px" }}
      >
        <div className="flex gap-1">
          <span className="w-1 h-1 rounded-full bg-grey-400 group-hover:bg-grey-600 transition-colors" />
          <span className="w-1 h-1 rounded-full bg-grey-400 group-hover:bg-grey-600 transition-colors" />
          <span className="w-1 h-1 rounded-full bg-grey-400 group-hover:bg-grey-600 transition-colors" />
        </div>
      </div>

      {/* Bottom pane */}
      <div
        className="overflow-y-auto min-h-0 flex-1"
      >
        {/* Bottom section header */}
        {bottomLabel && (
          <div className="sticky top-0 z-[5] bg-white border-b border-grey-200 px-4 py-2 flex items-center gap-2">
            <WarningIcon className="w-4 h-4 text-red-500" />
            <span className="text-grey-900 text-sm font-bold">{bottomLabel}</span>
            <span className="text-grey-600 text-xs ml-auto">{FLAG_ISSUES.length} issues</span>
          </div>
        )}
        {bottom}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main sidebar component                                             */
/* ------------------------------------------------------------------ */

export default function Option2RightSidebar({
  onContactClick,
  onViewLog,
  selectedFlagId,
  onFlagSelect,
}: Option2RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<Option2IconTab>("transaction");
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [hasUnread, setHasUnread] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(4);

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  function handleTabChange(tab: Option2IconTab) {
    setActiveTab(tab);
    if (tab === "comments") {
      setHasUnread(false);
    }
  }

  function handleSend() {
    const text = commentText.trim();
    if (!text) return;

    const newComment: Comment = {
      id: nextIdRef.current++,
      author: "You",
      text,
      time: "Just now",
      isNew: true,
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const latestComment = comments[comments.length - 1];

  return (
    <div className="flex flex-col h-full bg-white">
      <Option2IconTabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        badges={{ comments: hasUnread }}
        hoverContent={{
          comments: latestComment ? (
            <div className="w-64 p-3 text-left">
              <p className="text-grey-900 text-sm font-bold">{latestComment.author}</p>
              <p className="text-grey-900 text-sm mt-1 line-clamp-2">{latestComment.text}</p>
              <p className="text-grey-800 text-xs mt-1">{latestComment.time}</p>
            </div>
          ) : undefined,
        }}
      />

      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "transaction" && (
          <SplitPane
            top={
              <Option2TransactionContent
                onContactClick={onContactClick}
                onViewLog={onViewLog}
              />
            }
            bottom={
              <FlagsPanel
                selectedFlagId={selectedFlagId}
                onFlagSelect={onFlagSelect}
              />
            }
            bottomLabel="Issues"
          />
        )}

        {activeTab === "comments" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0 overflow-y-auto">
              {comments.map((comment, i) => (
                <div key={comment.id}>
                  <div className="px-2">
                    <CommentItem comment={comment} />
                  </div>
                  {i < comments.length - 1 && (
                    <div className="mx-6 border-b border-grey-300" />
                  )}
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>

            <div className="border-t border-grey-300 p-3">
              <TextInput
                ref={textareaRef}
                value={commentText}
                onChange={(e) => {
                  setCommentText(e.target.value);
                  handleInput();
                }}
                onKeyDown={handleKeyDown}
                placeholder="Leave a comment..."
                action={
                  <button
                    onClick={handleSend}
                    className={`p-2 mr-1 mb-0.5 rounded-full transition-colors ${
                      commentText.trim()
                        ? "text-blue-800 hover:bg-grey-200"
                        : "text-grey-400"
                    }`}
                    disabled={!commentText.trim()}
                    aria-label="Send comment"
                  >
                    <SendIcon className="w-5 h-5" />
                  </button>
                }
              />
            </div>
          </div>
        )}

        {activeTab === "formData" && (
          <div className="overflow-y-auto h-full">
            <FormDataContent />
          </div>
        )}
      </div>
    </div>
  );
}
