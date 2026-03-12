"use client";

import { useState, useCallback } from "react";
import Dashboard from "@/components/Dashboard";
import DesignSystemViewer from "@/components/DesignSystemViewer";
import RightSidebar from "@/components/sidebar-improvements/RightSidebar";
import { DEFAULT_SECTIONS } from "@/components/DocumentChecklist";
import type { IconTab } from "@/components/sidebar-improvements/IconTabBar";

export default function SidebarOption1Page() {
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [selectedFormField, setSelectedFormField] = useState<string | null>(null);
  const [externalTab, setExternalTab] = useState<IconTab | null>(null);
  const [rejectedFlagIds, setRejectedFlagIds] = useState<Set<string>>(new Set());
  const [tieredCommission, setTieredCommission] = useState(false);

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
          showFormHighlights: true,
          selectedFormField,
          onFormFieldSelect: setSelectedFormField,
        }}
        actionBarProps={{
          onViewFlags: handleViewFlags,
        }}
        topNavToggles={[
          {
            label: "Tiered Commission",
            checked: tieredCommission,
            onChange: setTieredCommission,
          },
        ]}
        rightSidebarContent={({ onContactClick, onViewLog, onLoadDocument }) => (
          <RightSidebar
            onContactClick={onContactClick}
            onViewLog={onViewLog}
            selectedFlagId={selectedFlagId}
            onFlagSelect={setSelectedFlagId}
            externalActiveTab={externalTab}
            onExternalTabHandled={handleExternalTabHandled}
            rejectedFlagIds={rejectedFlagIds}
            onFlagReject={handleFlagReject}
            tieredCommission={tieredCommission}
            onFormFieldSelect={setSelectedFormField}
            onLoadDocument={onLoadDocument}
            checklistSections={DEFAULT_SECTIONS}
          />
        )}
      />
      <DesignSystemViewer />
    </>
  );
}
