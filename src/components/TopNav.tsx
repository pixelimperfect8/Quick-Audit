"use client";

import Link from "next/link";
import { ArrowBack } from "./icons";

interface ToggleDef {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface TopNavProps {
  href: string;
  label: string;
  toggles?: ToggleDef[];
}

export default function TopNav({ href, label, toggles }: TopNavProps) {
  return (
    <nav className="bg-blue-900 px-4 py-2 shrink-0 flex items-center justify-between">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowBack className="w-4 h-4" />
        <span>{label}</span>
      </Link>

      {toggles && toggles.length > 0 && (
        <div className="flex items-center gap-4">
          {toggles.map((toggle) => (
            <div
              key={toggle.label}
              role="button"
              tabIndex={0}
              onClick={() => toggle.onChange(!toggle.checked)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle.onChange(!toggle.checked);
                }
              }}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="text-white/80 text-sm font-medium">
                {toggle.label}
              </span>
              <span
                role="switch"
                aria-checked={toggle.checked}
                aria-label={toggle.label}
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  toggle.checked ? "bg-green-500" : "bg-white/30"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                    toggle.checked ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </span>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
