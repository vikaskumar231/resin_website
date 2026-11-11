export interface ProductCatalogItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  basePrice: number;
  compareAtPrice?: number;
  badge?: "BESTSELLER" | "MASTERPIECE" | "FESTIVE_SPECIAL" | "LIMITED_EDITION" | "NEW_ARRIVAL";
  category: string;
  rating: number;
  reviewCount: number;
  dimensions: string;
  curingLeadDays?: number;
  imageUrl: string;
  isCustomizable: boolean;
  description: string;
  tags: string[];
}

export const CATEGORY_LABELS: Record<string, string> = {
  NAMEPLATES: "Nameplate",
  KEYRINGS: "Keyrings",
  BOOKMARKS: "Bookmark",
  FESTIVE: "Toran/Shubh Labh",
};

export const CATEGORY_ICONS: Record<string, string> = {
  NAMEPLATES: "🌊",
  KEYRINGS: "🔑",
  BOOKMARKS: "🌸",
  FESTIVE: "🪔",
};

export const HERO_PRODUCTS: ProductCatalogItem[] = [
  {
    id: "prod_nameplate_01",
    slug: "bespoke-teakwood-nameplate",
    title: "Bespoke Artisan Ocean Wave Resin Nameplate",
    subtitle: "Carefully sourced durable base with hand-poured ocean gradient & 3D mirror gold typography",
    basePrice: 2499,
    compareAtPrice: 2999,
    badge: "BESTSELLER",
    category: "NAMEPLATES",
    rating: 4.9,
    reviewCount: 142,
    dimensions: "16\" x 10\" (Customizable up to 18\" x 12\")",
    curingLeadDays: 5,
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    isCustomizable: true,
    description: "Our signature bespoke nameplate. Carefully sourced durable foundation paired with layered high-gloss non-yellowing epoxy resin replicating ocean waves and shoreline froth. Embellished with 24K gold leaf flecks and laser-cut 3D mirror gold acrylic lettering. Exact delivery date is confirmed by the artist during WhatsApp design approval.",
    tags: ["Home Decor", "Nameplate", "Bespoke", "Wedding Gift", "Housewarming"],
  },
  {
    id: "prod_keyring_02",
    slug: "crystal-initial-keyring",
    title: "Crystal Monogram Resin Letter Keyring",
    subtitle: "High-gloss crystal monogram infused with 24K gold foil and rose petals",
    basePrice: 399,
    compareAtPrice: 499,
    badge: "NEW_ARRIVAL",
    category: "KEYRINGS",
    rating: 4.8,
    reviewCount: 96,
    dimensions: "1.8\" x 1.5\" (Letter dependent)",
    curingLeadDays: 3,
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    isCustomizable: true,
    description: "Everyday luxury in your pocket. Heavy brass gold key loop paired with diamond-clarity UV-stabilized resin enclosing real dried botanicals and shimmering metallic gold foil.",
    tags: ["Accessories", "Keyring", "Personalized", "Budget Luxe", "Gen Z"],
  },
  {
    id: "prod_1793624235487",
    slug: "ocean-dream-custom-name-bookmark",
    title: "Ocean Dream Custom Name Bookmark",
    subtitle: "Flowing hues of sea and sky, handcrafted into a keepsake for every reader.",
    basePrice: 449,
    compareAtPrice: 549,
    badge: "NEW_ARRIVAL",
    category: "BOOKMARKS",
    rating: 5.0,
    reviewCount: 42,
    dimensions: "5.5\" x 1.2\" x 0.1\"",
    curingLeadDays: 4,
    imageUrl: "/uploads/artisan_1793624225732_tnhvza.jpg",
    isCustomizable: true,
    description: "Handcrafted resin bookmark infused with ocean swirl pigments and metallic gold flecks, finished with a pure silk tassel.",
    tags: ["New Arrival", "Handcrafted", "Resin Art", "Artआलय", "Bookmark"],
  },
  {
    id: "prod_festive_04",
    slug: "auspicious-shubh-labh-pair",
    title: "Sacred Toran & Shubh Labh Entrance Geode Set",
    subtitle: "Emerald green geode resin with raw chalcedony crystals & auspicious toran blessings",
    basePrice: 1299,
    compareAtPrice: 1599,
    badge: "FESTIVE_SPECIAL",
    category: "FESTIVE",
    rating: 4.9,
    reviewCount: 110,
    dimensions: "Pair of 4.5\" diameter geode discs",
    curingLeadDays: 4,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    isCustomizable: true,
    description: "Welcome prosperity and grace into your home. Handcrafted toran geode art featuring rich emerald green swirls, genuine crystal quartz chips along the border, and raised 3D gold Devanagari 'शुभ' and 'लाभ' calligraphy.",
    tags: ["Toran/Shubh Labh", "Festive Decor", "Diwali", "Griha Pravesh", "Pooja Room", "Spiritual"],
  },
];

