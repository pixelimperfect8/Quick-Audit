"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import IconTabBar, { TABS_WITH_COMMENTS, type IconTab } from "./IconTabBar";
import SmartAssistOption2TransactionContent from "./SmartAssistOption2TransactionContent";
import { ALL_SUMMARY_DETAILS, ALL_DATES, ALL_CONTACTS, DEFAULT_COMMISSION, type SectionId } from "./SmartAssistOption2TransactionContent";
import SmartAssistEditSummary from "./SmartAssistEditSummary";
import SmartAssistHiddenDataDrawer from "./SmartAssistHiddenDataDrawer";
import { FLAG_ISSUES, type FlagIssue, type FlagSource } from "./flagsData";
import { ALL_FIELDS, fieldMatches, toArray } from "./FormDataByPage";
import type { DocumentSection } from "@/components/DocumentChecklist";
import { DOC_NAME_TO_ID } from "@/components/documentTabs/types";
import { WarningIcon, SendIcon, SearchIcon, CloseIcon } from "@/components/icons";
import FormDataBySection from "./FormDataBySection";
import { TextInput, FlagCard, Collapsible } from "@/components/ui";

interface RightSidebarProps {
  onContactClick: (contact: { type?: string }) => void;
  onViewLog: () => void;
  selectedFlagId?: string | null;
  onFlagSelect?: (id: string) => void;
  /** Allow external tab switching (e.g. from ActionBar "View" button) */
  externalActiveTab?: IconTab | null;
  onExternalTabHandled?: () => void;
  /** Set of rejected flag IDs (managed at page level) */
  rejectedFlagIds?: Set<string>;
  /** Callback to toggle a flag's rejected state */
  onFlagReject?: (id: string) => void;
  /** Show tiered commission breakdown instead of flat totals */
  tieredCommission?: boolean;
  /** Currently selected form field label (for bidirectional highlight) */
  selectedFormField?: string | null;
  /** Callback when a form data field is selected (for document highlight) */
  onFormFieldSelect?: (label: string) => void;
  /** Callback to load a document in the viewer (opens in tab) */
  onLoadDocument?: (documentId: string) => void;
  /** Checklist sections for search (mirrors what the left sidebar shows) */
  checklistSections?: DocumentSection[];
  /** Hidden fields for Transaction tab customization */
  hiddenFields?: Set<string>;
  /** Hidden sections for Transaction tab customization */
  hiddenSections?: Set<string>;
  /** Section ordering for Transaction tab */
  sectionOrder?: SectionId[];
  /** Toggle a field's hidden state */
  onToggleField?: (field: string) => void;
  /** Toggle a section's hidden state */
  onToggleSection?: (section: string) => void;
  /** Reorder sections */
  onReorderSections?: (order: SectionId[]) => void;
  /** Per-section field ordering */
  fieldOrder?: Record<string, string[]>;
  /** Reorder fields within a section */
  onReorderFields?: (sectionId: string, order: string[]) => void;
  /** Reset all customizations to defaults */
  onResetToDefaults?: () => void;
  /** Whether edit summary mode is active */
  editMode?: boolean;
  /** Toggle edit mode */
  onToggleEditMode?: () => void;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
  isNew: boolean;
}

const INITIAL_COMMENTS: Comment[] = [
  { id: 1, author: "Rob Smith", text: "The seller missed checkboxes for yes/no on page 4 of the seller disclosure for XYZ question. Please work with them to fill the form out correctly and re-upload to SkySlope. Thanks!", time: "May 25, 2024 at 9:18am", isNew: false },
  { id: 2, author: "Kristen Turner", text: "Sending out for signature again.", time: "1 day ago", isNew: false },
  { id: 3, author: "Kristen Turner", text: "Ready for review.", time: "1 min ago", isNew: true },
];

function CommentItem({ comment }: { comment: Comment }) {
  const [highlighted, setHighlighted] = useState(comment.isNew);

  useEffect(() => {
    if (!comment.isNew) return;
    const timer = setTimeout(() => setHighlighted(false), 3000);
    return () => clearTimeout(timer);
  }, [comment.isNew]);

  return (
    <div
      className={`rounded-lg p-4 flex flex-col gap-3 transition-colors duration-700 ${
        highlighted ? "bg-grey-100" : "bg-transparent"
      }`}
    >
      <p className="text-grey-900 text-base font-bold leading-6">{comment.author}</p>
      <p className="text-grey-900 text-base font-medium leading-6">{comment.text}</p>
      <p className="text-grey-800 text-sm font-medium leading-6">{comment.time}</p>
    </div>
  );
}

/** Group issues by page number */
function groupByPage(issues: FlagIssue[]): Map<number, FlagIssue[]> {
  const groups = new Map<number, FlagIssue[]>();
  for (const issue of issues) {
    const existing = groups.get(issue.page) || [];
    existing.push(issue);
    groups.set(issue.page, existing);
  }
  return groups;
}

