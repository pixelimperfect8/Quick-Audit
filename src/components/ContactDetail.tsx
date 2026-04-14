"use client";

import { DrawerHeader, DetailRow, Divider } from "./ui";
import { WarningIcon, PersonIcon } from "./icons";
import {
  FLAG_ISSUES,
  type FlagIssue,
} from "./sidebar-improvements/flagsData";

/** Mock phone/email per contact name — keeps the panel useful without a backend */
const CONTACT_INFO: Record<
  string,
  { phone?: string; email?: string; address?: string }
> = {
  "Rachael Laurolla": {
    phone: "(555) 123-4567",
    email: "rachael.laurolla@email.com",
    address: "3969 Harvord Boulevard, Venture, CA 93001",
  },
  "Rob Laurolla": {
    phone: "(555) 123-4568",
    email: "rob.laurolla@email.com",
    address: "3969 Harvord Boulevard, Venture, CA 93001",
  },
  "James Thompson": {
    phone: "(555) 987-6543",
    email: "james.thompson@email.com",
  },
  "Mary Thompson": {
    phone: "(555) 987-6544",
    email: "mary.thompson@email.com",
  },
  "Lisa Chen": {
    phone: "(555) 555-0199",
    email: "lisa.chen@compass.com",
  },
};

interface Contact {
  name: string;
  role: string;
  type?: string;
}

interface ContactDetailProps {
  contact: Contact;
  onClose: () => void;
}

/** Return flags that directly reference this contact by name. */
function findRelatedFlags(contact: Contact): FlagIssue[] {
  return FLAG_ISSUES.filter((flag) =>
    flag.relatedFields?.includes(contact.name),
  );
}

export default function ContactDetail({ contact, onClose }: ContactDetailProps) {
  const info = CONTACT_INFO[contact.name] ?? {};
  const relatedFlags = findRelatedFlags(contact);

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto">
      <DrawerHeader title={contact.role} onClose={onClose} />

      <div className="px-4 pt-4 pb-8 flex flex-col gap-3">
        {/* Name header with person icon */}
        <div className="flex items-center gap-2">
          <PersonIcon className="w-5 h-5 text-grey-700 shrink-0" />
          <span className="text-grey-900 text-lg font-bold leading-6">
            {contact.name}
          </span>
        </div>

        <DetailRow label="Role" value={contact.role} />
        {info.phone && <DetailRow label="Phone" value={info.phone} />}
        {info.email && <DetailRow label="Email" value={info.email} isLink />}
        {info.address && <DetailRow label="Address" value={info.address} />}

        {relatedFlags.length > 0 && (
          <>
            <Divider className="mt-1" />
            <div className="flex items-center gap-2">
              <WarningIcon className="w-4 h-4 text-orange-200 shrink-0" />
              <h3 className="text-grey-900 text-base font-bold leading-6">
                Flags ({relatedFlags.length})
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {relatedFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="rounded-lg border border-grey-300 p-3 flex flex-col gap-2"
                >
                  <p className="text-grey-900 text-sm font-medium leading-5">
                    {flag.description}
                  </p>
                  {flag.sources && flag.sources.length > 0 && (
                    <div className="flex flex-col gap-1 pt-2 border-t border-grey-200">
                      {flag.sources.map((src) => (
                        <div
                          key={src.label}
                          className="flex items-baseline gap-2"
                        >
                          <span className="text-grey-800 text-xs font-medium uppercase tracking-wide shrink-0 whitespace-nowrap">
                            {src.label}
                          </span>
                          <span className="text-grey-900 text-sm font-medium leading-5 min-w-0 flex-1">
                            {src.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
