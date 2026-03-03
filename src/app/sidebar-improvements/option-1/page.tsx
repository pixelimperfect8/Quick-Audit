"use client";

import { useState, useCallback } from "react";
import Dashboard from "@/components/Dashboard";
import DesignSystemViewer from "@/components/DesignSystemViewer";
import RightSidebar from "@/components/sidebar-improvements/RightSidebar";
import type { IconTab } from "@/components/sidebar-improvements/IconTabBar";

export default function SidebarOption1Page() {
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [externalTab, setExternalTab] = useState<IconTab | null>(null);

  const handleFlagSelect = useCallback((id: string) => {
    setSelectedFlagId(id);
    // Also switch to flags tab when a flag is selected from the document
    setExternalTab("flags");
  }, []);

  const handleViewFlags = useCallback(() => {
    setExternalTab("flags");
  }, []);

  const handleExternalTabHandled = useCallback(() => {
    setExternalTab(null);
  }, []);

  return (
    <>
      <Dashboard
        backHref="/sidebar-improvements"
        backLabel="Sidebar Improvements"
        documentViewerProps={{
          selectedFlagId,
          onFlagSelect: handleFlagSelect,
          showFlags: true,
        }}
        actionBarProps={{
          onViewFlags: handleViewFlags,
        }}
        rightSidebarContent={({ onContactClick, onViewLog }) => (
          <RightSidebar
            onContactClick={onContactClick}
            onViewLog={onViewLog}
            selectedFlagId={selectedFlagId}
            onFlagSelect={setSelectedFlagId}
            externalActiveTab={externalTab}
            onExternalTabHandled={handleExternalTabHandled}
          />
        )}
      />
      <DesignSystemViewer />
    </>
  );
}
