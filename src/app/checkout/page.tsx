"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useCartStore } from "@/store/useCartStore";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  Smartphone,
  AlertCircle,
  Clock,
  Calendar,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Flexible Target Delivery Date State
  const [hasNeededByDate, setHasNeededByDate] = useState(false);
  const [neededByDate, setNeededByDate] = useState("");
  const [neededByReason, setNeededByReason] = useState("");

  // Form State
  const [contact, setContact] = useState({
    fullName: "Priya Sharma",
    phone: "9876543210",
    email: "priya.sharma@example.com",
  });

  const [shipping, setShipping] = useState({
    street: "Flat 402, Nilgiri Heights, Baner Road",
    landmark: "Near Orchid School",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411045",
  });

  const [isBillingSame, setIsBillingSame] = useState(true);
  const [billing, setBilling] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<string>("OFFLINE_SETTLEMENT");

  const subtotal = cart.getSubtotal();
  const discount = cart.getDiscountAmount();
  const shippingFee = cart.getShippingFee();
  const giftWrapFee = cart.isGift ? 99 : 0;
  const grandTotal = cart.getGrandTotal();

  // Handle Indian PIN code auto-fill mock
  const handlePincodeChange = (pincode: string) => {
    setShipping((prev) => ({ ...prev, pincode: pincode.slice(0, 6) }));
    if (pincode.startsWith("411")) {
      setShipping((prev) => ({ ...prev, city: "Pune", state: "Maharashtra" }));
    } else if (pincode.startsWith("110")) {
      setShipping((prev) => ({ ...prev, city: "New Delhi", state: "Delhi" }));
    } else if (pincode.startsWith("560")) {
      setShipping((prev) => ({ ...prev, city: "Bengaluru", state: "Karnataka" }));
    } else if (pincode.startsWith("400")) {
      setShipping((prev) => ({ ...prev, city: "Mumbai", state: "Maharashtra" }));
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Direct single-step order registration for offline payment
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items,
          customerPhone: contact.phone,
          customerEmail: contact.email,
          shippingAddress: {
            fullName: contact.fullName,
            phone: contact.phone,
            ...shipping,
          },
          billingAddress: isBillingSame
            ? { fullName: contact.fullName, phone: contact.phone, ...shipping }
            : billing,
          isBillingSameAsShipping: isBillingSame,
          paymentMethod: "OFFLINE_SETTLEMENT",
          isGift: cart.isGift,
          giftMessage: cart.giftMessage,
          couponCode: cart.appliedCoupon?.code,
          neededByDate: hasNeededByDate && neededByDate ? neededByDate : undefined,
          neededByReason: hasNeededByDate && neededByReason ? neededByReason : undefined,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || "Failed to initialize order");
      }

      // Order created successfully with offline payment. Clear cart and proceed to confirmation!
      cart.clearCart();
      router.push(`/order-confirmation/${orderData.orderNumber}`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An unexpected error occurred during checkout");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-ivory flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-brand-emerald mb-2">
            Your shopping bag is empty
          </h2>
          <p className="text-sm text-brand-charcoal/70 mb-6">
            Please add handcrafted resin items before proceeding to checkout.
          </p>
          <Link
            href="/"
            className="px-8 py-3 rounded-full bg-brand-emerald text-white text-sm font-bold shadow-md hover:bg-brand-teal transition-all"
          >
            Explore Collections
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-charcoal/60 mb-6">
          <Link href="/cart" className="hover:text-brand-emerald flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Bag
          </Link>
          <span>/</span>
          <span className="text-brand-emerald">Secure Checkout</span>
        </div>

        {/* Step Indicator Header */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 max-w-2xl mx-auto mb-8 sm:mb-10 text-center text-[10px] sm:text-xs font-bold">
          <div
            onClick={() => setStep(1)}
            className={`cursor-pointer p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${step === 1
                ? "bg-brand-emerald text-white border-brand-emerald shadow-sm"
                : "bg-white text-slate-500 border-brand-sand"
              }`}
          >
            1. Shipping &amp; Contact
          </div>
          <div
            onClick={() => setStep(2)}
            className={`cursor-pointer p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${step === 2
                ? "bg-brand-emerald text-white border-brand-emerald shadow-sm"
                : "bg-white text-slate-500 border-brand-sand"
              }`}
          >
            2. Billing Address
          </div>
          <div
            onClick={() => setStep(3)}
            className={`cursor-pointer p-2 sm:p-3 rounded-xl sm:rounded-2xl border transition-all ${step === 3
                ? "bg-brand-emerald text-white border-brand-emerald shadow-sm"
                : "bg-white text-slate-500 border-brand-sand"
              }`}
          >
            3. Offline Settlement
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Checkout Wizard Forms */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-soft">
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: SHIPPING & CONTACT */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-emerald">
                    Contact & Delivery Address
                  </h3>
                  <p className="text-xs text-brand-charcoal/60 mt-1">
                    Customized resin products are delivered via express courier dispatch.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={contact.fullName}
                      onChange={(e) => setContact({ ...contact, fullName: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-brand-ivory/50 text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      Mobile Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      placeholder="10-digit Indian Mobile"
                      className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-brand-ivory/50 text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      We send your pre-pour photo proof to this WhatsApp number.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                      placeholder="e.g. priya@example.com"
                      className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-brand-ivory/50 text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      Street Address & House/Flat No. *
                    </label>
                    <input
                      type="text"
                      value={shipping.street}
                      onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                      placeholder="House/Villa No., Building, Street"
                      className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-brand-ivory/50 text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={shipping.landmark}
                      onChange={(e) => setShipping({ ...shipping, landmark: e.target.value })}
                      placeholder="e.g. Near Orchid School"
                      className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-brand-ivory/50 text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      6-Digit PIN Code *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={shipping.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      placeholder="e.g. 411045"
                      className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-brand-ivory/50 text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-brand-ivory/50 text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-brand-ivory/50 text-sm focus:ring-2 focus:ring-brand-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Target Delivery Date & Artisan Lead Time Notice */}
                <div className="pt-4 border-t border-brand-sand/70 space-y-3">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                      <Clock className="w-4 h-4 text-brand-gold shrink-0" />
                      <span>Artisan Lead Time &amp; Delivery Confirmation Notice</span>
                    </div>
                    <p className="text-[11px] text-amber-800/90 leading-relaxed">
                      Each handcrafted resin creation's delivery lead time varies based on order backlog, artist availability, inventory status, and slow chemical curing. <strong>The actual delivery date will be confirmed directly by the artist when designs are approved over WhatsApp.</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="neededByToggle"
                      checked={hasNeededByDate}
                      onChange={(e) => setHasNeededByDate(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-emerald focus:ring-brand-gold cursor-pointer"
                    />
                    <label htmlFor="neededByToggle" className="text-xs font-bold text-brand-charcoal cursor-pointer">
                      I need this creation by a specific date (e.g. Wedding, Griha Pravesh, Anniversary)
                    </label>
                  </div>

                  {hasNeededByDate && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-brand-sand animate-in fade-in">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                          Target Date Needed *
                        </label>
                        <input
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          value={neededByDate}
                          onChange={(e) => setNeededByDate(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-brand-ivory/50 text-xs font-medium focus:ring-2 focus:ring-brand-gold focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                          Occasion / Reason
                        </label>
                        <input
                          type="text"
                          value={neededByReason}
                          onChange={(e) => setNeededByReason(e.target.value)}
                          placeholder="e.g. Housewarming ceremony on Nov 25"
                          maxLength={100}
                          className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-brand-ivory/50 text-xs font-medium focus:ring-2 focus:ring-brand-gold focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3 rounded-full bg-brand-emerald text-white font-bold text-sm hover:bg-brand-teal transition-all"
                  >
                    Continue to Billing ➔
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: BILLING ADDRESS */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-emerald">
                    Billing Address
                  </h3>
                  <p className="text-xs text-brand-charcoal/60 mt-1">
                    Confirm your billing address for order records and delivery confirmation.
                  </p>
                </div>

                {/* Same as Shipping Toggle */}
                <div className="p-4 rounded-2xl border border-brand-sand bg-brand-ivory/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-brand-charcoal">Billing Address</p>
                    <p className="text-xs text-slate-500">Same as delivery address provided in Step 1</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isBillingSame}
                    onChange={(e) => setIsBillingSame(e.target.checked)}
                    className="w-5 h-5 rounded text-brand-emerald focus:ring-brand-gold cursor-pointer"
                  />
                </div>

                {!isBillingSame && (
                  <div className="p-4 rounded-2xl border border-brand-sand bg-white space-y-3">
                    <p className="text-xs font-bold uppercase text-brand-emerald tracking-wider">
                      Different Billing Address
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1">
                          Billing Contact Name *
                        </label>
                        <input
                          type="text"
                          value={billing.fullName}
                          onChange={(e) => setBilling({ ...billing, fullName: e.target.value })}
                          placeholder="Full name for billing"
                          className="w-full px-3 py-2 rounded-xl border border-brand-sand bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1">
                          Billing PIN Code *
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          value={billing.pincode}
                          onChange={(e) => setBilling({ ...billing, pincode: e.target.value })}
                          placeholder="6-digit PIN code"
                          className="w-full px-3 py-2 rounded-xl border border-brand-sand bg-white text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1">
                          Billing Street Address *
                        </label>
                        <input
                          type="text"
                          value={billing.street}
                          onChange={(e) => setBilling({ ...billing, street: e.target.value })}
                          placeholder="House/Building/Street"
                          className="w-full px-3 py-2 rounded-xl border border-brand-sand bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={billing.city}
                          onChange={(e) => setBilling({ ...billing, city: e.target.value })}
                          placeholder="City"
                          className="w-full px-3 py-2 rounded-xl border border-brand-sand bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-slate-700 block mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={billing.state}
                          onChange={(e) => setBilling({ ...billing, state: e.target.value })}
                          placeholder="State"
                          className="w-full px-3 py-2 rounded-xl border border-brand-sand bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-brand-emerald"
                  >
                    ⬅ Back to Shipping
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-8 py-3 rounded-full bg-brand-emerald text-white font-bold text-sm hover:bg-brand-teal transition-all"
                  >
                    Review Order &amp; Offline Payment ➔
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER REVIEW & OFFLINE PAYMENT */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl font-bold text-brand-emerald">
                    3. Order Review &amp; Offline Payment
                  </h3>
                  <p className="text-xs text-brand-charcoal/60 mt-1">
                    No online payment required today. Your order is registered directly into our workshop queue. Payment will be settled offline directly with the artisan.
                  </p>
                </div>

                {/* Zero Online Payment Reassurance Banner */}
                <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-300 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span>Zero Online Risk • 100% Offline Settlement</span>
                  </div>
                  <p className="text-[12px] text-emerald-900 leading-relaxed">
                    We do not collect card numbers, CVVs, or online UPI payments. Your order is recorded immediately, and our artisan connects with you 1-on-1 on WhatsApp to confirm design layout proofs and specifications.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] font-bold text-emerald-900">
                    <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-200 flex items-center gap-2">
                      <span className="text-base">💵</span>
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/90 border border-emerald-200 flex items-center gap-2">
                      <span className="text-base">📱</span>
                      <span>Direct UPI (GPay / PhonePe / Paytm)</span>
                    </div>
                  </div>
                </div>

                {/* Selected Offline Payment Method Card */}
                <div className="p-5 rounded-2xl border-2 border-brand-emerald bg-brand-emerald/5 ring-2 ring-brand-emerald/20 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-brand-emerald" />
                      <div>
                        <p className="text-sm font-bold text-brand-charcoal">
                          Offline Payment (Direct to Artisan)
                        </p>
                        <p className="text-xs text-slate-500">
                          Settle upon WhatsApp design proof approval or when your package arrives.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                      Offline Mode
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 bg-white/80 p-3 rounded-xl border border-brand-sand/80 space-y-1">
                    <div className="flex justify-between">
                      <span>Delivery Contact:</span>
                      <strong className="text-brand-charcoal">{contact.fullName} ({contact.phone})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Destination:</span>
                      <span className="text-brand-charcoal text-right truncate max-w-[220px]">{shipping.city}, {shipping.state} - {shipping.pincode}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-slate-500 hover:text-brand-emerald"
                  >
                    ⬅ Back to Billing Address
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className="px-8 py-4 rounded-full bg-brand-emerald hover:bg-brand-teal text-brand-sand font-bold text-sm tracking-wide shadow-lg transition-all flex items-center gap-2 active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Registering Order in Workshop...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-brand-gold" />
                        <span>Confirm Order (Pay Offline) &amp; Open WhatsApp ➔</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sticky Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-brand-sand shadow-soft space-y-6">
            <h3 className="font-serif text-lg font-bold text-brand-emerald pb-3 border-b border-brand-sand">
              Order Summary ({cart.getItemCount()} items)
            </h3>

            {/* Line items snippet */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs items-center">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-brand-sand/60 shrink-0">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-charcoal truncate">{item.title}</p>
                    <p className="text-slate-500 text-[10px]">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Tentative</span>
                    <span className="font-bold text-brand-emerald font-serif">
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs pt-4 border-t border-brand-sand">
              <div className="flex justify-between text-slate-600">
                <span>Tentative Items Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Express Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              {giftWrapFee > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Wax-Sealed Gifting Suite</span>
                  <span>₹99</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-slate-600 pt-1">
                <span>Estimated Total Value</span>
                <span className="font-bold">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>Payment Mode</span>
                <span className="font-semibold text-emerald-800">Offline Settlement</span>
              </div>

              {/* Offline Settlement Total Box */}
              <div className="flex justify-between items-center text-sm font-bold text-brand-emerald pt-2.5 border-t border-brand-sand bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                <div>
                  <span className="block text-brand-emerald font-extrabold">
                    Payable Offline
                  </span>
                  <span className="text-[10px] text-emerald-700 font-normal">
                    Cash on Delivery or Direct UPI on WhatsApp proof approval
                  </span>
                </div>
                <span className="text-xl font-black text-brand-emerald">
                  ₹{grandTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 text-right">
                All inclusive of packaging &amp; studio preparation
              </p>
            </div>

            {/* Trust Assurance Card */}
            <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-sand space-y-2 text-xs text-brand-charcoal/70">
              <div className="flex items-center gap-2 font-bold text-brand-emerald">
                <ShieldCheck className="w-4 h-4 text-brand-teal" />
                <span>The Artआलय Offline Peace-of-Mind Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Before pouring resin, our artisan discusses your exact requirements and sends high-resolution layout proofs directly on WhatsApp.
              </p>
              <div className="pt-1.5 border-t border-brand-sand/70 text-[11px] font-bold text-emerald-800">
                🛡️ No upfront payment required. Settle directly with the artisan upon design agreement or on delivery.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

