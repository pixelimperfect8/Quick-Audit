"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Collapsible, HoverCard } from "@/components/ui";
import {
  WarningIcon,
  CheckIcon,
  PersonIcon,
} from "@/components/icons";
import { ALL_FIELDS, toArray } from "./FormDataByPage";
import SourceTooltip from "./SourceTooltip";
import {
  TRANSACTION_SOURCES,
  CONTACT_SOURCES,
  type SourceData,
} from "./Option2TransactionSources";
import { FLAG_ISSUES, type FlagIssue } from "./flagsData";
import {
  SECTION_LABELS,
  DEFAULT_SECTION_ORDER,
  ALL_SUMMARY_DETAILS,
  ALL_DATES,
  ALL_CONTACTS,
  DEFAULT_COMMISSION,
  type SectionId,
} from "./SmartAssistOption2TransactionContent";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

type FormField = (typeof ALL_FIELDS)[number];

/** Map ALL_FIELDS labels → section id (used for filtering Issues/Checks lists) */
const FIELD_TO_SECTION: Record<string, SectionId> = {
  "Property Address": "summary",
  "Seller Brokerage": "summary",
  "Seller Broker License": "summary",
  "Buyer Brokerage": "summary",
  "Buyer Broker License": "summary",
  "Rep Type": "summary",
  "Loan Type": "summary",
  "Home Warranty": "summary",
  "Property Type": "summary",
  "Purchase Price": "summary",
  "Seller Agent": "summary",
  "Seller Agent License": "summary",
  "Year Built": "summary",
  "Close of Escrow": "dates",
  "Loan Contingency": "dates",
  "Appraisal Contingency": "dates",
  "Investigation Contingency": "dates",
  "Buyer(s)": "contacts",
  "Seller(s)": "contacts",
  "Buyer Agent": "contacts",
  "Buyer Agent License": "contacts",
  "Seller Payment to Buyer Broker": "commission",
};

/* ------------------------------------------------------------------ */
/*  Status badge                                                       */
/* ------------------------------------------------------------------ */