/** Render structured sources in the Figma style */
function SourcesList({ sources }: { sources: FlagSource[] }) {
  return (
    <>
      {sources.map((src) => (
        <div key={src.label} className="px-4 py-2">
          <p className="text-grey-900 text-base font-bold leading-6">{src.label}:</p>
          <p className="text-grey-800 text-base font-medium leading-6">{src.value}</p>
        </div>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Unified search                                                     */
/* ------------------------------------------------------------------ */

interface SearchResult {
  category: string;
  label: string;
  detail?: string;
  tab: IconTab;
  flagId?: string;
  documentId?: string;
}

const CATEGORY_DOT: Record<string, string> = {
  Flag: "bg-orange-200",
  Checklist: "bg-green-600",
  Document: "bg-grey-800",
};
const DEFAULT_DOT = "bg-blue-800";

const CATEGORY_PLURAL: Record<string, string> = {
  Transaction: "Transactions",
  Contact: "Contacts",
  Commission: "Commission",
  Comment: "Comments",
  Flag: "Flags",
  "Form Data": "Form Data",
  Checklist: "Checklist",
  Document: "Documents",
};

function SearchResultRow({
  result,
  onClick,
}: {
  result: SearchResult;
  onClick: () => void;
}) {
  const dotColor = CATEGORY_DOT[result.category] ?? DEFAULT_DOT;
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-grey-50 transition-colors"
    >
      <span className="flex items-center gap-2 shrink-0 mt-0.5">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="text-grey-800 text-sm font-medium w-[80px]">
          {result.category}
        </span>
      </span>
      <span className="flex-1 min-w-0">
        <span className="text-grey-900 text-base font-medium leading-6 line-clamp-2">
          {result.label}
          {result.detail && (
            <span className="text-grey-800"> — {result.detail}</span>
          )}
        </span>
      </span>
    </button>
  );
}

function UnifiedSearchResults({
  results,
  query,
  onResultClick,
}: {
  results: SearchResult[];
  query: string;
  onResultClick: (result: SearchResult) => void;
}) {
  if (results.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-grey-800 text-sm">
          No results for &ldquo;{query}&rdquo;
        </p>
      </div>
    );
  }

  // Group by category
  const groups = new Map<string, SearchResult[]>();
  for (const r of results) {
    const existing = groups.get(r.category) || [];
    existing.push(r);
    groups.set(r.category, existing);
  }

  return (
    <div className="flex flex-col">
      {Array.from(groups.entries()).map(([category, items]) => (
        <div key={category}>
          <p className="px-4 pt-4 pb-1 text-grey-800 text-xs font-bold uppercase tracking-wider">
            {CATEGORY_PLURAL[category] ?? category}
          </p>
          {items.map((item, i) => (
            <SearchResultRow
              key={`${category}-${i}`}
              result={item}
              onClick={() => onResultClick(item)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Check if a flag issue matches a search query */
function flagMatches(issue: FlagIssue, q: string): boolean {
  const lower = q.toLowerCase();
  if (issue.description.toLowerCase().includes(lower)) return true;
  if (issue.sources?.some(
    (s) =>
      s.label.toLowerCase().includes(lower) ||
      s.value.toLowerCase().includes(lower),
  )) return true;
  return false;
}

function FlagsPanel({
  selectedFlagId,
  onFlagSelect,
  rejectedFlagIds = new Set(),
  onFlagReject,
}: {
  selectedFlagId?: string | null;
  onFlagSelect?: (id: string) => void;
  rejectedFlagIds?: Set<string>;
  onFlagReject?: (id: string) => void;
}) {
  const selectedRef = useRef<HTMLDivElement>(null);

  // Scroll selected card into view when selectedFlagId changes externally
  useEffect(() => {
    if (selectedFlagId && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedFlagId]);

  const pageGroups = groupByPage(FLAG_ISSUES);

  return (
    <div className="flex flex-col pt-2 pb-6">
      {Array.from(pageGroups.entries()).map(([page, issues]) => (
        <Collapsible key={page} title={`Page ${page}`} defaultOpen>
          <div className="flex flex-col gap-4">
            {issues.map((issue) => {
              const isRejected = rejectedFlagIds.has(issue.id);
              return (
                <div
                  key={issue.id}
                  ref={issue.id === selectedFlagId ? selectedRef : undefined}
                >
                  <FlagCard
                    selected={issue.id === selectedFlagId}
                    rejected={isRejected}
                    onSelect={() => onFlagSelect?.(issue.id)}
                    onReject={() => onFlagReject?.(issue.id)}
                    sources={
                      issue.sources ? (
                        <SourcesList sources={issue.sources} />
                      ) : undefined
                    }
                  >
                    {issue.description}
                  </FlagCard>
                </div>
              );
            })}
          </div>
        </Collapsible>
      ))}
    </div>
  );
}

export default function SmartAssistOption2Sidebar({
  onContactClick,
  onViewLog,
  selectedFlagId,
  onFlagSelect,
  externalActiveTab,
  onExternalTabHandled,
  rejectedFlagIds,
  onFlagReject,
  tieredCommission,
  selectedFormField,
  onFormFieldSelect,
  onLoadDocument,
  checklistSections = [],
  hiddenFields = new Set(),
  hiddenSections = new Set(),
  sectionOrder,
  onToggleField,
  onToggleSection,
  onReorderSections,
  fieldOrder,
  onReorderFields,
  onResetToDefaults,
  editMode = false,
  onToggleEditMode,
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<IconTab>("transaction");
  const [showHiddenData, setShowHiddenData] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [hasUnread, setHasUnread] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(4);

  // ---- Global search ----
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearchActive = searchFocused || !!query;

  function handleSearchCancel() {
    setQuery("");
    setSearchFocused(false);
    searchInputRef.current?.blur();
  }

  // Build unified search results across all data sources
  const searchResults = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    // Transaction details (summary + dates)
    for (const d of [...ALL_SUMMARY_DETAILS, ...ALL_DATES]) {
      if (d.label.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)) {
        results.push({ category: "Transaction", label: d.label, detail: d.value, tab: "transaction" });
      }
    }

    // Contacts
    for (const c of ALL_CONTACTS) {
      if (c.role.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) {
        results.push({ category: "Contact", label: c.role, detail: c.name, tab: "transaction" });
      }
    }

    // Commission
    for (const r of DEFAULT_COMMISSION) {
      if (r.label.toLowerCase().includes(q) || r.value.toLowerCase().includes(q)) {
        results.push({ category: "Commission", label: r.label, detail: r.value, tab: "transaction" });
      }
    }

    // Comments
    for (const c of comments) {
      if (c.author.toLowerCase().includes(q) || c.text.toLowerCase().includes(q)) {
        results.push({ category: "Comment", label: c.author, detail: c.text, tab: "comments" });
      }
    }

    // Flags
    for (const f of FLAG_ISSUES) {
      if (flagMatches(f, q)) {
        results.push({ category: "Flag", label: f.description, tab: "flags", flagId: f.id });
      }
    }

    // Form Data
    for (const f of ALL_FIELDS) {
      if (fieldMatches(f, q)) {
        results.push({ category: "Form Data", label: f.label, detail: toArray(f.formValue).join(", "), tab: "formData" });
      }
    }

    // Checklist items & attached documents
    for (const section of checklistSections) {
      for (const doc of section.documents) {
        const docId = DOC_NAME_TO_ID[doc.name];
        if (doc.name.toLowerCase().includes(q) || doc.status.toLowerCase().includes(q)) {
          results.push({ category: "Checklist", label: doc.name, detail: doc.status, tab: "transaction", documentId: docId });
        }
        for (const file of doc.files ?? []) {
          if (file.name.toLowerCase().includes(q)) {
            results.push({ category: "Document", label: file.name, detail: doc.name, tab: "transaction", documentId: docId });
          }
        }
      }
    }

    return results;
  }, [query, comments, checklistSections]);

  function handleResultClick(result: SearchResult) {
    setQuery("");
    setActiveTab(result.tab);
    if (result.flagId) {
      onFlagSelect?.(result.flagId);
    }
    if (result.category === "Form Data") {
      onFormFieldSelect?.(result.label);
    }
    if ((result.category === "Checklist" || result.category === "Document") && result.documentId) {
      onLoadDocument?.(result.documentId);
    }
    if (result.tab === "comments") {
      setHasUnread(false);
    }
  }

  // Handle external tab switch requests (one-shot: only react to externalActiveTab changes)
  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab);
      onExternalTabHandled?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalActiveTab]);

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  // Clear badge when comments tab is opened
  function handleTabChange(tab: IconTab) {
    setActiveTab(tab);
    if (tab === "comments") {
      setHasUnread(false);
    }
  }

  function handleSend() {
    const text = commentText.trim();
    if (!text) return;

    const newComment: Comment = {
      id: nextIdRef.current++,
      author: "You",
      text,
      time: "Just now",
      isNew: true,
    };

    setComments((prev) => [...prev, newComment]);
    setCommentText("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Scroll to bottom after render
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const latestComment = comments[comments.length - 1];

  // Track edit mode transition for slide animation
  const [editVisible, setEditVisible] = useState(false);
  useEffect(() => {
    if (editMode) {
      // Trigger slide-in on next frame
      requestAnimationFrame(() => setEditVisible(true));
    } else {
      setEditVisible(false);
    }
  }, [editMode]);

  return (
    <div className="relative flex flex-col h-full bg-white">
      {/* ---- Edit Summary overlay — slides in from right ---- */}
      {editMode && onToggleField && onToggleSection && onReorderSections && onReorderFields && (
        <div
          className={`absolute inset-0 z-30 bg-white transition-transform duration-250 ease-in-out ${
            editVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SmartAssistEditSummary
            hiddenFields={hiddenFields}
            hiddenSections={hiddenSections}
            sectionOrder={sectionOrder ?? ["summary", "dates", "contacts", "commission"]}
            fieldOrder={fieldOrder ?? {}}
            onToggleField={onToggleField}
            onToggleSection={onToggleSection}
            onReorderSections={onReorderSections}
            onReorderFields={onReorderFields}
            onResetToDefaults={onResetToDefaults}
            onClose={() => onToggleEditMode?.()}
          />
        </div>
      )}

      {/* ---- Global search bar ---- */}
      <div
        className={`flex items-center px-4 py-2.5 border-b transition-colors ${
          isSearchActive
            ? "bg-white border-blue-800"
            : "bg-grey-50 border-grey-300"
        }`}
      >
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          placeholder="Search..."
          className="flex-1 text-base font-medium text-grey-900 placeholder:text-grey-800 outline-none bg-transparent leading-6"
        />
        {isSearchActive ? (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSearchCancel}
            className="text-grey-700 hover:text-grey-900 shrink-0 ml-2"
            aria-label="Cancel search"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        ) : (
          <SearchIcon className="w-[18px] h-[18px] text-grey-800 shrink-0 ml-2" />
        )}
      </div>

      {!query && (
        <IconTabBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={TABS_WITH_COMMENTS}
          badges={{ comments: hasUnread }}
          hoverContent={{
            comments: latestComment ? (
              <div className="w-64 p-3 text-left">
                <p className="text-grey-900 text-sm font-bold">{latestComment.author}</p>
                <p className="text-grey-900 text-sm mt-1 line-clamp-2">{latestComment.text}</p>
                <p className="text-grey-800 text-xs mt-1">{latestComment.time}</p>
              </div>
            ) : undefined,
          }}
        />
      )}

      <div className="flex-1 min-h-0 overflow-y-auto">
        {query ? (
          <UnifiedSearchResults
            results={searchResults}
            query={query}
            onResultClick={handleResultClick}
          />
        ) : (
          <>
            {activeTab === "transaction" && (
              showHiddenData && onToggleField && onToggleSection ? (
                <SmartAssistHiddenDataDrawer
                  hiddenFields={hiddenFields}
                  hiddenSections={hiddenSections}
                  onShowField={onToggleField}
                  onShowSection={onToggleSection}
                  onClose={() => setShowHiddenData(false)}
                />
              ) : (
                <SmartAssistOption2TransactionContent
                  onContactClick={onContactClick}
                  onViewLog={onViewLog}
                  rejectedFlagIds={rejectedFlagIds}
                  tieredCommission={tieredCommission}
                  hiddenFields={hiddenFields}
                  hiddenSections={hiddenSections}
                  sectionOrder={sectionOrder}
                  fieldOrder={fieldOrder}
                  onViewHiddenData={() => setShowHiddenData(true)}
                />
              )
            )}

            {activeTab === "comments" && (
              <div className="flex flex-col h-full">
                {/* Comments list */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {comments.map((comment, i) => (
                    <div key={comment.id}>
                      <div className="px-2">
                        <CommentItem comment={comment} />
                      </div>
                      {i < comments.length - 1 && (
                        <div className="mx-6 border-b border-grey-300" />
                      )}
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>

                {/* Leave a Comment */}
                <div className="border-t border-grey-300 p-3">
                  <TextInput
                    ref={textareaRef}
                    value={commentText}
                    onChange={(e) => {
                      setCommentText(e.target.value);
                      handleInput();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Leave a comment..."
                    action={
                      <button
                        onClick={handleSend}
                        className={`p-2 mr-1 mb-0.5 rounded-full transition-colors ${
                          commentText.trim()
                            ? "text-blue-800 hover:bg-grey-200"
                            : "text-grey-400"
                        }`}
                        disabled={!commentText.trim()}
                        aria-label="Send comment"
                      >
                        <SendIcon className="w-5 h-5" />
                      </button>
                    }
                  />
                </div>
              </div>
            )}

            {activeTab === "flags" && (
              <FlagsPanel
                selectedFlagId={selectedFlagId}
                onFlagSelect={onFlagSelect}
                rejectedFlagIds={rejectedFlagIds}
                onFlagReject={onFlagReject}
              />
            )}

            {activeTab === "formData" && (
              <FormDataBySection
                selectedFormField={selectedFormField}
                onFormFieldSelect={onFormFieldSelect}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
