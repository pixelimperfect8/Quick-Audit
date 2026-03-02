interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-green-500 hover:bg-green-600 text-white rounded-full font-bold",
  danger:
    "bg-red-400 hover:bg-red-500 text-white rounded-full font-bold",
  ghost:
    "text-grey-700 hover:text-grey-900 hover:bg-grey-50 font-medium",
  outline:
    "border border-grey-300 bg-white hover:bg-grey-50 text-grey-900 rounded-lg font-medium",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-2 text-sm gap-1.5",
  md: "px-5 py-2 text-sm gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`flex items-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
