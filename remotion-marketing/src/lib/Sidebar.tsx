import React from "react";

/* ----------------------------------------------------------------- */
/*  Sidebar shell — header + icon tab bar + content area              */
/* ----------------------------------------------------------------- */

export const SidebarShell: React.FC<{
  activeTab?: "transaction" | "flags" | "comments" | "formData";
  flagCount?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ activeTab = "transaction", flagCount = 4, children, footer }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top: file header */}
      <div className="px-4 py-3 border-b border-grey-300 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-grey-700 text-sm font-medium">File</span>
          <span className="text-grey-400">/</span>
          <span className="text-grey-900 text-sm font-bold truncate">
            CAR_RPA_456Oak.pdf
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-yellow-200 text-grey-900">
            Pending
          </span>
          <span className="text-grey-700 text-sm">3969 Harvord Boulevard</span>
        </div>
      </div>

      {/* Icon tab bar */}
      <div className="flex border-b border-grey-300 px-2 shrink-0">
        <TabIcon
          icon="transaction"
          label="Transaction"
          active={activeTab === "transaction"}
        />
        <TabIcon icon="flags" label="Flags" active={activeTab === "flags"} count={flagCount} />
        <TabIcon icon="formData" label="All Data" active={activeTab === "formData"} />
        <TabIcon icon="comments" label="Comments" active={activeTab === "comments"} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {footer && <div className="shrink-0">{footer}</div>}
    </div>
  );
};

const TabIcon: React.FC<{
  icon: "transaction" | "flags" | "formData" | "comments";
  label: string;
  active?: boolean;
  count?: number;
}> = ({ icon, label, active, count }) => {
  return (
    <div
      className={`relative flex items-center justify-center px-4 py-3 ${
        active ? "border-b-2 border-blue-800" : ""
      }`}
    >
      <span className={active ? "text-blue-800" : "text-grey-600"}>
        {icon === "transaction" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {icon === "flags" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 3v18M5 4h12l-2 4 2 4H5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        )}
        {icon === "formData" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
        {icon === "comments" && (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4V5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {count !== undefined && (
        <span
          className={`absolute top-1.5 right-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-bold ${
            active ? "bg-blue-800 text-white" : "bg-red-400 text-white"
          }`}
        >
          {count}
        </span>
      )}
    </div>
  );
};
