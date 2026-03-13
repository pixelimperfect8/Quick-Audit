"use client";

import { PersonIcon } from "@/components/icons";
import { Collapsible, DetailRow, Badge, HoverCard } from "@/components/ui";
import { toArray } from "./FormDataByPage";
import type { FormFieldHighlight } from "./FormDataByPage";
import SourceTooltip from "./SourceTooltip";
import {
  TRANSACTION_SOURCES,
  CONTACT_SOURCES,
} from "./Option2TransactionSources";
import { FLAG_ISSUES } from "./flagsData";

/* ------------------------------------------------------------------ */
/*  Data (same defaults as TransactionContent)                         */
/* ------------------------------------------------------------------ */

interface DetailData {
  label: string;
  value: string;
  isLink?: boolean;
}

interface Contact {
  role: string;
  name: string;
  type?: string;
}

interface CommissionData {
  label: string;
  value: string;
}

export const DEFAULT_DETAILS: DetailData[] = [
  { label: "Status", value: "Pending" },
  { label: "File name", value: "3969 Harvord Boulevard, Venture, CA 93001" },
  { label: "Type", value: "Purchase" },
  { label: "Checklist Type", value: "New Home" },
  { label: "Agent", value: "Aaron Smith" },
  { label: "MLS #", value: "1234567" },
  { label: "Close of Escrow", value: "11/29/2023" },
  { label: "Acceptance Date", value: "11/24/2023" },
  { label: "Escrow #", value: "1234567" },
  { label: "Email", value: "456had...kyslope.com", isLink: true },
  { label: "Year Built", value: "1965" },
  { label: "Purchase Price", value: "$450,000.00" },
  { label: "File ID", value: "1234567" },
];

/** Extra summary fields from form extraction — hidden by default, toggleable in Edit Summary */
export const EXTRA_SUMMARY_DETAILS: DetailData[] = [
  { label: "Property Type", value: "Single Family Residence" },
  { label: "Seller Brokerage", value: "Keller Williams Realty" },
  { label: "Seller Broker License", value: "DRE #01234567" },
  { label: "Buyer Brokerage", value: "Compass Real Estate" },
  { label: "Buyer Broker License", value: "—" },
  { label: "Rep Type", value: "Seller only" },
  { label: "Seller Payment to Buyer Broker", value: "2.5%" },
  { label: "Loan Type", value: "Conventional" },
  { label: "Home Warranty", value: "Yes — ordered" },
  { label: "Seller Agent License", value: "DRE #09876543" },
  { label: "Buyer Agent License", value: "DRE #05647382" },
];

/** All summary details (default + extras, excluding date fields which are in their own section) */
export const ALL_SUMMARY_DETAILS: DetailData[] = [...DEFAULT_DETAILS.filter(
  (d) => !["Close of Escrow", "Acceptance Date"].includes(d.label)
), ...EXTRA_SUMMARY_DETAILS];

/** Default date fields */
export const DEFAULT_DATES: DetailData[] = [
  { label: "Close of Escrow", value: "11/29/2023" },
  { label: "Acceptance Date", value: "11/24/2023" },
];

/** Extra date fields from form extraction — hidden by default */
export const EXTRA_DATES: DetailData[] = [
  { label: "Loan Contingency", value: "21 days" },
  { label: "Appraisal Contingency", value: "17 days" },
  { label: "Investigation Contingency", value: "17 days" },
];

/** All date fields */
export const ALL_DATES: DetailData[] = [...DEFAULT_DATES, ...EXTRA_DATES];

export const DEFAULT_CONTACTS: Contact[] = [
  { role: "Buyer", name: "Rachael Laurolla" },
  { role: "Buyer", name: "Rob Laurolla" },
  { role: "Lender", name: "Mark Roberts", type: "lender" },
];

/** Extra contacts from form extraction — hidden by default */
export const EXTRA_CONTACTS: Contact[] = [
  { role: "Seller", name: "James Thompson" },
  { role: "Seller", name: "Mary Thompson" },
  { role: "Buyer Agent", name: "Lisa Chen" },
];

