"use client";

import { Button } from "./ui";
import { WarningIcon } from "./icons";

interface ActionBar2Props {
  onViewFlags?: () => void;
}

export default function ActionBar2({ onViewFlags }: ActionBar2Props) {
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
      <button
        onClick={onViewFlags}
        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
      >
        <WarningIcon className="w-5 h-5 text-orange-200" />
        <span className="text-orange-200 text-sm font-bold">
          <span className="hidden sm:inline">4 Issues Found</span>
          <span className="sm:hidden">4</span>
        </span>
      </button>
    </div>
  );
}
