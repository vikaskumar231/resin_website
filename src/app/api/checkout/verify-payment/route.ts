import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { orderRepository } from "@/lib/repositories/orderRepository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderNumber,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body;

    if (!orderNumber || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing required payment verification tokens (orderNumber, razorpayOrderId, razorpayPaymentId, razorpaySignature)" },
        { status: 400 }
      );
    }

    // Cryptographic signature verification
    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment signature verification failed. Possible payload tampering." },
        { status: 400 }
      );
    }

    // Link verified payment to order record for audit & accounting
    try {
      orderRepository.saveOrder({
        orderNumber,
        status: "ORDER_CONFIRMED",
        paymentDetails: {
          razorpayOrderId,
          razorpayPaymentId,
          status: "PAID",
          paidAt: new Date().toISOString(),
        },
      });
    } catch (saveErr) {
      console.error("[verify-payment] Warning: Failed to record payment details on order:", saveErr);
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order confirmed.",
      orderNumber,
      redirectUrl: `/order-confirmation/${orderNumber}`,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed. Please contact customer support if money was debited." },
      { status: 500 }
    );
  }
}

