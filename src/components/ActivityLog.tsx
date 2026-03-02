"use client";

import { DrawerHeader, Divider } from "./ui";

interface LogEntry {
  type: string;
  user: string;
  email: string;
  description: string;
  timestamp: string;
}

const DEFAULT_LOG_ENTRIES: LogEntry[] = [
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
  entries?: LogEntry[];
}

export default function ActivityLog({
  onClose,
  entries = DEFAULT_LOG_ENTRIES,
}: ActivityLogProps) {
  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      <DrawerHeader title="Log" onClose={onClose} />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-3">
        {entries.map((entry, i) => (
          <div key={i}>
            <div className="flex flex-col gap-3">
              <p className="text-grey-900 text-base font-bold leading-6">
                {entry.type}
              </p>

              <div className="flex items-center gap-2.5">
                <span className="text-grey-700 text-base font-medium">{entry.user}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-grey-400" />
                <span className="text-grey-700 text-base font-medium flex-1 min-w-0 truncate">
                  {entry.email}
                </span>
              </div>

              <p className="text-grey-900 text-base font-medium leading-6">
                {entry.description}
              </p>

              <p className="text-grey-700 text-base font-medium leading-6">
                {entry.timestamp}
              </p>
            </div>

            {i < entries.length - 1 && <Divider className="mt-3" />}
          </div>
        ))}
      </div>
    </div>
  );
}
