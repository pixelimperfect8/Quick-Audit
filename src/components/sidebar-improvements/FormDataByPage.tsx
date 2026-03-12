"use client";

import { useState, useRef, useEffect } from "react";
import { Collapsible, Badge } from "@/components/ui";
import { WarningIcon, CheckIcon, ChevronDown, ChevronUp, PinIcon, PinFilledIcon } from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  Data types                                                         */
/* ------------------------------------------------------------------ */

export interface FormFieldHighlight {
  page: number;
  top: string;
  left: string;
  width: string;
  height: string;
}

interface FormField {
  label: string;
  formValue?: string | string[];
  fileValue?: string | string[];
  mlsValue?: string | string[];
  mismatch?: boolean;
  sourceOnly?: "Form" | "File" | "MLS";
  page?: string;
  /** Position on the document for light-blue highlight overlay */
  highlight?: FormFieldHighlight;
}

/* ------------------------------------------------------------------ */
/*  All extracted data — flat list, ordered by page appearance          */
/* ------------------------------------------------------------------ */

export const ALL_FIELDS: FormField[] = [
  // RPA p.1
  {
    label: "Property Address",
    formValue: "3969 Harvord Boulevard, Venture, CA 93001",
    fileValue: "3969 Harvord Boulevard, Venture, CA 93001",
    mlsValue: "3969 Harvord Boulevard, Venture, CA 93001",
    mismatch: false,
    page: "RPA p.1",
    highlight: { page: 1, top: "12%", left: "10%", width: "80%", height: "3%" },
  },
  {
    label: "Buyer(s)",
    formValue: ["Rachael Laurella", "Rob Laurella"],
    fileValue: ["Rachel Laurella", "Rob Laurella"],
    mismatch: true,
    page: "RPA p.1",
    highlight: { page: 1, top: "17%", left: "10%", width: "60%", height: "3%" },
  },
  {
    label: "Seller Brokerage",
    formValue: "Keller Williams Realty",
    sourceOnly: "Form",
    page: "RPA p.1, §2A",
    highlight: { page: 1, top: "22%", left: "10%", width: "45%", height: "3%" },
  },
  {
    label: "Seller Broker License",
    formValue: "DRE #01234567",
    sourceOnly: "Form",
    page: "RPA p.1, §2A",
    highlight: { page: 1, top: "26%", left: "10%", width: "35%", height: "3%" },
  },
  {
    label: "Buyer Brokerage",
    formValue: "Compass Real Estate",
    sourceOnly: "Form",
    page: "RPA p.1, §2B",
    highlight: { page: 1, top: "22%", left: "55%", width: "40%", height: "3%" },
  },
  {
    label: "Buyer Broker License",
    formValue: "",
    mismatch: true,
    page: "RPA p.1, §2B",
    highlight: { page: 1, top: "26%", left: "55%", width: "35%", height: "3%" },
  },
  {
    label: "Rep Type",
    formValue: "Seller only",
    sourceOnly: "Form",
    page: "RPA p.1, §2B",
    highlight: { page: 1, top: "31%", left: "10%", width: "30%", height: "3%" },
  },
  {
    label: "Seller Payment to Buyer Broker",
    formValue: "2.5%",
    sourceOnly: "Form",
    page: "RPA p.1",
    highlight: { page: 1, top: "31%", left: "55%", width: "25%", height: "3%" },
  },
  {
    label: "Purchase Price",
    formValue: "$500,000.00",
    fileValue: "$450,000.00",
    mismatch: true,
    page: "RPA p.1, §A",
    highlight: { page: 1, top: "53%", left: "10%", width: "40%", height: "3%" },
  },
  {
    label: "Close of Escrow",
    formValue: "11/29/2023",
    fileValue: "11/29/2023",
    page: "RPA p.1, §C",
    highlight: { page: 1, top: "64%", left: "10%", width: "35%", height: "3%" },
  },
  {
    label: "Loan Type",
    formValue: "Conventional",
    sourceOnly: "Form",
    page: "RPA p.1, §E",
    highlight: { page: 1, top: "78%", left: "10%", width: "40%", height: "3%" },
  },
  // RPA p.2
  {
    label: "Loan Contingency",
    formValue: "21 days",
    sourceOnly: "Form",
    page: "RPA p.2, §L1",
    highlight: { page: 2, top: "18%", left: "10%", width: "70%", height: "4%" },
  },
  {
    label: "Appraisal Contingency",
    formValue: "17 days",
    sourceOnly: "Form",
    page: "RPA p.2, §L2",
    highlight: { page: 2, top: "28%", left: "10%", width: "70%", height: "4%" },
  },
  {
    label: "Investigation Contingency",
    formValue: "17 days",
    sourceOnly: "Form",
    page: "RPA p.2, §L3",
    highlight: { page: 2, top: "38%", left: "10%", width: "70%", height: "4%" },
  },
  // RPA p.3
  {
    label: "Home Warranty",
    formValue: "Yes — ordered",
    sourceOnly: "Form",
    page: "RPA p.3, §Q18",
    highlight: { page: 3, top: "18%", left: "10%", width: "70%", height: "4%" },
  },
  // RPA p.15 — beyond 5-page viewer, no highlights
  {
    label: "Seller Agent",
    formValue: "Aaron Smith",
    sourceOnly: "Form",
    page: "RPA p.15",
  },
  {
    label: "Seller Agent License",
    formValue: "DRE #09876543",
    fileValue: "DRE #09876543",
    page: "RPA p.15",
  },
  {
    label: "Buyer Agent",
    formValue: "Lisa Chen",
    sourceOnly: "Form",
    page: "RPA p.15",
  },
  {
    label: "Buyer Agent License",
    formValue: "DRE #05647382",
    sourceOnly: "Form",
    page: "RPA p.15",
  },
  // RPA p.16 — beyond 5-page viewer, no highlights
  {
    label: "Seller(s)",
    formValue: ["James Thompson", "Mary Thompson"],
    fileValue: ["James Thompson", "Mary Thompson"],
    mismatch: false,
    page: "RPA p.16",
  },
  // MLS — no document page, no highlights
  {
    label: "Year Built",
    formValue: "1965",
    sourceOnly: "MLS",
    page: "MLS",
  },
  {
    label: "Property Type",
    formValue: "Single Family Residence",
    sourceOnly: "MLS",
    page: "MLS",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function hasSources(field: FormField): boolean {
  return !!(
    (field.fileValue && toArray(field.fileValue).some(Boolean)) ||
    (field.mlsValue && toArray(field.mlsValue).some(Boolean))
  );
}

/** Extract page number for grouping (e.g. "RPA p.1, §A" → "RPA p.1") */
function pageGroup(page?: string): string {
  if (!page) return "Other";
  if (page === "MLS") return "MLS";
  const match = page.match(/^RPA p\.(\d+)/);
  return match ? `Page ${match[1]}` : page;
}

/** Group fields by their page, preserving order */
function groupByPage(fields: FormField[]): Map<string, FormField[]> {
  const groups = new Map<string, FormField[]>();
  for (const field of fields) {
    const key = pageGroup(field.page);
    const existing = groups.get(key) || [];
    existing.push(field);
    groups.set(key, existing);
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/*  Source badge                                                        */
/* ------------------------------------------------------------------ */

function SourceBadge({ source }: { source: "Form" | "File" | "MLS" }) {
  return (
    <Badge className="text-xs !px-1.5 !py-0">{source}</Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Field card                                                         */
/* ------------------------------------------------------------------ */

function FieldCard({
  field,
  selected,
  onSelect,
  pinned,
  onTogglePin,
}: {
  field: FormField;
  selected?: boolean;
  onSelect?: () => void;
  pinned?: boolean;
  onTogglePin?: () => void;
}) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const formValues = toArray(field.formValue);
  const fileValues = toArray(field.fileValue);
  const mlsValues = toArray(field.mlsValue);
  const isEmpty = formValues.length === 0 || formValues.every((v) => !v);
  const showSources = hasSources(field);

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
      {/* Header: label + pin icon */}
      <div className="flex items-center gap-2">
        <span
          className={`text-base font-bold leading-6 ${
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
        {onTogglePin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className="ml-auto shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors text-grey-700 hover:bg-grey-100"
            title={pinned ? "Unpin from Transaction tab" : "Pin to Transaction tab"}
          >
            {pinned ? <PinFilledIcon className="w-3.5 h-3.5" /> : <PinIcon className="w-3.5 h-3.5" />}
            <span className="text-xs font-medium">{pinned ? "Unpin" : "Pin"}</span>
          </button>
        )}
      </div>

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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section icon                                                       */
/* ------------------------------------------------------------------ */

function sectionIcon(fields: FormField[]) {
  const hasFlag = fields.some((f) => f.mismatch);
  return hasFlag ? (
    <WarningIcon className="w-4 h-4 text-orange-200" />
  ) : (
    <CheckIcon className="w-4 h-4 text-green-600" />
  );
}

/* ------------------------------------------------------------------ */
/*  Search helper                                                      */
/* ------------------------------------------------------------------ */

export function fieldMatches(field: FormField, query: string): boolean {
  const q = query.toLowerCase();
  const texts = [
    field.label,
    ...toArray(field.formValue),
    ...toArray(field.fileValue),
    ...toArray(field.mlsValue),
    field.page ?? "",
  ];
  return texts.some((t) => t.toLowerCase().includes(q));
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

interface FormDataByPageProps {
  selectedFormField?: string | null;
  onFormFieldSelect?: (label: string) => void;
  pinnedFields?: Set<string>;
  onTogglePin?: (label: string) => void;
}

export default function FormDataByPage({
  selectedFormField,
  onFormFieldSelect,
  pinnedFields,
  onTogglePin,
}: FormDataByPageProps) {
  const pageGroups = groupByPage(ALL_FIELDS);
  const selectedRef = useRef<HTMLDivElement>(null);

  // Scroll selected card into view when selectedFormField changes externally
  useEffect(() => {
    if (selectedFormField && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedFormField]);

  return (
    <>
      {Array.from(pageGroups.entries()).map(([page, fields]) => (
        <Collapsible
          key={page}
          title={page}
          icon={sectionIcon(fields)}
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
                  pinned={pinnedFields?.has(field.label)}
                  onTogglePin={onTogglePin ? () => onTogglePin(field.label) : undefined}
                />
              </div>
            ))}
          </div>
        </Collapsible>
      ))}
    </>
  );
}
