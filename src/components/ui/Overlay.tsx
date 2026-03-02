interface OverlayProps {
  visible: boolean;
  onClick: () => void;
  breakpoint?: "lg" | "xl";
  zIndex?: string;
}

const breakpointHidden = {
  lg: "lg:hidden",
  xl: "xl:hidden",
};

export default function Overlay({
  visible,
  onClick,
  breakpoint = "lg",
  zIndex = "z-30",
}: OverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/30 ${zIndex} ${breakpointHidden[breakpoint]}`}
      onClick={onClick}
    />
  );
}
