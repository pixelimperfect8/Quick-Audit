"use client";

import { useState } from "react";
import { PersonIcon, HistoryIcon } from "@/components/icons";
import { Collapsible, DetailRow, Badge, Tooltip } from "@/components/ui";

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

const DEFAULT_TRANSACTION_DETAILS: DetailData[] = [
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

interface CounterOffer {
  label: string;
  value: string;
}

const PRICE_HISTORY: CounterOffer[] = [
  { label: "Original Offer", value: "$500,000.00" },
  { label: "Counter Offer #1", value: "$475,000.00" },
  { label: "Counter Offer #2", value: "$450,000.00" },
];

const DEFAULT_COMMISSION: CommissionData[] = [
  { label: "Sale", value: "$99,999.99" },
  { label: "Listing", value: "$99,999.99" },
  { label: "Office gross", value: "$99,999.99" },
  { label: "TC", value: "$1,000" },
  { label: "Referral Agent", value: "$3,000" },
  { label: "Other deductions", value: "$600" },
];

interface TransactionContentProps {
  onContactClick?: (contact: Contact) => void;
  onViewLog?: () => void;
  details?: DetailData[];
  contacts?: Contact[];
  commission?: CommissionData[];
}

export default function TransactionContent({
  onContactClick,
  onViewLog,
  details = DEFAULT_TRANSACTION_DETAILS,
  contacts = DEFAULT_CONTACTS,
  commission = DEFAULT_COMMISSION,
}: TransactionContentProps) {
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <Collapsible title="Transaction Details" defaultOpen>
        {details.map((detail) => {
          if (detail.label === "Status") {
            return (
              <DetailRow key={detail.label} label={detail.label}>
                <Badge variant="warning">Pending</Badge>
              </DetailRow>
            );
          }

          if (detail.label === "Purchase Price") {
            return (
              <div key={detail.label}>
                <div className="flex items-baseline">
                  <div className="flex-1 min-w-0">
                    <DetailRow label={detail.label} value={detail.value} />
                  </div>
                  <Tooltip label="Price History">
                    <button
                      onClick={() => setHistoryOpen(!historyOpen)}
                      className={`shrink-0 ml-2 p-1 rounded transition-colors ${
                        historyOpen ? "text-blue-800 bg-blue-800/10" : "text-grey-600 hover:text-grey-900 hover:bg-grey-100"
                      }`}
                      aria-label="Price History"
                    >
                      <HistoryIcon className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
                {historyOpen && (
                  <div className="mt-1 mb-2 rounded bg-grey-900 p-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
                    <span className="text-white text-sm font-bold">Price History</span>
                    {PRICE_HISTORY.map((co, i) => {
                      const isFinal = i === PRICE_HISTORY.length - 1;
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
                  </div>
                )}
              </div>
            );
          }

          return (
            <DetailRow
              key={detail.label}
              label={detail.label}
              value={detail.value}
              isLink={detail.isLink}
            />
          );
        })}
      </Collapsible>

      <Collapsible title="Contacts" defaultOpen>
        {contacts.map((contact, i) => (
          <div key={i} className="flex items-center">
            <span className="text-grey-900 text-base font-bold w-[140px] shrink-0">
              {contact.role}
            </span>
            <button
              onClick={() => onContactClick?.(contact)}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <PersonIcon className="w-[19px] h-[19px] text-grey-900" />
              <span className="text-grey-900 text-base font-medium">{contact.name}</span>
            </button>
          </div>
        ))}
      </Collapsible>

      <Collapsible title="Commission" defaultOpen>
        {commission.map((row) => (
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
