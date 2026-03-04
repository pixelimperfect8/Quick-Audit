"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import DocumentChecklist from "@/components/DocumentChecklist";
import DocumentViewer from "@/components/DocumentViewer";
import TransactionDetails from "@/components/TransactionDetails";
import LenderDetail from "@/components/LenderDetail";
import ActivityLog from "@/components/ActivityLog";
import ActionBar from "@/components/ActionBar";
import SidebarFooter from "@/components/SidebarFooter";
import { Overlay, Sidebar } from "@/components/ui";
import TopNav from "@/components/TopNav";

type RightPanel = "transaction" | "lender" | "log";

interface ToggleDef {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface DashboardProps {
  backHref?: string;
  backLabel?: string;
  rightSidebarContent?: (props: {
    onContactClick: (contact: { type?: string }) => void;
    onViewLog: () => void;
  }) => React.ReactNode;
  /** Props passed through to DocumentViewer */
  documentViewerProps?: {
    selectedFlagId?: string | null;
    onFlagSelect?: (id: string) => void;
    showFlags?: boolean;
    rejectedFlagIds?: Set<string>;
  };
  /** Props passed through to ActionBar */
  actionBarProps?: {
    onViewFlags?: () => void;
  };
  /** Toggles shown in the top nav bar */
  topNavToggles?: ToggleDef[];
}

export default function Dashboard({
  backHref,
  backLabel,
  rightSidebarContent,
  documentViewerProps,
  actionBarProps,
  topNavToggles,
}: DashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rightPanel, setRightPanel] = useState<RightPanel>("transaction");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          width="w-[320px] sm:w-[374px]"
        >
          <DocumentChecklist />
        </Sidebar>

        {/* Center */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <DocumentViewer {...documentViewerProps} />
          </div>
          <ActionBar {...actionBarProps} />
        </main>

        <Overlay visible={detailsOpen} onClick={() => setDetailsOpen(false)} breakpoint="xl" />

        {/* Right Sidebar */}
        <Sidebar
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          side="right"
          breakpoint="xl"
          width="w-[320px] sm:w-[372px]"
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
                      }
                    },
                    onViewLog: () => setRightPanel("log"),
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
                  {rightPanel === "log" && (
                    <ActivityLog onClose={closeDrawer} />
                  )}
                </div>
              )}
            </div>
            <SidebarFooter />
          </div>
        </Sidebar>
      </div>
    </div>
  );
}
