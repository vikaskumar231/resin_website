"use client";

import React, { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { CheckCircle2, RefreshCw, MessageSquare, AlertCircle, ShieldCheck, Sparkles, ZoomIn } from "lucide-react";

interface ProofPageProps {
  params: {
    token: string;
  };
}

export default function ProofApprovalPage({ params }: ProofPageProps) {
  const { token } = params;

  const [status, setStatus] = useState<"PENDING" | "APPROVED" | "REVISION_REQUESTED">("PENDING");
  const [feedback, setFeedback] = useState("");
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock proof data matching order item
  const proofData = {
    orderNumber: "ART-2026-1049",
    productTitle: "Bespoke Ocean Wave Resin Nameplate",
    dimensions: "16\" x 10\" Grand Heirloom",
    substrate: "Durable Sourced Base Plaque",
    colorway: "Ocean Wave with Deep Teal Gradient & Shoreline Froth",
    emblem: "Sacred 3D Laser-Cut Gold Ganesha",
    typography: "The Sharmas • Villa 42, Palm Greens",
    mockupImageUrl:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    artisanNotes:
      "Dear Sharma Family, we have arranged the 3mm mirror gold acrylic lettering and sacred Ganesha emblem onto the base plaque. Please review the spacing and alignment before we pour the fluid resin.",
  };

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setStatus("APPROVED");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleRequestRevision = () => {
    if (!feedback.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setStatus("REVISION_REQUESTED");
      setShowRevisionModal(false);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 py-8 sm:py-14 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        {/* Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-sand border border-brand-gold/40 text-xs font-bold text-brand-emerald mb-3">
            <ShieldCheck className="w-4 h-4 text-brand-teal" />
            <span>Artisan Verification Loop • Order #{proofData.orderNumber}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-emerald">
            Physical Mockup Photo Sign-Off
          </h1>
          <p className="text-sm text-brand-charcoal/70 mt-2">
            We never pour blindly. Review your physical letter layout below before our master artisan begins the slow resin cure and confirms your delivery date.
          </p>
        </div>

        {/* State Banner: Approved */}
        {status === "APPROVED" && (
          <div className="mb-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-300 text-center space-y-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-emerald-900">
              Proof Approved! Moving to Resin Pouring
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Our workshop team has received your approval. The fluid resin will be poured in our dust-controlled curing chamber today.
            </p>
          </div>
        )}

        {/* State Banner: Revision Requested */}
        {status === "REVISION_REQUESTED" && (
          <div className="mb-8 p-6 rounded-3xl bg-amber-50 border border-amber-300 text-center space-y-2 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-brand-gold text-brand-emerald flex items-center justify-center mx-auto shadow-md">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-amber-900">
              Adjustment Notes Received by Artisan
            </h3>
            <p className="text-xs text-amber-800 max-w-md mx-auto">
              Your feedback &ldquo;{feedback}&rdquo; has been sent to the workshop maker. We will adjust the physical layout and send a revised photo proof within 12 hours.
            </p>
          </div>
        )}

        {/* Main Proof Display Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-sand shadow-soft space-y-8">
          {/* High-Res Studio Image */}
          <div className="relative rounded-2xl overflow-hidden bg-brand-sand aspect-[16/10] shadow-inner group">
            <img
              src={proofData.mockupImageUrl}
              alt="Physical Studio Mockup Proof"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Physical Workshop Studio Capture</span>
            </div>
            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-brand-charcoal text-xs font-bold flex items-center gap-1 shadow">
              <ZoomIn className="w-3.5 h-3.5" /> Click to Zoom Full-Resolution
            </div>
          </div>

          {/* Artisan Note */}
          <div className="p-5 rounded-2xl bg-brand-sand/50 border border-brand-sand text-xs text-brand-charcoal/80 space-y-1">
            <div className="font-bold text-brand-emerald flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-brand-teal" />
              <span>Note from Artisan:</span>
            </div>
            <p className="italic leading-relaxed">{proofData.artisanNotes}</p>
          </div>

          {/* Specification Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-brand-sand">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Timber Base</span>
              <span className="font-bold text-brand-charcoal">{proofData.substrate}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Resin Colorway</span>
              <span className="font-bold text-brand-charcoal">{proofData.colorway}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Laser Symbol</span>
              <span className="font-bold text-brand-charcoal">{proofData.emblem}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Dimensions</span>
              <span className="font-bold text-brand-charcoal">{proofData.dimensions}</span>
            </div>
          </div>

          {/* Action Decision Buttons */}
          {status === "PENDING" && (
            <div className="pt-6 border-t border-brand-sand flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setShowRevisionModal(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-slate-300 hover:border-brand-emerald text-brand-charcoal text-xs font-bold transition-all"
              >
                ✏️ Request Minor Adjustment
              </button>

              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-brand-emerald hover:bg-brand-teal text-white font-bold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-brand-gold" />
                <span>{isSubmitting ? "Confirming Sign-off..." : "1-Click Approve & Pour Now ➔"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Adjustment Modal */}
        {showRevisionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setShowRevisionModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full z-10 shadow-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-brand-emerald">
                Request Layout Adjustment
              </h3>
              <p className="text-xs text-slate-500">
                Please describe the specific change you would like our workshop artisan to make (e.g. shift name higher, spacing between letters).
              </p>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                placeholder="Type your layout adjustments here..."
                className="w-full p-3 rounded-2xl border border-brand-sand text-xs focus:ring-2 focus:ring-brand-gold focus:outline-none"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowRevisionModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestRevision}
                  disabled={!feedback.trim() || isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold hover:bg-brand-teal disabled:opacity-50"
                >
                  Submit Adjustment
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

