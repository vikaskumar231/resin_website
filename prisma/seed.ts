import { PrismaClient, ProductType, ProductBadge } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Artआलय Categories & Hero 4 Catalog...");

  // Clean existing data
  await prisma.productImage.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.coupon.deleteMany({});

  // 1. Seed Categories
  const catNameplates = await prisma.category.create({
    data: {
      id: "c1111111-1111-1111-1111-111111111111",
      slug: "nameplates",
      name: "Bespoke Nameplates",
      description: "Hand-poured resin on reclaimed Burmese teakwood and acrylic bases",
      displayOrder: 1,
    },
  });

  const catKeyrings = await prisma.category.create({
    data: {
      id: "c2222222-2222-2222-2222-222222222222",
      slug: "keyrings",
      name: "Monogram Keyrings",
      description: "High-gloss optical clarity initial keychains with 24K gold foil",
      displayOrder: 2,
    },
  });

  const catBookmarks = await prisma.category.create({
    data: {
      id: "c3333333-3333-3333-3333-333333333333",
      slug: "bookmarks",
      name: "Botanical Bookmarks",
      description: "Pressed natural Himalayan wild flora preserved in thin resin",
      displayOrder: 3,
    },
  });

  const catFestive = await prisma.category.create({
    data: {
      id: "c4444444-4444-4444-4444-444444444444",
      slug: "festive",
      name: "Auspicious Festive Decor",
      description: "Shubh Labh, toran, and spiritual entrance accents",
      displayOrder: 4,
    },
  });

  // 2. Seed Hero 4 Products
  const nameplate = await prisma.product.create({
    data: {
      id: "a1111111-1111-1111-1111-111111111111",
      categoryId: catNameplates.id,
      slug: "bespoke-teakwood-nameplate",
      title: "Bespoke Teakwood & Ocean Wave Resin Nameplate",
      subtitle: "Reclaimed Burmese teak with hand-poured ocean gradient & 3D mirror gold typography",
      description: "Our signature heirloom nameplate. Real seasoned teakwood timber paired with layered epoxy resin replicating ocean waves and shoreline froth. Embellished with 24K gold leaf flecks and laser-cut 3D mirror gold acrylic lettering.",
      productType: ProductType.CUSTOMIZABLE,
      badge: ProductBadge.BESTSELLER,
      basePrice: 2499.00,
      compareAtPrice: 3499.00,
      inventoryCount: 100,
      curingLeadDays: 5,
      dimensions: "16\" x 10\" (Customizable up to 18\" x 12\")",
      customizerConfig: {
        substrates: ["RAW_TEAKWOOD", "FROSTED_ACRYLIC", "MATTE_BLACK_ACRYLIC"],
        colorways: ["OCEAN_WAVE", "EMERALD_GEODE", "MIDNIGHT_GOLD", "RUBY_WINE"],
        sizes: [
          { id: "12x8", label: "Compact 12\" x 8\"", surcharge: 0 },
          { id: "16x10", label: "Grand Heirloom 16\" x 10\"", surcharge: 500 },
          { id: "18x12", label: "Estate Villa 18\" x 12\"", surcharge: 900 },
        ],
        emblems: ["NONE", "GANESHA", "SWASTIK", "LOTUS", "EVIL_EYE"],
        inclusions: ["GOLD_FOIL", "SILVER_FOIL", "DRIED_BOTANICALS"],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
            altText: "Teakwood & Ocean Wave Resin Nameplate",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  const keyring = await prisma.product.create({
    data: {
      id: "a2222222-2222-2222-2222-222222222222",
      categoryId: catKeyrings.id,
      slug: "crystal-initial-keyring",
      title: "Crystal Monogram Resin Letter Keyring",
      subtitle: "High-gloss crystal monogram infused with 24K gold foil and rose petals",
      description: "Everyday luxury in your pocket. Heavy brass gold key loop paired with diamond-clarity UV-stabilized resin enclosing real dried botanicals and shimmering metallic gold foil.",
      productType: ProductType.CUSTOMIZABLE,
      badge: ProductBadge.NEW_ARRIVAL,
      basePrice: 399.00,
      compareAtPrice: 599.00,
      inventoryCount: 250,
      curingLeadDays: 3,
      dimensions: "1.8\" x 1.5\"",
      customizerConfig: {
        letters: ["A", "B", "C", "D", "E", "M", "P", "R", "S", "V"],
        colorways: ["GOLD_FOIL_CLEAR", "BLUSH_ROSE_PETAL", "EMERALD_MINT"],
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
            altText: "Crystal Monogram Letter Keyring",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  const bookmark = await prisma.product.create({
    data: {
      id: "a3333333-3333-3333-3333-333333333333",
      categoryId: catBookmarks.id,
      slug: "pressed-floral-bookmark",
      title: "Pressed Himalayan Flora Botanical Bookmark",
      subtitle: "Natural wild chamomile, ferns, and gold flake enclosed in ultra-thin resin",
      description: "An eternal sanctuary for your favorite books. Hand-foraged Himalayan wild flora preserved forever in optical resin with silk tassel accents and personalized laser-etched quotes.",
      productType: ProductType.CUSTOMIZABLE,
      badge: ProductBadge.MASTERPIECE,
      basePrice: 499.00,
      compareAtPrice: 699.00,
      inventoryCount: 150,
      curingLeadDays: 3,
      dimensions: "5.5\" x 1.2\"",
      customizerConfig: {
        tasselColors: ["GOLDEN_AMBER", "EMERALD_GREEN", "ROYAL_BURGUNDY"],
        hasNameEngraving: true,
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
            altText: "Pressed Himalayan Botanical Bookmark",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  const festive = await prisma.product.create({
    data: {
      id: "a4444444-4444-4444-4444-444444444444",
      categoryId: catFestive.id,
      slug: "auspicious-shubh-labh-pair",
      title: "Sacred Shubh Labh Entrance Geode Set",
      subtitle: "Emerald green geode resin with raw chalcedony crystals & auspicious blessings",
      description: "Welcome prosperity and grace into your home. Handcrafted geode art featuring rich emerald green swirls, genuine crystal quartz chips along the border, and raised 3D gold Devanagari 'शुभ' and 'लाभ' calligraphy.",
      productType: ProductType.READY_TO_SHIP,
      badge: ProductBadge.FESTIVE_SPECIAL,
      basePrice: 1299.00,
      compareAtPrice: 1699.00,
      inventoryCount: 80,
      curingLeadDays: 4,
      dimensions: "Pair of 4.5\" diameter geode discs",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
            altText: "Sacred Shubh Labh Geode Set",
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // 3. Seed Promotional Coupons
  await prisma.coupon.create({
    data: {
      code: "AALAYFIRST10",
      discountType: "PERCENTAGE",
      discountValue: 10.00,
      minOrderValue: 999.00,
      usageLimit: 1000,
    },
  });

  console.log("Successfully seeded Categories, Products, and Coupons in Artआलय!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
