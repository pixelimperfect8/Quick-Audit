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
  {
    id: "doc-seller-disclosure",
    name: "Seller Property Disclosure",
    shortName: "Seller Disclosure",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-tds",
    name: "Transfer Disclosure Statement",
    shortName: "Transfer Disclosure",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-nhd",
    name: "Natural Hazard Disclosure",
    shortName: "Natural Hazard",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-home-inspection",
    name: "Home Inspection Report",
    shortName: "Home Inspection",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-termite",
    name: "Termite Inspection Report",
    shortName: "Termite Inspection",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-home-warranty",
    name: "Home Warranty",
    shortName: "Home Warranty",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-prelim-title",
    name: "Preliminary Title Report",
    shortName: "Prelim Title",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-escrow-instructions",
    name: "Escrow Instructions",
    shortName: "Escrow Instructions",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-loan-estimate",
    name: "Loan Estimate",
    shortName: "Loan Estimate",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-proof-of-funds",
    name: "Proof of Funds",
    shortName: "Proof of Funds",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-appraisal",
    name: "Appraisal Report",
    shortName: "Appraisal Report",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-commission-agreement",
    name: "Commission Agreement",
    shortName: "Commission Agmt",
    pdfUrl: "/rpa-form.pdf",
    pageCount: 5,
  },
  {
    id: "doc-wire-instructions",
    name: "Wire Transfer Instructions",
    shortName: "Wire Instructions",
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
  "Seller Property Disclosure": "doc-seller-disclosure",
  "Transfer Disclosure Statement": "doc-tds",
  "Natural Hazard Disclosure": "doc-nhd",
  "Home Inspection Report": "doc-home-inspection",
  "Termite Inspection Report": "doc-termite",
  "Home Warranty": "doc-home-warranty",
  "Preliminary Title Report": "doc-prelim-title",
  "Escrow Instructions": "doc-escrow-instructions",
  "Loan Estimate": "doc-loan-estimate",
  "Proof of Funds": "doc-proof-of-funds",
  "Appraisal Report": "doc-appraisal",
  "Commission Agreement": "doc-commission-agreement",
  "Wire Transfer Instructions": "doc-wire-instructions",
};
