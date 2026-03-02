"use client";

import { PlusIcon, WarningIcon, CloseIcon, ChevronDown } from "./icons";

type DocStatus = "Flagged" | "Pending" | "Complete" | "Required";

interface DocumentItem {
  number: number;
  name: string;
  status: DocStatus;
  files?: { name: string; date: string }[];
}

const statusStyles: Record<DocStatus, string> = {
  Flagged: "bg-[#fdd0d0] border-[#ff5255] text-grey-900",
  Pending: "bg-[#fdd0d0] border-[#fea6a6] text-grey-900",
  Complete: "bg-[#c6f0d7] border-[#a6e0bd] text-grey-900",
  Required: "bg-[#bee8ff] border-[#99dbff] text-grey-900",
};

const salesDocs: DocumentItem[] = [
  {
    number: 1,
    name: "California Residential Purchase Agreement",
    status: "Flagged",
    files: [
      { name: "CAR_Carlifo...emnt.pdf", date: "13 days ago" },
      { name: "Form 2", date: "13 days ago" },
    ],
  },
  { number: 2, name: "Agency Disclosure", status: "Pending" },
  { number: 3, name: "Lead Based Paint", status: "Pending" },
  { number: 4, name: "Fair Housing Advisory", status: "Complete" },
  { number: 5, name: "Addendums", status: "Required" },
];

const disclosureDocs: DocumentItem[] = [
  { number: 2, name: "Agency Disclosure", status: "Pending" },
  { number: 3, name: "Lead Based Paint", status: "Pending" },
  { number: 4, name: "Fair Housing Advisory", status: "Complete" },
  { number: 5, name: "Addendums", status: "Required" },
];

function StatusBadge({ status }: { status: DocStatus }) {
  return (
    <div
      className={`flex items-center justify-center gap-1 px-3 py-1 rounded-md border text-sm font-medium w-[105px] shrink-0 ${statusStyles[status]}`}
    >
      {status === "Flagged" && <WarningIcon className="w-4 h-4 text-red-400" />}
      <span>{status}</span>
      {status === "Required" && <ChevronDown className="w-4 h-4" />}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-grey-50 border-b border-grey-300 px-6 flex items-center gap-2.5 h-[45px]">
      <h3 className="text-grey-900 text-base font-bold leading-6">{title}</h3>
      <button className="text-grey-700 hover:text-grey-900">
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

function DocumentListItem({ doc }: { doc: DocumentItem }) {
  return (
    <div>
      <div className="flex items-center gap-4 px-4 py-2">
        <div className="flex-1 min-w-0 text-grey-900 text-base font-medium leading-6 truncate">
          <span className="mr-2 text-grey-700">{doc.number}.</span>
          {doc.name}
        </div>
        <StatusBadge status={doc.status} />
      </div>

      {doc.files && (
        <div className="px-2 pb-2">
          <div className="bg-grey-100 rounded-lg p-4 flex flex-col gap-1">
            {doc.files.map((file, i) => (
              <div
                key={i}
                className={`bg-white rounded-lg flex items-center gap-4 sm:gap-6 py-4 pl-4 pr-3 ${
                  i === 0 ? "border-2 border-blue-800" : "border border-grey-300"
                }`}
              >
                <p className="flex-1 min-w-0 text-grey-900 text-base font-medium leading-6 truncate">
                  {file.name}
                </p>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-grey-900 text-sm font-medium hidden sm:block">
                    {file.date}
                  </span>
                  <button className="text-grey-500 hover:text-grey-700">
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocumentChecklist() {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      {/* Sales Documentation */}
      <SectionHeader title="Sales Documentation" />
      <div className="flex flex-col">
        {salesDocs.map((doc) => (
          <DocumentListItem key={`sales-${doc.number}-${doc.name}`} doc={doc} />
        ))}
      </div>

      {/* Disclosure Documentation */}
      <div className="border-t border-grey-300">
        <SectionHeader title="Disclosure Documentation" />
      </div>
      <div className="flex flex-col">
        {disclosureDocs.map((doc) => (
          <DocumentListItem key={`disc-${doc.number}-${doc.name}`} doc={doc} />
        ))}
      </div>

      {/* Third section */}
      <div className="border-t border-grey-300">
        <SectionHeader title="Disclosure Documentation" />
      </div>
    </div>
  );
}