/** All contacts (default + extras) */
export const ALL_CONTACTS: Contact[] = [...DEFAULT_CONTACTS, ...EXTRA_CONTACTS];

/** Fields that start hidden by default (extras from form extraction) */
export const DEFAULT_HIDDEN_FIELDS = new Set([
  ...EXTRA_SUMMARY_DETAILS.map((d) => d.label),
  ...EXTRA_DATES.map((d) => d.label),
  ...EXTRA_CONTACTS.map((c) => c.name),
]);

export const DEFAULT_COMMISSION: CommissionData[] = [
  { label: "Sale", value: "$99,999.99" },
  { label: "Listing", value: "$99,999.99" },
  { label: "Office gross", value: "$99,999.99" },
  { label: "TC", value: "$1,000" },
  { label: "Referral Agent", value: "$3,000" },
  { label: "Other deductions", value: "$600" },
];

/* Shared rows that appear in both flat and tiered views */
const SHARED_COMMISSION: CommissionData[] = [
  { label: "Office gross", value: "$99,999.99" },
  { label: "TC", value: "$1,000" },
  { label: "Referral Agent", value: "$3,000" },
  { label: "Other deductions", value: "$600" },
];

interface TieredRow {
  rate: string;
  description: string;
  threshold: string;
}

interface TieredCommissionGroup {
  label: string;
  tiers: TieredRow[];
  additional: string;
}

