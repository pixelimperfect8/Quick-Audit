import { WarningIcon } from "@/components/icons";
import type { SourceData } from "./Option2TransactionSources";

interface SourceTooltipProps {
  label: string;
  data: SourceData;
}

function SourceRow({
  source,
  value,
  isMismatch,
}: {
  source: string;
  value: string;
  isMismatch?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-grey-800 text-xs font-medium uppercase tracking-wide">
        {source}
      </span>
      <span
        className={`text-sm font-medium leading-5 ${
          isMismatch ? "text-red-500" : "text-grey-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function SourceTooltip({ label, data }: SourceTooltipProps) {
  const sources: { key: string; value: string }[] = [];
  if (data.formValue) sources.push({ key: data.formName ?? "Form", value: data.formValue });
  if (data.fileValue) sources.push({ key: "File", value: data.fileValue });
  if (data.mlsValue) sources.push({ key: "MLS", value: data.mlsValue });

  return (
    <div className="w-60 p-3">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-grey-900 text-sm font-bold leading-5 truncate">
          {label}
        </span>
        {data.mismatch && (
          <WarningIcon className="w-3.5 h-3.5 text-orange-200 shrink-0" />
        )}
      </div>

      {/* Source rows */}
      <div className="flex flex-col gap-1.5">
        {sources.map((src) => (
          <SourceRow
            key={src.key}
            source={src.key}
            value={src.value}
            isMismatch={data.mismatch}
          />
        ))}
      </div>

      {/* Page ref */}
      {data.page && (
        <p className="text-grey-600 text-sm mt-2 pt-2 border-t border-grey-200">
          {data.page}
        </p>
      )}
    </div>
  );
}
