import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  console.log("PATH:", req.nextUrl.pathname);

  const token = req.cookies.get("admin_token")?.value;

  console.log("TOKEN EXISTS:", !!token);

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  const isLoginPage =
    req.nextUrl.pathname === "/admin/login";

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (isLoginPage) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(
      new URL("/admin/login", req.url)
    );
  }

  try {
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
    );

    console.log("JWT VALID");
    console.log(decoded);

    return NextResponse.next();

    } catch (error) {
    console.log("JWT INVALID");
    console.error(error);

    return NextResponse.redirect(
        new URL("/admin/login", req.url)
    );
    }
}

export const config = {
  matcher: ["/admin/:path*"],
};