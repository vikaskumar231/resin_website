import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export interface AdminAuthResult {
  isAuthorized: boolean;
  role?: string;
  errorResponse?: NextResponse;
}

/**
 * Server-side Admin Authorization Guard
 * Enforces Zero-Trust cryptographic verification for all administrative mutations (CMS, Uploads, Products).
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function verifyAdminSession(req: NextRequest): Promise<AdminAuthResult> {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authHeader = req.headers.get("authorization");

  // 1. Verify Cryptographic HMAC Session Token
  let hasValidSession = false;
  if (sessionCookie) {
    const sessionResult = await verifySessionToken(sessionCookie);
    if (sessionResult.valid && sessionResult.role === "ARTISAN_ADMIN") {
      hasValidSession = true;
    }
  }

  // 2. Verify Configured Bearer Token using constant-time comparison to prevent timing attacks
  const configuredApiKey = process.env.ADMIN_API_KEY;
  const expectedBearer = configuredApiKey ? `Bearer ${configuredApiKey}` : "";
  const hasValidBearer = Boolean(
    configuredApiKey && authHeader && constantTimeEqual(authHeader, expectedBearer)
  );

  if (hasValidSession || hasValidBearer) {
    return {
      isAuthorized: true,
      role: "ARTISAN_ADMIN",
    };
  }

  return {
    isAuthorized: false,
    errorResponse: NextResponse.json(
      {
        success: false,
        error: "Unauthorized: Verified Artisan Administrator cryptographic session required to access this endpoint.",
      },
      { status: 401 }
    ),
  };
}

