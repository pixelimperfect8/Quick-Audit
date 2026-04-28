import React from "react";

/**
 * Wraps a composition in a soft background + a centered "card" containing
 * the demo UI. Keeps every GIF visually consistent.
 */
export const Stage: React.FC<{
  /** Optional copy on the left half */
  title?: string;
  subtitle?: string;
  /** UI to demo — will be placed on the right half (or full width if no title) */
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => {
  return (
    <div
      style={{ background: "linear-gradient(135deg, #F4F8FC 0%, #DEE5ED 100%)" }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {title ? (
        <div className="flex w-full h-full items-center px-24 gap-16">
          <div className="flex-1 max-w-[760px]">
            <h1 className="text-grey-900 text-[88px] font-bold leading-[1.05] tracking-tight mb-6">
              {title}
            </h1>
            {subtitle && (
              <p className="text-grey-800 text-[32px] leading-[1.4] font-medium">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center min-w-0">
            {children}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

/** Polished card surface with shadow + rounded corners. */
export const Card: React.FC<{
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ width, height, children }) => {
  return (
    <div
      style={{
        width,
        height,
        background: "#ffffff",
        borderRadius: 16,
        boxShadow:
          "0 20px 60px rgba(10,38,66,0.18), 0 8px 24px rgba(10,38,66,0.10)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};
