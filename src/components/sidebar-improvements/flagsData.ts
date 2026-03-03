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
  page: number;
  description: string;
  sources?: FlagSource[];
  highlight: FlagHighlight;
  /** Keys into TRANSACTION_SOURCES or CONTACT_SOURCES that this flag covers */
  relatedFields?: string[];
}

export const FLAG_ISSUES: FlagIssue[] = [
  {
    id: "flag-1",
    page: 1,
    description: "The buyer's name doesn't match the name on file.",
    sources: [
      { label: "Form", value: "Rachael Laurella, Rob Laurella" },
      { label: "File", value: "Rachel Laurella, Rob Laurella" },
    ],
    highlight: { top: "38%", left: "10%", width: "85%", height: "4%" },
    relatedFields: ["Rachael Laurolla", "Rob Laurolla"],
  },
  {
    id: "flag-2",
    page: 1,
    description:
      "The property address doesn't match the address on file or MLS.",
    sources: [
      { label: "Form", value: "3969 Harvord Boulevard, Venture, CA 93001" },
      { label: "File", value: "3969 Harvord Boulevard, Venture, CA 93001" },
      { label: "MLS", value: "3969 Harvord Boulevard, Venture, CA 93001" },
    ],
    highlight: { top: "44%", left: "10%", width: "85%", height: "6%" },
    relatedFields: ["File name"],
  },
  {
    id: "flag-3",
    page: 1,
    description:
      "The purchase price does not match the purchase price on file.",
    sources: [
      { label: "Form", value: "$500,000.00" },
      { label: "File", value: "$450,000.00" },
    ],
    highlight: { top: "58%", left: "10%", width: "85%", height: "4%" },
    relatedFields: ["Purchase Price"],
  },
  {
    id: "flag-4",
    page: 1,
    description: "Seller's initials missing",
    highlight: { top: "72%", left: "70%", width: "20%", height: "3%" },
  },
  {
    id: "flag-5",
    page: 4,
    description:
      "Ensure the Buyer's Investigation Advisory is marked as required on the checklist",
    sources: [{ label: "Checklist", value: "Not marked as required" }],
    highlight: { top: "30%", left: "10%", width: "80%", height: "5%" },
  },
];
