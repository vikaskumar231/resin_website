"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { GaneshaEmblem, SwastikEmblem, LotusEmblem, EvilEyeEmblem } from "./SacredEmblems";
import { Download, Sparkles, Image as ImageIcon } from "lucide-react";

export default function NameplateCanvas() {
  const store = useCustomizerStore();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 700, height: 440 });

  useEffect(() => {
    setIsClient(true);
    const updateSize = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.offsetWidth;
        const width = Math.min(containerWidth, 800);
        let aspectRatio = 10 / 16;
        if (store.nameplate.size === "12x8") aspectRatio = 8 / 12;
        else if (store.nameplate.size === "16x10") aspectRatio = 10 / 16;
        else if (store.nameplate.size === "18x12") aspectRatio = 12 / 18;
        const height = Math.round(width * aspectRatio);
        setDimensions({ width, height });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [store.nameplate.size]);

  if (!isClient) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-brand-ivory rounded-3xl border border-brand-sand shadow-inner animate-pulse">
        <span className="text-brand-teal font-sans text-sm font-medium">
          Loading Artआलय 2D Customizer Studio...
        </span>
      </div>
    );
  }

  // Colorway CSS and Canvas gradient maps
  const getColorwayGradient = () => {
    switch (store.nameplate.colorway) {
      case "OCEAN_WAVE":
        return "linear-gradient(135deg, rgba(26,83,92,0.85) 0%, rgba(78,205,196,0.75) 60%, rgba(255,255,255,0.6) 100%)";
      case "EMERALD_GEODE":
        return "linear-gradient(135deg, rgba(15,56,49,0.88) 0%, rgba(38,102,87,0.78) 50%, rgba(212,175,55,0.6) 100%)";
      case "RUBY_WINE":
        return "linear-gradient(135deg, rgba(92,15,30,0.88) 0%, rgba(168,36,65,0.78) 60%, rgba(243,229,171,0.6) 100%)";
      case "MIDNIGHT_GOLD":
        return "linear-gradient(135deg, rgba(20,24,30,0.92) 0%, rgba(45,52,65,0.82) 60%, rgba(212,175,55,0.65) 100%)";
      default:
        return "linear-gradient(135deg, rgba(26,83,92,0.85) 0%, rgba(78,205,196,0.75) 100%)";
    }
  };

  // Resin inpainting glaze bed to smoothly dissolve sample photograph text when custom text is active
  const getResinBedStyle = () => {
    switch (store.nameplate.colorway) {
      case "OCEAN_WAVE":
        return {
          background:
            "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(13, 59, 66, 0.94) 0%, rgba(20, 82, 90, 0.88) 55%, rgba(15, 50, 58, 0.3) 85%, transparent 100%)",
          boxShadow: "inset 0 0 40px rgba(78, 205, 196, 0.25)",
        };
      case "EMERALD_GEODE":
        return {
          background:
            "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(10, 42, 35, 0.95) 0%, rgba(18, 65, 55, 0.88) 55%, rgba(15, 45, 38, 0.3) 85%, transparent 100%)",
          boxShadow: "inset 0 0 40px rgba(38, 102, 87, 0.3)",
        };
      case "RUBY_WINE":
        return {
          background:
            "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(68, 10, 22, 0.95) 0%, rgba(102, 18, 38, 0.88) 55%, rgba(60, 10, 20, 0.3) 85%, transparent 100%)",
          boxShadow: "inset 0 0 40px rgba(168, 36, 65, 0.25)",
        };
      case "MIDNIGHT_GOLD":
        return {
          background:
            "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(15, 18, 24, 0.96) 0%, rgba(28, 34, 44, 0.9) 55%, rgba(15, 18, 24, 0.3) 85%, transparent 100%)",
          boxShadow: "inset 0 0 40px rgba(212, 175, 55, 0.2)",
        };
      default:
        return {
          background:
            "radial-gradient(ellipse 85% 70% at 50% 50%, rgba(13, 59, 66, 0.94) 0%, rgba(20, 82, 90, 0.88) 55%, rgba(15, 50, 58, 0.3) 85%, transparent 100%)",
          boxShadow: "inset 0 0 40px rgba(78, 205, 196, 0.25)",
        };
    }
  };

  const hasCustomText = Boolean(
    store.nameplate.typography.line1?.trim() || store.nameplate.typography.line2?.trim()
  );

  const handleExportProof = () => {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 2400;
    exportCanvas.height = 1500;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    const finalizeAndDownload = () => {
      // If custom text exists, apply feathered resin inpainting bed over center
      if (hasCustomText) {
        ctx.save();
        const radGrad = ctx.createRadialGradient(1200, 750, 100, 1200, 750, 750);
        switch (store.nameplate.colorway) {
          case "EMERALD_GEODE":
            radGrad.addColorStop(0, "rgba(10, 42, 35, 0.96)");
            radGrad.addColorStop(0.55, "rgba(18, 65, 55, 0.90)");
            radGrad.addColorStop(1, "rgba(10, 42, 35, 0)");
            break;
          case "RUBY_WINE":
            radGrad.addColorStop(0, "rgba(68, 10, 22, 0.96)");
            radGrad.addColorStop(0.55, "rgba(102, 18, 38, 0.90)");
            radGrad.addColorStop(1, "rgba(68, 10, 22, 0)");
            break;
          case "MIDNIGHT_GOLD":
            radGrad.addColorStop(0, "rgba(15, 18, 24, 0.97)");
            radGrad.addColorStop(0.55, "rgba(28, 34, 44, 0.92)");
            radGrad.addColorStop(1, "rgba(15, 18, 24, 0)");
            break;
          case "OCEAN_WAVE":
          default:
            radGrad.addColorStop(0, "rgba(13, 59, 66, 0.96)");
            radGrad.addColorStop(0.55, "rgba(20, 82, 90, 0.90)");
            radGrad.addColorStop(1, "rgba(13, 59, 66, 0)");
            break;
        }
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.ellipse(1200, 750, 750, 320, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Layer: Typography & Emblems
      ctx.fillStyle = "#D4AF37";
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 12;

      const hasLine1 = Boolean(store.nameplate.typography.line1?.trim());
      const hasLine2 = Boolean(store.nameplate.typography.line2?.trim());

      if (hasLine1 && hasLine2) {
        // Line 1 centered above divider
        ctx.font = "bold 96px serif";
        ctx.fillText(store.nameplate.typography.line1, 1200, 720);

        // Gold divider bar
        ctx.save();
        const divGrad = ctx.createLinearGradient(900, 770, 1500, 770);
        divGrad.addColorStop(0, "rgba(212, 175, 55, 0)");
        divGrad.addColorStop(0.5, "rgba(255, 215, 0, 0.95)");
        divGrad.addColorStop(1, "rgba(212, 175, 55, 0)");
        ctx.strokeStyle = divGrad;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(900, 770);
        ctx.lineTo(1500, 770);
        ctx.stroke();
        ctx.restore();

        // Line 2 centered below divider
        ctx.font = "600 44px sans-serif";
        ctx.fillText(store.nameplate.typography.line2.toUpperCase(), 1200, 845);
      } else if (hasLine1) {
        ctx.font = "bold 100px serif";
        ctx.fillText(store.nameplate.typography.line1, 1200, 770);
      } else if (hasLine2) {
        ctx.font = "600 50px sans-serif";
        ctx.fillText(store.nameplate.typography.line2.toUpperCase(), 1200, 770);
      }

      // Watermark
      ctx.font = "300 24px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
      ctx.fillText("Artआलय Studio • 300 DPI Official Production Proof", 1200, 1420);

      const link = document.createElement("a");
      link.download = `ArtAalay-Proof-${store.productSlug}.png`;
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    };

    // If product image is available, draw as photographic base
    if (store.productImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 2400, 1500);

        // Apply translucent resin overlay
        ctx.fillStyle = "rgba(15, 56, 49, 0.25)";
        ctx.fillRect(0, 0, 2400, 1500);

        finalizeAndDownload();
      };
      img.onerror = () => {
        // Fallback procedural substrate
        drawProceduralSubstrate(ctx);
        finalizeAndDownload();
      };
      img.src = store.productImage;
    } else {
      drawProceduralSubstrate(ctx);
      finalizeAndDownload();
    }
  };

  const drawProceduralSubstrate = (ctx: CanvasRenderingContext2D) => {
    // Carefully sourced quality base procedural render
    ctx.fillStyle = "#8B5A2B";
    ctx.fillRect(0, 0, 2400, 1500);
    ctx.strokeStyle = "rgba(107, 58, 10, 0.4)";
    ctx.lineWidth = 14;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.ellipse(1200, 750, 400 + i * 80, 200 + i * 40, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  return (
    <div
      ref={canvasContainerRef}
      className="w-full flex flex-col items-center justify-center p-2 sm:p-4 select-none"
    >
      {/* Studio Header Bar */}
      <div className="w-full max-w-[800px] flex items-center justify-between mb-3 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-sand/70 rounded-full border border-brand-sand text-xs font-bold text-brand-emerald shadow-2xs">
          <ImageIcon className="w-3.5 h-3.5 text-brand-gold" />
          <span>
            {hasCustomText ? "Bespoke Live Preview" : "Artisan Photo Preview"}
          </span>
        </div>

        <span className="text-[11px] font-semibold text-brand-emerald hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-gold" />
          {hasCustomText
            ? "Your Personalization Overlaid in 3D Acrylic"
            : "Enter Name Below to Personalize"}
        </span>
      </div>

      {/* 2D Layered Preview Container with Simulated Depth */}
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
        className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex items-center justify-center border-4 ${
          store.nameplate.hasLedBacklight
            ? "border-amber-200/90 shadow-[0_0_60px_rgba(253,224,71,0.55)] ring-4 ring-amber-300/40"
            : "border-white/50 shadow-[0_20px_50px_rgba(15,56,49,0.2)]"
        }`}
      >
        {/* ORIGINAL PRODUCT PHOTOGRAPH SUBSTRATE */}
        <div className="absolute inset-0 z-0">
          {/* The Actual Original Product Image */}
          <img
            src={
              store.productImage ||
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
            }
            alt={store.productTitle}
            className="w-full h-full object-cover rounded-3xl"
          />

          {/* Dynamic Resin Pigment Swatch Glaze */}
          <div
            style={{
              background: getColorwayGradient(),
            }}
            className="absolute inset-0 transition-all duration-500 opacity-30 mix-blend-overlay pointer-events-none rounded-3xl"
          />

          {/* Subtle Vignette for Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 pointer-events-none rounded-3xl" />
        </div>

        {/* Layer 2: Inclusions Layer (24K Gold Foil Flecks & Botanicals) */}
        {store.nameplate.inclusions.includes("GOLD_FOIL") && (
          <div className="absolute inset-0 pointer-events-none opacity-85 z-10">
            <div className="absolute top-[28%] left-[15%] w-3 h-2 bg-gradient-to-tr from-amber-300 to-yellow-100 rounded-sm rotate-12 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            <div className="absolute top-[35%] left-[65%] w-4 h-3 bg-gradient-to-tr from-amber-300 to-yellow-100 rounded-sm -rotate-45 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
            <div className="absolute top-[75%] left-[25%] w-2 h-4 bg-gradient-to-tr from-amber-300 to-yellow-100 rounded-sm rotate-45 shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
            <div className="absolute top-[60%] left-[80%] w-5 h-2 bg-gradient-to-tr from-amber-300 to-yellow-100 rounded-sm rotate-6 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
            <div className="absolute top-[82%] left-[55%] w-3 h-3 bg-gradient-to-tr from-amber-300 to-yellow-100 rounded-sm -rotate-12 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
          </div>
        )}

        {store.nameplate.inclusions.includes("DRIED_BOTANICALS") && (
          <div className="absolute inset-0 pointer-events-none opacity-90 z-10">
            <div className="absolute top-[45%] left-[20%] text-rose-300/80 text-xl rotate-12 blur-[0.3px]">
              🌸
            </div>
            <div className="absolute top-[70%] left-[75%] text-indigo-300/80 text-xl -rotate-45 blur-[0.3px]">
              🪻
            </div>
            <div className="absolute top-[78%] left-[35%] text-emerald-300/70 text-sm rotate-45">
              🍃
            </div>
          </div>
        )}

        {/* Reference Image Badge (when uploaded by user) */}
        {store.nameplate.referenceImage && (
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-brand-gold/60 shadow-lg">
            <img
              src={store.nameplate.referenceImage}
              alt="Reference Preview"
              className="w-5 h-5 rounded-full object-cover border border-brand-gold shadow-xs"
            />
            <span className="text-[11px] font-semibold text-amber-200 tracking-wide">
              Reference Photo Attached
            </span>
          </div>
        )}

        {/* Layer 2.5: Seamless Liquid Resin Glaze Inpainting Bed */}
        {/* Conceals sample photograph text when custom text is entered while preserving natural edges, pebbles & sacred symbols */}
        {hasCustomText && (
          <div
            className="absolute inset-x-[8%] sm:inset-x-[12%] top-[18%] bottom-[20%] z-15 pointer-events-none rounded-[2.5rem] transition-all duration-500 backdrop-blur-xl border border-white/10 overflow-hidden"
            style={{
              ...getResinBedStyle(),
              maskImage:
                "radial-gradient(ellipse 90% 80% at 50% 50%, black 55%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 90% 80% at 50% 50%, black 55%, transparent 100%)",
            }}
          >
            {/* Swirling micro-glaze & resin wave depth highlights */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 mix-blend-overlay opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)] opacity-40" />
          </div>
        )}

        {/* Layer 3: Sacred Emblem (Laser Cut 3D Gold Symbol) */}
        {store.nameplate.emblem !== "NONE" && (
          <div className="absolute top-4 sm:top-6 z-20 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-950/90 via-emerald-950/90 to-black/95 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.7)] border-2 border-brand-gold p-1.5 transition-transform hover:scale-105">
              {store.nameplate.emblem === "GANESHA" && <GaneshaEmblem size={30} />}
              {store.nameplate.emblem === "SWASTIK" && <SwastikEmblem size={28} />}
              {store.nameplate.emblem === "LOTUS" && <LotusEmblem size={28} />}
              {store.nameplate.emblem === "EVIL_EYE" && <EvilEyeEmblem size={28} />}
            </div>
          </div>
        )}

        {/* Layer 4: 3D Mirror Acrylic Laser-Cut Typography (Focally Centered) */}
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 max-w-[88%] pointer-events-none">
          {/* Primary Name (Line 1) */}
          {store.nameplate.typography.line1 ? (
            <h1
              style={{
                fontFamily:
                  store.nameplate.typography.fontFamily === "Rozha One"
                    ? "var(--font-rozha), serif"
                    : store.nameplate.typography.fontFamily === "Cinzel"
                    ? "var(--font-cinzel), serif"
                    : store.nameplate.typography.fontFamily === "Playfair"
                    ? "var(--font-playfair), serif"
                    : "var(--font-jakarta), sans-serif",
              }}
              className={`text-2xl sm:text-4xl md:text-5xl font-bold tracking-wide transition-all duration-300 leading-tight ${
                store.nameplate.typography.material === "GOLD_MIRROR"
                  ? "text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]"
                  : store.nameplate.typography.material === "ROSE_GOLD_MIRROR"
                  ? "text-transparent bg-clip-text bg-gradient-to-b from-rose-100 via-pink-300 to-rose-600 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]"
                  : "text-neutral-900 drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)]"
              }`}
            >
              {store.nameplate.typography.line1}
            </h1>
          ) : null}

          {/* 3D Laser-cut Mirror Gold Accent Divider Bar */}
          {store.nameplate.typography.line1 && store.nameplate.typography.line2 && (
            <div className="w-24 sm:w-44 h-[2px] sm:h-[3px] my-2 sm:my-3 rounded-full bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_8px_rgba(253,224,71,0.85)]" />
          )}

          {/* Secondary Subtitle / Address (Line 2) */}
          {store.nameplate.typography.line2 ? (
            <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] sm:tracking-[0.35em] uppercase text-amber-100/95 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {store.nameplate.typography.line2}
            </p>
          ) : null}
        </div>

        {/* Layer 5: Hanging Brass Bells (Optional Addon) */}
        {store.nameplate.hasBrassBells && (
          <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-around px-12 pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center animate-bounce-short">
                <div className="w-0.5 h-4 sm:h-6 bg-gradient-to-b from-brand-gold to-yellow-600" />
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-yellow-600 via-amber-300 to-yellow-100 shadow-md border border-amber-500/80" />
              </div>
            ))}
          </div>
        )}

        {/* Ambient Backlight Aura Indicator */}
        {store.nameplate.hasLedBacklight && (
          <div className="absolute bottom-2 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-300/40 text-[10px] text-amber-200 font-semibold">
            <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            <span>12V Warm LED Backlight On</span>
          </div>
        )}

        {/* Customer Requirements Indicator */}
        {store.nameplate?.requirementsText && (
          <div className="absolute bottom-3 left-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-brand-gold/40 text-white text-[11px] flex items-center gap-2 shadow-lg">
            <span className="text-brand-gold font-bold shrink-0">📝 Requirements:</span>
            <span className="truncate text-white/90 italic">{store.nameplate.requirementsText}</span>
          </div>
        )}
      </div>

      {/* Snapshot Proof Export Bar */}
      <div className="w-full max-w-[800px] flex items-center justify-between mt-3 px-2">
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
