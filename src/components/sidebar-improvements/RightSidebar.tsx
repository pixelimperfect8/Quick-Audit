"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import IconTabBar, { type IconTab } from "./IconTabBar";
import Option2TransactionContent from "./Option2TransactionContent";
import { DEFAULT_DETAILS, DEFAULT_CONTACTS, DEFAULT_COMMISSION } from "./Option2TransactionContent";
import { FLAG_ISSUES, type FlagIssue, type FlagSource } from "./flagsData";
import { ALL_FIELDS, fieldMatches, toArray } from "./FormDataByPage";
import type { DocumentSection } from "@/components/DocumentChecklist";
import { DOC_NAME_TO_ID } from "@/components/documentTabs/types";
import { WarningIcon, SearchIcon, CloseIcon } from "@/components/icons";
import FormDataByPage from "./FormDataByPage";
import { FlagCard, Collapsible } from "@/components/ui";

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
  /** Set of pinned form field labels */
  pinnedFields?: Set<string>;
  /** Callback to toggle pin state for a form field */
  onTogglePin?: (label: string) => void;
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

export default function RightSidebar({
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
  pinnedFields,
  onTogglePin,
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<IconTab>("transaction");

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

    // Transaction details
    for (const d of DEFAULT_DETAILS) {
      if (d.label.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)) {
        results.push({ category: "Transaction", label: d.label, detail: d.value, tab: "transaction" });
      }
    }

    // Contacts
    for (const c of DEFAULT_CONTACTS) {
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
  }, [query, checklistSections]);

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
  }

  // Handle external tab switch requests (one-shot: only react to externalActiveTab changes)
  useEffect(() => {
    if (externalActiveTab) {
      setActiveTab(externalActiveTab);
      onExternalTabHandled?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalActiveTab]);

  return (
    <div className="flex flex-col h-full bg-white">
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
          onTabChange={setActiveTab}
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
              <Option2TransactionContent
                onContactClick={onContactClick}
                onViewLog={onViewLog}
                rejectedFlagIds={rejectedFlagIds}
                tieredCommission={tieredCommission}
                pinnedFields={pinnedFields}
                onUnpin={onTogglePin}
              />
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
              <FormDataByPage
                selectedFormField={selectedFormField}
                onFormFieldSelect={onFormFieldSelect}
                pinnedFields={pinnedFields}
                onTogglePin={onTogglePin}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
