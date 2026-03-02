"use client";

import { useState } from "react";
import { Button, IconButton, Badge, StatusBadge, DetailRow, Divider, Collapsible, DrawerHeader, Tabs, HoverCard, TextInput, FileCard } from "./ui";
import { ThumbUp, ThumbDown, WarningIcon, DownloadIcon, PrintIcon, ZoomInIcon, PersonIcon } from "./icons";
import type { DocStatus } from "./ui";

const statuses: DocStatus[] = ["Flagged", "Pending", "Complete", "Required"];

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="border border-grey-300 rounded-lg overflow-hidden shrink-0">
      <div className="bg-grey-50 px-4 py-3 border-b border-grey-300">
        <h3 className="text-grey-900 text-base font-bold">{title}</h3>
        <p className="text-grey-700 text-sm mt-0.5">{description}</p>
      </div>
      <div className="p-4 flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}

function StateLabel({ label }: { label: string }) {
  return <span className="text-grey-500 text-xs font-medium uppercase tracking-wide">{label}</span>;
}

export default function DesignSystemViewer() {
  const [open, setOpen] = useState(false);
  const [demoTab, setDemoTab] = useState<"One" | "Two">("One");

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[100] bg-purple-600 hover:bg-purple-600/90 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="Open design system viewer"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-300 shrink-0">
          <div>
            <h2 className="text-grey-900 text-lg font-bold">Design System</h2>
            <p className="text-grey-700 text-sm">Quick-Audit component library</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-grey-700 hover:text-grey-900 p-1"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* Color Tokens */}
          <Section title="Color Tokens" description="Design tokens defined as CSS custom properties in globals.css">
            <div>
              <StateLabel label="Grey Scale" />
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { n: 50, cls: "bg-grey-50" },
                  { n: 100, cls: "bg-grey-100" },
                  { n: 200, cls: "bg-grey-200" },
                  { n: 300, cls: "bg-grey-300" },
                  { n: 400, cls: "bg-grey-400" },
                  { n: 500, cls: "bg-grey-500" },
                  { n: 600, cls: "bg-grey-600" },
                  { n: 700, cls: "bg-grey-700" },
                  { n: 800, cls: "bg-grey-800" },
                  { n: 900, cls: "bg-grey-900" },
                ].map(({ n, cls }) => (
                  <div key={n} className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-lg border border-grey-300 ${cls}`} />
                    <span className="text-[10px] text-grey-700">{n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <StateLabel label="Semantic" />
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { name: "Blue 800", cls: "bg-blue-800" },
                  { name: "Green 500", cls: "bg-green-500" },
                  { name: "Green 600", cls: "bg-green-600" },
                  { name: "Red 400", cls: "bg-red-400" },
                  { name: "Red 500", cls: "bg-red-500" },
                  { name: "Orange 200", cls: "bg-orange-200" },
                  { name: "Yellow 200", cls: "bg-yellow-200" },
                  { name: "Purple 600", cls: "bg-purple-600" },
                ].map((c) => (
                  <div key={c.name} className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-lg border border-grey-300 ${c.cls}`} />
                    <span className="text-[10px] text-grey-700">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* Button */}
          <Section title="Button" description="Action buttons with variant and size props. Supports icons and loading/disabled states.">
            <div>
              <StateLabel label="Variants" />
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Button variant="primary" icon={<ThumbUp className="w-4 h-4" />}>Primary</Button>
                <Button variant="danger" icon={<ThumbDown className="w-4 h-4" />}>Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>
            <div>
              <StateLabel label="Sizes" />
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
              </div>
            </div>
            <div>
              <StateLabel label="Disabled" />
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Button variant="primary" disabled>Disabled Primary</Button>
                <Button variant="danger" disabled>Disabled Danger</Button>
              </div>
            </div>
          </Section>

          {/* IconButton */}
          <Section title="IconButton" description="Compact icon-only buttons for toolbars. Requires an aria-label for accessibility.">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <IconButton icon={<ZoomInIcon className="w-5 h-5" />} label="Zoom in" />
                <StateLabel label="Default" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <IconButton icon={<DownloadIcon className="w-5 h-5" />} label="Download" />
                <StateLabel label="Default" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <IconButton icon={<PrintIcon className="w-5 h-5" />} label="Print" />
                <StateLabel label="Default" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <IconButton icon={<ZoomInIcon className="w-5 h-5" />} label="Disabled" disabled />
                <StateLabel label="Disabled" />
              </div>
            </div>
          </Section>

          {/* Badge */}
          <Section title="Badge" description="Inline status indicators with semantic color variants.">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <Badge variant="default">Default</Badge>
                <StateLabel label="default" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Badge variant="warning">Pending</Badge>
                <StateLabel label="warning" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Badge variant="success">Approved</Badge>
                <StateLabel label="success" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <Badge variant="info">Info</Badge>
                <StateLabel label="info" />
              </div>
            </div>
          </Section>

          {/* StatusBadge */}
          <Section title="StatusBadge" description="Document checklist status indicators with icons. Maps to status-specific design tokens.">
            <div className="flex flex-wrap items-center gap-3">
              {statuses.map((s) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <StatusBadge status={s} />
                  <StateLabel label={s} />
                </div>
              ))}
            </div>
          </Section>

          {/* DetailRow */}
          <Section title="DetailRow" description="Label-value pair used in transaction details, lender info, and commission data.">
            <div className="flex flex-col gap-3 max-w-md">
              <DetailRow label="Name" value="Mark Roberts" />
              <DetailRow label="Email" value="mark@example.com" isLink />
              <DetailRow label="Status">
                <Badge variant="warning">Pending</Badge>
              </DetailRow>
            </div>
          </Section>

          {/* Divider */}
          <Section title="Divider" description="Horizontal separator line. Accepts className for margin customization.">
            <div className="flex flex-col gap-2">
              <p className="text-grey-700 text-sm">Content above</p>
              <Divider />
              <p className="text-grey-700 text-sm">Content below</p>
            </div>
          </Section>

          {/* Tabs */}
          <Section title="Tabs" description="Tab navigation with underline and pill variants.">
            <div>
              <StateLabel label="Underline variant" />
              <div className="mt-2 border border-grey-300 rounded-lg overflow-hidden">
                <Tabs items={["One", "Two"] as const} activeItem={demoTab} onTabChange={setDemoTab} variant="underline" />
              </div>
            </div>
            <div>
              <StateLabel label="Pill variant" />
              <div className="mt-2">
                <Tabs items={["Listings", "Transactions", "Both"] as const} activeItem="Both" onTabChange={() => {}} variant="pill" height="h-10" />
              </div>
            </div>
          </Section>

          {/* Collapsible */}
          <Section title="Collapsible" description="Expandable section with chevron toggle. Manages its own open/close state internally.">
            <div className="border border-grey-300 rounded-lg overflow-hidden">
              <Collapsible title="Transaction Details" defaultOpen>
                <DetailRow label="Type" value="Purchase" />
                <DetailRow label="Agent" value="Aaron Smith" />
              </Collapsible>
              <Collapsible title="Commission" defaultOpen={false}>
                <DetailRow label="Sale" value="$99,999.99" />
              </Collapsible>
            </div>
          </Section>

          {/* DrawerHeader */}
          <Section title="DrawerHeader" description="Sticky header with close button for slide-in drawer panels (Lender, Activity Log).">
            <div className="border border-grey-300 rounded-lg overflow-hidden">
              <DrawerHeader title="Lender" onClose={() => {}} />
            </div>
          </Section>

          {/* HoverCard */}
          <Section title="HoverCard" description="Hover-triggered popover card for previewing content. Uses a portal by default to escape overflow containers.">
            <div>
              <StateLabel label="Bottom (default)" />
              <div className="flex flex-wrap items-center gap-6 mt-2">
                <HoverCard
                  portal={false}
                  trigger={
                    <Button variant="outline">Hover me</Button>
                  }
                >
                  <div className="w-56 p-3">
                    <p className="text-grey-900 text-sm font-bold">Preview Card</p>
                    <p className="text-grey-700 text-sm mt-1">This content appears on hover with a smooth fade-in animation.</p>
                  </div>
                </HoverCard>
                <HoverCard
                  portal={false}
                  trigger={
                    <Button variant="outline">Right-aligned</Button>
                  }
                  align="right"
                >
                  <div className="w-56 p-3">
                    <p className="text-grey-900 text-sm font-bold">Right Aligned</p>
                    <p className="text-grey-700 text-sm mt-1">Card aligns to the right edge of the trigger.</p>
                  </div>
                </HoverCard>
              </div>
            </div>
            <div>
              <StateLabel label="Top side" />
              <div className="flex flex-wrap items-center gap-6 mt-2">
                <HoverCard
                  portal={false}
                  trigger={
                    <Button variant="outline">Top hover</Button>
                  }
                  side="top"
                >
                  <div className="w-56 p-3">
                    <p className="text-grey-900 text-sm font-bold">Top Position</p>
                    <p className="text-grey-700 text-sm mt-1">Card appears above the trigger element.</p>
                  </div>
                </HoverCard>
              </div>
            </div>
          </Section>

          {/* TextInput */}
          <Section title="TextInput" description="Auto-expanding textarea with optional inline action button. Used for comment inputs and message fields.">
            <div>
              <StateLabel label="Default" />
              <div className="max-w-md mt-2">
                <TextInput placeholder="Type something..." />
              </div>
            </div>
            <div>
              <StateLabel label="With action button" />
              <div className="max-w-md mt-2">
                <TextInput
                  placeholder="Leave a comment..."
                  action={
                    <button className="p-2 mr-1 mb-0.5 rounded-full text-grey-400" disabled>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </button>
                  }
                />
              </div>
            </div>
          </Section>

          {/* FileCard */}
          <Section title="FileCard" description="Document file card for checklist items. Supports active state and optional remove button.">
            <div className="flex flex-col gap-2 max-w-md">
              <div className="flex flex-col gap-1">
                <StateLabel label="Active" />
                <FileCard name="CAR_California_Agreement.pdf" date="13 days ago" active onRemove={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <StateLabel label="Default" />
                <FileCard name="Form 2" date="13 days ago" onRemove={() => {}} />
              </div>
              <div className="flex flex-col gap-1">
                <StateLabel label="No remove button" />
                <FileCard name="ReadOnly_Document.pdf" date="2 hours ago" />
              </div>
            </div>
          </Section>

          {/* Overlay */}
          <Section title="Overlay" description="Semi-transparent backdrop for mobile sidebar drawers. Supports breakpoint-based hiding (lg/xl).">
            <p className="text-grey-700 text-sm">Renders a fixed black/30 overlay that is hidden above the specified breakpoint. Used in the main layout for mobile sidebar toggling.</p>
          </Section>

          {/* Sidebar */}
          <Section title="Sidebar" description="Responsive sidebar wrapper with mobile slide-in animation and close button. Supports left/right positioning.">
            <p className="text-grey-700 text-sm">Wraps content in a fixed-to-relative sidebar that slides in on mobile and is always visible above the configured breakpoint. Includes a built-in close button for mobile.</p>
          </Section>

        </div>
      </div>
    </div>
  );
}
