import { NextRequest, NextResponse } from "next/server";
import { orderRepository } from "@/lib/repositories/orderRepository";

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

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("[orders/track] Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order tracking details" },
      { status: 500 }
    );
  }
}