const TIERED_COMMISSION: TieredCommissionGroup[] = [
  {
    label: "Sale commission",
    tiers: [
      { rate: "2.5%", description: "for the first", threshold: "$100,000" },
      { rate: "1.5%", description: "for the remaining balance", threshold: "" },
    ],
    additional: "$500",
  },
  {
    label: "Listing commission",
    tiers: [
      { rate: "3.0%", description: "for the first", threshold: "$100,000" },
      { rate: "2.0%", description: "for the remaining balance", threshold: "" },
    ],
    additional: "$750",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Returns true if the field still has an active (non-rejected) flag.
 * Falls back to the static mismatch value from source data when no flags
 * reference this field.
 */
function isFieldStillFlagged(
  fieldKey: string,
  rejectedFlagIds: Set<string>,
  sourceMap: Record<string, { mismatch?: boolean }>,
): boolean {
  const relatedFlags = FLAG_ISSUES.filter((f) =>
    f.relatedFields?.includes(fieldKey),
  );
  // No flags reference this field — use static mismatch from source data
  if (relatedFlags.length === 0) return sourceMap[fieldKey]?.mismatch ?? false;
  // At least one related flag is still active → still flagged
  return relatedFlags.some((f) => !rejectedFlagIds.has(f.id));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */


/** Default section order */
export const DEFAULT_SECTION_ORDER = ["summary", "dates", "contacts", "commission"] as const;
export type SectionId = (typeof DEFAULT_SECTION_ORDER)[number];

/** Section display names */
export const SECTION_LABELS: Record<SectionId, string> = {
  summary: "Transaction Summary",
  dates: "Dates",
  contacts: "Contacts",
  commission: "Commission",
};

/** All field keys by section (used for edit mode — includes extras) */
export const SECTION_FIELDS: Record<SectionId, string[]> = {
  summary: ALL_SUMMARY_DETAILS.map((d) => d.label),
  dates: ALL_DATES.map((d) => d.label),
  contacts: ALL_CONTACTS.map((c) => c.name),
  commission: DEFAULT_COMMISSION.map((c) => c.label),
};

interface Option2TransactionContentProps {
  onContactClick?: (contact: Contact) => void;
  onViewLog?: () => void;
  /** Set of rejected flag IDs — suppresses mismatch highlighting */
  rejectedFlagIds?: Set<string>;
  /** Show tiered commission breakdown */
  tieredCommission?: boolean;
  /** Set of hidden field keys (labels/names) */
  hiddenFields?: Set<string>;
  /** Set of hidden section IDs */
  hiddenSections?: Set<string>;
  /** Custom section ordering */
  sectionOrder?: SectionId[];
  /** Per-section field ordering (keys are section IDs, values are ordered field keys) */
  fieldOrder?: Record<string, string[]>;
  /** Callback to open hidden data drawer */
  onViewHiddenData?: () => void;
}

export default function SmartAssistOption2TransactionContent({
  onContactClick,
  onViewLog,
  rejectedFlagIds = new Set(),
  tieredCommission = false,
  hiddenFields = new Set(),
  hiddenSections = new Set(),
  sectionOrder = [...DEFAULT_SECTION_ORDER],
  fieldOrder,
  onViewHiddenData,
}: Option2TransactionContentProps) {
  const hasHiddenItems = hiddenFields.size > 0 || hiddenSections.size > 0;

  // Section renderers
  // Apply field ordering if provided
  const orderedDetails = fieldOrder?.summary
    ? fieldOrder.summary.map((key) => ALL_SUMMARY_DETAILS.find((d) => d.label === key)).filter(Boolean) as typeof ALL_SUMMARY_DETAILS
    : ALL_SUMMARY_DETAILS;
  const orderedDates = fieldOrder?.dates
    ? fieldOrder.dates.map((key) => ALL_DATES.find((d) => d.label === key)).filter(Boolean) as typeof ALL_DATES
    : ALL_DATES;
  const orderedContacts = fieldOrder?.contacts
    ? fieldOrder.contacts.map((key) => ALL_CONTACTS.find((c) => c.name === key)).filter(Boolean) as typeof ALL_CONTACTS
    : ALL_CONTACTS;
  const orderedCommission = fieldOrder?.commission
    ? fieldOrder.commission.map((key) => DEFAULT_COMMISSION.find((c) => c.label === key)).filter(Boolean) as typeof DEFAULT_COMMISSION
    : DEFAULT_COMMISSION;

  const renderSummary = () => (
    <Collapsible title="Transaction Summary" defaultOpen>
      {orderedDetails.filter((d) => !hiddenFields.has(d.label)).map((detail) => {
        const sourceData = TRANSACTION_SOURCES[detail.label];
        const hasMismatch = isFieldStillFlagged(detail.label, rejectedFlagIds, TRANSACTION_SOURCES);
        const mismatchMark = "rounded-sm bg-red-50 px-0.5 -mx-0.5";

        const row =
          detail.label === "Status" ? (
            <DetailRow label={detail.label}>
              <Badge variant="warning">Pending</Badge>
            </DetailRow>
          ) : hasMismatch ? (
            <div className="flex items-start">
              <span className="text-grey-900 text-base font-bold w-[140px] shrink-0 leading-6">
                <span className={mismatchMark}>{detail.label}</span>
              </span>
              <span className="text-grey-900 text-base font-medium leading-6 break-words min-w-0 flex-1">
                <span className={mismatchMark}>{detail.value}</span>
              </span>
            </div>
          ) : (
            <DetailRow
              label={detail.label}
              value={detail.value}
              isLink={detail.isLink}
            />
          );

        if (!sourceData) return <div key={detail.label}>{row}</div>;

        return (
          <div
            key={detail.label}
            className="rounded transition-colors hover:bg-grey-50"
          >
            <HoverCard
              trigger={<div className="cursor-default">{row}</div>}
              side="bottom"
              align="left"
            >
              <SourceTooltip label={detail.label} data={sourceData} />
            </HoverCard>
          </div>
        );
      })}
    </Collapsible>
  );

  const renderDates = () => (
    <Collapsible title="Dates" defaultOpen>
      {orderedDates.filter((d) => !hiddenFields.has(d.label)).map((detail) => {
        const sourceData = TRANSACTION_SOURCES[detail.label];
        const row = (
          <DetailRow
            label={detail.label}
            value={detail.value}
          />
        );

        if (!sourceData) return <div key={detail.label}>{row}</div>;

        return (
          <div
            key={detail.label}
            className="rounded transition-colors hover:bg-grey-50"
          >
            <HoverCard
              trigger={<div className="cursor-default">{row}</div>}
              side="bottom"
              align="left"
            >
              <SourceTooltip label={detail.label} data={sourceData} />
            </HoverCard>
          </div>
        );
      })}
    </Collapsible>
  );

  const renderContacts = () => (
    <Collapsible title="Contacts" defaultOpen>
      {orderedContacts.filter((c) => !hiddenFields.has(c.name)).map((contact, i) => {
        const sourceData = CONTACT_SOURCES[contact.name];
        const hasMismatch = isFieldStillFlagged(contact.name, rejectedFlagIds, CONTACT_SOURCES);
        const contactMark = hasMismatch ? "rounded-sm bg-red-50 px-0.5" : "";

        const contactRow = (
          <div className="flex items-center">
            <span className="text-grey-900 text-base font-bold w-[140px] shrink-0">
              <span className={contactMark}>{contact.role}</span>
            </span>
            <button
              onClick={() => onContactClick?.(contact)}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <PersonIcon className="w-[19px] h-[19px] text-grey-900" />
              <span className={`text-grey-900 text-base font-medium ${contactMark}`}>
                {contact.name}
              </span>
            </button>
          </div>
        );

        if (!sourceData) return <div key={i}>{contactRow}</div>;

        return (
          <div
            key={i}
            className="rounded transition-colors hover:bg-grey-50"
          >
            <HoverCard
              trigger={<div className="cursor-default">{contactRow}</div>}
              side="bottom"
              align="left"
            >
              <SourceTooltip label={contact.name} data={sourceData} />
            </HoverCard>
          </div>
        );
      })}
    </Collapsible>
  );

  const renderCommission = () => (
    <Collapsible title="Commission" defaultOpen>
      {tieredCommission ? (
        <>
          {TIERED_COMMISSION.map((group) => (
            <div key={group.label} className="mb-3 last:mb-1">
              <p className="text-grey-900 text-base font-bold leading-6 mb-1">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5 pl-1">
                {group.tiers.map((tier, i) => (
                  <div key={i} className="flex items-baseline gap-1.5">
                    <span className="text-grey-900 text-base font-bold leading-6 shrink-0">
                      {tier.rate}
                    </span>
                    <span className="text-grey-900 text-base font-medium leading-6">
                      {tier.description}
                    </span>
                    {tier.threshold && (
                      <span className="text-grey-900 text-base font-bold leading-6">
                        {tier.threshold}
                      </span>
                    )}
                  </div>
                ))}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-grey-900 text-base font-bold leading-6 shrink-0">
                    {group.additional}
                  </span>
                  <span className="text-grey-900 text-base font-medium leading-6">
                    additional {group.label.toLowerCase().replace(" commission", "")} commission
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-grey-200 pt-1 mt-1">
            {(fieldOrder?.commission
              ? fieldOrder.commission.map((key) => SHARED_COMMISSION.find((r) => r.label === key)).filter(Boolean) as typeof SHARED_COMMISSION
              : SHARED_COMMISSION
            ).filter((r) => !hiddenFields.has(r.label)).map((row) => (
              <DetailRow
                key={row.label}
                label={row.label}
                value={row.value}
              />
            ))}
          </div>
        </>
      ) : (
        orderedCommission.filter((r) => !hiddenFields.has(r.label)).map((row) => (
          <DetailRow key={row.label} label={row.label} value={row.value} />
        ))
      )}
    </Collapsible>
  );

  const sectionRenderers: Record<SectionId, () => React.ReactNode> = {
    summary: renderSummary,
    dates: renderDates,
    contacts: renderContacts,
    commission: renderCommission,
  };

  return (
    <>
      {sectionOrder.filter((s) => !hiddenSections.has(s)).map((sectionId) => (
        <div key={sectionId}>{sectionRenderers[sectionId]()}</div>
      ))}

      <div className="px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => onViewLog?.()}
          className="text-blue-800 text-base font-bold leading-6 hover:underline"
        >
          View Log
        </button>
      </div>
    </>
  );
}
