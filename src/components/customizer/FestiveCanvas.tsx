"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { Download, Sparkles, Bell, Image as ImageIcon } from "lucide-react";

export default function FestiveCanvas() {
  const store = useCustomizerStore();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 520, height: 420 });

  useEffect(() => {
    setIsClient(true);
    const updateSize = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.offsetWidth;
        const width = Math.min(containerWidth, 580);
        const height = Math.round(width * 0.75); // ~4:3 aspect for dual geode discs
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
          Loading Artआलय Sacred Toran &amp; Shubh Labh Studio...
        </span>
      </div>
    );
  }

  // Geode Palette Definitions
  const getGeodeStyle = () => {
    switch (store.festive?.geodeColorway) {
      case "ROYAL_CRIMSON":
        return {
          inner: "radial-gradient(circle at 45% 45%, #991B1B 0%, #7F1D1D 45%, #450A0A 80%)",
          vein: "rgba(212, 175, 55, 0.65)",
          rim: "#B91C1C",
          glow: "rgba(185, 28, 28, 0.45)",
          tintHex: "rgba(185, 28, 28, 0.35)",
        };
      case "AUSPICIOUS_HALDI":
        return {
          inner: "radial-gradient(circle at 45% 45%, #F59E0B 0%, #D97706 45%, #78350F 80%)",
          vein: "rgba(255, 242, 178, 0.8)",
          rim: "#F59E0B",
          glow: "rgba(245, 158, 11, 0.45)",
          tintHex: "rgba(245, 158, 11, 0.35)",
        };
      case "MIDNIGHT_OBSIDIAN":
        return {
          inner: "radial-gradient(circle at 45% 45%, #374151 0%, #1F2937 45%, #111827 80%)",
          vein: "rgba(212, 175, 55, 0.75)",
          rim: "#4B5563",
          glow: "rgba(212, 175, 55, 0.4)",
          tintHex: "rgba(31, 41, 55, 0.4)",
        };
      case "EMERALD_JADE":
      default:
        return {
          inner: "radial-gradient(circle at 45% 45%, #10B981 0%, #0F3831 50%, #064E3B 85%)",
          vein: "rgba(212, 175, 55, 0.75)",
          rim: "#059669",
          glow: "rgba(16, 185, 129, 0.45)",
          tintHex: "rgba(16, 185, 129, 0.35)",
        };
    }
  };

  // Crystal Border Mineral Definition
  const getCrystalBorderStyle = () => {
    switch (store.festive?.crystalBorder) {
      case "ROSE_QUARTZ":
        return {
          border: "4px dotted #FBCFE8",
          shadow: "0 0 14px rgba(244, 114, 182, 0.5)",
          dots: "rgba(251, 207, 232, 0.9)",
        };
      case "AMETHYST":
        return {
          border: "4px dotted #DDD6FE",
          shadow: "0 0 14px rgba(167, 139, 250, 0.6)",
          dots: "rgba(221, 214, 254, 0.9)",
        };
      case "GOLD_NUGGETS":
        return {
          border: "4px dotted #FEF08A",
          shadow: "0 0 16px rgba(212, 175, 55, 0.7)",
          dots: "rgba(254, 240, 138, 0.95)",
        };
      case "RAW_CLEAR_QUARTZ":
      default:
        return {
          border: "4px dotted #FFFFFF",
          shadow: "0 0 14px rgba(255, 255, 255, 0.7)",
          dots: "rgba(255, 255, 255, 0.95)",
        };
    }
  };

  // Script text resolver
  const getScriptPair = () => {
    switch (store.festive?.scriptStyle) {
      case "SWAGATAM":
        return { left: "सु", right: "स्वागतम्" };
      case "OM_SWASTIK":
        return { left: "ॐ", right: "卐" };
      case "CUSTOM_BLESSING":
        const words = (store.festive?.customText || "शुभ लाभ").trim().split(" ");
        if (words.length > 1) {
          return { left: words[0], right: words.slice(1).join(" ") };
        }
        return { left: words[0] || "शुभ", right: "लाभ" };
      case "SHUBH_LABH":
      default:
        return { left: "शुभ", right: "लाभ" };
    }
  };

  const geode = getGeodeStyle();
  const crystal = getCrystalBorderStyle();
  const script = getScriptPair();
  const hasLed = store.festive?.hasLedBacklight;

  const handleExportProof = () => {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1600;
    exportCanvas.height = 1200;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    const renderCustomOverlays = () => {
      // Gold Calligraphy
      ctx.fillStyle = "#FFF2B2";
      ctx.font = "bold 110px 'Rozha One', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 20;
      ctx.fillText(script.left, 520, 550);
      ctx.fillText(script.right, 1080, 550);

      // Watermark & Title
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px 'Cinzel', serif";
      ctx.fillText("Artआलय — Sacred Toran & Shubh Labh Artisan Studio", 800, 1080);
      ctx.font = "20px 'Plus Jakarta Sans', sans-serif";
      ctx.fillStyle = "#FEF08A";
      ctx.fillText("Production Proof • Hand-Poured Luxury Resin & Raw Crystals", 800, 1120);

      const link = document.createElement("a");
      link.download = `ArtAalay-Shubh-Labh-${Date.now()}.png`;
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    };

    if (store.productImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1600, 1200);
        ctx.fillStyle = geode.tintHex;
        ctx.fillRect(0, 0, 1600, 1200);
        renderCustomOverlays();
      };
      img.onerror = () => {
        drawProceduralToranBase(ctx);
        renderCustomOverlays();
      };
      img.src = store.productImage;
    } else {
      drawProceduralToranBase(ctx);
      renderCustomOverlays();
    }
  };

  const drawProceduralToranBase = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "#F7F3EE";
    ctx.fillRect(0, 0, 1600, 1200);

    // Left disc
    ctx.beginPath();
    ctx.arc(520, 550, 240, 0, Math.PI * 2);
    ctx.fillStyle = "#0F3831";
    ctx.fill();
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 14;
    ctx.stroke();

    // Right disc
    ctx.beginPath();
    ctx.arc(1080, 550, 240, 0, Math.PI * 2);
    ctx.fillStyle = "#0F3831";
    ctx.fill();
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 14;
    ctx.stroke();
  };

  return (
    <div
      ref={canvasContainerRef}
      className="w-full flex flex-col items-center select-none"
    >
      {/* Studio Header Bar */}
      <div className="w-full max-w-[580px] flex items-center justify-between mb-3 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-sand/70 rounded-full border border-brand-sand text-xs font-bold text-brand-emerald shadow-2xs">
          <ImageIcon className="w-3.5 h-3.5 text-brand-gold" />
          <span>Artisan Photo Preview</span>
        </div>

        <span className="text-[11px] font-semibold text-brand-emerald hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-gold" />
          Live 2D Customization
        </span>
      </div>

      {/* 2D Canvas Viewport */}
      <div
        style={{ width: dimensions.width, height: dimensions.height }}
        className={`relative rounded-3xl border border-brand-sand shadow-soft flex items-center justify-center p-4 overflow-hidden transition-all duration-300 ${hasLed
            ? "shadow-[0_0_50px_rgba(253,224,71,0.5)] ring-4 ring-amber-300/40"
            : ""
          }`}
      >
        {/* ORIGINAL PRODUCT PHOTOGRAPH SUBSTRATE */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              store.productImage ||
              "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80"
            }
            alt={store.productTitle}
            className="w-full h-full object-cover rounded-3xl"
          />
          {/* Geode Tone Glaze */}
          <div
            style={{ background: geode.tintHex }}
            className="absolute inset-0 mix-blend-color opacity-50 pointer-events-none rounded-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 pointer-events-none rounded-3xl" />
        </div>

        {/* Golden Hanging Top Bar / Dori Cord */}
        <div className="absolute top-6 left-12 right-12 h-1 bg-gradient-to-r from-brand-gold/20 via-brand-gold to-brand-gold/20 rounded-full shadow-sm flex justify-between px-8 z-10">
          <div className="w-1.5 h-12 bg-gradient-to-b from-brand-gold to-brand-gold/40 mx-auto -mt-1 rounded-full" />
          <div className="w-1.5 h-12 bg-gradient-to-b from-brand-gold to-brand-gold/40 mx-auto -mt-1 rounded-full" />
        </div>

        {/* Dual Geode Discs Container */}
        <div className="relative z-10 flex items-center justify-center gap-6 sm:gap-12 mt-4">
          {/* Left Disc (e.g. "शुभ") */}
          <div className="flex flex-col items-center">
            <div
              style={{
                width: Math.min(dimensions.width * 0.38, 190),
                height: Math.min(dimensions.width * 0.38, 190),
                background: "rgba(0,0,0,0.35)",
                boxShadow: hasLed
                  ? `0 0 35px 8px ${geode.glow}, 0 10px 25px rgba(0,0,0,0.4)`
                  : "0 12px 30px rgba(0,0,0,0.3)",
              }}
              className="relative rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xs border-2 border-brand-gold/80"
            >
              {/* Raw Crystal Perimeter */}
              <div
                style={{
                  border: crystal.border,
                  boxShadow: crystal.shadow,
                }}
                className="absolute inset-1 rounded-full pointer-events-none"
              />

              {/* Gold Foil Veins */}
              <div
                style={{ borderColor: geode.vein }}
                className="absolute inset-4 rounded-full border-2 border-dashed opacity-75 pointer-events-none"
              />

              {/* 3D Gold Devanagari Script */}
              <div className="relative text-center px-2">
                <span
                  style={{
                    textShadow:
                      "0 3px 8px rgba(0,0,0,0.8), 0 0 20px rgba(255,242,178,0.8)",
                  }}
                  className="font-serif font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-brand-gold block tracking-wide select-none"
                >
                  {script.left}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-amber-200/90 font-bold block mt-0.5 drop-shadow">
                  Auspicious
                </span>
              </div>
            </div>

            {/* Hanging Accents (Bells / Tassels) */}
            <div className="mt-2 flex flex-col items-center">
              <div className="w-0.5 h-6 bg-brand-gold/80" />
              {store.festive?.hangingElement === "BRASS_BELLS" ? (
                <div className="w-6 h-6 rounded-full bg-gradient-to-b from-yellow-100 via-amber-400 to-amber-700 flex items-center justify-center shadow-md animate-bounce">
                  <Bell className="w-3.5 h-3.5 text-amber-950" />
                </div>
              ) : store.festive?.hangingElement === "MARIGOLD_TASSELS" ? (
                <div className="w-5 h-7 rounded-full bg-orange-500 shadow-md flex items-center justify-center text-[10px]">
                  🌼
                </div>
              ) : store.festive?.hangingElement === "PEARL_DROPS" ? (
                <div className="w-4 h-6 rounded-full bg-white border border-amber-300 shadow-md flex items-center justify-center text-[8px]">
                  ⚪
                </div>
              ) : (
                <div className="w-2 h-6 bg-red-600 rounded-full shadow-xs" />
              )}
            </div>
          </div>

          {/* Right Disc (e.g. "लाभ") */}
          <div className="flex flex-col items-center">
            <div
              style={{
                width: Math.min(dimensions.width * 0.38, 190),
                height: Math.min(dimensions.width * 0.38, 190),
                background: "rgba(0,0,0,0.35)",
                boxShadow: hasLed
                  ? `0 0 35px 8px ${geode.glow}, 0 10px 25px rgba(0,0,0,0.4)`
                  : "0 12px 30px rgba(0,0,0,0.3)",
              }}
              className="relative rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xs border-2 border-brand-gold/80"
            >
              {/* Raw Crystal Perimeter */}
              <div
                style={{
                  border: crystal.border,
                  boxShadow: crystal.shadow,
                }}
                className="absolute inset-1 rounded-full pointer-events-none"
              />

              {/* Gold Foil Veins */}
              <div
                style={{ borderColor: geode.vein }}
                className="absolute inset-4 rounded-full border-2 border-dashed opacity-75 pointer-events-none"
              />

              {/* 3D Gold Devanagari Script */}
              <div className="relative text-center px-2">
                <span
                  style={{
                    textShadow:
                      "0 3px 8px rgba(0,0,0,0.8), 0 0 20px rgba(255,242,178,0.8)",
                  }}
                  className="font-serif font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-brand-gold block tracking-wide select-none"
                >
                  {script.right}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-amber-200/90 font-bold block mt-0.5 drop-shadow">
                  Prosperity
                </span>
              </div>
            </div>

            {/* Hanging Accents (Bells / Tassels) */}
            <div className="mt-2 flex flex-col items-center">
              <div className="w-0.5 h-6 bg-brand-gold/80" />
              {store.festive?.hangingElement === "BRASS_BELLS" ? (
                <div className="w-6 h-6 rounded-full bg-gradient-to-b from-yellow-100 via-amber-400 to-amber-700 flex items-center justify-center shadow-md animate-bounce">
                  <Bell className="w-3.5 h-3.5 text-amber-950" />
                </div>
              ) : store.festive?.hangingElement === "MARIGOLD_TASSELS" ? (
                <div className="w-5 h-7 rounded-full bg-orange-500 shadow-md flex items-center justify-center text-[10px]">
                  🌼
                </div>
              ) : store.festive?.hangingElement === "PEARL_DROPS" ? (
                <div className="w-4 h-6 rounded-full bg-white border border-amber-300 shadow-md flex items-center justify-center text-[8px]">
                  ⚪
                </div>
              ) : (
                <div className="w-2 h-6 bg-red-600 rounded-full shadow-xs" />
              )}
            </div>
          </div>
        </div>

        {/* Ambient Backlight Aura Indicator */}
        {hasLed && (
          <div className="absolute bottom-2 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 text-[10px] text-amber-200 font-semibold">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            <span>12V Festive Halo On</span>
          </div>
        )}

        {/* Customer Requirements Indicator */}
        {store.festive?.requirementsText && (
          <div className="absolute bottom-3 left-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-brand-gold/40 text-white text-[11px] flex items-center gap-2 shadow-lg">
            <span className="text-brand-gold font-bold shrink-0">📝 Requirements:</span>
            <span className="truncate text-white/90 italic">{store.festive.requirementsText}</span>
          </div>
        )}
      </div>

      {/* Snapshot Proof Export Bar */}
      <div className="w-full max-w-[580px] flex items-center justify-between mt-3 px-2">
        <span className="text-[11px] text-slate-500 font-medium">
          Original Artisan Piece with Live Customizations
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
