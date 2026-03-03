"use client";

import { Button } from "./ui";
import { WarningIcon } from "./icons";

interface ActionBarProps {
  onViewFlags?: () => void;
}

export default function ActionBar({ onViewFlags }: ActionBarProps) {
  return (
    <div className="bg-white border-t border-grey-300 px-4 py-2.5 flex items-center justify-between gap-4 shrink-0">
      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="primary" size="sm">
          Accept
        </Button>
        <Button variant="danger" size="sm">
          Reject
        </Button>
      </div>

      {/* Issues */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <WarningIcon className="w-5 h-5 text-orange-200" />
          <span className="text-orange-200 text-sm font-bold">
            <span className="hidden sm:inline">4 Issues Found</span>
            <span className="sm:hidden">4</span>
          </span>
        </div>
        <button
          onClick={onViewFlags}
          className="text-grey-900 text-sm font-bold hover:text-blue-800 transition-colors hidden sm:block"
        >
          View
        </button>
      </div>
    </div>
  );
}
