import React from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { CheckCircle2, Sparkles, Clock, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";

interface OrderConfirmationPageProps {
  params: {
    orderNumber: string;
  };
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = params;

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-sand shadow-soft text-center space-y-8">
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 text-brand-emerald flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              Order Confirmed &amp; In Queue
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-emerald">
              Dhanyavaad for Trusting Artआलय!
            </h1>
            <p className="text-sm text-brand-charcoal/70 max-w-lg mx-auto">
              Your bespoke creation has been placed in our artisan workshop queue. Order Reference:{" "}
              <strong className="text-brand-emerald font-mono font-bold">{orderNumber}</strong>
            </p>
          </div>

          {/* WhatsApp Proof Next Step Notice */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-50 via-emerald-50 to-white border border-brand-gold/40 text-left space-y-4 max-w-xl mx-auto shadow-sm">
            <div className="flex items-center gap-2.5 font-serif font-bold text-brand-emerald text-base">
              <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Next Steps: WhatsApp Consultation &amp; Date Agreement</span>
            </div>
            <div className="text-xs text-brand-charcoal/80 leading-relaxed space-y-2">
              <p>
                1. <strong>Token Booking Confirmed:</strong> You have paid a <strong>₹199 token deposit</strong> to initiate personalized 1-on-1 discussion with our artisan.
              </p>
              <p>
                2. <strong>Delivery Date &amp; Price Agreed on WhatsApp:</strong> All website prices are tentative. Our artist connects with you over WhatsApp to discuss custom notes, inspect layout proofs, agree upon the final price, and mutually confirm the actual delivery schedule.
              </p>
              <p>
                3. <strong>50% Token Refund Guarantee:</strong> If the final price or design is not agreed during your WhatsApp discussion, <strong>50% of your token deposit is refunded immediately</strong>.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(
                  `Namaste Artआलय Studio! I have just placed Order #${orderNumber}. I would like to discuss my requirements, agree on the final price, and confirm my delivery date.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all text-center"
              >
                <MessageSquare className="w-4 h-4 text-brand-gold" />
                <span>Open WhatsApp to Discuss Date &amp; Price</span>
              </a>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/account/orders"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-brand-emerald hover:bg-brand-teal text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all text-center"
            >
              <span>View My Orders &amp; Invoices</span>
            </Link>

            <Link
              href="/#catalog"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-brand-sand hover:bg-white border border-brand-sand text-brand-charcoal font-semibold text-xs transition-all text-center"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

