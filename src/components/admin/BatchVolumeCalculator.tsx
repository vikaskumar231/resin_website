"use client";

import React, { useState } from "react";
import { Sparkles, Scale, Beaker, Check, AlertCircle } from "lucide-react";

export default function BatchVolumeCalculator() {
  const [selectedColorway, setSelectedColorway] = useState("OCEAN_WAVE");
  const [itemCount, setItemCount] = useState(4);
  const [averageSize, setAverageSize] = useState<"12x8" | "16x10" | "18x12">("16x10");

  // Physical Resin Calculations
  // 12x8: ~350ml resin | 16x10: ~600ml resin | 18x12: ~850ml resin
  const getVolumePerUnit = () => {
    switch (averageSize) {
      case "12x8":
        return 350;
      case "16x10":
        return 600;
      case "18x12":
        return 850;
      default:
        return 600;
    }
  };

  const totalVolumeMl = itemCount * getVolumePerUnit();
  // 2:1 ratio by weight (Epoxy Resin : Hardener)
  const partAResinGrams = Math.round((totalVolumeMl * 2) / 3 * 1.1); // Density ~1.1 g/ml
  const partBHardenerGrams = Math.round((totalVolumeMl * 1) / 3 * 1.0); // Density ~1.0 g/ml
  const pigmentGrams = Math.round((totalVolumeMl * 0.02)); // 2% pigment concentration

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-sand shadow-soft space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-brand-sand">
        <div>
          <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">
            Workshop Pouring Assistant (US-6.2)
          </span>
          <h3 className="font-serif text-xl font-bold text-brand-emerald">
            Batch Resin Volume &amp; Ratio Calculator
          </h3>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-brand-sand flex items-center justify-center text-brand-emerald">
          <Scale className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Colorway Selection */}
        <div>
          <label className="text-xs font-bold uppercase text-slate-700 block mb-1">
            Target Batch Colorway
          </label>
          <select
            value={selectedColorway}
            onChange={(e) => setSelectedColorway(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-brand-sand bg-brand-ivory text-xs font-semibold focus:ring-2 focus:ring-brand-gold focus:outline-none"
          >
            <option value="OCEAN_WAVE">Ocean Wave (Teal &amp; White Froth)</option>
            <option value="EMERALD_GEODE">Emerald Geode (Forest Green &amp; Gold)</option>
            <option value="RUBY_WINE">Ruby Wine (Crimson Shimmer)</option>
            <option value="MIDNIGHT_GOLD">Midnight Onyx (Black &amp; Gold)</option>
          </select>
        </div>

        {/* Number of Pieces in Batch */}
        <div>
          <label className="text-xs font-bold uppercase text-slate-700 block mb-1">
            Queued Order Pieces
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={itemCount}
            onChange={(e) => setItemCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 rounded-xl border border-brand-sand bg-brand-ivory text-xs font-semibold focus:ring-2 focus:ring-brand-gold focus:outline-none"
          />
        </div>

        {/* Average Size */}
        <div>
          <label className="text-xs font-bold uppercase text-slate-700 block mb-1">
            Plank Dimension
          </label>
          <select
            value={averageSize}
            onChange={(e) => setAverageSize(e.target.value as any)}
            className="w-full px-3 py-2.5 rounded-xl border border-brand-sand bg-brand-ivory text-xs font-semibold focus:ring-2 focus:ring-brand-gold focus:outline-none"
          >
            <option value="12x8">Compact 12&quot; x 8&quot; (~350ml)</option>
            <option value="16x10">Grand Heirloom 16&quot; x 10&quot; (~600ml)</option>
            <option value="18x12">Estate Villa 18&quot; x 12&quot; (~850ml)</option>
          </select>
        </div>
      </div>

      {/* Calculated Results Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-brand-emerald to-teal-950 text-white space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
          <span className="text-xs font-bold text-amber-200 uppercase tracking-widest flex items-center gap-1.5">
            <Beaker className="w-4 h-4 text-brand-gold" />
            Precise 2:1 Scale Weights
          </span>
          <span className="text-xs font-mono text-emerald-200">
            Total Batch: {totalVolumeMl} ml ({totalVolumeMl / 1000} L)
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold block">
              Part A (Epoxy Base)
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-white">
              {partAResinGrams} g
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold block">
              Part B (Hardener)
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-amber-300">
              {partBHardenerGrams} g
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold block">
              Pigment / Paste
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-teal-200">
              {pigmentGrams} g
            </span>
          </div>
        </div>

        <p className="text-[11px] text-emerald-100/70 italic text-center">
          Artisan Invariant: Mix Part A &amp; B slowly for 4 minutes to minimize micro-bubbles. Degas in vacuum chamber before pouring.
        </p>
      </div>
    </div>
  );
}

