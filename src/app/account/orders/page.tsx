"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Package,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileText,
  MessageCircle,
  Truck,
  Search,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

interface OrderItem {
  productId: string;
  slug: string;
  title: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
  customizationDetails?: any;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail?: string | null;
  customerPhone: string;
  createdAt: string;
  status: string;
  statusLabel?: string;
  stageIndex: number;
  grandTotal: number;
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
  items: OrderItem[];
}

export default function CustomerOrdersPage() {
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "DELIVERED">("ALL");
  const [lookupOrderNumber, setLookupOrderNumber] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (user?.id) queryParams.set("userId", user.id);
        if (user?.phone) queryParams.set("phone", user.phone);
        if (user?.email) queryParams.set("email", user.email);

        const res = await fetch(`/api/account/orders?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to load customer orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter((ord) => {
    if (filter === "ACTIVE") {
      return ord.status !== "DELIVERED" && ord.status !== "CANCELLED";
    }
    if (filter === "DELIVERED") {
      return ord.status === "DELIVERED";
    }
    return true;
  });

  const getStatusBadge = (status: string, stageIndex: number) => {
    if (status === "DELIVERED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Delivered
        </span>
      );
    }
    if (status === "DISPATCHED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
          <Truck className="w-3.5 h-3.5 text-blue-600" />
          Dispatched with Courier
        </span>
      );
    }
    if (status === "SLOW_CURING_48H" || stageIndex === 4) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          Stage 4: Workshop Crafting &amp; Finishing
        </span>
      );
    }
    if (status === "PROOF_PENDING" || stageIndex === 2) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          Stage 2: WhatsApp Proof &amp; Date Confirmation
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-sand text-brand-emerald border border-brand-gold/40">
        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
        In Workshop Production
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 w-full space-y-8">
        {/* Header Breadcrumb & Customer Profile Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-sand text-[11px] font-bold text-brand-emerald">
              <Package className="w-3.5 h-3.5 text-brand-gold" />
              <span>Customer Account &amp; Orders</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-emerald">
              {user ? `Namaste, ${user.name}` : "My Orders"}
            </h1>
            <p className="text-xs sm:text-sm text-brand-charcoal/70">
              {user?.email || "Review your custom creations, WhatsApp consultation status, and official GST tax invoices."}
              {user?.phone ? ` • ${user.phone}` : ""}
            </p>
          </div>

          {/* Quick Order Lookup Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (lookupOrderNumber.trim()) {
                window.location.href = `/track/${lookupOrderNumber.trim().toUpperCase()}`;
              }
            }}
            className="w-full md:w-auto flex items-center gap-2 bg-brand-ivory p-1.5 rounded-2xl border border-brand-sand shadow-xs"
          >
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-brand-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order # (ART-...)"
                value={lookupOrderNumber}
                onChange={(e) => setLookupOrderNumber(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-transparent border-0 focus:outline-hidden font-mono uppercase font-bold placeholder:normal-case placeholder:font-sans placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-emerald hover:bg-brand-teal text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1"
            >
              <span>Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Not Authenticated Helper Banner */}
        {!isAuthenticated && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-brand-sand flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-brand-gold shrink-0" />
              <p className="text-xs text-brand-charcoal/80">
                Sign in to view your complete order history, download tax invoices, and connect with the artisan on WhatsApp for proof and delivery coordination.
              </p>
            </div>
            <button
              onClick={() => openAuthModal("LOGIN")}
              className="px-4 py-2 rounded-full bg-brand-emerald text-white text-xs font-bold hover:bg-brand-teal shrink-0 shadow-xs transition-colors"
            >
              Sign In to Account
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-brand-sand/70 pb-3">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === "ALL"
                ? "bg-brand-emerald text-white shadow-xs"
                : "bg-white text-brand-charcoal/70 hover:bg-brand-sand border border-brand-sand"
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter("ACTIVE")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === "ACTIVE"
                ? "bg-brand-emerald text-white shadow-xs"
                : "bg-white text-brand-charcoal/70 hover:bg-brand-sand border border-brand-sand"
            }`}
          >
            In Discussion / Production (
            {orders.filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED").length})
          </button>
          <button
            onClick={() => setFilter("DELIVERED")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              filter === "DELIVERED"
                ? "bg-brand-emerald text-white shadow-xs"
                : "bg-white text-brand-charcoal/70 hover:bg-brand-sand border border-brand-sand"
            }`}
          >
            Delivered ({orders.filter((o) => o.status === "DELIVERED").length})
          </button>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-brand-sand space-y-3">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-brand-charcoal/60">Loading your bespoke creations...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-brand-sand space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-sand flex items-center justify-center text-brand-emerald mx-auto">
              <ShoppingBag className="w-8 h-8 text-brand-teal" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-brand-emerald">No orders found</h3>
              <p className="text-xs text-brand-charcoal/70 max-w-sm mx-auto">
                Looking for an order placed as a guest? Enter your Order Reference number above to track it instantly.
              </p>
            </div>
            <Link
              href="/customize"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold hover:bg-brand-teal transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>Explore 2D Customizer Studio</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-soft space-y-6 hover:border-brand-gold/60 transition-all"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-brand-sand gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                        Order Reference:
                      </span>
                      <span className="font-mono font-bold text-sm text-brand-emerald">
                        {order.orderNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status, order.stageIndex)}
                    <span className="text-base font-serif font-bold text-brand-emerald">
                      ₹{order.grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="divide-y divide-brand-sand/50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-brand-sand shrink-0 shadow-xs"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-sand flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-brand-teal" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-serif text-sm font-bold text-brand-emerald truncate">
                            {item.title}
                          </h4>
                          <span className="text-xs font-mono font-bold text-brand-charcoal shrink-0">
                            ₹{(item.unitPrice * (item.quantity || 1)).toLocaleString("en-IN")}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500">Qty: {item.quantity || 1}</p>

                        {/* Customization Details Chips */}
                        {item.customizationDetails && (
                          <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                            {item.customizationDetails.size && (
                              <span className="px-2 py-0.5 rounded-md bg-brand-sand/70 font-semibold text-brand-charcoal">
                                Size: {item.customizationDetails.size}
                              </span>
                            )}
                            {item.customizationDetails.hasLedBacklight && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 font-semibold text-amber-900 border border-amber-200">
                                ✨ 12V Warm LED Halo
                              </span>
                            )}
                            {item.customizationDetails.typography?.line1 && (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-50 font-semibold text-emerald-800 border border-emerald-200">
                                Text: "{item.customizationDetails.typography.line1}"
                              </span>
                            )}
                            {item.customizationDetails.letter && (
                              <span className="px-2 py-0.5 rounded-md bg-brand-sand/70 font-semibold text-brand-charcoal">
                                Monogram: '{item.customizationDetails.letter}'
                              </span>
                            )}
                            {item.customizationDetails.referenceImage && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-100 font-semibold text-purple-900 border border-purple-200">
                                📎 Inspiration Photo Attached
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Target Delivery Date if requested */}
                {order.neededByDate && (
                  <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-2 text-amber-900 font-medium">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Target Date Requested: <strong>{order.neededByDate}</strong>
                        {order.neededByReason ? ` (Reason: "${order.neededByReason}")` : ""}
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-800 font-bold bg-amber-100/80 px-2.5 py-1 rounded-full">
                      Delivery Date Confirmed on WhatsApp
                    </span>
                  </div>
                )}

                {/* WhatsApp Delivery Date & Price Agreement Notice */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-brand-sand/30 to-white border border-brand-sand flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 text-brand-emerald font-medium">
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Delivery date &amp; final price are agreed 1-on-1 over WhatsApp with our artist.</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-brand-sand shadow-2xs">
                    50% Token Refund Guarantee
                  </span>
                </div>

                {/* Action Toolbar */}
                <div className="pt-2 border-t border-brand-sand flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Primary Order Status Button */}
                    <Link
                      href={`/track/${order.orderNumber}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-emerald text-brand-sand font-bold text-xs hover:bg-brand-teal transition-all shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Order Status &amp; Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* View Invoice */}
                    {order.invoiceId && (
                      <Link
                        href={`/invoices/${order.invoiceId}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-sand hover:bg-brand-sand/80 text-brand-emerald font-semibold text-xs border border-brand-gold/30 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-brand-teal" />
                        <span>GST Tax Invoice</span>
                      </Link>
                    )}
                  </div>

                  {/* Direct WhatsApp Consultation Link */}
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Namaste Artआलय Studio! I am inquiring about my Order #${order.orderNumber} to discuss requirements, price, and delivery date.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chat on WhatsApp (Date &amp; Price)</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