function StatusPill({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-0.5 text-sm font-medium text-yellow-900">
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Label / value row with source tooltip                              */
/* ------------------------------------------------------------------ */

function DataRow({
  label,
  value,
  isLink,
  isStatus,
  sourceData,
}: {
  label: string;
  value: string;
  isLink?: boolean;
  isStatus?: boolean;
  sourceData?: SourceData;
}) {
  const hasMismatch = !!sourceData?.mismatch;
  const mismatchMark = "rounded-sm bg-red-50 px-0.5 -mx-0.5";

  const labelEl = (
    <span className="text-grey-900 text-base font-bold w-[120px] shrink-0 leading-6">
      <span className={hasMismatch ? mismatchMark : ""}>{label}</span>
    </span>
  );

  const valueEl = isStatus ? (
    <StatusPill value={value} />
  ) : isLink ? (
    <a
      href="#"
      className="text-grey-900 text-base font-medium leading-6 underline break-all min-w-0 flex-1"
    >
      <span className={hasMismatch ? mismatchMark : ""}>{value}</span>
    </a>
  ) : (
    <span className="text-grey-900 text-base font-medium leading-6 break-words min-w-0 flex-1">
      <span className={hasMismatch ? mismatchMark : ""}>{value}</span>
    </span>
  );

  const row = (
    <div className="flex items-start gap-3 cursor-pointer px-2 -mx-2 py-0.5 rounded transition-colors hover:bg-grey-50">
      {labelEl}
      {valueEl}
    </div>
  );

  // Wrap with source tooltip when source data exists
  if (sourceData) {
    return (
      <HoverCard
        trigger={row}
        side="top"
        align="center"
        className="w-64"
      >
        <SourceTooltip label={label} data={sourceData} />
      </HoverCard>
    );
  }

  return row;
}

/* ------------------------------------------------------------------ */
/*  Contact row                                                        */
/* ------------------------------------------------------------------ */

function ContactRow({
  role,
  name,
  type,
  onClick,
}: {
  role: string;
  name: string;
  type?: string;
  onClick?: (contact: { role: string; name: string; type?: string }) => void;
}) {
  const sourceData = CONTACT_SOURCES[name];
  const hasMismatch = !!sourceData?.mismatch;
  const contactMark = hasMismatch ? "rounded-sm bg-red-50 px-0.5" : "";
  const body = (
    <div className="flex items-start gap-3 px-2 -mx-2 py-0.5 rounded transition-colors hover:bg-grey-50">
      <span className="text-grey-900 text-base font-bold w-[120px] shrink-0 leading-6">
        {role}
      </span>
      <button
        type="button"
        onClick={() => onClick?.({ role, name, type })}
        className="flex items-center gap-1.5 min-w-0 flex-1 text-left hover:opacity-80 transition-opacity cursor-pointer"
      >
        <PersonIcon className="w-4 h-4 text-grey-700 shrink-0" />
        <span className={`text-grey-900 text-base font-medium leading-6 ${contactMark}`}>
          {name}
        </span>
      </button>
    </div>
  );

  if (sourceData) {
    return (
      <HoverCard trigger={body} side="top" align="center" className="w-64">
        <SourceTooltip label={name} data={sourceData} />
      </HoverCard>
    );
  }
  return body;
}

/* ------------------------------------------------------------------ */
/*  Issue row with hover tooltip                                        */
/* ------------------------------------------------------------------ */

function IssueRow({
  issue,
  selected,
  onClick,
}: {
  issue: FlagIssue;
  selected?: boolean;
  onClick?: () => void;
}) {
  const tooltipContent = (
    <div className="w-60 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <WarningIcon className="w-3.5 h-3.5 text-orange-200 shrink-0" />
        <span className="text-grey-900 text-sm font-bold leading-5">
          Flag details
        </span>
      </div>
      <p className="text-grey-900 text-sm font-medium leading-5 mb-2">
        {issue.description}
      </p>
      {issue.sources && issue.sources.length > 0 && (
        <div className="flex flex-col gap-1 pt-2 border-t border-grey-200">
          {issue.sources.map((src) => (
            <div key={src.label} className="flex items-baseline gap-2">
              <span className="text-grey-800 text-sm font-medium uppercase tracking-wide shrink-0 whitespace-nowrap">
                {src.label}
              </span>
              <span className="text-grey-900 text-sm font-medium leading-5 min-w-0 flex-1">
                {src.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const trigger = (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 cursor-pointer min-w-0 px-4 py-1 -mx-4 rounded-sm transition-colors ${
        selected ? "bg-red-50" : "hover:bg-grey-50"
      }`}
    >
      <WarningIcon className="w-4 h-4 text-orange-200 shrink-0" />
      <span className="text-grey-900 text-base font-medium leading-6 min-w-0 flex-1 truncate">
        {issue.description}
      </span>
    </div>
  );

  return (
    <HoverCard trigger={trigger} side="top" align="left">
      {tooltipContent}
    </HoverCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Successful check row with hover tooltip                             */
/* ------------------------------------------------------------------ */

function CheckRow({
  field,
  selected,
  onClick,
}: {
  field: FormField;
  selected?: boolean;
  onClick?: () => void;
}) {
  const formValues = toArray(field.formValue);
  const fileValues = toArray(field.fileValue);
  const mlsValues = toArray(field.mlsValue);

  const tooltipContent = (
    <div className="w-60 p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <CheckIcon className="w-3.5 h-3.5 text-green-600 shrink-0" />
        <span className="text-grey-900 text-sm font-bold leading-5">
          {field.label}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {formValues.length > 0 && formValues.some(Boolean) && (
          <div className="flex items-baseline gap-2">
            <span className="text-grey-800 text-sm font-medium uppercase tracking-wide shrink-0 w-10">
              Form
            </span>
            <span className="text-grey-900 text-sm font-medium leading-5">
              {formValues.join(", ")}
            </span>
          </div>
        )}
        {fileValues.length > 0 && fileValues.some(Boolean) && (
          <div className="flex items-baseline gap-2">
            <span className="text-grey-800 text-sm font-medium uppercase tracking-wide shrink-0 w-10">
              File
            </span>
            <span className="text-grey-900 text-sm font-medium leading-5">
              {fileValues.join(", ")}
            </span>
          </div>
        )}
        {mlsValues.length > 0 && mlsValues.some(Boolean) && (
          <div className="flex items-baseline gap-2">
            <span className="text-grey-800 text-sm font-medium uppercase tracking-wide shrink-0 w-10">
              MLS
            </span>
            <span className="text-grey-900 text-sm font-medium leading-5">
              {mlsValues.join(", ")}
            </span>
          </div>
        )}
      </div>
      {field.page && (
        <p className="text-grey-600 text-sm mt-2 pt-2 border-t border-grey-200">
          {field.page}
        </p>
      )}
    </div>
  );

  const trigger = (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 cursor-pointer min-w-0 px-4 py-1 -mx-4 rounded-sm transition-colors ${
        selected ? "bg-green-50/25" : "hover:bg-grey-50"
      }`}
    >
      <CheckIcon className="w-4 h-4 text-green-600 shrink-0" />
      <span className="text-grey-900 text-base font-medium leading-6 min-w-0 flex-1">
        {field.label}
      </span>
    </div>
  );

  return (
    <HoverCard trigger={trigger} side="top" align="left">
      {tooltipContent}
    </HoverCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Section tab bar — underlined tabs                                   */
/* ------------------------------------------------------------------ */

function SectionTabBar({
  activeSection,
  onChange,
  sectionOrder,
}: {
  activeSection: SectionId;
  onChange: (id: SectionId) => void;
  sectionOrder: SectionId[];
}) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-grey-300 flex items-center px-2">
      {sectionOrder.map((id) => {
        const isActive = activeSection === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-1 px-2 py-3 border-b-2 text-sm transition-colors whitespace-nowrap ${
              isActive
                ? "border-blue-800 text-blue-800 font-bold"
                : "border-transparent text-grey-800 hover:text-grey-900 font-medium"
            }`}
          >
            {id === "summary" ? "Summary" : SECTION_LABELS[id]}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section content renderers                                          */
/* ------------------------------------------------------------------ */

function SummaryTabContent({
  hiddenFields,
  fieldOrder,
}: {
  hiddenFields: Set<string>;
  fieldOrder?: string[];
}) {
  const ordered = fieldOrder
    ? (fieldOrder
        .map((key) => ALL_SUMMARY_DETAILS.find((d) => d.label === key))
        .filter(Boolean) as typeof ALL_SUMMARY_DETAILS)
    : ALL_SUMMARY_DETAILS;
  return (
    <div className="px-4 py-4 flex flex-col gap-1 border-b border-grey-300">
      {ordered
        .filter((d) => !hiddenFields.has(d.label))
        .map((detail) => (
          <DataRow
            key={detail.label}
            label={detail.label}
            value={detail.value}
            isLink={detail.isLink}
            isStatus={detail.label === "Status"}
            sourceData={TRANSACTION_SOURCES[detail.label]}
          />
        ))}
    </div>
  );
}

function DatesTabContent({
  hiddenFields,
  fieldOrder,
}: {
  hiddenFields: Set<string>;
  fieldOrder?: string[];
}) {
  const ordered = fieldOrder
    ? (fieldOrder
        .map((key) => ALL_DATES.find((d) => d.label === key))
        .filter(Boolean) as typeof ALL_DATES)
    : ALL_DATES;
  return (
    <div className="px-4 py-4 flex flex-col gap-1 border-b border-grey-300">
      {ordered
        .filter((d) => !hiddenFields.has(d.label))
        .map((detail) => (
          <DataRow
            key={detail.label}
            label={detail.label}
            value={detail.value}
            sourceData={TRANSACTION_SOURCES[detail.label]}
          />
        ))}
    </div>
  );
}

function ContactsTabContent({
  hiddenFields,
  fieldOrder,
  onContactClick,
}: {
  hiddenFields: Set<string>;
  fieldOrder?: string[];
  onContactClick?: (contact: { role: string; name: string; type?: string }) => void;
}) {
  const ordered = fieldOrder
    ? (fieldOrder
        .map((key) => ALL_CONTACTS.find((c) => c.name === key))
        .filter(Boolean) as typeof ALL_CONTACTS)
    : ALL_CONTACTS;
  return (
    <div className="px-4 py-4 flex flex-col gap-1 border-b border-grey-300">
      {ordered
        .filter((c) => !hiddenFields.has(c.name))
        .map((contact) => (
          <ContactRow
            key={contact.name}
            role={contact.role}
            name={contact.name}
            type={contact.type}
            onClick={onContactClick}
          />
        ))}
    </div>
  );
}

function CommissionTabContent({
  hiddenFields,
  fieldOrder,
}: {
  hiddenFields: Set<string>;
  fieldOrder?: string[];
}) {
  const ordered = fieldOrder
    ? (fieldOrder
        .map((key) => DEFAULT_COMMISSION.find((c) => c.label === key))
        .filter(Boolean) as typeof DEFAULT_COMMISSION)
    : DEFAULT_COMMISSION;
  return (
    <div className="px-4 py-4 flex flex-col gap-1 border-b border-grey-300">
      {ordered
        .filter((r) => !hiddenFields.has(r.label))
        .map((row) => (
          <DataRow key={row.label} label={row.label} value={row.value} />
        ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

interface FormDataBySectionTabsProps {
  selectedFormField?: string | null;
  onFormFieldSelect?: (label: string) => void;
  selectedFlagId?: string | null;
  onFlagSelect?: (id: string) => void;
  onContactClick?: (contact: { role: string; name: string; type?: string }) => void;
  hiddenFields?: Set<string>;
  hiddenSections?: Set<string>;
  sectionOrder?: SectionId[];
  fieldOrder?: Record<string, string[]>;
  /** One-shot section switch — consumer should reset after it handles the change */
  externalSection?: SectionId | null;
  onExternalSectionHandled?: () => void;
}

export default function FormDataBySectionTabs({
  selectedFormField,
  onFormFieldSelect,
  selectedFlagId,
  onFlagSelect,
  onContactClick,
  hiddenFields = new Set(),
  hiddenSections = new Set(),
  sectionOrder = [...DEFAULT_SECTION_ORDER],
  fieldOrder,
  externalSection,
  onExternalSectionHandled,
}: FormDataBySectionTabsProps) {
  const visibleSections = useMemo(
    () => sectionOrder.filter((s) => !hiddenSections.has(s)),
    [sectionOrder, hiddenSections],
  );

  const [activeSection, setActiveSection] = useState<SectionId>(
    visibleSections[0] ?? "summary",
  );

  // Keep active section valid when visibility changes
  useMemo(() => {
    if (visibleSections.length === 0) return;
    if (!visibleSections.includes(activeSection)) {
      setActiveSection(visibleSections[0]);
    }
  }, [visibleSections, activeSection]);

  // Switch to the section containing the selected field
  useMemo(() => {
    if (!selectedFormField) return;
    const s = FIELD_TO_SECTION[selectedFormField];
    if (s && visibleSections.includes(s)) setActiveSection(s);
  }, [selectedFormField, visibleSections]);

  // Handle external (one-shot) section requests — e.g. from unified search clicks
  useEffect(() => {
    if (!externalSection) return;
    if (visibleSections.includes(externalSection)) {
      setActiveSection(externalSection);
    }
    onExternalSectionHandled?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSection]);

  // Scroll selected issue / check row into view when selection changes externally
  const selectedIssueRef = useRef<HTMLDivElement>(null);
  const selectedCheckRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedFlagId && selectedIssueRef.current) {
      selectedIssueRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedFlagId]);
  useEffect(() => {
    if (selectedFormField && selectedCheckRef.current) {
      selectedCheckRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedFormField]);

  // Global lists — shared across tabs
  const issues = FLAG_ISSUES;
  const successfulChecks = useMemo(
    () => ALL_FIELDS.filter((f) => !f.mismatch),
    [],
  );

  return (
    <div className="flex flex-col">
      <SectionTabBar
        activeSection={activeSection}
        onChange={setActiveSection}
        sectionOrder={visibleSections}
      />

      {/* Top data rows per section */}
      {activeSection === "summary" && (
        <SummaryTabContent
          hiddenFields={hiddenFields}
          fieldOrder={fieldOrder?.summary}
        />
      )}
      {activeSection === "dates" && (
        <DatesTabContent
          hiddenFields={hiddenFields}
          fieldOrder={fieldOrder?.dates}
        />
      )}
      {activeSection === "contacts" && (
        <ContactsTabContent
          hiddenFields={hiddenFields}
          fieldOrder={fieldOrder?.contacts}
          onContactClick={onContactClick}
        />
      )}
      {activeSection === "commission" && (
        <CommissionTabContent
          hiddenFields={hiddenFields}
          fieldOrder={fieldOrder?.commission}
        />
      )}

      {/* Issues (global) */}
      <Collapsible
        title={`Issues (${issues.length})`}
        icon={<WarningIcon className="w-4 h-4 text-orange-200" />}
        defaultOpen
      >
        <div className="flex flex-col gap-1">
          {issues.map((issue) => (
            <div
              key={issue.id}
              ref={issue.id === selectedFlagId ? selectedIssueRef : undefined}
            >
              <IssueRow
                issue={issue}
                selected={issue.id === selectedFlagId}
                onClick={() => onFlagSelect?.(issue.id)}
              />
            </div>
          ))}
        </div>
      </Collapsible>

      {/* Successful checks (global) */}
      <Collapsible
        title={`Successful checks (${successfulChecks.length})`}
        icon={<CheckIcon className="w-4 h-4 text-green-600" />}
        defaultOpen
      >
        <div className="flex flex-col gap-1">
          {successfulChecks.map((field) => (
            <div
              key={field.label}
              ref={field.label === selectedFormField ? selectedCheckRef : undefined}
            >
              <CheckRow
                field={field}
                selected={field.label === selectedFormField}
                onClick={() => onFormFieldSelect?.(field.label)}
              />
            </div>
          ))}
        </div>
      </Collapsible>
    </div>
  );
}
