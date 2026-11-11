"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useProductStore } from "@/store/useProductStore";

interface FeaturedCraft {
  id: string;
  category: string;
  tabLabel: string;
  tabIcon: string;
  title: string;
  tagline: string;
  startingPrice: string;
  imageUrl: string;
  slug: string;
  badges: string[];
}

// Curated artisan craft presets for core & popular categories
const DEFAULT_CRAFT_PRESETS: Record<
  string,
  {
    title: string;
    tagline: string;
    startingPrice: string;
    imageUrl: string;
    slug: string;
    badges: string[];
  }
> = {
  NAMEPLATES: {
    title: "Ocean Breeze Luxury Nameplate",
    tagline: "Quality Sourced Base • Fluid Ocean Froth • Laser Cut Gold",
    startingPrice: "₹2,499",
    imageUrl: "/uploads/artisan_1793624355610_kdlqxn.jpg",
    slug: "ocean-breeze-luxury-resin-nameplate",
    badges: ["🪵 Quality Sourced Base", "✨ 3D Gold Acrylic", "💡 Backlit LED Option"],
  },
  KEYRINGS: {
    title: "Crystal Monogram Resin Letter Keyring",
    tagline: "High-Gloss Crystal Monogram • 24K Gold Foil • Real Rose Petals",
    startingPrice: "₹349",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    slug: "crystal-initial-keyring",
    badges: ["🔤 Custom Monogram", "✨ 24K Gold Leaf", "💎 UV-Stabilized Resin"],
  },
  BOOKMARKS: {
    title: "Personalized Blush Luxe Bookmark",
    tagline: "Hand-Pressed Botanical Flora • Silken Tassel • 24K Flecks",
    startingPrice: "₹299",
    imageUrl: "/uploads/artisan_1793624077021_od4s4j.jpg",
    slug: "personalized-blush-luxe-resin-bookmark",
    badges: ["🌸 Real Botanicals", "✍️ Custom Name", "🧵 Silk Tassel"],
  },
  FESTIVE: {
    title: "Lotus Blessings Shubh Labh Set",
    tagline: "Auspicious Entrance Hangings • Raw Geode Quartz • 3D Gold Devanagari",
    startingPrice: "₹799",
    imageUrl: "/uploads/artisan_1793624415378_jn2rvq.jpg",
    slug: "lotus-blessings-shubh-labh-wall-hanging",
    badges: ["🪔 Mandir & Entrance", "💎 Raw Crystals", "✨ Hand-Poured"],
  },
  COASTERS: {
    title: "Imperial Geode Agate Coasters",
    tagline: "Luxury Drink Coasters • Raw Crystal Clusters • 24K Gilded Edges",
    startingPrice: "₹899",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    slug: "imperial-geode-coasters",
    badges: ["☕ Heat Resistant", "✨ 24K Gilded Rim", "💎 Raw Crystal Inlay"],
  },
  WALL_CLOCKS: {
    title: "Celestial Geode Wall Clock",
    tagline: "Statement Roman Numerals • Silent Quartz Movement • Crystal Veins",
    startingPrice: "₹2,999",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    slug: "celestial-geode-wall-clock",
    badges: ["🕒 Silent Quartz", "✨ 3D Roman Numerals", "💎 Geode Crystals"],
  },
  TRAYS: {
    title: "Opulent Vanity Serving Platter",
    tagline: "Hand-Poured Marbled Fluid Resin • Brushed Brass Handles",
    startingPrice: "₹1,899",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    slug: "opulent-vanity-serving-platter",
    badges: ["🍱 Food-Safe Resin", "✨ Brass Handles", "🌿 Marbled Swirl"],
  },
  TRINKETS: {
    title: "Botanical Floral Trinket Dish",
    tagline: "Pressed Jasmine & Ferns • 24K Gold Leaf • Ring Holder",
    startingPrice: "₹499",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    slug: "botanical-floral-trinket-dish",
    badges: ["💍 Jewelry Safe", "🌸 Real Botanicals", "✨ 24K Gold Flecks"],
  },
  MANTRA_FRAMES: {
    title: "Sacred Gayatri Mantra Wall Frame",
    tagline: "Devanagari Calligraphy • High-Gloss Optical Resin • Backlit Glow",
    startingPrice: "₹3,499",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    slug: "sacred-gayatri-mantra-wall-frame",
    badges: ["🕉️ Sacred Devanagari", "💡 Backlit Option", "✨ High-Gloss Finish"],
  },
};

