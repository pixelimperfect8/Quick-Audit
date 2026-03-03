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
};
