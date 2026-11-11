import { NextRequest, NextResponse } from "next/server";
import { orderRepository } from "@/lib/repositories/orderRepository";
import { verifySessionToken } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    orderNumber: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { orderNumber } = params;
    if (!orderNumber) {
      return NextResponse.json({ error: "Order number is required" }, { status: 400 });
    }

    const order = orderRepository.getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json(
        { error: `Order #${orderNumber} not found in workshop registry.` },
        { status: 404 }
      );
    }

    // Privacy Shield: Mask personal contact details (street, phone, email) for public tracking viewers
    const sessionCookie = req.cookies.get("art_aalay_session")?.value;
    const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;
    const isPrivileged = session?.valid && (session.role === "ARTISAN_ADMIN" || (order.userId && session.userId === order.userId));

    const sanitizedOrder = isPrivileged
      ? order
      : {
          ...order,
          customerPhone: order.customerPhone ? order.customerPhone.replace(/(\d{2})\d+(\d{2})/, "$1••••••$2") : "",
          customerEmail: order.customerEmail ? order.customerEmail.replace(/^(.{2})(.*)(@.*)$/, "$1••••$3") : null,
          shippingAddress: order.shippingAddress
            ? {
                ...order.shippingAddress,
                street: "•••••••• [Masked for Privacy]",
                phone: order.shippingAddress.phone ? order.shippingAddress.phone.replace(/(\d{2})\d+(\d{2})/, "$1••••••$2") : "",
              }
            : undefined,
        };

    return NextResponse.json({
      success: true,
      order: sanitizedOrder,
    });
  } catch (error: any) {
    console.error("[orders/track] Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order tracking details" },
      { status: 500 }
    );
  }
}

