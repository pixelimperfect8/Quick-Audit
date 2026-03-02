"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, PersonIcon, MoreVert } from "./icons";

interface DetailRow {
  label: string;
  value: string;
  isLink?: boolean;
}

interface Contact {
  role: string;
  name: string;
  type?: string;
}

interface CommissionRow {
  label: string;
  value: string;
}

const transactionDetails: DetailRow[] = [
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

const contacts: Contact[] = [
  { role: "Buyer", name: "Rachael Laurolla" },
  { role: "Buyer", name: "Rob Laurolla" },
  { role: "Lender", name: "Mark Roberts", type: "lender" },
];

const commissionData: CommissionRow[] = [
  { label: "Sale", value: "$99,999.99" },
  { label: "Listing", value: "$99,999.99" },
  { label: "Office gross", value: "$99,999.99" },
  { label: "TC", value: "$1,000" },
  { label: "Referral Agent", value: "$3,000" },
  { label: "Other deductions", value: "$600" },
];

const tabItems = ["Transaction", "Comments (1)"] as const;

interface TransactionDetailsProps {
  onContactClick?: (contact: Contact) => void;
  onViewLog?: () => void;
}

export default function TransactionDetails({ onContactClick, onViewLog }: TransactionDetailsProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabItems)[number]>("Transaction");
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [contactsOpen, setContactsOpen] = useState(true);
  const [commissionOpen, setCommissionOpen] = useState(true);

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Tabs */}
      <div className="flex border-b border-grey-300 shrink-0 sticky top-0 z-10 bg-white h-[45px]">
        {tabItems.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-base font-medium text-center transition-colors flex items-center justify-center gap-1 ${
              activeTab === tab
                ? "text-blue-800 border-b-2 border-blue-800 font-bold"
                : "text-grey-700 hover:text-grey-900"
            }`}
          >
            {tab}
            {tab === "Transaction" && (
              <MoreVert className="w-[18px] h-[18px] text-grey-700" />
            )}
          </button>
        ))}
      </div>

      {/* Transaction Details Section */}
      <div className="border-b border-grey-300">
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-grey-50 transition-colors"
        >
          <h3 className="text-grey-700 text-base font-medium">Transaction Details</h3>
          {detailsOpen ? (
            <ChevronUp className="w-5 h-5 text-grey-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-grey-700" />
          )}
        </button>

        {detailsOpen && (
          <div className="px-4 pb-4 flex flex-col gap-3">
            {transactionDetails.map((detail) => (
              <div key={detail.label} className="flex items-start">
                <span className="text-grey-900 text-base font-bold w-[140px] shrink-0 leading-6">
                  {detail.label}
                </span>
                {detail.label === "Status" ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium bg-yellow-200 text-grey-900">
                    Pending
                  </span>
                ) : detail.isLink ? (
                  <a
                    href="#"
                    className="text-grey-900 text-base font-medium leading-6 underline break-all min-w-0 flex-1"
                  >
                    {detail.value}
                  </a>
                ) : (
                  <span className="text-grey-900 text-base font-medium leading-6 break-words min-w-0 flex-1">
                    {detail.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contacts Section */}
      <div className="border-b border-grey-300">
        <button
          onClick={() => setContactsOpen(!contactsOpen)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-grey-50 transition-colors"
        >
          <h3 className="text-grey-700 text-base font-medium">Contacts</h3>
          {contactsOpen ? (
            <ChevronUp className="w-5 h-5 text-grey-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-grey-700" />
          )}
        </button>

        {contactsOpen && (
          <div className="px-4 pb-4 flex flex-col gap-3">
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
          </div>
        )}
      </div>

      {/* Commission Section */}
      <div className="border-b border-grey-300">
        <button
          onClick={() => setCommissionOpen(!commissionOpen)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-grey-50 transition-colors"
        >
          <h3 className="text-grey-700 text-base font-medium">Commission</h3>
          {commissionOpen ? (
            <ChevronUp className="w-5 h-5 text-grey-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-grey-700" />
          )}
        </button>

        {commissionOpen && (
          <div className="px-4 pb-4 flex flex-col gap-3">
            {commissionData.map((row) => (
              <div key={row.label} className="flex items-start">
                <span className="text-grey-900 text-base font-bold w-[140px] shrink-0 leading-6">
                  {row.label}
                </span>
                <span className="text-grey-900 text-base font-medium leading-6 flex-1 min-w-0">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Log Link */}
      <div className="px-4 py-3">
        <button
          onClick={() => onViewLog?.()}
          className="text-blue-800 text-base font-bold leading-6 hover:underline"
        >
          View Log
        </button>
      </div>
    </div>
  );
}
