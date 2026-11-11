"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useAuthStore } from "@/store/useAuthStore";
import { useCategoryStore, CategoryWithCount } from "@/store/useCategoryStore";
import {
  Sparkles,
  Plus,
  Layers,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Search,
  Tag,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  X,
} from "lucide-react";

const SUGGESTED_EMOJIS = [
  "🌊", "🔑", "🌸", "🪔", "☕", "🕒", "🍱", "💍", "🕉️", "🎨",
  "🌿", "💎", "🪴", "🕯️", "🌙", "🪞", "📿", "🪄", "✨", "🎁"
];

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isArtisanAdmin = user?.role === "ARTISAN_ADMIN";
  const { categories, isLoading, error, fetchCategories, addCategory, updateCategory, deleteCategory } =
    useCategoryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);

  // Form State
  const [labelInput, setLabelInput] = useState("");
  const [idInput, setIdInput] = useState("");
  const [iconInput, setIconInput] = useState("✨");
  const [descInput, setDescInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Auth gate check
  useEffect(() => {
    if (user && !isArtisanAdmin) {
      router.push("/login?error=unauthorized");
    }
  }, [user, isArtisanAdmin, router]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setLabelInput("");
    setIdInput("");
    setIconInput("☕");
    setDescInput("");
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (cat: CategoryWithCount) => {
    setEditingCategory(cat);
    setLabelInput(cat.label);
    setIdInput(cat.id);
    setIconInput(cat.icon || "✨");
    setDescInput(cat.description || "");
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Auto-generate code from title if not editing
  const handleTitleChange = (val: string) => {
    setLabelInput(val);
    if (!editingCategory) {
      const suggestedCode = val
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/(^_|_$)/g, "");
      setIdInput(suggestedCode);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanLabel = labelInput.trim();
    if (!cleanLabel) {
      setFormError("Category title is required.");
      return;
    }

    setIsSubmitting(true);

    if (editingCategory) {
      const res = await updateCategory(editingCategory.id, {
        label: cleanLabel,
        icon: iconInput.trim() || "✨",
        description: descInput.trim() || "Handcrafted bespoke creations",
      });

      setIsSubmitting(false);
      if (res.success) {
        setIsAddModalOpen(false);
        setSuccessToast(`Category '${cleanLabel}' updated successfully!`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        setFormError(res.error || "Failed to update category.");
      }
    } else {
      const res = await addCategory({
        label: cleanLabel,
        id: idInput.trim().toUpperCase() || undefined,
        icon: iconInput.trim() || "✨",
        description: descInput.trim() || "Handcrafted bespoke creations",
      });

      setIsSubmitting(false);
      if (res.success) {
        setIsAddModalOpen(false);
        setSuccessToast(`New category '${cleanLabel}' added to website!`);
        setTimeout(() => setSuccessToast(null), 3500);
      } else {
        setFormError(res.error || "Failed to create category.");
      }
    }
  };

  const handleDelete = async (cat: CategoryWithCount) => {
    if (cat.productCount && cat.productCount > 0) {
      alert(
        `Cannot delete '${cat.label}' because ${cat.productCount} active creation(s) are assigned to it. Please reassign those products first in Catalog CMS.`
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete category '${cat.label}' (${cat.id})?`)) {
      return;
    }

    const res = await deleteCategory(cat.id);
    if (res.success) {
      setSuccessToast(`Category '${cat.label}' removed.`);
      setTimeout(() => setSuccessToast(null), 3000);
    } else {
      alert(res.error || "Failed to delete category.");
    }
  };

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.label.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  const totalAssignedProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {/* Breadcrumb & Screen Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-sand">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
                👑 Artisan Admin Suite
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] font-semibold text-slate-500">Taxonomy CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-emerald">
              Category &amp; Collection Manager
            </h1>
            <p className="text-xs text-brand-charcoal/70 mt-1 max-w-2xl leading-relaxed">
              Add new product categories (e.g. Coasters, Wall Clocks, Serving Trays, Trinkets, Mantra Wall Art). Any category created here reflects in real-time on the storefront collection bar, catalog CMS, and customizer studios.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-brand-sand bg-white text-xs font-bold text-brand-charcoal hover:bg-brand-sand transition-all text-center min-h-[44px]"
            >
              <Tag className="w-3.5 h-3.5 text-brand-gold" />
              <span>Catalog CMS ➔</span>
            </Link>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold shadow-md hover:bg-emerald-900 transition-all active:scale-95 cursor-pointer text-center min-h-[44px]"
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>+ Add New Category</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* 3 Metric Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-brand-sand shadow-2xs space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
              Active Categories
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-brand-emerald">
                {categories.length}
              </span>
              <span className="text-xs text-emerald-700 font-semibold">Available on Storefront</span>
            </div>
            <p className="text-[11px] text-slate-500">Live filters across collections and CMS</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-brand-sand shadow-2xs space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block">
              Products Mapped
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-brand-emerald">
                {totalAssignedProducts}
              </span>
              <span className="text-xs text-slate-500 font-semibold">Creations Assigned</span>
            </div>
            <p className="text-[11px] text-slate-500">Active catalog pieces categorized</p>
          </div>

          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-white border border-brand-gold/40 shadow-2xs space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-amber-900/70 block">
              Flexible Studio Bridge
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-serif font-bold text-amber-900">100%</span>
              <span className="text-xs text-amber-800 font-semibold">Instant Sync</span>
            </div>
            <p className="text-[11px] text-amber-900/80">Reflects automatically in + Add Product modal</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-3xl bg-white border border-brand-sand shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter categories by name, code, or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-brand-sand bg-brand-ivory/50 text-xs focus:ring-2 focus:ring-brand-gold focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Showing {filteredCategories.length} of {categories.length} categories</span>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-6 border border-brand-sand hover:border-brand-gold/60 shadow-2xs hover:shadow-soft transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-sand/60 group-hover:bg-brand-gold/20 flex items-center justify-center text-2xl transition-colors shadow-inner">
                      {cat.icon || "✨"}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-brand-emerald leading-tight">
                        {cat.label}
                      </h3>
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                        Code: {cat.id}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                    {cat.productCount || 0} Products
                  </span>
                </div>

                <p className="text-xs text-brand-charcoal/70 leading-relaxed min-h-[36px]">
                  {cat.description || "Handcrafted bespoke creations"}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-brand-sand/70 flex items-center justify-between gap-2">
                <Link
                  href={`/admin/products?category=${encodeURIComponent(cat.id)}`}
                  className="text-xs font-semibold text-brand-emerald hover:text-brand-teal flex items-center gap-1"
                >
                  <span>View in Catalog</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(cat)}
                    className="p-2 rounded-xl text-slate-500 hover:text-brand-emerald hover:bg-brand-sand/60 transition-all"
                    title="Edit category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(cat)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    title={cat.productCount && cat.productCount > 0 ? "Cannot delete: products assigned" : "Delete category"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Add / Edit Category */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-brand-sand space-y-5 sm:space-y-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-brand-sand">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{iconInput}</span>
                  <h3 className="font-serif text-lg font-bold text-brand-emerald">
                    {editingCategory ? `Edit Category: ${editingCategory.label}` : "Add New Category"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-brand-sand text-slate-400 hover:text-brand-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Title / Label */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Category Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={labelInput}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Coasters &amp; Agate Slices, Wall Clocks, Serving Trays"
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-brand-ivory/50 text-xs font-semibold focus:ring-2 focus:ring-brand-gold focus:outline-none"
                  />
                </div>

                {/* System Code / ID */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Category Code / System ID *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCategory}
                    value={idInput}
                    onChange={(e) => setIdInput(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))}
                    placeholder="e.g. COASTERS, WALL_CLOCKS, TRAYS"
                    className={`w-full px-4 py-2.5 rounded-xl border border-brand-sand font-mono text-xs font-bold uppercase focus:ring-2 focus:ring-brand-gold focus:outline-none ${
                      editingCategory ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-brand-ivory/50 text-brand-charcoal"
                    }`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Immutable uppercase taxonomy key used internally by products and database.
                  </p>
                </div>

                {/* Emoji Icon Picker */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Category Icon / Emoji *
                    </label>
                    <span className="text-[11px] text-slate-400">Current: {iconInput}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-brand-sand/40 border border-brand-sand mb-2">
                    {SUGGESTED_EMOJIS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setIconInput(emoji)}
                        className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                          iconInput === emoji
                            ? "bg-brand-emerald text-white scale-110 shadow-xs"
                            : "hover:bg-white"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={iconInput}
                    onChange={(e) => setIconInput(e.target.value)}
                    placeholder="Or type/paste any emoji or icon symbol"
                    className="w-full px-3 py-1.5 rounded-xl border border-brand-sand bg-brand-ivory/50 text-xs focus:ring-2 focus:ring-brand-gold focus:outline-none"
                  />
                </div>

                {/* Subtitle / Tagline Description */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Tagline / Description
                  </label>
                  <textarea
                    rows={2}
                    maxLength={150}
                    value={descInput}
                    onChange={(e) => setDescInput(e.target.value)}
                    placeholder="e.g. Luxury geode drink coasters with 24K gilded edges and heat resistance."
                    className="w-full px-4 py-2.5 rounded-xl border border-brand-sand bg-brand-ivory/50 text-xs focus:ring-2 focus:ring-brand-gold focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-brand-sand">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-3 rounded-full border border-brand-sand text-xs font-semibold text-slate-600 hover:bg-brand-sand text-center min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-emerald text-white text-xs font-bold shadow-md hover:bg-emerald-900 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    {isSubmitting ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                        <span>{editingCategory ? "Update Category" : "Save & Publish Category"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
