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

  // 2. Verify Configured Bearer Token (strictly requires configured environment secret)
  const configuredApiKey = process.env.ADMIN_API_KEY;
  const hasValidBearer = Boolean(
    configuredApiKey && authHeader === `Bearer ${configuredApiKey}`
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

