"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { OrderRecord } from "@/lib/repositories/orderRepository";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MessageCircle,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Crown,
  FileText,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  IndianRupee,
  Layers,
  ArrowRight,
  Send,
  X,
  Edit3,
  Lock,
} from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  ORDER_CONFIRMED: {
    label: "Order Confirmed",
    bg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-300",
    icon: Sparkles,
  },
  PROOF_PENDING: {
    label: "WhatsApp Proofing",
    bg: "bg-purple-50",
    text: "text-purple-900",
    border: "border-purple-300",
    icon: MessageCircle,
  },
  DESIGN_DISCUSSION: {
    label: "Design Consultation",
    bg: "bg-amber-50",
    text: "text-amber-900",
    border: "border-amber-300",
    icon: MessageCircle,
  },
  PROOF_APPROVED: {
    label: "Proof Approved",
    bg: "bg-emerald-50",
    text: "text-emerald-900",
    border: "border-emerald-300",
    icon: CheckCircle2,
  },
  IN_PRODUCTION: {
    label: "In Studio Crafting",
    bg: "bg-amber-100/70",
    text: "text-amber-900",
    border: "border-amber-400",
    icon: Layers,
  },
  SLOW_CURING_48H: {
    label: "Resin Curing",
    bg: "bg-teal-50",
    text: "text-teal-900",
    border: "border-teal-300",
    icon: Clock,
  },
  FINISHING_QC: {
    label: "Finishing & QC",
    bg: "bg-indigo-50",
    text: "text-indigo-900",
    border: "border-indigo-300",
    icon: ShieldCheck,
  },
  DISPATCHED: {
    label: "Dispatched",
    bg: "bg-blue-50",
    text: "text-blue-900",
    border: "border-blue-300",
    icon: Truck,
  },
  DELIVERED: {
    label: "Delivered",
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-400",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-900",
    border: "border-red-300",
    icon: AlertCircle,
  },
};

