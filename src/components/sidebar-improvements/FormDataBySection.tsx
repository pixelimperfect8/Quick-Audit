"use client";

import { useState, useRef, useEffect } from "react";
import { Collapsible } from "@/components/ui";
import { WarningIcon, CheckIcon, ChevronDown, ChevronUp } from "@/components/icons";
import { ALL_FIELDS, toArray, fieldMatches } from "./FormDataByPage";
import type { FormFieldHighlight } from "./FormDataByPage";
import {
  ALL_SUMMARY_DETAILS,
  ALL_DATES,
  ALL_CONTACTS,
  DEFAULT_COMMISSION,
  SECTION_LABELS,
  DEFAULT_SECTION_ORDER,
  type SectionId,
} from "./SmartAssistOption2TransactionContent";

/* ------------------------------------------------------------------ */
/*  Map each ALL_FIELDS label → section ID                             */
/* ------------------------------------------------------------------ */

const FIELD_TO_SECTION: Record<string, SectionId> = {};

// Summary fields
for (const d of ALL_SUMMARY_DETAILS) {
  FIELD_TO_SECTION[d.label] = "summary";
}
// Also map ALL_FIELDS labels that correspond to summary concepts
FIELD_TO_SECTION["Property Address"] = "summary";
FIELD_TO_SECTION["Seller Agent"] = "summary";

// Date fields
for (const d of ALL_DATES) {
  FIELD_TO_SECTION[d.label] = "dates";
}

// Contact fields (map by name)
for (const c of ALL_CONTACTS) {
  FIELD_TO_SECTION[c.name] = "contacts";
}
// ALL_FIELDS contact-like entries
FIELD_TO_SECTION["Buyer(s)"] = "contacts";
FIELD_TO_SECTION["Seller(s)"] = "contacts";
FIELD_TO_SECTION["Buyer Agent"] = "contacts";

// Commission fields
for (const c of DEFAULT_COMMISSION) {
  FIELD_TO_SECTION[c.label] = "commission";
}
FIELD_TO_SECTION["Seller Payment to Buyer Broker"] = "commission";

/* ------------------------------------------------------------------ */
/*  Group ALL_FIELDS by section                                        */
/* ------------------------------------------------------------------ */

type FormField = (typeof ALL_FIELDS)[number];

