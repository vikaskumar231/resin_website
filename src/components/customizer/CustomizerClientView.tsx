"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import CustomizerCanvas from "@/components/customizer/CustomizerCanvas";
import CustomizerControls from "@/components/customizer/CustomizerControls";
import { useProductStore } from "@/store/useProductStore";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { HERO_PRODUCTS, ProductCatalogItem, CATEGORY_LABELS } from "@/lib/mockData";
import { ArrowLeft, Sparkles, ShieldCheck, MessageSquare } from "lucide-react";

interface CustomizerClientViewProps {
  initialSlug: string;
  initialProduct?: ProductCatalogItem;
}

export default function CustomizerClientView({
  initialSlug,
  initialProduct,
}: CustomizerClientViewProps) {
  const { products, fetchProducts } = useProductStore();
  const { getCategoryLabel, fetchCategories } = useCategoryStore();
  const customizerStore = useCustomizerStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Dynamically resolve product from useProductStore, with fallbacks
  const activeProduct =
    products.find((p) => p.slug === initialSlug || p.id === initialSlug) ||
    initialProduct ||
    HERO_PRODUCTS.find((p) => p.slug === initialSlug || p.id === initialSlug) ||
    products[0] ||
    HERO_PRODUCTS[0];

  // Initialize customizer store with product and category
  useEffect(() => {
    if (activeProduct) {
      customizerStore.initProduct(activeProduct.slug, activeProduct.category);
      if (activeProduct.imageUrl) {
        customizerStore.setProductImage(activeProduct.imageUrl);
      }
    }
  }, [activeProduct?.slug, activeProduct?.category, activeProduct?.imageUrl]);

  const getAspectLabel = (category: string) => {
    switch (category) {
      case "KEYRINGS":
        return "Aspect 1:1 (Monogram) • Scale: Actual";
      case "BOOKMARKS":
        return "Aspect 4:10 (Portrait) • Scale: Actual";
      case "FESTIVE":
        return "Dual Geode Discs (Toran Set) • Scale: Actual";
      case "COASTERS":
        return "Set of 4 (Hex/Round Coasters) • Scale: Actual";
      case "WALL_CLOCKS":
        return "Aspect 1:1 (Geode Clock) • Scale: Actual";
      case "TRAYS":
        return "Vanity Platter (Gold Handles) • Scale: Actual";
      case "TRINKETS":
        return "Petite Dish (Jewelry Trinket) • Scale: Actual";
      case "MANTRA_FRAMES":
        return "Devotional Mantra Frame • Scale: Actual";
      case "NAMEPLATES":
      default:
        return "Aspect 16:10 (Plank) • Scale: Actual";
    }
  };

  const getStudioTip = (category: string) => {
    switch (category) {
      case "KEYRINGS":
        return "Tip: Pick your alphabet letter, resin style, and custom notes in the drawer to preview your custom keyring.";
      case "BOOKMARKS":
        return "Tip: Select botanical floral specimens, metallic foils, silk tassels, and custom quotes in the drawer to preview your bespoke bookmark.";
      case "FESTIVE":
        return "Tip: Choose your sacred geode resin tone, raw crystal inlays, auspicious Devanagari calligraphy, and hanging brass bells.";
      case "COASTERS":
        return "Tip: Configure resin pigment colorways, metallic edge leafing, and floral inclusions for your handmade coasters.";
      case "WALL_CLOCKS":
        return "Tip: Choose geode crystal lines, roman numerals, and silent quartz movement for your wall clock.";
      case "TRAYS":
        return "Tip: Choose marble swirl pigments, gold leafing handles, and crystal border for your vanity tray.";
      case "TRINKETS":
        return "Tip: Select botanical florals, gold flecks, and personalized monogram initials for your keepsake dish.";
      case "MANTRA_FRAMES":
        return "Tip: Choose sacred Devanagari shloka engravings, radiant resin borders, and gold leaf calligraphy.";
      case "NAMEPLATES":
      default:
        return "Tip: Toggle Resin Swatches, Inclusions, and Sacred Emblems in the drawer to preview your custom design.";
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            href="/#catalog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-charcoal/70 hover:text-brand-emerald transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Collections</span>
          </Link>

          <div className="flex items-center gap-4 text-xs text-brand-charcoal/70">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-brand-teal" />
              WhatsApp Proof Before Pour
            </span>
            <span className="hidden sm:flex items-center gap-1.5 font-medium">
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              Delivery Date &amp; Final Price Finalized on WhatsApp
            </span>
          </div>
        </div>

        {/* Product Customizer Title Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-sand border border-brand-gold/40 text-[11px] font-bold text-brand-emerald mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            <span>
              2D Interactive Artisan Studio • {getCategoryLabel(activeProduct.category) || CATEGORY_LABELS[activeProduct.category] || activeProduct.category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-emerald">
            {activeProduct.title}
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal/70 mt-1 max-w-2xl">
            {activeProduct.subtitle}
          </p>
        </div>

        {/* 2-Column Responsive Customizer Studio: 55% Stage / 45% Controls Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Visualizer Stage */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full bg-white/70 backdrop-blur-md rounded-3xl border border-brand-sand/80 p-4 sm:p-6 shadow-soft flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-brand-sand/50 text-xs text-brand-charcoal/60 mb-2">
                <span className="font-serif font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                  Live 2D Artisan Preview
                </span>
                <span className="font-mono text-[11px]">
                  {getAspectLabel(activeProduct.category)}
                </span>
              </div>

              {/* The Live Interactive Canvas Stage */}
              <CustomizerCanvas slug={activeProduct.slug} category={activeProduct.category} />

              <div className="mt-4 text-center">
                <p className="text-[11px] text-brand-charcoal/60">
                  {getStudioTip(activeProduct.category)}
                </p>
              </div>
            </div>
          </div>

          {/* Right Configuration Controls Drawer */}
          <div className="lg:col-span-5 w-full">
            <CustomizerControls slug={activeProduct.slug} category={activeProduct.category} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

