"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { X, Trash2, Plus, Minus, ShoppingBag, Sparkles, Gift, Tag, ArrowRight, ShieldCheck } from "lucide-react";

export default function CartDrawer() {
  const cart = useCartStore();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!cart.isCartOpen) return null;

  const subtotal = cart.getSubtotal();
  const discount = cart.getDiscountAmount();
  const shipping = cart.getShippingFee();
  const grandTotal = cart.getGrandTotal();
  const tokenBookingAmount = cart.getTokenBookingAmount();
  const remainingTentativeBalance = cart.getRemainingTentativeBalance();
  const freeShippingProgress = Math.min(100, Math.round((subtotal / 999) * 100));

  const handleApplyCoupon = () => {
    const clean = couponInput.trim().toUpperCase();
    if (!clean) return;

    if (clean === "AALAYFIRST10") {
      cart.applyCoupon({
        code: "AALAYFIRST10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        discountAmount: Math.round((subtotal * 10) / 100),
      });
      setCouponError(null);
      setCouponInput("");
    } else if (clean === "FESTIVE500") {
      if (subtotal < 2999) {
        setCouponError("FESTIVE500 requires a minimum order of ₹2,999");
        return;
      }
      cart.applyCoupon({
        code: "FESTIVE500",
        discountType: "FLAT_AMOUNT",
        discountValue: 500,
        discountAmount: 500,
      });
      setCouponError(null);
      setCouponInput("");
    } else {
      setCouponError("Invalid or expired coupon code");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => cart.setCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-brand-ivory h-full shadow-2xl flex flex-col z-10 border-l border-brand-sand">
        {/* Header */}
        <div className="p-5 border-b border-brand-sand flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-emerald" />
            <h3 className="font-serif text-lg font-bold text-brand-emerald">
              Your Shopping Bag ({cart.getItemCount()})
            </h3>
          </div>
          <button
            onClick={() => cart.setCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-brand-sand text-brand-charcoal transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-amber-50/70 border-b border-brand-sand/60 text-xs">
          {subtotal >= 999 ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
              <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
              <span>🎉 Congratulations! You unlocked Free Express Shipping!</span>
            </div>
          ) : (
            <div>
              <p className="text-brand-charcoal font-medium">
                Add <span className="font-bold text-brand-emerald">₹{999 - subtotal}</span> more for Free Express Delivery!
              </p>
              <div className="w-full h-1.5 bg-brand-sand rounded-full overflow-hidden mt-1.5">
                <div
                  style={{ width: `${freeShippingProgress}%` }}
                  className="h-full bg-gradient-to-r from-brand-gold to-brand-emerald rounded-full transition-all duration-300"
                />
              </div>
            </div>
          )}
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 stroke-[1.5]" />
              <p className="font-serif text-base font-bold text-brand-emerald">Your bag is empty</p>
              <p className="text-xs text-brand-charcoal/60 max-w-xs">
                Explore our handcrafted resin nameplates, monograms, and auspicious gifts.
              </p>
              <button
                onClick={() => cart.setCartOpen(false)}
                className="px-6 py-2 rounded-full bg-brand-emerald text-white text-xs font-bold"
              >
                Browse Creations
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-brand-sand shadow-sm flex gap-3"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-brand-sand/50 shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  {item.isCustomizable && (
                    <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-brand-emerald text-brand-sand px-1.5 py-0.5 rounded shadow">
                      Custom
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif text-sm font-bold text-brand-emerald leading-tight line-clamp-1">
                        {item.title}
                      </h4>
                      <button
                        onClick={() => cart.removeItem(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.subtitle && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.subtitle}</p>
                    )}

                    {/* Customized Details Preview Tag */}
                    {item.customizationDetails && (
                      <div className="mt-1 flex flex-wrap items-center gap-1 text-[10px]">
                        {"typography" in item.customizationDetails && item.customizationDetails.typography?.line1 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-sand/60 rounded text-brand-charcoal font-medium">
                            <span className="text-brand-gold font-bold">Text:</span>
                            <span>&ldquo;{item.customizationDetails.typography.line1}&rdquo;</span>
                          </span>
                        )}
                        {"letter" in item.customizationDetails && item.customizationDetails.letter && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-sand/60 rounded text-brand-charcoal font-medium">
                            <span className="text-brand-gold font-bold">Initial:</span>
                            <span className="font-serif font-bold text-brand-teal">{item.customizationDetails.letter}</span>
                          </span>
                        )}
                        {"engravingText" in item.customizationDetails && item.customizationDetails.engravingText && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-sand/60 rounded text-brand-charcoal font-medium">
                            <span className="text-brand-gold font-bold">Quote:</span>
                            <span>&ldquo;{item.customizationDetails.engravingText}&rdquo;</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        Tentative Est.
                      </span>
                      <span className="font-serif text-sm font-bold text-brand-emerald">
                        ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 border border-brand-sand rounded-lg px-2 py-0.5 bg-white">
                      <button
                        onClick={() => cart.updateQuantity(item.id, -1)}
                        className="text-slate-500 hover:text-brand-emerald"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-brand-charcoal min-w-[14px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => cart.updateQuantity(item.id, 1)}
                        className="text-slate-500 hover:text-brand-emerald"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Gifting Suite Card (US-3.2) */}
          {cart.items.length > 0 && (
            <div className="p-4 rounded-2xl border border-brand-gold/30 bg-gradient-to-r from-amber-50/80 to-white shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-brand-gold" />
                  <span className="text-xs font-bold text-brand-charcoal">
                    Send as a Gift (+₹99)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={cart.isGift}
                  onChange={cart.toggleGift}
                  className="w-4 h-4 rounded text-brand-emerald focus:ring-brand-gold cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-brand-charcoal/70">
                Includes real wax-sealed handmade paper card and luxury gift box packaging.
              </p>
              {cart.isGift && (
                <textarea
                  value={cart.giftMessage}
                  onChange={(e) => cart.setGiftMessage(e.target.value)}
                  maxLength={300}
                  placeholder="Enter your heartfelt message (e.g. Wishing you love & joy in your new home!)..."
                  className="w-full p-2.5 rounded-xl border border-brand-sand text-xs focus:ring-2 focus:ring-brand-gold focus:outline-none"
                  rows={2}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer / Summary / Action */}
        {cart.items.length > 0 && (
          <div className="p-5 border-t border-brand-sand bg-white space-y-3">
            {/* Coupon input */}
            <div className="space-y-1">
              {cart.appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Tag className="w-3.5 h-3.5 text-brand-gold" />
                    <span>Coupon &apos;{cart.appliedCoupon.code}&apos; applied (-₹{discount})</span>
                  </div>
                  <button
                    onClick={cart.removeCoupon}
                    className="text-emerald-800 hover:text-red-600 text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. AALAYFIRST10)"
                    className="flex-1 px-3 py-2 rounded-xl border border-brand-sand text-xs uppercase focus:ring-2 focus:ring-brand-gold focus:outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-xl bg-brand-emerald text-white text-xs font-bold hover:bg-brand-teal transition-all"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
            </div>

            {/* Tentative Pricing & Token Deposit Policy Card */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Tentative Pricing &amp; Token Deposit Policy</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                All prices are tentative estimates finalized only after design is discussed and approved over WhatsApp with the artist. <strong>Pay only ₹{tokenBookingAmount.toLocaleString("en-IN")} token deposit today</strong> to initiate discussions.
              </p>
              <p className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 pt-0.5">
                <span>🛡️ If final price or design is not agreed later, 50% of token amount is returned.</span>
              </p>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-brand-charcoal/80 pt-2 border-t border-brand-sand/60">
              <div className="flex justify-between">
                <span>Tentative Items Subtotal</span>
                <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Tentative Discount</span>
                  <span>-₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping (India)</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shipping}`}</span>
              </div>
              {cart.isGift && (
                <div className="flex justify-between">
                  <span>Gift Wrapping &amp; Wax-Sealed Card</span>
                  <span>₹99</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-slate-500 pt-1">
                <span>Tentative Total Order Value</span>
                <span className="font-bold text-brand-charcoal">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Tentative Balance (Due after WhatsApp approval)</span>
                <span>₹{remainingTentativeBalance.toLocaleString("en-IN")}</span>
              </div>

              {/* Token Deposit Highlight */}
              <div className="flex justify-between items-center text-sm font-bold text-brand-emerald pt-2.5 border-t border-brand-sand bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                <div>
                  <span className="block text-brand-emerald font-extrabold">Token Deposit Payable Today</span>
                  <span className="text-[10px] text-emerald-700 font-normal">Initiates 1-on-1 artist WhatsApp consultation</span>
                </div>
                <span className="text-lg font-black text-brand-emerald">₹{tokenBookingAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Primary Checkout CTA */}
            <Link
              href="/checkout"
              onClick={() => cart.setCartOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-brand-emerald hover:bg-brand-teal text-white font-bold text-sm tracking-wide shadow-md transition-all group"
            >
              <span>Pay ₹{tokenBookingAmount.toLocaleString("en-IN")} Token Deposit &amp; Consult ➔</span>
              <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-teal" />
              <span>50% Token Refund Guarantee if final price/design not agreed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

