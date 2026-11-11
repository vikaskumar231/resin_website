import { create } from "zustand";
import { HERO_PRODUCTS, ProductCatalogItem } from "@/lib/mockData";
import { useProductStore } from "@/store/useProductStore";

export type ProductCustomizerType = "NAMEPLATE" | "KEYRING" | "BOOKMARK" | "FESTIVE";

export interface CustomizerState {
  // Common Product Info
  productId: string;
  productSlug: string;
  productTitle: string;
  productImage: string;
  productType: ProductCustomizerType;
  basePrice: number;
  totalPrice: number;

  // 1. Nameplate Specific State
  nameplate: {
    substrate: "RAW_TEAKWOOD" | "FROSTED_ACRYLIC" | "MATTE_BLACK_ACRYLIC";
    size: "12x8" | "16x10" | "18x12";
    colorway: "OCEAN_WAVE" | "EMERALD_GEODE" | "MIDNIGHT_GOLD" | "RUBY_WINE";
    inclusions: string[]; // 'GOLD_FOIL', 'SILVER_FOIL', 'DRIED_BOTANICALS'
    emblem: "NONE" | "GANESHA" | "SWASTIK" | "LOTUS" | "EVIL_EYE";
    typography: {
      line1: string;
      line2: string;
      fontFamily: string; // 'Cinzel', 'Playfair', 'Rozha One', 'Plus Jakarta Sans'
      material: "GOLD_MIRROR" | "ROSE_GOLD_MIRROR" | "BLACK_GLOSS";
    };
    hasLedBacklight: boolean;
    hasBrassBells: boolean;
    requirementsText: string;
    referenceImage?: string | null;
  };

  // 2. Keyring Specific State
  keyring: {
    letter: string; // 'A' - 'Z'
    style: "GOLD_FOIL_CLEAR" | "BLUSH_ROSE_PETAL" | "EMERALD_MINT" | "MIDNIGHT_OBSIDIAN";
    hardwareFinish: "BRUSHED_BRASS_GOLD" | "ROSE_GOLD_LUXE" | "MATTE_SILVER";
    charm: "NONE" | "MINI_TASSEL" | "EVIL_EYE_BEAD" | "PEARL_HEART";
    hasEngravedTag: boolean;
    engravedText: string; // Max 10 chars
    requirementsText: string;
    referenceImage?: string | null;
  };

  // 3. Bookmark Specific State (3 streamlined choices)
  bookmark: {
    isPersonalized: boolean; // 1. Needs to be personalized
    personalizedName: string; // Recipient name (Max 24 chars)
    hasFlowers: boolean; // 2. If flowers are needed
    colorChoice: "CRYSTAL_CLEAR" | "OCEAN_TEAL" | "BLUSH_ROSE" | "EMERALD_GREEN" | "GOLDEN_AMBER" | "ROYAL_VIOLET"; // 3. Colour choice palette
    requirementsText: string;
    referenceImage?: string | null;

    // Legacy fields maintained for backward compatibility
    botanicalTheme?: "HIMALAYAN_CHAMOMILE" | "KASHMIRI_LAVENDER" | "PRESSED_MARIGOLD" | "ROYAL_ROSE";
    foilInclusion?: "GOLD_FOIL" | "SILVER_LEAF" | "ROSE_GOLD_SHIMMER" | "NONE";
    tasselColor?: "GOLDEN_AMBER" | "EMERALD_PINE" | "ROYAL_BURGUNDY" | "DUSTY_ROSE" | "MIDNIGHT_NAVY";
    hasEngraving?: boolean;
    engravingText?: string;
    fontFamily?: string;
  };

  // 4. Festive / Toran / Shubh Labh Specific State
  festive: {
    geodeColorway: "EMERALD_JADE" | "ROYAL_CRIMSON" | "AUSPICIOUS_HALDI" | "MIDNIGHT_OBSIDIAN";
    scriptStyle: "SHUBH_LABH" | "SWAGATAM" | "OM_SWASTIK" | "CUSTOM_BLESSING";
    customText: string;
    crystalBorder: "RAW_CLEAR_QUARTZ" | "ROSE_QUARTZ" | "AMETHYST" | "GOLD_NUGGETS";
    hangingElement: "BRASS_BELLS" | "MARIGOLD_TASSELS" | "PEARL_DROPS" | "RED_GOLD_DORI";
    hasLedBacklight: boolean;
    requirementsText: string;
    referenceImage?: string | null;
  };

