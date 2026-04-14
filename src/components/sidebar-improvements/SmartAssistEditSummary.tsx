"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  CloseIcon,
  DragHandleIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from "@/components/icons";
import {
  DEFAULT_SECTION_ORDER,
  SECTION_LABELS,
  SECTION_FIELDS,
  type SectionId,
} from "./SmartAssistOption2TransactionContent";

interface EditSummaryProps {
  hiddenFields: Set<string>;
  hiddenSections: Set<string>;
  sectionOrder: SectionId[];
  fieldOrder: Record<string, string[]>;
  onToggleField: (field: string) => void;
  onToggleSection: (section: string) => void;
  onReorderSections: (order: SectionId[]) => void;
  onReorderFields: (sectionId: string, order: string[]) => void;
  onResetToDefaults?: () => void;
  onClose: () => void;
  /** Panel title (defaults to "Edit Summary") */
  title?: string;
}

/* ------------------------------------------------------------------ */
/*  Pointer-event drag reorder hook with insertion line tracking        */
/* ------------------------------------------------------------------ */

interface UseDragReorderReturn {
  dragIndex: number | null;
  /** The index *before which* the item will be inserted. Equal to items.length means "after last". */
  insertAt: number | null;
  startDrag: (index: number, e: React.PointerEvent) => void;
  registerRef: (index: number, el: HTMLElement | null) => void;
}

function useDragReorder<T>({
  items,
  onReorder,
}: {
  items: T[];
  onReorder: (newItems: T[]) => void;
}): UseDragReorderReturn {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [insertAt, setInsertAt] = useState<number | null>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());
  const dragging = useRef(false);
  const currentDragIndex = useRef<number | null>(null);
  const latestInsertAt = useRef<number | null>(null);

  // Keep a ref in sync so the pointerup handler always reads fresh value
  latestInsertAt.current = insertAt;

  const cleanup = useCallback(() => {
    dragging.current = false;
    currentDragIndex.current = null;
    setDragIndex(null);
    setInsertAt(null);
  }, []);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (!dragging.current || currentDragIndex.current === null) return;
      e.preventDefault();

      const from = currentDragIndex.current;
      let bestInsert: number | null = null;

      // Walk through every registered item and find the closest gap
      const entries = Array.from(itemRefs.current.entries()).sort(
        ([a], [b]) => a - b
      );

      for (let i = 0; i < entries.length; i++) {
        const [idx, el] = entries[i];
        const rect = el.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;

        if (e.clientY <= midY) {
          bestInsert = idx;
          break;
        }
      }

      // If pointer is below all items, insert after last
      if (bestInsert === null && entries.length > 0) {
        bestInsert = entries[entries.length - 1][0] + 1;
      }

      if (bestInsert !== null) {
        // Normalize: inserting right after the dragged item is same as no move
        if (bestInsert === from || bestInsert === from + 1) {
          setInsertAt(null);
        } else {
          setInsertAt(bestInsert);
        }
      }
    }

    function onPointerUp() {
      if (!dragging.current || currentDragIndex.current === null) {
        cleanup();
        return;
      }
      const from = currentDragIndex.current;
      const to = latestInsertAt.current;
      if (to !== null) {
        const newItems = [...items];
        const [moved] = newItems.splice(from, 1);
        // Adjust target index since we removed an item before it
        const adjustedTo = to > from ? to - 1 : to;
        newItems.splice(adjustedTo, 0, moved);
        onReorder(newItems);
      }
      cleanup();
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [items, onReorder, cleanup]);

  function startDrag(index: number, e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragging.current = true;
    currentDragIndex.current = index;
    setDragIndex(index);
    setInsertAt(null);
  }

  function registerRef(index: number, el: HTMLElement | null) {
    if (el) {
      itemRefs.current.set(index, el);
    } else {
      itemRefs.current.delete(index);
    }
  }

  return { dragIndex, insertAt, startDrag, registerRef };
}

/* ------------------------------------------------------------------ */
/*  Insertion indicator line                                           */
/* ------------------------------------------------------------------ */

