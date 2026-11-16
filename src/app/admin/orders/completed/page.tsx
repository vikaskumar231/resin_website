"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { OrderRecord } from "@/lib/repositories/orderRepository";
import {
  CheckCircle2,
  FileText,
  Search,
  Printer,
  Download,
  IndianRupee,
  Calendar,
  Package,
  Crown,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Award,
  Filter,
  Lock,
} from "lucide-react";

export default function AdminCompletedOrdersPage() {
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("ALL");

  const isArtisanAdmin = user?.role === "ARTISAN_ADMIN";

  const fetchCompletedOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders?filter=completed", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load completed orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, [user]);

  // Executive KPI Metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const totalItemsDelivered = orders.reduce((sum, o) => {
      const itemCount = (o.items || []).reduce((iSum, it) => iSum + (it.quantity || 1), 0);
      return sum + itemCount;
    }, 0);

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      totalItemsDelivered,
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      // Month Filter
      if (selectedMonth !== "ALL") {
        const orderMonth = new Date(ord.createdAt).toISOString().slice(0, 7);
        if (orderMonth !== selectedMonth) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const num = (ord.orderNumber || "").toLowerCase();
        const name = (ord.customerName || "").toLowerCase();
        const phone = (ord.customerPhone || "").toLowerCase();
        const invoice = (ord.invoiceId || "").toLowerCase();
        return num.includes(q) || name.includes(q) || phone.includes(q) || invoice.includes(q);
      }

      return true;
    });
  }, [orders, selectedMonth, searchQuery]);

  // Unique Months for Dropdown
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    orders.forEach((o) => {
      if (o.createdAt) {
        months.add(new Date(o.createdAt).toISOString().slice(0, 7));
      }
    });
    return Array.from(months).sort().reverse();
  }, [orders]);

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
              Completed order fulfillment reports and settlement financial audits are restricted to authorized studio administrators. Please sign in with an artisan administrator account.
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

      <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-8">
        {/* Navigation Breadcrumb & Admin Suite Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-sand">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold text-brand-gold uppercase tracking-wider">
                Financial &amp; Delivery Reporting
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-sand text-[11px] font-bold text-brand-emerald border border-brand-gold/30">
                <Crown className="w-3 h-3 text-brand-gold" />
                Artisan Admin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-emerald">
              Completed Orders &amp; Offline Settlement Report
            </h1>
            <p className="text-xs text-brand-charcoal/70">
              Audit log of all delivered resin creations and 100% offline settled revenues (Cash on Delivery &amp; Direct UPI).
            </p>
          </div>

          {/* Module Switcher & Print Actions */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <Link
              href="/admin/orders"
              className="px-4 py-2 rounded-full bg-white text-brand-charcoal hover:bg-brand-sand border border-brand-sand transition-all"
            >
              &larr; Back to Active Orders
            </Link>
            <span className="px-4 py-2 rounded-full bg-brand-emerald text-white shadow-xs">
              Completed Orders ({orders.length})
            </span>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-full bg-brand-sand hover:bg-brand-sand/80 text-brand-emerald border border-brand-gold/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-brand-teal" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Scorecards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-brand-sand shadow-soft space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Completed &amp; Settled
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-serif font-bold text-brand-emerald">
              {metrics.totalOrders}
            </p>
            <span className="text-[11px] text-slate-500 block">Orders delivered</span>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-brand-sand/40 border border-brand-gold/50 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Settled Offline Revenue
              </span>
              <TrendingUp className="w-4 h-4 text-brand-gold" />
            </div>
            <p className="text-3xl font-serif font-bold text-brand-emerald">
              ₹{metrics.totalRevenue.toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] text-emerald-900/80 block">Cash / Direct UPI collected</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-brand-sand shadow-soft space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Average Order Value
              </span>
              <Award className="w-4 h-4 text-brand-teal" />
            </div>
            <p className="text-3xl font-serif font-bold text-brand-emerald">
              ₹{metrics.averageOrderValue.toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] text-slate-500 block">Per completed transaction</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-brand-sand shadow-soft space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Creations Delivered
              </span>
              <Package className="w-4 h-4 text-brand-teal" />
            </div>
            <p className="text-3xl font-serif font-bold text-brand-emerald">
              {metrics.totalItemsDelivered}
            </p>
            <span className="text-[11px] text-slate-500 block">Handcrafted pieces</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-brand-sand shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, Patron Name, Receipt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-brand-sand/40 border border-brand-sand text-xs focus:outline-none focus:border-brand-emerald"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Month Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3.5 py-2 rounded-full bg-brand-sand/50 border border-brand-sand text-xs font-semibold focus:outline-none focus:border-brand-emerald"
              >
                <option value="ALL">All Time</option>
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {new Date(`${m}-01`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={fetchCompletedOrders}
              title="Refresh"
              className="p-2 rounded-full bg-brand-sand hover:bg-brand-sand/80 text-brand-emerald ml-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Completed Orders Reporting Table */}
        {loading ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-brand-sand space-y-3 shadow-soft">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Compiling completed orders report...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-brand-sand space-y-4 shadow-soft">
            <div className="w-16 h-16 rounded-full bg-brand-sand flex items-center justify-center text-brand-emerald mx-auto">
              <CheckCircle2 className="w-8 h-8 text-brand-teal" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-brand-emerald">
                No completed orders found
              </h3>
              <p className="text-xs text-brand-charcoal/70 max-w-sm mx-auto">
                Orders will appear here once marked as DELIVERED or SETTLED_OFFLINE from the Active Orders screen.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-brand-sand shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-sand/50 text-[10px] uppercase font-bold text-slate-500 tracking-wider border-b border-brand-sand">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Order Ref &amp; Receipt</th>
                    <th className="py-3.5 px-4">Patron &amp; Contact</th>
                    <th className="py-3.5 px-4">Creations Delivered</th>
                    <th className="py-3.5 px-4">Order / Completion Date</th>
                    <th className="py-3.5 px-4">Settlement Mode</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Amount Settled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-sand/60">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-brand-sand/20 transition-colors">
                      {/* Order Ref & Invoice */}
                      <td className="py-4 px-4 sm:px-6 space-y-1">
                        <Link
                          href={`/track/${ord.orderNumber}`}
                          className="font-mono font-bold text-brand-emerald hover:underline block"
                        >
                          {ord.orderNumber}
                        </Link>
                        {ord.invoiceId ? (
                          <Link
                            href={`/invoices/${ord.invoiceId}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[11px] text-brand-teal font-semibold hover:underline"
                          >
                            <FileText className="w-3 h-3" />
                            <span>{ord.invoiceId}</span>
                          </Link>
                        ) : (
                          <span className="text-[10px] text-slate-400">Offline Receipt</span>
                        )}
                      </td>

                      {/* Patron & Contact */}
                      <td className="py-4 px-4 space-y-0.5">
                        <p className="font-bold text-brand-charcoal">{ord.customerName}</p>
                        <p className="text-slate-500 text-[11px]">{ord.customerPhone}</p>
                        {ord.shippingAddress?.city && (
                          <span className="text-[10px] text-slate-400 block">
                            {ord.shippingAddress.city}, {ord.shippingAddress.state}
                          </span>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4">
                        <div className="space-y-1 max-w-xs">
                          {ord.items.map((it, i) => (
                            <p key={i} className="text-[11px] text-brand-charcoal">
                              <strong>{it.quantity}x</strong> {it.title}
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-4 space-y-0.5">
                        <span className="text-[11px] text-brand-charcoal block">
                          Ordered:{" "}
                          {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {ord.completedAt && (
                          <span className="text-[10px] text-emerald-800 font-semibold block">
                            Delivered:{" "}
                            {new Date(ord.completedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                      </td>

                      {/* Settlement Status */}
                      <td className="py-4 px-4 space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Settled Offline
                        </span>
                        {ord.paymentDetails?.offlineNotes && (
                          <p className="text-[10px] text-slate-500 italic max-w-xs line-clamp-1">
                            {ord.paymentDetails.offlineNotes}
                          </p>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <span className="font-serif font-bold text-brand-emerald text-sm">
                          ₹{ord.grandTotal.toLocaleString("en-IN")}
                        </span>
                        <span className="block text-[10px] text-emerald-700 font-semibold">100% Paid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary Total */}
            <div className="p-4 sm:p-6 bg-brand-sand/40 border-t border-brand-sand flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="font-bold text-slate-600">
                Displaying {filteredOrders.length} completed transactions
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-charcoal">Report Total:</span>
                <span className="text-base font-serif font-bold text-brand-emerald">
                  ₹{filteredOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
