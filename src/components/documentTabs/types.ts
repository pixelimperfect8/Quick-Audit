/** A single tab in the document tab bar */
export interface DocumentTab {
  /** Unique tab identifier */
  id: string;
  /** Display label (truncated in UI) */
  label: string;
  /** Registry document ID, or null for an empty "New Tab" */
  documentId: string | null;
}

/** Metadata for a viewable document */
export interface DocumentInfo {
  /** Unique document identifier */
  id: string;
  /** Full document name */
  name: string;
  /** Shortened name for tab labels */
  shortName: string;
  /** URL to the PDF file */
  pdfUrl: string;
  /** Number of pages */
  pageCount: number;
}

/**
 * Static registry of all documents available in the checklist.
 * For the prototype, all documents share the same PDF file.
 */
export const DOCUMENT_REGISTRY: DocumentInfo[] = [
  {
    id: "doc-ca-rpa",
    name: "California Residential Purchase Agreement",
    shortName: "California...Agreeme...",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-agency-disclosure",
    name: "Agency Disclosure",
    shortName: "Agency Disclosure",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-lead-paint",
    name: "Lead Based Paint",
    shortName: "Lead Based Paint",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-fair-housing",
    name: "Fair Housing Advisory",
    shortName: "Fair Housing Advisory",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-addendums",
    name: "Addendums",
    shortName: "Addendums",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
];

/** Map checklist document names to their registry IDs */
export const DOC_NAME_TO_ID: Record<string, string> = {
  "California Residential Purchase Agreement": "doc-ca-rpa",
  "Agency Disclosure": "doc-agency-disclosure",
  "Lead Based Paint": "doc-lead-paint",
  "Fair Housing Advisory": "doc-fair-housing",
  "Addendums": "doc-addendums",
};
