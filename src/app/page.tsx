"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroArtisanShowcase from "@/components/home/HeroArtisanShowcase";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { CATEGORY_LABELS } from "@/lib/mockData";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Filter,
  Eye,
  Heart,
  Home,
  Palette,
  Sparkle,
} from "lucide-react";

type StorefrontCategory = string;

export default function HomePage() {
  const { products, fetchProducts } = useProductStore();
  const { categories, fetchCategories, getCategoryLabel } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState<StorefrontCategory>("ALL");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const CATEGORY_TABS = [
    { id: "ALL", label: "All Collections", icon: "✨" },
    ...categories.map((c) => ({
      id: c.id,
      label: c.label,
      icon: c.icon || "✨",
    })),
  ];

  const displayedProducts = selectedCategory === "ALL"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section: Desi Modern Luxe & Liquid Glassmorphism */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 bg-gradient-to-b from-brand-sand/50 via-brand-ivory to-white">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-gradient-to-br from-brand-emerald/10 to-brand-gold/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-0 -ml-20 w-80 h-80 rounded-full bg-gradient-to-tr from-brand-teal/10 to-brand-sand blur-2xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Value Copy & Call To Action */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-sand border border-brand-gold/30 text-xs font-bold text-brand-emerald shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Interactive 2D Customizer • Handcrafted in India</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-brand-emerald tracking-tight leading-[1.18]">
                  Handmade &amp; Custom Resin Art, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald via-brand-teal to-brand-gold">
                    Tailored in Discussion with Our Artist
                  </span>
                </h1>

                <p className="text-sm sm:text-base lg:text-lg text-brand-charcoal/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
                  Discover a versatile collection of handcrafted resin creations available for sale — from bespoke entrance nameplates to botanical bookmarks and festive decor — each custom-crafted after personal 1-on-1 consultation between buyer and artist.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                  <a
                    href="#catalog"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-brand-emerald text-brand-sand hover:bg-brand-teal font-bold text-xs sm:text-sm uppercase tracking-wider shadow-hover transition-all active:scale-95 group min-h-[48px]"
                  >
                    <span>Explore Collections &amp; Customize</span>
                    <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="#artisan-story"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-full border-2 border-brand-emerald/20 hover:border-brand-emerald text-brand-emerald font-bold text-xs sm:text-sm tracking-wide transition-all bg-white/50 backdrop-blur-sm min-h-[48px]"
                  >
                    The Artisan Story
                  </a>
                </div>

                {/* Assurance Trust Badges - Responsive Stack on Mobile */}
                <div className="pt-6 sm:pt-8 border-t border-brand-sand/60 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 text-left">
                  <div className="flex items-center gap-2.5 p-2 sm:p-0 bg-white/60 sm:bg-transparent rounded-xl sm:rounded-none border sm:border-0 border-brand-sand/50">
                    <ShieldCheck className="w-5 h-5 text-brand-teal shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-brand-emerald">WhatsApp Proof</h4>
                      <p className="text-[11px] text-brand-charcoal/60">100% Sign-off before pour</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 sm:p-0 bg-white/60 sm:bg-transparent rounded-xl sm:rounded-none border sm:border-0 border-brand-sand/50">
                    <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-brand-emerald">Quality Sourced Bases</h4>
                      <p className="text-[11px] text-brand-charcoal/60">Selected durable foundations</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2 sm:p-0 bg-white/60 sm:bg-transparent rounded-xl sm:rounded-none border sm:border-0 border-brand-sand/50">
                    <HeartHandshake className="w-5 h-5 text-brand-emerald shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-brand-emerald">Free Shipping</h4>
                      <p className="text-[11px] text-brand-charcoal/60">Express courier dispatch</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Multi-Category Artisan Customizer Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <HeroArtisanShowcase />
              </div>
            </div>
          </div>
        </section>

        {/* Collections Catalog with Category Selection Mechanism */}
        <section id="catalog" className="py-20 bg-white border-b border-brand-sand/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                Curated Artisan Drops
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-emerald mt-2">
                Handcrafted Collections
              </h2>
              <p className="text-sm text-brand-charcoal/70 mt-3">
                Each piece is custom poured in small artisanal batches using carefully sourced durable bases, real botanicals, and high-gloss non-yellowing optical resin.
              </p>
            </div>

            {/* CATEGORY SELECTOR MECHANISM */}
            <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-3 no-scrollbar px-3 sm:px-2 touch-pan-x">
              {CATEGORY_TABS.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = cat.id === "ALL"
                  ? products.length
                  : products.filter((p) => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 min-h-[40px] whitespace-nowrap active:scale-95 ${
                      isSelected
                        ? "bg-brand-emerald text-white shadow-md ring-2 ring-brand-emerald/30 scale-105"
                        : "bg-brand-sand text-brand-charcoal hover:bg-brand-sand/80 hover:text-brand-emerald"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? "bg-brand-gold text-brand-emerald"
                          : "bg-white text-brand-charcoal/70"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Product Grid (Reflects all CMS creations in real-time, dummy ratings removed) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {displayedProducts.length === 0 ? (
                <div className="col-span-full py-16 text-center text-brand-charcoal/60 bg-brand-sand/30 rounded-3xl border border-brand-sand">
                  <p className="font-serif text-lg font-bold text-brand-emerald">
                    No creations found in &ldquo;{getCategoryLabel(selectedCategory) || selectedCategory}&rdquo;
                  </p>
                  <p className="text-xs mt-1">
                    Select &ldquo;All Collections&rdquo; to browse all available pieces.
                  </p>
                </div>
              ) : (
                displayedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group bg-brand-ivory rounded-3xl overflow-hidden border border-brand-sand hover:border-brand-gold/50 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col"
                  >
                    {/* Image Container with Badges (NO DUMMY RATINGS) */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-brand-sand/50">
                      <Image
                        src={prod.imageUrl}
                        alt={prod.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Category Pill */}
                      <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-sm text-brand-emerald shadow-xs border border-brand-sand">
                        {getCategoryLabel(prod.category) || CATEGORY_LABELS[prod.category] || prod.category}
                      </span>

                      {/* Merchandising Badge */}
                      {prod.badge && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-emerald text-brand-sand shadow-sm flex items-center gap-1.5">
                          {prod.badge === "BESTSELLER" && "🔥"}
                          {prod.badge === "MASTERPIECE" && "👑"}
                          {prod.badge === "FESTIVE_SPECIAL" && "🪔"}
                          {prod.badge === "NEW_ARRIVAL" && "✨"}
                          {prod.badge === "LIMITED_EDITION" && "⏳"}
                          <span>{prod.badge.replace("_", " ")}</span>
                        </span>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-brand-emerald group-hover:text-brand-teal transition-colors">
                          {prod.title}
                        </h3>
                        <p className="text-xs text-brand-charcoal/70 mt-1 line-clamp-2 leading-relaxed">
                          {prod.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-brand-sand/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-brand-charcoal/60 block font-bold uppercase tracking-wider">
                            Tentative Est.
                          </span>
                          <span className="font-serif text-xl font-bold text-brand-emerald">
                            ₹{prod.basePrice.toLocaleString("en-IN")}
                          </span>
                          <span className="block text-[9px] text-emerald-800 font-semibold">
                            Pay Offline
                          </span>
                        </div>

                        {prod.isCustomizable ? (
                          <Link
                            href={`/customize/${prod.slug}`}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-brand-emerald text-brand-sand hover:bg-brand-teal transition-all"
                          >
                            <span>Customize</span>
                            <Sparkles className="w-3 h-3 text-brand-gold" />
                          </Link>
                        ) : (
                          <Link
                            href={`/customize/${prod.slug}`}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-brand-sand text-brand-emerald hover:bg-white border border-brand-sand transition-all"
                          >
                            <span>View Piece</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* THE ARTISAN STORY: Small Home-Based Artist Creating Diverse Art */}
        <section id="artisan-story" className="py-24 bg-brand-sand/40 border-b border-brand-sand relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Visual Showcase */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-brand-emerald">
                  <Image
                    src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
                    alt="Artisan at work in home studio"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-emerald/90 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold bg-brand-emerald/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      Home-Based Small Studio
                    </span>
                    <h4 className="font-serif text-xl font-bold">
                      Born from Passion, Poured with Love
                    </h4>
                    <p className="text-xs text-white/80">
                      Every bespoke piece is crafted in small mindful batches from a cozy home art space.
                    </p>
                  </div>
                </div>

                {/* Floating Artisan Quote Badge */}
                <div className="absolute -bottom-6 -right-4 bg-white p-4 rounded-2xl border border-brand-sand shadow-xl max-w-xs hidden sm:block">
                  <p className="font-serif italic text-xs text-brand-charcoal">
                    &ldquo;Art isn&rsquo;t made on assembly lines. It lives in the quiet moments of curating quality materials, mixing pigments, and handcrafting each creation with the customer at heart.&rdquo;
                  </p>
                  <p className="text-[10px] font-bold text-brand-emerald mt-2 uppercase tracking-wider">
                    — The Artआलय Artisan
                  </p>
                </div>
              </div>

              {/* Story Narrative */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald text-xs font-bold uppercase tracking-widest mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                    The Artisan Story
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-emerald leading-tight">
                    A Passionate Artist Crafting Beauty with Heart &amp; Purpose
                  </h2>
                </div>

                <div className="space-y-4 text-sm text-brand-charcoal/80 leading-relaxed font-sans">
                  <p>
                    <strong>Artआलय</strong> did not begin in a corporate factory. It started as a heartfelt dream in a <strong>cozy home studio</strong>, run by an independent artist driven by the joy of turning raw materials into meaningful, personalized keepsakes.
                  </p>
                  <p>
                    We believe true craft begins with honesty and thoughtful curation. While base substrates like durable MDF plaques and wooden blanks are carefully sourced from trusted outside makers, our artistry lies in selecting the best input materials, inspecting each foundation, and pouring our devotion into every custom detail. From high-grade optical resin that resists yellowing to hand-pressed botanicals and custom typography, the customer is at the center of every piece we create.
                  </p>
                </div>

                {/* 4 Pillars of Diverse Craft */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-brand-sand shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌊</span>
                      <h4 className="font-serif font-bold text-sm text-brand-emerald">
                        Fluid Ocean Resin
                      </h4>
                    </div>
                    <p className="text-xs text-brand-charcoal/70">
                      Hand-blended epoxy resin layered with realistic shoreline frothing, mirror shine, and lasting optical clarity.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-brand-sand shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🪵</span>
                      <h4 className="font-serif font-bold text-sm text-brand-emerald">
                        Carefully Sourced Bases
                      </h4>
                    </div>
                    <p className="text-xs text-brand-charcoal/70">
                      Reliable, durable MDF and wood-finish bases sourced from trusted makers, prepped for seamless resin adhesion.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-brand-sand shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🌸</span>
                      <h4 className="font-serif font-bold text-sm text-brand-emerald">
                        Botanical Flower Pressing
                      </h4>
                    </div>
                    <p className="text-xs text-brand-charcoal/70">
                      Real wild chamomile, Himalayan ferns, and rose petals moisture-cured to preserve their natural vibrant bloom.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-brand-sand shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🪔</span>
                      <h4 className="font-serif font-bold text-sm text-brand-emerald">
                        Sacred Crystals &amp; Geodes
                      </h4>
                    </div>
                    <p className="text-xs text-brand-charcoal/70">
                      Auspicious entrance decor adorned with crystal quartz chips and 24K gold foil accents.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-brand-charcoal/70 italic border-l-2 border-brand-gold pl-3">
                  &ldquo;When you order from Artआलय, you aren&rsquo;t supporting a machine. You are bringing home a piece crafted with patience, quality materials, and a deep commitment to putting you at the heart of our craft.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The 1-on-1 WhatsApp Consultation & Customization Workflow */}
        <section id="proof-process" className="py-20 bg-white border-b border-brand-sand">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                1-on-1 Artisan Collaboration
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-brand-emerald mt-2">
                How Bespoke Artआलय Pieces Are Created
              </h2>
              <p className="text-sm text-brand-charcoal/70 mt-3">
                No rigid machines or fixed dates. Delivery schedules and final pricing are discussed and agreed directly over WhatsApp with the artist.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-brand-ivory p-8 rounded-3xl border border-brand-sand shadow-soft space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-sand flex items-center justify-center text-brand-emerald font-serif font-bold text-xl">
                  1
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-emerald">1. Choose Piece &amp; Order (Pay Offline)</h3>
                <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                  Browse our handcrafted creations, enter your custom ideas or notes, and place your order with <strong>zero upfront online payment</strong> to secure your spot in our workshop queue.
                </p>
              </div>

              <div className="bg-brand-ivory p-8 rounded-3xl border border-brand-sand shadow-soft space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 flex items-center justify-center text-brand-emerald font-serif font-bold text-xl">
                  2
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-emerald">2. Agree Delivery Date &amp; Price on WhatsApp</h3>
                <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                  All website prices are tentative. Our artist connects with you on WhatsApp to review custom options, send layout photos, agree upon the final price, and confirm your delivery date. (Settle payment offline via Direct UPI or Cash).
                </p>
              </div>

              <div className="bg-brand-ivory p-8 rounded-3xl border border-brand-sand shadow-soft space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-emerald/15 flex items-center justify-center text-brand-emerald font-serif font-bold text-xl">
                  3
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-emerald">3. Mindful Handcraft &amp; Safe Dispatch</h3>
                <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                  Once price and layout are approved, your piece is hand-poured with UV-resistant optical resin, slow-cured, safely packed in custom EVA foam, and dispatched to arrive on your confirmed date.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
