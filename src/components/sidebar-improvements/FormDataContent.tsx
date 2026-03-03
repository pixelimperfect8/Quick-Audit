"use client";

import { useState, useRef, useEffect } from "react";
import { Collapsible, Badge } from "@/components/ui";
import { WarningIcon, CheckIcon, ChevronDown, ChevronUp, SearchIcon, CloseIcon } from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  Data types                                                         */
/* ------------------------------------------------------------------ */

interface FormField {
  label: string;
  /** Primary value extracted from the form */
  formValue?: string | string[];
  /** Comparison value(s) from file */
  fileValue?: string | string[];
  /** Comparison value(s) from MLS */
  mlsValue?: string | string[];
  /** True when sources disagree or a required value is missing */
  mismatch?: boolean;
  /** If the value was only found in a single source (no comparison available) */
  sourceOnly?: "Form" | "File" | "MLS";
  /** Page reference */
  page?: string;
}

/* ------------------------------------------------------------------ */
/*  Sample extracted data                                              */
/* ------------------------------------------------------------------ */

const PROPERTY_INFO: FormField[] = [
  {
    label: "Property Address",
    formValue: "3969 Harvord Boulevard, Venture, CA 93001",
    fileValue: "3969 Harvord Boulevard, Venture, CA 93001",
    mlsValue: "3969 Harvord Boulevard, Venture, CA 93001",
    mismatch: false,
    page: "RPA p.1",
  },
  {
    label: "Purchase Price",
    formValue: "$500,000.00",
    fileValue: "$450,000.00",
    mismatch: true,
    page: "RPA p.1, §A",
  },
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
  {
    label: "Loan Type",
    formValue: "Conventional",
    sourceOnly: "Form",
    page: "RPA p.1, §E",
  },
];

const PARTIES: FormField[] = [
  {
    label: "Buyer(s)",
    formValue: ["Rachael Laurella", "Rob Laurella"],
    fileValue: ["Rachel Laurella", "Rob Laurella"],
    mismatch: true,
    page: "RPA p.1",
  },
  {
    label: "Seller(s)",
    formValue: ["James Thompson", "Mary Thompson"],
    fileValue: ["James Thompson", "Mary Thompson"],
    mismatch: false,
    page: "RPA p.16",
  },
];

const AGENCY: FormField[] = [
  {
    label: "Seller Brokerage",
    formValue: "Keller Williams Realty",
    sourceOnly: "Form",
    page: "RPA p.1, §2A",
  },
  {
    label: "Seller Broker License",
    formValue: "DRE #01234567",
    sourceOnly: "Form",
    page: "RPA p.1, §2A",
  },
  {
    label: "Buyer Brokerage",
    formValue: "Compass Real Estate",
    sourceOnly: "Form",
    page: "RPA p.1, §2B",
  },
  {
    label: "Buyer Broker License",
    formValue: "",
    mismatch: true,
    page: "RPA p.1, §2B",
  },
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
  {
    label: "Rep Type",
    formValue: "Seller only",
    sourceOnly: "Form",
    page: "RPA p.1, §2B",
  },
  {
    label: "Seller Payment to Buyer Broker",
    formValue: "2.5%",
    sourceOnly: "Form",
    page: "RPA p.1",
  },
];

