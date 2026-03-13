export interface SourceData {
  formValue?: string;
  fileValue?: string;
  mlsValue?: string;
  mismatch?: boolean;
  page?: string;
}

/**
 * Cross-source data keyed by transaction detail label.
 * Mirrors data from FormDataContent / flagsData for tooltip display.
 */
export const TRANSACTION_SOURCES: Record<string, SourceData> = {
  "File name": {
    formValue: "3969 Harvord Boulevard, Venture, CA 93001",
    fileValue: "3969 Harvord Boulevard, Venture, CA 93001",
    mlsValue: "3969 Harvord Boulevard, Venture, CA 93001",
    page: "RPA p.1",
  },
  "Purchase Price": {
    formValue: "$500,000.00",
    fileValue: "$450,000.00",
    mismatch: true,
    page: "RPA p.1, §A",
  },
  "MLS #": {
    formValue: "1234567",
    mlsValue: "1234567",
    page: "MLS",
  },
  "Close of Escrow": {
    formValue: "11/29/2023",
    fileValue: "11/29/2023",
    page: "RPA p.1, §C",
  },
  "Acceptance Date": {
    formValue: "11/24/2023",
    fileValue: "11/24/2023",
    page: "RPA p.1",
  },
  "Year Built": {
    formValue: "1965",
    mlsValue: "1965",
    page: "MLS",
  },
  "Agent": {
    formValue: "Aaron Smith",
    fileValue: "Aaron Smith",
    page: "RPA p.15",
  },
  // Extra summary fields
  "Property Type": {
    formValue: "Single Family Residence",
    mlsValue: "Single Family Residence",
    page: "MLS",
  },
  "Seller Brokerage": {
    formValue: "Keller Williams Realty",
    page: "RPA p.1, §2A",
  },
  "Seller Broker License": {
    formValue: "DRE #01234567",
    page: "RPA p.1, §2A",
  },
  "Buyer Brokerage": {
    formValue: "Compass Real Estate",
    page: "RPA p.1, §2B",
  },
  "Buyer Broker License": {
    formValue: "",
    mismatch: true,
    page: "RPA p.1, §2B",
  },
  "Rep Type": {
    formValue: "Seller only",
    page: "RPA p.1, §2B",
  },
  "Seller Payment to Buyer Broker": {
    formValue: "2.5%",
    page: "RPA p.1",
  },
  "Loan Type": {
    formValue: "Conventional",
    page: "RPA p.1, §E",
  },
  "Home Warranty": {
    formValue: "Yes — ordered",
    page: "RPA p.3, §Q18",
  },
  "Seller Agent License": {
    formValue: "DRE #09876543",
    fileValue: "DRE #09876543",
    page: "RPA p.15",
  },
  "Buyer Agent License": {
    formValue: "DRE #05647382",
    page: "RPA p.15",
  },
  // Extra date fields
  "Loan Contingency": {
    formValue: "21 days",
    page: "RPA p.2, §L1",
  },
  "Appraisal Contingency": {
    formValue: "17 days",
    page: "RPA p.2, §L2",
  },
  "Investigation Contingency": {
    formValue: "17 days",
    page: "RPA p.2, §L3",
  },
};

/**
 * Cross-source data keyed by contact name.
 */
export const CONTACT_SOURCES: Record<string, SourceData> = {
  "Rachael Laurolla": {
    formValue: "Rachael Laurella",
    fileValue: "Rachel Laurella",
    mismatch: true,
    page: "RPA p.1",
  },
  "Rob Laurolla": {
    formValue: "Rob Laurella",
    fileValue: "Rob Laurella",
    page: "RPA p.1",
  },
  "Mark Roberts": {
    formValue: "Mark Roberts",
    page: "RPA p.2",
  },
  // Extra contacts
  "James Thompson": {
    formValue: "James Thompson",
    fileValue: "James Thompson",
    page: "RPA p.16",
  },
  "Mary Thompson": {
    formValue: "Mary Thompson",
    fileValue: "Mary Thompson",
    page: "RPA p.16",
  },
  "Lisa Chen": {
    formValue: "Lisa Chen",
    page: "RPA p.15",
  },
};
