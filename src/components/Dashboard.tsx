"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "@/components/Header";
import DocumentChecklist from "@/components/DocumentChecklist";
import DocumentViewer from "@/components/DocumentViewer";
import DocumentTabBar from "@/components/DocumentTabBar";
import TransactionDetails from "@/components/TransactionDetails";
import LenderDetail from "@/components/LenderDetail";
import ContactDetail from "@/components/ContactDetail";
import ActivityLog from "@/components/ActivityLog";
import ActionBar from "@/components/ActionBar";
import SidebarFooter from "@/components/SidebarFooter";
import { Overlay, Sidebar } from "@/components/ui";
import TopNav from "@/components/TopNav";
import type { DocumentTab } from "@/components/documentTabs/types";
import { DOCUMENT_REGISTRY } from "@/components/documentTabs/types";
import CommentsDrawer from "@/components/sidebar-improvements/CommentsDrawer";
import type { Comment } from "@/components/sidebar-improvements/commentsData";

type RightPanel = "transaction" | "lender" | "contact" | "log";

interface SelectedContact {
  name: string;
  role: string;
  type?: string;
}

interface ToggleDef {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface DashboardProps {
  backHref?: string;
  backLabel?: string;
  rightSidebarContent?: (props: {
    onContactClick: (contact: { name?: string; role?: string; type?: string }) => void;
    onViewLog: () => void;
    onLoadDocument: (documentId: string) => void;
  }) => React.ReactNode;
  /** Props passed through to DocumentViewer */
  documentViewerProps?: {
    selectedFlagId?: string | null;
    onFlagSelect?: (id: string) => void;
    showFlags?: boolean;
    rejectedFlagIds?: Set<string>;
    showFormHighlights?: boolean;
    selectedFormField?: string | null;
    onFormFieldSelect?: (label: string) => void;
    overlaysHidden?: boolean;
    onToggleOverlays?: () => void;
  };
  /** Props passed through to ActionBar */
  actionBarProps?: {
    onViewFlags?: () => void;
  };
  /** Toggles shown in the top nav bar */
  topNavToggles?: ToggleDef[];
  /** Custom checklist sections for the left sidebar */
  checklistSections?: Parameters<typeof DocumentChecklist>[0]["sections"];
  /** Custom sidebar footer (replaces default SidebarFooter) */
  sidebarFooter?: React.ReactNode;
  /** Per-checklist-item comment props */
  checklistCommentProps?: {
    commentCounts: Record<string, number>;
    activeCommentItem: string | null;
    onCommentIconClick: (itemName: string) => void;
    activeCommentPopoverComments: Comment[];
    onSendComment: (itemName: string, text: string) => void;
    onOpenCommentsDrawer: (itemName: string) => void;
  };
  /** Comments drawer state (slides over left sidebar) */
  commentsDrawer?: {
    open: boolean;
    itemName: string;
    comments: Comment[];
    onSend: (text: string) => void;
    onClose: () => void;
  } | null;
}

export default function Dashboard({
  backHref,
  backLabel,
  rightSidebarContent,
  documentViewerProps,
  actionBarProps,
  topNavToggles,
  checklistSections,
  sidebarFooter,
  checklistCommentProps,
  commentsDrawer,
}: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rightPanel, setRightPanel] = useState<RightPanel>("transaction");
  const [selectedContact, setSelectedContact] = useState<SelectedContact | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Panel resize state ────────────────────────────────────
  const [leftWidth, setLeftWidth] = useState(374);
  const [rightWidth, setRightWidth] = useState(372);
  const draggingSide = useRef<"left" | "right" | null>(null);

