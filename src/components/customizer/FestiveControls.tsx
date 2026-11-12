"use client";

import React, { useState, useRef } from "react";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { useCartStore } from "@/store/useCartStore";
import { compressImageToDataUrl } from "@/lib/imageCompressor";
import { getArtistWhatsAppLink } from "@/lib/whatsapp/config";
import {
  Sparkles,
  Check,
  ShoppingBag,
  Upload,
  X,
  MessageCircle,
  Image as ImageIcon,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Heart,
} from "lucide-react";

export default function FestiveControls() {
  const store = useCustomizerStore();
  const cart = useCartStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);

  const handleAddToCart = () => {
    const requirements = store.festive?.requirementsText?.trim() || "";
    const shortSummary = requirements.length > 60 
      ? requirements.slice(0, 60) + "..."
      : requirements || "Custom requirements to discuss over WhatsApp";

    cart.addItem({
      productId: store.productId,
      productSlug: store.productSlug,
      title: store.productTitle || "Sacred Toran & Shubh Labh Set",
      subtitle: `Custom Requirements: ${shortSummary}`,
      unitPrice: store.totalPrice,
      quantity: 1,
      imageUrl:
        store.productImage ||
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
      isCustomizable: true,
      customizationDetails: {
        type: "FESTIVE",
        requirementsText: store.festive?.requirementsText || "",
        referenceImage: store.festive?.referenceImage || null,
        geodeColorway: store.festive?.geodeColorway || "EMERALD_JADE",
        scriptStyle: store.festive?.scriptStyle || "SHUBH_LABH",
      } as any,
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP)");
      return;
    }

    setUploadError(null);
    setIsOptimizingImage(true);
    try {
      // Auto-compress image to 5 MB without requiring user validation
      const dataUrl = await compressImageToDataUrl(file, 5 * 1024 * 1024);
      store.setFestiveReferenceImage(dataUrl);
    } catch (err) {
      console.error("Reference photo optimization failed:", err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          store.setFestiveReferenceImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsOptimizingImage(false);
    }
  };

  const handleRemoveImage = () => {
    store.setFestiveReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col bg-brand-ivory rounded-3xl border border-brand-sand shadow-soft overflow-hidden">
      {/* Customizer Controls Body */}
      <div className="p-5 sm:p-7 space-y-6">
        {/* Intro Guidance Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-brand-sand/50 to-brand-emerald/10 border border-brand-gold/30 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪔</span>
            <h3 className="font-serif text-sm sm:text-base font-bold text-brand-emerald">
              Bespoke Toran &amp; Shubh Labh Customization
            </h3>
          </div>
          <p className="text-xs text-brand-charcoal/80 leading-relaxed">
            Every home entrance and pooja mandir has its own sacred energy and dimensions. Simply describe your requirements and optionally upload a reference photo below. Our master resin artist will connect with you 1-on-1 over WhatsApp to finalize the design, colours, and physical layout before creating your piece.
          </p>
        </div>

        {/* SECTION 1: FREE-TEXT REQUIREMENTS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-gold" />
              <label
                htmlFor="toran-requirements"
                className="text-xs font-bold uppercase tracking-wider text-brand-charcoal"
              >
                1. Describe Your Requirements
              </label>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {(store.festive?.requirementsText || "").length} / 1000 characters
            </span>
          </div>

          <p className="text-[11px] text-brand-charcoal/70">
            Tell the artist about your preferred colours, entrance or mandir dimensions, specific sacred inscriptions (e.g. Shubh Labh, Om, Swastik, Suswagatam), hanging preferences (brass bells or silk tassels), or any specific styling ideas.
          </p>

          <textarea
            id="toran-requirements"
            rows={5}
            maxLength={1000}
            value={store.festive?.requirementsText || ""}
            onChange={(e) => store.setFestiveRequirementsText(e.target.value)}
            placeholder="e.g., We would love an emerald green and gold geode theme with traditional brass temple bells for our main entrance door. Sacred inscriptions 'शुभ' and 'लाभ' in raised 3D gold calligraphy. Please ensure total width fits a 3.5 ft entrance doorway..."
            className="w-full px-4 py-3 rounded-2xl border border-brand-sand bg-white text-xs text-brand-charcoal leading-relaxed placeholder:text-slate-400 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold focus:outline-none transition-all shadow-inner resize-y"
          />
        </section>

        {/* SECTION 2: REFERENCE PHOTO UPLOAD (OPTIONAL) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-brand-gold" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              2. Add Reference Photo (Optional)
            </h2>
          </div>

          <p className="text-[11px] text-brand-charcoal/70">
            Have a picture of your entrance doorway, mandir backdrop, or an inspiration resin photo you love? Attach it here so the artist can use it as a visual reference.
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

          {isOptimizingImage ? (
            <div className="p-6 border-2 border-dashed border-brand-gold rounded-2xl bg-amber-500/10 text-center flex flex-col items-center justify-center gap-2 shadow-2xs">
              <Sparkles className="w-6 h-6 text-brand-gold animate-spin" />
              <p className="text-xs font-bold text-brand-emerald">
                Optimizing photo to high-resolution 5MB...
              </p>
              <p className="text-[10px] text-slate-500">
                Preserving sacred details and geode luster for the artisan.
              </p>
            </div>
          ) : !store.festive?.referenceImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-brand-sand hover:border-brand-gold rounded-2xl bg-white/70 hover:bg-white text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-full bg-brand-sand/60 group-hover:bg-brand-gold/20 flex items-center justify-center text-brand-emerald transition-all">
                <Upload className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-charcoal">
                  Click to upload entrance picture, mandir photo, or sample design
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Photos auto-optimized to 5MB • Optional
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-white rounded-2xl border border-brand-sand shadow-2xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={store.festive.referenceImage}
                  alt="Uploaded Reference"
                  className="w-14 h-14 rounded-xl object-cover border border-brand-sand shadow-xs shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-brand-charcoal flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Reference Photo Attached
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Our artisan will review this image and discuss it with you on WhatsApp.
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
        </section>

        {/* SECTION 3: ARTISAN WHATSAPP CONSULTATION CARD */}
        <section className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Personal 1-on-1 WhatsApp Consultation
              </h4>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                You do not need to make rigid technical decisions here. Once you submit, our artist personally connects with you over WhatsApp, shares high-resolution studio photo proofs of the layout, and confirms exact delivery timelines before hand-pouring.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-emerald-900">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>100% Approval Guarantee before resin pour</span>
            </div>

            <a
              href={getArtistWhatsAppLink("Hello ArtAalay! I have questions about customizing a Sacred Toran or Shubh Labh set.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-emerald-800 hover:text-emerald-950 underline underline-offset-2"
            >
              <span>Have quick questions? Chat on WhatsApp</span>
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Pricing & Submit Action Bar */}
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
            <span>Add to Bag • Pay ₹199 Token at Checkout ➔</span>
          </button>
        </div>
      </div>

      {/* Toast feedback */}
      {showSuccessToast && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 bg-brand-emerald text-white px-5 sm:px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-brand-gold/40 animate-bounce">
          <Sparkles className="w-5 h-5 text-brand-gold shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">
            Toran requirements submitted! Check Bag or discuss on WhatsApp.
          </span>
        </div>
      )}
    </div>
  );
}
