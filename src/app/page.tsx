import Link from "next/link";
import { ChevronRight } from "@/components/icons";

const explorations = [
  {
    title: "Key File Data",
    description: "Transaction document management dashboard with document checklist, viewer, and details panel.",
    href: "/key-file-data",
  },
  {
    title: "Sidebar Improvements",
    description: "Explore alternative sidebar designs and interaction patterns.",
    href: "/sidebar-improvements",
  },
  {
    title: "Smart Assist Enhancements",
    description: "3/11/25 — Explore smart assist design enhancements.",
    href: "/smart-assist-enhancements",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-grey-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <h1 className="text-grey-900 text-3xl font-bold tracking-tight">
            Quick Audit
          </h1>
          <p className="text-grey-700 text-base mt-2">
            Exploration hub for transaction audit interfaces.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {explorations.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between gap-4 bg-white border border-grey-300 rounded-lg px-5 py-4 hover:border-blue-800 hover:bg-grey-50 transition-colors"
            >
              <div>
                <h2 className="text-grey-900 text-base font-bold group-hover:text-blue-800 transition-colors">
                  {item.title}
                </h2>
                <p className="text-grey-700 text-sm mt-0.5">
                  {item.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-grey-500 group-hover:text-blue-800 shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
