"use client";

import { ThumbUp, ThumbDown, WarningIcon } from "./icons";

export default function ActionBar() {
  return (
    <div className="bg-white border-t border-grey-300 px-4 py-2.5 flex items-center justify-between gap-4 shrink-0">
      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="flex items-center gap-1.5 sm:gap-2 bg-[#328755] hover:bg-[#2a7349] text-white px-3 sm:px-5 py-2 rounded-full text-sm font-bold transition-colors">
          Accept
          <ThumbUp className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-1.5 sm:gap-2 bg-[#D20004] hover:bg-[#b80003] text-white px-3 sm:px-5 py-2 rounded-full text-sm font-bold transition-colors">
          Reject
          <ThumbDown className="w-4 h-4" />
        </button>
      </div>

      {/* Issues */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <WarningIcon className="w-5 h-5 text-[#FA4515]" />
          <span className="text-[#FA4515] text-sm font-bold">
            <span className="hidden sm:inline">4 Issues Found</span>
            <span className="sm:hidden">4</span>
          </span>
        </div>
        <button className="text-grey-900 text-sm font-bold hover:text-blue-800 transition-colors hidden sm:block">
          View
        </button>
      </div>
    </div>
  );
}
