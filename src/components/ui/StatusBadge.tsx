"use client";

import { WarningIcon, ChevronDown } from "../icons";

export type DocStatus = "Flagged" | "Pending" | "Complete" | "Required";

interface StatusBadgeProps {
  status: DocStatus;
}

const statusStyles: Record<DocStatus, string> = {
  Flagged: "bg-status-flagged-bg border-status-flagged-border",
  Pending: "bg-status-pending-bg border-status-pending-border",
  Complete: "bg-status-complete-bg border-status-complete-border",
  Required: "bg-status-required-bg border-status-required-border",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Required uses tighter padding to fit chevron; Flagged uses tighter horizontal
  // padding so the larger warning icon fits without widening the badge.
  const paddingClass =
    status === "Required"
      ? "px-1 gap-0.5"
      : status === "Flagged"
        ? "px-1.5 gap-1"
        : "px-2 gap-1";
  return (
    <span
      className={`flex items-center justify-center ${paddingClass} py-0.5 rounded-[5px] border text-sm font-medium w-[81px] shrink-0 text-grey-900 ${statusStyles[status]}`}
    >
      {status === "Flagged" && <WarningIcon className="w-5 h-5 text-red-400" />}
      {status}
      {status === "Required" && <ChevronDown className="w-4 h-4" />}
    </span>
  );
}
