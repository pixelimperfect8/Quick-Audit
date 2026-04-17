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

### Resizable Panels
- The workspace is split into three panels — left (checklist), center (document viewer), right (data sidebar) — and the user can resize any of them by dragging the divider between them.
- Resizing one panel adjusts its neighbor's width in real time; the other panels keep their proportions.
- Each panel has a minimum width. The user cannot collapse a panel past the minimum by dragging.
- Panel widths persist for the duration of the session (are not reset on tab switches, navigation within the app, or search).

### Top Navigation — Actions Menu
- A **Stage selector** lets the user move the transaction between lifecycle stages.
- An **Actions menu** opens a dropdown with transaction-level actions:
  - **Cancel Transaction** — moves the transaction into a cancelled state.
  - **Archive Transaction** — archives the transaction and removes it from active lists.
- The menu opens on click, closes when the user clicks outside it, and the trigger visibly reflects open/closed state.
- An **Update Agent** action is always visible at the top level (not inside the dropdown) for faster access.

### Left Sidebar — Checklist & Comments
- The checklist groups all required documents for the transaction. Each item exposes its name, status (Complete / Flagged / Pending / Required), and a comment affordance.
- Any checklist item can accept threaded comments. The comment indicator on an item reflects whether it already has comments (visually distinct state when unread/present).
- **Quick reply (popover)**: clicking the comment affordance opens an inline popover anchored to that item, showing the latest comment and an input to reply without leaving the checklist.
- **Full thread (drawer)**: from the popover, the user can open a larger drawer that shows the entire thread for that item, with a sticky reply input at the bottom.
- Replies sent from either surface appear immediately in both — the popover and drawer stay in sync, and the newest message is briefly highlighted so the user can see what just landed.
- Closing the drawer returns the user to the checklist with state preserved.
- Comments are scoped per checklist item; opening a different item shows its own thread.

### Document Viewer
- The center viewer opens a document from the checklist in a tab; multiple documents can be open simultaneously and switched via tabs.
- The viewer supports page navigation, zoom in/out with a live zoom readout, an overlay visibility toggle, and download/print actions.
- Flag overlays and form-field overlays are drawn on top of the page. Clicking either overlay syncs the right sidebar: field overlays select the matching row, flag overlays select the matching issue. The reverse also works — selecting a row or issue in the sidebar highlights the matching overlay and scrolls to it.

### Right Sidebar — Global Search
- A unified search input at the top of the right sidebar searches across the entire transaction: summary fields, dates, contacts, commission, flags, form data, checklist items, and documents.
- Results are grouped by category so the user can scan by type; each group shows its own hits until the query is cleared.
- Selecting a result routes the user to the right place:
  - A **transaction / form-data** hit switches to the section it belongs to and selects that field (which in turn highlights the field in the document).
  - A **contact** hit opens the contact's detail panel.
  - A **flag** hit selects the flag in both the sidebar and the viewer.
  - A **checklist** or **document** hit loads that document in the viewer.
- Search can be cleared with a single action; closing search returns the sidebar to its previous section.

### Right Sidebar — Section Tabs
- Below the search input, the right sidebar uses tabs to surface transaction data by section: **Summary**, **Dates**, **Contacts**, **Commission**.
- Switching tabs changes which dataset is shown without reloading the sidebar. State elsewhere in the sidebar (Issues, Successful Checks, selections) is preserved.
- If a section is hidden via the Customize Panel, its tab is removed; the sidebar automatically falls back to the first available section when the active one is hidden.
- Selecting a field (by click, search result, or document overlay) auto-switches to the correct section tab and scrolls the matching row into view.

### Hover Tooltips on Data
- Hovering any data row (summary, date, contact, commission) opens a tooltip that shows where the value came from — the source form, the file-level record, MLS, or other origins — so the user can audit provenance without leaving the sidebar.
- The source label identifies the **specific source form** by name (e.g. RPA, SPD, HIR), not a generic "Form" label, so the user knows exactly which document the value was pulled from.
- Mismatched values are called out visually in the tooltip and on the row itself, so the user can see a discrepancy at a glance.
- Tooltips are dismissible by moving away from the row and automatically close when the user scrolls or resizes the window, so a stale tooltip never hangs over unrelated content.

### Flagged Issues List
- Below the section content, the sidebar surfaces a list of all **Issues** (flags) detected by Smart Assist, with a count in the header.
- Each issue, on hover, shows a tooltip explaining the problem and — when applicable — the conflicting values from each source (stacked, with the specific form name as the source label).
- Selecting an issue selects the flag in the viewer, highlights the corresponding overlay, and scrolls the issue row into view. Selecting a flag in the viewer does the reverse.
- Users can work through issues without losing context: selections are persistent until changed, and rejecting/resolving a flag updates any mismatch indicators on the related data rows.

### Issues — Current vs. All Toggle
- The Issues header has an inline **Current / All toggle**.
- **Current** (default) shows only issues that belong to the document currently loaded in the viewer — useful while actively reviewing one form.
- **All** shows every issue across every document in the checklist — useful for a full-transaction sweep.
- Each mode shows its own count in the toggle, and the Issues header count reflects the active mode.
- Switching documents in the viewer re-scopes the "Current" list automatically; no manual refresh is needed.
- When the active filter has no issues, the user sees an empty-state message instead of a blank list.

### Successful Checks List
- A companion list shows every field that passed validation ("Successful checks"), so the user has positive confirmation of what's already clean, not just what's wrong.
- Each check, on hover, shows a tooltip with the values from all available sources (stacked, source-name-labeled, including the specific form name).
- Selecting a successful check highlights the matching field in the document viewer and scrolls the sidebar row into view; selecting a field in the viewer highlights the matching check row.

### Expand / Collapse — Issues & Checks
- The Issues section and the Successful Checks section are each expandable/collapsible, so the user can focus on one list at a time or hide both while working in the section tabs.
- Header-level controls inside each section (like the Current/All toggle on Issues) remain operable without having to expand the section first, and interacting with them does not collapse the section.
- Expand/collapse state is independent between the two sections and is preserved while the user navigates within the sidebar.

### Customize Panel
- A **Customize Panel** action in the sidebar footer opens an editor that lets the user tailor the right sidebar to their workflow. The action toggles to **Done** while the editor is active.
- Inside the editor the user can:
  - **Show or hide any individual field** within a section.
  - **Show or hide entire sections** (Summary, Dates, Contacts, Commission).
  - **Reorder sections** to change the order of the tabs.
  - **Reorder fields** inside a section.
  - **Reset to Defaults** to restore the original visibility and ordering in one action.
- **Contacts are managed by role, not by person.** The Contacts section exposes roles — Buyer, Lender, Seller, Buyer Agent — so a single show/hide affects that role across every file in the transaction. Buyer and Lender are visible by default; Seller and Buyer Agent start hidden.
- Hiding a section or field is reflected immediately in the live sidebar (and anywhere the field is referenced, e.g. search results and tab bar).
- Closing the editor returns the user to the customized sidebar with all changes applied; reopening shows the current configuration, not the defaults.`,
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
