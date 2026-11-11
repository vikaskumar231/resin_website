import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CustomizerState } from "./useCustomizerStore";

export type CustomizationDetails =
  | {
      type?: "NAMEPLATE";
      substrate: CustomizerState["nameplate"]["substrate"];
      size: CustomizerState["nameplate"]["size"];
      colorway: CustomizerState["nameplate"]["colorway"];
      inclusions: string[];
      emblem: CustomizerState["nameplate"]["emblem"];
      typography: CustomizerState["nameplate"]["typography"];
      hasLedBacklight: boolean;
      hasBrassBells?: boolean;
      requirementsText?: string;
      referenceImage?: string | null;
      previewImageUrl?: string;
    }
  | {
      type?: "KEYRING";
      letter: string;
      style: CustomizerState["keyring"]["style"];
      hardwareFinish: CustomizerState["keyring"]["hardwareFinish"];
      charm: CustomizerState["keyring"]["charm"];
      hasEngravedTag: boolean;
      engravedText: string;
      requirementsText?: string;
      referenceImage?: string | null;
      previewImageUrl?: string;
    }
  | {
      type?: "BOOKMARK";
      isPersonalized?: boolean;
      personalizedName?: string;
      hasFlowers?: boolean;
      colorChoice?: CustomizerState["bookmark"]["colorChoice"];
      botanicalTheme?: CustomizerState["bookmark"]["botanicalTheme"];
      foilInclusion?: CustomizerState["bookmark"]["foilInclusion"];
      tasselColor?: CustomizerState["bookmark"]["tasselColor"];
      hasEngraving?: boolean;
      engravingText?: string;
      fontFamily?: string;
      requirementsText?: string;
      referenceImage?: string | null;
      previewImageUrl?: string;
    }
  | {
      type?: "FESTIVE";
      requirementsText?: string;
      geodeColorway?: CustomizerState["festive"]["geodeColorway"];
      scriptStyle?: CustomizerState["festive"]["scriptStyle"];
      customText?: string;
      crystalBorder?: CustomizerState["festive"]["crystalBorder"];
      hangingElement?: CustomizerState["festive"]["hangingElement"];
      hasLedBacklight?: boolean;
      referenceImage?: string | null;
      previewImageUrl?: string;
    }
  | Record<string, any>;

export interface CartItem {
  id: string; // Unique cart line item ID
  productId: string;
  productSlug: string;
  title: string;
  subtitle?: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  isCustomizable: boolean;
  customizationDetails?: CustomizationDetails;
}

export interface CouponDetails {
  code: string;
  discountType: "PERCENTAGE" | "FLAT_AMOUNT";
  discountValue: number;
  discountAmount: number;
}

export interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  isGift: boolean;
  giftMessage: string;
  giftWrapFee: number;
  appliedCoupon: CouponDetails | null;
  
  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  toggleGift: () => void;
  setGiftMessage: (msg: string) => void;
  applyCoupon: (coupon: CouponDetails) => void;
  removeCoupon: () => void;

  // Computed Totals
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTaxAmount: () => number;
  getGrandTotal: () => number;
  getTokenBookingAmount: () => number;
  getRemainingTentativeBalance: () => number;
  getItemCount: () => number;
}

export const TOKEN_BOOKING_AMOUNT_PER_ITEM = 199;
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;
const GIFT_WRAP_COST = 99;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [
        // Seed default item for instant demo preview
        {
          id: "cart_item_initial_01",
          productId: "prod_nameplate_01",
          productSlug: "bespoke-teakwood-nameplate",
          title: "Bespoke Natural Wood & Ocean Wave Resin Nameplate",
          subtitle: "12\" x 8\" • Ocean Wave • 24K Gold Lettering",
          unitPrice: 2499,
          quantity: 1,
          imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
          isCustomizable: true,
          customizationDetails: {
            substrate: "RAW_TEAKWOOD",
            size: "12x8",
            colorway: "OCEAN_WAVE",
            inclusions: ["GOLD_FOIL"],
            emblem: "NONE",
            typography: {
              line1: "The Sharmas",
              line2: "Villa 42, Palm Greens",
              fontFamily: "Cinzel",
              material: "GOLD_MIRROR",
            },
            hasLedBacklight: false,
            hasBrassBells: false,
          },
        },
      ],
      isCartOpen: false,
      isGift: false,
      giftMessage: "",
      giftWrapFee: 0,
      appliedCoupon: null,

      addItem: (itemData) => {
        const newItem: CartItem = {
          ...itemData,
          id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        };
        set((state) => ({
          items: [...state.items, newItem],
          isCartOpen: true,
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null),
        }));
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null, isGift: false, giftMessage: "" });
      },

      setCartOpen: (open) => set({ isCartOpen: open }),

      toggleGift: () => {
        set((state) => ({
          isGift: !state.isGift,
          giftWrapFee: !state.isGift ? GIFT_WRAP_COST : 0,
        }));
      },

      setGiftMessage: (msg) => set({ giftMessage: msg.slice(0, 300) }),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),

      removeCoupon: () => set({ appliedCoupon: null }),

      getSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;

        if (coupon.discountType === "PERCENTAGE") {
          return Math.round((subtotal * coupon.discountValue) / 100);
        }
        return Math.min(coupon.discountValue, subtotal);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) {
          return 0;
        }
        return STANDARD_SHIPPING_FEE;
      },

      getTaxAmount: () => {
        // GST (18%) is inclusive in all displayed prices in accordance with Indian MRP laws
        const taxableTotal = get().getSubtotal() - get().getDiscountAmount();
        return Math.round((taxableTotal * 18) / 118);
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        const giftWrap = get().isGift ? GIFT_WRAP_COST : 0;
        return Math.max(0, subtotal - discount + shipping + giftWrap);
      },

      getTokenBookingAmount: () => {
        const items = get().items;
        if (items.length === 0) return 0;
        return items.reduce((acc, item) => {
          if (item.isCustomizable) {
            return acc + TOKEN_BOOKING_AMOUNT_PER_ITEM * item.quantity;
          }
          return acc + item.unitPrice * item.quantity;
        }, 0);
      },

      getRemainingTentativeBalance: () => {
        return Math.max(0, get().getGrandTotal() - get().getTokenBookingAmount());
      },

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: "art_aalay_cart_v1",
      partialize: (state) => ({
        items: state.items,
        isGift: state.isGift,
        giftMessage: state.giftMessage,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);