  // Lifecycle & Switching Actions
  initProduct: (slugOrId: string, categoryOverride?: string) => void;
  setProductImage: (url: string) => void;
  recalculatePrice: () => void;

  // Nameplate Actions
  setSubstrate: (substrate: CustomizerState["nameplate"]["substrate"]) => void;
  setSize: (size: CustomizerState["nameplate"]["size"]) => void;
  setColorway: (colorway: CustomizerState["nameplate"]["colorway"]) => void;
  toggleInclusion: (inclusionId: string) => void;
  setEmblem: (emblem: CustomizerState["nameplate"]["emblem"]) => void;
  setLine1: (text: string) => void;
  setLine2: (text: string) => void;
  setFontFamily: (font: string) => void;
  setLetterMaterial: (material: CustomizerState["nameplate"]["typography"]["material"]) => void;
  toggleLedBacklight: () => void;
  toggleBrassBells: () => void;
  setNameplateRequirementsText: (text: string) => void;
  setReferenceImage: (img: string | null) => void;

  // Keyring Actions
  setKeyringLetter: (letter: string) => void;
  setKeyringStyle: (style: CustomizerState["keyring"]["style"]) => void;
  setKeyringHardware: (hw: CustomizerState["keyring"]["hardwareFinish"]) => void;
  setKeyringCharm: (charm: CustomizerState["keyring"]["charm"]) => void;
  toggleKeyringTag: () => void;
  setKeyringTagText: (text: string) => void;
  setKeyringRequirementsText: (text: string) => void;
  setKeyringReferenceImage: (img: string | null) => void;

  // Bookmark Actions (Streamlined 3 choices)
  setIsPersonalized: (isPersonalized: boolean) => void;
  setPersonalizedName: (name: string) => void;
  setHasFlowers: (hasFlowers: boolean) => void;
  setColorChoice: (
    color: "CRYSTAL_CLEAR" | "OCEAN_TEAL" | "BLUSH_ROSE" | "EMERALD_GREEN" | "GOLDEN_AMBER" | "ROYAL_VIOLET"
  ) => void;
  setBookmarkTheme: (theme: any) => void;
  setBookmarkFoil: (foil: any) => void;
  setBookmarkTassel: (color: any) => void;
  toggleBookmarkEngraving: () => void;
  setBookmarkEngravingText: (text: string) => void;
  setBookmarkFont: (font: string) => void;
  setBookmarkRequirementsText: (text: string) => void;
  setBookmarkReferenceImage: (img: string | null) => void;

  // Festive / Toran / Shubh Labh Actions
  setFestiveRequirementsText: (text: string) => void;
  setFestiveGeodeColor: (color: CustomizerState["festive"]["geodeColorway"]) => void;
  setFestiveScript: (script: CustomizerState["festive"]["scriptStyle"]) => void;
  setFestiveCustomText: (text: string) => void;
  setFestiveCrystalBorder: (border: CustomizerState["festive"]["crystalBorder"]) => void;
  setFestiveHanging: (hanging: CustomizerState["festive"]["hangingElement"]) => void;
  toggleFestiveLed: () => void;
  setFestiveReferenceImage: (img: string | null) => void;

  // Backward-compatibility getters for existing code
  substrate: CustomizerState["nameplate"]["substrate"];
  size: CustomizerState["nameplate"]["size"];
  colorway: CustomizerState["nameplate"]["colorway"];
  inclusions: string[];
  emblem: CustomizerState["nameplate"]["emblem"];
  typography: CustomizerState["nameplate"]["typography"];
  hasLedBacklight: boolean;
  hasBrassBells: boolean;
}

// Pure helper function to compute exact total price deterministically
export function calculateCustomizerTotal(state: CustomizerState): number {
  if (state.productType === "KEYRING") {
    let price = state.basePrice; // Base ₹399
    if (state.keyring.hasEngravedTag) price += 99;
    return price;
  }

  if (state.productType === "BOOKMARK") {
    let price = state.basePrice; // Base ₹499
    if (state.bookmark.isPersonalized || state.bookmark.hasEngraving) price += 49;
    return price;
  }

  if (state.productType === "FESTIVE") {
    return state.basePrice;
  }

  // Nameplate (Default)
  let price = state.basePrice; // Base ₹2,499
  if (state.nameplate.size === "16x10") price += 500;
  if (state.nameplate.size === "18x12") price += 900;
  if (state.nameplate.hasLedBacklight) price += 799;

  return price;
}