  const handleResizeMouseDown = useCallback((side: "left" | "right") => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      draggingSide.current = side;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    };
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!draggingSide.current) return;
      if (draggingSide.current === "left") {
        setLeftWidth(Math.min(600, Math.max(200, e.clientX)));
      } else {
        setRightWidth(Math.min(600, Math.max(200, window.innerWidth - e.clientX)));
      }
    }
    function handleMouseUp() {
      if (!draggingSide.current) return;
      draggingSide.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // ─── Document tab state ──────────────────────────────────────
  const [tabs, setTabs] = useState<DocumentTab[]>([
    { id: "tab-1", label: "California...Agreeme...", documentId: "doc-ca-rpa" },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");
  const nextTabId = useRef(2);
  // History stack for "return to previous tab" on close
  const tabHistory = useRef<string[]>(["tab-1"]);

  // Track tab activations in history
  const selectTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    tabHistory.current = tabHistory.current.filter((id) => id !== tabId);
    tabHistory.current.push(tabId);
  }, []);

  // Derived: active document for the viewer
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const activeDocument = activeTab?.documentId
    ? DOCUMENT_REGISTRY.find((d) => d.id === activeTab.documentId) ?? null
    : null;

  const handleNewTab = useCallback(() => {
    const newId = `tab-${nextTabId.current++}`;
    setTabs((prev) => [...prev, { id: newId, label: "New Tab", documentId: null }]);
    selectTab(newId);
  }, [selectTab]);

  const handleCloseTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        const filtered = prev.filter((t) => t.id !== tabId);

        // Remove closed tab from history
        tabHistory.current = tabHistory.current.filter((id) => id !== tabId);

        if (filtered.length === 0) {
          // Always keep at least one tab — create a new empty one
          const newId = `tab-${nextTabId.current++}`;
          tabHistory.current.push(newId);
          setActiveTabId(newId);
          return [{ id: newId, label: "New Tab", documentId: null }];
        }

        // If we closed the active tab, return to previously active tab
        if (tabId === activeTabId) {
          const prevId = tabHistory.current[tabHistory.current.length - 1];
          const fallback = filtered[filtered.length - 1].id;
          const nextActive = prevId && filtered.some((t) => t.id === prevId)
            ? prevId
            : fallback;
          setActiveTabId(nextActive);
          if (!tabHistory.current.includes(nextActive)) {
            tabHistory.current.push(nextActive);
          }
        }

        return filtered;
      });
    },
    [activeTabId],
  );

  const handleLoadDocument = useCallback(
    (documentId: string) => {
      const docInfo = DOCUMENT_REGISTRY.find((d) => d.id === documentId);
      if (!docInfo) return;

      // If active tab already has this document, do nothing
      if (activeTab?.documentId === documentId) return;

      // If active tab is empty (New Tab), load into it
      if (activeTab && activeTab.documentId === null) {
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTabId
              ? { ...t, label: docInfo.shortName, documentId: docInfo.id }
              : t,
          ),
        );
        return;
      }

      // Check if there's already a tab with this document — switch to it
      const existingTab = tabs.find((t) => t.documentId === documentId);
      if (existingTab) {
        selectTab(existingTab.id);
        return;
      }

      // Otherwise, load into the active tab
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? { ...t, label: docInfo.shortName, documentId: docInfo.id }
            : t,
        ),
      );
    },
    [activeTab, activeTabId, tabs, selectTab],
  );

  // When rightPanel changes to a drawer, animate it in
  useEffect(() => {
    if (rightPanel !== "transaction") {
      drawerTimeoutRef.current = setTimeout(() => setDrawerVisible(true), 10);
    }
    return () => {
      if (drawerTimeoutRef.current) clearTimeout(drawerTimeoutRef.current);
    };
  }, [rightPanel]);

  function closeDrawer() {
    setDrawerVisible(false);
    setTimeout(() => setRightPanel("transaction"), 250);
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      {backHref && <TopNav href={backHref} label={backLabel || "Back"} toggles={topNavToggles} />}

      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleDetails={() => setDetailsOpen(!detailsOpen)}
        sidebarOpen={sidebarOpen}
        detailsOpen={detailsOpen}
      />

      <div className="flex flex-1 min-h-0 relative">
        <Overlay visible={sidebarOpen} onClick={() => setSidebarOpen(false)} breakpoint="lg" />

        {/* Left Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          side="left"
          breakpoint="lg"
          width="w-[320px] sm:w-auto"
          style={{ width: leftWidth }}
        >
          <div className="relative h-full overflow-hidden">
            <DocumentChecklist
              sections={checklistSections}
              activeDocumentId={activeTab?.documentId ?? null}
              onDocumentSelect={handleLoadDocument}
              {...checklistCommentProps}
            />
            {/* Comments drawer — slides over checklist from the left */}
            {commentsDrawer && (
              <div
                className={`absolute inset-0 z-20 bg-white transition-transform duration-250 ease-in-out ${
                  commentsDrawer.open ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <CommentsDrawer
                  itemName={commentsDrawer.itemName}
                  comments={commentsDrawer.comments}
                  onSend={commentsDrawer.onSend}
                  onClose={commentsDrawer.onClose}
                />
              </div>
            )}
          </div>
        </Sidebar>

        {/* Left resize handle */}
        <div
          onMouseDown={handleResizeMouseDown("left")}
          className="hidden lg:flex shrink-0 w-1.5 cursor-col-resize items-center justify-center border-x border-grey-200 bg-white hover:bg-grey-50 transition-colors group"
        >
          <div className="flex flex-col gap-1">
            <span className="w-1 h-1 rounded-full bg-grey-300 group-hover:bg-grey-500" />
            <span className="w-1 h-1 rounded-full bg-grey-300 group-hover:bg-grey-500" />
            <span className="w-1 h-1 rounded-full bg-grey-300 group-hover:bg-grey-500" />
          </div>
        </div>

        {/* Center */}
        <main className="flex-1 min-w-0 flex flex-col">
          <DocumentTabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSelect={selectTab}
            onTabClose={handleCloseTab}
            onNewTab={handleNewTab}
          />
          <div className="flex-1 min-h-0">
            <DocumentViewer document={activeDocument} {...documentViewerProps} />
          </div>
          <ActionBar {...actionBarProps} />
        </main>

        <Overlay visible={detailsOpen} onClick={() => setDetailsOpen(false)} breakpoint="xl" />

        {/* Right resize handle */}
        <div
          onMouseDown={handleResizeMouseDown("right")}
          className="hidden xl:flex shrink-0 w-1.5 cursor-col-resize items-center justify-center border-x border-grey-200 bg-white hover:bg-grey-50 transition-colors group"
        >
          <div className="flex flex-col gap-1">
            <span className="w-1 h-1 rounded-full bg-grey-300 group-hover:bg-grey-500" />
            <span className="w-1 h-1 rounded-full bg-grey-300 group-hover:bg-grey-500" />
            <span className="w-1 h-1 rounded-full bg-grey-300 group-hover:bg-grey-500" />
          </div>
        </div>

        {/* Right Sidebar */}
        <Sidebar
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          side="right"
          breakpoint="xl"
          width="w-[320px] xl:w-auto"
          style={{ width: rightWidth }}
        >
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0 relative overflow-hidden">
              {/* Base layer */}
              <div className="absolute inset-0">
                {rightSidebarContent ? (
                  rightSidebarContent({
                    onContactClick: (contact) => {
                      if (contact.type === "lender") {
                        setRightPanel("lender");
                      } else if (contact.name && contact.role) {
                        setSelectedContact({
                          name: contact.name,
                          role: contact.role,
                          type: contact.type,
                        });
                        setRightPanel("contact");
                      }
                    },
                    onViewLog: () => setRightPanel("log"),
                    onLoadDocument: handleLoadDocument,
                  })
                ) : (
                  <TransactionDetails
                    onContactClick={(contact) => {
                      if (contact.type === "lender") {
                        setRightPanel("lender");
                      }
                    }}
                    onViewLog={() => setRightPanel("log")}
                  />
                )}
              </div>

              {/* Drawer layer — slides in from the right */}
              {rightPanel !== "transaction" && (
                <div
                  className={`absolute inset-0 z-20 bg-white transition-transform duration-250 ease-in-out ${
                    drawerVisible ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  {rightPanel === "lender" && (
                    <LenderDetail onClose={closeDrawer} />
                  )}
                  {rightPanel === "contact" && selectedContact && (
                    <ContactDetail
                      contact={selectedContact}
                      onClose={closeDrawer}
                    />
                  )}
                  {rightPanel === "log" && (
                    <ActivityLog onClose={closeDrawer} />
                  )}
                </div>
              )}
            </div>
            {sidebarFooter ?? <SidebarFooter />}
          </div>
        </Sidebar>
      </div>
    </div>
  );
}
