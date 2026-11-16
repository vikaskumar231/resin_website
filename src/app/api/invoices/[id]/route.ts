import { NextRequest, NextResponse } from "next/server";
import { orderRepository } from "@/lib/repositories/orderRepository";
import { verifySessionToken } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Invoice or Order identifier is required" }, { status: 400 });
    }

    const order = orderRepository.getOrderByInvoiceId(id);
    if (!order) {
      return NextResponse.json(
        { error: `Order receipt #${id} not found in workshop registry.` },
        { status: 404 }
      );
    }

    // Verify session for privacy protection
    const sessionCookie = req.cookies.get("art_aalay_session")?.value;
    const session = sessionCookie ? await verifySessionToken(sessionCookie) : null;

    const isAuthorized =
      Boolean(session?.valid) &&
      (session?.role === "ARTISAN_ADMIN" || Boolean(order.userId && session?.userId === order.userId));

    const maskedName = order.customerName
      ? `${order.customerName.charAt(0)}•••• ${order.customerName.split(" ")[1]?.charAt(0) || ""}•••• [Masked for Privacy]`
      : "Artisan Patron [Masked]";

    const buyer = isAuthorized
      ? {
          name: order.customerName || "Artisan Patron",
          street: order.shippingAddress?.street || "Workshop Registered Address",
          city: order.shippingAddress?.city || "Pune",
          state: order.shippingAddress?.state || "Maharashtra",
          pincode: order.shippingAddress?.pincode || "411045",
          phone: order.customerPhone || order.shippingAddress?.phone || "+91 9373567492",
          email: order.customerEmail || null,
        }
      : {
          name: maskedName,
          street: "•••••••• [Masked for Privacy]",
          city: order.shippingAddress?.city || "Pune",
          state: order.shippingAddress?.state || "Maharashtra",
          pincode: order.shippingAddress?.pincode ? `${order.shippingAddress.pincode.slice(0, 2)}••••` : "41••••",
          phone: order.customerPhone
            ? order.customerPhone.replace(/(\d{2})\d+(\d{2})/, "$1••••••$2")
            : "+91 ••••••••••",
          email: order.customerEmail
            ? order.customerEmail.replace(/^(.{2})(.*)(@.*)$/, "$1••••$3")
            : null,
        };

    const receipt = {
      receiptNumber: order.invoiceId || (id.startsWith("INV-") ? id : `REC-${id}`),
      orderNumber: order.orderNumber,
      date: new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      seller: {
        brandName: "Artआलय Artisanal Works",
        address: "Survey No. 42, Artisan Studio Park, Baner, Pune, Maharashtra - 411045",
        email: "care@artaalay.com",
        whatsapp: "+91 93735 67492",
      },
      buyer,
      items: (order.items || []).map((item, idx) => ({
        id: idx + 1,
        description: item.title,
        craftDetails: item.customizationDetails
          ? Object.entries(item.customizationDetails)
              .filter(([k, v]) => v && typeof v === "string" && !k.toLowerCase().includes("id"))
              .map(([k, v]) => `${k}: ${v}`)
              .join(" • ")
          : "Handcrafted resin piece with premium natural pigments and optical clarity",
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        total: (item.unitPrice || 0) * (item.quantity || 1),
      })),
      summary: {
        subtotal: order.subtotal || order.grandTotal,
        discount: order.discount || 0,
        shippingFee: order.shippingFee || 0,
        giftWrapFee: order.giftWrapFee || 0,
        grandTotal: order.grandTotal,
        paymentMethod:
          order.paymentDetails?.method === "OFFLINE_SETTLEMENT"
            ? "Offline Settlement (Cash / Direct UPI on Delivery or WhatsApp)"
            : order.paymentDetails?.method || "Offline Settlement",
        paymentStatus:
          order.paymentDetails?.status === "SETTLED_OFFLINE"
            ? "Settled Offline (Verified by Artisan)"
            : "Pending Offline Settlement",
      },
      isAuthorized,
      isMasked: !isAuthorized,
    };

    return NextResponse.json({
      success: true,
      receipt,
    });
  } catch (error: any) {
    console.error("[api/invoices] Error generating invoice data:", error);
    return NextResponse.json(
      { error: "Failed to generate order receipt" },
      { status: 500 }
    );
  }
}
