"use client";

import React, { useState, useRef } from "react";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { useCartStore } from "@/store/useCartStore";
import { sanitizeLaserText } from "@/lib/sanitizer";
import {
  Sparkles,
  Check,
  ShoppingBag,
  Bookmark,
  AlertCircle,
  Flower2,
  UserCheck,
  Upload,
  X,
  MessageCircle,
  MessageSquare,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";

export default function BookmarkControls() {
  const store = useCustomizerStore();
  const cart = useCartStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    const { isValid, sanitized, error } = sanitizeLaserText(val);
    store.setPersonalizedName(sanitized);
    if (!isValid) {
      setNameError(error || "Invalid character");
    } else {
      setNameError(null);
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
        store.setBookmarkReferenceImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    store.setBookmarkReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddToCart = () => {
    const personalizedSummary = store.bookmark.isPersonalized
      ? `Name: "${store.bookmark.personalizedName || "Personalized"}"`
      : "No Name";
    const flowerSummary = store.bookmark.hasFlowers ? "Natural Flowers" : "Plain Resin";
    const reqSummary = store.bookmark.requirementsText?.trim()
      ? `Req: ${store.bookmark.requirementsText.slice(0, 35)}...`
      : "Custom Requirements";

    cart.addItem({
      productId: store.productId,
      productSlug: store.productSlug,
      title: store.productTitle || "Botanical Resin Bookmark",
      subtitle: `${personalizedSummary} • ${flowerSummary} • ${reqSummary}`,
      unitPrice: store.totalPrice,
      quantity: 1,
      imageUrl: store.productImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      isCustomizable: true,
      customizationDetails: {
        isPersonalized: store.bookmark.isPersonalized,
        personalizedName: store.bookmark.personalizedName,
        hasFlowers: store.bookmark.hasFlowers,
        colorChoice: store.bookmark.colorChoice,
        requirementsText: store.bookmark.requirementsText || "",
        referenceImage: store.bookmark.referenceImage,
      } as any,
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-brand-sand shadow-soft p-5 sm:p-7 flex flex-col justify-between space-y-6">
      <div className="space-y-6">
        {/* Studio Heading & Step Indicator */}
        <div className="border-b border-brand-sand/70 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-sand/70 text-[11px] font-bold text-brand-emerald mb-1">
            <Bookmark className="w-3.5 h-3.5 text-brand-gold" />
            <span>Botanical Bookmark Customizer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-emerald">
            Customize Your Bookmark
          </h2>
          <p className="text-xs text-brand-charcoal/70 mt-1">
            Configure your personalized keepsake in 3 quick choices.
          </p>
        </div>

        {/* DECISION 1: PERSONALIZATION (YES / NO) & NAME INPUT */}
        <div className="space-y-3 bg-brand-ivory/60 p-4 rounded-2xl border border-brand-sand/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-emerald flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-brand-gold" />
              <span>1. Name Personalization</span>
            </label>
            <span className="text-[10px] text-brand-charcoal/60 font-semibold">
              {store.bookmark.isPersonalized ? "+₹49" : "Free"}
            </span>
          </div>

          <p className="text-xs text-brand-charcoal/70">
            Does this bookmark need to be personalized with a name?
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => store.setIsPersonalized(true)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                store.bookmark.isPersonalized
                  ? "bg-brand-emerald text-white border-brand-emerald shadow-sm scale-[1.02]"
                  : "bg-white text-brand-charcoal border-brand-sand hover:bg-brand-sand/40"
              }`}
            >
              <Check
                className={`w-4 h-4 ${
                  store.bookmark.isPersonalized ? "text-brand-gold" : "opacity-0"
                }`}
              />
              <span>Yes, Personalize</span>
            </button>

            <button
              type="button"
              onClick={() => store.setIsPersonalized(false)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                !store.bookmark.isPersonalized
                  ? "bg-brand-emerald text-white border-brand-emerald shadow-sm scale-[1.02]"
                  : "bg-white text-brand-charcoal border-brand-sand hover:bg-brand-sand/40"
              }`}
            >
              <Check
                className={`w-4 h-4 ${
                  !store.bookmark.isPersonalized ? "text-brand-gold" : "opacity-0"
                }`}
              />
              <span>No, Keep Plain</span>
            </button>
          </div>

          {/* Conditional Name Input Field */}
          {store.bookmark.isPersonalized && (
            <div className="pt-2 space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-teal">
                  Write Name on Bookmark:
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {store.bookmark.personalizedName.length}/24 chars
                </span>
              </div>
              <input
                type="text"
                value={store.bookmark.personalizedName}
                maxLength={24}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter Recipient Name (e.g. Ananya)"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-brand-emerald/40 bg-white text-brand-emerald font-serif font-bold text-sm tracking-wide focus:outline-none focus:border-brand-emerald shadow-inner"
              />
              {nameError ? (
                <p className="text-[10px] text-red-600 font-semibold">{nameError}</p>
              ) : (
                <p className="text-[10px] text-brand-charcoal/60">
                  Rendered in elegant gold serif calligraphy along the bookmark spine.
                </p>
              )}
            </div>
          )}
        </div>

        {/* DECISION 2: FLOWERS NEEDED (YES / NO) */}
        <div className="space-y-3 bg-brand-ivory/60 p-4 rounded-2xl border border-brand-sand/80">
          <label className="text-xs font-bold uppercase tracking-wider text-brand-emerald flex items-center gap-1.5">
            <Flower2 className="w-3.5 h-3.5 text-brand-gold" />
            <span>2. Natural Flowers</span>
          </label>

          <p className="text-xs text-brand-charcoal/70">
            Are natural pressed flowers needed inside the resin?
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => store.setHasFlowers(true)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                store.bookmark.hasFlowers
                  ? "bg-brand-emerald text-white border-brand-emerald shadow-sm scale-[1.02]"
                  : "bg-white text-brand-charcoal border-brand-sand hover:bg-brand-sand/40"
              }`}
            >
              <Check
                className={`w-4 h-4 ${
                  store.bookmark.hasFlowers ? "text-brand-gold" : "opacity-0"
                }`}
              />
              <span>🌸 Yes, Include Flowers</span>
            </button>

            <button
              type="button"
              onClick={() => store.setHasFlowers(false)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                !store.bookmark.hasFlowers
                  ? "bg-brand-emerald text-white border-brand-emerald shadow-sm scale-[1.02]"
                  : "bg-white text-brand-charcoal border-brand-sand hover:bg-brand-sand/40"
              }`}
            >
              <Check
                className={`w-4 h-4 ${
                  !store.bookmark.hasFlowers ? "text-brand-gold" : "opacity-0"
                }`}
              />
              <span>💎 No Flowers (Pure Resin)</span>
            </button>
          </div>
        </div>

        {/* DECISION 3: DESCRIBE REQUIREMENTS */}
        <div className="space-y-3 bg-brand-ivory/60 p-4 rounded-2xl border border-brand-sand/80">
          <div className="flex items-center justify-between">
            <label
              htmlFor="bookmark-requirements"
              className="text-xs font-bold uppercase tracking-wider text-brand-emerald flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand-gold" />
              <span>3. Describe Your Requirements</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {(store.bookmark.requirementsText || "").length} / 1000 characters
            </span>
          </div>

          <p className="text-xs text-brand-charcoal/70">
            Tell the artist about your preferred botanical flowers (wild chamomile, rose petals, Himalayan ferns), resin tone, 24K gold foil flakes, or tassel color (golden amber, royal burgundy, emerald pine) to discuss over WhatsApp.
          </p>

          <textarea
            id="bookmark-requirements"
            rows={4}
            maxLength={1000}
            value={store.bookmark.requirementsText || ""}
            onChange={(e) => store.setBookmarkRequirementsText(e.target.value)}
            placeholder="e.g., Soft blush rose tint with dried Himalayan chamomile flowers, floating gold flakes, and a royal burgundy silk tassel to discuss over WhatsApp..."
            className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-white text-xs text-brand-charcoal leading-relaxed placeholder:text-slate-400 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold focus:outline-none transition-all shadow-inner resize-y"
          />
        </div>

        {/* SECTION 4: REFERENCE PHOTO FOR WHATSAPP DISCUSSION */}
        <div className="space-y-3 bg-brand-ivory/60 p-4 rounded-2xl border border-brand-sand/80">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-brand-gold" />
            <label className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
              4. Reference Photo (For WhatsApp Discussion)
            </label>
          </div>

          <p className="text-xs text-brand-charcoal/70">
            Have a favorite dried flower, book spine quote, or inspiration photo? Upload it here for WhatsApp discussion:
          </p>

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

          {!store.bookmark.referenceImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 border-2 border-dashed border-brand-sand hover:border-brand-gold rounded-2xl bg-white/70 hover:bg-white text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 group"
            >
              <div className="w-9 h-9 rounded-full bg-brand-sand/60 group-hover:bg-brand-gold/20 flex items-center justify-center text-brand-emerald transition-all">
                <Upload className="w-4 h-4 text-brand-gold" />
              </div>
              <p className="text-xs font-bold text-brand-charcoal">
                Click to upload inspiration image or flower sample
              </p>
              <p className="text-[10px] text-slate-500">
                PNG, JPG up to 5MB • Optional
              </p>
            </div>
          ) : (
            <div className="p-3 bg-white rounded-2xl border border-brand-sand shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={store.bookmark.referenceImage}
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
                  Have questions or custom botanical requests? Our artist connects on WhatsApp before pouring.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/919876543210?text=Hello%20ArtAalay!%20I'm%20customizing%20a%20Botanical%20Resin%20Bookmark%20and%20would%20like%20to%20discuss%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold tracking-wide shadow-xs shrink-0 transition-all"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Chat with Artist</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar: Price Summary & Add to Cart */}
      <div className="pt-4 border-t border-brand-sand space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Tentative Estimate
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                Pay ₹199 Token Deposit
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-serif text-2xl font-bold text-brand-emerald">
                ₹{store.totalPrice.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-brand-charcoal/60">Final price agreed on WhatsApp</span>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 sm:justify-end">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>50% Token Refund Guarantee</span>
            </span>
            <span className="text-[10px] text-brand-teal font-semibold">
              Free Shipping Across India
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-3.5 px-6 rounded-full bg-brand-emerald text-brand-sand hover:bg-brand-teal font-bold text-xs uppercase tracking-wider shadow-hover hover:scale-[1.01] transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <ShoppingBag className="w-4 h-4 text-brand-gold" />
          <span>Add to Bag • Pay ₹199 Token at Checkout ➔</span>
        </button>

        {showSuccessToast && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center animate-in fade-in zoom-in-95">
            ✨ Added your custom bookmark to bag!
          </div>
        )}
      </div>
    </div>
  );
}
