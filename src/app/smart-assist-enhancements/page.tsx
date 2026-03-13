"use client";

import { useState } from "react";
import Link from "next/link";
import BackLink from "@/components/BackLink";
import { ChevronRight, ChevronDown, ChevronUp } from "@/components/icons";

/* ------------------------------------------------------------------ */
/*  Acceptance criteria per option                                     */
/* ------------------------------------------------------------------ */

interface OptionDef {
  title: string;
  description: string;
  href: string;
  ac: string;
}

const options: OptionDef[] = [
  {
    title: "Option 1",
    description:
      "Four-tab sidebar with dedicated Flags tab and page-grouped Form Data.",
    href: "/smart-assist-enhancements/option-1",
    ac: `## Smart Assist Enhancements — Option 1: Acceptance Criteria

### Icon Tab Bar
- Four icon-only tabs across the top of the sidebar: Transaction, Comments, Flags, Form Data.
- Active tab is indicated by a blue bottom border and blue icon color.
- Tabs support hover card previews (e.g., latest comment shown on Comments tab hover).
- A "more options" kebab icon sits at the trailing edge of the tab bar.
- Badge dot (red) appears on tabs with unread/new items (e.g., new comments).

### Transaction Tab
- Three collapsible sections, all expanded by default: Transaction Details, Contacts, Commission.
- **Transaction Details** shows key-value rows: Status (with "Pending" badge), File name, Type, Checklist Type, Agent, MLS #, Close of Escrow, Acceptance Date, Escrow #, Email, Year Built, Purchase Price, File ID.
- **Contacts** lists Buyer(s) and Lender with person icons and clickable names.
- **Commission** shows financial breakdown: Sale, Listing, Office gross, TC, Referral Agent, Other deductions.
- A "View Log" link at the bottom of the section.
- **Source comparison hover tooltips**: Hovering over transaction detail rows or contact names that have cross-source data reveals a tooltip showing values from Form, File, and/or MLS sources with a page reference.
- **Mismatch highlighting**: Fields with source disagreements (e.g., Purchase Price, Buyer name) display a subtle red-50 background highlight on the label and value text only (not the full row). Tooltips for mismatched fields show a warning icon and red text on differing values.

### Comments Tab
- Displays a chronological list of comments with author name, message body, and timestamp.
- New/unread comments are highlighted with a subtle background that fades after 3 seconds.
- A fixed comment input bar at the bottom with a text field and send button.
- Pressing Enter or clicking the send icon appends the new comment to the list.
- The comment list scrolls independently; input bar stays pinned to the bottom.

### Flags Tab
- Flag cards grouped by page number in **collapsible sections** (e.g., "Page 1", "Page 2"), all expanded by default.
- Each flag card shows:
  - A description of the issue (e.g. "The buyer's name doesn't match the name on file.")
  - Source comparison values showing Form / File / MLS data when applicable.
  - Accept and Reject action buttons.
- Clicking a flag card in the sidebar highlights the corresponding region on the document viewer.
- Clicking a highlighted region on the document viewer selects the matching flag card in the sidebar and auto-switches to the Flags tab.
- Selected flag card is visually distinguished with a blue left border.
- Bidirectional sync: selecting a flag from either the sidebar or the document keeps both in sync.

### Form Data Tab
- Displays extracted form fields organized by **page number** in collapsible sections (e.g., "Page 1", "Page 2", "Page 3", "Page 15", "Page 16", "MLS").
- Each field card shows:
  - Field label (bold) with a subsection badge (e.g., §A, §2B) when applicable.
  - Primary value from the form.
  - Expandable "Sources" toggle revealing File and/or MLS comparison values.
  - A mismatch indicator (warning icon + red border) when values disagree across sources.
  - "Missing" label (red italic) for empty required fields.
  - Source-only badge (Form, File, or MLS) for fields found in a single source only.
- A sticky search bar at the top filters fields in real-time across all page groups.
  - Sections with no matching fields are hidden.
  - A result count badge shows "X results" while searching.
  - Clear button (X icon) resets the search.
  - Empty state message shown when no fields match the query.

### Action Bar — Flags Integration
- The bottom action bar includes a "View Flags" button.
- Clicking "View Flags" switches the sidebar to the Flags tab.

### Document Viewer — Flag Highlights
- Flag regions are rendered as semi-transparent overlays on top of the document image.
- Default state: faint overlay visible on all flagged regions.
- Hover state: overlay becomes more prominent.
- Selected state: overlay turns to a distinct highlight color matching the selected flag.
- Clicking a highlight selects the flag and scrolls the sidebar Flags tab to the matching card.

### General
- Sidebar scrolls independently from the main content area.
- All text meets WCAG AA contrast requirements (minimum 4.5:1 ratio for normal text).
- Font: Proxima Nova via Adobe Fonts, with system-ui fallback.
- Responsive icon tab bar with equal-width tabs.`,
  },
  {
    title: "Option 2",
    description:
      "Alternate action bar and layout explorations.",
    href: "/smart-assist-enhancements/option-2",
    ac: `## Smart Assist Enhancements — Option 2

Work in progress.`,
  },
];

/* ------------------------------------------------------------------ */
/*  Copy-to-clipboard icon                                             */
/* ------------------------------------------------------------------ */

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckSmallIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Option card with expandable AC                                     */
/* ------------------------------------------------------------------ */

