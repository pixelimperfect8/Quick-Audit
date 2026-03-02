"use client";

interface TabsProps<T extends string> {
  items: readonly T[];
  activeItem: T;
  onTabChange: (item: T) => void;
  variant?: "underline" | "pill";
  height?: string;
  renderExtra?: (tab: T) => React.ReactNode;
}

export default function Tabs<T extends string>({
  items,
  activeItem,
  onTabChange,
  variant = "underline",
  height = "h-[45px]",
  renderExtra,
}: TabsProps<T>) {
  if (variant === "pill") {
    return (
      <div className="flex">
        {items.map((tab, i) => {
          const isFirst = i === 0;
          const isLast = i === items.length - 1;
          const isActive = activeItem === tab;

          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`${height} px-4 lg:px-6 text-sm lg:text-base border border-grey-300 transition-colors ${
                isFirst
                  ? "rounded-l-lg border-r-0"
                  : isLast
                  ? "rounded-r-lg border-l-0"
                  : "border-x-0 border-t border-b"
              } ${
                isActive
                  ? "bg-white text-blue-800 font-bold"
                  : "bg-grey-50 text-grey-800 font-medium hover:bg-grey-100"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    );
  }

  // underline variant
  return (
    <div className={`flex border-b border-grey-300 shrink-0 sticky top-0 z-10 bg-white ${height}`}>
      {items.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 text-base font-medium text-center transition-colors flex items-center justify-center gap-1 ${
            activeItem === tab
              ? "text-blue-800 border-b-2 border-blue-800 font-bold"
              : "text-grey-700 hover:text-grey-900"
          }`}
        >
          {tab}
          {renderExtra?.(tab)}
        </button>
      ))}
    </div>
  );
}
