"use client";

import { PersonIcon } from "@/components/icons";
import { Collapsible, DetailRow, Badge } from "@/components/ui";

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
  return (
    <>
      <Collapsible title="Transaction Details" defaultOpen>
        {details.map((detail) =>
          detail.label === "Status" ? (
            <DetailRow key={detail.label} label={detail.label}>
              <Badge variant="warning">Pending</Badge>
            </DetailRow>
          ) : (
            <DetailRow
              key={detail.label}
              label={detail.label}
              value={detail.value}
              isLink={detail.isLink}
            />
          )
        )}
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
