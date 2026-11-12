import { NextRequest, NextResponse } from "next/server";
import { orderRepository } from "@/lib/repositories/orderRepository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderNumber } = body;

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Missing required orderNumber" },
        { status: 400 }
      );
    }

    // With offline payment, orders are confirmed directly upon creation.
    // This route guarantees backward compatibility for any pending client callbacks.
    try {
      orderRepository.saveOrder({
        orderNumber,
        status: "ORDER_CONFIRMED",
        paymentDetails: {
          method: "OFFLINE_SETTLEMENT",
          status: "PENDING_OFFLINE",
          offlineNotes: "Order registered for offline settlement (Cash / Direct UPI on Delivery or WhatsApp).",
        },
      });
    } catch (saveErr) {
      console.error("[verify-payment] Warning: Failed to record payment details on order:", saveErr);
    }

    return NextResponse.json({
      success: true,
      message: "Order confirmed for offline settlement.",
      orderNumber,
      redirectUrl: `/order-confirmation/${orderNumber}`,
    });
  } catch (error: any) {
    console.error("Offline payment confirmation error:", error);
    return NextResponse.json(
      { error: "Failed to confirm order for offline settlement." },
      { status: 500 }
    );
  }
}

