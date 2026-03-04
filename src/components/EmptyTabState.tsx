import { DescriptionIcon, PlusIcon } from "./icons";

/** Empty state shown when a tab has no document loaded */
export default function EmptyTabState() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-grey-200 gap-4 p-8">
      {/* Document illustration with green "+" badge */}
      <div className="relative">
        <DescriptionIcon className="w-16 h-16 text-blue-300" />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
          <PlusIcon className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Instructional text */}
      <p className="text-grey-800 text-sm text-center max-w-[320px] leading-5">
        Select a document to load it in this tab and
        <br />
        keep your place in other files.
      </p>
    </div>
  );
}
