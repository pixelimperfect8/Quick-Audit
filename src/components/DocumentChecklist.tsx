"use client";

import { useRef } from "react";
import { PlusIcon, CommentIcon } from "./icons";
import { StatusBadge, Divider, FileCard, TruncatedText } from "./ui";
import type { DocStatus } from "./ui";
import { DOC_NAME_TO_ID, DOCUMENT_REGISTRY } from "./documentTabs/types";
import CommentPopover from "./sidebar-improvements/CommentPopover";
import type { Comment } from "./sidebar-improvements/commentsData";

export interface FileItem {
  name: string;
  date: string;
}

export interface DocumentItem {
  number: number;
  name: string;
  status: DocStatus;
  files?: FileItem[];
}

export interface DocumentSection {
  title: string;
  documents: DocumentItem[];
}

export const DEFAULT_SECTIONS: DocumentSection[] = [
  {
    title: "Sales Documentation",
    documents: [
      {
        number: 1,
        name: "California Residential Purchase Agreement",
        status: "Flagged",
        files: [
          { name: "CAR_Carlifo...emnt.pdf", date: "13 days ago" },
          { name: "Form 2", date: "13 days ago" },
        ],
      },
      { number: 2, name: "Agency Disclosure", status: "Pending" },
      { number: 3, name: "Lead Based Paint", status: "Pending" },
      { number: 4, name: "Fair Housing Advisory", status: "Complete" },
      { number: 5, name: "Addendums", status: "Required" },
    ],
  },
  {
    title: "Disclosure Documentation",
    documents: [
      { number: 2, name: "Agency Disclosure", status: "Pending" },
      { number: 3, name: "Lead Based Paint", status: "Pending" },
      { number: 4, name: "Fair Housing Advisory", status: "Complete" },
      { number: 5, name: "Addendums", status: "Required" },
    ],
  },
  {
    title: "Disclosure Documentation",
    documents: [],
  },
];

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-grey-50 border-b border-grey-300 px-6 flex items-center gap-2.5 h-[45px] min-w-0">
      <TruncatedText
        as="h3"
        className="flex-1 min-w-0 text-grey-900 text-base font-bold leading-6"
      >
        {title}
      </TruncatedText>
      <button className="shrink-0 text-grey-700 hover:text-grey-900">
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

function DocumentListItem({
  doc,
  onSelect,
  isActive,
  commentCount = 0,
  unreadCount = 0,
  isPopoverOpen,
  onCommentClick,
  commentPopoverProps,
}: {
  doc: DocumentItem;
  onSelect?: () => void;
  isActive?: boolean;
  commentCount?: number;
  unreadCount?: number;
  isPopoverOpen?: boolean;
  onCommentClick?: () => void;
  commentPopoverProps?: {
    comments: Comment[];
    onSend: (text: string) => void;
    onViewAll: () => void;
    onClose: () => void;
  };
}) {
  const commentBtnRef = useRef<HTMLButtonElement>(null);
  const docId = DOC_NAME_TO_ID[doc.name];
  const showExpanded = isActive && doc.status !== "Required";
  const docInfo = showExpanded && !doc.files && docId
    ? DOCUMENT_REGISTRY.find((d) => d.id === docId)
    : null;

  return (
    <div
      onClick={onSelect}
      className={onSelect ? "cursor-pointer hover:bg-grey-50 transition-colors" : ""}
    >
      <div className="flex items-center gap-4 pl-2 pr-4 py-2">
        <div className="flex-1 min-w-0 flex items-center gap-2 text-grey-900 text-base font-medium leading-6">
          <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-[4px] bg-grey-50 text-grey-800 text-xs font-semibold">{doc.number}</span>
          <TruncatedText className="min-w-0">{doc.name}</TruncatedText>
        </div>
        {onCommentClick && (
          <button
            ref={commentBtnRef}
            onClick={(e) => {
              e.stopPropagation();
              onCommentClick();
            }}
            className="shrink-0 relative text-grey-600 hover:text-grey-900 transition-colors"
            aria-label={`Comments for ${doc.name}`}
          >
            <CommentIcon
              className={`w-4 h-4 ${commentCount > 0 ? "text-[#0A2642]" : ""}`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#0059DA]" />
            )}
          </button>
        )}
        <StatusBadge status={doc.status} />
      </div>
      {isPopoverOpen && commentPopoverProps && (
        <CommentPopover
          {...commentPopoverProps}
          anchorEl={commentBtnRef.current}
        />
      )}

      {showExpanded && doc.files && (
        <div className="px-2 pb-2">
          <div className="bg-grey-100 rounded-lg p-4 flex flex-col gap-1">
            {doc.files.map((file, i) => (
              <FileCard
                key={i}
                name={file.name}
                date={file.date}
                active={i === 0}
                onRemove={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {docInfo && (
        <div className="px-2 pb-2">
          <div className="bg-grey-100 rounded-lg p-4 flex flex-col gap-1">
            <FileCard
              name={`${docInfo.shortName}.pdf`}
              date="13 days ago"
              active
              onRemove={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface DocumentChecklistProps {
  sections?: DocumentSection[];
  /** The document ID currently active in the viewer */
  activeDocumentId?: string | null;
  /** Called when a document item is clicked — loads it in the active tab */
  onDocumentSelect?: (documentId: string) => void;
  /** Comment counts keyed by document item name */
  commentCounts?: Record<string, number>;
  /** Unread comment counts keyed by document item name — drives the blue dot */
  unreadCountsByItem?: Record<string, number>;
  /** Which item's popover is currently open (by name) */
  activeCommentItem?: string | null;
  /** Called when comment icon is clicked */
  onCommentIconClick?: (itemName: string) => void;
  /** Comments for the active popover item */
  activeCommentPopoverComments?: Comment[];
  /** Send a comment for a specific item */
  onSendComment?: (itemName: string, text: string) => void;
  /** Open the full comments drawer for an item */
  onOpenCommentsDrawer?: (itemName: string) => void;
}

export default function DocumentChecklist({
  sections = DEFAULT_SECTIONS,
  activeDocumentId,
  onDocumentSelect,
  commentCounts = {},
  unreadCountsByItem = {},
  activeCommentItem,
  onCommentIconClick,
  activeCommentPopoverComments = [],
  onSendComment,
  onOpenCommentsDrawer,
}: DocumentChecklistProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      {sections.map((section, i) => (
        <div key={`${section.title}-${i}`}>
          {i > 0 && <Divider />}
          <SectionHeader title={section.title} />
          <div className="flex flex-col">
            {section.documents.map((doc) => {
              const docId = DOC_NAME_TO_ID[doc.name];
              const isPopoverOpen = activeCommentItem === doc.name;
              return (
                <DocumentListItem
                  key={`${section.title}-${doc.number}-${doc.name}`}
                  doc={doc}
                  isActive={!!docId && docId === activeDocumentId}
                  onSelect={onDocumentSelect && docId ? () => onDocumentSelect(docId) : undefined}
                  commentCount={commentCounts[doc.name] ?? 0}
                  unreadCount={unreadCountsByItem[doc.name] ?? 0}
                  isPopoverOpen={isPopoverOpen}
                  onCommentClick={onCommentIconClick ? () => onCommentIconClick(doc.name) : undefined}
                  commentPopoverProps={
                    isPopoverOpen
                      ? {
                          comments: activeCommentPopoverComments,
                          onSend: (text: string) => onSendComment?.(doc.name, text),
                          onViewAll: () => onOpenCommentsDrawer?.(doc.name),
                          onClose: () => onCommentIconClick?.(doc.name),
                        }
                      : undefined
                  }
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
