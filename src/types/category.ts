export interface CategoryItem {
  id: string; // Uppercase identifier, e.g. "NAMEPLATES", "KEYRINGS", "COASTERS"
  slug: string; // URL slug, e.g. "nameplates", "coasters"
  label: string; // Display title, e.g. "Nameplate", "Coasters & Slices"
  icon: string; // Emoji or symbol, e.g. "🌊", "☕"
  description: string; // Short subtitle/tagline
  isDefault?: boolean;
  displayOrder: number;
}

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: "NAMEPLATES",
    slug: "nameplates",
    label: "Nameplate",
    icon: "🌊",
    description: "Bespoke entrance timber & fluid ocean acrylics",
    isDefault: true,
    displayOrder: 1,
  },
  {
    id: "KEYRINGS",
    slug: "keyrings",
    label: "Keyrings",
    icon: "🔑",
    description: "Pocket monogram keepsakes & 24K gold foil charms",
    isDefault: true,
    displayOrder: 2,
  },
  {
    id: "BOOKMARKS",
    slug: "bookmarks",
    label: "Bookmark",
    icon: "🌸",
    description: "Pressed Himalayan botanical flora & optical resin strips",
    isDefault: true,
    displayOrder: 3,
  },
  {
    id: "FESTIVE",
    slug: "festive",
    label: "Toran/Shubh Labh",
    icon: "🪔",
    description: "Auspicious door hangings & geode entrance decor",
    isDefault: true,
    displayOrder: 4,
  },
  {
    id: "COASTERS",
    slug: "coasters",
    label: "Coasters & Slices",
    icon: "☕",
    description: "Luxury geode drink coasters with 24K gilded edges",
    isDefault: false,
    displayOrder: 5,
  },
  {
    id: "WALL_CLOCKS",
    slug: "wall-clocks",
    label: "Wall Clocks",
    icon: "🕒",
    description: "Statement Roman numeral crystal resin wall clocks",
    isDefault: false,
    displayOrder: 6,
  },
  {
    id: "TRAYS",
    slug: "trays",
    label: "Serving Trays",
    icon: "🍱",
    description: "Hand-poured resin charcuterie & luxury vanity platters",
    isDefault: false,
    displayOrder: 7,
  },
  {
    id: "TRINKETS",
    slug: "trinkets",
    label: "Trinket Dishes",
    icon: "💍",
    description: "Delicate botanical ring holders & bedside jewelry dishes",
    isDefault: false,
    displayOrder: 8,
  },
  {
    id: "MANTRA_FRAMES",
    slug: "mantra-frames",
    label: "Mantra Wall Art",
    icon: "🕉️",
    description: "Devotional Gayatri & sacred Sanskrit mantra frames",
    isDefault: false,
    displayOrder: 9,
  },
];