export default function AdminActiveOrdersPage() {
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Status Update Modal State
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [modalStatus, setModalStatus] = useState<string>("ORDER_CONFIRMED");
  const [modalStatusLabel, setModalStatusLabel] = useState<string>("");
  const [modalPaymentStatus, setModalPaymentStatus] = useState<string>("PENDING_OFFLINE");
  const [modalOfflineNotes, setModalOfflineNotes] = useState<string>("");
  const [modalCourierPartner, setModalCourierPartner] = useState<string>("Shiprocket Express");
  const [modalCourierAwb, setModalCourierAwb] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isArtisanAdmin = user?.role === "ARTISAN_ADMIN";

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchActiveOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders?filter=active", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else if (res.status === 401) {
        showToast("⚠️ Unauthorized: Please sign in as Artisan Administrator.");
      }
    } catch (err: any) {
      console.error("Failed to load active orders:", err);
      showToast("⚠️ Network error loading active orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();
  }, [user]);

  const openStatusModal = (ord: OrderRecord) => {
    setSelectedOrder(ord);
    setModalStatus(ord.status);
    setModalStatusLabel(ord.statusLabel || "");
    setModalPaymentStatus(ord.paymentDetails?.status || "PENDING_OFFLINE");
    setModalOfflineNotes(ord.paymentDetails?.offlineNotes || "");
    setModalCourierPartner(ord.courier?.partner || "Shiprocket Express");
    setModalCourierAwb(ord.courier?.awb || "");
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: modalStatus,
          statusLabel: modalStatusLabel,
          paymentStatus: modalPaymentStatus,
          offlineNotes: modalOfflineNotes,
          courier:
            modalStatus === "DISPATCHED" || modalStatus === "DELIVERED"
              ? {
                  partner: modalCourierPartner,
                  awb: modalCourierAwb,
                  trackingUrl: modalCourierAwb ? `https://shiprocket.co/tracking/${modalCourierAwb}` : "",
                }
              : undefined,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success && data.order) {
        showToast(`✅ Order #${data.order.orderNumber} status updated to '${data.order.status}'.`);
        setSelectedOrder(null);
        fetchActiveOrders();
      } else {
        showToast(`⚠️ Failed to update: ${data.error || "Server error"}`);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      showToast(`⚠️ Error updating order: ${err.message}`);
    }
  };

  const handleQuickCompleteAndSettle = async (ord: OrderRecord) => {
    const confirmed = window.confirm(
      `Mark Order #${ord.orderNumber} as DELIVERED and 100% SETTLED OFFLINE?\n\nThis will archive the creation into the Completed Orders Report.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/orders/${ord.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "DELIVERED",
          statusLabel: "Handcrafted piece delivered & settled with patron.",
          paymentStatus: "SETTLED_OFFLINE",
          offlineNotes: `Settled in full (₹${ord.grandTotal}) via Offline Cash/UPI.`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(`🎉 Order #${ord.orderNumber} completed & settled offline! Moved to Completed Report.`);
        fetchActiveOrders();
      } else {
        showToast(`⚠️ Failed: ${data.error || "Server error"}`);
      }
    } catch (err: any) {
      showToast(`⚠️ Error completing order: ${err.message}`);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const totalActive = orders.length;
    const discussionPending = orders.filter(
      (o) => o.status === "ORDER_CONFIRMED" || o.status === "PROOF_PENDING" || o.status === "DESIGN_DISCUSSION"
    ).length;
    const inCrafting = orders.filter(
      (o) => o.status === "IN_PRODUCTION" || o.status === "SLOW_CURING_48H" || o.status === "FINISHING_QC"
    ).length;
    const dispatched = orders.filter((o) => o.status === "DISPATCHED").length;
    const totalPendingRevenue = orders.reduce((acc, o) => acc + (o.grandTotal || 0), 0);

    return { totalActive, discussionPending, inCrafting, dispatched, totalPendingRevenue };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Status Filter
      if (statusFilter === "DISCUSSION") {
        if (!["ORDER_CONFIRMED", "PROOF_PENDING", "DESIGN_DISCUSSION"].includes(ord.status)) {
          return false;
        }
      } else if (statusFilter === "CRAFTING") {
        if (!["IN_PRODUCTION", "SLOW_CURING_48H", "FINISHING_QC"].includes(ord.status)) {
          return false;
        }
      } else if (statusFilter === "DISPATCHED") {
        if (ord.status !== "DISPATCHED") return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const num = (ord.orderNumber || "").toLowerCase();
        const name = (ord.customerName || "").toLowerCase();
        const phone = (ord.customerPhone || "").toLowerCase();
        return num.includes(q) || name.includes(q) || phone.includes(q);
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Strict RBAC Guard: Require ARTISAN_ADMIN role
  if (!isAuthenticated || !isArtisanAdmin) {
    return (
      <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
        <Navbar />
        <main className="flex-1 py-16 max-w-2xl mx-auto px-4 sm:px-6 w-full text-center flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 text-amber-800 flex items-center justify-center shadow-md">
            <Lock className="w-8 h-8 text-amber-700" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              Security &amp; RBAC Access Gate
            </span>
            <h1 className="text-3xl font-serif font-bold text-brand-emerald">
              Artisan Administrator Login Required
            </h1>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 max-w-md mx-auto">
              Workshop active order management contains customer fulfillment records and manual production controls. Please sign in with an artisan administrator account.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => openAuthModal("LOGIN")}
              className="px-7 py-3 rounded-full bg-brand-emerald hover:bg-brand-teal text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Sign In as Artisan Lead
            </button>
            <Link
              href="/"
              className="px-7 py-3 rounded-full bg-brand-sand hover:bg-white border border-brand-sand text-brand-charcoal font-semibold text-xs transition-all"
            >
              Return to Storefront
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-brand-emerald text-white font-medium text-xs shadow-2xl border border-brand-gold/50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-8">
        {/* Navigation Breadcrumb & Admin Suite Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-sand">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider">
                Artisan Workshop Operations
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-sand text-[11px] font-bold text-brand-emerald border border-brand-gold/30">
                <Crown className="w-3 h-3 text-brand-gold" />
                Artisan Admin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-emerald">
              Active Orders &amp; Status Management
            </h1>
            <p className="text-xs text-brand-charcoal/70">
              Orders currently in discussion, studio crafting, or transit. Update status manually for patrons.
            </p>
          </div>

          {/* Module Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="px-4 py-2 rounded-full bg-brand-emerald text-white shadow-xs">
              Active Orders ({orders.length})
            </span>
            <Link
              href="/admin/orders/completed"
              className="px-4 py-2 rounded-full bg-white text-brand-charcoal hover:bg-brand-sand border border-brand-sand transition-all flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-brand-teal" />
              <span>Completed Orders Report</span>
            </Link>
            <Link
              href="/admin/products"
              className="px-4 py-2 rounded-full bg-white text-brand-charcoal hover:bg-brand-sand border border-brand-sand transition-all"
            >
              Catalog CMS
            </Link>
          </div>
        </div>



        {/* Executive KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white border border-brand-sand shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Active Unsettled
            </span>
            <p className="text-2xl font-serif font-bold text-brand-emerald">{metrics.totalActive}</p>
            <span className="text-[10px] text-slate-500">Awaiting completion</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-brand-sand shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-purple-600 block tracking-wider">
              Discussion Pending
            </span>
            <p className="text-2xl font-serif font-bold text-purple-900">{metrics.discussionPending}</p>
            <span className="text-[10px] text-purple-700/80">WhatsApp proofing</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-brand-sand shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-600 block tracking-wider">
              In Handcrafting
            </span>
            <p className="text-2xl font-serif font-bold text-amber-900">{metrics.inCrafting}</p>
            <span className="text-[10px] text-amber-700/80">Pouring, curing &amp; QC</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-brand-sand shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-600 block tracking-wider">
              In Transit
            </span>
            <p className="text-2xl font-serif font-bold text-blue-900">{metrics.dispatched}</p>
            <span className="text-[10px] text-blue-700/80">Dispatched with courier</span>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-brand-sand/50 border border-brand-gold/40 shadow-2xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">
              Pending Offline Revenue
            </span>
            <p className="text-xl sm:text-2xl font-serif font-bold text-brand-emerald">
              ₹{metrics.totalPendingRevenue.toLocaleString("en-IN")}
            </p>
            <span className="text-[10px] text-emerald-900/80">Payable on Delivery / Proof</span>
          </div>
        </div>

        {/* Search & Sub-Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-brand-sand shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, Patron Name, Mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-brand-sand/40 border border-brand-sand text-xs focus:outline-none focus:border-brand-emerald"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sub-Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold w-full md:w-auto">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                statusFilter === "ALL"
                  ? "bg-brand-emerald text-white shadow-xs"
                  : "bg-brand-sand/50 text-brand-charcoal/70 hover:bg-brand-sand"
              }`}
            >
              All Active ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter("DISCUSSION")}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                statusFilter === "DISCUSSION"
                  ? "bg-brand-emerald text-white shadow-xs"
                  : "bg-brand-sand/50 text-brand-charcoal/70 hover:bg-brand-sand"
              }`}
            >
              Discussion ({metrics.discussionPending})
            </button>
            <button
              onClick={() => setStatusFilter("CRAFTING")}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                statusFilter === "CRAFTING"
                  ? "bg-brand-emerald text-white shadow-xs"
                  : "bg-brand-sand/50 text-brand-charcoal/70 hover:bg-brand-sand"
              }`}
            >
              Studio Crafting ({metrics.inCrafting})
            </button>
            <button
              onClick={() => setStatusFilter("DISPATCHED")}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                statusFilter === "DISPATCHED"
                  ? "bg-brand-emerald text-white shadow-xs"
                  : "bg-brand-sand/50 text-brand-charcoal/70 hover:bg-brand-sand"
              }`}
            >
              Dispatched ({metrics.dispatched})
            </button>

            <button
              onClick={fetchActiveOrders}
              title="Refresh Orders"
              className="p-2 rounded-full bg-brand-sand hover:bg-brand-sand/80 text-brand-emerald transition-all ml-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Orders List */}
        {loading ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-brand-sand space-y-3 shadow-soft">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading active workshop orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-brand-sand space-y-4 shadow-soft">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-brand-emerald">
                No active orders matching this filter
              </h3>
              <p className="text-xs text-brand-charcoal/70 max-w-sm mx-auto">
                All workshop creations may be settled, or try clearing your search query.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((ord) => {
              const statusMeta = STATUS_CONFIG[ord.status] || STATUS_CONFIG.ORDER_CONFIRMED;
              const StatusIcon = statusMeta.icon;
              const cleanPhone = (ord.customerPhone || "").replace(/\D/g, "").slice(-10);
              const whatsappLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                `Namaste ${ord.customerName}! This is Artआलय Studio following up on your Order #${ord.orderNumber}.`
              )}`;

              return (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-soft space-y-6 hover:border-brand-gold/60 transition-all"
                >
                  {/* Card Header: Order #, Status Badge, Pricing */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-brand-sand">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-base sm:text-lg text-brand-emerald">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusMeta.label}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Placed on{" "}
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">
                          Tentative Total
                        </span>
                        <span className="text-lg font-serif font-bold text-brand-emerald">
                          ₹{ord.grandTotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                        {ord.paymentDetails?.status || "PENDING_OFFLINE"}
                      </span>
                    </div>
                  </div>

                  {/* Patron Details & WhatsApp Bridge */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-brand-sand/40 text-xs border border-brand-sand/60">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Patron</span>
                      <p className="font-bold text-brand-emerald text-sm">{ord.customerName}</p>
                      {ord.customerEmail && <p className="text-slate-500 text-[11px]">{ord.customerEmail}</p>}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Contact &amp; Delivery</span>
                      <p className="font-bold text-brand-charcoal">{ord.customerPhone}</p>
                      <p className="text-slate-500 text-[11px]">
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state} ({ord.shippingAddress?.pincode})
                      </p>
                    </div>

                    <div className="flex flex-col justify-center items-start md:items-end gap-1.5">
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-brand-gold" />
                        <span>Chat on WhatsApp</span>
                        <ExternalLink className="w-3 h-3 text-white/80" />
                      </a>
                      <span className="text-[10px] text-slate-500">1-on-1 Artist Bridge</span>
                    </div>
                  </div>

                  {/* Customer Requested Target Occasion Date */}
                  {ord.neededByDate && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-2 text-amber-900 font-medium">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>
                          Customer Target Date: <strong>{ord.neededByDate}</strong>
                          {ord.neededByReason ? ` (Occasion: "${ord.neededByReason}")` : ""}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-800 font-bold bg-amber-100/90 px-2.5 py-1 rounded-full">
                        Offline Date Confirmation
                      </span>
                    </div>
                  )}

                  {/* Public Status Note (Shown to Customer on Tracking Screen) */}
                  <div className="p-3.5 rounded-2xl bg-white border border-brand-sand flex items-start gap-3 text-xs">
                    <Sparkles className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                    <div className="space-y-0.5 flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Customer-Facing Status Note (Shown on Tracking Screen)
                      </span>
                      <p className="text-brand-charcoal font-medium">
                        {ord.statusLabel || "Order confirmed. WhatsApp discussion pending with artist."}
                      </p>
                    </div>
                  </div>

                  {/* Courier Details (if Dispatched) */}
                  {ord.courier?.awb && (
                    <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-blue-700 shrink-0" />
                        <div>
                          <p className="font-bold text-blue-900">
                            {ord.courier.partner} • AWB: {ord.courier.awb}
                          </p>
                        </div>
                      </div>
                      {ord.courier.trackingUrl && (
                        <a
                          href={ord.courier.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline"
                        >
                          <span>Live Tracking</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Items in this Order */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Ordered Resin Creations ({ord.items.length})
                    </span>
                    <div className="divide-y divide-brand-sand/50">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                          <div>
                            <p className="font-bold text-brand-emerald">{item.title}</p>
                            <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                            {item.customizationDetails && (
                              <p className="text-[10px] text-slate-600 line-clamp-1">
                                Specs: {JSON.stringify(item.customizationDetails).replace(/["{}]/g, " ")}
                              </p>
                            )}
                          </div>
                          <span className="font-mono font-bold text-brand-charcoal">
                            ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Admin Action Toolbar */}
                  <div className="pt-4 border-t border-brand-sand flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/track/${ord.orderNumber}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-sand/70 hover:bg-brand-sand text-brand-emerald font-bold text-xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-brand-teal" />
                        <span>View Tracking Page</span>
                      </Link>

                      {ord.invoiceId && (
                        <Link
                          href={`/invoices/${ord.invoiceId}`}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-brand-sand text-brand-emerald font-bold text-xs border border-brand-sand transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-teal" />
                          <span>Receipt</span>
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      {/* Update Status Button */}
                      <button
                        onClick={() => openStatusModal(ord)}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold hover:bg-brand-teal transition-all shadow-xs cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-brand-gold" />
                        <span>Update Order Status</span>
                      </button>

                      {/* Quick 1-Click Complete & Settle */}
                      <button
                        onClick={() => handleQuickCompleteAndSettle(ord)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-bold transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Complete &amp; Settle</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Manual Status & Note Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 shadow-2xl border border-brand-sand space-y-5 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-brand-sand">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">
                  Artisan Manual Update
                </span>
                <h3 className="font-serif text-lg font-bold text-brand-emerald">
                  Update Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-brand-sand/60 hover:bg-brand-sand flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal block">
                Current Order Lifecycle Status
              </label>
              <select
                value={modalStatus}
                onChange={(e) => {
                  setModalStatus(e.target.value);
                  // Provide helpful default status notes based on chosen stage
                  if (e.target.value === "PROOF_PENDING" || e.target.value === "DESIGN_DISCUSSION") {
                    setModalStatusLabel("WhatsApp consultation in progress with artist. Proofing custom layout.");
                  } else if (e.target.value === "PROOF_APPROVED") {
                    setModalStatusLabel("Custom layout & colors approved by patron. Timber prep commenced.");
                  } else if (e.target.value === "IN_PRODUCTION") {
                    setModalStatusLabel("Crafting in progress: Timber cut, resin poured, embellishments cast.");
                  } else if (e.target.value === "SLOW_CURING_48H") {
                    setModalStatusLabel("Piece is in chemical hardening & dust-free studio curing chamber.");
                  } else if (e.target.value === "FINISHING_QC") {
                    setModalStatusLabel("Edge beveling, diamond polishing, and artisan quality inspection underway.");
                  } else if (e.target.value === "DISPATCHED") {
                    setModalStatusLabel("Packed securely in wooden crate and handed over to courier partner.");
                  } else if (e.target.value === "DELIVERED") {
                    setModalStatusLabel("Delivered safely into patron's hands. Offline payment settled.");
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-brand-sand/20 text-xs font-semibold focus:outline-none focus:border-brand-emerald"
              >
                <option value="ORDER_CONFIRMED">1. Order Confirmed (Discussion Queued)</option>
                <option value="PROOF_PENDING">2. WhatsApp Proofing &amp; Consultation</option>
                <option value="DESIGN_DISCUSSION">3. Design Discussion &amp; Date Agreement</option>
                <option value="PROOF_APPROVED">4. Proof Approved by Patron</option>
                <option value="IN_PRODUCTION">5. In Studio Handcrafting</option>
                <option value="SLOW_CURING_48H">6. Resin Curing &amp; Hardening</option>
                <option value="FINISHING_QC">7. Finishing &amp; Quality Inspection</option>
                <option value="DISPATCHED">8. Dispatched with Courier</option>
                <option value="DELIVERED">9. Delivered &amp; Handed Over</option>
                <option value="CANCELLED">10. Cancelled</option>
              </select>
            </div>

            {/* Custom Status Note Shown to Customer */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-brand-charcoal block">
                Status Note for Customer (Shown on Tracking Screen)
              </label>
              <textarea
                rows={3}
                value={modalStatusLabel}
                onChange={(e) => setModalStatusLabel(e.target.value)}
                placeholder="e.g. Design approved on WhatsApp. Wood cut done, 1st coat resin poured."
                className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-brand-sand/20 text-xs focus:outline-none focus:border-brand-emerald"
              />
              <span className="text-[10px] text-slate-500">
                This exact note will be visible to the customer when they check their order status.
              </span>
            </div>

            {/* Courier Details (Visible if Dispatched or Delivered) */}
            {(modalStatus === "DISPATCHED" || modalStatus === "DELIVERED") && (
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block">
                  Courier Logistics Tracking
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Partner</label>
                    <input
                      type="text"
                      value={modalCourierPartner}
                      onChange={(e) => setModalCourierPartner(e.target.value)}
                      placeholder="Shiprocket / DTDC"
                      className="w-full px-3 py-1.5 rounded-lg border border-brand-sand bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">AWB / Tracking #</label>
                    <input
                      type="text"
                      value={modalCourierAwb}
                      onChange={(e) => setModalCourierAwb(e.target.value)}
                      placeholder="e.g. SR1009842"
                      className="w-full px-3 py-1.5 rounded-lg border border-brand-sand bg-white text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settlement Status */}
            <div className="space-y-2 pt-2 border-t border-brand-sand">
              <label className="text-xs font-bold text-brand-charcoal block">
                Offline Settlement Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setModalPaymentStatus("PENDING_OFFLINE")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    modalPaymentStatus === "PENDING_OFFLINE"
                      ? "bg-amber-100 text-amber-900 border-amber-400 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Pending Offline
                </button>
                <button
                  type="button"
                  onClick={() => setModalPaymentStatus("SETTLED_OFFLINE")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    modalPaymentStatus === "SETTLED_OFFLINE"
                      ? "bg-emerald-100 text-emerald-900 border-emerald-400 shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Settled Offline (Paid)
                </button>
              </div>

              <input
                type="text"
                value={modalOfflineNotes}
                onChange={(e) => setModalOfflineNotes(e.target.value)}
                placeholder="Payment settlement note (e.g. Received ₹2,499 via GPay on delivery)"
                className="w-full px-3.5 py-2 rounded-xl border border-brand-sand bg-brand-sand/20 text-xs mt-1"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-sand">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-brand-sand/60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold hover:bg-brand-teal transition-all shadow-md disabled:opacity-50"
              >
                {isSubmitting ? "Saving Updates..." : "Save Status to Repository"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
