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
      "Three-tab sidebar with per-item comments, page-grouped Form Data, and pin-to-summary.",
    href: "/smart-assist-enhancements/option-1",
    ac: `## Smart Assist Enhancements — Option 1: Acceptance Criteria

### Panel Resizer
- The layout consists of three resizable panels: left sidebar (document checklist), center (document viewer), and right sidebar.
- A drag handle between each panel allows horizontal resizing by clicking and dragging.
- Panels enforce minimum widths so content remains readable.
- Panel widths persist during the session; resizing is smooth with no jank.

### Comments Feature (Per-Checklist-Item)
- Comments are **not** a tab in the right sidebar. The sidebar has three tabs only: Transaction, Flags, All Data.
- Each checklist item in the left sidebar displays a comment icon button next to its status badge.
- A **blue dot indicator** appears on the comment icon for items that have existing comments.
- **Popover**: Clicking the comment icon opens a click-triggered popover showing:
  - The latest comment (author, text, timestamp).
  - A reply text input with send button (Enter to send).
  - A "View all N comments" link at the bottom.
- **Drawer**: Clicking "View all" slides a full-height drawer over the left sidebar from the left, showing:
  - A header with the checklist item name (truncated if long) and a close (X) button.
  - A scrollable list of all comments for that item, each with author, text, and timestamp.
  - New comments are highlighted with a subtle background that fades after 3 seconds.
  - A pinned reply input at the bottom.
- Sending a comment from either the popover or drawer updates both views.
- Closing the drawer slides it out and returns to the checklist.
- Clicking outside the popover or pressing Escape closes it.

### Cleared/Flag Indicators in All Data Tab
- Each field card shows a **checkmark icon** (green) for cleared fields or a **warning icon** (orange) for flagged fields next to the label.
- Flagged fields display their label in **red text** and show a red left border on the card.
- "Missing" fields show the label in red with italic "Missing" as the value.
- **Flagged items have their Sources section expanded by default** so discrepancies are immediately visible.
- Cleared items have Sources collapsed by default.

### All Data Organization: By Page
- Form data fields are organized by **page number** in collapsible sections (e.g., "Page 1", "Page 2", "Page 15", "MLS").
- All sections are expanded by default.
- A sticky search bar at the top filters fields in real-time across all page groups.
  - Sections with no matching fields are hidden during search.
  - A result count badge shows "X results" while searching.
  - Clear button (X) resets the search.
  - Empty state message shown when no fields match.

### Global Search
- A search bar sits at the top of the right sidebar, above the tab bar.
- Typing a query searches across **all tabs simultaneously**: Transaction details, Contacts, Commission, Flags, Form Data, Checklist items, and Documents.
- Results are grouped by category with color-coded dot indicators (e.g., orange for Flags, green for Checklist, blue for Transaction).
- Each result shows the category label, matched field name, and detail/value.
- Clicking a result navigates to the relevant tab and highlights the matched item.
- The tab bar is hidden while search is active; clearing the search restores it.

### Pin to Summary
- Each field card in the All Data tab has a "Pin" button (pin icon + label).
- Clicking "Pin" adds the field to the Transaction tab as a pinned row.
- Pinned fields appear in a dedicated "Pinned Fields" section at the top of the Transaction tab.
- Each pinned row shows an always-visible unpin button (pin icon with tooltip "Unpin").
- Clicking "Unpin" removes the field from the Transaction tab and resets the pin state in All Data.
- Pinning/unpinning is instant with no page reload.`,
  },
  {
    title: "Option 2",
    description:
      "Four-tab sidebar with Comments tab, section-grouped Form Data, and Edit Summary customization.",
    href: "/smart-assist-enhancements/option-2",
    ac: `## Smart Assist Enhancements — Option 2: Acceptance Criteria

### Panel Resizer
- The layout consists of three resizable panels: left sidebar (document checklist), center (document viewer), and right sidebar.
- A drag handle between each panel allows horizontal resizing by clicking and dragging.
- Panels enforce minimum widths so content remains readable.
- Panel widths persist during the session; resizing is smooth with no jank.

### Comments Feature (Dedicated Tab)
- The right sidebar has four tabs: Transaction, **Comments**, Flags, All Data.
- A **red badge dot** appears on the Comments tab icon when there are unread comments.
- **Hover preview**: Hovering over the Comments tab icon shows a hover card with the latest comment (author, text, timestamp).
- The Comments tab displays a chronological list of all comments with author name, message body, and timestamp.
- New/unread comments are highlighted with a subtle background that fades after 3 seconds.
- A fixed comment input bar is pinned at the bottom with a text field and send button.
- Pressing Enter or clicking the send icon appends the new comment to the list and auto-scrolls to it.
- The comment list scrolls independently; the input bar stays pinned.
- Switching to the Comments tab clears the unread badge.

### Cleared/Flag Indicators in All Data Tab
- Each field card shows a **checkmark icon** (green) for cleared fields or a **warning icon** (orange) for flagged fields next to the label.
- Flagged fields display their label in **red text** and show a red left border on the card.
- "Missing" fields show the label in red with italic "Missing" as the value.
- **Flagged items have their Sources section expanded by default** so discrepancies are immediately visible.
- Cleared items have Sources collapsed by default.

### All Data Organization: By Section/Category
- Form data fields are organized by **logical section** in collapsible groups (e.g., "Transaction Summary", "Contacts", "Financial", "Property Details").
- This groups related fields together regardless of which page they appear on.
- All sections are expanded by default.
- Each field card shows its source badge and expandable Sources comparison.

### Global Search
- A search bar sits at the top of the right sidebar, above the tab bar.
- Typing a query searches across **all tabs simultaneously**: Transaction details, Contacts, Commission, Comments, Flags, Form Data, Checklist items, and Documents.
- Results are grouped by category with color-coded dot indicators.
- Each result shows the category label, matched field name, and detail/value.
- Clicking a result navigates to the relevant tab and highlights the matched item.
- The tab bar is hidden while search is active; clearing the search restores it.

### Summary Customization (Edit Summary)
- The Transaction tab footer has an "Edit Summary" button.
- Clicking "Edit Summary" slides in an edit overlay from the right with the following controls:
  - **Toggle field visibility**: Each field has a show/hide toggle. Hidden fields are removed from the Transaction tab.
  - **Toggle section visibility**: Entire sections (Summary, Dates, Contacts, Commission) can be hidden.
  - **Reorder sections**: Drag handles allow reordering the section display order.
  - **Reorder fields within sections**: Drag handles allow reordering fields within each section.
  - **Reset to Defaults**: A button restores all visibility and ordering to the original state.
- Clicking "Done Editing" (or the close button) slides the overlay out, returning to the customized Transaction tab.
- A "View Hidden Data" link appears when fields/sections are hidden, opening a drawer listing all hidden items with "Show" buttons to restore them individually.`,
  },
  {
    title: "Option 3",
    description:
      "Section-tabbed right panel with unified Issues / Successful Checks lists, global search, and a slide-in Customize Panel editor.",
    href: "/smart-assist-enhancements/option-3",
    ac: `## Smart Assist Enhancements — Option 3: Acceptance Criteria

### Panel Resizer
- The layout consists of three resizable panels: left sidebar (document checklist), center (document viewer), and right sidebar.
- A drag handle between each panel allows horizontal resizing by clicking and dragging.
- Panels enforce minimum widths so content remains readable.

### Header
- A segmented-control pill tab group in the header switches between **Listings / Transactions / Both**. The active pill has a white fill with a subtle 0.5px grey border on a grey track, and sliding between tabs animates the indicator via a CSS transition (no layout wobble — the ghost-text trick reserves bold width on every tab).
- A **Stage selector** and an **Actions dropdown** (with "Cancel Transaction" and "Archive Transaction") sit to the right of the tab group. The Actions chevron flips when the dropdown is open and closes on outside click.
- An **Update Agent** button sits at the far right, matching the height of the elements beside it.
- The address selector, back button, and mobile sidebar/details toggles behave as in the other options.

### Left Sidebar — Checklist
- Checklist items render flush with 8px left padding and 16px right padding (no extra inset).
- Each checklist item displays its number, name, status badge, and comment icon.
- Status badges use a fixed 81px width. The **Flagged** badge shows a slightly larger warning icon without widening the badge.
- Comment icon shows a **blue dot indicator** when the item has existing comments.

### Comments Feature (Per-Checklist-Item)
- Comments live on the left checklist, not the right sidebar.
- Clicking the comment icon opens a click-triggered popover showing the latest comment, a reply input, and a "View all N comments" link.
- Clicking "View all" slides a full-height drawer over the left sidebar with the complete comment thread and a pinned reply input.
- New comments are highlighted with a subtle background that fades after ~3 seconds.
- Sending from the popover or drawer keeps both views in sync.

### Document Viewer
- Page 1 renders as a blank white page (no PDF preview). Other pages render the existing placeholder skeleton.
- **Form field highlight overlays** and **flag highlight overlays** still render over the blank page at their original coordinates.
- Clicking a form-field overlay selects the corresponding field in the right sidebar; clicking a flag overlay selects the flag.
- Overlays can be hidden/shown via the viewer's overlay toggle.

### Right Sidebar — Global Search
- A search bar sits at the top of the right sidebar. Focusing the input or typing activates search mode; a close (X) icon clears and exits search mode.
- Typing a query searches across **Transaction details, Dates, Contacts, Commission, Flags, Form Data, Checklist items, and Documents**.
- Results are grouped by category (Transactions, Contacts, Commission, Flags, Form Data, Checklist, Documents) with color-coded dot indicators and **horizontal dividers between groups**.
- Each result shows the category label, matched field name, and detail/value.
- Clicking a result:
  - Clears the query and blurs the input.
  - For Transaction / Form Data results, switches the section tab to the correct section and selects the matching form field (bi-directional highlight on the form).
  - For Contact results, opens the contact detail drawer.
  - For Flag results, selects the flag and highlights it in the viewer.
  - For Checklist / Document results, loads the matching document in the viewer.

### Right Sidebar — Section Tabs (Form Data)
- Under the search bar sits a horizontal **tab bar** with sections: Summary, Dates, Contacts, Commission.
- The active tab uses **blue bold** text with a blue underline. Inactive tabs use **grey medium** weight (not bold).
- Hidden sections (via Customize Panel) are dropped from the tab bar; the active tab falls back to the first visible section when its current tab is hidden.

### Section Content — Data Rows
- Each data row shows a bold label (120px wide) and a value.
- Rows have a **hover background** (hover:bg-grey-50) and subtle rounded corners.
- Rows with a mismatched source render the label and value text inside a **light red (bg-red-50)** pill mark to flag the discrepancy. Text color stays grey-900.
- Hovering a data row shows a **Source comparison tooltip** (Form / File / MLS) via a portal-rendered HoverCard.
- **Tooltips auto-close** as soon as the user scrolls any ancestor scroll container or resizes the window.

### Section Content — Contact Rows
- Contact rows show a role label, a person icon, and the contact name.
- Clicking the contact name opens the contact detail drawer.
- Contacts with a mismatched source render the name inside the same light red mark (grey-900 text, bg-red-50 pill).
- Hover, source tooltip, and scroll-close behavior match data rows.

### Issues & Successful Checks (Global Lists)
- Below the section content, two collapsible groups list all issues and cleared fields:
  - **Issues (N)** — warning icon, expanded by default.
  - **Successful checks (N)** — check icon, expanded by default.
- Each issue/check row has a hover background and shows a HoverCard tooltip with flag details or source comparison.
- Clicking an issue selects the flag, highlights the matching form overlay in the viewer, and scrolls the selected row into view.
- Clicking a successful check selects the form field, highlights the matching form overlay, and scrolls into view.
- **Selected issue rows** use a **bg-red-50** highlight. **Selected check rows** use a subtle **bg-green-50/25** highlight. Text color is unchanged.
- The reverse flow also works: clicking a highlight in the document viewer selects and scrolls to the matching row in the sidebar.

### Customize Panel (Edit Summary Overlay)
- The right sidebar footer contains a **"Customize Panel"** button (edit icon + label). Clicking it toggles to **"Done"**.
- When active, a **slide-in overlay** from the right covers the sidebar with the Customize Panel editor:
  - **Toggle field visibility**: each field in a section has a show/hide toggle.
  - **Toggle section visibility**: entire sections (Summary, Dates, Contacts, Commission) can be hidden.
  - **Reorder sections**: drag handles reorder the section tab order.
  - **Reorder fields within sections**: drag handles reorder fields inside a section.
  - **Reset to Defaults**: restores all visibility and ordering to the initial state (hidden extras re-hidden, default section order restored).
- Clicking "Done" slides the overlay out and returns to the customized sidebar.

### Settings Button
- A **Settings** button sits in the right sidebar footer next to Customize Panel as a placeholder for future settings.`,
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
