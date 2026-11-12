"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCustomizerStore } from "@/store/useCustomizerStore";
import { Download, Sparkles, Image as ImageIcon } from "lucide-react";

export default function KeyringCanvas() {
  const store = useCustomizerStore();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ size: 480 });

  useEffect(() => {
    setIsClient(true);
    const updateSize = () => {
      if (canvasContainerRef.current) {
        const containerWidth = canvasContainerRef.current.offsetWidth;
        const size = Math.min(containerWidth, 540);
        setDimensions({ size });
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
          Loading Artआलय Monogram Keyring Studio...
        </span>
      </div>
    );
  }

  // Classic Polished Brass Gold Hardware
  const hw = {
    gradient: "linear-gradient(135deg, #FFF2B2 0%, #D4AF37 50%, #996515 100%)",
    border: "#D4AF37",
    text: "#996515",
    hex: "#D4AF37",
  };

  // Resin Fill Style Colors & Gradients
  const getResinStyle = () => {
    switch (store.keyring.style) {
      case "BLUSH_ROSE_PETAL":
        return {
          bg: "radial-gradient(circle at 35% 35%, rgba(254, 226, 226, 0.85) 0%, rgba(251, 182, 206, 0.75) 60%, rgba(244, 114, 182, 0.5) 100%)",
          border: "rgba(244, 114, 182, 0.6)",
          textFill: "linear-gradient(180deg, #FFFFFF 0%, #FBCFE8 50%, #BE185D 100%)",
          tintHex: "rgba(225, 29, 72, 0.25)",
          accentEmoji: "🌸",
        };
      case "EMERALD_MINT":
        return {
          bg: "radial-gradient(circle at 35% 35%, rgba(209, 250, 229, 0.85) 0%, rgba(52, 211, 153, 0.65) 60%, rgba(15, 56, 49, 0.7) 100%)",
          border: "rgba(52, 211, 153, 0.6)",
          textFill: "linear-gradient(180deg, #FFFFFF 0%, #A7F3D0 50%, #065F46 100%)",
          tintHex: "rgba(15, 56, 49, 0.25)",
          accentEmoji: "🍃",
        };
      case "MIDNIGHT_OBSIDIAN":
        return {
          bg: "radial-gradient(circle at 35% 35%, rgba(55, 65, 81, 0.9) 0%, rgba(31, 41, 55, 0.95) 60%, rgba(17, 24, 39, 0.98) 100%)",
          border: "rgba(212, 175, 55, 0.5)",
          textFill: "linear-gradient(180deg, #FFF2B2 0%, #D4AF37 50%, #78350F 100%)",
          tintHex: "rgba(17, 24, 39, 0.35)",
          accentEmoji: "✨",
        };
      case "GOLD_FOIL_CLEAR":
      default:
        return {
          bg: "radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(254, 243, 199, 0.7) 50%, rgba(253, 230, 138, 0.45) 100%)",
          border: "rgba(212, 175, 55, 0.5)",
          textFill: "linear-gradient(180deg, #FFFFFF 0%, #FEF08A 40%, #D4AF37 100%)",
          tintHex: "rgba(212, 175, 55, 0.2)",
          accentEmoji: "✨",
        };
    }
  };

  const resin = getResinStyle();

  const handleExportProof = () => {
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = 1800;
    exportCanvas.height = 1800;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    const renderCustomOverlays = () => {
      // Key Ring Loop at top
      ctx.save();
      ctx.lineWidth = 36;
      ctx.strokeStyle = hw.hex;
      ctx.beginPath();
      ctx.arc(900, 360, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Connector Chain
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.moveTo(900, 500);
      ctx.lineTo(900, 680);
      ctx.stroke();
      ctx.restore();

      // 3D Shadow for Letter
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.font = "bold 650px 'Playfair Display', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(store.keyring.letter || "A", 930, 1150);

      // Letter Resin Body
      ctx.fillStyle = hw.hex;
      ctx.fillText(store.keyring.letter || "A", 900, 1120);

      // Tag (If engraved) - realistically attached to hardware chain connector
      if (store.keyring.hasEngravedTag) {
        const textToDraw = store.keyring.engravedText || "YOUR NAME";
        ctx.save();

        // 1. Jump ring from lower chain (900, 590) to charm tag grommet (1040, 620)
        ctx.strokeStyle = hw.hex;
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(900, 590);
        ctx.lineTo(1040, 620);
        ctx.stroke();

        // 2. Charm disc shadow
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.beginPath();
        ctx.arc(1135, 705, 110, 0, Math.PI * 2);
        ctx.fill();

        // 3. Charm disc radial gold gradient
        const tagGrad = ctx.createRadialGradient(1110, 680, 20, 1130, 700, 110);
        tagGrad.addColorStop(0, "#FFFBEA");
        tagGrad.addColorStop(0.3, "#F5DE88");
        tagGrad.addColorStop(0.65, "#D4AF37");
        tagGrad.addColorStop(1, "#78350F");
        ctx.fillStyle = tagGrad;
        ctx.beginPath();
        ctx.arc(1130, 700, 110, 0, Math.PI * 2);
        ctx.fill();

        // 4. Charm disc gold border
        ctx.strokeStyle = "#FEF3C7";
        ctx.lineWidth = 8;
        ctx.stroke();

        // 5. Top grommet hole
        ctx.fillStyle = "#1C1917";
        ctx.beginPath();
        ctx.arc(1060, 630, 14, 0, Math.PI * 2);
        ctx.fill();

        // 6. Laser-etched text
        ctx.fillStyle = "#2C1810";
        ctx.font = "bold 44px 'Playfair Display', serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(textToDraw, 1130, 710);
        ctx.restore();
      }

      // Studio Proof Watermark
      ctx.font = "300 24px sans-serif";
      ctx.fillStyle = "rgba(15, 56, 49, 0.65)";
      ctx.fillText(
        `Artआलय Studio • Monogram '${store.keyring.letter}' Keyring Proof`,
        900,
        1720
      );

      const link = document.createElement("a");
      link.download = `ArtAalay-Keyring-${store.keyring.letter}.png`;
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    };

    if (store.productImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 1800, 1800);
        ctx.fillStyle = resin.tintHex;
        ctx.fillRect(0, 0, 1800, 1800);
        renderCustomOverlays();
      };
      img.onerror = () => {
        drawProceduralKeyringBase(ctx);
        renderCustomOverlays();
      };
      img.src = store.productImage;
    } else {
      drawProceduralKeyringBase(ctx);
      renderCustomOverlays();
    }
  };

  const drawProceduralKeyringBase = (ctx: CanvasRenderingContext2D) => {
    const bgGrad = ctx.createRadialGradient(900, 900, 100, 900, 900, 1200);
    bgGrad.addColorStop(0, "#FFFFFF");
    bgGrad.addColorStop(0.6, "#F7F3EE");
    bgGrad.addColorStop(1, "#E5DDD0");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1800, 1800);
  };

  return (
    <div
      ref={canvasContainerRef}
      className="w-full flex flex-col items-center justify-center p-2 sm:p-4 select-none"
    >
      {/* Studio Header Bar */}
      <div className="w-full max-w-[540px] flex items-center justify-between mb-3 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-sand/70 rounded-full border border-brand-sand text-xs font-bold text-brand-emerald shadow-2xs">
          <ImageIcon className="w-3.5 h-3.5 text-brand-gold" />
          <span>Artisan Photo Preview</span>
        </div>

        <span className="text-[11px] font-semibold text-brand-emerald hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-gold" />
          Live 2D Customization
        </span>
      </div>

      {/* 1:1 Aspect Ratio Studio Viewport */}
      <div
        style={{
          width: dimensions.size,
          height: dimensions.size,
        }}
        className="relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col items-center justify-center bg-gradient-to-br from-white via-brand-sand/50 to-amber-50/40 border-4 border-white/70"
      >
        {/* ORIGINAL PRODUCT PHOTOGRAPH SUBSTRATE */}
        <div className="absolute inset-0 z-0">
          <img
            src={
              store.productImage ||
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
            }
            alt={store.productTitle}
            className="w-full h-full object-cover rounded-3xl"
          />
          {/* Subtle resin tint glaze */}
          <div
            style={{ background: resin.tintHex }}
            className="absolute inset-0 pointer-events-none rounded-3xl mix-blend-color"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none rounded-3xl" />
        </div>

        {/* Floating Reference Attached Badge */}
        {store.keyring.referenceImage && (
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-brand-gold/60 shadow-lg">
            <img
              src={store.keyring.referenceImage}
              alt="Reference Preview"
              className="w-5 h-5 rounded-full object-cover border border-amber-300"
            />
            <span className="text-[11px] font-semibold text-amber-200">
              Reference Attached
            </span>
          </div>
        )}

        {/* Floating Laser Engraved Tag Callout Badge */}
        {store.keyring.hasEngravedTag && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-brand-gold/70 shadow-lg animate-in fade-in slide-in-from-top-1">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 font-sans">
                Engraved Tag:
              </span>
              <span className="text-[11px] font-extrabold text-white font-mono tracking-wide">
                &ldquo;{store.keyring.engravedText || "Your Name"}&rdquo;
              </span>
            </div>
          </div>
        )}

        {/* 1. Metal Key Loop Hardware on Top */}
        <div className="relative z-20 flex flex-col items-center -mt-6 sm:-mt-8">
          {/* Main Key Split Ring */}
          <div
            style={{
              background: hw.gradient,
              boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
            }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-2 flex items-center justify-center transition-all"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-ivory border-2 border-black/10 shadow-inner" />
          </div>

          {/* Connector Chain Links & Hanging Charm Anchor */}
          <div className="relative flex flex-col items-center -space-y-1 my-1">
            {/* Upper Chain Link */}
            <div
              style={{ background: hw.gradient }}
              className="w-3.5 h-5 rounded-full border border-black/20 shadow-sm"
            />

            {/* Lower Chain Link with Jump Ring & Engraved Charm Tag */}
            <div className="relative flex items-center justify-center">
              <div
                style={{ background: hw.gradient }}
                className="w-3.5 h-5 rounded-full border border-black/20 shadow-sm"
              />

              {/* Physical Laser-Engraved Charm Tag Attached to Chain */}
              {store.keyring.hasEngravedTag && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-1 flex items-center z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
                  {/* Angled Golden Jump Ring Link */}
                  <div className="relative flex items-center">
                    <div
                      style={{ background: hw.gradient }}
                      className="w-5 h-2.5 rounded-full border border-amber-900/40 shadow-xs rotate-[-15deg] origin-left"
                    />

                    {/* Laser-Engraved Polished Brass Disc Tag */}
                    <div
                      style={{
                        background:
                          "radial-gradient(circle at 35% 35%, #FFFBEA 0%, #F5DE88 25%, #D4AF37 55%, #996515 85%, #593E10 100%)",
                        boxShadow:
                          "0 6px 16px rgba(0,0,0,0.45), 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(0,0,0,0.5)",
                      }}
                      className="relative -ml-1 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-100 flex flex-col items-center justify-center p-1 shadow-xl rotate-[8deg] transition-all"
                    >
                      {/* Top Attachment Grommet Hole */}
                      <div className="absolute top-1 w-2 h-2 rounded-full bg-stone-900/70 border border-amber-200 shadow-inner" />

                      {/* Concentric Brushed Ring Guide */}
                      <div className="absolute inset-1.5 rounded-full border border-amber-800/20 pointer-events-none" />

                      {/* Laser-Etched Engraved Text */}
                      <span
                        style={{
                          textShadow:
                            "0 1px 0 rgba(255,255,255,0.4), 0 -1px 1px rgba(0,0,0,0.6)",
                        }}
                        className={`font-serif font-black text-center uppercase tracking-wider select-none px-1 leading-tight ${
                          store.keyring.engravedText
                            ? "text-amber-950 text-[10px] sm:text-xs"
                            : "text-amber-900/50 italic text-[9px] sm:text-[10px]"
                        }`}
                      >
                        {store.keyring.engravedText || "YOUR NAME"}
                      </span>

                      {/* Optical Shine Reflection */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-white/60 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Central 3D Crystal Monogram Letter */}
        <div className="relative z-10 flex items-center justify-center mt-2 group">
          {/* Simulated 8mm Deep Cast Shadow */}
          <div
            style={{
              fontSize: dimensions.size * 0.42,
              filter: "blur(12px)",
            }}
            className="absolute top-4 left-4 font-serif font-black text-black/50 select-none pointer-events-none"
          >
            {store.keyring.letter || "A"}
          </div>

          {/* Letter Body Container with Optical Glass Aesthetics */}
          <div
            style={{
              background: "rgba(0,0,0,0.25)",
              border: `2px solid ${hw.border}`,
              backdropFilter: "blur(4px)",
            }}
            className="relative px-6 py-2 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300"
          >
            <span
              style={{
                fontSize: dimensions.size * 0.38,
                lineHeight: 1,
                fontFamily: "var(--font-playfair), serif",
                textShadow:
                  "0 4px 14px rgba(0,0,0,0.7), 0 0 20px rgba(255,242,178,0.6)",
              }}
              className="font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-brand-gold select-none tracking-normal"
            >
              {store.keyring.letter || "A"}
            </span>

            {/* Suspended Botanical / Foil Micro Emojis */}
            <div className="absolute bottom-2 right-2 text-sm pointer-events-none">
              {resin.accentEmoji}
            </div>
          </div>
        </div>

        {/* Studio Spec Badge */}
        <div className="absolute bottom-3 left-4 z-20 text-[9px] uppercase tracking-widest text-white/90 drop-shadow font-sans">
          Artआलय • 2.2&quot; Monogram • Optical Clarity
        </div>

        {/* Customer Requirements Indicator */}
        {store.keyring?.requirementsText && (
          <div className="absolute bottom-9 left-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-brand-gold/40 text-white text-[11px] flex items-center gap-2 shadow-lg">
            <span className="text-brand-gold font-bold shrink-0">📝 Requirements:</span>
            <span className="truncate text-white/90 italic">{store.keyring.requirementsText}</span>
          </div>
        )}
      </div>

      {/* Snapshot Proof Export Bar */}
      <div className="w-full max-w-[540px] flex items-center justify-between mt-3 px-2">
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
