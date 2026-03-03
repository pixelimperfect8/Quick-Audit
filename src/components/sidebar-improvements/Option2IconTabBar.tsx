"use client";

import { DescriptionIcon, CommentIcon, FormDataIcon, MoreVert } from "@/components/icons";
import { HoverCard } from "@/components/ui";

export type Option2IconTab = "transaction" | "comments" | "formData";

interface Option2IconTabBarProps {
  activeTab: Option2IconTab;
  onTabChange: (tab: Option2IconTab) => void;
  badges?: Partial<Record<Option2IconTab, boolean>>;
  hoverContent?: Partial<Record<Option2IconTab, React.ReactNode>>;
}

const tabs: { id: Option2IconTab; icon: typeof DescriptionIcon; label: string }[] = [
  { id: "transaction", icon: DescriptionIcon, label: "Transaction" },
  { id: "comments", icon: CommentIcon, label: "Comments" },
  { id: "formData", icon: FormDataIcon, label: "Form Data" },
];

export default function Option2IconTabBar({ activeTab, onTabChange, badges = {}, hoverContent = {} }: Option2IconTabBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-grey-300 flex items-center">
      <div className="flex flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const content = hoverContent[tab.id];

          const iconElement = (
            <span className="relative">
              <Icon className="w-5 h-5" />
              {badges[tab.id] && (
                <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-red-400 rounded-full" />
              )}
            </span>
          );

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center py-3 border-b-2 transition-colors ${
                isActive
                  ? "border-blue-800 text-blue-800"
                  : "border-transparent text-grey-800 hover:text-grey-900"
              }`}
              aria-label={tab.label}
              title={content ? undefined : tab.label}
            >
              {content ? (
                <HoverCard trigger={iconElement} side="bottom" align="center">
                  {content}
                </HoverCard>
              ) : (
                iconElement
              )}
            </button>
          );
        })}
      </div>
      <button
        className="px-3 py-3 text-grey-700 hover:text-grey-900 transition-colors"
        aria-label="More options"
        title="More options"
      >
        <MoreVert className="w-[18px] h-[18px]" />
      </button>
    </div>
  );
}
