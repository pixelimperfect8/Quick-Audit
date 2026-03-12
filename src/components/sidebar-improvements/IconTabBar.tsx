"use client";

import { DescriptionIcon, CommentIcon, WarningIcon, FormDataIcon, MoreVert } from "@/components/icons";
import { HoverCard, Tooltip } from "@/components/ui";

export type IconTab = "transaction" | "comments" | "flags" | "formData";

interface IconTabBarProps {
  activeTab: IconTab;
  onTabChange: (tab: IconTab) => void;
  badges?: Partial<Record<IconTab, boolean>>;
  hoverContent?: Partial<Record<IconTab, React.ReactNode>>;
}

const tabs: { id: IconTab; icon: typeof DescriptionIcon; label: string }[] = [
  { id: "transaction", icon: DescriptionIcon, label: "Transaction" },
  { id: "comments", icon: CommentIcon, label: "Comments" },
  { id: "flags", icon: WarningIcon, label: "Flags" },
  { id: "formData", icon: FormDataIcon, label: "All Data" },
];

export default function IconTabBar({ activeTab, onTabChange, badges = {}, hoverContent = {} }: IconTabBarProps) {
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
            >
              {content ? (
                <HoverCard trigger={iconElement} side="bottom" align="center">
                  {content}
                </HoverCard>
              ) : (
                <Tooltip label={tab.label}>{iconElement}</Tooltip>
              )}
            </button>
          );
        })}
      </div>
      <Tooltip label="More options">
        <button
          className="px-3 py-3 text-grey-700 hover:text-grey-900 transition-colors"
          aria-label="More options"
        >
          <MoreVert className="w-[18px] h-[18px]" />
        </button>
      </Tooltip>
    </div>
  );
}
