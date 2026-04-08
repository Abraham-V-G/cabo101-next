"use client";

import { Suspense } from "react";
import BookingContent from "./BookingContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
