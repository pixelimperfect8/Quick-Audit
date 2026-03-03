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
      "Baseline dashboard layout — starting point for sidebar modifications.",
    href: "/sidebar-improvements/option-1",
    ac: `## Sidebar — Option 1: Acceptance Criteria

### Icon Tab Bar
- Four icon-only tabs across the top of the sidebar: Transaction, Comments, Flags, Form Data.
- Active tab is indicated by a blue bottom border and blue icon color.
- Each icon shows a hover card with a contextual preview on hover.
- A "more options" kebab icon sits at the trailing edge of the tab bar.
- Badge dot (red) appears on tabs with unread/new items.

### Transaction Tab
- Displays transaction header with property address, price, close date, and MLS number.
- Shows a collapsible "Parties" section listing Buyer(s) and Seller(s) with name, role badge, and contact info.
- Shows a collapsible "Documents" section with document checklist items (name, status badge, page count).
- Collapsible sections default to open and toggle on click.

### Comments Tab
- Displays a chronological list of comments with author name, message body, and timestamp.
- New/unread comments are highlighted with a subtle background that fades after 3 seconds.
- A fixed comment input bar at the bottom with a text field and send button.
- Pressing Enter or clicking the send icon appends the new comment to the list.
- The comment list scrolls independently; input bar stays pinned to the bottom.

### Flags Tab
- Displays a list of flag cards, each showing:
  - A description of the issue (e.g. "The buyer's name doesn't match the name on file.")
  - Source comparison chips showing Form / File / MLS values when applicable.
  - Page number reference.
- Clicking a flag card in the sidebar highlights the corresponding region on the document viewer.
- Clicking a highlighted region on the document viewer selects the matching flag card in the sidebar and auto-switches to the Flags tab.
- Selected flag card is visually distinguished with a blue left border.
- Bidirectional sync: selecting a flag from either the sidebar or the document keeps both in sync.

### Form Data Tab
- Displays extracted form fields grouped into collapsible sections (e.g. "Property Information", "Financial Details", "Parties").
- Each field row shows:
  - Field label (bold).
  - Primary value from the form.
  - Expandable source comparison (Form / File / MLS values) toggled by a "Sources" button.
  - A mismatch indicator (warning icon + red left border) when values disagree across sources.
  - Page reference.
- A sticky search bar at the top filters fields in real-time across all sections.
  - Matching text is highlighted in yellow within field labels and values.
  - Sections with no matching fields collapse automatically.
  - A result count badge shows "X results" while searching.
  - Clear button (X icon) resets the search.

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

export default function SidebarImprovementsPage() {
  return (
    <div className="min-h-dvh bg-grey-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <BackLink href="/" label="Back to Quick Audit" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-grey-900 text-3xl font-bold tracking-tight">
            Sidebar Improvements
          </h1>
          <p className="text-grey-800 text-base mt-2">
            Explore alternative sidebar designs and layouts.
          </p>
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
