import React from "react";

/* ----------------------------------------------------------------- */
/*  Atomic UI primitives — simplified mirrors of /src/components/ui  */
/* ----------------------------------------------------------------- */

export const Badge: React.FC<{
  variant?: "warning" | "success" | "info" | "default" | "danger";
  children: React.ReactNode;
}> = ({ variant = "default", children }) => {
  const styles: Record<string, string> = {
    warning: "bg-yellow-200 text-grey-900",
    success: "bg-green-50 text-green-600",
    info: "bg-[#0059DA]/10 text-blue-800",
    default: "bg-grey-200 text-grey-800",
    danger: "bg-[#fdd0d0] text-red-500",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

export const Collapsible: React.FC<{
  title: string;
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}> = ({ title, children, rightAction }) => {
  return (
    <div className="border-b border-grey-200 px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="#0A2642" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="text-grey-900 text-base font-bold leading-6">{title}</h3>
        </div>
        {rightAction}
      </div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

export const DetailRow: React.FC<{
  label: string;
  value?: string;
  highlighted?: boolean;
  flagged?: boolean;
  isLink?: boolean;
  showDragHandle?: boolean;
  showEyeToggle?: "visible" | "hidden";
  showRemoveBtn?: boolean;
  rowBg?: string;
  trailing?: React.ReactNode;
}> = ({
  label,
  value,
  highlighted,
  flagged,
  isLink,
  showDragHandle,
  showEyeToggle,
  showRemoveBtn,
  rowBg,
  trailing,
}) => {
  const flaggedMark = flagged ? "rounded-sm bg-[#fdd0d0]/70 px-0.5 -mx-0.5" : "";
  const valueColor = isLink ? "text-blue-800 underline" : "text-grey-900";
  return (
    <div
      className={`flex items-center rounded transition-colors ${
        highlighted ? "bg-grey-100" : ""
      }`}
      style={rowBg ? { background: rowBg } : undefined}
    >
      {showDragHandle && (
        <span className="mr-2 text-grey-500 cursor-grab">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </span>
      )}
      <span className="text-grey-900 text-base font-bold w-[140px] shrink-0 leading-6">
        <span className={flaggedMark}>{label}</span>
      </span>
      <span className={`${valueColor} text-base font-medium leading-6 break-words min-w-0 flex-1`}>
        <span className={flaggedMark}>{value}</span>
      </span>
      {trailing}
      {showEyeToggle && (
        <span className="ml-2 text-grey-600">
          {showEyeToggle === "visible" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3l18 18M10.6 6.1A11 11 0 0 1 22 12s-1.4 2.8-4.1 4.9M6 6.5C3.4 8.5 2 12 2 12s3.5 7 10 7c1.6 0 3-.3 4.3-.7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      )}
    </div>
  );
};
