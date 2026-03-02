"use client";

import Link from "next/link";
import { ArrowBack } from "./icons";

interface TopNavProps {
  href: string;
  label: string;
}

export default function TopNav({ href, label }: TopNavProps) {
  return (
    <nav className="bg-blue-900 px-4 py-2 shrink-0">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium"
      >
        <ArrowBack className="w-4 h-4" />
        <span>{label}</span>
      </Link>
    </nav>
  );
}
