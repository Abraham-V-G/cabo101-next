"use client";

import { Suspense } from "react";
import SuccessContent from "./SuccesContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}