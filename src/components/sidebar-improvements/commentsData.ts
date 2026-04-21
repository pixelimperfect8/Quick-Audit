export interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
  isNew: boolean;
}

/**
 * Seed comments keyed by checklist item name.
 * Only items with comments have entries.
 */
export const INITIAL_COMMENTS_BY_ITEM: Record<string, Comment[]> = {
  "California Residential Purchase Agreement": [
    {
      id: 1,
      author: "Rob Smith",
      text: "The seller missed checkboxes for yes/no on page 4 of the seller disclosure for XYZ question. Please work with them to fill the form out correctly and re-upload to SkySlope. Thanks!",
      time: "May 25, 2024 at 9:18am",
      isNew: false,
    },
    {
      id: 2,
      author: "Kristen Turner",
      text: "Sending out for signature again.",
      time: "1 day ago",
      isNew: false,
    },
    {
      id: 3,
      author: "Kristen Turner",
      text: "Ready for review.",
      time: "1 min ago",
      isNew: true,
    },
  ],
  "Home Inspection Report": [
    {
      id: 50,
      author: "Rob Smith",
      text: "Inspection report uploaded — buyer has already reviewed and no follow-ups needed.",
      time: "3 days ago",
      isNew: false,
    },
  ],
};
