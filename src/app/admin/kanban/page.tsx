"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BatchVolumeCalculator from "@/components/admin/BatchVolumeCalculator";
import { useAuthStore } from "@/store/useAuthStore";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  Layers,
  FileText,
  Truck,
  Plus,
  Crown,
} from "lucide-react";

interface KanbanCard {
  id: string;
  orderNumber: string;
  customerName: string;
  productTitle: string;
  substrate: string;
  colorway: string;
  text: string;
  emblem: string;
  stage: "ORDER_CONFIRMED" | "PROOF_PENDING" | "READY_TO_POUR" | "SLOW_CURING_48H" | "FINISHING_QC" | "DISPATCHED";
  hoursElapsed: number;
}

export default function WorkshopKanbanPage() {
  const { user } = useAuthStore();
  const [cards, setCards] = useState<KanbanCard[]>([
    {
      id: "ord_1049",
      orderNumber: "ART-2026-1049",
      customerName: "Priya Sharma",
      productTitle: "Bespoke Ocean Wave Nameplate (16x10)",
      substrate: "Durable Sourced Base Plaque",
      colorway: "Ocean Wave",
      text: "Sharma Residence • Villa 42",
      emblem: "Ganesha",
      stage: "READY_TO_POUR",
      hoursElapsed: 14,
    },
    {
      id: "ord_1050",
      orderNumber: "ART-2026-1050",
      customerName: "Arjun Verma",
      productTitle: "Crystal Initial Keyring",
      substrate: "Clear Resin",
      colorway: "Gold Foil & Blush Rose",
      text: "Monogram 'A'",
      emblem: "None",
      stage: "SLOW_CURING_48H",
      hoursElapsed: 28,
    },
    {
      id: "ord_1051",
      orderNumber: "ART-2026-1051",
      customerName: "Sneha Patel",
      productTitle: "Bespoke Emerald Nameplate (12x8)",
      substrate: "Durable Sourced Base Plaque",
      colorway: "Emerald Geode",
      text: "Patel Niwas • 108",
      emblem: "Swastik",
      stage: "PROOF_PENDING",
      hoursElapsed: 6,
    },
    {
      id: "ord_1052",
      orderNumber: "ART-2026-1052",
      customerName: "Kabir Roy",
      productTitle: "Pressed Botanical Bookmark",
      substrate: "Clear Resin",
      colorway: "Himalayan Chamomile",
      text: "Kabir Reads",
      emblem: "Lotus",
      stage: "FINISHING_QC",
      hoursElapsed: 52,
    },
  ]);

  const stages = [
    { key: "ORDER_CONFIRMED", title: "1. Wood & Laser Cut", color: "border-slate-300" },
    { key: "PROOF_PENDING", title: "2. WhatsApp Proof & Date", color: "border-amber-400" },
    { key: "READY_TO_POUR", title: "3. Ready to Pour", color: "border-teal-500" },
    { key: "SLOW_CURING_48H", title: "4. Slow Resin Cure", color: "border-blue-500" },
    { key: "FINISHING_QC", title: "5. Finishing QC", color: "border-indigo-500" },
    { key: "DISPATCHED", title: "6. Packed / Sent", color: "border-emerald-500" },
  ];

  const advanceStage = (cardId: string) => {
    const stageOrder: KanbanCard["stage"][] = [
      "ORDER_CONFIRMED",
      "PROOF_PENDING",
      "READY_TO_POUR",
      "SLOW_CURING_48H",
      "FINISHING_QC",
      "DISPATCHED",
    ];

    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          const currentIdx = stageOrder.indexOf(c.stage);
          const nextIdx = Math.min(stageOrder.length - 1, currentIdx + 1);
          return { ...c, stage: stageOrder[nextIdx] };
        }
        return c;
      })
    );
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 py-8 max-w-[1600px] mx-auto px-4 sm:px-6 w-full space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-brand-sand">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                Artisan Workshop Operations (US-6.1)
              </span>
              {user && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-emerald text-white text-[11px] font-bold">
                  <Crown className="w-3 h-3 text-brand-gold" />
                  {user.name} ({user.role})
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-emerald">
              Production Kanban &amp; Curing Floor
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="px-4 py-2 rounded-full bg-brand-emerald text-white text-xs font-bold hover:bg-brand-teal transition-all"
            >
              Artisan CMS
            </Link>
          </div>
        </div>

        {/* Embedded Batch Pouring Assistant */}
        <BatchVolumeCalculator />

        {/* Kanban Board 6 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
          {stages.map((stg) => {
            const columnCards = cards.filter((c) => c.stage === stg.key);

            return (
              <div
                key={stg.key}
                className="bg-brand-sand/40 rounded-3xl p-4 border border-brand-sand flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`pb-3 border-b-2 ${stg.color} mb-3 flex items-center justify-between`}>
                  <h3 className="font-serif text-xs font-bold text-brand-emerald">
                    {stg.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-brand-charcoal shadow-sm">
                    {columnCards.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnCards.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-center text-[11px] text-slate-400 italic">
                      No orders in this phase
                    </div>
                  ) : (
                    columnCards.map((card) => (
                      <div
                        key={card.id}
                        className="bg-white rounded-2xl p-4 border border-brand-sand/80 shadow-sm hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-brand-emerald">
                            {card.orderNumber}
                          </span>
                          <span className="text-[10px] text-slate-400">{card.hoursElapsed}h ago</span>
                        </div>

                        <div>
                          <p className="font-bold text-xs text-brand-charcoal line-clamp-1">
                            {card.customerName}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">{card.productTitle}</p>
                        </div>

                        {/* Customizer specs */}
                        <div className="p-2 rounded-xl bg-brand-sand/60 text-[10px] space-y-0.5">
                          <p>
                            <strong>Text:</strong> &ldquo;{card.text}&rdquo;
                          </p>
                          <p>
                            <strong>Emblem:</strong> {card.emblem} • <strong>Resin:</strong> {card.colorway}
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 border-t border-brand-sand/60 flex items-center justify-end">
                          <button
                            onClick={() => advanceStage(card.id)}
                            className="w-full py-1.5 px-3 rounded-lg bg-brand-emerald text-white text-[10px] font-bold hover:bg-brand-teal transition-all flex items-center justify-center gap-1 shadow-xs"
                          >
                            <span>Advance Stage</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

