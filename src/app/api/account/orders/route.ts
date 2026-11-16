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
    } else if ((session?.valid && session.userId) || queryUserId || queryPhone || queryEmail) {
      // Authenticated Customer: Match by verified session ID, or client-supplied contact credentials
      const activeUserId = session?.valid ? session.userId : (queryUserId || null);

      // Load user profile to enrich contact points for seamless back-linking
      const allUsers = await userRepository.getAll();
      const currentUser = activeUserId ? allUsers.find((u) => u.id === activeUserId) : null;

      const effectivePhone = currentUser?.phone || queryPhone || null;
      const effectiveEmail = currentUser?.email || queryEmail || null;
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
      // Unauthenticated visitor with zero query credentials: Do NOT disclose customer orders or PII
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
