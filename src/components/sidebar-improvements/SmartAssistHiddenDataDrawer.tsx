"use client";

import { ChevronLeft, VisibilityIcon } from "@/components/icons";
import {
  DEFAULT_DETAILS,
  DEFAULT_CONTACTS,
  DEFAULT_COMMISSION,
  SECTION_LABELS,
  type SectionId,
} from "./SmartAssistOption2TransactionContent";

interface HiddenDataDrawerProps {
  hiddenFields: Set<string>;
  hiddenSections: Set<string>;
  onShowField: (field: string) => void;
  onShowSection: (section: string) => void;
  onClose: () => void;
}

interface HiddenItem {
  key: string;
  label: string;
  value: string;
  type: "field" | "section";
  section?: string;
}

export default function SmartAssistHiddenDataDrawer({
  hiddenFields,
  hiddenSections,
  onShowField,
  onShowSection,
  onClose,
}: HiddenDataDrawerProps) {
  // Build list of all hidden items
  const items: HiddenItem[] = [];

  // Hidden sections
  for (const sectionId of hiddenSections) {
    items.push({
      key: `section-${sectionId}`,
      label: SECTION_LABELS[sectionId as SectionId] ?? sectionId,
      value: "Entire section hidden",
      type: "section",
    });
  }

  // Hidden fields from Transaction Summary
  for (const detail of DEFAULT_DETAILS) {
    if (hiddenFields.has(detail.label)) {
      items.push({
        key: `field-${detail.label}`,
        label: detail.label,
        value: detail.value,
        type: "field",
        section: "Transaction Summary",
      });
    }
  }

  // Hidden fields from Contacts
  for (const contact of DEFAULT_CONTACTS) {
    if (hiddenFields.has(contact.name)) {
      items.push({
        key: `field-${contact.name}`,
        label: `${contact.role} — ${contact.name}`,
        value: contact.name,
        type: "field",
        section: "Contacts",
      });
    }
  }

  // Hidden fields from Commission
  for (const row of DEFAULT_COMMISSION) {
    if (hiddenFields.has(row.label)) {
      items.push({
        key: `field-${row.label}`,
        label: row.label,
        value: row.value,
        type: "field",
        section: "Commission",
      });
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-grey-300">
        <button
          onClick={onClose}
          className="text-grey-700 hover:text-grey-900 transition-colors shrink-0"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-grey-900 text-base font-bold">Hidden Data</h3>
        <span className="text-grey-600 text-sm ml-auto">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <p className="text-grey-800 text-sm">No hidden data.</p>
            <p className="text-grey-600 text-sm mt-1">
              Use &ldquo;Edit Summary&rdquo; to hide fields or sections.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 px-4 py-3 border-b border-grey-200"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-grey-900 text-sm font-bold truncate">
                    {item.label}
                  </p>
                  {item.type === "field" && item.section && (
                    <p className="text-grey-600 text-sm">{item.section}</p>
                  )}
                  {item.type === "field" && (
                    <p className="text-grey-800 text-sm mt-0.5 truncate">
                      {item.value}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (item.type === "section") {
                      onShowSection(item.label === SECTION_LABELS.summary ? "summary"
                        : item.label === SECTION_LABELS.contacts ? "contacts"
                        : "commission");
                    } else {
                      // Extract the actual field key
                      const fieldKey = item.type === "field"
                        ? (DEFAULT_DETAILS.find((d) => d.label === item.label)?.label
                          ?? DEFAULT_CONTACTS.find((c) => c.name === item.value)?.name
                          ?? DEFAULT_COMMISSION.find((c) => c.label === item.label)?.label
                          ?? item.label)
                        : item.label;
                      onShowField(fieldKey);
                    }
                  }}
                  className="shrink-0 flex items-center gap-1 text-blue-800 text-sm font-medium hover:underline"
                >
                  <VisibilityIcon className="w-3.5 h-3.5" />
                  Show
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
