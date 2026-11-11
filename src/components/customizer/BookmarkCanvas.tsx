"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { Download, Sparkles, Info, Image as ImageIcon } from "lucide-react";

const COLOR_CONFIG: Record<
  string,
  {
    name: string;
    bgGradient: string;
    canvasBg: string;
    canvasTint: string;
    accent: string;
    borderTint: string;
    tasselHex: string;
  }
> = {
  CRYSTAL_CLEAR: {
    name: "Crystal Clear",
    bgGradient: "from-white/80 via-slate-50/50 to-white/80",
    canvasBg: "rgba(255, 255, 255, 0.92)",
    canvasTint: "rgba(240, 248, 255, 0.25)",
    accent: "#D4AF37",
    borderTint: "border-white/90",
    tasselHex: "#D4AF37",
  },
  OCEAN_TEAL: {
    name: "Ocean Teal",
    bgGradient: "from-teal-200/80 via-teal-300/60 to-teal-500/70",
    canvasBg: "rgba(204, 251, 241, 0.88)",
    canvasTint: "rgba(13, 148, 136, 0.4)",
    accent: "#0D9488",
    borderTint: "border-teal-200/90",
    tasselHex: "#0F766E",
  },
  BLUSH_ROSE: {
    name: "Blush Rose",
    bgGradient: "from-rose-200/80 via-pink-300/60 to-rose-400/70",
    canvasBg: "rgba(255, 228, 230, 0.88)",
    canvasTint: "rgba(225, 29, 72, 0.35)",
    accent: "#E11D48",
    borderTint: "border-rose-200/90",
    tasselHex: "#BE123C",
  },
  EMERALD_GREEN: {
    name: "Emerald Forest",
    bgGradient: "from-emerald-200/80 via-emerald-300/60 to-emerald-500/70",
    canvasBg: "rgba(209, 250, 229, 0.88)",
    canvasTint: "rgba(15, 56, 49, 0.4)",
    accent: "#0F3831",
    borderTint: "border-emerald-200/90",
    tasselHex: "#064E3B",
  },
  GOLDEN_AMBER: {
    name: "Golden Amber",
    bgGradient: "from-amber-200/80 via-yellow-300/60 to-amber-400/70",
    canvasBg: "rgba(254, 243, 199, 0.88)",
    canvasTint: "rgba(217, 119, 6, 0.4)",
    accent: "#D97706",
    borderTint: "border-amber-200/90",
    tasselHex: "#B45309",
  },
  ROYAL_VIOLET: {
    name: "Royal Amethyst",
    bgGradient: "from-purple-200/80 via-purple-300/60 to-purple-500/70",
    canvasBg: "rgba(243, 232, 255, 0.88)",
    canvasTint: "rgba(126, 34, 206, 0.35)",
    accent: "#7E22CE",
    borderTint: "border-purple-200/90",
    tasselHex: "#6B21A8",
  },
};

