//app/api/create-booking-session/route.ts

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
  });
}