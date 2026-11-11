import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CategoryItem, INITIAL_CATEGORIES } from "@/types/category";

export interface CategoryWithCount extends CategoryItem {
  productCount?: number;
}

export interface CategoryStore {
  categories: CategoryWithCount[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  addCategory: (data: {
    label: string;
    icon?: string;
    description?: string;
    id?: string;
    slug?: string;
  }) => Promise<{ success: boolean; error?: string; category?: CategoryWithCount }>;
  updateCategory: (
    id: string,
    updates: Partial<CategoryItem>
  ) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;

  // Getters
  getCategoryLabel: (id: string) => string;
  getCategoryIcon: (id: string) => string;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: INITIAL_CATEGORIES.map((c) => ({ ...c, productCount: 0 })),
      isLoading: false,
      error: null,

      fetchCategories: async () => {
        try {
          set({ isLoading: true });
          const res = await fetch("/api/categories");
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.categories)) {
              set({ categories: data.categories, isLoading: false, error: null });
            } else {
              set({ isLoading: false });
            }
          } else {
            set({ isLoading: false });
          }
        } catch (err: any) {
          console.warn("[useCategoryStore] fetchCategories network warning:", err);
          set({ isLoading: false });
        }
      },

      addCategory: async (data) => {
        try {
          set({ isLoading: true });
          const res = await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          const json = await res.json();
          if (!res.ok || !json.success) {
            set({ isLoading: false, error: json.error || "Failed to create category" });
            return { success: false, error: json.error || "Failed to create category" };
          }

          const newCat: CategoryWithCount = json.category;
          set((state) => ({
            categories: [...state.categories, newCat],
            isLoading: false,
            error: null,
          }));

          return { success: true, category: newCat };
        } catch (err: any) {
          set({ isLoading: false, error: err.message });
          return { success: false, error: err.message };
        }
      },

      updateCategory: async (id, updates) => {
        try {
          set({ isLoading: true });
          const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });

          const json = await res.json();
          if (!res.ok || !json.success) {
            set({ isLoading: false, error: json.error || "Failed to update category" });
            return { success: false, error: json.error || "Failed to update category" };
          }

          set((state) => ({
            categories: state.categories.map((c) =>
              c.id.toUpperCase() === id.toUpperCase() ? { ...c, ...json.category } : c
            ),
            isLoading: false,
            error: null,
          }));

          return { success: true };
        } catch (err: any) {
          set({ isLoading: false, error: err.message });
          return { success: false, error: err.message };
        }
      },

      deleteCategory: async (id) => {
        try {
          set({ isLoading: true });
          const res = await fetch(`/api/categories/${encodeURIComponent(id)}`, {
            method: "DELETE",
          });

          const json = await res.json();
          if (!res.ok || !json.success) {
            set({ isLoading: false, error: json.error || "Failed to delete category" });
            return { success: false, error: json.error || "Failed to delete category" };
          }

          set((state) => ({
            categories: state.categories.filter((c) => c.id.toUpperCase() !== id.toUpperCase()),
            isLoading: false,
            error: null,
          }));

          return { success: true };
        } catch (err: any) {
          set({ isLoading: false, error: err.message });
          return { success: false, error: err.message };
        }
      },

      getCategoryLabel: (id: string) => {
        if (!id) return "";
        const cleanId = id.toUpperCase();
        const found = get().categories.find((c) => c.id.toUpperCase() === cleanId);
        return found ? found.label : id;
      },

      getCategoryIcon: (id: string) => {
        if (!id) return "✨";
        const cleanId = id.toUpperCase();
        const found = get().categories.find((c) => c.id.toUpperCase() === cleanId);
        return found ? found.icon : "✨";
      },
    }),
    {
      name: "art_aalay_categories_v1",
      partialize: (state) => ({ categories: state.categories }),
    }
  )
);
