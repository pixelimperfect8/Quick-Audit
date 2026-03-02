"use client";

import { CloseIcon, ChevronDown } from "./icons";

interface DetailRow {
  label: string;
  value: string;
}

const lenderDetails: DetailRow[] = [
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
}

export default function LenderDetail({ onClose }: LenderDetailProps) {
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 border-b border-grey-300 shrink-0 sticky top-0 z-10 bg-white h-[45px]">
        <button
          onClick={onClose}
          className="text-grey-700 hover:text-grey-900 transition-colors"
        >
          <CloseIcon className="w-[18px] h-[18px]" />
        </button>
        <h2 className="text-grey-900 text-base font-bold leading-6">Lender</h2>
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-8 flex flex-col gap-3">
        {lenderDetails.map((detail) => (
          <div key={detail.label} className="flex items-start">
            <span className="text-grey-900 text-base font-bold w-[140px] shrink-0 leading-6">
              {detail.label}
            </span>
            <span className="text-grey-900 text-base font-medium leading-6 break-words min-w-0 flex-1">
              {detail.value}
            </span>
          </div>
        ))}

        {/* Divider */}
        <div className="border-t border-grey-300 mt-1" />

        {/* Notes Section */}
        <div className="flex items-center justify-between pr-4">
          <h3 className="text-grey-700 text-base font-medium leading-6">Notes</h3>
          <ChevronDown className="w-5 h-5 text-grey-700 opacity-0" />
        </div>

        <p className="text-grey-900 text-base font-medium leading-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  );
}