const TERMS: FormField[] = [
  {
    label: "Close of Escrow",
    formValue: "11/29/2023",
    fileValue: "11/29/2023",
    page: "RPA p.1, §C",
  },
  {
    label: "Loan Contingency",
    formValue: "21 days",
    sourceOnly: "Form",
    page: "RPA p.2, §L1",
  },
  {
    label: "Appraisal Contingency",
    formValue: "17 days",
    sourceOnly: "Form",
    page: "RPA p.2, §L2",
  },
  {
    label: "Investigation Contingency",
    formValue: "17 days",
    sourceOnly: "Form",
    page: "RPA p.2, §L3",
  },
  {
    label: "Home Warranty",
    formValue: "Yes — ordered",
    sourceOnly: "Form",
    page: "RPA p.3, §Q18",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toArray(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

/** Whether the field has file or MLS data to show in Sources */
function hasSources(field: FormField): boolean {
  return !!(
    (field.fileValue && toArray(field.fileValue).some(Boolean)) ||
    (field.mlsValue && toArray(field.mlsValue).some(Boolean))
  );
}

/* ------------------------------------------------------------------ */
/*  Source badge component                                             */
/* ------------------------------------------------------------------ */

function SourceBadge({ source }: { source: "Form" | "File" | "MLS" }) {
  return (
    <Badge className="text-xs !px-1.5 !py-0">{source}</Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Field card component                                               */
/* ------------------------------------------------------------------ */

function FieldCard({ field }: { field: FormField }) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const formValues = toArray(field.formValue);
  const fileValues = toArray(field.fileValue);
  const mlsValues = toArray(field.mlsValue);
  const isEmpty = formValues.length === 0 || formValues.every((v) => !v);
  const showSources = hasSources(field);

  return (
    <div
      className={`rounded-lg border p-4 ${
        field.mismatch
          ? "border-red-400"
          : "border-grey-300"
      }`}
    >
      {/* Header: label + source badge or page ref */}
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
        <span className="ml-auto shrink-0">
          {field.sourceOnly ? (
            <SourceBadge source={field.sourceOnly} />
          ) : field.page ? (
            <Badge className="text-xs !px-1.5 !py-0">{field.page}</Badge>
          ) : null}
        </span>
      </div>

      {/* Form value(s) */}
      <div className="mt-1.5">
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

      {/* Sources toggle + content */}
      {showSources && (
        <>
          <button
            onClick={() => setSourcesOpen(!sourcesOpen)}
            className="flex items-center gap-1.5 mt-3 text-grey-800 text-sm font-medium hover:text-grey-900 transition-colors"
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
                  <p className="text-grey-900 text-sm font-bold leading-5">
                    File:
                  </p>
                  {fileValues.map((val, i) => (
                    <p
                      key={i}
                      className="text-grey-800 text-sm font-medium leading-5"
                    >
                      {val}
                    </p>
                  ))}
                </div>
              )}
              {mlsValues.length > 0 && mlsValues.some(Boolean) && (
                <div>
                  <p className="text-grey-900 text-sm font-bold leading-5">
                    MLS:
                  </p>
                  {mlsValues.map((val, i) => (
                    <p
                      key={i}
                      className="text-grey-800 text-sm font-medium leading-5"
                    >
                      {val}
                    </p>
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
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

function sectionIcon(fields: FormField[]) {
  const hasFlag = fields.some((f) => f.mismatch);
  return hasFlag ? (
    <WarningIcon className="w-4 h-4 text-orange-200" />
  ) : (
    <CheckIcon className="w-4 h-4 text-green-600" />
  );
}

/** Check if a field matches a search query (case-insensitive) */
function fieldMatches(field: FormField, query: string): boolean {
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

/** Render a section only if it has matching fields */
function FilteredSection({
  title,
  fields,
  query,
  defaultOpen,
}: {
  title: string;
  fields: FormField[];
  query: string;
  defaultOpen: boolean;
}) {
  const filtered = query ? fields.filter((f) => fieldMatches(f, query)) : fields;
  if (filtered.length === 0) return null;
  return (
    <Collapsible title={title} icon={sectionIcon(fields)} defaultOpen={query ? true : defaultOpen}>
      <div className="flex flex-col gap-3">
        {filtered.map((field) => (
          <FieldCard key={field.label} field={field} />
        ))}
      </div>
    </Collapsible>
  );
}

export default function FormDataContent() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = focused || !!query;

  function handleCancel() {
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
  }

  // Count total results when searching
  const allSections = [PROPERTY_INFO, PARTIES, AGENCY, TERMS];
  const totalResults = query
    ? allSections.flat().filter((f) => fieldMatches(f, query)).length
    : 0;

  return (
    <>
      {/* Search bar — always visible, border goes edge-to-edge */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          isActive ? "border-blue-800" : "border-grey-300"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search..."
          className="flex-1 text-base font-medium text-grey-900 placeholder:text-grey-800 outline-none bg-transparent leading-6"
        />
        {query && (
          <span className="text-grey-800 text-xs shrink-0 ml-2">
            {totalResults} {totalResults === 1 ? "result" : "results"}
          </span>
        )}
        {isActive ? (
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleCancel}
            className="text-grey-700 hover:text-grey-900 shrink-0 ml-2"
            aria-label="Cancel search"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        ) : (
          <SearchIcon className="w-[18px] h-[18px] text-grey-800 shrink-0 ml-2" />
        )}
      </div>

      <FilteredSection title="Property Information" fields={PROPERTY_INFO} query={query} defaultOpen={false} />
      <FilteredSection title="Contacts" fields={PARTIES} query={query} defaultOpen={false} />
      <FilteredSection title="Agency & Brokerage" fields={AGENCY} query={query} defaultOpen={false} />
      <FilteredSection title="Terms & Contingencies" fields={TERMS} query={query} defaultOpen={false} />

      {query && totalResults === 0 && (
        <div className="px-4 py-8 text-center">
          <p className="text-grey-800 text-sm">No fields match &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </>
  );
}
