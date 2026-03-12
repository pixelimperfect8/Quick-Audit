"use client";

import { CloseIcon } from "@/components/icons";
import TruncatedText from "./TruncatedText";

interface FileCardProps {
  name: string;
  date?: string;
  /** Highlight with blue border (e.g. selected/active file) */
  active?: boolean;
  onRemove?: () => void;
}

export default function FileCard({ name, date, active = false, onRemove }: FileCardProps) {
  return (
    <div
      className={`bg-white rounded-lg flex items-center gap-4 sm:gap-6 py-4 pl-4 pr-3 ${
        active ? "border border-blue-800" : "border border-grey-300"
      }`}
    >
      <TruncatedText as="p" className="flex-1 min-w-0 text-grey-900 text-base font-medium leading-6">
        {name}
      </TruncatedText>
      <div className="flex items-center gap-3 shrink-0">
        {date && (
          <span className="text-grey-900 text-sm font-medium hidden sm:block">
            {date}
          </span>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="text-grey-500 hover:text-grey-700 transition-colors"
            aria-label={`Remove ${name}`}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