// Initial default crafts during SSR/pre-hydration
const INITIAL_FALLBACK_CRAFTS: FeaturedCraft[] = [
  {
    id: "nameplates",
    category: "NAMEPLATES",
    tabLabel: "Nameplate",
    tabIcon: "🌊",
    title: DEFAULT_CRAFT_PRESETS.NAMEPLATES.title,
    tagline: DEFAULT_CRAFT_PRESETS.NAMEPLATES.tagline,
    startingPrice: DEFAULT_CRAFT_PRESETS.NAMEPLATES.startingPrice,
    imageUrl: DEFAULT_CRAFT_PRESETS.NAMEPLATES.imageUrl,
    slug: DEFAULT_CRAFT_PRESETS.NAMEPLATES.slug,
    badges: DEFAULT_CRAFT_PRESETS.NAMEPLATES.badges,
  },
  {
    id: "bookmarks",
    category: "BOOKMARKS",
    tabLabel: "Bookmark",
    tabIcon: "🌸",
    title: DEFAULT_CRAFT_PRESETS.BOOKMARKS.title,
    tagline: DEFAULT_CRAFT_PRESETS.BOOKMARKS.tagline,
    startingPrice: DEFAULT_CRAFT_PRESETS.BOOKMARKS.startingPrice,
    imageUrl: DEFAULT_CRAFT_PRESETS.BOOKMARKS.imageUrl,
    slug: DEFAULT_CRAFT_PRESETS.BOOKMARKS.slug,
    badges: DEFAULT_CRAFT_PRESETS.BOOKMARKS.badges,
  },
  {
    id: "festive",
    category: "FESTIVE",
    tabLabel: "Toran / Shubh Labh",
    tabIcon: "🪔",
    title: DEFAULT_CRAFT_PRESETS.FESTIVE.title,
    tagline: DEFAULT_CRAFT_PRESETS.FESTIVE.tagline,
    startingPrice: DEFAULT_CRAFT_PRESETS.FESTIVE.startingPrice,
    imageUrl: DEFAULT_CRAFT_PRESETS.FESTIVE.imageUrl,
    slug: DEFAULT_CRAFT_PRESETS.FESTIVE.slug,
    badges: DEFAULT_CRAFT_PRESETS.FESTIVE.badges,
  },
  {
    id: "keyrings",
    category: "KEYRINGS",
    tabLabel: "Keyrings",
    tabIcon: "🔑",
    title: DEFAULT_CRAFT_PRESETS.KEYRINGS.title,
    tagline: DEFAULT_CRAFT_PRESETS.KEYRINGS.tagline,
    startingPrice: DEFAULT_CRAFT_PRESETS.KEYRINGS.startingPrice,
    imageUrl: DEFAULT_CRAFT_PRESETS.KEYRINGS.imageUrl,
    slug: DEFAULT_CRAFT_PRESETS.KEYRINGS.slug,
    badges: DEFAULT_CRAFT_PRESETS.KEYRINGS.badges,
  },
];

