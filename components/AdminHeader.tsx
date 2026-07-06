// components/AdminHeader.tsx
"use client";

import Link from "next/link";

export default function AdminHeader({
  section,
  backHref = "/admin",
}: {
  section: string;
  backHref?: string;
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">C</span>
        </div>
        <span className="font-semibold text-gray-900">
          Cabo 101 · Admin{section ? ` / ${section}` : ""}
        </span>
      </div>
      <Link
        href={backHref}
        className="text-sm text-gray-500 hover:text-gray-700 transition"
      >
        ← Volver al Dashboard
      </Link>
    </div>
  );
}