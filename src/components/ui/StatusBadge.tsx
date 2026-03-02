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
  return (
    <span
      className={`flex items-center justify-center gap-1 px-3 py-1 rounded-md border text-sm font-medium w-[105px] shrink-0 text-grey-900 ${statusStyles[status]}`}
    >
      {status === "Flagged" && <WarningIcon className="w-4 h-4 text-red-400" />}
      {status}
      {status === "Required" && <ChevronDown className="w-4 h-4" />}
    </span>
  );
}