export default function HeroArtisanShowcase() {
  const { categories, fetchCategories } = useCategoryStore();
  const { products, fetchProducts } = useProductStore();
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Sync latest categories & catalog products from server disk on mount
  useEffect(() => {
    setMounted(true);
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  // Dynamically resolve featured craft for every active category
  const featuredCrafts: FeaturedCraft[] = useMemo(() => {
    if (!mounted || categories.length === 0) {
      return INITIAL_FALLBACK_CRAFTS;
    }

    return categories.map((cat) => {
      const catKey = cat.id.toUpperCase();
      const matchingProduct = products.find(
        (p) => (p.category || "").toUpperCase() === catKey
      );
      const preset = DEFAULT_CRAFT_PRESETS[catKey];

      const title = matchingProduct?.title || preset?.title || `Bespoke ${cat.label}`;
      const tagline =
        matchingProduct?.subtitle ||
        preset?.tagline ||
        cat.description ||
        "Quality Sourced Base • Fluid Optical Resin • 24K Gold Embellishments";
      const startingPrice = matchingProduct
        ? `₹${matchingProduct.basePrice.toLocaleString("en-IN")}`
        : preset?.startingPrice || "₹999";
      const imageUrl =
        matchingProduct?.imageUrl ||
        preset?.imageUrl ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80";
      const slug =
        matchingProduct?.slug ||
        preset?.slug ||
        `bespoke-${cat.slug || cat.id.toLowerCase()}`;
      const badges =
        matchingProduct?.tags && matchingProduct.tags.length > 0
          ? matchingProduct.tags.slice(0, 3).map((t, i) => `${i === 0 ? "✨" : i === 1 ? "💎" : "🪵"} ${t}`)
          : preset?.badges || ["🎨 Handcrafted", "✨ Optical Resin", "💬 WhatsApp Proof"];

      return {
        id: cat.id.toLowerCase(),
        category: cat.id,
        tabLabel: cat.label,
        tabIcon: cat.icon || "✨",
        title,
        tagline,
        startingPrice,
        imageUrl,
        slug,
        badges,
      };
    });
  }, [mounted, categories, products]);

  // Ensure activeIndex is within range
  const safeIndex = activeIndex < featuredCrafts.length ? activeIndex : 0;
  const activeCraft = featuredCrafts[safeIndex] || featuredCrafts[0];

  // Auto-scroll the active category pill into center view smoothly
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeBtn = tabsContainerRef.current.children[safeIndex] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [safeIndex]);

  // Auto-cycle through categories every 6 seconds if not hovered
  useEffect(() => {
    if (isPaused || featuredCrafts.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredCrafts.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, featuredCrafts.length]);

  return (
    <div
      className="relative w-full max-w-lg mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glow */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-brand-gold/30 via-brand-teal/20 to-brand-emerald/30 blur-2xl opacity-75 pointer-events-none" />

      {/* Main Glassmorphic Showcase Card */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-brand-sand shadow-2xl p-3 sm:p-5 flex flex-col space-y-3 sm:space-y-4">
        {/* Category Switcher Tabs - Dynamic Horizontal Scroll with Center Focus */}
        <div className="relative">
          <div
            ref={tabsContainerRef}
            className="flex items-center gap-1.5 p-1 sm:p-1.5 bg-brand-sand/60 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth touch-pan-x"
          >
            {featuredCrafts.map((craft, idx) => {
              const isCurrent = idx === safeIndex;
              return (
                <button
                  key={craft.id}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsPaused(true);
                  }}
                  className={`py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap min-h-[36px] active:scale-95 ${isCurrent
                      ? "bg-brand-emerald text-white shadow-sm scale-102 ring-1 ring-brand-emerald/30"
                      : "text-brand-charcoal/70 hover:text-brand-emerald hover:bg-white/70"
                    }`}
                >
                  <span className="text-sm shrink-0">{craft.tabIcon}</span>
                  <span className="shrink-0">{craft.tabLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Showcase Stage */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-sand/40 group">
          <Image
            src={activeCraft.imageUrl}
            alt={activeCraft.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority
          />

          {/* Gradient Overlay for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Top Floating Badges */}
          <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between gap-1.5 sm:gap-2 z-10">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold border border-white/20 shadow-sm shrink-0">
              <Sparkles className="w-3 h-3 text-brand-gold shrink-0" />
              <span>Interactive 2D Studio</span>
            </span>

            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-brand-gold text-brand-emerald text-[11px] sm:text-xs font-bold shadow-md shrink-0">
              From {activeCraft.startingPrice}
            </span>
          </div>

          {/* Bottom Card Content */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 z-10 text-white space-y-1.5 sm:space-y-2">
            <div>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-brand-gold block">
                {activeCraft.category}
              </span>
              <h3 className="font-serif text-base sm:text-xl font-bold leading-tight drop-shadow-sm line-clamp-1 sm:line-clamp-none">
                {activeCraft.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-white/80 line-clamp-1 mt-0.5 font-sans">
                {activeCraft.tagline}
              </p>
            </div>

            {/* Artisanal Feature Chips */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-0.5">
              {activeCraft.badges.map((badge, bIdx) => (
                <span
                  key={bIdx}
                  className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[9px] sm:text-[10px] font-medium text-white/90 border border-white/10 shrink-0"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar - Optimized for Mobile Browsing & One-Handed Tap */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-1 gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs text-brand-charcoal/70 justify-center sm:justify-start">
            <ShieldCheck className="w-4 h-4 text-brand-emerald shrink-0" />
            <span className="text-[11px] font-medium">WhatsApp Proof Approval</span>
          </div>

          <Link
            href={`/customize/${activeCraft.slug}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 sm:py-2.5 rounded-full bg-gradient-to-r from-brand-emerald to-brand-teal text-white hover:opacity-95 font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all text-center min-h-[44px]"
          >
            <span>Customize This Piece</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-gold shrink-0" />
          </Link>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3 overflow-x-auto no-scrollbar py-1">
        {featuredCrafts.map((craft, idx) => (
          <button
            key={craft.id}
            type="button"
            onClick={() => {
              setActiveIndex(idx);
              setIsPaused(true);
            }}
            aria-label={`View ${craft.title}`}
            className={`transition-all rounded-full ${idx === safeIndex
                ? "w-6 h-1.5 bg-brand-emerald"
                : "w-1.5 h-1.5 bg-brand-emerald/30 hover:bg-brand-emerald/60"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
