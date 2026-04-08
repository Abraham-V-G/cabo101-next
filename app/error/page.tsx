"use client";

import { Suspense } from "react";
import SuccessContent from "./ErrorContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}