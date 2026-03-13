"use client";

import { useState, useRef, useEffect } from "react";
import DrawerHeader from "@/components/ui/DrawerHeader";
import { SendIcon } from "@/components/icons";
import type { Comment } from "./commentsData";

interface CommentsDrawerProps {
  itemName: string;
  comments: Comment[];
  onSend: (text: string) => void;
  onClose: () => void;
}

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

export default function CommentsDrawer({
  itemName,
  comments,
  onSend,
  onClose,
}: CommentsDrawerProps) {
  const [inputText, setInputText] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new comment
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  function handleSend() {
    const text = inputText.trim();
    if (!text) return;
    onSend(text);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <DrawerHeader title={itemName} onClose={onClose} />

      {/* Comments list */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-grey-800 text-sm">No comments yet</p>
          </div>
        ) : (
          comments.map((comment, i) => (
            <div key={comment.id}>
              <div className="px-2">
                <CommentItem comment={comment} />
              </div>
              {i < comments.length - 1 && (
                <div className="mx-6 border-b border-grey-300" />
              )}
            </div>
          ))
        )}
        <div ref={commentsEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-grey-300 p-3 shrink-0">
        <div className="flex items-end gap-1 border border-grey-300 rounded-lg focus-within:border-blue-800 transition-colors">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              handleInput();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Leave a comment..."
            rows={1}
            className="flex-1 text-base font-medium text-grey-900 placeholder:text-grey-600 outline-none resize-none bg-transparent px-3 py-2 leading-6"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`p-2 mr-1 mb-0.5 rounded-full transition-colors ${
              inputText.trim() ? "text-blue-800 hover:bg-grey-200" : "text-grey-400"
            }`}
            aria-label="Send comment"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
