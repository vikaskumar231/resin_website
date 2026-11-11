"use client";

import React from "react";
import { Printer, ArrowLeft, CheckSquare } from "lucide-react";
import Link from "next/link";

interface JobSheetPageProps {
  params: {
    id: string;
  };
}

export default function WorkshopJobSheetPage({ params }: JobSheetPageProps) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans print:p-0 print:bg-white text-black">
      {/* Non-printed action bar */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog CMS</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-900 text-white text-xs font-bold shadow hover:bg-emerald-800 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print A4 Job Sheet</span>
        </button>
      </div>

      {/* A4 Sheet Container (Exact standard A4 210mm x 297mm bounds in print) */}
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 border border-slate-300 shadow-lg print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-black pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-serif tracking-tight">Artआलय Artisanal Studio</h1>
            <p className="text-xs uppercase tracking-wider text-slate-600 font-mono mt-0.5">
              Physical Workshop Manufacturing Job Sheet • CNC / Pour Guide
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl font-extrabold block">ART-2026-1049</span>
            <span className="text-[11px] text-slate-500 font-mono">Job ID: {id}</span>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs border border-black p-4 mb-6">
          <div>
            <p><strong>Customer:</strong> Priya Sharma (+91 9876543210)</p>
            <p><strong>Shipping Destination:</strong> Pune, Maharashtra (PIN: 411045)</p>
            <p><strong>Courier Service:</strong> Shiprocket Air Express (AWB: SR-EXP-7729104)</p>
          </div>
          <div>
            <p><strong>Target Item:</strong> Bespoke Natural Wood &amp; Ocean Wave Nameplate</p>
            <p><strong>Dimensions:</strong> 16.0&quot; Length x 10.0&quot; Height x 1.0&quot; Thickness</p>
            <p><strong>HSN Code:</strong> 3926 / 4420 • GST Rate: 18%</p>
          </div>
        </div>

        {/* Laser Cutter Vector Typography & Emblem Outline Specification */}
        <div className="border border-black p-5 mb-6 space-y-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider border-b border-dashed border-black pb-1">
            Section 1: Laser Cutting &amp; Acrylic Vector Outlines (US-6.3)
          </h3>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-300 space-y-1">
              <span className="font-mono text-[10px] text-slate-500 uppercase block">Line 1 Primary Vector</span>
              <p className="text-xl font-bold font-serif">&ldquo;The Sharmas&rdquo;</p>
              <p className="text-[11px] text-slate-600">Font: Cinzel Bold • Height: 48mm • Material: 3mm Mirror Gold Acrylic</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-300 space-y-1">
              <span className="font-mono text-[10px] text-slate-500 uppercase block">Line 2 Subtext Vector</span>
              <p className="text-base font-bold font-sans tracking-widest">&ldquo;VILLA 42, PALM GREENS&rdquo;</p>
              <p className="text-[11px] text-slate-600">Font: Plus Jakarta Sans • Height: 16mm • Material: 3mm Mirror Gold Acrylic</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-300 text-xs flex justify-between items-center">
            <div>
              <span className="font-mono text-[10px] text-slate-500 uppercase block">Sacred 3D Emblem</span>
              <p className="font-bold text-sm">Divine Ganesha Crest (Vector ID: VEC-EMB-GAN-01)</p>
              <p className="text-[11px] text-slate-600">Diameter: 55mm • Placement: Top Center (x=8.0&quot;, y=1.8&quot;)</p>
            </div>
            <div className="w-12 h-12 border-2 border-black rounded-full flex items-center justify-center font-bold text-xl">
              🕉️
            </div>
          </div>
        </div>

        {/* Resin Pouring Recipe & Inclusions */}
        <div className="border border-black p-5 mb-6 space-y-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider border-b border-dashed border-black pb-1">
            Section 2: Multi-Layer Resin Pouring &amp; Inclusions Spec
          </h3>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Base Substrate</span>
              <p className="font-bold">Durable Sourced Base Plaque</p>
              <p className="text-[11px] text-slate-600">Inspected &amp; Surface Sealed</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Resin Colorway</span>
              <p className="font-bold">Ocean Wave Froth</p>
              <p className="text-[11px] text-slate-600">Teal Base + Shoreline White</p>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-500 block">Recipe Batch Mix</span>
              <p className="font-bold font-mono">400g Part A + 200g Part B</p>
              <p className="text-[11px] text-slate-600">+ 12g Ocean Blue Pigment</p>
            </div>
          </div>

          <div className="pt-2 text-xs">
            <p><strong>Required Inclusions:</strong> 24K Genuine Imitation Gold Leaf Flecks (Hand-scattered along foam wave crest line).</p>
            <p><strong>Hardware Addons:</strong> 12V Warm White (3000K) LED Backlight strip fitted into routed timber channel.</p>
          </div>
        </div>

        {/* Quality Control & Curing Checklist */}
        <div className="border border-black p-5 space-y-3 text-xs">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider border-b border-dashed border-black pb-1">
            Section 3: Workshop Production &amp; Curing Gate Checklist
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-black" />
              <span>[ ] Pre-pour physical mockup WhatsApp proof &amp; delivery date confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-black" />
              <span>[ ] Timber grain sealed with primer coat (anti-outgassing)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-black" />
              <span>[ ] Slow dust-free chemical cure completed (Shore D &gt; 80)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-black" />
              <span>[ ] Edge beveled &amp; polished with diamond compound</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-black" />
              <span>[ ] Tri-layer custom EVA foam cutout packaging fitted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border border-black" />
              <span>[ ] Shiprocket 4&quot;x6&quot; thermal shipping label affixed</span>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-end border-t border-slate-300">
            <div>
              <p className="font-mono text-[10px] text-slate-500">Master Artisan Sign-off: _______________________</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-slate-500">QC Date: ____ / ____ / 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

