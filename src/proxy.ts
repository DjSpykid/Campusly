import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/config";
import type { Role } from "@/config/roles";

const { auth } = NextAuth(authConfig);

const PROTECTED: [string, Role | null][] = [
  ["/dashboard", "seller"],
  ["/runner", "runner"],
  ["/admin", "admin"],
  ["/orders", null],
  ["/bookings", null],
  ["/cart", null],
  ["/checkout", null],
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const rule = PROTECTED.find(([p]) => pathname === p || pathname.startsWith(p + "/"));
  if (!rule) return NextResponse.next();
  const user = req.auth?.user;
  if (!user) {
    const url = new URL("/login", req.nextUrl);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  const [, role] = rule;
  const ok = !role || user.roles.includes(role) || (role === "seller" && user.roles.includes("provider"));
  if (!ok) return NextResponse.redirect(new URL("/", req.nextUrl));
  return NextResponse.next();
});

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