export default function BookmarkCanvas() {
  const store = useCustomizerStore();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 230, height: 490 });

  useEffect(() => {
    setIsClient(true);
    const updateSize = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.offsetWidth;
        const width = Math.min(Math.max(containerWidth * 0.42, 190), 250);
        const height = Math.round(width * 2.25); // ~1:2.25 slim bookmark aspect ratio
        setDimensions({ width, height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-brand-ivory rounded-3xl border border-brand-sand shadow-inner animate-pulse">
        <span className="text-brand-teal font-sans text-sm font-medium">
          Loading Artआलय Botanical Bookmark Studio...
        </span>
      </div>
    );
  }

  const activeColor =
    COLOR_CONFIG[store.bookmark.colorChoice] || COLOR_CONFIG["CRYSTAL_CLEAR"];

  const handleExportProof = () => {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1200;
    exportCanvas.height = 2400;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Background Studio Surface
    ctx.fillStyle = "#F7F3EE";
    ctx.fillRect(0, 0, 1200, 2400);

    const radial = ctx.createRadialGradient(600, 1200, 100, 600, 1200, 800);
    radial.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    radial.addColorStop(1, "rgba(240, 235, 225, 0.45)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1200, 2400);

    const bx = 320;
    const by = 380;
    const bw = 560;
    const bh = 1750;
    const r = 40;

    const renderCustomOverlays = () => {
      // Gold Beveled Border
      ctx.strokeStyle = "rgba(212, 175, 55, 0.75)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.lineTo(bx + bw - r, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
      ctx.lineTo(bx + bw, by + bh - r);
      ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
      ctx.lineTo(bx + r, by + bh);
      ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
      ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by);
      ctx.closePath();
      ctx.stroke();

      // Top Eyelet Loop Hole
      ctx.fillStyle = "#D4AF37";
      ctx.beginPath();
      ctx.arc(600, 480, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#F7F3EE";
      ctx.beginPath();
      ctx.arc(600, 480, 14, 0, Math.PI * 2);
      ctx.fill();

      // Silk Tassel at Top
      ctx.strokeStyle = activeColor.tasselHex;
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(600, 480);
      ctx.lineTo(600, 180);
      ctx.stroke();

      ctx.fillStyle = activeColor.tasselHex;
      ctx.fillRect(555, 110, 90, 110);

      // DECISION 2: Flowers Inclusion
      if (store.bookmark.hasFlowers) {
        ctx.font = "80px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("🌼", 530, 750);
        ctx.fillText("🌿", 660, 950);
        ctx.fillText("🌸", 540, 1180);
        ctx.fillText("🍃", 650, 1380);
        ctx.fillText("🌼", 560, 1580);
      }

      // DECISION 1: Personalization Name
      if (store.bookmark.isPersonalized && store.bookmark.personalizedName) {
        const name = store.bookmark.personalizedName;
        ctx.save();
        ctx.fillStyle = "#854D0E";
        ctx.font = "bold italic 46px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText(name, 600, 1950);

        ctx.fillStyle = "rgba(133, 77, 14, 0.75)";
        ctx.font = "300 22px sans-serif";
        ctx.fillText("Artआलय Handcrafted Keepsake", 600, 2000);
        ctx.restore();
      }

      // Studio Proof Watermark
      ctx.font = "300 24px sans-serif";
      ctx.fillStyle = "rgba(15, 56, 49, 0.65)";
      ctx.textAlign = "center";
      ctx.fillText(
        `Artआलय Studio • ${activeColor.name} Bookmark (${store.bookmark.hasFlowers ? "With Flowers" : "Pure Resin"})`,
        600,
        2280
      );

      const link = document.createElement("a");
      link.download = `ArtAalay-Bookmark-${store.bookmark.colorChoice}.png`;
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    };

    // If product image is available, draw as photographic base
    if (store.productImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.save();
        // Clip to rounded bookmark shape
        ctx.beginPath();
        ctx.moveTo(bx + r, by);
        ctx.lineTo(bx + bw - r, by);
        ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
        ctx.lineTo(bx + bw, by + bh - r);
        ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
        ctx.lineTo(bx + r, by + bh);
        ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
        ctx.lineTo(bx, by + r);
        ctx.quadraticCurveTo(bx, by, bx + r, by);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, bx, by, bw, bh);

        // Apply translucent resin pigment tint
        ctx.fillStyle = activeColor.canvasTint;
        ctx.fillRect(bx, by, bw, bh);
        ctx.restore();

        renderCustomOverlays();
      };
      img.onerror = () => {
        drawProceduralBookmarkBase(ctx, bx, by, bw, bh, r);
        renderCustomOverlays();
      };
      img.src = store.productImage;
    } else {
      drawProceduralBookmarkBase(ctx, bx, by, bw, bh, r);
      renderCustomOverlays();
    }
  };

  const drawProceduralBookmarkBase = (
    ctx: CanvasRenderingContext2D,
    bx: number,
    by: number,
    bw: number,
    bh: number,
    r: number
  ) => {
    ctx.save();
    ctx.shadowColor = "rgba(15, 56, 49, 0.2)";
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 25;

    ctx.fillStyle = activeColor.canvasBg;
    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bw - r, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
    ctx.lineTo(bx + bw, by + bh - r);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
    ctx.lineTo(bx + r, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
    ctx.lineTo(bx, by + r);
    ctx.quadraticCurveTo(bx, by, bx + r, by);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  return (
    <div
      ref={canvasContainerRef}
      className="w-full flex flex-col items-center justify-center p-2 sm:p-4 select-none"
    >
      {/* Studio Header Bar */}
      <div className="w-full max-w-[500px] flex items-center justify-between mb-3 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-sand/70 rounded-full border border-brand-sand text-xs font-bold text-brand-emerald shadow-2xs">
          <ImageIcon className="w-3.5 h-3.5 text-brand-gold" />
          <span>Artisan Photo Preview</span>
        </div>

        <span className="text-[11px] font-semibold text-brand-emerald hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-gold" />
          Live 2D Customization
        </span>
      </div>

      {/* Studio Viewport */}
      <div className="relative w-full max-w-[500px] h-[540px] rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center bg-gradient-to-br from-brand-sand/40 via-white to-amber-50/30 border-4 border-white/70 p-4">
        {/* Floating Reference Attached Badge */}
        {store.bookmark.referenceImage && (
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-brand-gold/60 shadow-lg">
            <img
              src={store.bookmark.referenceImage}
              alt="Reference Preview"
              className="w-5 h-5 rounded-full object-cover border border-amber-300"
            />
            <span className="text-[11px] font-semibold text-amber-200">
              Reference Attached
            </span>
          </div>
        )}

        {/* Silk Tassel / Cord at Top */}
        <div className="relative z-20 flex flex-col items-center -mt-8">
          {/* Tassel Hanging Loop */}
          <div
            style={{ backgroundColor: activeColor.tasselHex }}
            className="w-1.5 h-14 rounded-full shadow-sm transition-colors duration-300"
          />
          {/* Tassel Crown Knot */}
          <div
            style={{ backgroundColor: activeColor.tasselHex }}
            className="w-4 h-4 rounded-full border border-white/60 shadow-md -mt-1 transition-colors duration-300"
          />
          {/* Tassel Silk Fringe */}
          <div
            style={{
              backgroundColor: activeColor.tasselHex,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            className="w-6 h-12 rounded-b-xl opacity-95 flex flex-col items-center justify-end pb-1 transition-colors duration-300"
          >
            <div className="w-4 h-0.5 bg-white/40 mb-1" />
          </div>
        </div>

        {/* Optical Resin Bookmark Body */}
        <div
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
          className={`relative rounded-2xl overflow-hidden backdrop-blur-md border-2 ${activeColor.borderTint} shadow-[0_16px_40px_rgba(15,56,49,0.18)] flex flex-col items-center justify-between p-3.5 -mt-2 transition-all duration-300`}
        >
          {/* ORIGINAL PRODUCT PHOTOGRAPH SUBSTRATE */}
          <div className="absolute inset-0 z-0">
            {/* Original Product Photo */}
            <img
              src={
                store.productImage ||
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
              }
              alt={store.productTitle}
              className="w-full h-full object-cover rounded-2xl"
            />

            {/* Dynamic Translucent Resin Pigment Glaze (DECISION 3: Colour Choice) */}
            <div
              style={{
                background: activeColor.canvasTint,
              }}
              className="absolute inset-0 mix-blend-color opacity-50 pointer-events-none rounded-2xl transition-all duration-300"
            />

            {/* Glossy Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none rounded-2xl" />
          </div>

          {/* Top Eyelet Hole */}
          <div className="relative z-10 w-5 h-5 rounded-full bg-brand-sand/90 border-2 border-amber-300 shadow-inner flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-ivory" />
          </div>

          {/* Embedded Floral Petals (DECISION 2: Flowers Needed) */}
          <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center space-y-4 my-2 pointer-events-none">
            {store.bookmark.hasFlowers ? (
              <>
                <div className="text-3xl rotate-12 drop-shadow-sm animate-pulse duration-1000">🌼</div>
                <div className="text-xl -rotate-45 text-emerald-700/80 drop-shadow-sm">🌿</div>
                <div className="text-2xl rotate-6 drop-shadow-sm">🌸</div>
                <div className="text-lg rotate-45 text-emerald-800/70">🍃</div>
                <div className="text-2xl -rotate-12 drop-shadow-sm">🌼</div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-center px-4 py-8 bg-black/30 backdrop-blur-xs rounded-xl mx-2">
                <Sparkles className="w-5 h-5 text-amber-300 mb-1 animate-pulse" />
                <span className="text-[10px] font-bold text-white tracking-wider uppercase drop-shadow">
                  Pure Resin Finish
                </span>
                <span className="text-[9px] text-white/80">
                  Minimalist Crystal Clarity
                </span>
              </div>
            )}
          </div>

          {/* Personalized Recipient Name (DECISION 1: Personalization) */}
          {store.bookmark.isPersonalized && store.bookmark.personalizedName ? (
            <div className="relative z-10 w-full pb-2 pt-1 border-t border-brand-sand/60 text-center bg-black/40 backdrop-blur-sm rounded-b-xl px-2">
              <span className="text-[9px] uppercase tracking-widest text-amber-200 font-semibold block">
                Personalized
              </span>
              <p className="text-xs sm:text-sm font-serif font-bold tracking-wide italic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate">
                {store.bookmark.personalizedName}
              </p>
            </div>
          ) : null}

          {/* Studio Dimensions Mark */}
          <div className="relative z-10 text-[8px] uppercase tracking-widest text-white/90 drop-shadow font-sans pointer-events-none">
            Artआलय • 5.5&quot; x 1.2&quot;
          </div>

          {/* Customer Requirements Indicator */}
          {store.bookmark?.requirementsText && (
            <div className="relative z-20 mt-1 mx-2 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-brand-gold/40 text-white text-[10px] flex items-center gap-1.5 shadow-md">
              <span className="text-brand-gold font-bold shrink-0">📝</span>
              <span className="truncate text-white/90 italic">{store.bookmark.requirementsText}</span>
            </div>
          )}
        </div>
      </div>

      {/* Handcrafted Variation Note Banner */}
      <div className="w-full max-w-[500px] mt-2.5 px-2 py-1.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900">
        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="truncate">
          Hand-poured resin: Natural color depth & petal positions vary uniquely per piece.
        </span>
      </div>

      {/* Snapshot Proof Export Bar */}
      <div className="w-full max-w-[500px] flex items-center justify-between mt-3 px-2">
        <span className="text-[11px] text-slate-500 font-medium">
          Live Interactive Studio Proof
        </span>
        <button
          onClick={handleExportProof}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-brand-sand border border-brand-sand text-brand-emerald shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5 text-brand-gold" />
          <span>Download 300 DPI Proof</span>
        </button>
      </div>
    </div>
  );
}
