import React from "react";

/* ------------------------------------------------------------------ */
/*  RPAFormOverlay — California Residential Purchase Agreement form    */
/*                                                                     */
/*  Multi-page form (5 pages). The host scrolls between pages by       */
/*  setting `scrollY`. Page 1 is rendered in detail; pages 2-5 are     */
/*  consistent-styled continuations. A `pageHighlight` prop renders a  */
/*  red flag overlay on a specific page at a relative position.        */
/* ------------------------------------------------------------------ */

const PAGE_W = 920;
const PAGE_H = 1190;
const PAGE_GAP = 24;

export interface RPAFormPageHighlight {
  /** 1-indexed page number */
  page: number;
  /** top in % of page height */
  top: string;
  /** left in % of page width */
  left: string;
  /** width in % of page width */
  width: string;
  /** height in % of page height */
  height: string;
  /** 0..1 fade progress */
  progress: number;
  /** entrance scale (0.92 → 1.0) */
  scale?: number;
  /** outer pulse: 0 = no pulse, 1 = pulse fully expanded + faded */
  pulseProgress?: number;
}

type PageHighlight = RPAFormPageHighlight;

interface RPAFormOverlayProps {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  /** Vertical scroll offset in px (positive = scrolled down). 0 = page 1 top. */
  scrollY?: number;
  /** Page indicator label override (defaults to derived from scrollY) */
  pageLabel?: string;
  /** Optional flag highlight on a specific page */
  pageHighlight?: PageHighlight | null;
}

const FIELD_HEIGHT = 20;

const Field: React.FC<{
  children?: React.ReactNode;
  width?: number | string;
  flagged?: boolean;
  inlineLabel?: string;
}> = ({ children, width = 200, flagged, inlineLabel }) => (
  <span
    style={{
      display: "inline-block",
      width,
      height: FIELD_HEIGHT,
      lineHeight: `${FIELD_HEIGHT - 2}px`,
      borderBottom: flagged ? "2px solid #ff5255" : "1px solid #0A2642",
      verticalAlign: "middle",
      marginLeft: 4,
      marginRight: 4,
      paddingLeft: 4,
      paddingRight: 4,
      position: "relative",
      background: flagged ? "rgba(255, 82, 85, 0.18)" : undefined,
      boxSizing: "border-box",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    <span style={{ fontWeight: 500, color: "#0A2642", fontSize: 13 }}>{children}</span>
    {inlineLabel && (
      <span
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: -14,
          fontSize: 10,
          color: "#637D97",
          whiteSpace: "nowrap",
          fontStyle: "italic",
        }}
      >
        {inlineLabel}
      </span>
    )}
  </span>
);

const Checkbox: React.FC<{ checked?: boolean }> = ({ checked }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 11,
      height: 11,
      border: "1px solid #0A2642",
      marginRight: 3,
      verticalAlign: "middle",
      fontSize: 9,
      lineHeight: "9px",
      color: "#0A2642",
      fontWeight: 700,
    }}
  >
    {checked ? "✓" : ""}
  </span>
);

/* ------------------------------------------------------------------ */
/*  Page chrome                                                        */
/* ------------------------------------------------------------------ */

const CARHeader: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 18 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width="48" height="48" viewBox="0 0 60 60" fill="#0A2642">
        <path d="M5 15 L30 5 L55 15 L30 25 Z" />
        <path d="M5 30 L30 20 L55 30 L30 40 Z" opacity="0.7" />
        <path d="M5 45 L30 35 L55 45 L30 55 Z" opacity="0.4" />
      </svg>
      <span style={{ fontSize: 9, fontWeight: 700, lineHeight: 1.1, fontFamily: "Arial, sans-serif" }}>
        CALIFORNIA<br />ASSOCIATION<br />OF REALTORS®
      </span>
    </div>
    <div style={{ flex: 1, textAlign: "center", fontWeight: 700, fontFamily: "Arial, sans-serif", fontSize: 15, lineHeight: 1.25 }}>
      CALIFORNIA<br />
      RESIDENTIAL PURCHASE AGREEMENT<br />
      AND JOINT ESCROW INSTRUCTIONS
      <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>
        (C.A.R. Form RPA, Revised 12/18)
      </div>
    </div>
  </div>
);

