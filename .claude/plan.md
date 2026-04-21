# Smart Assist Enhancements — Option 2 Only

All changes scoped to `/smart-assist-enhancements/option-2` only. Option 1 remains untouched.

**Key approach:** Both options currently share `RightSidebar` and `TransactionContent`. To avoid breaking Option 1, we **duplicate** these components for Option 2, creating dedicated copies that we can modify freely.

---

## 0. Duplicate shared components for Option 2

- Copy `RightSidebar.tsx` → `SmartAssistOption2Sidebar.tsx` (new file in `src/components/sidebar-improvements/`)
- Copy `TransactionContent.tsx` → `SmartAssistOption2TransactionContent.tsx`
- Update Option 2 page (`smart-assist-enhancements/option-2/page.tsx`) to import from the new duplicates
- Option 1 continues using the original `RightSidebar` and `TransactionContent` untouched

## 1. Remove "View" button, make "4 Issues Found" clickable

- Add a `hideViewButton` prop to `ActionBar` (additive, no breakage)
- Extend `actionBarProps` in `Dashboard.tsx` to include `hideViewButton`
- Option 2 page passes `hideViewButton: true`
- "4 Issues Found" button already calls `onViewFlags` — it stays as the trigger

**Files:** `ActionBar.tsx`, `Dashboard.tsx`, `smart-assist-enhancements/option-2/page.tsx`

## 2. Tooltip on pin icon hover

- Add `<Tooltip label="Unpin">` around the pin button in the new `SmartAssistOption2TransactionContent` (if not already present)

## 3. Add access card to Smart Assist Enhancements landing page

- Add a quick-access card on the landing page linking to Option 2

**Files:** `src/app/smart-assist-enhancements/page.tsx`

## 4. Edit Summary — Transaction Tab Customization

Core feature: **allow users to customize their Transaction tab view** — what data they see, how it's arranged, and what data they hide from this view.

- Add `sidebarFooter` prop to `Dashboard` for custom footer content (additive, no breakage)
- Option 2 passes custom footer with "Edit Summary" + "Settings" buttons
- When "Edit Summary" is clicked, enter **edit mode** on the Transaction tab:
  - Each section (Transaction Summary, Contacts, Commission) can be reordered (up/down arrows)
  - Individual fields can be toggled visible/hidden
  - Entire sections can be hidden
  - Save/Cancel buttons to confirm changes
- State managed at Option 2 page level:
  - `hiddenFields: Set<string>` — fields hidden from the Transaction tab view
  - `sectionOrder: string[]` — custom section ordering
  - `editMode: boolean` — whether edit mode is active
- These props flow into `SmartAssistOption2Sidebar` → `SmartAssistOption2TransactionContent`

**Files:** `Dashboard.tsx`, `smart-assist-enhancements/option-2/page.tsx`, `SmartAssistOption2Sidebar.tsx`, `SmartAssistOption2TransactionContent.tsx`

## 5. Hidden Data drawer

- Add a "Hidden Data" button at the bottom of the Transaction tab (below "View Log")
- Only visible when there are hidden fields
- Opens a drawer (same pattern as LenderDetail/ActivityLog) showing all hidden fields with their values
- Each hidden item has a "Show" button to restore it to the Transaction tab
- Uses the same `hiddenFields` state from step 4

**Files:** `smart-assist-enhancements/option-2/page.tsx`, new `SmartAssistHiddenDataDrawer.tsx`

---

## Implementation Order

1. Duplicate components (SmartAssistOption2Sidebar + TransactionContent)
2. ActionBar `hideViewButton` prop + Dashboard `sidebarFooter` prop
3. Pin tooltip in new TransactionContent
4. Landing page access card
5. Edit Summary mode (reorder sections, hide fields)
6. Hidden Data drawer
