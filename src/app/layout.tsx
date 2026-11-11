import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Plus_Jakarta_Sans, Rozha_One } from "next/font/google";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthModal from "@/components/auth/AuthModal";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const rozha = Rozha_One({
  subsets: ["devanagari", "latin"],
  variable: "--font-rozha",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Artआलय — Handcrafted Resin Art for Heart & Home",
  description:
    "Experience bespoke resin artistry. Custom 2D live interactive Nameplate, Keyrings, Bookmark, and Toran/Shubh Labh hand-poured in India.",
  keywords: [
    "resin nameplate",
    "resin art online india",
    "custom resin gifts",
    "shubh labh resin",
    "resin bookmarks",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${jakarta.variable} ${rozha.variable}`}
    >
      <body className="min-h-screen bg-brand-sand text-brand-charcoal font-sans antialiased selection:bg-brand-gold/30">
        {children}
        <CartDrawer />
        <AuthModal />
      </body>
    </html>
  );
}

