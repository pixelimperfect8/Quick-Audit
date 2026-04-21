"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import Dashboard from "@/components/Dashboard";
import SmartAssistOption3Sidebar from "@/components/sidebar-improvements/SmartAssistOption3Sidebar";
import {
  INITIAL_COMMENTS_BY_ITEM,
  type Comment,
} from "@/components/sidebar-improvements/commentsData";
import {
  DEFAULT_SECTION_ORDER,
  DEFAULT_HIDDEN_FIELDS,
  ALL_CONTACTS,
  DEFAULT_CONTACTS,
  type SectionId,
} from "@/components/sidebar-improvements/SmartAssistOption2TransactionContent";
import { EditIcon, SettingsIcon } from "@/components/icons";

/**
 * User Test variant of Option 3.
 *
 * Only the left-sidebar checklist (with comments) and the center PDF
 * preview are interactive. Everything else — top nav, right sidebar,
 * sidebar footer, bottom action bar — is visually rendered but made
 * non-functional so testers stay focused on the comments feature and
 * can't accidentally navigate away.
 */

const CHECKLIST_SECTIONS = [
  {
    title: "Sales Documentation",
    documents: [
      {
        number: 1,
        name: "California Residential Purchase Agreement",
        status: "Flagged" as const,
        files: [{ name: "CAR_RPA_456Oak.pdf", date: "2 days ago" }],
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

// Mirrors Option 3's role-based contact setup so the right sidebar looks the same.
const OPTION3_CONTACT_ROLES = Array.from(
  new Set(ALL_CONTACTS.map((c) => c.role)),
);
const OPTION3_DEFAULT_VISIBLE_ROLES = new Set(
  DEFAULT_CONTACTS.map((c) => c.role),
);
const OPTION3_HIDDEN_ROLES_BY_DEFAULT = OPTION3_CONTACT_ROLES.filter(
  (r) => !OPTION3_DEFAULT_VISIBLE_ROLES.has(r),
);
const OPTION3_DEFAULT_HIDDEN_FIELDS = new Set([
  ...Array.from(DEFAULT_HIDDEN_FIELDS).filter(
    (key) => !ALL_CONTACTS.some((c) => c.name === key),
  ),
  ...OPTION3_HIDDEN_ROLES_BY_DEFAULT,
]);
const OPTION3_SECTION_FIELDS_OVERRIDE: Partial<Record<SectionId, string[]>> = {
  contacts: OPTION3_CONTACT_ROLES,
};

// No-op stand-ins so the Option 3 sidebar renders cleanly when wrapped in
// pointer-events-none (none of these will ever fire, but TypeScript wants
// them to exist).
const noop = () => {};
const noopId = (_id: string) => {};
const noopString = (_s: string) => {};
const noopStringArr = (_s: string, _arr: string[]) => {};
const noopOrder = (_order: SectionId[]) => {};

export default function UserTestPage() {
  // ─── Per-item checklist comments ─────────────────────────────
  const [commentsByItem, setCommentsByItem] = useState<Record<string, Comment[]>>(
    INITIAL_COMMENTS_BY_ITEM,
  );
  const [activeCommentPopover, setActiveCommentPopover] = useState<string | null>(
    null,
  );
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

  const unreadCountsByItem = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const [key, comments] of Object.entries(commentsByItem)) {
      counts[key] = comments.filter((c) => c.isNew).length;
    }
    return counts;
  }, [commentsByItem]);

  const markItemRead = useCallback((itemName: string) => {
    setCommentsByItem((prev) => {
      const existing = prev[itemName];
      if (!existing || !existing.some((c) => c.isNew)) return prev;
      return {
        ...prev,
        [itemName]: existing.map((c) => (c.isNew ? { ...c, isNew: false } : c)),
      };
    });
  }, []);

  const handleCommentIconClick = useCallback(
    (itemName: string) => {
      setActiveCommentPopover((prev) => {
        const next = prev === itemName ? null : itemName;
        if (next === itemName) markItemRead(itemName);
        return next;
      });
    },
    [markItemRead],
  );

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

  const handleOpenCommentsDrawer = useCallback(
    (itemName: string) => {
      setActiveCommentPopover(null);
      setCommentsDrawerItem(itemName);
      markItemRead(itemName);
      drawerTimeoutRef.current = setTimeout(() => setDrawerVisible(true), 10);
    },
    [markItemRead],
  );

  const handleCloseCommentsDrawer = useCallback(() => {
    setDrawerVisible(false);
    setTimeout(() => setCommentsDrawerItem(null), 250);
  }, []);

  // Static sidebar state snapshot — never mutated, since the right sidebar
  // is display-only in this variant.
  const hiddenFields = useMemo(
    () => new Set(OPTION3_DEFAULT_HIDDEN_FIELDS),
    [],
  );
  const hiddenSections = useMemo(() => new Set<string>(), []);
  const sectionOrder: SectionId[] = useMemo(() => [...DEFAULT_SECTION_ORDER], []);
  const fieldOrder = useMemo(() => ({} as Record<string, string[]>), []);

  return (
    <Dashboard
      // No backHref → no TopNav → testers can't navigate away.
      checklistSections={CHECKLIST_SECTIONS}
      checklistCommentProps={{
        commentCounts,
        unreadCountsByItem,
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
        showFlags: false,
        showFormHighlights: false,
      }}
      // Hide the bottom action bar (Accept/Reject/Issues) entirely.
      hideActionBar
      // Render the full Option 3 right sidebar, but wrap in pointer-events-none
      // so nothing is interactive (tabs, search, toggles, tooltips all inert).
      rightSidebarContent={() => (
        <div className="h-full w-full pointer-events-none select-none">
          <SmartAssistOption3Sidebar
            onContactClick={noop}
            onViewLog={noop}
            selectedFlagId={null}
            onFlagSelect={noopId}
            externalActiveTab={null}
            onExternalTabHandled={noop}
            rejectedFlagIds={new Set()}
            onFlagReject={noopId}
            tieredCommission={false}
            selectedFormField={null}
            onFormFieldSelect={noopString}
            onLoadDocument={noopId}
            checklistSections={CHECKLIST_SECTIONS}
            hiddenFields={hiddenFields}
            hiddenSections={hiddenSections}
            sectionOrder={sectionOrder}
            fieldOrder={fieldOrder}
            onToggleField={noopString}
            onToggleSection={noopString}
            onReorderSections={noopOrder}
            onReorderFields={noopStringArr}
            onResetToDefaults={noop}
            editMode={false}
            onToggleEditMode={noop}
            sectionFieldsOverride={OPTION3_SECTION_FIELDS_OVERRIDE}
            currentDocumentId={null}
          />
        </div>
      )}
      // Sidebar footer rendered for visual parity but wrapped so it's inert.
      sidebarFooter={
        <div className="bg-white border-t border-grey-300 px-4 flex items-center gap-3 shrink-0 h-[57px] pointer-events-none select-none">
          <div className="flex items-center gap-1.5 text-sm font-bold text-grey-800">
            <EditIcon className="w-4 h-4" />
            <span>Customize Panel</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-grey-800 font-bold">
            <SettingsIcon className="w-5 h-5 text-grey-700" />
            <span>Settings</span>
          </div>
        </div>
      }
    />
  );
}