function InsertionLine() {
  return (
    <div className="relative h-0 z-10 pointer-events-none" aria-hidden>
      <div className="absolute left-0 right-0 top-[-1px] flex items-center">
        <div className="w-2 h-2 rounded-full bg-blue-800 shrink-0 -ml-1" />
        <div className="flex-1 h-[2px] bg-blue-800" />
        <div className="w-2 h-2 rounded-full bg-blue-800 shrink-0 -mr-1" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SmartAssistEditSummary({
  hiddenFields,
  hiddenSections,
  sectionOrder,
  fieldOrder,
  onToggleField,
  onToggleSection,
  onReorderSections,
  onReorderFields,
  onResetToDefaults,
  onClose,
  title = "Edit Summary",
}: EditSummaryProps) {
  const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(
    new Set()
  );

  const toggleExpanded = useCallback((sectionId: SectionId) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  const sectionDrag = useDragReorder<SectionId>({
    items: sectionOrder,
    onReorder: (newOrder) => onReorderSections(newOrder as SectionId[]),
  });

  const isDraggingSection = sectionDrag.dragIndex !== null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-grey-300">
        <h3 className="text-grey-900 text-base font-bold">{title}</h3>
        <button
          onClick={onClose}
          className="text-grey-700 hover:text-grey-900 transition-colors"
          aria-label={`Close ${title.toLowerCase()}`}
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Sections list */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <p className="pt-2 pb-4 text-grey-800 text-sm">
          Drag to reorder sections and fields. Toggle visibility with the eye
          icon.
        </p>
        {sectionOrder.map((sectionId, index) => {
          const isHidden = hiddenSections.has(sectionId);
          const isExpanded = expandedSections.has(sectionId);
          const fields =
            fieldOrder[sectionId] ?? SECTION_FIELDS[sectionId] ?? [];
          const isDragging = sectionDrag.dragIndex === index;
          const showLineBefore =
            sectionDrag.insertAt === index && sectionDrag.dragIndex !== null;
          const showLineAfter =
            index === sectionOrder.length - 1 &&
            sectionDrag.insertAt === sectionOrder.length &&
            sectionDrag.dragIndex !== null;

          return (
            <div key={sectionId}>
              {/* Insertion line BEFORE this section */}
              {showLineBefore && <InsertionLine />}

              <div
                ref={(el) => sectionDrag.registerRef(index, el)}
                className={`mb-2 border rounded-lg overflow-hidden transition-all duration-200 ${
                  isDragging
                    ? "opacity-30 scale-[0.97] border-grey-300 bg-grey-100"
                    : isHidden
                    ? "border-grey-200 bg-grey-50"
                    : "border-grey-300"
                }`}
              >
                {/* Section header */}
                <div className="group/section flex items-center gap-2 px-3 py-2.5 hover:bg-grey-50 rounded-t-lg transition-colors">
                  {/* Drag handle */}
                  <div
                    className="shrink-0 text-grey-400 hover:text-grey-600 cursor-grab active:cursor-grabbing touch-none select-none transition-colors"
                    onPointerDown={(e) => sectionDrag.startDrag(index, e)}
                  >
                    <DragHandleIcon className="w-4 h-4" />
                  </div>

                  {/* Section name */}
                  <button
                    onClick={() =>
                      toggleExpanded(sectionId)
                    }
                    className="flex-1 text-left"
                  >
                    <span
                      className={`text-sm font-bold ${
                        isHidden
                          ? "text-grey-500 line-through"
                          : "text-grey-900"
                      }`}
                    >
                      {SECTION_LABELS[sectionId]}
                    </span>
                  </button>

                  {/* Expand/collapse fields */}
                  <button
                    onClick={() =>
                      toggleExpanded(sectionId)
                    }
                    className="shrink-0 text-grey-500 hover:text-grey-900 transition-colors"
                    aria-label={
                      isExpanded ? "Collapse fields" : "Expand fields"
                    }
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Field-level toggles with drag reorder — animated */}
                {!isHidden && !isDraggingSection && (
                  <div
                    className="grid transition-[grid-template-rows] duration-200 ease-in-out"
                    style={{
                      gridTemplateRows: isExpanded ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <FieldList
                        sectionId={sectionId}
                        fields={fields}
                        hiddenFields={hiddenFields}
                        onToggleField={onToggleField}
                        onReorderFields={onReorderFields}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Insertion line AFTER last section */}
              {showLineAfter && <InsertionLine />}
            </div>
          );
        })}

        {/* Reset button — scrolls with content */}
        <div className="pt-2 pb-4">
          <button
            onClick={() => {
              if (onResetToDefaults) {
                onResetToDefaults();
              } else {
                onReorderSections([...DEFAULT_SECTION_ORDER]);
                for (const sectionId of DEFAULT_SECTION_ORDER) {
                  onReorderFields(sectionId, [...SECTION_FIELDS[sectionId]]);
                }
                hiddenFields.forEach((f) => onToggleField(f));
                hiddenSections.forEach((s) => onToggleSection(s));
              }
            }}
            className="text-blue-800 text-sm font-bold hover:underline"
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FieldList — separated so each section gets its own drag instance   */
/* ------------------------------------------------------------------ */

function FieldList({
  sectionId,
  fields,
  hiddenFields,
  onToggleField,
  onReorderFields,
}: {
  sectionId: SectionId;
  fields: string[];
  hiddenFields: Set<string>;
  onToggleField: (field: string) => void;
  onReorderFields: (sectionId: string, order: string[]) => void;
}) {
  const fieldDrag = useDragReorder<string>({
    items: fields,
    onReorder: (newFields) => onReorderFields(sectionId, newFields),
  });

  return (
    <div className="border-t border-grey-200 px-3 py-2">
      {fields.map((field, fieldIndex) => {
        const fieldHidden = hiddenFields.has(field);
        const isFieldDragging = fieldDrag.dragIndex === fieldIndex;
        const showLineBefore =
          fieldDrag.insertAt === fieldIndex && fieldDrag.dragIndex !== null;
        const showLineAfter =
          fieldIndex === fields.length - 1 &&
          fieldDrag.insertAt === fields.length &&
          fieldDrag.dragIndex !== null;

        return (
          <div key={field}>
            {/* Insertion line BEFORE this field */}
            {showLineBefore && <InsertionLine />}

            <div
              ref={(el) => fieldDrag.registerRef(fieldIndex, el)}
              className={`group/field flex items-center gap-2 py-1.5 px-3 -mx-3 rounded transition-all duration-200 ${
                isFieldDragging
                  ? "opacity-30 scale-[0.97] bg-grey-100"
                  : "hover:bg-grey-100"
              }`}
            >
              {/* Field drag handle */}
              <span
                className="shrink-0 text-grey-400 hover:text-grey-600 cursor-grab active:cursor-grabbing touch-none select-none transition-colors"
                onPointerDown={(e) => fieldDrag.startDrag(fieldIndex, e)}
              >
                <DragHandleIcon className="w-3.5 h-3.5" />
              </span>

              {/* Field name */}
              <span
                className={`text-sm flex-1 ${
                  fieldHidden
                    ? "text-grey-500 line-through"
                    : "text-grey-900 font-medium"
                }`}
              >
                {field}
              </span>

              {/* Visibility toggle — right side */}
              <button
                onClick={() => onToggleField(field)}
                className={`shrink-0 p-0.5 rounded transition-colors ${
                  fieldHidden
                    ? "text-grey-500 hover:text-grey-700"
                    : "text-grey-700 hover:text-grey-900"
                }`}
                title={fieldHidden ? "Show field" : "Hide field"}
              >
                {fieldHidden ? (
                  <VisibilityOffIcon className="w-3.5 h-3.5" />
                ) : (
                  <VisibilityIcon className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Insertion line AFTER last field */}
            {showLineAfter && <InsertionLine />}
          </div>
        );
      })}
    </div>
  );
}
