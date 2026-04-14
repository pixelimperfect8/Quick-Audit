"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import type { IconTab } from "./IconTabBar";
import {
  ALL_SUMMARY_DETAILS,
  ALL_DATES,
  ALL_CONTACTS,
  DEFAULT_COMMISSION,
  type SectionId,
} from "./SmartAssistOption2TransactionContent";
import { FLAG_ISSUES, type FlagIssue } from "./flagsData";
import { ALL_FIELDS, fieldMatches, toArray } from "./FormDataByPage";
import type { DocumentSection } from "@/components/DocumentChecklist";
import { DOC_NAME_TO_ID } from "@/components/documentTabs/types";
import { SearchIcon, CloseIcon } from "@/components/icons";
import FormDataBySectionTabs from "./FormDataBySectionTabs";
import SmartAssistEditSummary from "./SmartAssistEditSummary";

interface Option3SidebarProps {
  onContactClick: (contact: { name?: string; role?: string; type?: string }) => void;
  onViewLog: () => void;
  selectedFlagId?: string | null;
  onFlagSelect?: (id: string) => void;
  externalActiveTab?: IconTab | null;
  onExternalTabHandled?: () => void;
  rejectedFlagIds?: Set<string>;
  onFlagReject?: (id: string) => void;
  tieredCommission?: boolean;
  selectedFormField?: string | null;
  onFormFieldSelect?: (label: string) => void;
  onLoadDocument?: (documentId: string) => void;
  checklistSections?: DocumentSection[];
  hiddenFields?: Set<string>;
  hiddenSections?: Set<string>;
  sectionOrder?: SectionId[];
  fieldOrder?: Record<string, string[]>;
  onToggleField?: (field: string) => void;
  onToggleSection?: (section: string) => void;
  onReorderSections?: (order: SectionId[]) => void;
  onReorderFields?: (sectionId: string, order: string[]) => void;
  onResetToDefaults?: () => void;
  editMode?: boolean;
  onToggleEditMode?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Unified search                                                     */
/* ------------------------------------------------------------------ */

interface SearchResult {
  category: string;
  label: string;
  detail?: string;
  flagId?: string;
  documentId?: string;
  contact?: { name: string; role: string; type?: string };
  section?: SectionId;
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

  const groups = new Map<string, SearchResult[]>();
  for (const r of results) {
    const existing = groups.get(r.category) || [];
    existing.push(r);
    groups.set(r.category, existing);
  }

