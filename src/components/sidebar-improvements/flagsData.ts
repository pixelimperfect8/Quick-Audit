export interface FlagHighlight {
  top: string;
  left: string;
  width: string;
  height: string;
}

export interface FlagSource {
  label: string;
  value: string;
}

export interface FlagIssue {
  id: string;
  /** Document this flag was raised on — used to filter Issues by the currently loaded doc */
  documentId?: string;
  page: number;
  description: string;
  sources?: FlagSource[];
  highlight: FlagHighlight;
  /** Keys into TRANSACTION_SOURCES or CONTACT_SOURCES that this flag covers */
  relatedFields?: string[];
  /** Form data field label(s) this flag corresponds to (for bidirectional sync) */
  formFieldLabels?: string[];
}

export const FLAG_ISSUES: FlagIssue[] = [
  {
    id: "flag-1",
    documentId: "doc-ca-rpa",
    page: 1,
    description: "The buyer's name doesn't match the name on file.",
    sources: [
      { label: "RPA", value: "Rachael Laurella, Rob Laurella" },
      { label: "File", value: "Rachel Laurella, Rob Laurella" },
    ],
    highlight: { top: "38%", left: "10%", width: "85%", height: "4%" },
    relatedFields: ["Rachael Laurolla", "Rob Laurolla"],
    formFieldLabels: ["Buyer(s)"],
  },
  {
    id: "flag-2",
    documentId: "doc-ca-rpa",
    page: 1,
    description:
      "The property address doesn't match the address on file or MLS.",
    sources: [
      { label: "RPA", value: "3969 Harvord Boulevard, Venture, CA 93001" },
      { label: "File", value: "3969 Harvord Boulevard, Venture, CA 93001" },
      { label: "MLS", value: "3969 Harvord Boulevard, Venture, CA 93001" },
    ],
    highlight: { top: "44%", left: "10%", width: "85%", height: "6%" },
    relatedFields: ["File name"],
  },
  {
    id: "flag-3",
    documentId: "doc-ca-rpa",
    page: 1,
    description:
      "The purchase price does not match the purchase price on file.",
    sources: [
      { label: "RPA", value: "$500,000.00" },
      { label: "File", value: "$450,000.00" },
    ],
    highlight: { top: "58%", left: "10%", width: "85%", height: "4%" },
    relatedFields: ["Purchase Price"],
    formFieldLabels: ["Purchase Price"],
  },
  {
    id: "flag-6",
    documentId: "doc-ca-rpa",
    page: 1,
    description: "Buyer broker license number is missing.",
    sources: [
      { label: "RPA", value: "Missing" },
    ],
    highlight: { top: "26%", left: "55%", width: "35%", height: "3%" },
    formFieldLabels: ["Buyer Broker License"],
  },
  {
    id: "flag-4",
    documentId: "doc-ca-rpa",
    page: 1,
    description: "Seller's initials missing",
    highlight: { top: "72%", left: "70%", width: "20%", height: "3%" },
  },
  {
    id: "flag-5",
    documentId: "doc-ca-rpa",
    page: 4,
    description:
      "Ensure the Buyer's Investigation Advisory is marked as required on the checklist",
    sources: [{ label: "Checklist", value: "Not marked as required" }],
    highlight: { top: "30%", left: "10%", width: "80%", height: "5%" },
  },
  // Flags on other documents — surface when "All" toggle is active
  {
    id: "flag-7",
    documentId: "doc-seller-disclosure",
    page: 1,
    description: "Seller disclosure missing signature on page 2.",
    sources: [{ label: "SPD", value: "No signature found" }],
    highlight: { top: "50%", left: "10%", width: "80%", height: "4%" },
  },
  {
    id: "flag-8",
    documentId: "doc-home-inspection",
    page: 1,
    description: "Home inspection report references an unreviewed addendum.",
    sources: [{ label: "HIR", value: "Addendum #2" }],
    highlight: { top: "40%", left: "10%", width: "80%", height: "4%" },
  },
];
