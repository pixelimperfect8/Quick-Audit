"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { PersonIcon, PinFilledIcon, HistoryIcon } from "@/components/icons";
import { Collapsible, DetailRow, Badge, HoverCard, Tooltip } from "@/components/ui";
import { ALL_FIELDS, toArray } from "./FormDataByPage";
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

export const DEFAULT_CONTACTS: Contact[] = [
  { role: "Buyer", name: "Rachael Laurolla" },
  { role: "Buyer", name: "Rob Laurolla" },
  { role: "Lender", name: "Mark Roberts", type: "lender" },
];

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

/** Pinned row rendered inside Transaction tab sections */
function PinnedFieldRow({
  label,
  value,
  onUnpin,
}: {
  label: string;
  value: string;
  onUnpin?: () => void;
}) {
  return (
    <div className="group flex items-start">
      <span className="text-grey-900 text-base font-bold w-[140px] shrink-0 leading-6">
        {label}
      </span>
      <span className="text-grey-900 text-base font-medium leading-6 break-words min-w-0 flex-1">
        {value}
      </span>
      {onUnpin && (
        <Tooltip label="Unpin">
          <button
            onClick={onUnpin}
            className="shrink-0 bg-grey-100 rounded-sm p-1 text-grey-700 hover:bg-grey-200 ml-1"
            aria-label={`Unpin ${label}`}
          >
            <PinFilledIcon className="w-4 h-4" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}

/** Map a form field to a Transaction tab section */
function getPinSection(label: string): "summary" | "contacts" | "commission" {
  const lower = label.toLowerCase();
  if (lower.includes("commission") || lower.includes("payment")) return "commission";
  if (label === "Buyer(s)" || label === "Seller(s)") return "contacts";
  return "summary";
}

interface Option2TransactionContentProps {
  onContactClick?: (contact: Contact) => void;
  onViewLog?: () => void;
  /** Set of rejected flag IDs — suppresses mismatch highlighting */
  rejectedFlagIds?: Set<string>;
  /** Show tiered commission breakdown */
  tieredCommission?: boolean;
  /** Set of pinned form field labels */
  pinnedFields?: Set<string>;
  /** Callback to unpin a field */
  onUnpin?: (label: string) => void;
  /** Style for counter offer history: "badge" (light inline card) or "icon" (dark card with icon trigger) */
  historyStyle?: "badge" | "icon";
}

export default function Option2TransactionContent({
  onContactClick,
  onViewLog,
  rejectedFlagIds = new Set(),
  tieredCommission = false,
  pinnedFields,
  onUnpin,
  historyStyle = "badge",
}: Option2TransactionContentProps) {
  // Compute pinned items grouped by section
  const pinnedBySection = pinnedFields && pinnedFields.size > 0
    ? ALL_FIELDS.filter((f) => pinnedFields.has(f.label)).reduce<
        Record<string, typeof ALL_FIELDS>
      >((acc, field) => {
        const section = getPinSection(field.label);
        (acc[section] ||= []).push(field);
        return acc;
      }, {})
    : {};

  const [historyOpen, setHistoryOpen] = useState(false);
  const historyIconRef = useRef<HTMLButtonElement>(null);
  const historyTooltipRef = useRef<HTMLDivElement>(null);
  const [historyPos, setHistoryPos] = useState<{ top: number; left: number } | null>(null);
  const counterOffers = TRANSACTION_SOURCES["Purchase Price"]?.counterOffers;

  // Position the floating tooltip when opened
  useEffect(() => {
    if (!historyOpen || !historyIconRef.current) return;
    const rect = historyIconRef.current.getBoundingClientRect();
    setHistoryPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX + rect.width / 2,
    });
  }, [historyOpen]);

  // Close on outside click
  useEffect(() => {
    if (!historyOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        historyIconRef.current && !historyIconRef.current.contains(e.target as Node) &&
        historyTooltipRef.current && !historyTooltipRef.current.contains(e.target as Node)
      ) {
        setHistoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [historyOpen]);

  return (
    <>
      <Collapsible title="Transaction Summary" defaultOpen>
        {DEFAULT_DETAILS.map((detail) => {
          const sourceData = TRANSACTION_SOURCES[detail.label];
          const hasMismatch = isFieldStillFlagged(detail.label, rejectedFlagIds, TRANSACTION_SOURCES);
          const mismatchMark = "rounded-sm bg-red-50 px-0.5 -mx-0.5";
          const hasCounterOffer = sourceData?.counterOffers && sourceData.counterOffers.length > 0;
          const displayValue = hasCounterOffer
            ? sourceData!.counterOffers![sourceData!.counterOffers!.length - 1].value
            : detail.value;

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
                  <span className={mismatchMark}>{displayValue}</span>
                </span>
              </div>
            ) : (
              <DetailRow
                label={detail.label}
                value={detail.value}
                isLink={detail.isLink}
              />
            );

          // History trigger for counter offer fields
          const historyTrigger = hasCounterOffer ? (
            historyStyle === "icon" ? null : (
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="shrink-0 ml-2"
              >
                <Badge
                  variant={historyOpen ? "info" : "default"}
                  className={`text-sm !py-0 cursor-pointer transition-colors ${
                    historyOpen ? "" : "hover:opacity-80"
                  }`}
                >
                  History
                </Badge>
              </button>
            )
          ) : null;

          // Inline expandable card for badge style
          const historyCard = hasCounterOffer && historyOpen && historyStyle === "badge" ? (
            <div className="mt-1 mb-2 rounded bg-grey-100 p-4 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-baseline justify-between">
                <span className="text-grey-800 text-sm font-bold">Price History</span>
                <button
                  onClick={() => setHistoryOpen(false)}
                  className="text-grey-600 text-sm font-medium hover:text-grey-900 transition-colors"
                >
                  Close
                </button>
              </div>
              {sourceData!.counterOffers!.map((co, i) => {
                const isFinal = i === sourceData!.counterOffers!.length - 1;
                return (
                  <div key={co.label} className="flex items-baseline justify-between gap-2">
                    <span className="text-grey-800 text-sm font-medium">{co.label}</span>
                    <span
                      className={`text-sm font-medium leading-5 ${
                        isFinal ? "text-grey-900 font-bold" : "text-grey-800 line-through"
                      }`}
                    >
                      {co.value}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : null;

          // For icon style with counter offers: custom row with inline icon
          if (historyStyle === "icon" && hasCounterOffer && detail.label === "Purchase Price") {
            const iconRow = (
              <div className="flex items-start">
                <span className="text-grey-900 text-base font-bold w-[140px] shrink-0 leading-6">
                  {detail.label}
                </span>
                <span className="text-grey-900 text-base font-medium leading-6 flex items-center">
                  {displayValue}
                  {!historyOpen ? (
                    <Tooltip label="Price History">
                      <button
                        ref={historyIconRef}
                        onClick={() => setHistoryOpen(true)}
                        className="ml-2 p-1 rounded text-grey-600 hover:text-grey-900 hover:bg-grey-100 transition-colors"
                        aria-label="Price History"
                      >
                        <HistoryIcon className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  ) : (
                    <button
                      ref={historyIconRef}
                      onClick={() => setHistoryOpen(false)}
                      className="ml-2 p-1 rounded text-blue-800 bg-blue-800/10 transition-colors"
                      aria-label="Price History"
                    >
                      <HistoryIcon className="w-4 h-4" />
                    </button>
                  )}
                </span>
              </div>
            );

            // Floating dark tooltip via portal
            const floatingTooltip = historyOpen && historyPos && typeof document !== "undefined"
              ? createPortal(
                  <div
                    ref={historyTooltipRef}
                    className="fixed z-[9999] bg-grey-900 rounded-lg shadow-xl p-4 flex flex-col gap-2 animate-in fade-in duration-150"
                    style={{
                      top: historyPos.top,
                      left: historyPos.left,
                      transform: "translateX(-50%)",
                      minWidth: 220,
                    }}
                  >
                    <span className="text-white text-sm font-bold">Price History</span>
                    {sourceData!.counterOffers!.map((co, i) => {
                      const isFinal = i === sourceData!.counterOffers!.length - 1;
                      return (
                        <div key={co.label} className="flex items-baseline justify-between gap-2">
                          <span className={`text-sm font-medium ${isFinal ? "text-white" : "text-grey-400"}`}>
                            {co.label}
                          </span>
                          <span className={`text-sm font-medium ${isFinal ? "text-white font-bold" : "text-grey-400"}`}>
                            {co.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>,
                  document.body
                )
              : null;

            if (!sourceData) {
              return (
                <div key={detail.label}>
                  {iconRow}
                  {floatingTooltip}
                </div>
              );
            }

            return (
              <div key={detail.label} className="rounded transition-colors hover:bg-grey-50">
                <HoverCard
                  trigger={<div className="cursor-default">{iconRow}</div>}
                  side="bottom"
                  align="left"
                >
                  <SourceTooltip label={detail.label} data={sourceData} />
                </HoverCard>
                {floatingTooltip}
              </div>
            );
          }

          if (!sourceData) return <div key={detail.label}>{row}{historyCard}</div>;

          return (
            <div
              key={detail.label}
              className="rounded transition-colors hover:bg-grey-50"
            >
              <div className="flex items-baseline">
                <div className="flex-1 min-w-0">
                  <HoverCard
                    trigger={<div className="cursor-default">{row}</div>}
                    side="bottom"
                    align="left"
                  >
                    <SourceTooltip label={detail.label} data={sourceData} />
                  </HoverCard>
                </div>
                {historyTrigger}
              </div>
              {historyCard}
            </div>
          );
        })}
        {pinnedBySection.summary?.map((field) => (
          <PinnedFieldRow
            key={field.label}
            label={field.label}
            value={toArray(field.formValue).join(", ") || "—"}
            onUnpin={onUnpin ? () => onUnpin(field.label) : undefined}
          />
        ))}
      </Collapsible>

      <Collapsible title="Contacts" defaultOpen>
        {DEFAULT_CONTACTS.map((contact, i) => {
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
        {pinnedBySection.contacts?.map((field) => (
          <PinnedFieldRow
            key={field.label}
            label={field.label}
            value={toArray(field.formValue).join(", ") || "—"}
            onUnpin={onUnpin ? () => onUnpin(field.label) : undefined}
          />
        ))}
      </Collapsible>

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
              {SHARED_COMMISSION.map((row) => (
                <DetailRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                />
              ))}
            </div>
          </>
        ) : (
          DEFAULT_COMMISSION.map((row) => (
            <DetailRow key={row.label} label={row.label} value={row.value} />
          ))
        )}
        {pinnedBySection.commission?.map((field) => (
          <PinnedFieldRow
            key={field.label}
            label={field.label}
            value={toArray(field.formValue).join(", ") || "—"}
            onUnpin={onUnpin ? () => onUnpin(field.label) : undefined}
          />
        ))}
      </Collapsible>

      <div className="px-4 py-3">
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