function groupBySection(fields: FormField[]): Map<SectionId, FormField[]> {
  const groups = new Map<SectionId, FormField[]>();
  for (const sectionId of DEFAULT_SECTION_ORDER) {
    groups.set(sectionId, []);
  }
  for (const field of fields) {
    const section = FIELD_TO_SECTION[field.label] ?? "summary";
    groups.get(section)!.push(field);
  }
  // Remove empty groups
  for (const [key, val] of groups) {
    if (val.length === 0) groups.delete(key);
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function hasSources(field: FormField): boolean {
  return !!(
    (field.fileValue && toArray(field.fileValue).some(Boolean)) ||
    (field.mlsValue && toArray(field.mlsValue).some(Boolean))
  );
}

/* ------------------------------------------------------------------ */
/*  Source badge                                                        */
/* ------------------------------------------------------------------ */

function SourceBadge({ source }: { source: "Form" | "File" | "MLS" }) {
  return (
    <span className="inline-flex items-center rounded border border-grey-300 bg-grey-50 px-1.5 py-0 text-xs font-medium text-grey-700">
      {source}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Field card (no pin functionality)                                  */
/* ------------------------------------------------------------------ */

function FieldCard({
  field,
  selected,
  onSelect,
}: {
  field: FormField;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const isFlagged = !!field.mismatch;
  const formValues = toArray(field.formValue);
  const fileValues = toArray(field.fileValue);
  const mlsValues = toArray(field.mlsValue);
  const isEmpty = formValues.length === 0 || formValues.every((v) => !v);
  const showSources = hasSources(field);

  // Flagged/missing items expanded by default, cleared items collapsed
  const [expanded, setExpanded] = useState(isFlagged || isEmpty);
  const [sourcesOpen, setSourcesOpen] = useState(isFlagged);

  return (
    <div
      onClick={onSelect}
      className={`group rounded-lg border p-4 transition-colors cursor-pointer ${
        selected
          ? field.mismatch
            ? "border-red-400 ring-2 ring-red-400/20 bg-red-50/30"
            : "border-blue-800 ring-2 ring-blue-800/20 bg-blue-50/30"
          : "border-grey-300 hover:bg-grey-50"
      }`}
    >
      {/* Header: label + status icon + chevron */}
      <div className="flex items-center gap-2">
        <span
          className={`text-base font-bold leading-6 min-w-0 ${
            field.mismatch ? "text-red-400" : "text-grey-900"
          }`}
        >
          {field.label}
        </span>
        {field.mismatch && (
          <WarningIcon className="w-4 h-4 text-orange-200 shrink-0" />
        )}
        {!field.mismatch && !isEmpty && (
          <CheckIcon className="w-4 h-4 text-green-600 shrink-0" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((v) => !v);
          }}
          className="shrink-0 ml-auto text-grey-500 hover:text-grey-900 transition-colors p-0.5"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Collapsible body */}
      {expanded && (
        <>
          {/* Form value(s) + source tag inline */}
          <div className="mt-1.5 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {isEmpty ? (
                <span className="text-red-400 text-base font-medium italic">
                  Missing
                </span>
              ) : (
                formValues.map((val, i) => (
                  <p
                    key={i}
                    className="text-grey-900 text-base font-medium leading-6"
                  >
                    {val}
                  </p>
                ))
              )}
            </div>
            {field.sourceOnly && !showSources && (
              <span className="shrink-0 mt-0.5">
                <SourceBadge source={field.sourceOnly} />
              </span>
            )}
          </div>

          {/* Sources toggle + content */}
          {showSources && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSourcesOpen(!sourcesOpen);
                }}
                className="flex items-center gap-1.5 mt-2 text-grey-800 text-sm font-medium hover:text-grey-900 transition-colors"
              >
                Sources
                {sourcesOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {sourcesOpen && (
                <div className="mt-2 bg-grey-100 rounded-lg py-2 px-3 flex flex-col gap-2">
                  {fileValues.length > 0 && fileValues.some(Boolean) && (
                    <div>
                      <p className="text-grey-900 text-sm font-bold leading-5">File:</p>
                      {fileValues.map((val, i) => (
                        <p key={i} className="text-grey-800 text-sm font-medium leading-5">{val}</p>
                      ))}
                    </div>
                  )}
                  {mlsValues.length > 0 && mlsValues.some(Boolean) && (
                    <div>
                      <p className="text-grey-900 text-sm font-bold leading-5">MLS:</p>
                      {mlsValues.map((val, i) => (
                        <p key={i} className="text-grey-800 text-sm font-medium leading-5">{val}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

interface FormDataBySectionProps {
  selectedFormField?: string | null;
  onFormFieldSelect?: (label: string) => void;
}

export default function FormDataBySection({
  selectedFormField,
  onFormFieldSelect,
}: FormDataBySectionProps) {
  const sectionGroups = groupBySection(ALL_FIELDS);
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedFormField && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedFormField]);

  return (
    <>
      {Array.from(sectionGroups.entries()).map(([sectionId, fields]) => (
        <Collapsible
          key={sectionId}
          title={SECTION_LABELS[sectionId]}
          defaultOpen
        >
          <div className="flex flex-col gap-3">
            {fields.map((field) => (
              <div
                key={field.label}
                ref={field.label === selectedFormField ? selectedRef : undefined}
              >
                <FieldCard
                  field={field}
                  selected={field.label === selectedFormField}
                  onSelect={() => onFormFieldSelect?.(field.label)}
                />
              </div>
            ))}
          </div>
        </Collapsible>
      ))}
    </>
  );
}
