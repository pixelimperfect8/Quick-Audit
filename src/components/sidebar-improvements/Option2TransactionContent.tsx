"use client";

import { PersonIcon } from "@/components/icons";
import { Collapsible, DetailRow, Badge, HoverCard } from "@/components/ui";
import SourceTooltip from "./SourceTooltip";
import {
  TRANSACTION_SOURCES,
  CONTACT_SOURCES,
} from "./Option2TransactionSources";

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

const DEFAULT_DETAILS: DetailData[] = [
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

const DEFAULT_CONTACTS: Contact[] = [
  { role: "Buyer", name: "Rachael Laurolla" },
  { role: "Buyer", name: "Rob Laurolla" },
  { role: "Lender", name: "Mark Roberts", type: "lender" },
];

const DEFAULT_COMMISSION: CommissionData[] = [
  { label: "Sale", value: "$99,999.99" },
  { label: "Listing", value: "$99,999.99" },
  { label: "Office gross", value: "$99,999.99" },
  { label: "TC", value: "$1,000" },
  { label: "Referral Agent", value: "$3,000" },
  { label: "Other deductions", value: "$600" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface Option2TransactionContentProps {
  onContactClick?: (contact: Contact) => void;
  onViewLog?: () => void;
}

export default function Option2TransactionContent({
  onContactClick,
  onViewLog,
}: Option2TransactionContentProps) {
  return (
    <>
      <Collapsible title="Transaction Details" defaultOpen>
        {DEFAULT_DETAILS.map((detail) => {
          const sourceData = TRANSACTION_SOURCES[detail.label];
          const hasMismatch = sourceData?.mismatch;

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

      <Collapsible title="Contacts" defaultOpen>
        {DEFAULT_CONTACTS.map((contact, i) => {
          const sourceData = CONTACT_SOURCES[contact.name];
          const hasMismatch = sourceData?.mismatch;

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

      <Collapsible title="Commission" defaultOpen>
        {DEFAULT_COMMISSION.map((row) => (
          <DetailRow key={row.label} label={row.label} value={row.value} />
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
