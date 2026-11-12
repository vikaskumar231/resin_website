"use client";

import React from "react";
import Link from "next/link";
import { Printer, ArrowLeft, Lock, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface InvoicePageProps {
  params: {
    id: string;
  };
}

export default function OrderReceiptPage({ params }: InvoicePageProps) {
  const { id } = params;
  const { user, isAuthenticated } = useAuthStore();

  const isAuthorized =
    isAuthenticated &&
    (user?.role === "ARTISAN_ADMIN" || user?.name?.toLowerCase().includes("priya"));

  // Order Receipt Data Model (with dynamic privacy masking)
  const receipt = {
    receiptNumber: id.startsWith("INV-") ? id.replace("INV-", "REC-") : id,
    date: "29-Oct-2026",
    orderNumber: "ART-2026-1049",
    seller: {
      brandName: "Artआलय Artisanal Works",
      address: "Survey No. 42, Artisan Studio Park, Baner, Pune, Maharashtra - 411045",
      email: "care@artaalay.com",
      whatsapp: "+91 98765 43210",
    },
    buyer: {
      name: isAuthorized ? "Priya Sharma" : "Priya S***** [Masked for Privacy]",
      address: isAuthorized
        ? "Flat 402, Nilgiri Heights, Baner Road, Pune, Maharashtra - 411045"
        : "Baner Road, Pune, Maharashtra - 411045 [Street Address Protected]",
      phone: isAuthorized ? "+91 9876543210" : "+91 98••••••10",
      city: "Pune, Maharashtra",
    },
    items: [
      {
        id: 1,
        description: "Bespoke Natural Wood & Ocean Resin Nameplate (16\"x10\")",
        craftDetails: "Hand-poured resin waves, 24K gold foil flakes, 3D laser-cut mirror gold lettering",
        quantity: 1,
        unitPrice: 2499.0,
        total: 2499.0,
      },
    ],
    summary: {
      subtotal: 2499.0,
      shippingFee: 0.0,
      grandTotal: 2499.0,
      amountInWords: "Two Thousand Four Hundred and Ninety-Nine Rupees Only",
      paymentMethod: "Razorpay (UPI)",
      paymentStatus: "PAID (100% Captured)",
    },
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans print:p-0 print:bg-white text-black">
      {/* Top Action Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold shadow hover:bg-brand-teal transition-all"
        >
          <Printer className="w-4 h-4 text-brand-gold" />
          <span>Print / Save Order Receipt (PDF)</span>
        </button>
      </div>

      {!isAuthorized && (
        <div className="max-w-4xl mx-auto mb-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 print:hidden">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Privacy Protection Active:</strong> Customer personal details (full street address &amp; phone number) are masked for unauthenticated viewers. Sign in as an administrator or the verified purchaser to view unmasked details.
          </span>
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
            <p className="text-slate-600 mt-0.5">{receipt.buyer.address}</p>
            <p className="mt-1">Phone: {receipt.buyer.phone}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Delivery Destination:</span>
            <p className="font-bold text-sm mt-0.5">{receipt.buyer.name}</p>
            <p className="text-slate-600 mt-0.5">{receipt.buyer.address}</p>
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
              {receipt.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="p-2.5 border-r border-black text-center font-mono">{idx + 1}</td>
                  <td className="p-2.5 border-r border-black">
                    <p className="font-bold text-sm">{item.description}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{item.craftDetails}</p>
                  </td>
                  <td className="p-2.5 border-r border-black text-center font-bold">{item.quantity}</td>
                  <td className="p-2.5 border-r border-black text-right font-mono">
                    ₹{item.unitPrice.toFixed(2)}
                  </td>
                  <td className="p-2.5 text-right font-bold font-mono">
                    ₹{item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Totals */}
        <div className="grid grid-cols-2 gap-6 text-xs pt-2 pb-6 border-b border-black">
          <div>
            <p className="font-bold text-[11px] uppercase text-slate-700">Total in Words:</p>
            <p className="font-serif italic font-bold mt-1 text-slate-900">{receipt.summary.amountInWords}</p>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-300 rounded space-y-1 text-[11px]">
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
              <span>₹{receipt.summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Studio Packaging &amp; Preparation:</span>
              <span className="text-emerald-700 font-semibold">Included</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping &amp; Courier Handover:</span>
              <span className="text-emerald-700 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-base font-extrabold font-serif pt-3 border-t border-black text-black">
              <span>Grand Total:</span>
              <span>₹{receipt.summary.grandTotal.toFixed(2)}</span>
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
