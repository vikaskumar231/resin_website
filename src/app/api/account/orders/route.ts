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

    const effectiveUserId = queryUserId || (session?.valid ? session.userId : null);
    const effectivePhone = queryPhone || null;
    const effectiveEmail = queryEmail || null;

    let orders = [];

    if (effectiveUserId || effectivePhone || effectiveEmail) {
      orders = orderRepository.getOrdersForUser({
        userId: effectiveUserId,
        phone: effectivePhone,
        email: effectiveEmail,
      });
    } else if (session?.valid && session.role === "ARTISAN_ADMIN") {
      orders = orderRepository.getAllOrders();
    } else {
      // Default fallback: return demo patron orders if generic customer is browsing
      orders = orderRepository.getOrdersForUser({
        userId: "user_cust_priya_01",
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
