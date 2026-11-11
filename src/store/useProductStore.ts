import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HERO_PRODUCTS, ProductCatalogItem } from "@/lib/mockData";

export interface ProductStore {
  products: ProductCatalogItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProducts: () => Promise<void>;
  addProduct: (item: Omit<ProductCatalogItem, "id">) => ProductCatalogItem;
  updateProduct: (id: string, updates: Partial<ProductCatalogItem>) => void;
  updatePrice: (id: string, basePrice: number, compareAtPrice?: number) => void;
  updateBadge: (id: string, badge?: ProductCatalogItem["badge"]) => void;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  resetToDefaults: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: HERO_PRODUCTS,
      isLoading: false,
      error: null,

      fetchProducts: async () => {
        try {
          set({ isLoading: true });
          const res = await fetch("/api/products");
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.products)) {
              set({ products: data.products, isLoading: false, error: null });
            } else {
              set({ isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        } catch (err: any) {
          console.warn("[useProductStore] fetchProducts network warning (using local cache):", err);
          set({ isLoading: false });
        }
      },

      addProduct: (item) => {
        const generatedId = `prod_${Date.now()}`;
        const generatedSlug =
          item.slug ||
          item.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const newProduct: ProductCatalogItem = {
          ...item,
          id: generatedId,
          slug: generatedSlug,
          rating: item.rating || 5.0,
          reviewCount: item.reviewCount || 1,
          tags: item.tags || ["Handcrafted", "Resin Art", "Artआलय"],
        };

        // 1. Optimistic local update
        set((state) => ({
          products: [newProduct, ...state.products],
        }));

        // 2. Background server-disk persistence with error rollback
        fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        })
          .then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
              console.error("[useProductStore] Failed to persist product to server disk:", data.error);
              set((state) => ({ products: state.products.filter((p) => p.id !== newProduct.id) }));
            }
          })
          .catch((err) => {
            console.error("[useProductStore] Failed to persist product to server disk:", err);
            set((state) => ({ products: state.products.filter((p) => p.id !== newProduct.id) }));
          });

        return newProduct;
      },

      updateProduct: (id, updates) => {
        const previousProducts = get().products;
        // 1. Optimistic update
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));

        // 2. Background server-disk persistence with error rollback
        fetch(`/api/admin/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })
          .then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
              console.error(`[useProductStore] Failed to update product ${id} on disk:`, data.error);
              set({ products: previousProducts });
            }
          })
          .catch((err) => {
            console.error(`[useProductStore] Failed to update product ${id} on disk:`, err);
            set({ products: previousProducts });
          });
      },

      updatePrice: (id, basePrice, compareAtPrice) => {
        const previousProducts = get().products;
        // 1. Optimistic update
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, basePrice, compareAtPrice } : p
          ),
        }));

        // 2. Background server-disk persistence with rollback
        fetch(`/api/admin/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ basePrice, compareAtPrice }),
        })
          .then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
              console.error(`[useProductStore] Failed to update price for ${id}:`, data.error);
              set({ products: previousProducts });
            }
          })
          .catch((err) => {
            console.error(`[useProductStore] Failed to update price for ${id} on disk:`, err);
            set({ products: previousProducts });
          });
      },

      updateBadge: (id, badge) => {
        const previousProducts = get().products;
        // 1. Optimistic update
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, badge } : p
          ),
        }));

        // 2. Background server-disk persistence with rollback
        fetch(`/api/admin/products/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ badge }),
        })
          .then(async (res) => {
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) {
              console.error(`[useProductStore] Failed to update badge for ${id}:`, data.error);
              set({ products: previousProducts });
            }
          })
          .catch((err) => {
            console.error(`[useProductStore] Failed to update badge for ${id} on disk:`, err);
            set({ products: previousProducts });
          });
      },

      deleteProduct: async (id: string): Promise<{ success: boolean; error?: string }> => {
        const previousProducts = get().products;
        // 1. Optimistic update
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));

        // 2. Server-disk persistence with verified response & rollback
        try {
          const res = await fetch(`/api/admin/products/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json().catch(() => ({}));

          if (!res.ok || !data.success) {
            console.error(`[useProductStore] Server rejected deletion of ${id}:`, data.error);
            // Rollback optimistic state
            set({ products: previousProducts });
            return {
              success: false,
              error: data.error || `Server returned error (${res.status})`,
            };
          }

          return { success: true };
        } catch (err: any) {
          console.error(`[useProductStore] Failed to delete product ${id} on disk:`, err);
          // Rollback on network failure
          set({ products: previousProducts });
          return {
            success: false,
            error: err.message || "Network error while deleting product",
          };
        }
      },

      resetToDefaults: () => {
        set({ products: HERO_PRODUCTS });
      },
    }),
    {
      name: "art_aalay_products",
    }
  )
);
