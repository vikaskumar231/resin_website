/**
 * Artआलय Cryptographic Session Security & WebCrypto Token Manager
 * 
 * Provides tamper-proof HMAC-SHA256 session token generation and verification.
 * Compatible with Next.js Edge Runtime (middleware) and standard Node.js API handlers.
 */

export const SESSION_COOKIE_NAME = "art_aalay_session";
export const ROLE_COOKIE_NAME = "art_aalay_role";

const DEFAULT_SECRET = "art_aalay_default_secure_hmac_secret_key_production_grade_32_chars";
const MAX_SESSION_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_API_KEY || process.env.NEXTAUTH_SECRET;
  if (secret && secret !== DEFAULT_SECRET) {
    return secret;
  }
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[PRODUCTION SECURITY WARNING] SESSION_SECRET is not explicitly set in Vercel/Production environment variables. Using fallback secret. Please configure SESSION_SECRET in Vercel Project Settings for optimal cryptographic entropy."
    );
  }
  return DEFAULT_SECRET;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) return new Uint8Array(new ArrayBuffer(0));
  const buffer = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface SessionPayload {
  userId: string;
  role: "ARTISAN_ADMIN" | "CUSTOMER" | "WORKSHOP_MAKER";
}

export interface SessionVerificationResult {
  valid: boolean;
  userId?: string;
  role?: "ARTISAN_ADMIN" | "CUSTOMER" | "WORKSHOP_MAKER";
  error?: string;
}

/**
 * Signs a session payload using HMAC-SHA256
 * Format: `${userId}.${role}.${timestamp}.${hmacHex}`
 */
export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const timestamp = Date.now().toString();
  const rawMessage = `${payload.userId}:${payload.role}:${timestamp}`;
  const encoder = new TextEncoder();

  const key = await getCryptoKey(getSecret());
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(rawMessage));
  const sigHex = bytesToHex(new Uint8Array(signature));

  return `${encodeURIComponent(payload.userId)}.${payload.role}.${timestamp}.${sigHex}`;
}

/**
 * Verifies a session token's cryptographic integrity and expiration
 */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionVerificationResult> {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Session token missing" };
  }

  const parts = token.split(".");
  if (parts.length !== 4) {
    return { valid: false, error: "Malformed session token format" };
  }

  const [rawUserId, role, timestampStr, signatureHex] = parts;
  const userId = decodeURIComponent(rawUserId);
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) {
    return { valid: false, error: "Invalid session timestamp" };
  }

  // Check expiration
  if (Date.now() - timestamp > MAX_SESSION_AGE_MS) {
    return { valid: false, error: "Session token expired" };
  }

  // Verify HMAC signature
  try {
    const rawMessage = `${userId}:${role}:${timestampStr}`;
    const encoder = new TextEncoder();
    const key = await getCryptoKey(getSecret());
    const sigBytes = hexToBytes(signatureHex);

    const isMatch = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes as unknown as BufferSource,
      encoder.encode(rawMessage)
    );

    if (!isMatch) {
      return { valid: false, error: "Invalid cryptographic signature. Possible tampering." };
    }

    if (role !== "ARTISAN_ADMIN" && role !== "CUSTOMER" && role !== "WORKSHOP_MAKER") {
      return { valid: false, error: "Unrecognized user role in token" };
    }

    return {
      valid: true,
      userId,
      role: role as "ARTISAN_ADMIN" | "CUSTOMER" | "WORKSHOP_MAKER",
    };
  } catch (err: any) {
    return { valid: false, error: err.message || "Cryptographic verification failure" };
  }
}
