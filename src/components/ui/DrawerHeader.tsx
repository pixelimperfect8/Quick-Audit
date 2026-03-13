import { CloseIcon } from "../icons";

interface DrawerHeaderProps {
  title: string;
  onClose: () => void;
}

export default function DrawerHeader({ title, onClose }: DrawerHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-4 border-b border-grey-300 shrink-0 sticky top-0 z-10 bg-white h-[45px]">
      <button
        onClick={onClose}
        className="text-grey-700 hover:text-grey-900 transition-colors"
        aria-label={`Close ${title}`}
      >
        <CloseIcon className="w-[18px] h-[18px]" />
      </button>
      <h2 className="text-grey-900 text-base font-bold leading-6 truncate">{title}</h2>
    </div>
  );
}