export function resolveProductType(product?: { category?: string; slug?: string; title?: string } | null): ProductCustomizerType {
  if (!product) return "NAMEPLATE";

  const cat = (product.category || "").toUpperCase();
  const slug = (product.slug || "").toLowerCase();
  const title = (product.title || "").toLowerCase();

  if (cat === "KEYRINGS" || slug.includes("keyring") || title.includes("keyring")) {
    return "KEYRING";
  }
  if (cat === "BOOKMARKS" || slug.includes("bookmark") || title.includes("bookmark")) {
    return "BOOKMARK";
  }
  if (
    cat === "FESTIVE" ||
    slug.includes("shubh") ||
    slug.includes("festive") ||
    slug.includes("toran") ||
    slug.includes("labh") ||
    slug.includes("mandir") ||
    title.includes("toran") ||
    title.includes("shubh") ||
    title.includes("labh") ||
    title.includes("mandir")
  ) {
    return "FESTIVE";
  }
  return "NAMEPLATE";
}

export const useCustomizerStore = create<CustomizerState>((set, get) => ({
  productId: "prod_nameplate_01",
  productSlug: "bespoke-teakwood-nameplate",
  productTitle: "Bespoke Natural Wood & Ocean Wave Resin Nameplate",
  productImage: HERO_PRODUCTS[0]?.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  productType: "NAMEPLATE",
  basePrice: 2499,
  totalPrice: 2499,

  // Nameplate Defaults
  nameplate: {
    substrate: "RAW_TEAKWOOD",
    size: "12x8",
    colorway: "OCEAN_WAVE",
    inclusions: [],
    emblem: "NONE",
    typography: {
      line1: "",
      line2: "",
      fontFamily: "Cinzel",
      material: "GOLD_MIRROR",
    },
    hasLedBacklight: false,
    hasBrassBells: false,
    requirementsText: "",
    referenceImage: null,
  },

  // Keyring Defaults
  keyring: {
    letter: "A",
    style: "GOLD_FOIL_CLEAR",
    hardwareFinish: "BRUSHED_BRASS_GOLD",
    charm: "MINI_TASSEL",
    hasEngravedTag: false,
    engravedText: "",
    requirementsText: "",
    referenceImage: null,
  },

  // Bookmark Defaults (Streamlined 3 choices)
  bookmark: {
    isPersonalized: false,
    personalizedName: "",
    hasFlowers: true,
    colorChoice: "CRYSTAL_CLEAR",
    botanicalTheme: "HIMALAYAN_CHAMOMILE",
    foilInclusion: "NONE",
    tasselColor: "GOLDEN_AMBER",
    hasEngraving: false,
    engravingText: "",
    fontFamily: "Playfair",
    requirementsText: "",
    referenceImage: null,
  },

  // Festive / Toran / Shubh Labh Defaults
  festive: {
    geodeColorway: "EMERALD_JADE",
    scriptStyle: "SHUBH_LABH",
    customText: "",
    crystalBorder: "RAW_CLEAR_QUARTZ",
    hangingElement: "BRASS_BELLS",
    hasLedBacklight: false,
    requirementsText: "",
    referenceImage: null,
  },

  // Backward compatibility getters
  get substrate() { return get().nameplate.substrate; },
  get size() { return get().nameplate.size; },
  get colorway() { return get().nameplate.colorway; },
  get inclusions() { return get().nameplate.inclusions; },
  get emblem() { return get().nameplate.emblem; },
  get typography() { return get().nameplate.typography; },
  get hasLedBacklight() { return get().nameplate.hasLedBacklight; },
  get hasBrassBells() { return get().nameplate.hasBrassBells; },

  initProduct: (slugOrId: string, categoryOverride?: string) => {
    let product: ProductCatalogItem | undefined;
    if (typeof window !== "undefined") {
      try {
        const storeProducts = useProductStore.getState().products;
        product = storeProducts.find((p) => p.slug === slugOrId || p.id === slugOrId);
      } catch {
        // Fallback for SSR
      }
    }
    if (!product) {
      product = HERO_PRODUCTS.find((p) => p.slug === slugOrId || p.id === slugOrId);
    }

    const resolvedProduct = product || HERO_PRODUCTS[0];
    const effectiveCategory = categoryOverride || resolvedProduct.category;
    const pType = resolveProductType({
      category: effectiveCategory,
      slug: resolvedProduct.slug,
      title: resolvedProduct.title,
    });

    set((state) => {
      const nextState = {
        ...state,
        productId: resolvedProduct.id,
        productSlug: resolvedProduct.slug,
        productTitle: resolvedProduct.title,
        productImage: resolvedProduct.imageUrl,
        productType: pType,
        basePrice: resolvedProduct.basePrice,
      };
      const totalPrice = calculateCustomizerTotal(nextState as CustomizerState);
      return {
        ...nextState,
        totalPrice,
      };
    });
  },

  setProductImage: (productImage: string) => set({ productImage }),

  recalculatePrice: () => {
    const state = get();
    const totalPrice = calculateCustomizerTotal(state);
    set({ totalPrice });
  },

  // Nameplate actions
  setSubstrate: (substrate) => {
    set((state) => ({ nameplate: { ...state.nameplate, substrate } }));
    get().recalculatePrice();
  },

  setSize: (size) => {
    set((state) => ({ nameplate: { ...state.nameplate, size } }));
    get().recalculatePrice();
  },

  setColorway: (colorway) => {
    set((state) => ({ nameplate: { ...state.nameplate, colorway } }));
    get().recalculatePrice();
  },

  toggleInclusion: (inclusionId) => {
    const current = get().nameplate.inclusions;
    const exists = current.includes(inclusionId);
    const updated = exists
      ? current.filter((id) => id !== inclusionId)
      : [...current, inclusionId];
    set((state) => ({ nameplate: { ...state.nameplate, inclusions: updated } }));
    get().recalculatePrice();
  },

  setEmblem: (emblem) => {
    set((state) => ({ nameplate: { ...state.nameplate, emblem } }));
    get().recalculatePrice();
  },

  setLine1: (line1) => {
    set((state) => ({
      nameplate: {
        ...state.nameplate,
        typography: { ...state.nameplate.typography, line1: line1.slice(0, 20) },
      },
    }));
  },

  setLine2: (line2) => {
    set((state) => ({
      nameplate: {
        ...state.nameplate,
        typography: { ...state.nameplate.typography, line2: line2.slice(0, 28) },
      },
    }));
  },

  setFontFamily: (fontFamily) => {
    set((state) => ({
      nameplate: {
        ...state.nameplate,
        typography: { ...state.nameplate.typography, fontFamily },
      },
    }));
  },

  setLetterMaterial: (material) => {
    set((state) => ({
      nameplate: {
        ...state.nameplate,
        typography: { ...state.nameplate.typography, material },
      },
    }));
  },

  toggleLedBacklight: () => {
    set((state) => ({
      nameplate: { ...state.nameplate, hasLedBacklight: !state.nameplate.hasLedBacklight },
    }));
    get().recalculatePrice();
  },

  toggleBrassBells: () => {
    set((state) => ({
      nameplate: { ...state.nameplate, hasBrassBells: !state.nameplate.hasBrassBells },
    }));
    get().recalculatePrice();
  },

  setNameplateRequirementsText: (requirementsText) => {
    set((state) => ({
      nameplate: { ...state.nameplate, requirementsText },
    }));
  },

  setReferenceImage: (referenceImage) => {
    set((state) => ({
      nameplate: { ...state.nameplate, referenceImage },
    }));
  },

  // Keyring Actions
  setKeyringLetter: (letter) => {
    set((state) => ({ keyring: { ...state.keyring, letter: letter.toUpperCase().slice(0, 1) } }));
  },

  setKeyringStyle: (style) => {
    set((state) => ({ keyring: { ...state.keyring, style } }));
    get().recalculatePrice();
  },

  setKeyringHardware: (hardwareFinish) => {
    set((state) => ({ keyring: { ...state.keyring, hardwareFinish } }));
    get().recalculatePrice();
  },

  setKeyringCharm: (charm) => {
    set((state) => ({ keyring: { ...state.keyring, charm } }));
    get().recalculatePrice();
  },

  toggleKeyringTag: () => {
    set((state) => ({
      keyring: { ...state.keyring, hasEngravedTag: !state.keyring.hasEngravedTag },
    }));
    get().recalculatePrice();
  },

  setKeyringTagText: (engravedText) => {
    set((state) => ({
      keyring: { ...state.keyring, engravedText: engravedText.slice(0, 10) },
    }));
  },

  setKeyringRequirementsText: (requirementsText) => {
    set((state) => ({
      keyring: { ...state.keyring, requirementsText },
    }));
  },

  setKeyringReferenceImage: (referenceImage) => {
    set((state) => ({
      keyring: { ...state.keyring, referenceImage },
    }));
  },

  // Bookmark Actions (Streamlined 3 decisions)
  setIsPersonalized: (isPersonalized) => {
    set((state) => ({
      bookmark: {
        ...state.bookmark,
        isPersonalized,
        hasEngraving: isPersonalized,
      },
    }));
    get().recalculatePrice();
  },

  setPersonalizedName: (name) => {
    const trimmed = name.slice(0, 24);
    set((state) => ({
      bookmark: {
        ...state.bookmark,
        personalizedName: trimmed,
        engravingText: trimmed,
      },
    }));
  },

  setHasFlowers: (hasFlowers) => {
    set((state) => ({
      bookmark: { ...state.bookmark, hasFlowers },
    }));
  },

  setColorChoice: (colorChoice) => {
    set((state) => ({
      bookmark: { ...state.bookmark, colorChoice },
    }));
  },

  setBookmarkTheme: (botanicalTheme) => {
    set((state) => ({ bookmark: { ...state.bookmark, botanicalTheme } }));
    get().recalculatePrice();
  },

  setBookmarkFoil: (foilInclusion) => {
    set((state) => ({ bookmark: { ...state.bookmark, foilInclusion } }));
    get().recalculatePrice();
  },

  setBookmarkTassel: (tasselColor) => {
    set((state) => ({ bookmark: { ...state.bookmark, tasselColor } }));
    get().recalculatePrice();
  },

  toggleBookmarkEngraving: () => {
    set((state) => ({
      bookmark: { ...state.bookmark, hasEngraving: !state.bookmark.hasEngraving },
    }));
    get().recalculatePrice();
  },

  setBookmarkEngravingText: (engravingText) => {
    set((state) => ({
      bookmark: { ...state.bookmark, engravingText: engravingText.slice(0, 32) },
    }));
  },

  setBookmarkFont: (fontFamily) => {
    set((state) => ({ bookmark: { ...state.bookmark, fontFamily } }));
  },

  setBookmarkRequirementsText: (requirementsText) => {
    set((state) => ({
      bookmark: { ...state.bookmark, requirementsText },
    }));
  },

  setBookmarkReferenceImage: (referenceImage) => {
    set((state) => ({ bookmark: { ...state.bookmark, referenceImage } }));
  },

  // Festive / Toran / Shubh Labh Actions
  setFestiveRequirementsText: (requirementsText) => {
    set((state) => ({ festive: { ...state.festive, requirementsText } }));
  },

  setFestiveGeodeColor: (geodeColorway) => {
    set((state) => ({ festive: { ...state.festive, geodeColorway } }));
  },

  setFestiveScript: (scriptStyle) => {
    set((state) => ({ festive: { ...state.festive, scriptStyle } }));
    get().recalculatePrice();
  },

  setFestiveCustomText: (customText) => {
    set((state) => ({ festive: { ...state.festive, customText: customText.slice(0, 24) } }));
  },

  setFestiveCrystalBorder: (crystalBorder) => {
    set((state) => ({ festive: { ...state.festive, crystalBorder } }));
    get().recalculatePrice();
  },

  setFestiveHanging: (hangingElement) => {
    set((state) => ({ festive: { ...state.festive, hangingElement } }));
    get().recalculatePrice();
  },

  toggleFestiveLed: () => {
    set((state) => ({
      festive: { ...state.festive, hasLedBacklight: !state.festive.hasLedBacklight },
    }));
    get().recalculatePrice();
  },

  setFestiveReferenceImage: (referenceImage) => {
    set((state) => ({ festive: { ...state.festive, referenceImage } }));
  },
}));
