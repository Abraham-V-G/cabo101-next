"use client";

import { Suspense } from "react";
import PayContent from "./Paycontent";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading payment...</div>}>
      <PayContent />
    </Suspense>
  );
}