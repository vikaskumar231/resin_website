"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Truck,
  Package,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  FileText,
  MessageCircle,
} from "lucide-react";

interface TrackPageProps {
  params: {
    orderNumber: string;
  };
}

export default function OrderTrackingPage({ params }: TrackPageProps) {
  const { orderNumber } = params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  useEffect(() => {
    async function fetchTracking() {
      try {
        const res = await fetch(`/api/orders/track/${orderNumber}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTracking();
  }, [orderNumber]);

  const whatsappMessage = encodeURIComponent(
    `Namaste Artआलय Studio! I have placed Order #${orderNumber}. I would like to discuss my custom requirements, agree on the final price, and confirm my delivery date.`
  );

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 w-full space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs">
          <Link
            href="/account/orders"
            className="text-brand-emerald font-semibold hover:underline flex items-center gap-1"
          >
            &larr; Back to My Orders
          </Link>
          {order?.invoiceId && (
            <Link
              href={`/invoices/${order.invoiceId}`}
              className="inline-flex items-center gap-1.5 text-brand-emerald font-bold hover:underline"
            >
              <FileText className="w-3.5 h-3.5 text-brand-teal" />
              <span>Download Tax Invoice</span>
            </Link>
          )}
        </div>

        {/* Screen Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sand border border-brand-gold/40 text-xs font-bold text-brand-emerald">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>Direct Artisan WhatsApp Consultation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-emerald">
            Order #{orderNumber}
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal/70">
            {order?.customerName ? `Ordered by ${order.customerName} • ` : ""}
            Delivery schedule &amp; final pricing are confirmed 1-on-1 with our artist.
          </p>
        </div>

        {/* PRIMARY THEME CARD: WhatsApp Consultation & Price/Date Agreement */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-brand-sand/40 to-white border border-brand-gold/50 shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brand-sand/70">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-brand-emerald">
                  Delivery Date &amp; Price Agreement on WhatsApp
                </h3>
                <p className="text-xs text-brand-charcoal/70">
                  1-on-1 Consultation between Buyer &amp; Artist
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">
              ₹199 Token Paid
            </span>
          </div>

          <div className="space-y-3 text-xs text-brand-charcoal/80 leading-relaxed font-sans">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p>
                <strong>Tentative Pricing:</strong> All catalog prices are tentative estimates. You have paid a <strong>₹199 token deposit</strong> to secure your spot in our workshop queue and initiate personalized consultation.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p>
                <strong>Delivery Date Finalized on WhatsApp:</strong> Our artist will connect with you directly over WhatsApp to review your requirements, share layout proofs, finalize custom details, and mutually agree on the actual delivery date based on studio curing and workload.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <p>
                <strong>50% Token Refund Guarantee:</strong> In case the design proof or final price is not mutually agreed during your WhatsApp discussion, <strong>50% of your token amount is promptly returned</strong>.
              </p>
            </div>
          </div>

          {/* Primary WhatsApp Direct CTA */}
          <div className="pt-2">
            <a
              href={`https://wa.me/919876543210?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md active:scale-95 transition-all text-center"
            >
              <MessageCircle className="w-5 h-5 text-brand-gold" />
              <span>Chat with Artist on WhatsApp to Agree Date &amp; Price</span>
              <ExternalLink className="w-4 h-4 text-white/80" />
            </a>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-brand-sand">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Order Status
              </span>
              <h3 className="font-serif text-lg font-bold text-brand-emerald">
                {order?.statusLabel || "Workshop Queue • WhatsApp Discussion Pending"}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Ref: {orderNumber}
            </span>
          </div>

          {/* Customer Target Date Notice if specified */}
          {order?.neededByDate && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-xs">
              <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-amber-900">
                  Target Occasion Date: {order.neededByDate}
                  {order.neededByReason ? ` • Occasion: "${order.neededByReason}"` : ""}
                </p>
                <p className="text-[11px] text-amber-800/80 leading-relaxed">
                  Notice: Final delivery schedule is confirmed 1-on-1 by the artist on WhatsApp based on chemical curing requirements and workshop schedule.
                </p>
              </div>
            </div>
          )}

          {/* Ordered Items Preview */}
          {order?.items && order.items.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Ordered Creations
              </h4>
              <div className="divide-y divide-brand-sand/60">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-brand-emerald text-sm">
                        {item.title || item.productTitle || "Bespoke Resin Piece"}
                      </p>
                      {item.customizationText && (
                        <p className="text-[11px] text-brand-charcoal/70">
                          Custom Text: &ldquo;{item.customizationText}&rdquo;
                        </p>
                      )}
                      {item.category && (
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">
                          Category: {item.category}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-serif font-bold text-brand-emerald text-sm">
                        ₹{(item.price || item.totalPrice || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="block text-[10px] text-slate-400">Tentative Est.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courier Logistics (if dispatched) */}
          {order?.courier?.awb && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-white border border-brand-sand flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-brand-teal" />
                <div>
                  <p className="text-xs font-bold text-brand-emerald">
                    {order?.courier?.partner || "Shiprocket Air Express"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    AWB:{" "}
                    <span className="font-mono font-bold text-brand-charcoal">
                      {order?.courier?.awb}
                    </span>
                  </p>
                </div>
              </div>

              <a
                href={order?.courier?.trackingUrl || "https://shiprocket.co"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-sand text-xs font-bold text-brand-charcoal hover:bg-white"
              >
                <span>Live Courier Tracking</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Zero-Breakage Guarantee */}
          <div className="pt-4 border-t border-brand-sand flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-teal shrink-0" />
              <span>Zero-Breakage Guarantee: 100% Free Replacement if damaged in transit</span>
            </div>

            <button
              onClick={() => setShowClaimModal(true)}
              className="text-xs font-bold text-red-600 hover:text-red-800 underline cursor-pointer"
            >
              Report Transit Damage
            </button>
          </div>
        </div>

        {/* Transit Breakage Claim Modal */}
        {showClaimModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setShowClaimModal(false)} className="fixed inset-0 bg-black/60" />
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full z-10 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif text-lg font-bold">Transit Breakage Claim</h3>
              </div>
              <p className="text-xs text-slate-600">
                Please attach an unboxing photo or package video showing any courier transit damage. Our artisan team will initiate a replacement pour immediately.
              </p>

              {claimSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold text-center">
                  Claim registered! Our artisan lead will contact you via WhatsApp in 2 hours with replacement order dispatch details.
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-sand file:text-xs file:font-bold hover:file:bg-brand-gold/20"
                  />
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setShowClaimModal(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500 cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => setClaimSubmitted(true)}
                      className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Submit Claim
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
