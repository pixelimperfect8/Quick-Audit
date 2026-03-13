"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import Dashboard from "@/components/Dashboard";
import DesignSystemViewer from "@/components/DesignSystemViewer";
import RightSidebar from "@/components/sidebar-improvements/RightSidebar";
import type { IconTab } from "@/components/sidebar-improvements/IconTabBar";
import { FLAG_ISSUES } from "@/components/sidebar-improvements/flagsData";
import { INITIAL_COMMENTS_BY_ITEM, type Comment } from "@/components/sidebar-improvements/commentsData";

const CHECKLIST_SECTIONS = [
  {
    title: "Sales Documentation",
    documents: [
      {
        number: 1,
        name: "California Residential Purchase Agreement",
        status: "Flagged" as const,
        files: [
          { name: "CAR_RPA_456Oak.pdf", date: "2 days ago" },
        ],
      },
      { number: 2, name: "Addendums", status: "Complete" as const },
      { number: 3, name: "Agency Disclosure", status: "Complete" as const },
      { number: 4, name: "Seller Property Disclosure", status: "Flagged" as const },
      { number: 5, name: "Transfer Disclosure Statement", status: "Pending" as const },
    ],
  },
  {
    title: "Disclosure Documentation",
    documents: [
      { number: 6, name: "Natural Hazard Disclosure", status: "Complete" as const },
      { number: 7, name: "Lead Based Paint", status: "Complete" as const },
      { number: 8, name: "Fair Housing Advisory", status: "Complete" as const },
      { number: 9, name: "Home Inspection Report", status: "Pending" as const },
      { number: 10, name: "Termite Inspection Report", status: "Required" as const },
      { number: 11, name: "Home Warranty", status: "Pending" as const },
    ],
  },
  {
    title: "Title & Escrow",
    documents: [
      { number: 12, name: "Preliminary Title Report", status: "Complete" as const },
      { number: 13, name: "Escrow Instructions", status: "Pending" as const },
      { number: 14, name: "Wire Transfer Instructions", status: "Required" as const },
    ],
  },
  {
    title: "Financing",
    documents: [
      { number: 15, name: "Loan Estimate", status: "Complete" as const },
      { number: 16, name: "Proof of Funds", status: "Pending" as const },
      { number: 17, name: "Appraisal Report", status: "Required" as const },
    ],
  },
  {
    title: "Commission & Compliance",
    documents: [
      { number: 18, name: "Commission Agreement", status: "Complete" as const },
    ],
  },
];

export default function SmartAssistOption1Page() {
  const [selectedFlagId, setSelectedFlagId] = useState<string | null>(null);
  const [selectedFormField, setSelectedFormField] = useState<string | null>(null);
  const [externalTab, setExternalTab] = useState<IconTab | null>(null);
  const [rejectedFlagIds, setRejectedFlagIds] = useState<Set<string>>(new Set());
  const [tieredCommission, setTieredCommission] = useState(false);
  const [overlaysHidden, setOverlaysHidden] = useState(false);
  const [pinnedFields, setPinnedFields] = useState<Set<string>>(new Set());

  // ─── Per-item comments ─────────────────────────────────────
  const [commentsByItem, setCommentsByItem] = useState<Record<string, Comment[]>>(
    INITIAL_COMMENTS_BY_ITEM,
  );
  const [activeCommentPopover, setActiveCommentPopover] = useState<string | null>(null);
  const [commentsDrawerItem, setCommentsDrawerItem] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextCommentId = useRef(100);

  const commentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const [key, comments] of Object.entries(commentsByItem)) {
      counts[key] = comments.length;
    }
    return counts;
  }, [commentsByItem]);

  const handleCommentIconClick = useCallback((itemName: string) => {
    setActiveCommentPopover((prev) => (prev === itemName ? null : itemName));
  }, []);

  const handleSendComment = useCallback((itemName: string, text: string) => {
    const newComment: Comment = {
      id: nextCommentId.current++,
      author: "You",
      text,
      time: "Just now",
      isNew: true,
    };
    setCommentsByItem((prev) => ({
      ...prev,
      [itemName]: [...(prev[itemName] || []), newComment],
    }));
  }, []);

  const handleOpenCommentsDrawer = useCallback((itemName: string) => {
    setActiveCommentPopover(null);
    setCommentsDrawerItem(itemName);
    // Animate in
    drawerTimeoutRef.current = setTimeout(() => setDrawerVisible(true), 10);
  }, []);

  const handleCloseCommentsDrawer = useCallback(() => {
    setDrawerVisible(false);
    setTimeout(() => setCommentsDrawerItem(null), 250);
  }, []);

  const handleFlagSelect = useCallback((id: string) => {
    setSelectedFlagId(id);
    setSelectedFormField(null);
    setExternalTab("flags");
    setOverlaysHidden(false);
  }, []);

  const handleFormFieldSelect = useCallback((label: string) => {
    // Check if this form field is covered by a flag — if so, select the flag instead
    const matchingFlag = FLAG_ISSUES.find((f) =>
      f.formFieldLabels?.includes(label)
    );
    if (matchingFlag) {
      setSelectedFlagId(matchingFlag.id);
      setSelectedFormField(null);
      setExternalTab("flags");
    } else {
      setSelectedFormField(label);
      setSelectedFlagId(null);
      setExternalTab("formData");
    }
    setOverlaysHidden(false);
  }, []);

  const handleViewFlags = useCallback(() => {
    setExternalTab("flags");
  }, []);

  const handleExternalTabHandled = useCallback(() => {
    setExternalTab(null);
  }, []);

  const handleTogglePin = useCallback((label: string) => {
    setPinnedFields((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
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
        backHref="/smart-assist-enhancements"
        backLabel="Smart Assist Enhancements"
        checklistSections={CHECKLIST_SECTIONS}
        checklistCommentProps={{
          commentCounts,
          activeCommentItem: activeCommentPopover,
          onCommentIconClick: handleCommentIconClick,
          activeCommentPopoverComments: activeCommentPopover
            ? commentsByItem[activeCommentPopover] ?? []
            : [],
          onSendComment: handleSendComment,
          onOpenCommentsDrawer: handleOpenCommentsDrawer,
        }}
        commentsDrawer={
          commentsDrawerItem
            ? {
                open: drawerVisible,
                itemName: commentsDrawerItem,
                comments: commentsByItem[commentsDrawerItem] ?? [],
                onSend: (text: string) => handleSendComment(commentsDrawerItem, text),
                onClose: handleCloseCommentsDrawer,
              }
            : null
        }
        documentViewerProps={{
          selectedFlagId,
          onFlagSelect: handleFlagSelect,
          showFlags: true,
          rejectedFlagIds,
          showFormHighlights: true,
          selectedFormField,
          onFormFieldSelect: handleFormFieldSelect,
          overlaysHidden,
          onToggleOverlays: () => setOverlaysHidden((h) => !h),
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
            onFlagSelect={handleFlagSelect}
            externalActiveTab={externalTab}
            onExternalTabHandled={handleExternalTabHandled}
            rejectedFlagIds={rejectedFlagIds}
            onFlagReject={handleFlagReject}
            tieredCommission={tieredCommission}
            selectedFormField={selectedFormField}
            onFormFieldSelect={handleFormFieldSelect}
            onLoadDocument={onLoadDocument}
            checklistSections={CHECKLIST_SECTIONS}
            pinnedFields={pinnedFields}
            onTogglePin={handleTogglePin}
          />
        )}
      />
      <DesignSystemViewer />
    </>
  );
}
