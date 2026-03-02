interface SidebarProps {
  open: boolean;
  onClose: () => void;
  side: "left" | "right";
  breakpoint?: "lg" | "xl";
  width?: string;
  children: React.ReactNode;
}

const breakpointClasses = {
  lg: {
    reset: "lg:translate-x-0 lg:block lg:relative lg:z-0",
    hidden: "lg:hidden",
  },
  xl: {
    reset: "xl:translate-x-0 xl:block xl:relative xl:z-0",
    hidden: "xl:hidden",
  },
};

export default function Sidebar({
  open,
  onClose,
  side,
  breakpoint = "lg",
  width = "w-[320px] sm:w-[374px]",
  children,
}: SidebarProps) {
  const isLeft = side === "left";
  const bp = breakpointClasses[breakpoint];

  const positionClasses = isLeft
    ? "left-0 border-r"
    : "right-0 border-l";

  const translateHidden = isLeft ? "-translate-x-full" : "translate-x-full";
  const translateVisible = "translate-x-0";

  const closeButtonPosition = isLeft
    ? "top-3 right-3"
    : "top-3 left-3";

  return (
    <aside
      className={`
        fixed top-0 ${positionClasses} h-full z-40
        ${width} shrink-0
        border-grey-300 bg-white
        transition-transform duration-300 ease-in-out
        ${bp.reset}
        ${open ? translateVisible : translateHidden}
      `}
    >
      <button
        onClick={onClose}
        className={`${bp.hidden} absolute ${closeButtonPosition} z-50 w-8 h-8 rounded-full bg-grey-100 flex items-center justify-center text-grey-700 hover:bg-grey-200`}
        aria-label={`Close ${side} sidebar`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
      {children}
    </aside>
  );
}
