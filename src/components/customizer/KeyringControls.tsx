"use client";

import React, { useState, useRef } from "react";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { useCartStore } from "@/store/useCartStore";
import { sanitizeLaserText } from "@/lib/sanitizer";
import {
  Sparkles,
  Type,
  Check,
  ShoppingBag,
  Tag,
  Upload,
  X,
  MessageCircle,
  MessageSquare,
  Image as ImageIcon,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function KeyringControls() {
  const store = useCustomizerStore();
  const cart = useCartStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleAddToCart = () => {
    cart.addItem({
      productId: store.productId,
      productSlug: store.productSlug,
      title: `${store.productTitle} — Monogram '${store.keyring.letter}'`,
      subtitle: `${store.keyring.style.replace(/_/g, " ")}${
        store.keyring.hasEngravedTag ? ` • Engraved: ${store.keyring.engravedText}` : ""
      }`,
      unitPrice: store.totalPrice,
      quantity: 1,
      imageUrl:
        store.productImage ||
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      isCustomizable: true,
      customizationDetails: {
        letter: store.keyring.letter,
        style: store.keyring.style,
        hardwareFinish: "BRUSHED_BRASS_GOLD",
        charm: "NONE",
        hasEngravedTag: store.keyring.hasEngravedTag,
        engravedText: store.keyring.engravedText,
        requirementsText: store.keyring.requirementsText || "",
        referenceImage: store.keyring.referenceImage,
      } as any,
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  const handleTagTextChange = (val: string) => {
    const { isValid, sanitized, error } = sanitizeLaserText(val);
    store.setKeyringTagText(sanitized);
    if (!isValid) {
      setTagError(error || "Invalid character for engraving");
    } else {
      setTagError(null);
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
        store.setKeyringReferenceImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    store.setKeyringReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col bg-brand-ivory rounded-3xl border border-brand-sand shadow-soft overflow-hidden">
      {/* Customizer Controls Body */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* SECTION 1: MONOGRAM INITIAL & ENGRAVED TAG */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-brand-gold" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                1. Monogram Initial &amp; Engraved Tag
              </h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-sand text-brand-emerald">
              Selected: &lsquo;{store.keyring.letter || "A"}&rsquo;
            </span>
          </div>

          {/* Quick Alphabet Selector */}
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 max-h-44 overflow-y-auto p-1 bg-white/70 rounded-2xl border border-brand-sand">
            {ALPHABET.map((char) => (
              <button
                type="button"
                key={char}
                onClick={() => store.setKeyringLetter(char)}
                className={`h-10 rounded-xl font-serif text-base font-bold border transition-all ${
                  store.keyring.letter === char
                    ? "bg-brand-emerald text-white border-brand-emerald shadow-sm scale-105"
                    : "bg-white text-brand-charcoal border-brand-sand/80 hover:bg-brand-sand/60"
                }`}
              >
                {char}
              </button>
            ))}
          </div>

          {/* Personalized Circular Tag Addon */}
          <div className="pt-2">
            <div
              onClick={store.toggleKeyringTag}
              className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                store.keyring.hasEngravedTag
                  ? "border-brand-gold bg-amber-50/80 shadow-sm"
                  : "border-brand-sand bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-brand-gold" />
                <div>
                  <p className="text-xs font-bold text-brand-charcoal">
                    Add Laser-Engraved Tag (+₹99)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Mini circular metal tag etched with name, initials, or date
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                  store.keyring.hasEngravedTag
                    ? "bg-brand-gold text-white border-brand-gold"
                    : "border-slate-300 bg-white"
                }`}
              >
                {store.keyring.hasEngravedTag && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>

            {store.keyring.hasEngravedTag && (
              <div className="mt-2.5 p-3 rounded-2xl bg-white border border-brand-sand space-y-1.5 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                    Engraving Text (Max 10 Chars)
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {store.keyring.engravedText.length}/10 chars
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={10}
                  value={store.keyring.engravedText}
                  onChange={(e) => handleTagTextChange(e.target.value)}
                  placeholder="e.g. Priya, Kabir, 14.02"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-sand bg-white text-xs font-semibold text-brand-charcoal focus:ring-2 focus:ring-brand-gold focus:outline-none"
                />
                <p className="text-[10px] text-brand-emerald font-medium flex items-center gap-1.5 pt-0.5">
                  <Sparkles className="w-3 h-3 text-brand-gold shrink-0" />
                  <span>Depicted in real-time on the polished gold charm tag hanging beside the keychain loop above.</span>
                </p>
                {tagError && (
                  <p className="text-[10px] text-rose-600 font-semibold">{tagError}</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 2: DESCRIBE REQUIREMENTS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <label
                htmlFor="keyring-requirements"
                className="text-xs font-bold uppercase tracking-wider text-brand-charcoal"
              >
                2. Describe Your Requirements
              </label>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {(store.keyring.requirementsText || "").length} / 1000 characters
            </span>
          </div>

          <p className="text-[11px] text-brand-charcoal/70">
            Tell the artist about your preferred resin colour or shimmer (e.g. 24K gold flakes, rose petals, emerald pine, midnight obsidian), glitter accents, or specific charm/styling notes to discuss over WhatsApp.
          </p>

          <textarea
            id="keyring-requirements"
            rows={4}
            maxLength={1000}
            value={store.keyring.requirementsText || ""}
            onChange={(e) => store.setKeyringRequirementsText(e.target.value)}
            placeholder="e.g., We would love 24K gold foil flakes with clear optical resin, delicate rose petal inclusions, and an evil eye charm accent to discuss over WhatsApp..."
            className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-white text-xs text-brand-charcoal leading-relaxed placeholder:text-slate-400 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold focus:outline-none transition-all shadow-inner resize-y"
          />
        </section>

        {/* SECTION 3: SAMPLE PHOTO UPLOAD FOR WHATSAPP DISCUSSION */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-brand-gold" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              3. Reference Photo (For WhatsApp Discussion)
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

          {!store.keyring.referenceImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 border-2 border-dashed border-brand-sand hover:border-brand-gold rounded-2xl bg-white/70 hover:bg-white text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 group"
            >
              <div className="w-9 h-9 rounded-full bg-brand-sand/60 group-hover:bg-brand-gold/20 flex items-center justify-center text-brand-emerald transition-all">
                <Upload className="w-4 h-4 text-brand-gold" />
              </div>
              <p className="text-xs font-bold text-brand-charcoal">
                Click to upload inspiration image, monogram calligraphy, or sample
              </p>
              <p className="text-[10px] text-slate-500">
                PNG, JPG up to 5MB • Optional
              </p>
            </div>
          ) : (
            <div className="p-3 bg-white rounded-2xl border border-brand-sand shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={store.keyring.referenceImage}
                  alt="Uploaded Reference"
                  className="w-12 h-12 rounded-xl object-cover border border-brand-sand shadow-xs"
                />
                <div>
                  <p className="text-xs font-bold text-brand-charcoal flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Reference Photo Attached
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Our artisan will discuss this with you on WhatsApp.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-full border border-brand-sand text-[11px] font-semibold text-brand-charcoal hover:bg-brand-sand transition-all"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* WhatsApp Consultation Notice */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-start gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  Artisan WhatsApp Consultation
                </p>
                <p className="text-[10px] text-emerald-800 leading-tight mt-0.5">
                  Have questions or reference pictures to discuss? Our artist connects on WhatsApp before pouring.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/919876543210?text=Hello%20ArtAalay!%20I'm%20customizing%20a%20Monogram%20Resin%20Keyring%20and%20would%20like%20to%20discuss%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold tracking-wide shadow-xs shrink-0 transition-all"
            >
              <MessageCircle className="w-3 h-3" />
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
            <span className="text-2xl font-extrabold text-brand-emerald">
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
            Bespoke Keyring added to bag! Digital 300 DPI proof rendered.
          </span>
        </div>
      )}
    </div>
  );
}
