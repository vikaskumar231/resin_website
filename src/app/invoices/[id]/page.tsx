"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Printer, ArrowLeft, Lock, Sparkles, FileText, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface InvoicePageProps {
  params: {
    id: string;
  };
}

export default function OrderReceiptPage({ params }: InvoicePageProps) {
  const { id } = params;
  const { user, isAuthenticated, openAuthModal } = useAuthStore();
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReceipt() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/invoices/${id}`, { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.receipt) {
          setReceipt(data.receipt);
        } else {
          setError(data.error || "Order receipt could not be found.");
        }
      } catch (err: any) {
        console.error("Failed to load invoice receipt:", err);
        setError("Network error while loading order receipt.");
      } finally {
        setLoading(false);
      }
    }
    fetchReceipt();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full border-4 border-brand-emerald border-t-transparent animate-spin mx-auto" />
          <h3 className="font-serif text-lg font-bold text-brand-emerald">
            Loading Electronic Receipt...
          </h3>
          <p className="text-xs text-slate-500">
            Fetching verified studio order records for #{id}
          </p>
        </div>
      </div>
    );
  }

  if (error || !receipt) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-slate-800">
            Receipt Not Found
          </h3>
          <p className="text-xs text-slate-600">
            {error || `No order receipt found for reference "${id}".`}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold hover:bg-brand-teal transition-all"
            >
              Back to Storefront
            </Link>
            <Link
              href="/account/orders"
              className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans print:p-0 print:bg-white text-black">
      {/* Top Action Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Orders</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold shadow hover:bg-brand-teal transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-brand-gold" />
          <span>Print / Save Order Receipt (PDF)</span>
        </button>
      </div>

      {receipt.isMasked && (
        <div className="max-w-4xl mx-auto mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900 print:hidden">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Privacy Protection Active:</strong> Customer personal details (full street address &amp; phone number) are masked for unauthenticated viewers. Sign in as an administrator or the verified purchaser to view unmasked details.
            </span>
          </div>
          {!isAuthenticated && (
            <button
              onClick={() => openAuthModal("LOGIN")}
              className="px-4 py-1.5 rounded-full bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shrink-0 cursor-pointer"
            >
              Sign In to Verify
            </button>
          )}
        </div>
      )}

      {/* Artisan Order Receipt A4 Card */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 border border-slate-300 shadow-xl print:border-none print:shadow-none print:p-0">
        {/* Title */}
        <div className="text-center border-b-2 border-black pb-3 mb-6">
          <span className="font-mono text-[11px] uppercase tracking-widest block text-brand-emerald font-bold">
            Artआलय Studio • Official Customer Order Receipt
          </span>
          <h1 className="text-2xl font-bold font-serif tracking-wide uppercase mt-1">
            Order Receipt
          </h1>
        </div>

        {/* Header Grid */}
        <div className="grid grid-cols-2 gap-6 text-xs pb-6 border-b border-black">
          <div>
            <h3 className="font-bold text-sm font-serif text-brand-emerald">{receipt.seller.brandName}</h3>
            <p className="text-slate-600 mt-1">{receipt.seller.address}</p>
            <p className="mt-2"><strong>Contact:</strong> {receipt.seller.email}</p>
            <p><strong>Studio WhatsApp:</strong> {receipt.seller.whatsapp}</p>
          </div>

          <div className="text-right">
            <p className="font-mono text-base font-extrabold text-brand-emerald">{receipt.receiptNumber}</p>
            <p><strong>Receipt Date:</strong> {receipt.date}</p>
            <p><strong>Order Ref:</strong> {receipt.orderNumber}</p>
            <p><strong>Payment Status:</strong> <span className="font-bold text-emerald-700">{receipt.summary.paymentStatus}</span></p>
          </div>
        </div>

        {/* Bill To Grid */}
        <div className="py-4 border-b border-black text-xs grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Customer Details:</span>
            <p className="font-bold text-sm mt-0.5">{receipt.buyer.name}</p>
            <p className="text-slate-600 mt-0.5">{receipt.buyer.street}</p>
            <p className="text-slate-600">{receipt.buyer.city}, {receipt.buyer.state} - {receipt.buyer.pincode}</p>
            <p className="mt-1">Phone: {receipt.buyer.phone}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Delivery Destination:</span>
            <p className="font-bold text-sm mt-0.5">{receipt.buyer.name}</p>
            <p className="text-slate-600 mt-0.5">{receipt.buyer.street}</p>
            <p className="text-slate-600">{receipt.buyer.city}, {receipt.buyer.state} - {receipt.buyer.pincode}</p>
            <p className="mt-1">Air Express Courier Handover</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-4">
          <table className="w-full text-left text-xs border border-black">
            <thead className="bg-slate-100 border-b border-black text-[10px] uppercase font-bold">
              <tr>
                <th className="p-2.5 border-r border-black text-center w-12">#</th>
                <th className="p-2.5 border-r border-black">Description of Handcrafted Goods</th>
                <th className="p-2.5 border-r border-black text-center w-16">Qty</th>
                <th className="p-2.5 border-r border-black text-right w-28">Unit Price (₹)</th>
                <th className="p-2.5 text-right w-28">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {receipt.items.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="p-2.5 border-r border-black text-center font-mono">{idx + 1}</td>
                  <td className="p-2.5 border-r border-black">
                    <p className="font-bold text-sm">{item.description}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{item.craftDetails}</p>
                  </td>
                  <td className="p-2.5 border-r border-black text-center font-bold">{item.quantity}</td>
                  <td className="p-2.5 border-r border-black text-right font-mono">
                    ₹{Number(item.unitPrice).toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right font-bold font-mono">
                    ₹{Number(item.total).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Totals */}
        <div className="grid grid-cols-2 gap-6 text-xs pt-2 pb-6 border-b border-black">
          <div>
            <div className="mt-2 p-3 bg-slate-50 border border-slate-300 rounded space-y-1 text-[11px]">
              <p><strong>Payment Gateway:</strong> {receipt.summary.paymentMethod}</p>
              <p><strong>Transaction Status:</strong> {receipt.summary.paymentStatus}</p>
              <p className="text-slate-500 text-[10px] pt-1 border-t border-slate-200 mt-1">
                💬 Customization details, resin curing updates, and dispatch schedule are coordinated via WhatsApp with the artist.
              </p>
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-right">
            <div className="flex justify-between">
              <span>Item Subtotal:</span>
              <span>₹{Number(receipt.summary.subtotal).toFixed(2)}</span>
            </div>
            {receipt.summary.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount Applied:</span>
                <span>-₹{Number(receipt.summary.discount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Studio Packaging &amp; Preparation:</span>
              <span className="text-emerald-700 font-semibold">Included</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping &amp; Courier Handover:</span>
              <span className="text-emerald-700 font-semibold">
                {receipt.summary.shippingFee > 0 ? `₹${Number(receipt.summary.shippingFee).toFixed(2)}` : "FREE"}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold font-serif pt-3 border-t border-black text-black">
              <span>Grand Total:</span>
              <span>₹{Number(receipt.summary.grandTotal).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Signatures & Notes */}
        <div className="pt-8 flex justify-between items-end text-xs">
          <div>
            <p className="text-[11px] text-slate-600 font-medium">
              Thank you for patronizing authentic Indian handicraft.
            </p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              Official Electronic Order Receipt issued by Artआलय Artisanal Works.
            </p>
          </div>
          <div className="text-center">
            <div className="h-12 border-b border-black mb-1 w-44 mx-auto" />
            <p className="font-bold">For Artआलय Artisanal Works</p>
            <p className="text-[10px] text-slate-500">Authorized Artisan Studio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
