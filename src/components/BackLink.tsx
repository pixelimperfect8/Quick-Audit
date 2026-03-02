"use client";

import Link from "next/link";
import { ArrowBack } from "./icons";

interface BackLinkProps {
  href: string;
  label: string;
}

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-grey-700 hover:text-grey-900 transition-colors text-sm font-medium"
    >
      <ArrowBack className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}
