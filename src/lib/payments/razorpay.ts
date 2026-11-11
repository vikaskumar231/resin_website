import crypto from "crypto";

export interface CreateOrderParams {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface VerifySignatureParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

const IS_PROD = process.env.NODE_ENV === "production";
const IS_MOCK_MODE = !IS_PROD && (process.env.MOCK_MODE === "true" || !process.env.RAZORPAY_KEY_SECRET);

/**
 * Creates a Razorpay Order (Server-Side)
 * Supports Dual-Mode Mock Architecture for local testing; strictly enforces Live API in Production.
 */
export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrderResult> {
  if (IS_PROD && (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.startsWith("mock_"))) {
    throw new Error(
      "[CRITICAL SECURITY CONFIGURATION ERROR] Live production environment detected without valid RAZORPAY_KEY_SECRET. Order creation aborted."
    );
  }

  if (IS_MOCK_MODE) {
    // Deterministic Mock Provider for offline local dev
    return {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      amount: params.amountPaise,
      currency: "INR",
      receipt: params.receipt,
      status: "created",
    };
  }

  // Live Razorpay API Integration
  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
  ).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amountPaise,
      currency: "INR",
      receipt: params.receipt,
      notes: params.notes,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Razorpay API Error: ${response.status} - ${errorBody}`);
  }

  return response.json();
}

/**
 * Verifies Razorpay Cryptographic HMAC-SHA256 Payment Signature
 * Prevents payment tampering or forged payment IDs using timing-safe comparison.
 */
export function verifyRazorpaySignature(params: VerifySignatureParams): boolean {
  if (IS_PROD) {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret || secret.startsWith("mock_")) {
      throw new Error(
        "[CRITICAL SECURITY ERROR] Production payment verification attempted without live RAZORPAY_KEY_SECRET."
      );
    }
  }

  if (IS_MOCK_MODE) {
    // In local development mock mode, verify that all three fields are populated
    return Boolean(params.orderId && params.paymentId && params.signature);
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured on server");
  }

  const payload = `${params.orderId}|${params.paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  // Timing-safe cryptographic comparison to prevent side-channel timing attacks
  const expectedBuf = Buffer.from(expectedSignature, "utf-8");
  const actualBuf = Buffer.from(params.signature, "utf-8");

  if (expectedBuf.length !== actualBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}
