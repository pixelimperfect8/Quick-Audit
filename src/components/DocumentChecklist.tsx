"use client";

import { PlusIcon, CloseIcon } from "./icons";
import { StatusBadge, Divider } from "./ui";
import type { DocStatus } from "./ui";

interface FileItem {
  name: string;
  date: string;
}

interface DocumentItem {
  number: number;
  name: string;
  status: DocStatus;
  files?: FileItem[];
}

interface DocumentSection {
  title: string;
  documents: DocumentItem[];
}

const DEFAULT_SECTIONS: DocumentSection[] = [
  {
    title: "Sales Documentation",
    documents: [
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
    ],
  },
  {
    title: "Disclosure Documentation",
    documents: [
      { number: 2, name: "Agency Disclosure", status: "Pending" },
      { number: 3, name: "Lead Based Paint", status: "Pending" },
      { number: 4, name: "Fair Housing Advisory", status: "Complete" },
      { number: 5, name: "Addendums", status: "Required" },
    ],
  },
  {
    title: "Disclosure Documentation",
    documents: [],
  },
];

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

interface DocumentChecklistProps {
  sections?: DocumentSection[];
}

export default function DocumentChecklist({
  sections = DEFAULT_SECTIONS,
}: DocumentChecklistProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      {sections.map((section, i) => (
        <div key={`${section.title}-${i}`}>
          {i > 0 && <Divider />}
          <SectionHeader title={section.title} />
          <div className="flex flex-col">
            {section.documents.map((doc) => (
              <DocumentListItem key={`${section.title}-${doc.number}-${doc.name}`} doc={doc} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
