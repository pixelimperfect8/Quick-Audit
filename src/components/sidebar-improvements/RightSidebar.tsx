"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import IconTabBar, { type IconTab } from "./IconTabBar";
import TransactionContent from "./TransactionContent";
import { WarningIcon, FormDataIcon, SendIcon } from "@/components/icons";
import { TextInput } from "@/components/ui";

interface RightSidebarProps {
  onContactClick: (contact: { type?: string }) => void;
  onViewLog: () => void;
}

function PlaceholderPanel({ icon: Icon, title, description }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <Icon className="w-10 h-10 text-grey-400 mb-3" />
      <h3 className="text-grey-900 text-base font-bold">{title}</h3>
      <p className="text-grey-500 text-sm mt-1">{description}</p>
    </div>
  );
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
      <p className="text-grey-700 text-sm font-medium leading-6">{comment.time}</p>
    </div>
  );
}

export default function RightSidebar({ onContactClick, onViewLog }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<IconTab>("transaction");
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

  // Clear badge when comments tab is opened
  function handleTabChange(tab: IconTab) {
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

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Scroll to bottom after render
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
      <IconTabBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        badges={{ comments: hasUnread }}
        hoverContent={{
          comments: latestComment ? (
            <div className="w-64 p-3 text-left">
              <p className="text-grey-900 text-sm font-bold">{latestComment.author}</p>
              <p className="text-grey-900 text-sm mt-1 line-clamp-2">{latestComment.text}</p>
              <p className="text-grey-700 text-xs mt-1">{latestComment.time}</p>
            </div>
          ) : undefined,
        }}
      />

      <div className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === "transaction" && (
          <TransactionContent
            onContactClick={onContactClick}
            onViewLog={onViewLog}
          />
        )}

        {activeTab === "comments" && (
          <div className="flex flex-col h-full">
            {/* Comments list */}
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

            {/* Leave a Comment */}
            <div className="border-t border-grey-300 px-6 pt-3 pb-3">
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

        {activeTab === "flags" && (
          <PlaceholderPanel
            icon={WarningIcon}
            title="Flags"
            description="Flagged items and review notes will appear here."
          />
        )}

        {activeTab === "formData" && (
          <PlaceholderPanel
            icon={FormDataIcon}
            title="Extracted Form Data"
            description="Data extracted from uploaded forms will appear here."
          />
        )}
      </div>
    </div>
  );
}
