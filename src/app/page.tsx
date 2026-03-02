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

type RightPanel = "transaction" | "lender" | "log";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rightPanel, setRightPanel] = useState<RightPanel>("transaction");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When rightPanel changes to a drawer, animate it in
  useEffect(() => {
    if (rightPanel !== "transaction") {
      // Small delay to ensure the element is rendered before animating
      drawerTimeoutRef.current = setTimeout(() => setDrawerVisible(true), 10);
    }
    return () => {
      if (drawerTimeoutRef.current) clearTimeout(drawerTimeoutRef.current);
    };
  }, [rightPanel]);

  function closeDrawer() {
    setDrawerVisible(false);
    // Wait for the slide-out animation to finish before switching panel
    setTimeout(() => setRightPanel("transaction"), 250);
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleDetails={() => setDetailsOpen(!detailsOpen)}
        sidebarOpen={sidebarOpen}
        detailsOpen={detailsOpen}
      />

      <div className="flex flex-1 min-h-0 relative">
        {/* Mobile overlay for sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar - Document Checklist */}
        <aside
          className={`
            fixed lg:relative top-0 left-0 h-full z-40 lg:z-0
            w-[320px] sm:w-[374px] shrink-0
            border-r border-grey-300 bg-white
            transition-transform duration-300 ease-in-out
            lg:translate-x-0 lg:block
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-grey-100 flex items-center justify-center text-grey-700 hover:bg-grey-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <DocumentChecklist />
        </aside>

        {/* Center - Document Viewer + ActionBar */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <DocumentViewer />
          </div>
          <ActionBar />
        </main>

        {/* Mobile overlay for details */}
        {detailsOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 xl:hidden"
            onClick={() => setDetailsOpen(false)}
          />
        )}

        {/* Right Sidebar - Transaction Details / Lender / Log */}
        <aside
          className={`
            fixed xl:relative top-0 right-0 h-full z-40 xl:z-0
            w-[320px] sm:w-[372px] shrink-0
            border-l border-grey-300 bg-white
            transition-transform duration-300 ease-in-out
            xl:translate-x-0 xl:block
            ${detailsOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}
          `}
        >
          {/* Close button for mobile */}
          <button
            onClick={() => setDetailsOpen(false)}
            className="xl:hidden absolute top-3 left-3 z-50 w-8 h-8 rounded-full bg-grey-100 flex items-center justify-center text-grey-700 hover:bg-grey-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0 relative overflow-hidden">
              {/* Base layer — always rendered */}
              <div className="absolute inset-0">
                <TransactionDetails
                  onContactClick={(contact) => {
                    if (contact.type === "lender") {
                      setRightPanel("lender");
                    }
                  }}
                  onViewLog={() => setRightPanel("log")}
                />
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
        </aside>
      </div>
    </div>
  );
}
