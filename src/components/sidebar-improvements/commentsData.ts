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
      text: "Inspection report uploaded — has the buyer had a chance to review it?",
      time: "3 days ago",
      isNew: false,
    },
    {
      id: 51,
      author: "Kristen Turner",
      text: "Yes, buyer reviewed over the weekend and is comfortable moving forward.",
      time: "2 days ago",
      isNew: false,
    },
    {
      id: 52,
      author: "Rob Smith",
      text: "Great — marking this one as complete on my end. No follow-ups needed.",
      time: "2 days ago",
      isNew: false,
    },
  ],
  "Seller Property Disclosure": [
    {
      id: 60,
      author: "Rob Smith",
      text: "Section II item 4 was left blank — please confirm with the seller whether it applies and update the form.",
      time: "2 hours ago",
      isNew: true,
    },
    {
      id: 61,
      author: "Kristen Turner",
      text: "Following up with the seller now, will re-upload once corrected.",
      time: "45 min ago",
      isNew: true,
    },
    {
      id: 62,
      author: "Rob Smith",
      text: "Thanks — once it's re-uploaded I'll re-run the audit and clear the flag.",
      time: "30 min ago",
      isNew: true,
    },
  ],
  "Agency Disclosure": [
    {
      id: 70,
      author: "Rob Smith",
      text: "Buyer agent signature is missing on page 2. Please resend for signature.",
      time: "20 min ago",
      isNew: true,
    },
    {
      id: 71,
      author: "Kristen Turner",
      text: "Just sent it back out through DocuSign, should be back within the hour.",
      time: "15 min ago",
      isNew: true,
    },
    {
      id: 72,
      author: "Rob Smith",
      text: "Perfect, I'll keep an eye out for the updated file.",
      time: "10 min ago",
      isNew: true,
    },
  ],
  "Escrow Instructions": [
    {
      id: 80,
      author: "Kristen Turner",
      text: "Heads up — the wire instructions on page 3 don't match the confirmation we received. Can you take a look before we release funds?",
      time: "5 min ago",
      isNew: true,
    },
    {
      id: 81,
      author: "Rob Smith",
      text: "Good catch. Pulling up the escrow confirmation now to compare.",
      time: "3 min ago",
      isNew: true,
    },
    {
      id: 82,
      author: "Rob Smith",
      text: "Confirmed — the routing number on page 3 is off by one digit. Please have escrow re-issue and re-upload before we proceed.",
      time: "1 min ago",
      isNew: true,
    },
  ],
};
