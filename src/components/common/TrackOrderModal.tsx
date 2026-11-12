"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Search, Clock, ArrowRight, Sparkles, Package } from "lucide-react";

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrackOrderModal({ isOpen, onClose }: TrackOrderModalProps) {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = orderNumber.trim().toUpperCase();
    if (!cleanNumber) {
      setError("Please enter your order reference (e.g. ART-2026-1049)");
      return;
    }
    setError(null);
    onClose();
    router.push(`/track/${cleanNumber}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-brand-sand shadow-2xl z-10 space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-sand text-[11px] font-bold text-brand-emerald">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Order Status &amp; WhatsApp Consultation</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-emerald">
              Find Your Order
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-brand-sand text-brand-charcoal/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-brand-charcoal/70 leading-relaxed">
          Enter your unique order reference code from your confirmation screen or WhatsApp message to check your order status, view order receipts, and connect directly with our artist to finalize delivery dates and design details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-brand-charcoal uppercase tracking-wider">
              Order Reference
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-brand-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => {
                  setOrderNumber(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. ART-2026-1049"
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-brand-ivory border border-brand-sand font-mono font-bold uppercase text-sm text-brand-emerald focus:outline-hidden focus:border-brand-emerald transition-colors placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:text-slate-400"
              />
            </div>
            {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-brand-emerald hover:bg-brand-teal text-brand-sand font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-brand-gold" />
              <span>View Order &amp; WhatsApp Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/account/orders");
              }}
              className="w-full py-2.5 rounded-2xl hover:bg-brand-sand text-brand-emerald font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" />
              <span>View All My Orders</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

