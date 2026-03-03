"use client";

import { useState, useCallback } from "react";
import Dashboard from "@/components/Dashboard";
import DesignSystemViewer from "@/components/DesignSystemViewer";
import Option2RightSidebar from "@/components/sidebar-improvements/Option2RightSidebar";

export default function SidebarOption2Page() {
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [rejectedFlagIds, setRejectedFlagIds] = useState<Set<string>>(new Set());

  const handleFlagSelect = useCallback((id: string) => {
    setSelectedFlagId(id);
  }, []);

  const handleViewFlags = useCallback(() => {
    // In Option 2, flags are always visible in the split pane — no tab switch needed
  }, []);

  const handleFlagReject = useCallback((id: string) => {
    setRejectedFlagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
          rejectedFlagIds,
        }}
        actionBarProps={{
          onViewFlags: handleViewFlags,
        }}
        rightSidebarContent={({ onContactClick, onViewLog }) => (
          <Option2RightSidebar
            onContactClick={onContactClick}
            onViewLog={onViewLog}
            selectedFlagId={selectedFlagId}
            onFlagSelect={setSelectedFlagId}
            rejectedFlagIds={rejectedFlagIds}
            onFlagReject={handleFlagReject}
          />
        )}
      />
      <DesignSystemViewer />
    </>
  );
}
