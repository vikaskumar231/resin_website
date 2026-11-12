import { NextRequest, NextResponse } from "next/server";
import { signSessionToken, SESSION_COOKIE_NAME, ROLE_COOKIE_NAME } from "@/lib/auth/session";
import { userRepository, verifyPassword } from "@/lib/repositories/userRepository";

interface RateLimitEntry {
  attempts: number;
  firstAttemptTime: number;
}

// In-memory sliding window rate limiter for brute-force defense
const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.firstAttemptTime > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { attempts: 1, firstAttemptTime: now });
  } else {
    entry.attempts += 1;
  }
}

function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);
  const now = Date.now();
  const rateEntry = rateLimitMap.get(clientIp);

  // Check rate limit status
  if (rateEntry) {
    if (now - rateEntry.firstAttemptTime > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(clientIp);
    } else if (rateEntry.attempts >= MAX_FAILED_ATTEMPTS) {
      const remainingSeconds = Math.ceil(
        (RATE_LIMIT_WINDOW_MS - (now - rateEntry.firstAttemptTime)) / 1000
      );
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed login attempts. Account temporarily locked for 15 minutes.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": remainingSeconds.toString(),
          },
        }
      );
    }
  }

  try {
    const body = await req.json();
    const { identifier, password } = body;

    const idTrim = (identifier || "").trim();
    const pwdTrim = (password || "").trim();

    if (!idTrim || !pwdTrim) {
      return NextResponse.json(
        { success: false, error: "Please enter both username and password." },
        { status: 400 }
      );
    }

    // Configurable administrator credentials from environment
    const isProduction = process.env.NODE_ENV === "production";
    const configuredAdminUser = (process.env.ADMIN_USERNAME || "").trim();
    const configuredAdminPass = (process.env.ADMIN_PASSWORD || "").trim();

    // Determine cookie security: always secure on HTTPS, allow HTTP for localhost testing
    const isHttps = req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
    const cookieSecure = isHttps || (isProduction && !req.nextUrl.hostname.includes("localhost") && !req.nextUrl.hostname.includes("127.0.0.1"));

    // Default fallback: "admin" / "ArtisanAdmin2026!" in production; "Vikas" / "Vikas" in development
    const fallbackAdminUser = isProduction ? "admin" : "Vikas";
    const fallbackAdminPass = isProduction ? "ArtisanAdmin2026!" : "Vikas";

    const expectedAdminUser = configuredAdminUser || fallbackAdminUser;
    const expectedAdminPass = configuredAdminPass || fallbackAdminPass;

    // Enforce production security: dev default password "Vikas" is disallowed in production
    if (isProduction && pwdTrim === "Vikas" && expectedAdminPass !== "Vikas") {
      recordFailedAttempt(clientIp);
      return NextResponse.json(
        {
          success: false,
          error: "Development credentials cannot be used in production.",
        },
        { status: 403 }
      );
    }

    // 1. MASTER / SUPER ADMIN DIRECT AUTHENTICATION (Environment-Based Priority)
    // Allows instant, guaranteed access for platform owner/artisan across any deployment (Vercel, Docker, Serverless)
    if (idTrim.toLowerCase() === expectedAdminUser.toLowerCase()) {
      if (pwdTrim === expectedAdminPass) {
        resetRateLimit(clientIp);

        const adminUser = {
          id: "user_master_admin",
          username: expectedAdminUser,
          name:
            process.env.ADMIN_NAME ||
            (expectedAdminUser.toLowerCase() === "admin"
              ? "Artisan Administrator"
              : `${expectedAdminUser} (Master Artisan)`),
          email: process.env.ADMIN_EMAIL || `${expectedAdminUser.toLowerCase()}@artaalay.com`,
          phone: process.env.ADMIN_PHONE || "+91 98765 43210",
          role: "ARTISAN_ADMIN" as const,
        };

        const signedToken = await signSessionToken({
          userId: adminUser.id,
          role: adminUser.role,
        });

        const res = NextResponse.json({ success: true, user: adminUser });
        res.cookies.set({
          name: SESSION_COOKIE_NAME,
          value: signedToken,
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: cookieSecure,
          maxAge: 30 * 24 * 60 * 60,
        });
        res.cookies.set({
          name: ROLE_COOKIE_NAME,
          value: adminUser.role,
          httpOnly: false,
          path: "/",
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60,
        });
        return res;
      } else {
        recordFailedAttempt(clientIp);
        return NextResponse.json(
          {
            success: false,
            errorType: "INVALID_PASSWORD",
            error: "Incorrect administrator password. Please verify your password and try again.",
            wrongPassword: true,
          },
          { status: 401 }
        );
      }
    }

    // 2. Look up customer / team member in registered database
    const user = await userRepository.findByIdentifier(idTrim);

    if (!user) {
      recordFailedAttempt(clientIp);
      return NextResponse.json(
        {
          success: false,
          errorType: "USER_NOT_FOUND",
          error: `No registered account found with username or email "${idTrim}". Please register to create your account.`,
          promptRegister: true,
        },
        { status: 401 }
      );
    }

    // 3. Scenario: User found -> Validate password cryptographically
    const isPasswordValid = verifyPassword(pwdTrim, user.salt, user.passwordHash);

    // Scenario: Password mismatch -> explicitly call out incorrect password
    if (!isPasswordValid) {
      recordFailedAttempt(clientIp);
      return NextResponse.json(
        {
          success: false,
          errorType: "INVALID_PASSWORD",
          error: "Incorrect password. Please verify your password and try again.",
          wrongPassword: true,
        },
        { status: 401 }
      );
    }

    // 4. Authentication Successful: Determine and assign cryptographic role
    resetRateLimit(clientIp);

    let assignedRole: "ARTISAN_ADMIN" | "CUSTOMER" = "CUSTOMER";
    if (user.role === "ARTISAN_ADMIN") {
      assignedRole = "ARTISAN_ADMIN";
    } else {
      assignedRole = "CUSTOMER";
    }

    const authenticatedUser = assignedRole === "ARTISAN_ADMIN"
      ? {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: "ARTISAN_ADMIN" as const,
        }
      : {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: "CUSTOMER" as const,
        };

    const signedToken = await signSessionToken({
      userId: authenticatedUser.id,
      role: authenticatedUser.role,
    });

    const res = NextResponse.json({ success: true, user: authenticatedUser });

    // Secure HttpOnly signed cookie for Edge middleware & API auth
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: signedToken,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: cookieSecure,
      maxAge: 30 * 24 * 60 * 60,
    });

    // Client-readable cookie for UI layout state
    res.cookies.set({
      name: ROLE_COOKIE_NAME,
      value: authenticatedUser.role,
      httpOnly: false,
      path: "/",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
    });

    return res;
  } catch (error: any) {
    console.error("[POST /api/auth/login] Error:", error);
    return NextResponse.json(
      { success: false, error: "An authentication error occurred. Please try again." },
      { status: 500 }
    );
  }
}
