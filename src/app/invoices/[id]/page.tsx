"use client";

import React from "react";
import Link from "next/link";
import { Printer, ArrowLeft, Download, ShieldCheck, Lock } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface InvoicePageProps {
  params: {
    id: string;
  };
}

export default function TaxInvoicePage({ params }: InvoicePageProps) {
  const { id } = params;
  const { user, isAuthenticated } = useAuthStore();

  const isAuthorized = isAuthenticated && (user?.role === "ARTISAN_ADMIN" || user?.name?.toLowerCase().includes("priya"));

  // Invoice Data Model (with dynamic privacy masking)
  const invoice = {
    invoiceNumber: "INV-2026-00042",
    date: "29-Oct-2026",
    orderNumber: "ART-2026-1049",
    seller: {
      legalName: "Artआलय Artisanal Works Private Limited",
      address: "Survey No. 42, Artisan Studio Park, Baner, Pune, Maharashtra - 411045",
      gstin: "27AABCA1234F1Z8",
      stateCode: "27 (Maharashtra)",
      email: "accounts@artaalay.com",
    },
    buyer: {
      name: isAuthorized ? "Priya Sharma" : "Priya S***** [Masked for Privacy]",
      address: isAuthorized
        ? "Flat 402, Nilgiri Heights, Baner Road, Pune, Maharashtra - 411045"
        : "Baner Road, Pune, Maharashtra - 411045 [Street Address Protected]",
      phone: isAuthorized ? "+91 9876543210" : "+91 98••••••10",
      stateCode: "27 (Maharashtra)",
      isInterState: false, // Intra-state => CGST + SGST
    },
    items: [
      {
        id: 1,
        description: "Bespoke Natural Wood & Ocean Resin Nameplate (16\"x10\")",
        hsnCode: "3926",
        quantity: 1,
        unitPrice: 2499.0,
        taxableAmount: 2117.80,
        cgstRate: 9.0,
        cgstAmount: 190.60,
        sgstRate: 9.0,
        sgstAmount: 190.60,
        igstRate: 0.0,
        igstAmount: 0.0,
        total: 2499.0,
      },
    ],
    summary: {
      taxableSubtotal: 2117.80,
      cgstTotal: 190.60,
      sgstTotal: 190.60,
      igstTotal: 0.0,
      totalTax: 381.20,
      shippingFee: 0.0,
      grandTotal: 2499.0,
      amountInWords: "Two Thousand Four Hundred and Ninety-Nine Rupees Only",
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
          <span>Print / Save Tax Invoice (PDF)</span>
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

      {/* Standard Indian GST Invoice A4 Card */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 border border-slate-300 shadow-xl print:border-none print:shadow-none print:p-0">
        {/* Title */}
        <div className="text-center border-b-2 border-black pb-3 mb-6">
          <span className="font-mono text-[11px] uppercase tracking-widest block text-slate-500">
            Form GST INV-1 (Rule 46 of CGST Rules)
          </span>
          <h1 className="text-2xl font-bold font-serif tracking-wide uppercase">
            Tax Invoice
          </h1>
        </div>

        {/* Header Grid */}
        <div className="grid grid-cols-2 gap-6 text-xs pb-6 border-b border-black">
          <div>
            <h3 className="font-bold text-sm font-serif">{invoice.seller.legalName}</h3>
            <p className="text-slate-600 mt-1">{invoice.seller.address}</p>
            <p className="mt-2"><strong>GSTIN:</strong> {invoice.seller.gstin}</p>
            <p><strong>State &amp; Code:</strong> {invoice.seller.stateCode}</p>
            <p><strong>Contact:</strong> {invoice.seller.email}</p>
          </div>

          <div className="text-right">
            <p className="font-mono text-base font-extrabold text-brand-emerald">{invoice.invoiceNumber}</p>
            <p><strong>Invoice Date:</strong> {invoice.date}</p>
            <p><strong>Order Ref:</strong> {invoice.orderNumber}</p>
            <p><strong>Place of Supply:</strong> {invoice.buyer.stateCode}</p>
            <p><strong>Reverse Charge (Y/N):</strong> No</p>
          </div>
        </div>

        {/* Bill To Grid */}
        <div className="py-4 border-b border-black text-xs grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Billed To (Customer):</span>
            <p className="font-bold text-sm mt-0.5">{invoice.buyer.name}</p>
            <p className="text-slate-600 mt-0.5">{invoice.buyer.address}</p>
            <p className="mt-1">Phone: {invoice.buyer.phone}</p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">Shipped To (Recipient):</span>
            <p className="font-bold text-sm mt-0.5">{invoice.buyer.name}</p>
            <p className="text-slate-600 mt-0.5">{invoice.buyer.address}</p>
            <p className="mt-1">Air Express Courier Handover</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="py-4">
          <table className="w-full text-left text-xs border border-black">
            <thead className="bg-slate-100 border-b border-black text-[10px] uppercase font-bold">
              <tr>
                <th className="p-2 border-r border-black">#</th>
                <th className="p-2 border-r border-black">Description of Goods</th>
                <th className="p-2 border-r border-black">HSN Code</th>
                <th className="p-2 border-r border-black text-center">Qty</th>
                <th className="p-2 border-r border-black text-right">Taxable Val (₹)</th>
                <th className="p-2 border-r border-black text-right">CGST (9%)</th>
                <th className="p-2 border-r border-black text-right">SGST (9%)</th>
                <th className="p-2 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="p-2 border-r border-black text-center">{idx + 1}</td>
                  <td className="p-2 border-r border-black font-medium">{item.description}</td>
                  <td className="p-2 border-r border-black font-mono text-center">{item.hsnCode}</td>
                  <td className="p-2 border-r border-black text-center font-bold">{item.quantity}</td>
                  <td className="p-2 border-r border-black text-right font-mono">
                    ₹{item.taxableAmount.toFixed(2)}
                  </td>
                  <td className="p-2 border-r border-black text-right font-mono">
                    ₹{item.cgstAmount.toFixed(2)}
                  </td>
                  <td className="p-2 border-r border-black text-right font-mono">
                    ₹{item.sgstAmount.toFixed(2)}
                  </td>
                  <td className="p-2 text-right font-bold font-mono">
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
            <p className="font-serif italic font-bold mt-1">{invoice.summary.amountInWords}</p>

            <div className="mt-4 p-3 bg-slate-50 border border-slate-300 rounded space-y-1 text-[11px]">
              <p><strong>Payment Gateway:</strong> Razorpay (UPI)</p>
              <p><strong>Transaction Status:</strong> PAID (100% Captured)</p>
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-right">
            <div className="flex justify-between">
              <span>Total Taxable Amount:</span>
              <span>₹{invoice.summary.taxableSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total CGST (9.0%):</span>
              <span>₹{invoice.summary.cgstTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total SGST (9.0%):</span>
              <span>₹{invoice.summary.sgstTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping &amp; Handling:</span>
              <span>FREE</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold font-serif pt-2 border-t border-black text-black">
              <span>Invoice Grand Total:</span>
              <span>₹{invoice.summary.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Legal Signatures */}
        <div className="pt-8 flex justify-between items-end text-xs">
          <div>
            <p className="text-[11px] text-slate-500">Thank you for patronizing authentic Indian handicraft.</p>
            <p className="text-[10px] text-slate-400 font-mono mt-1">
              Computer Generated Tax Invoice under Section 31 of CGST Act, 2017.
            </p>
          </div>
          <div className="text-center">
            <div className="h-12 border-b border-black mb-1 w-44 mx-auto" />
            <p className="font-bold">For Artआलय Artisanal Works Pvt Ltd</p>
            <p className="text-[10px] text-slate-500">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}

