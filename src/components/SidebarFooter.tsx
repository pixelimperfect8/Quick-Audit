"use client";

import { SettingsIcon } from "./icons";

export default function SidebarFooter() {
  return (
    <div className="bg-white border-t border-grey-300 px-4 flex items-center gap-2 shrink-0 h-[57px]">
      <SettingsIcon className="w-5 h-5 text-grey-700" />
      <span className="text-grey-700 text-sm font-medium">Settings</span>
    </div>
  );
}
