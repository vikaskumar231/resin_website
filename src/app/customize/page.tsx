"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { CATEGORY_LABELS } from "@/lib/mockData";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Filter,
  Flame,
  Crown,
  Sparkle,
  Compass,
} from "lucide-react";

type CategoryFilter = string;

export default function CustomizeIndexPage() {
  const { products, fetchProducts } = useProductStore();
  const { categories, fetchCategories, getCategoryLabel } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("ALL");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const CATEGORIES = [
    { id: "ALL", label: "All Studios", icon: "✨" },
    ...categories.map((c) => ({
      id: c.id,
      label: c.label,
      icon: c.icon || "✨",
    })),
  ];

  // Filter products by category, prioritizing customizable items
  const displayedProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    return matchesCategory;
  });

  const getAspectBadge = (category: string) => {
    switch (category) {
      case "KEYRINGS":
        return "Aspect 1:1 • Monogram Square";
      case "BOOKMARKS":
        return "Aspect 4:10 • Botanical Strip";
      case "FESTIVE":
        return "Dual Geode Discs • Toran Set";
      case "COASTERS":
        return "Set of 4 • Hex/Round Coasters";
      case "WALL_CLOCKS":
        return "Aspect 1:1 • Geode Wall Clock";
      case "TRAYS":
        return "Vanity Platter • Gold Handles";
      case "TRINKETS":
        return "Petite Dish • Jewelry Organizer";
      case "MANTRA_FRAMES":
        return "Auspicious Shloka Frame";
      case "NAMEPLATES":
      default:
        return "Aspect 16:10 • Timber Plank";
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 bg-gradient-to-b from-brand-sand/50 via-brand-ivory to-white border-b border-brand-sand/60">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-gradient-to-br from-brand-emerald/10 to-brand-gold/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 w-72 h-72 rounded-full bg-gradient-to-tr from-brand-teal/10 to-brand-sand blur-2xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-sand border border-brand-gold/40 text-xs font-bold text-brand-emerald shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
              <span>Interactive 2D Artisan Studios</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-brand-emerald tracking-tight">
              Choose Your Artisan Canvas
            </h1>

            <p className="text-sm sm:text-base text-brand-charcoal/80 max-w-2xl mx-auto font-sans leading-relaxed">
              Every handcrafted form has its own tactile geometry. Select a collection below to launch its tailored live visualizer, configure bespoke pigments and personalization, and approve your proof in real-time.
            </p>

            {/* Category Filter Pills Deck */}
            <div className="pt-6 flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-3 no-scrollbar px-3 sm:px-2 touch-pan-x">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count =
                  cat.id === "ALL"
                    ? products.length
                    : products.filter((p) => p.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 min-h-[40px] whitespace-nowrap active:scale-95 ${
                      isSelected
                        ? "bg-brand-emerald text-white shadow-md ring-2 ring-brand-emerald/30 scale-105"
                        : "bg-white text-brand-charcoal hover:bg-brand-sand border border-brand-sand/80"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? "bg-brand-gold text-brand-emerald"
                          : "bg-brand-sand text-brand-charcoal/70"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Collections Studio Bento Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {displayedProducts.map((prod) => {
              const aspectBadge = getAspectBadge(prod.category);

              return (
                <div
                  key={prod.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-brand-sand hover:border-brand-gold/60 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Image Showcase */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand-sand/40">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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

                    {/* Aspect Ratio Guide */}
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[9px] font-mono font-semibold bg-black/60 text-white backdrop-blur-sm">
                      {aspectBadge}
                    </span>
                  </div>

                  {/* Body Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-emerald group-hover:text-brand-teal transition-colors line-clamp-1">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-brand-charcoal/70 mt-1 line-clamp-2 leading-relaxed">
                        {prod.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-brand-sand/60 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-brand-charcoal/50 block tracking-wider">
                          Tentative Est.
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-xl font-bold text-brand-emerald">
                            ₹{prod.basePrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-semibold">
                            Pay Offline
                          </span>
                        </div>
                      </div>

                      {/* Launch Studio Action Button */}
                      <Link
                        href={`/customize/${prod.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-emerald text-brand-sand hover:bg-brand-teal shadow-soft hover:shadow-md transition-all active:scale-95 group/btn"
                      >
                        <span>Customize Piece</span>
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold group-hover/btn:rotate-12 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Studio Guarantees */}
        <section className="py-12 bg-brand-sand/30 border-t border-brand-sand/60">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-white/70 rounded-2xl border border-brand-sand/60">
              <ShieldCheck className="w-6 h-6 text-brand-teal mx-auto mb-2" />
              <h4 className="text-xs font-bold text-brand-emerald">WhatsApp Photo Approval</h4>
              <p className="text-[11px] text-brand-charcoal/70 mt-1">
                The artisan photographs your layout and cured piece directly on WhatsApp for your approval before packing.
              </p>
            </div>
            <div className="p-4 bg-white/70 rounded-2xl border border-brand-sand/60">
              <Sparkles className="w-6 h-6 text-brand-gold mx-auto mb-2" />
              <h4 className="text-xs font-bold text-brand-emerald">Non-Yellowing High-Gloss Resin</h4>
              <p className="text-[11px] text-brand-charcoal/70 mt-1">
                UV-stabilized optical clarity with diamond luster that retains mirror shine and resists yellowing.
              </p>
            </div>
            <div className="p-4 bg-white/70 rounded-2xl border border-brand-sand/60">
              <span className="text-2xl block mb-2">🛡️</span>
              <h4 className="text-xs font-bold text-brand-emerald">Zero Online Risk</h4>
              <p className="text-[11px] text-brand-charcoal/70 mt-1">
                Zero upfront payment required. Settle offline via Direct UPI or Cash upon design agreement or arrival.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
