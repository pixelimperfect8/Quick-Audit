interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  size?: "sm" | "md";
}

const sizeStyles: Record<NonNullable<IconButtonProps["size"]>, string> = {
  sm: "p-0.5",
  md: "p-1",
};

export default function IconButton({
  icon,
  label,
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className={`text-grey-700 hover:text-grey-900 hover:bg-grey-200 rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 disabled:opacity-50 disabled:cursor-not-allowed ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon}
    </button>
  );
}
