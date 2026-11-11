"use client";

import React, { useEffect } from "react";
import { useCustomizerStore, ProductCustomizerType, resolveProductType } from "@/store/useCustomizerStore";
import NameplateControls from "./NameplateControls";
import KeyringControls from "./KeyringControls";
import BookmarkControls from "./BookmarkControls";
import FestiveControls from "./FestiveControls";

interface CustomizerControlsProps {
  slug?: string;
  category?: string;
}

export default function CustomizerControls({ slug, category }: CustomizerControlsProps) {
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
      return <KeyringControls />;
    case "BOOKMARK":
      return <BookmarkControls />;
    case "FESTIVE":
      return <FestiveControls />;
    case "NAMEPLATE":
    default:
      return <NameplateControls />;
  }
}
