"use client";

import { CloseIcon } from "./icons";

interface LogEntry {
  type: string;
  user: string;
  email: string;
  description: string;
  timestamp: string;
}

const logEntries: LogEntry[] = [
  {
    type: "DOC BNDL",
    user: "Jon Smith",
    email: "jsmith@email.com",
    description: "Document bundle [Name] was created",
    timestamp: "May 25, 2023 at 9:18am",
  },
  {
    type: "DOC ASN",
    user: "Jon Smith",
    email: "jsmith@email.com",
    description: "Listing Document: RPA_-_updated_2022.pdf Assigned.",
    timestamp: "May 25, 2023 at 9:18am",
  },
  {
    type: "DOC ADD",
    user: "Jon Smith",
    email: "jsmith@email.com",
    description: "Listing Document: RPA_-_updated_2022.pdf Uploaded.",
    timestamp: "May 25, 2023 at 9:18am",
  },
  {
    type: "CONTACT",
    user: "Jon Smith",
    email: "jsmith@email.com",
    description: "New contact added",
    timestamp: "May 25, 2023 at 9:18am",
  },
];

interface ActivityLogProps {
  onClose: () => void;
}

export default function ActivityLog({ onClose }: ActivityLogProps) {
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
        <h2 className="text-grey-900 text-base font-bold leading-6">Log</h2>
      </div>

      {/* Log Entries */}
      <div className="px-4 pt-4 pb-8 flex flex-col gap-3">
        {logEntries.map((entry, i) => (
          <div key={i}>
            <div className="flex flex-col gap-3">
              {/* Type */}
              <p className="text-grey-900 text-base font-bold leading-6">
                {entry.type}
              </p>

              {/* User info */}
              <div className="flex items-center gap-2.5">
                <span className="text-grey-700 text-base font-medium">{entry.user}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-grey-400" />
                <span className="text-grey-700 text-base font-medium flex-1 min-w-0 truncate">
                  {entry.email}
                </span>
              </div>

              {/* Description */}
              <p className="text-grey-900 text-base font-medium leading-6">
                {entry.description}
              </p>

              {/* Timestamp */}
              <p className="text-grey-700 text-base font-medium leading-6">
                {entry.timestamp}
              </p>
            </div>

            {/* Divider (except last) */}
            {i < logEntries.length - 1 && (
              <div className="border-t border-grey-300 mt-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
