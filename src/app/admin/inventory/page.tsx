"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Layers, AlertTriangle, Plus, RefreshCw, CheckCircle2, ArrowLeft } from "lucide-react";

interface MaterialItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumThreshold: number;
  costPerUnit: number;
}

export default function WorkshopInventoryPage() {
  const [materials, setMaterials] = useState<MaterialItem[]>([
    {
      id: "mat_01",
      name: "Crystal Clear Casting Epoxy Resin (Part A)",
      category: "EPOXY_RESIN",
      unit: "kg",
      currentStock: 42.5,
      minimumThreshold: 15.0,
      costPerUnit: 650,
    },
    {
      id: "mat_02",
      name: "Optical Fast Hardener (Part B)",
      category: "HARDENER",
      unit: "kg",
      currentStock: 18.0,
      minimumThreshold: 10.0,
      costPerUnit: 750,
    },
    {
      id: "mat_03",
      name: "Durable Sourced Base Planks (16\"x10\")",
      category: "BASE_SUBSTRATES",
      unit: "count",
      currentStock: 6, // Low stock!
      minimumThreshold: 10,
      costPerUnit: 480,
    },
    {
      id: "mat_04",
      name: "3mm Mirror Gold Cast Acrylic Sheets",
      category: "ACRYLIC",
      unit: "sqft",
      currentStock: 35.0,
      minimumThreshold: 12.0,
      costPerUnit: 180,
    },
    {
      id: "mat_05",
      name: "24K Genuine Imitation Gold Foil Booklets",
      category: "GOLD_FOIL",
      unit: "packs",
      currentStock: 4, // Low stock!
      minimumThreshold: 8,
      costPerUnit: 220,
    },
  ]);

  const handleRestock = (id: string, amount: number) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, currentStock: m.currentStock + amount } : m))
    );
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-brand-sand">
          <div>
            <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
              Workshop Supply Chain &amp; Stock Monitor (US-7.5)
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-emerald">
              Raw Material Depletion Alerts
            </h1>
          </div>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-brand-sand bg-white text-xs font-bold text-brand-charcoal hover:bg-brand-sand transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog CMS</span>
          </Link>
        </div>

        {/* Low Stock Warning Banner if any item is below threshold */}
        {materials.some((m) => m.currentStock <= m.minimumThreshold) && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                Attention Artisan: 2 raw materials are below minimum threshold! Restock immediately to prevent curing stall.
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
              Action Required
            </span>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-3xl border border-brand-sand shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-sand/60 text-brand-charcoal uppercase font-bold tracking-wider text-[10px] border-b border-brand-sand">
                <tr>
                  <th className="p-4">Material Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Alert Threshold</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/60">
                {materials.map((mat) => {
                  const isLow = mat.currentStock <= mat.minimumThreshold;

                  return (
                    <tr key={mat.id} className="hover:bg-brand-ivory/50 transition-colors">
                      <td className="p-4 font-bold text-brand-emerald text-sm font-serif">
                        {mat.name}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-500">{mat.category}</td>
                      <td className="p-4 font-mono font-bold text-base">
                        {mat.currentStock} {mat.unit}
                      </td>
                      <td className="p-4 font-mono text-slate-500">
                        {mat.minimumThreshold} {mat.unit}
                      </td>
                      <td className="p-4">
                        {isLow ? (
                          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold flex items-center gap-1 w-max">
                            <AlertTriangle className="w-3 h-3 text-red-600" />
                            <span>LOW STOCK ALERT</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Optimal Stock</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRestock(mat.id, 10)}
                          className="px-3 py-1.5 rounded-full border border-brand-sand bg-brand-sand/50 hover:bg-brand-emerald hover:text-white text-brand-charcoal text-[11px] font-bold transition-all"
                        >
                          +10 {mat.unit}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

