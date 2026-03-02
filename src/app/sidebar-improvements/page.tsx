import Link from "next/link";
import BackLink from "@/components/BackLink";
import { ChevronRight } from "@/components/icons";

const options = [
  {
    title: "Option 1",
    description: "Baseline dashboard layout — starting point for sidebar modifications.",
    href: "/sidebar-improvements/option-1",
  },
];

export default function SidebarImprovementsPage() {
  return (
    <div className="min-h-dvh bg-grey-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <BackLink href="/" label="Back to Quick Audit" />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-grey-900 text-3xl font-bold tracking-tight">
            Sidebar Improvements
          </h1>
          <p className="text-grey-700 text-base mt-2">
            Explore alternative sidebar designs and layouts.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {options.map((item) => (
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
