import { NextRequest, NextResponse } from "next/server";
import { orderRepository } from "@/lib/repositories/orderRepository";
import { verifySessionToken } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get("userId");
    const queryPhone = searchParams.get("phone");
    const queryEmail = searchParams.get("email");

    // Check optional authenticated session
    const sessionCookie = req.cookies.get("art_aalay_session")?.value;
    const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;

    let orders = [];

    if (session?.valid && session.role === "ARTISAN_ADMIN") {
      // Admin: Can query specific user or fetch all orders
      if (queryUserId || queryPhone || queryEmail) {
        orders = orderRepository.getOrdersForUser({
          userId: queryUserId || null,
          phone: queryPhone || null,
          email: queryEmail || null,
        });
      } else {
        orders = orderRepository.getAllOrders();
      }
    } else if (session?.valid && session.userId) {
      // Authenticated Customer: Strictly bounded to their own verified identity (IDOR Prevention)
      orders = orderRepository.getOrdersForUser({
        userId: session.userId,
        phone: queryPhone || null,
        email: queryEmail || null,
      });
    } else {
      // Unauthenticated visitor: Do NOT disclose customer orders or PII
      return NextResponse.json({
        success: true,
        orders: [],
        count: 0,
        requireLogin: true,
        message: "Sign in to view your personalized order history.",
      });
    }

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (error: any) {
    console.error("[account/orders] Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
