"use client";

import { useState } from "react";
import { ArrowBack, ChevronLeft, ChevronRight, ChevronDown, MenuIcon, MoreVert } from "./icons";
import { Tabs, TruncatedText } from "./ui";

const headerTabs = ["Listings", "Transactions", "Both"] as const;

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleDetails: () => void;
  sidebarOpen: boolean;
  detailsOpen: boolean;
}

export default function Header({
  onToggleSidebar,
  onToggleDetails,
}: HeaderProps) {
  const [activeTab, setActiveTab] = useState<(typeof headerTabs)[number]>("Both");

  return (
    <header className="bg-white border-b border-grey-300 px-3 py-2.5 flex items-center justify-between gap-2 shrink-0 z-20">
      {/* Left side */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden shrink-0 p-1 text-grey-700 hover:text-grey-900 rounded"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="w-6 h-6" />
        </button>

        <button className="shrink-0 text-grey-700 hover:text-grey-900 hidden sm:block">
          <ArrowBack className="w-6 h-6" />
        </button>

        <div className="flex items-center border border-grey-300 rounded-lg overflow-hidden min-w-0">
          <button className="bg-grey-50 border-r border-grey-300 h-10 px-2 hover:bg-grey-200 shrink-0 hidden sm:flex items-center">
            <ChevronLeft className="w-5 h-5 text-grey-700" />
          </button>
          <div className="flex items-center gap-2 h-10 px-3 sm:px-4 min-w-0 flex-1 sm:w-[280px] lg:w-[331px]">
            <TruncatedText as="p" className="text-grey-900 text-sm sm:text-base leading-6">
              456 Oak Avenue, Sacramento, CA 95816
            </TruncatedText>
            <ChevronDown className="w-5 h-5 text-grey-700 shrink-0" />
          </div>
          <button className="bg-grey-50 border-l border-grey-300 h-10 px-2 hover:bg-grey-200 shrink-0 hidden sm:flex items-center">
            <ChevronRight className="w-5 h-5 text-grey-700" />
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Tab selector - hidden on small screens */}
        <div className="hidden md:flex items-center">
          <Tabs
            items={headerTabs}
            activeItem={activeTab}
            onTabChange={setActiveTab}
            variant="pill"
            height="h-10"
          />
        </div>

        {/* Stage selector */}
        <div className="hidden sm:flex items-center gap-2 border border-grey-300 rounded-lg h-10 pl-4 pr-2 bg-white">
          <span className="text-grey-900 text-sm lg:text-base font-medium whitespace-nowrap">Stage 1</span>
          <ChevronDown className="w-5 h-5 text-grey-700" />
        </div>

        {/* Update Agent button */}
        <button className="flex items-center gap-2 lg:gap-4 h-10 lg:h-12 pl-4 lg:pl-6 pr-2 lg:pr-3 border border-purple-600 rounded-full bg-white hover:bg-grey-50 transition-colors">
          <span className="text-blue-800 text-sm lg:text-base font-bold whitespace-nowrap">Update Agent</span>
          <div className="bg-grey-100 rounded-full w-6 h-6 flex items-center justify-center">
            <ChevronDown className="w-4 h-4 text-grey-700" />
          </div>
        </button>

        {/* Mobile details toggle */}
        <button
          onClick={onToggleDetails}
          className="xl:hidden shrink-0 p-1 text-grey-700 hover:text-grey-900 rounded"
          aria-label="Toggle details"
        >
          <MoreVert className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