  return (
    <div className="flex flex-col">
      {Array.from(groups.entries()).map(([category, items], idx) => (
        <div
          key={category}
          className={idx > 0 ? "border-t border-grey-200" : ""}
        >
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

function flagSearchMatches(issue: FlagIssue, q: string): boolean {
  const lower = q.toLowerCase();
  if (issue.description.toLowerCase().includes(lower)) return true;
  if (
    issue.sources?.some(
      (s) =>
        s.label.toLowerCase().includes(lower) ||
        s.value.toLowerCase().includes(lower),
    )
  )
    return true;
  return false;
}

/* ------------------------------------------------------------------ */
/*  Main sidebar                                                       */
/* ------------------------------------------------------------------ */

export default function SmartAssistOption3Sidebar({
  onContactClick,
  selectedFlagId,
  onFlagSelect,
  selectedFormField,
  onFormFieldSelect,
  onLoadDocument,
  checklistSections = [],
  hiddenFields = new Set(),
  hiddenSections = new Set(),
  sectionOrder,
  fieldOrder,
  onToggleField,
  onToggleSection,
  onReorderSections,
  onReorderFields,
  onResetToDefaults,
  editMode = false,
  onToggleEditMode,
}: Option3SidebarProps) {
  // Slide animation for edit mode overlay
  const [editVisible, setEditVisible] = useState(false);
  useEffect(() => {
    if (editMode) {
      requestAnimationFrame(() => setEditVisible(true));
    } else {
      setEditVisible(false);
    }
  }, [editMode]);
  // Global search
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [externalSection, setExternalSection] = useState<SectionId | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearchActive = searchFocused || !!query;

  function handleSearchCancel() {
    setQuery("");
    setSearchFocused(false);
    searchInputRef.current?.blur();
  }

  const searchResults = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    for (const d of ALL_SUMMARY_DETAILS) {
      if (d.label.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)) {
        results.push({ category: "Transaction", label: d.label, detail: d.value, section: "summary" });
      }
    }
    for (const d of ALL_DATES) {
      if (d.label.toLowerCase().includes(q) || d.value.toLowerCase().includes(q)) {
        results.push({ category: "Transaction", label: d.label, detail: d.value, section: "dates" });
      }
    }

    for (const c of ALL_CONTACTS) {
      if (c.role.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) {
        results.push({
          category: "Contact",
          label: c.role,
          detail: c.name,
          contact: { name: c.name, role: c.role, type: c.type },
          section: "contacts",
        });
      }
    }

    for (const r of DEFAULT_COMMISSION) {
      if (r.label.toLowerCase().includes(q) || r.value.toLowerCase().includes(q)) {
        results.push({ category: "Commission", label: r.label, detail: r.value, section: "commission" });
      }
    }

    for (const f of FLAG_ISSUES) {
      if (flagSearchMatches(f, q)) {
        results.push({ category: "Flag", label: f.description, flagId: f.id });
      }
    }

    for (const f of ALL_FIELDS) {
      if (fieldMatches(f, q)) {
        results.push({
          category: "Form Data",
          label: f.label,
          detail: toArray(f.formValue).join(", "),
        });
      }
    }

    for (const section of checklistSections) {
      for (const doc of section.documents) {
        const docId = DOC_NAME_TO_ID[doc.name];
        if (
          doc.name.toLowerCase().includes(q) ||
          doc.status.toLowerCase().includes(q)
        ) {
          results.push({
            category: "Checklist",
            label: doc.name,
            detail: doc.status,
            documentId: docId,
          });
        }
        for (const file of doc.files ?? []) {
          if (file.name.toLowerCase().includes(q)) {
            results.push({
              category: "Document",
              label: file.name,
              detail: doc.name,
              documentId: docId,
            });
          }
        }
      }
    }

    return results;
  }, [query, checklistSections]);

  function handleResultClick(result: SearchResult) {
    setQuery("");
    setSearchFocused(false);
    searchInputRef.current?.blur();

    // Switch to the relevant section in the form-data tabs (one-shot)
    if (result.section) setExternalSection(result.section);

    if (result.flagId) onFlagSelect?.(result.flagId);
    if (
      result.category === "Form Data" ||
      result.category === "Transaction"
    ) {
      onFormFieldSelect?.(result.label);
    }
    if (result.category === "Contact" && result.contact) {
      onContactClick?.(result.contact);
    }
    if (
      (result.category === "Checklist" || result.category === "Document") &&
      result.documentId
    ) {
      onLoadDocument?.(result.documentId);
    }
  }

  return (
    <div className="relative flex flex-col h-full bg-white">
      {/* Edit Summary overlay — slides in from right */}
      {editMode && onToggleField && onToggleSection && onReorderSections && onReorderFields && (
        <div
          className={`absolute inset-0 z-30 bg-white transition-transform duration-250 ease-in-out ${
            editVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SmartAssistEditSummary
            title="Customize Panel"
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

      {/* Global search bar */}
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

      <div className="flex-1 min-h-0 overflow-y-auto">
        {query ? (
          <UnifiedSearchResults
            results={searchResults}
            query={query}
            onResultClick={handleResultClick}
          />
        ) : (
          <FormDataBySectionTabs
            selectedFormField={selectedFormField}
            onFormFieldSelect={onFormFieldSelect}
            selectedFlagId={selectedFlagId}
            onFlagSelect={onFlagSelect}
            onContactClick={onContactClick}
            hiddenFields={hiddenFields}
            hiddenSections={hiddenSections}
            sectionOrder={sectionOrder}
            fieldOrder={fieldOrder}
            externalSection={externalSection}
            onExternalSectionHandled={() => setExternalSection(null)}
          />
        )}
      </div>
    </div>
  );
}