const PageMiniHeader: React.FC<{ pageNum: number }> = ({ pageNum }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid #DEE5ED", paddingBottom: 6, marginBottom: 14, fontSize: 11, color: "#3F5B77" }}>
    <span>Property: 3969 Harvord Boulevard, Venture, CA 93001</span>
    <span style={{ fontWeight: 700 }}>RPA Page {pageNum}</span>
  </div>
);

const PageFooter: React.FC<{ pageNum: number }> = ({ pageNum }) => (
  <div style={{ position: "absolute", bottom: 24, left: 44, right: 44, fontSize: 10, color: "#637D97", display: "flex", justifyContent: "space-between", borderTop: "1px solid #DEE5ED", paddingTop: 8 }}>
    <span>Buyer&apos;s Initials ___ / ___ &nbsp; Seller&apos;s Initials ___ / ___</span>
    <span>RPA Revised 12/18 — Page {pageNum} of 11</span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Page 1 — OFFER + AGENCY (the detailed page)                        */
/* ------------------------------------------------------------------ */

const Page1: React.FC<{ highlight?: PageHighlight | null }> = ({ highlight }) => (
  <PageBox pageNum={1}>
    <CARHeader />
    <div style={{ marginBottom: 6 }}>
      <span style={{ fontWeight: 700 }}>Date Prepared:</span>
      <Field width={140}>11/24/2026</Field>
    </div>
    <div style={{ display: "flex", marginBottom: 4 }}>
      <span style={{ width: 18, fontWeight: 700 }}>1.</span>
      <span style={{ fontWeight: 700 }}>OFFER:</span>
    </div>
    <div style={{ paddingLeft: 24, marginBottom: 4 }}>
      <span style={{ fontWeight: 700 }}>A.</span>
      <span style={{ fontWeight: 700, marginLeft: 6 }}>THIS IS AN OFFER FROM</span>
      <Field width={560} flagged>Rachael Laurella, Rob Laurella</Field>
      <span> (&ldquo;Buyer&rdquo;).</span>
    </div>
    <div style={{ paddingLeft: 24, marginBottom: 22 }}>
      <span style={{ fontWeight: 700 }}>B.</span>
      <span style={{ fontWeight: 700, marginLeft: 6 }}>THE REAL PROPERTY</span>
      <span> to be acquired is</span>
      <Field width={380}>3969 Harvord Boulevard</Field>
      <span> situated in</span>
      <br />
      <Field width={190} inlineLabel="(City)">Venture</Field>
      <span>,</span>
      <Field width={210} inlineLabel="(County)">Ventura</Field>
      <span> California</span>
      <Field width={120} inlineLabel="(Zip Code)">93001</Field>
      <span>, Assessor&apos;s Parcel No.</span>
      <Field width={190}>012-345-678</Field>
      <span> (&ldquo;Property&rdquo;).</span>
    </div>
    <div style={{ paddingLeft: 24, marginBottom: 4 }}>
      <span style={{ fontWeight: 700 }}>C.</span>
      <span style={{ fontWeight: 700, marginLeft: 6 }}>THE PURCHASE PRICE</span>
      <span> offered is</span>
      <Field width={500} flagged>Five Hundred Thousand</Field>
      <br />
      <Field width={640}></Field>
      <span> Dollars $</span>
      <Field width={170} flagged>500,000.00</Field>
      <span>.</span>
    </div>
    <div style={{ paddingLeft: 24, marginBottom: 4 }}>
      <span style={{ fontWeight: 700 }}>D.</span>
      <span style={{ fontWeight: 700, marginLeft: 6 }}>CLOSE OF ESCROW</span>
      <span> shall occur on</span>
      <Field width={180}>11/29/2026</Field>
      <span> (date)(or</span>
      <Field width={90}>30</Field>
      <span style={{ fontWeight: 700 }}> Days</span>
      <span> After Acceptance).</span>
    </div>
    <div style={{ paddingLeft: 24, marginBottom: 12 }}>
      <span style={{ fontWeight: 700 }}>E.</span>
      <span style={{ marginLeft: 6 }}>
        Buyer and Seller are referred to herein as the &ldquo;Parties.&rdquo; Brokers are not Parties to this Agreement.
      </span>
    </div>
    <div style={{ display: "flex", marginBottom: 4 }}>
      <span style={{ width: 18, fontWeight: 700 }}>2.</span>
      <span style={{ fontWeight: 700 }}>AGENCY:</span>
    </div>
    <div style={{ paddingLeft: 24, marginBottom: 4 }}>
      <span style={{ fontWeight: 700 }}>A.</span>
      <span style={{ fontWeight: 700, marginLeft: 6 }}>DISCLOSURE:</span>
      <span> The Parties each acknowledge receipt of a </span>
      <Checkbox checked />
      <span>&ldquo;Disclosure Regarding Real Estate Agency Relationships&rdquo; (C.A.R. Form AD).</span>
    </div>
    <div style={{ paddingLeft: 24, marginBottom: 4 }}>
      <span style={{ fontWeight: 700 }}>B.</span>
      <span style={{ fontWeight: 700, marginLeft: 6 }}>CONFIRMATION:</span>
      <span> The following agency relationships are confirmed for this transaction:</span>
    </div>
    <div style={{ paddingLeft: 48, marginTop: 6 }}>
      <span style={{ fontWeight: 700 }}>Seller&apos;s Brokerage Firm</span>
      <Field width={320}>Keller Williams Realty</Field>
      <span> License Number</span>
      <Field width={190}>01234567</Field>
    </div>
    <div style={{ paddingLeft: 48, fontSize: 11, color: "#3F5B77" }}>
      Is the broker of (check one): <Checkbox /> the seller; or <Checkbox /> both the buyer and seller (dual agent)
    </div>
    <div style={{ paddingLeft: 48, marginTop: 4 }}>
      <span style={{ fontWeight: 700 }}>Seller&apos;s Agent</span>
      <Field width={360}></Field>
      <span> License Number</span>
      <Field width={190}>09876543</Field>
    </div>
    <div style={{ paddingLeft: 48, marginTop: 10 }}>
      <span style={{ fontWeight: 700 }}>Buyer&apos;s Brokerage Firm</span>
      <Field width={320}>Compass Real Estate</Field>
      <span> License Number</span>
      <Field width={190} flagged>{" "}</Field>
    </div>
    <div style={{ paddingLeft: 48, fontSize: 11, color: "#3F5B77" }}>
      Is the broker of (check one): <Checkbox /> the buyer; or <Checkbox /> both the buyer and seller (dual agent)
    </div>
    <div style={{ paddingLeft: 48, marginTop: 4 }}>
      <span style={{ fontWeight: 700 }}>Buyer&apos;s Agent</span>
      <Field width={360}>Aaron Smith</Field>
      <span> License Number</span>
      <Field width={190}>05647382</Field>
    </div>
    {highlight && highlight.page === 1 && <FlagOverlay highlight={highlight} />}
  </PageBox>
);

/* ------------------------------------------------------------------ */
/*  Pages 2-5 — simpler continuation pages                             */
/* ------------------------------------------------------------------ */

const SectionHeading: React.FC<{ num: string; title: string }> = ({ num, title }) => (
  <div style={{ display: "flex", marginTop: 12, marginBottom: 6 }}>
    <span style={{ width: 22, fontWeight: 700 }}>{num}.</span>
    <span style={{ fontWeight: 700 }}>{title}</span>
  </div>
);

const Subsection: React.FC<{ letter: string; title?: string; children: React.ReactNode }> = ({
  letter, title, children,
}) => (
  <div style={{ paddingLeft: 24, marginBottom: 6 }}>
    <span style={{ fontWeight: 700 }}>{letter}.</span>
    {title && <span style={{ fontWeight: 700, marginLeft: 6 }}>{title}:</span>}
    <span style={{ marginLeft: 6 }}>{children}</span>
  </div>
);

const Page2: React.FC<{ highlight?: PageHighlight | null }> = ({ highlight }) => (
  <PageBox pageNum={2}>
    <PageMiniHeader pageNum={2} />
    <SectionHeading num="3" title="FINANCE TERMS" />
    <Subsection letter="A" title="INITIAL DEPOSIT">
      Deposit shall be in the amount of ……………………………………………………………………………………………… $<Field width={150}>5,000.00</Field>
      <div style={{ paddingLeft: 16, marginTop: 4, fontSize: 12 }}>
        (1) Buyer Direct Deposit: Buyer shall deliver deposit directly to Escrow Holder by electronic funds transfer,
        <Checkbox /> cashier&apos;s check, <Checkbox /> personal check, <Checkbox /> other <Field width={120}></Field>
        <span> within 3 business days after Acceptance.</span>
      </div>
      <div style={{ paddingLeft: 16, marginTop: 4, fontSize: 12 }}>
        OR (2) <Checkbox /> Buyer Deposit with Agent: Buyer has given the deposit by personal check (or
        <Field width={120}></Field>) to the agent submitting the offer.
      </div>
    </Subsection>
    <Subsection letter="B" title="INCREASED DEPOSIT">
      Buyer shall deposit with Escrow Holder an increased deposit in the amount of ……………… $<Field width={150}>10,000.00</Field>
      <span> within </span><Field width={50}>15</Field>
      <span style={{ fontWeight: 700 }}> Days</span>
      <span> After Acceptance.</span>
    </Subsection>
    <Subsection letter="C" title="LOAN(S)">
      Loan amount of <Field width={170}>360,000.00</Field>
      <span> at maximum interest rate </span>
      <Field width={70}>7.5</Field>
      <span style={{ fontWeight: 700 }}> %</span>
      <span> fixed rate, OR </span>
      <Checkbox /> initial adjustable rate not to exceed <Field width={70}></Field> %.
      <div style={{ paddingLeft: 16, marginTop: 4, fontSize: 12 }}>
        Loan type: <Checkbox checked /> Conventional &nbsp;
        <Checkbox /> FHA &nbsp; <Checkbox /> VA &nbsp; <Checkbox /> USDA &nbsp; <Checkbox /> Other <Field width={120}></Field>
      </div>
    </Subsection>
    <SectionHeading num="4" title="SALE OF BUYER'S PROPERTY" />
    <Subsection letter="A">
      <Checkbox checked /> This Agreement <strong>and Buyer&apos;s ability to obtain financing</strong> are NOT contingent upon the sale of any property owned by Buyer.
    </Subsection>
    <Subsection letter="B">
      <Checkbox /> This Agreement <strong>is contingent</strong> upon the sale of property owned by Buyer as specified in the attached addendum (C.A.R. Form COP).
    </Subsection>
    <PageFooter pageNum={2} />
    {highlight && highlight.page === 2 && <FlagOverlay highlight={highlight} />}
  </PageBox>
);

const Page3: React.FC<{ highlight?: PageHighlight | null }> = ({ highlight }) => (
  <PageBox pageNum={3}>
    <PageMiniHeader pageNum={3} />
    <SectionHeading num="5" title="ALLOCATION OF COSTS" />
    <Subsection letter="A" title="INSPECTIONS, REPORTS AND CERTIFICATES">
      Unless otherwise agreed in writing, the Party specified, as follows, shall pay for the indicated cost.
    </Subsection>
    <div style={{ paddingLeft: 48, fontSize: 12 }}>
      <div style={{ marginBottom: 4 }}>
        <Checkbox checked /> <strong>Buyer</strong> &nbsp; <Checkbox /> Seller shall pay for an inspection and report for wood destroying pests prepared by
        <Field width={170}>Termite Pros Inc.</Field>
      </div>
      <div style={{ marginBottom: 4 }}>
        <Checkbox /> Buyer &nbsp; <Checkbox checked /> <strong>Seller</strong> shall pay for the following Report
        <Field width={120}>Title Report</Field>
        <span> prepared by </span>
        <Field width={170}>First American Title</Field>
      </div>
      <div style={{ marginBottom: 4 }}>
        <Checkbox checked /> <strong>Buyer</strong> &nbsp; <Checkbox /> Seller shall pay for natural hazard zone disclosure report by
        <Field width={170}>NHD Direct</Field>
      </div>
    </div>
    <Subsection letter="B" title="GOVERNMENT REQUIREMENTS AND RETROFIT">
      <Checkbox /> Buyer &nbsp; <Checkbox checked /> <strong>Seller</strong> shall pay to have any State or Local Law mandated installations completed.
    </Subsection>
    <Subsection letter="C" title="ESCROW AND TITLE">
      <Checkbox checked /> <strong>Buyer</strong> &nbsp; <Checkbox /> Seller &nbsp; <Checkbox /> 50/50 split shall pay escrow fee.
      <br />
      Escrow Holder shall be: <Field width={260}>Pacific Coast Escrow</Field>
    </Subsection>
    <Subsection letter="D" title="OTHER COSTS">
      <Checkbox /> Buyer &nbsp; <Checkbox checked /> <strong>Seller</strong> shall pay County transfer tax and fees.
      <br />
      <Checkbox checked /> <strong>Buyer</strong> &nbsp; <Checkbox /> Seller shall pay HOA transfer fees.
    </Subsection>
    <PageFooter pageNum={3} />
    {highlight && highlight.page === 3 && <FlagOverlay highlight={highlight} />}
  </PageBox>
);

const Page4: React.FC<{ highlight?: PageHighlight | null }> = ({ highlight }) => (
  <PageBox pageNum={4}>
    <PageMiniHeader pageNum={4} />
    <SectionHeading num="14" title="TIME PERIODS; REMOVAL OF CONTINGENCIES; CANCELLATION RIGHTS" />
    <Subsection letter="A" title="INSPECTIONS / INVESTIGATIONS">
      Buyer shall have <Field width={50}>17</Field> Days After Acceptance to complete all Buyer Investigations,
      preliminary (non-binding) review of reports and other applicable information, approve disclosures, deliver to
      Seller written disapproval of any items, and elect to either remove the contingency or cancel this Agreement.
    </Subsection>
    <Subsection letter="B" title="LOAN CONTINGENCY">
      Buyer shall have <Field width={50}>21</Field> Days After Acceptance to deliver to Seller a written removal of
      Buyer&apos;s loan contingency or cancellation of this Agreement.
    </Subsection>
    <Subsection letter="C" title="APPRAISAL CONTINGENCY">
      Buyer shall have <Field width={50}>17</Field> Days After Acceptance to deliver to Seller a written removal of
      this contingency or cancellation of this Agreement.
    </Subsection>
    <SectionHeading num="15" title="BUYER'S INVESTIGATION ADVISORY" />
    <Subsection letter="A">
      Buyer&apos;s acceptance of the condition of, and any other matter affecting the Property is a contingency of this
      Agreement as specified in this paragraph and Section 14B.
    </Subsection>
    <Subsection letter="B">
      <span data-flag-target="flag-5">
        <strong>This advisory must be marked as required on the checklist</strong> by all parties prior to close of
        escrow. The C.A.R. Form BIA shall be delivered and acknowledged. Buyer hereby acknowledges receipt of and
        agrees to the terms of the Buyer&apos;s Investigation Advisory.
      </span>
    </Subsection>
    <Subsection letter="C">
      Buyer signature: <Field width={260}></Field> &nbsp; Date: <Field width={120}></Field>
    </Subsection>
    <PageFooter pageNum={4} />

    {highlight && highlight.page === 4 && (
      <FlagOverlay highlight={highlight} />
    )}
  </PageBox>
);

const Page5: React.FC<{ highlight?: PageHighlight | null }> = ({ highlight }) => (
  <PageBox pageNum={5}>
    <PageMiniHeader pageNum={5} />
    <SectionHeading num="16" title="LIQUIDATED DAMAGES" />
    <Subsection letter="A">
      If Buyer fails to complete this purchase because of Buyer&apos;s default, Seller shall retain, as liquidated damages,
      the deposit actually paid. Buyer and Seller agree to the foregoing as their full reasoned and voluntary
      acknowledgement of liquidated damages.
    </Subsection>
    <SectionHeading num="17" title="DISPUTE RESOLUTION" />
    <Subsection letter="A" title="MEDIATION">
      The Parties agree to mediate any dispute or claim arising between them out of this Agreement before resorting
      to arbitration or court action.
    </Subsection>
    <Subsection letter="B" title="ARBITRATION OF DISPUTES">
      The Parties agree that any dispute or claim in Law or equity arising between them out of this Agreement shall
      be decided by neutral, binding arbitration.
    </Subsection>
    <SectionHeading num="18" title="SIGNATURES" />
    <div style={{ paddingLeft: 24, marginTop: 16 }}>
      <div>Buyer: <Field width={420}>Rachael Laurolla</Field> Date: <Field width={140}>11/24/2026</Field></div>
      <div style={{ marginTop: 14 }}>Buyer: <Field width={420}>Rob Laurolla</Field> Date: <Field width={140}>11/24/2026</Field></div>
      <div style={{ marginTop: 14 }}>Seller: <Field width={420}></Field> Date: <Field width={140}></Field></div>
      <div style={{ marginTop: 14 }}>Seller: <Field width={420}></Field> Date: <Field width={140}></Field></div>
    </div>
    <PageFooter pageNum={5} />
    {highlight && highlight.page === 5 && <FlagOverlay highlight={highlight} />}
  </PageBox>
);

/* ------------------------------------------------------------------ */
/*  Page wrapper + flag overlay                                        */
/* ------------------------------------------------------------------ */

const PageBox: React.FC<{ pageNum: number; children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: PAGE_W,
      height: PAGE_H,
      background: "#ffffff",
      boxShadow: "0 4px 16px rgba(10,38,66,0.10)",
      padding: "28px 44px 60px",
      fontFamily: "'Times New Roman', Times, serif",
      color: "#0A2642",
      fontSize: 13,
      lineHeight: "20px",
      position: "relative",
      flexShrink: 0,
      boxSizing: "border-box",
    }}
  >
    {children}
  </div>
);

