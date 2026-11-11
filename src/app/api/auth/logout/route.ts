import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, ROLE_COOKIE_NAME } from "@/lib/auth/session";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out successfully" });

  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });

  res.cookies.set({
    name: ROLE_COOKIE_NAME,
    value: "",
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    maxAge: 0,
  });

  return res;
}

