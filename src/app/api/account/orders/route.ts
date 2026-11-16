import { NextRequest, NextResponse } from "next/server";
import { orderRepository } from "@/lib/repositories/orderRepository";
import { verifySessionToken } from "@/lib/auth/session";
import { userRepository } from "@/lib/repositories/userRepository";

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
      // Authenticated Customer: STRICT ENFORCEMENT - ALWAYS use verified session.userId
      const activeUserId = session.userId;

      // Load user profile to enrich contact points for seamless back-linking
      const allUsers = await userRepository.getAll();
      const currentUser = allUsers.find((u) => u.id === activeUserId);

      const effectivePhone = currentUser?.phone || null;
      const effectiveEmail = currentUser?.email || null;
      const effectiveName = currentUser?.name || null;

      orders = orderRepository.getOrdersForUser({
        userId: activeUserId,
        phone: effectivePhone,
        email: effectiveEmail,
        name: effectiveName,
      });

      // Auto-claim: If any unassigned guest order belongs to this customer, back-link userId
      if (activeUserId) {
        let hasUpdates = false;
        for (const order of orders) {
          if (!order.userId) {
            order.userId = activeUserId;
            if (order.items) {
              order.items.forEach((it) => {
                if (!it.userId) it.userId = activeUserId;
              });
            }
            hasUpdates = true;
          }
        }
        if (hasUpdates) {
          for (const order of orders) {
            orderRepository.saveOrder(order);
          }
        }
      }
    } else {
      // Unauthenticated visitor: STRICT SECURITY GATE - Disclose ZERO orders or PII
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
