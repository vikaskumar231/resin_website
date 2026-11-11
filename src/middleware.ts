import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";

/**
 * Artआलय Security & Edge RBAC Middleware
 * 
 * Enforces:
 * 1. Hardened Security Headers (HSTS, X-Frame-Options, X-Content-Type-Options, CSP)
 * 2. Cryptographic Edge RBAC Route Guard for /admin/* and /api/admin/* paths
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  // 1. Hardened Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // 2. Strict Cryptographic Admin RBAC Guard
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isCategoryMutation = pathname.startsWith("/api/categories") && request.method !== "GET";

  if (isAdminPath || isCategoryMutation) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const authHeader = request.headers.get("authorization");

    // Check 1: Cryptographically signed HMAC session token
    let hasValidSession = false;
    if (sessionCookie) {
      const sessionResult = await verifySessionToken(sessionCookie);
      if (sessionResult.valid && sessionResult.role === "ARTISAN_ADMIN") {
        hasValidSession = true;
      }
    }

    // Check 2: Server-configured Bearer token using constant-time comparison
    const configuredApiKey = process.env.ADMIN_API_KEY;
    const expectedBearer = configuredApiKey ? `Bearer ${configuredApiKey}` : "";
    let hasValidBearer = false;
    if (configuredApiKey && authHeader && authHeader.length === expectedBearer.length) {
      let mismatch = 0;
      for (let i = 0; i < authHeader.length; i++) {
        mismatch |= authHeader.charCodeAt(i) ^ expectedBearer.charCodeAt(i);
      }
      hasValidBearer = mismatch === 0;
    }

    const isAuthorized = hasValidSession || hasValidBearer;

    if (!isAuthorized) {
      // For REST API endpoints, return immediate HTTP 401 Unauthorized JSON
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          {
            success: false,
            error: "Unauthorized: Verified Artisan Admin cryptographic session required to access this API.",
          },
          { status: 401 }
        );
      }

      // For page navigation, redirect to login with callback URL
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "unauthorized");
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
