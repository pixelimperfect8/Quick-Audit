interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "warning" | "success" | "info";
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-grey-100 text-grey-900",
  warning: "bg-yellow-200 text-grey-900",
  success: "bg-green-50 text-grey-900",
  info: "bg-blue-800/10 text-grey-900",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-sm font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
