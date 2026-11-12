import fs from "fs";
import path from "path";
import { atomicWriteJsonSync } from "@/lib/utils/atomicFileWrite";

export interface OrderItemRecord {
  productId: string;
  slug?: string;
  productSlug?: string;
  title: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
  customizationDetails?: any;
  userId?: string | null;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  createdAt: string;
  status:
    | "ORDER_CONFIRMED"
    | "PROOF_PENDING"
    | "PROOF_APPROVED"
    | "IN_PRODUCTION"
    | "SLOW_CURING_48H"
    | "FINISHING_QC"
    | "DISPATCHED"
    | "DELIVERED"
    | "CANCELLED";
  statusLabel?: string;
  stageIndex: number;
  grandTotal: number;
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  giftWrapFee?: number;
  isTokenDeposit?: boolean;
  tokenAmountPaid?: number;
  remainingTentativeBalance?: number;
  refundPolicyNotes?: string;
  invoiceId?: string;
  neededByDate?: string | null;
  neededByReason?: string | null;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  curingTelemetry?: {
    temperature: string;
    humidity: string;
    timeRemaining: string;
  };
  courier?: {
    partner: string;
    awb: string;
    trackingUrl: string;
  };
  paymentDetails?: {
    method?: string;
    status?: "PENDING" | "PAID" | "REFUNDED" | "PENDING_OFFLINE" | "SETTLED_OFFLINE";
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    paidAt?: string;
    offlineNotes?: string;
  };
  items: OrderItemRecord[];
}

const ORDERS_FILE = path.join(process.cwd(), "src", "data", "orders.json");

function ensureFile(): void {
  try {
    const dir = path.dirname(ORDERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(ORDERS_FILE)) {
      fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (err: any) {
    if (err.code !== "EROFS") {
      console.warn("[orderRepository] ensureFile non-critical warning:", err.message);
    }
  }
}

function readOrdersFromDisk(): OrderRecord[] {
  try {
    ensureFile();
    const content = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(content || "[]");
  } catch (err) {
    console.error("[orderRepository] Failed to read orders from disk:", err);
    return [];
  }
}

function writeOrdersToDisk(orders: OrderRecord[]): void {
  try {
    ensureFile();
    atomicWriteJsonSync(ORDERS_FILE, orders);
  } catch (err) {
    console.error("[orderRepository] Failed to atomically write orders to disk:", err);
  }
}

export const orderRepository = {
  getAllOrders(): OrderRecord[] {
    return readOrdersFromDisk();
  },

  getOrderByNumber(orderNumber: string): OrderRecord | null {
    const orders = readOrdersFromDisk();
    const cleanNum = orderNumber.trim().toUpperCase();
    return orders.find((o) => o.orderNumber.toUpperCase() === cleanNum) || null;
  },

  getOrdersForUser(criteria: {
    userId?: string | null;
    phone?: string | null;
    email?: string | null;
  }): OrderRecord[] {
    const orders = readOrdersFromDisk();
    const { userId, phone, email } = criteria;

    const cleanPhone = phone ? phone.replace(/\D/g, "").slice(-10) : "";
    const cleanEmail = email ? email.trim().toLowerCase() : "";

    return orders.filter((o) => {
      // 1. Direct userId match on order OR linked order item
      if (userId) {
        if (o.userId === userId) return true;
        if (o.items && o.items.some((it) => it.userId === userId)) return true;
      }

      // 2. Phone match (last 10 digits)
      if (cleanPhone && o.customerPhone) {
        const orderPhoneClean = o.customerPhone.replace(/\D/g, "").slice(-10);
        if (orderPhoneClean && orderPhoneClean === cleanPhone) return true;
      }

      // 3. Email match
      if (cleanEmail && o.customerEmail) {
        if (o.customerEmail.trim().toLowerCase() === cleanEmail) return true;
      }

      return false;
    });
  },

  saveOrder(orderData: Partial<OrderRecord>): OrderRecord {
    const orders = readOrdersFromDisk();
    const now = new Date().toISOString();

    const orderNumber = orderData.orderNumber || `ART-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const id = orderData.id || `ord_${Date.now()}`;

    const newRecord: OrderRecord = {
      id,
      orderNumber,
      userId: orderData.userId || null,
      customerName: orderData.customerName || "Artisan Patron",
      customerEmail: orderData.customerEmail || null,
      customerPhone: orderData.customerPhone || "",
      createdAt: orderData.createdAt || now,
      status: orderData.status || "ORDER_CONFIRMED",
      statusLabel: orderData.statusLabel || "Stage 1: Laser Cutting & Timber Prep",
      stageIndex: orderData.stageIndex ?? 1,
      grandTotal: orderData.grandTotal || 0,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shippingFee: orderData.shippingFee,
      giftWrapFee: orderData.giftWrapFee,
      isTokenDeposit: orderData.isTokenDeposit ?? false,
      tokenAmountPaid: orderData.tokenAmountPaid ?? 0,
      remainingTentativeBalance: orderData.remainingTentativeBalance ?? orderData.grandTotal ?? 0,
      refundPolicyNotes: orderData.refundPolicyNotes || "Payment handled offline directly with the artisan (Cash / Direct UPI on Delivery).",
      invoiceId: orderData.invoiceId || `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      neededByDate: orderData.neededByDate || null,
      neededByReason: orderData.neededByReason || null,
      shippingAddress: orderData.shippingAddress || {
        fullName: orderData.customerName || "Patron",
        phone: orderData.customerPhone || "",
        street: "Studio Address",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411045",
      },
      curingTelemetry: orderData.curingTelemetry || {
        temperature: "26°C",
        humidity: "42%",
        timeRemaining: "Chemical cure in progress",
      },
      courier: orderData.courier,
      paymentDetails: orderData.paymentDetails,
      items: (orderData.items || []).map((item) => ({
        ...item,
        userId: item.userId !== undefined ? item.userId : (orderData.userId || null),
      })),
    };

    const existingIndex = orders.findIndex((o) => o.orderNumber === orderNumber);
    if (existingIndex >= 0) {
      const existing = orders[existingIndex];
      const mergedUserId = orderData.userId !== undefined ? (orderData.userId || null) : existing.userId;
      orders[existingIndex] = {
        ...existing,
        ...newRecord,
        userId: mergedUserId,
        items: orderData.items
          ? orderData.items.map((item) => ({
              ...item,
              userId: item.userId !== undefined ? item.userId : (mergedUserId || null),
            }))
          : existing.items.map((item) => ({
              ...item,
              userId: item.userId !== undefined ? item.userId : (mergedUserId || null),
            })),
      };
    } else {
      orders.unshift(newRecord);
    }

    writeOrdersToDisk(orders);
    return newRecord;
  },

  getOrderItemsForUser(userId: string): OrderItemRecord[] {
    if (!userId) return [];
    const userOrders = this.getOrdersForUser({ userId });
    const items: OrderItemRecord[] = [];
    for (const order of userOrders) {
      for (const item of order.items || []) {
        if (item.userId === userId || (!item.userId && order.userId === userId)) {
          items.push(item);
        }
      }
    }
    return items;
  },
};

