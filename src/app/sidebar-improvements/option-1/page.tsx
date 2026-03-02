"use client";

import Dashboard from "@/components/Dashboard";
import DesignSystemViewer from "@/components/DesignSystemViewer";
import RightSidebar from "@/components/sidebar-improvements/RightSidebar";

export default function SidebarOption1Page() {
  return (
    <>
      <Dashboard
        backHref="/sidebar-improvements"
        backLabel="Sidebar Improvements"
        rightSidebarContent={({ onContactClick, onViewLog }) => (
          <RightSidebar onContactClick={onContactClick} onViewLog={onViewLog} />
        )}
      />
      <DesignSystemViewer />
    </>
  );
}
