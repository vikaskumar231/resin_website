import React from "react";
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, Truck, RefreshCcw } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-emerald text-brand-sand pt-16 pb-12 border-t border-brand-teal/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-brand-teal/50 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/40 flex items-center justify-center text-brand-gold mb-2">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-white">High-Gloss Non-Yellowing Resin</h4>
            <p className="text-xs text-brand-sand/70 leading-relaxed">
              Ultra-clear optical resin with diamond luster that resists yellowing and retains high shine.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/40 flex items-center justify-center text-brand-gold mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-white">WhatsApp Proof Approval</h4>
            <p className="text-xs text-brand-sand/70 leading-relaxed">
              We send a high-res photo proof before pouring. You approve or get adjustments.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/40 flex items-center justify-center text-brand-gold mb-2">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-white">Reinforced Transit Foam</h4>
            <p className="text-xs text-brand-sand/70 leading-relaxed">
              Tri-layer high-density EVA custom cutout packaging for zero transit breakage.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-teal/40 flex items-center justify-center text-brand-gold mb-2">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold text-white">Handcrafted in India</h4>
            <p className="text-xs text-brand-sand/70 leading-relaxed">
              Every curve, wave, and gold fleck is placed by Indian resin masters.
            </p>
          </div>
        </div>

        {/* Brand and Links */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <span className="text-2xl font-serif font-bold text-white tracking-wide">
              Art<span className="text-brand-gold font-serif">आलय</span>
            </span>
            <p className="text-sm text-brand-sand/80 max-w-sm leading-relaxed">
              Artआलय celebrates the union of raw nature and modern fluid artistry. Bringing high-gloss custom resin decor to modern Indian homes.
            </p>
            <div className="text-xs text-brand-sand/60">
              © {new Date().getFullYear()} Artआलय Studio. All rights reserved. Registered under Indian MSME Act.
            </div>
          </div>

          <div>
            <h5 className="font-serif text-sm font-bold text-brand-gold uppercase tracking-wider mb-4">
              Explore
            </h5>
            <ul className="space-y-2 text-sm text-brand-sand/80">
              <li><Link href="/customize/bespoke-teakwood-nameplate" className="hover:text-white">Nameplate</Link></li>
              <li><Link href="/customize/crystal-initial-keyring" className="hover:text-white">Keyrings</Link></li>
              <li><Link href="/customize/pressed-floral-bookmark" className="hover:text-white">Bookmark</Link></li>
              <li><Link href="#catalog" className="hover:text-white">Toran/Shubh Labh</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-bold text-brand-gold uppercase tracking-wider mb-4">
              Artisan Workshop
            </h5>
            <ul className="space-y-2 text-sm text-brand-sand/80">
              <li><Link href="/login" className="hover:text-white">Artisan Studio Login</Link></li>
              <li><Link href="/account/orders" className="hover:text-white">Order Status Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-serif text-sm font-bold text-brand-gold uppercase tracking-wider mb-4">
              Payment & Trust
            </h5>
            <div className="space-y-2 text-xs text-brand-sand/70">
              <p>UPI Intent (GPay, PhonePe, Paytm)</p>
              <p>Debit/Credit Cards & NetBanking via Razorpay</p>
              <p>Anti-RTO ₹199 advance deposit for customized COD</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

