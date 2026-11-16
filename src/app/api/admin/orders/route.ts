import { NextRequest, NextResponse } from "next/server";
import { orderRepository, OrderRecord } from "@/lib/repositories/orderRepository";
import { verifyAdminSession } from "@/lib/auth/adminGuard";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.isAuthorized) {
      return (
        auth.errorResponse ||
        NextResponse.json(
          { error: "Unauthorized. Artisan Administrator role required." },
          { status: 401 }
        )
      );
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "active"; // active | completed | all
    const query = (searchParams.get("search") || "").trim().toLowerCase();

    const allOrders = orderRepository.getAllOrders();

    const activeOrders = allOrders.filter(
      (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
    );
    const completedOrders = allOrders.filter(
      (o) => o.status === "DELIVERED" || o.paymentDetails?.status === "SETTLED_OFFLINE"
    );

    let filtered: OrderRecord[] = [];
    if (filter === "completed") {
      filtered = completedOrders;
    } else if (filter === "all") {
      filtered = allOrders;
    } else {
      // default: active
      filtered = activeOrders;
    }

    if (query) {
      filtered = filtered.filter((o) => {
        const orderNum = (o.orderNumber || "").toLowerCase();
        const custName = (o.customerName || "").toLowerCase();
        const custPhone = (o.customerPhone || "").toLowerCase();
        const custEmail = (o.customerEmail || "").toLowerCase();
        const invoiceId = (o.invoiceId || "").toLowerCase();
        return (
          orderNum.includes(query) ||
          custName.includes(query) ||
          custPhone.includes(query) ||
          custEmail.includes(query) ||
          invoiceId.includes(query)
        );
      });
    }

    return NextResponse.json({
      success: true,
      filter,
      orders: filtered,
      counts: {
        active: activeOrders.length,
        completed: completedOrders.length,
        all: allOrders.length,
      },
    });
  } catch (err: any) {
    console.error("[api/admin/orders] Error fetching orders:", err);
    return NextResponse.json(
      { error: "Failed to retrieve orders from repository", details: err.message },
      { status: 500 }
    );
  }
}
