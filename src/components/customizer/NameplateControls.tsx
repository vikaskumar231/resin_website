"use client";

import React, { useState, useRef } from "react";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { useCartStore } from "@/store/useCartStore";
import { sanitizeLaserText } from "@/lib/sanitizer";
import {
  Sparkles,
  Type,
  Maximize2,
  Check,
  ShoppingBag,
  AlertCircle,
  Upload,
  X,
  MessageCircle,
  MessageSquare,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";

export default function NameplateControls() {
  const store = useCustomizerStore();
  const cart = useCartStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [textError, setTextError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleAddToCart = () => {
    cart.addItem({
      productId: store.productId,
      productSlug: store.productSlug,
      title: store.productTitle,
      subtitle: `${
        store.nameplate.size === "12x8"
          ? '12"x8" Standard'
          : store.nameplate.size === "16x10"
          ? '16"x10" Grand'
          : '18"x12" Executive'
      } • ${store.nameplate.colorway.replace("_", " ")}${
        store.nameplate.hasLedBacklight ? " • 12V Warm LED" : ""
      }`,
      unitPrice: store.totalPrice,
      quantity: 1,
      imageUrl:
        store.productImage ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      isCustomizable: true,
      customizationDetails: {
        substrate: store.nameplate.substrate,
        size: store.nameplate.size,
        colorway: store.nameplate.colorway,
        inclusions: store.nameplate.inclusions,
        emblem: store.nameplate.emblem,
        typography: store.nameplate.typography,
        hasLedBacklight: store.nameplate.hasLedBacklight,
        hasBrassBells: store.nameplate.hasBrassBells,
        requirementsText: store.nameplate.requirementsText || "",
        referenceImage: store.nameplate.referenceImage,
      },
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  const handleLine1Change = (val: string) => {
    const { isValid, sanitized, error } = sanitizeLaserText(val);
    store.setLine1(sanitized);
    if (!isValid) {
      setTextError(error || "Invalid character for laser cutting");
    } else {
      setTextError(null);
    }
  };

  const handleLine2Change = (val: string) => {
    const { isValid, sanitized, error } = sanitizeLaserText(val);
    store.setLine2(sanitized);
    if (!isValid) {
      setTextError(error || "Invalid character for laser cutting");
    } else {
      setTextError(null);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be under 5MB");
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        store.setReferenceImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    store.setReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sizeOptions = [
    {
      id: "12x8" as const,
      title: 'Standard (12" × 8")',
      priceTag: "Included in Base",
      description: "Ideal for apartments & flats",
    },
    {
      id: "16x10" as const,
      title: 'Grand (16" × 10")',
      priceTag: "+₹500",
      description: "Ideal for row houses & villas",
    },
    {
      id: "18x12" as const,
      title: 'Executive (18" × 12")',
      priceTag: "+₹900",
      description: "Statement entrance for luxury bungalows",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col bg-brand-ivory rounded-3xl border border-brand-sand shadow-soft overflow-hidden">
      {/* Quality Base & Lead Time Assurance Pill */}
      <div className="bg-brand-sand/60 border-b border-brand-sand px-5 py-3 flex flex-wrap items-center justify-between text-[11px] text-brand-emerald gap-2">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>Carefully Sourced Quality Base (Durable foundation curated by the artist for lasting resin finish)</span>
        </div>
        <span className="text-[10px] text-brand-charcoal/70 font-semibold">
          Actual delivery date confirmed by artist upon WhatsApp design approval
        </span>
      </div>

      {/* Customizer Controls Body */}
      <div className="p-5 sm:p-7 space-y-7">
        {/* SECTION 1: TEXT TO BE PRINTED */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-brand-gold" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              1. Text to be Printed on Nameplate
            </h2>
          </div>

          {textError && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{textError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Primary Name (Line 1)
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  {store.nameplate.typography.line1.length}/20 chars
                </span>
              </div>
              <input
                type="text"
                maxLength={20}
                value={store.nameplate.typography.line1}
                onChange={(e) => handleLine1Change(e.target.value)}
                placeholder="e.g. Nirvana, Ananya & Rohan, The Kapoors"
                className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-white text-brand-charcoal font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-brand-gold focus:outline-none transition-all shadow-2xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Subtext / House No. (Line 2, Optional)
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  {store.nameplate.typography.line2.length}/28 chars
                </span>
              </div>
              <input
                type="text"
                maxLength={28}
                value={store.nameplate.typography.line2}
                onChange={(e) => handleLine2Change(e.target.value)}
                placeholder="e.g. Villa 42, Palm Greens or Since 2018"
                className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-white text-brand-charcoal font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-brand-gold focus:outline-none transition-all shadow-2xs"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <p className="text-[11px] text-slate-500 italic">
              ✨ Laser-precision cut in mirror gold 3D acrylic and sealed with waterproof artisan resin.
            </p>
            {Boolean(store.nameplate.typography.line1 || store.nameplate.typography.line2) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                Active on Artisan Preview
              </span>
            )}
          </div>

          {/* Real-time override assurance card */}
          <div className="flex items-start gap-2.5 px-3.5 py-2.5 bg-emerald-50/80 border border-emerald-200/70 rounded-2xl text-[11px] text-emerald-900 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-0.5" />
            <span>
              <strong>Live Artisan Preview:</strong> Your custom family name and house number seamlessly replace the sample photo inscription in the preview above, positioned in the focal center in 3D mirror acrylic.
            </span>
          </div>
        </section>

        {/* SECTION 2: DESCRIBE REQUIREMENTS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <label
                htmlFor="nameplate-requirements"
                className="text-xs font-bold uppercase tracking-wider text-brand-charcoal"
              >
                2. Describe Your Requirements
              </label>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {(store.nameplate.requirementsText || "").length} / 1000 characters
            </span>
          </div>

          <p className="text-[11px] text-brand-charcoal/70">
            Tell the artist about your preferred resin colour theme (ocean wave, emerald geode, royal crimson, obsidian gold), wave froth style, gold leaf accents, calligraphy notes, or any specific styling ideas.
          </p>

          <textarea
            id="nameplate-requirements"
            rows={4}
            maxLength={1000}
            value={store.nameplate.requirementsText || ""}
            onChange={(e) => store.setNameplateRequirementsText(e.target.value)}
            placeholder="e.g., We would love an ocean turquoise wave with white shoreline froth and gold leaf flecks. Family name in Rozha One calligraphy, polished edge beveling, or specific font/styling ideas to discuss over WhatsApp..."
            className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-white text-xs text-brand-charcoal leading-relaxed placeholder:text-slate-400 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold focus:outline-none transition-all shadow-inner resize-y"
          />
        </section>

        {/* SECTION 3: CHOOSE SIZE */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-brand-gold" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              3. Choose Size &amp; Dimensions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sizeOptions.map((s) => {
              const isSelected = store.nameplate.size === s.id;
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => store.setSize(s.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "border-brand-gold bg-amber-500/10 ring-2 ring-brand-gold/30 font-bold shadow-sm"
                      : "border-brand-sand bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-brand-charcoal">{s.title}</span>
                    <span className="text-[11px] font-bold text-brand-gold">{s.priceTag}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal">{s.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: LED INCLUSION */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              4. LED Inclusion
            </h2>
          </div>

          <div
            onClick={store.toggleLedBacklight}
            className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
              store.nameplate.hasLedBacklight
                ? "border-amber-400 bg-amber-50/80 shadow-md ring-1 ring-amber-300"
                : "border-brand-sand bg-white hover:border-slate-300"
            }`}
          >
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-bold text-brand-charcoal">
                  12V Warm LED Backlighting
                </p>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/70 text-amber-900">
                  +₹799
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Concealed warm golden LED strips with plug &amp; play 12V adapter for ambient entrance glow at night.
              </p>
            </div>
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                store.nameplate.hasLedBacklight
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "border-slate-300 bg-white"
              }`}
            >
              {store.nameplate.hasLedBacklight && <Check className="w-4 h-4" />}
            </div>
          </div>
        </section>

        {/* SECTION 5: SAMPLE IMAGE UPLOAD FOR WHATSAPP DISCUSSION */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-brand-gold" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              5. Reference Photo (For WhatsApp Discussion)
            </h2>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={handleImageFileChange}
          />

          {uploadError && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {!store.nameplate.referenceImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-5 border-2 border-dashed border-brand-sand hover:border-brand-gold rounded-2xl bg-white/70 hover:bg-white text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-brand-sand/60 group-hover:bg-brand-gold/20 flex items-center justify-center text-brand-emerald transition-all">
                <Upload className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-charcoal">
                  Click to upload sample image or entrance photo
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload an inspiration image, door photo, or color reference (PNG, JPG up to 5MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-2xl border border-brand-sand shadow-2xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={store.nameplate.referenceImage}
                  alt="Uploaded Reference"
                  className="w-14 h-14 rounded-xl object-cover border border-brand-sand shadow-xs"
                />
                <div>
                  <p className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Reference Photo Attached
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ready for WhatsApp consultation with our lead artisan.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-full border border-brand-sand text-xs font-semibold text-brand-charcoal hover:bg-brand-sand transition-all"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* WhatsApp Consultation Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  Artisan WhatsApp Consultation
                </p>
                <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                  Have questions or reference pictures to discuss? Our artist connects directly on WhatsApp before hand-pouring your piece.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/919876543210?text=Hello%20ArtAalay!%20I'm%20customizing%20a%20Bespoke%20Resin%20Nameplate%20and%20would%20like%20to%20discuss%20design%20details."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold tracking-wide shadow-xs shrink-0 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat with Artist</span>
            </a>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Pricing & Checkout Action Bar */}
      <div className="border-t border-brand-sand bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tentative Est.
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
              Pay ₹199 Token Deposit
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-brand-emerald">
              ₹{store.totalPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-500 font-medium">Final price agreed on WhatsApp</span>
          </div>
          <p className="text-[11px] text-emerald-800 font-medium mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>50% Token Refund Guarantee if final price/design is not agreed later</span>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-emerald text-white font-bold text-sm tracking-wide shadow-lg hover:bg-emerald-900 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-brand-gold" />
            Add to Bag • Pay ₹199 Token at Checkout ➔
          </button>
        </div>
      </div>

      {/* Toast feedback */}
      {showSuccessToast && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-brand-emerald text-white px-5 sm:px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-brand-gold/40 animate-bounce">
          <Sparkles className="w-5 h-5 text-brand-gold shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">
            Bespoke Nameplate added to bag! Digital 300 DPI proof rendered.
          </span>
        </div>
      )}
    </div>
  );
}
