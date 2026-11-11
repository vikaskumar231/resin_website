import React from "react";
import type { Metadata } from "next";
import { HERO_PRODUCTS } from "@/lib/mockData";
import CustomizerClientView from "@/components/customizer/CustomizerClientView";

interface CustomizerPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return HERO_PRODUCTS.filter((p) => p.isCustomizable).map((p) => ({
    slug: p.slug,
  }));
}

export function generateMetadata({ params }: CustomizerPageProps): Metadata {
  const product = HERO_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) {
    return { title: "2D Interactive Artisan Studio — Artआलय" };
  }
  return {
    title: `Customize ${product.title} — Artआलय Studio`,
    description: `Design your bespoke ${product.title} with 2D live preview, real-time pricing, and WhatsApp proof approval.`,
  };
}

export default function CustomizerPage({ params }: CustomizerPageProps) {
  const product = HERO_PRODUCTS.find((p) => p.slug === params.slug);

  return (
    <CustomizerClientView
      initialSlug={params.slug}
      initialProduct={product}
    />
  );
}
