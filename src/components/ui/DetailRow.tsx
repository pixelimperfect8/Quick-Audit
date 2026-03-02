interface DetailRowProps {
  label: string;
  value?: string;
  isLink?: boolean;
  href?: string;
  labelWidth?: string;
  children?: React.ReactNode;
}

export default function DetailRow({
  label,
  value,
  isLink,
  href = "#",
  labelWidth = "w-[140px]",
  children,
}: DetailRowProps) {
  return (
    <div className="flex items-start">
      <span className={`text-grey-900 text-base font-bold ${labelWidth} shrink-0 leading-6`}>
        {label}
      </span>
      {children ?? (isLink ? (
        <a
          href={href}
          className="text-grey-900 text-base font-medium leading-6 underline break-all min-w-0 flex-1"
        >
          {value}
        </a>
      ) : (
        <span className="text-grey-900 text-base font-medium leading-6 break-words min-w-0 flex-1">
          {value}
        </span>
      ))}
    </div>
  );
}
