"use client";

import { DrawerHeader, DetailRow, Divider } from "./ui";
import { ChevronDown } from "./icons";

interface DetailData {
  label: string;
  value: string;
}

const DEFAULT_LENDER_DETAILS: DetailData[] = [
  { label: "Name", value: "Mark Roberts" },
  { label: "Fax", value: "(123)456-7891" },
  { label: "Phone", value: "(123)456-7892" },
  { label: "Alternate", value: "(123)456-7894" },
  { label: "Type of Loan", value: "Home Loan" },
  { label: "Lender Company", value: "Stars Mortgage" },
  { label: "Email", value: "email@broker.com" },
  { label: "Year Built", value: "1965" },
  { label: "Purchase Price", value: "$450,000.00" },
  { label: "File ID", value: "1234567" },
];

interface LenderDetailProps {
  onClose: () => void;
  details?: DetailData[];
}

export default function LenderDetail({
  onClose,
  details = DEFAULT_LENDER_DETAILS,
}: LenderDetailProps) {
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      <DrawerHeader title="Lender" onClose={onClose} />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-3">
        {details.map((detail) => (
          <DetailRow key={detail.label} label={detail.label} value={detail.value} />
        ))}

        <Divider className="mt-1" />

        {/* Notes Section */}
        <div className="flex items-center justify-between pr-4">
          <h3 className="text-grey-800 text-base font-medium leading-6">Notes</h3>
          <ChevronDown className="w-5 h-5 text-grey-700 opacity-0" />
        </div>

        <p className="text-grey-900 text-base font-medium leading-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
}
