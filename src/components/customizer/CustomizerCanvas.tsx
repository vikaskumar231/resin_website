"use client";

import React, { useEffect } from "react";
import { useCustomizerStore, ProductCustomizerType, resolveProductType } from "@/store/useCustomizerStore";
import NameplateCanvas from "./NameplateCanvas";
import KeyringCanvas from "./KeyringCanvas";
import BookmarkCanvas from "./BookmarkCanvas";
import FestiveCanvas from "./FestiveCanvas";

interface CustomizerCanvasProps {
  slug?: string;
  category?: string;
}

export default function CustomizerCanvas({ slug, category }: CustomizerCanvasProps) {
  const store = useCustomizerStore();

  useEffect(() => {
    if (slug && store.productSlug !== slug) {
      store.initProduct(slug, category);
    }
  }, [slug, category, store.productSlug, store.initProduct]);

  // Determine effective product type using category first, then store, then slug
  const effectiveType: ProductCustomizerType = category
    ? resolveProductType({ category, slug })
    : store.productType;

  switch (effectiveType) {
    case "KEYRING":
      return <KeyringCanvas />;
    case "BOOKMARK":
      return <BookmarkCanvas />;
    case "FESTIVE":
      return <FestiveCanvas />;
    case "NAMEPLATE":
    default:
      return <NameplateCanvas />;
  }
}