const FlagOverlay: React.FC<{ highlight: PageHighlight }> = ({ highlight }) => {
  const scale = highlight.scale ?? 1;
  return (
    <>
      {/* Pulse ring */}
      {highlight.pulseProgress !== undefined && highlight.pulseProgress < 1 && (
        <div
          style={{
            position: "absolute",
            top: highlight.top,
            left: highlight.left,
            width: highlight.width,
            height: highlight.height,
            border: "3px solid #ff5255",
            borderRadius: 4,
            opacity: 0.7 * (1 - highlight.pulseProgress),
            transform: `scale(${1 + 0.5 * highlight.pulseProgress})`,
            transformOrigin: "center",
            pointerEvents: "none",
          }}
        />
      )}
      {/* Highlight box */}
      <div
        style={{
          position: "absolute",
          top: highlight.top,
          left: highlight.left,
          width: highlight.width,
          height: highlight.height,
          background: "rgba(255, 82, 85, 0.32)",
          border: "2px solid #ff5255",
          borderRadius: 3,
          opacity: highlight.progress,
          boxShadow: "0 0 0 4px rgba(255, 82, 85, 0.18)",
          transform: `scale(${scale})`,
          transformOrigin: "center",
          pointerEvents: "none",
        }}
      />
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Main RPAFormOverlay                                                */
/* ------------------------------------------------------------------ */

export const RPAFormOverlay: React.FC<RPAFormOverlayProps> = ({
  left,
  top = 24,
  width = PAGE_W,
  height,
  scrollY = 0,
  pageHighlight,
}) => {
  const isCentered = left === undefined;
  return (
    <div
      style={{
        position: "absolute",
        left: isCentered ? "50%" : left,
        top,
        transform: isCentered ? "translateX(-50%)" : undefined,
        bottom: height === undefined ? 24 : undefined,
        width,
        height,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <div
        style={{
          transform: `translateY(${-scrollY}px)`,
          display: "flex",
          flexDirection: "column",
          gap: PAGE_GAP,
          willChange: "transform",
        }}
      >
        <Page1 highlight={pageHighlight} />
        <Page2 highlight={pageHighlight} />
        <Page3 highlight={pageHighlight} />
        <Page4 highlight={pageHighlight} />
        <Page5 highlight={pageHighlight} />
      </div>
    </div>
  );
};

/** Non-Remotion variant — renders pages stacked vertically for natural
 *  scrolling inside any flex/scroll container. */
export const RPAFormPages: React.FC<{
  pageHighlight?: RPAFormPageHighlight | null;
}> = ({ pageHighlight }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: PAGE_GAP,
      alignItems: "center",
      padding: 24,
    }}
  >
    <Page1 highlight={pageHighlight} />
    <Page2 highlight={pageHighlight} />
    <Page3 highlight={pageHighlight} />
    <Page4 highlight={pageHighlight} />
    <Page5 highlight={pageHighlight} />
  </div>
);

/** Compute the scrollY that puts a given page at the top of the viewport */
export const PAGE_SCROLL_Y = (page: number) => (page - 1) * (PAGE_H + PAGE_GAP);
export const RPA_PAGE_HEIGHT = PAGE_H;
export const RPA_PAGE_GAP = PAGE_GAP;
