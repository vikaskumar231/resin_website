import { NextRequest, NextResponse } from "next/server";
import { orderRepository, OrderRecord } from "@/lib/repositories/orderRepository";
import { verifyAdminSession } from "@/lib/auth/adminGuard";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    id: string;
  };
}

const VALID_STATUSES = [
  "ORDER_CONFIRMED",
  "PROOF_PENDING",
  "DESIGN_DISCUSSION",
  "PROOF_APPROVED",
  "IN_PRODUCTION",
  "SLOW_CURING_48H",
  "FINISHING_QC",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
] as const;

export async function PATCH(req: NextRequest, { params }: RouteParams) {
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

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Order ID or Reference Number is required" }, { status: 400 });
    }

    const body = await req.json();
    const {
      status,
      statusLabel,
      stageIndex,
      paymentStatus,
      offlineNotes,
      courier,
      neededByDate,
      neededByReason,
    } = body;

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status '${status}'. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    // Build updates payload
    const updates: Parameters<typeof orderRepository.updateOrderStatus>[1] = {};

    if (status !== undefined) {
      updates.status = status;
    }

    if (statusLabel !== undefined) {
      updates.statusLabel = String(statusLabel).replace(/[<>]/g, "").trim().substring(0, 300);
    }

    if (stageIndex !== undefined) {
      updates.stageIndex = Number(stageIndex) || 1;
    }

    if (neededByDate !== undefined) {
      updates.neededByDate = neededByDate;
    }

    if (neededByReason !== undefined) {
      updates.neededByReason = neededByReason ? String(neededByReason).replace(/[<>]/g, "").trim() : null;
    }

    if (courier !== undefined) {
      updates.courier = {
        partner: courier.partner ? String(courier.partner).replace(/[<>]/g, "").trim() : "Shiprocket",
        awb: courier.awb ? String(courier.awb).replace(/[<>]/g, "").trim() : "",
        trackingUrl: courier.trackingUrl
          ? String(courier.trackingUrl).trim()
          : courier.awb
          ? `https://shiprocket.co/tracking/${courier.awb}`
          : "https://shiprocket.co",
      };
    }

    if (paymentStatus !== undefined || offlineNotes !== undefined) {
      updates.paymentDetails = {
        status: paymentStatus || "PENDING_OFFLINE",
        offlineNotes: offlineNotes ? String(offlineNotes).replace(/[<>]/g, "").trim() : undefined,
        paidAt: paymentStatus === "SETTLED_OFFLINE" ? new Date().toISOString() : undefined,
      };
    }

    const updated = orderRepository.updateOrderStatus(id, updates);

    if (!updated) {
      return NextResponse.json(
        { error: `Order #${id} not found in workshop registry.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order #${updated.orderNumber} status updated to '${updated.status}' successfully.`,
      order: updated,
    });
  } catch (err: any) {
    console.error("[api/admin/orders/[id]] Error updating order:", err);
    return NextResponse.json(
      { error: "Failed to update order status", details: err.message },
      { status: 500 }
    );
  }
}