function OptionCard({ item }: { item: OptionDef }) {
  const [showAC, setShowAC] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.ac);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = item.ac;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Card row */}
      <div className="bg-white border border-grey-300 rounded-lg overflow-hidden">
        <Link
          href={item.href}
          className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-grey-50 transition-colors"
        >
          <div>
            <h2 className="text-grey-900 text-base font-bold group-hover:text-blue-800 transition-colors">
              {item.title}
            </h2>
            <p className="text-grey-800 text-sm mt-0.5">{item.description}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-grey-500 group-hover:text-blue-800 shrink-0 transition-colors" />
        </Link>

        {/* View AC toggle */}
        <button
          onClick={() => setShowAC(!showAC)}
          className="w-full flex items-center gap-1.5 px-5 py-2 border-t border-grey-200 text-sm font-medium text-blue-800 hover:bg-grey-50 transition-colors cursor-pointer"
        >
          {showAC ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          {showAC ? "Hide AC" : "View AC"}
        </button>

        {/* Expanded AC content */}
        {showAC && (
          <div className="border-t border-grey-200 bg-grey-50">
            {/* Copy button */}
            <div className="flex justify-end px-4 pt-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium text-grey-800 hover:text-blue-800 transition-colors cursor-pointer"
                title="Copy acceptance criteria to clipboard"
              >
                {copied ? (
                  <>
                    <CheckSmallIcon className="w-3.5 h-3.5 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <ClipboardIcon className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* AC text rendered as styled markdown-like content */}
            <div className="px-5 pb-5 pt-2">
              <ACRenderer text={item.ac} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Simple markdown-ish renderer for AC text                           */
/* ------------------------------------------------------------------ */

function ACRenderer({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="flex flex-col gap-0.5 text-sm leading-relaxed text-grey-900">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-2" />;

        // ## Heading
        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={i}
              className="text-base font-bold text-grey-900 mt-3 mb-1"
            >
              {trimmed.slice(3)}
            </h3>
          );
        }

        // ### Subheading
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={i}
              className="text-sm font-bold text-grey-900 mt-3 mb-0.5"
            >
              {trimmed.slice(4)}
            </h4>
          );
        }

        // - Bullet point
        if (trimmed.startsWith("- ")) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-grey-500 select-none shrink-0">•</span>
              <span className="text-grey-800">{renderInline(trimmed.slice(2))}</span>
            </div>
          );
        }

        // Indented bullet (  - )
        if (trimmed.startsWith("  - ")) {
          return (
            <div key={i} className="flex gap-2 pl-5">
              <span className="text-grey-500 select-none shrink-0">◦</span>
              <span className="text-grey-800">{renderInline(trimmed.slice(4))}</span>
            </div>
          );
        }

        return (
          <p key={i} className="text-grey-800">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/** Render inline bold/code formatting */
function renderInline(text: string): React.ReactNode {
  // Split on **bold** and `code` patterns
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Check for bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Check for inline code
    const codeMatch = remaining.match(/`(.+?)`/);

    // Find which comes first
    let nextMatch: RegExpMatchArray | null = null;
    let type: "bold" | "code" = "bold";

    if (boldMatch && codeMatch) {
      if ((boldMatch.index ?? Infinity) < (codeMatch.index ?? Infinity)) {
        nextMatch = boldMatch;
        type = "bold";
      } else {
        nextMatch = codeMatch;
        type = "code";
      }
    } else if (boldMatch) {
      nextMatch = boldMatch;
      type = "bold";
    } else if (codeMatch) {
      nextMatch = codeMatch;
      type = "code";
    }

    if (!nextMatch || nextMatch.index === undefined) {
      parts.push(remaining);
      break;
    }

    // Text before match
    if (nextMatch.index > 0) {
      parts.push(remaining.slice(0, nextMatch.index));
    }

    if (type === "bold") {
      parts.push(
        <strong key={key++} className="font-bold text-grey-900">
          {nextMatch[1]}
        </strong>
      );
    } else {
      parts.push(
        <code
          key={key++}
          className="bg-grey-200 text-grey-900 px-1 py-0.5 rounded text-xs"
        >
          {nextMatch[1]}
        </code>
      );
    }

    remaining = remaining.slice(
      (nextMatch.index ?? 0) + nextMatch[0].length
    );
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SmartAssistEnhancementsPage() {
  return (
    <div className="min-h-dvh bg-grey-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <BackLink href="/" label="Back to Quick Audit" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-grey-900 text-3xl font-bold tracking-tight">
            Smart Assist Enhancements
          </h1>
          <p className="text-grey-800 text-base mt-2">
            3/11/25 — Explore smart assist design enhancements.
          </p>
        </div>

        {/* Quick access */}
        <div className="mb-6">
          <Link
            href="/smart-assist-enhancements/option-2"
            className="group flex items-center justify-between gap-3 bg-blue-800 text-white rounded-lg px-5 py-4 hover:bg-blue-900 transition-colors"
          >
            <div>
              <p className="text-sm font-bold">Quick Access</p>
              <p className="text-sm mt-0.5 opacity-80">Jump to Option 2 — Transaction Tab Customization</p>
            </div>
            <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 shrink-0 transition-opacity" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {options.map((item) => (
            <OptionCard key={item.href} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
