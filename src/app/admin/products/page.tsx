"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ProductCatalogItem } from "@/lib/mockData";
import { useProductStore } from "@/store/useProductStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { compressImageToLimit } from "@/lib/imageCompressor";
import {
  Plus,
  Edit3,
  Sparkles,
  Star,
  Tag,
  Layers,
  FolderTree,
  ExternalLink,
  CheckCircle2,
  Check,
  X,
  IndianRupee,
  Search,
  Filter,
  Eye,
  Flame,
  Crown,
  Sparkle,
  ChevronDown,
  Trash2,
  AlertTriangle,
  Image as ImageIcon,
  UploadCloud,
  FolderOpen,
  Camera,
  RefreshCw,
} from "lucide-react";

type CategoryFilter = string;
type BadgeOptionId = "NONE" | "BESTSELLER" | "MASTERPIECE" | "FESTIVE_SPECIAL" | "NEW_ARRIVAL" | "LIMITED_EDITION";

interface BadgeOption {
  id: BadgeOptionId;
  label: string;
  icon: string;
  desc: string;
}

const BADGE_OPTIONS: BadgeOption[] = [
  { id: "BESTSELLER", label: "Bestseller", icon: "🔥", desc: "High demand & social proof" },
  { id: "MASTERPIECE", label: "Masterpiece", icon: "👑", desc: "Signature luxury craft" },
  { id: "FESTIVE_SPECIAL", label: "Festive Special", icon: "🪔", desc: "Auspicious & seasonal" },
  { id: "NEW_ARRIVAL", label: "New Arrival", icon: "✨", desc: "Fresh workshop drop" },
  { id: "LIMITED_EDITION", label: "Limited Edition", icon: "⏳", desc: "Artisanal scarcity" },
  { id: "NONE", label: "None / Remove Badge", icon: "✕", desc: "Standard unbadged listing" },
];

const PRESET_IMAGES = [
  { label: "Ocean Wave Resin", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
  { label: "Monogram Keyring", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80" },
  { label: "Pressed Bookmark", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80" },
  { label: "Auspicious Geode", url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80" },
  { label: "Emerald Geode Clock", url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80" },
];

export default function ArtisanProductsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { products, addProduct, updateProduct, updatePrice, updateBadge, deleteProduct, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync latest products & categories from server disk on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Inline Price Editing State
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlinePriceVal, setInlinePriceVal] = useState<string>("");

  // 1-Click Table-Row Badge Popover State
  const [badgePopoverProductId, setBadgePopoverProductId] = useState<string | null>(null);
  const badgePopoverRef = useRef<HTMLDivElement>(null);

  // 1-Click Table-Row Category Popover State
  const [categoryPopoverProductId, setCategoryPopoverProductId] = useState<string | null>(null);
  const categoryPopoverRef = useRef<HTMLDivElement>(null);

  // Deletion Confirmation Modal State
  const [deleteCandidate, setDeleteCandidate] = useState<ProductCatalogItem | null>(null);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [newCategory, setNewCategory] = useState<string>("NAMEPLATES");
  const [newBasePrice, setNewBasePrice] = useState<number>(1499);
  const [newComparePrice, setNewComparePrice] = useState<number>(1899);
  const [newImageUrl, setNewImageUrl] = useState(PRESET_IMAGES[0].url);
  const [newIsCustomizable, setNewIsCustomizable] = useState(true);
  const [newBadge, setNewBadge] = useState<BadgeOptionId>("NEW_ARRIVAL");

  // Local Image Upload & Browser State
  const [imageSourceMode, setImageSourceMode] = useState<"LOCAL" | "PRESET">("LOCAL");
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [uploadedImageSize, setUploadedImageSize] = useState<string | null>(null);
  const [isOptimizingImage, setIsOptimizingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick Row Image Update Ref (for existing products)
  const [rowEditImageProductId, setRowEditImageProductId] = useState<string | null>(null);
  const rowFileInputRef = useRef<HTMLInputElement>(null);

  // Oversized File (> 5 MB) Permission & Compression State
  const MAX_ALLOWED_FILE_SIZE = 5 * 1024 * 1024; // 5 MB upper limit
  interface PendingOversizedFile {
    file: File;
    source: "ADD_MODAL" | "ROW_EDIT";
    productId?: string;
    originalSizeMb: string;
  }
  const [oversizedFile, setOversizedFile] = useState<PendingOversizedFile | null>(null);
  const [isCompressingOversized, setIsCompressingOversized] = useState(false);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Server-side Disk Image Upload (Persists to public/uploads/ on disk, no localStorage bloat)
  const uploadImageToServer = async (
    file: File
  ): Promise<{ url: string; fileName: string; sizeLabel: string } | null> => {
    if (!file.type.startsWith("image/")) {
      showToast("⚠️ Please select a valid image file (.png, .jpg, .webp, .avif).");
      return null;
    }

    try {
      setIsOptimizingImage(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setIsOptimizingImage(false);

      if (data.success && data.url) {
        return {
          url: data.url,
          fileName: data.fileName || file.name,
          sizeLabel: data.sizeInKb || `${Math.round(file.size / 1024)} KB`,
        };
      } else {
        showToast(`⚠️ Upload failed: ${data.error || "Server upload error"}`);
        return null;
      }
    } catch (err: any) {
      setIsOptimizingImage(false);
      showToast(`⚠️ Server upload error: ${err.message}`);
      return null;
    }
  };

  const handleAddModalFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("⚠️ Please select a valid image file (.png, .jpg, .webp, .avif).");
      return;
    }

    // Intercept oversized file (> 5 MB) for admin confirmation
    if (file.size > MAX_ALLOWED_FILE_SIZE) {
      setOversizedFile({
        file,
        source: "ADD_MODAL",
        originalSizeMb: (file.size / (1024 * 1024)).toFixed(2),
      });
      return;
    }

    const uploaded = await uploadImageToServer(file);
    if (uploaded) {
      setNewImageUrl(uploaded.url);
      setUploadedImageName(uploaded.fileName);
      setUploadedImageSize(uploaded.sizeLabel);
      showToast(`🖼️ Saved "${uploaded.fileName}" (${uploaded.sizeLabel}) permanently on server disk!`);
    }
  };

  const handleClearUploadedImage = () => {
    setNewImageUrl(PRESET_IMAGES[0].url);
    setUploadedImageName(null);
    setUploadedImageSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAddModalFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleTriggerRowImageUpload = (prodId: string) => {
    setRowEditImageProductId(prodId);
    rowFileInputRef.current?.click();
  };

  const handleRowFileSelected = async (file: File) => {
    if (!rowEditImageProductId) return;
    if (!file.type.startsWith("image/")) {
      showToast("⚠️ Please select a valid image file (.png, .jpg, .webp, .avif).");
      return;
    }

    // Intercept oversized file (> 5 MB) for admin confirmation
    if (file.size > MAX_ALLOWED_FILE_SIZE) {
      setOversizedFile({
        file,
        source: "ROW_EDIT",
        productId: rowEditImageProductId,
        originalSizeMb: (file.size / (1024 * 1024)).toFixed(2),
      });
      return;
    }

    const targetProd = products.find((p) => p.id === rowEditImageProductId);
    const uploaded = await uploadImageToServer(file);
    if (uploaded) {
      updateProduct(rowEditImageProductId, { imageUrl: uploaded.url });
      showToast(`🖼️ Updated image for "${targetProd?.title || 'Product'}" permanently on server disk!`);
      setRowEditImageProductId(null);
    }
  };

  const handleConfirmCompression = async () => {
    if (!oversizedFile) return;

    try {
      setIsCompressingOversized(true);
      const compressed = await compressImageToLimit(oversizedFile.file, MAX_ALLOWED_FILE_SIZE);
      const compressedSizeMb = (compressed.size / (1024 * 1024)).toFixed(2);

      const uploaded = await uploadImageToServer(compressed);

      if (uploaded) {
        if (oversizedFile.source === "ADD_MODAL") {
          setNewImageUrl(uploaded.url);
          setUploadedImageName(uploaded.fileName);
          setUploadedImageSize(uploaded.sizeLabel);
          showToast(`✨ Compressed (${oversizedFile.originalSizeMb} MB ➔ ${compressedSizeMb} MB) & uploaded successfully!`);
        } else if (oversizedFile.source === "ROW_EDIT" && oversizedFile.productId) {
          const targetProd = products.find((p) => p.id === oversizedFile.productId);
          updateProduct(oversizedFile.productId, { imageUrl: uploaded.url });
          showToast(`✨ Compressed (${oversizedFile.originalSizeMb} MB ➔ ${compressedSizeMb} MB) & updated image for "${targetProd?.title || 'Product'}"!`);
          setRowEditImageProductId(null);
        }
      }
    } catch (err: any) {
      showToast(`⚠️ Compression failed: ${err.message}`);
    } finally {
      setIsCompressingOversized(false);
      setOversizedFile(null);
    }
  };

  const handleCancelCompression = () => {
    setOversizedFile(null);
    setRowEditImageProductId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (rowFileInputRef.current) rowFileInputRef.current.value = "";
    showToast("Image upload cancelled.");
  };

  // Close badge and category popovers on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        badgePopoverRef.current &&
        !badgePopoverRef.current.contains(event.target as Node)
      ) {
        setBadgePopoverProductId(null);
      }
      if (
        categoryPopoverRef.current &&
        !categoryPopoverRef.current.contains(event.target as Node)
      ) {
        setCategoryPopoverProductId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamic Category Taxonomy (Reflects all admin-added categories)
  const DYNAMIC_CATEGORIES = [
    { id: "ALL", label: "All Creations", icon: "🌿" },
    ...categories.map((c) => ({
      id: c.id,
      label: c.label,
      icon: c.icon || "✨",
    })),
  ];

  const getCategoryLabel = (cat: string) => {
    if (!cat) return "";
    const cleanId = cat.toUpperCase();
    const found = categories.find((c) => c.id.toUpperCase() === cleanId);
    return found ? found.label : cat;
  };

  const getCategoryIcon = (cat: string) => {
    if (!cat) return "✨";
    const cleanId = cat.toUpperCase();
    const found = categories.find((c) => c.id.toUpperCase() === cleanId);
    return found ? found.icon : "✨";
  };

  // 1-Click Table-Row Category Reassignment
  const handleUpdateCategory = (prodId: string, newCat: string) => {
    updateProduct(prodId, { category: newCat as any });
    setCategoryPopoverProductId(null);
    const target = products.find((p) => p.id === prodId);
    showToast(`🏷️ Reassigned "${target?.title}" to "${getCategoryLabel(newCat)}" category!`);
  };

  // Calculate product counts per category
  const getCategoryCount = (cat: string) => {
    if (cat === "ALL") return products.length;
    return products.filter((p) => p.category?.toUpperCase() === cat.toUpperCase()).length;
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "ALL" || p.category?.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Start Inline Price Edit
  const handleStartInlineEdit = (prod: ProductCatalogItem) => {
    setInlineEditId(prod.id);
    setInlinePriceVal(prod.basePrice.toString());
  };

  // Save Inline Price Edit
  const handleSaveInlineEdit = (prodId: string) => {
    const num = parseFloat(inlinePriceVal);
    if (isNaN(num) || num <= 0) {
      showToast("⚠️ Please enter a valid price greater than 0");
      return;
    }

    const roundedPrice = Math.round(num);
    const target = products.find((p) => p.id === prodId);
    updatePrice(prodId, roundedPrice, target?.compareAtPrice);
    setInlineEditId(null);
    showToast(`✨ Updated price for "${target?.title}" to ₹${roundedPrice.toLocaleString("en-IN")}!`);
  };

  // 1-Click Update Merchandising Badge from Popover
  const handleUpdateBadge = (prodId: string, badgeId: BadgeOptionId) => {
    const newBadge = badgeId === "NONE" ? undefined : (badgeId as ProductCatalogItem["badge"]);
    updateBadge(prodId, newBadge);
    setBadgePopoverProductId(null);
    const target = products.find((p) => p.id === prodId);
    const label = BADGE_OPTIONS.find((b) => b.id === badgeId)?.label || "None";
    showToast(`🏷️ Badge updated to "${label}" for "${target?.title}"!`);
  };

  // Confirm and Execute Deletion with Server Synchronization
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    const targetTitle = deleteCandidate.title;
    const targetId = deleteCandidate.id;
    setDeleteCandidate(null);

    const result = await deleteProduct(targetId);
    if (result.success) {
      showToast(`🗑️ Permanently deleted "${targetTitle}" from disk database and catalog.`);
    } else {
      showToast(`⚠️ Failed to delete "${targetTitle}": ${result.error || "Permission denied."}`);
    }
  };

  // Handle Create Product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("⚠️ Product title is required.");
      return;
    }

    const created = addProduct({
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || "Handcrafted bespoke luxury resin art",
      category: newCategory,
      basePrice: newBasePrice > 0 ? newBasePrice : 999,
      compareAtPrice: newComparePrice > newBasePrice ? newComparePrice : undefined,
      imageUrl: newImageUrl,
      isCustomizable: newIsCustomizable,
      badge: newBadge === "NONE" ? undefined : newBadge,
      description: `Handcrafted ${newCategory.toLowerCase()} piece made with premium UV-resistant optical epoxy resin, designed with elegance for heart and home.`,
      tags: ["New Arrival", "Handcrafted", "Resin Art", "Artआलय"],
      rating: 5.0,
      reviewCount: 1,
      dimensions: "Standard Artisan Size",
    });

    setIsAddModalOpen(false);
    // Reset Form
    setNewTitle("");
    setNewSubtitle("");
    setNewBasePrice(1499);
    setNewComparePrice(1899);
    setNewImageUrl(PRESET_IMAGES[0].url);
    setUploadedImageName(null);
    setUploadedImageSize(null);
    setImageSourceMode("LOCAL");
    showToast(`🎉 Added "${created.title}"! Now live on Collections page.`);
  };

  // Helper to render styled badge preview
  const getBadgeMeta = (badge?: ProductCatalogItem["badge"]) => {
    switch (badge) {
      case "BESTSELLER":
        return {
          label: "Bestseller",
          icon: <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />,
          colorClass: "bg-amber-100 text-amber-950 border-amber-300 hover:border-amber-400 hover:bg-amber-200/70",
        };
      case "MASTERPIECE":
        return {
          label: "Masterpiece",
          icon: <Crown className="w-3.5 h-3.5 text-emerald-700" />,
          colorClass: "bg-emerald-100 text-emerald-950 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-200/70",
        };
      case "FESTIVE_SPECIAL":
        return {
          label: "Festive Special",
          icon: <Sparkles className="w-3.5 h-3.5 text-orange-600" />,
          colorClass: "bg-orange-100 text-orange-950 border-orange-300 hover:border-orange-400 hover:bg-orange-200/70",
        };
      case "NEW_ARRIVAL":
        return {
          label: "New Arrival",
          icon: <Sparkle className="w-3.5 h-3.5 text-teal-600" />,
          colorClass: "bg-teal-100 text-teal-950 border-teal-300 hover:border-teal-400 hover:bg-teal-200/70",
        };
      case "LIMITED_EDITION":
        return {
          label: "Limited Edition",
          icon: <Star className="w-3.5 h-3.5 text-rose-600 fill-rose-400" />,
          colorClass: "bg-rose-100 text-rose-950 border-rose-300 hover:border-rose-400 hover:bg-rose-200/70",
        };
      default:
        return null;
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
        <Navbar />
        <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6 animate-pulse">
          <div className="h-10 bg-brand-sand/50 rounded-2xl w-64 mb-6" />
          <div className="h-64 bg-brand-sand/30 rounded-3xl w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-charcoal flex flex-col selection:bg-brand-gold/30">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-brand-sand">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                Artisan Merchandising CMS (US-7.1 &amp; US-7.2)
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald">
                {products.length} Products Active
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brand-emerald">
              Product Catalog &amp; CMS Manager
            </h1>
            <p className="text-xs text-brand-charcoal/70 mt-1">
              Add new creations, edit prices inline with the pen icon, pick badges with 1-click, or remove discontinued pieces.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <Link
              href="/admin/categories"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-brand-sand bg-white text-xs font-bold text-brand-charcoal hover:bg-brand-sand transition-all text-center min-h-[44px]"
            >
              <FolderTree className="w-3.5 h-3.5 text-brand-gold" />
              <span>Manage Categories ({categories.length}) ➔</span>
            </Link>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold shadow-md hover:bg-brand-emerald/90 transition-all active:scale-95 cursor-pointer text-center min-h-[44px]"
            >
              <Plus className="w-4 h-4 text-brand-gold" />
              <span>+ Add New Creation</span>
            </button>
          </div>
        </div>

        {/* 1. CATEGORY-FIRST SELECTION BAR */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl border border-brand-sand p-4 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-teal">
                Select Category First:
              </span>
            </div>

            {/* Keyword Search Field */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-brand-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or slug..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full border border-brand-sand bg-brand-sand/40 text-xs text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-emerald/20"
              />
            </div>
          </div>

          {/* Interactive Category Pill Deck */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {DYNAMIC_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = getCategoryCount(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? "bg-brand-emerald text-white shadow-md ring-2 ring-brand-emerald/30 scale-[1.02]"
                      : "bg-brand-sand/80 text-brand-charcoal hover:bg-brand-sand hover:text-brand-emerald"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? "bg-brand-gold text-brand-emerald"
                        : "bg-white/80 text-brand-charcoal/70"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. PRODUCT TABLE WITH INLINE PRICE PENCIL & DELETE PROVISION */}
        <div className="bg-white rounded-3xl border border-brand-sand shadow-soft overflow-visible">
          <div className="p-4 bg-brand-sand/40 border-b border-brand-sand flex items-center justify-between">
            <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
              Showing {filteredProducts.length} Creations in &ldquo;{selectedCategory}&rdquo;
            </span>
            <span className="text-[11px] text-brand-charcoal/60">
              💡 Tip: Click the pencil icon against any price to edit inline. Click any badge pill to change marketing tags.
            </span>
          </div>

          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-sand/60 text-brand-charcoal uppercase font-bold tracking-wider text-[10px] border-b border-brand-sand">
                <tr>
                  <th className="p-4">Item &amp; Title</th>
                  <th className="p-4">Category (Click to Change)</th>
                  <th className="p-4">Merchandising Badge (1-Click)</th>
                  <th className="p-4">Price (Click ✎ to Edit)</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-sand/60">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-brand-charcoal/60">
                      No products found matching &ldquo;{selectedCategory}&rdquo;. Click &ldquo;+ Add New Creation&rdquo; to add one!
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => {
                    const isInlineEditing = inlineEditId === prod.id;
                    const badgeMeta = getBadgeMeta(prod.badge);

                    return (
                      <tr key={prod.id} className="hover:bg-brand-ivory/50 transition-colors">
                        {/* Item Thumbnail & Title */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative group shrink-0">
                              <img
                                src={prod.imageUrl}
                                alt={prod.title}
                                className="w-12 h-12 rounded-xl object-cover bg-brand-sand shrink-0 shadow-xs border border-brand-sand/60"
                              />
                              <button
                                type="button"
                                onClick={() => handleTriggerRowImageUpload(prod.id)}
                                className="absolute inset-0 bg-black/60 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5 cursor-pointer shadow-sm"
                                title="Browse local photo to replace image"
                              >
                                <Camera className="w-3.5 h-3.5 text-brand-gold" />
                                <span className="text-[8px] font-bold tracking-tight">Replace</span>
                              </button>
                            </div>
                            <div>
                              <p className="font-bold text-brand-emerald text-sm font-serif line-clamp-1">
                                {prod.title}
                              </p>
                              <p className="text-slate-400 font-mono text-[10px]">Slug: {prod.slug}</p>
                            </div>
                          </div>
                        </td>

                        {/* INTERACTIVE CATEGORY CELL (1-CLICK REASSIGNMENT POPOVER) */}
                        <td className="p-4 relative">
                          <div className="relative inline-block">
                            <button
                              type="button"
                              onClick={() =>
                                setCategoryPopoverProductId(
                                  categoryPopoverProductId === prod.id ? null : prod.id
                                )
                              }
                              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border border-brand-sand bg-white text-brand-emerald shadow-2xs hover:border-brand-emerald hover:bg-brand-sand/50 transition-all hover:scale-105 active:scale-95"
                              title="Click to reassign product category"
                            >
                              <span>{getCategoryIcon(prod.category)}</span>
                              <span>{getCategoryLabel(prod.category)}</span>
                              <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </button>

                            {/* Floating Category Reassignment Popover */}
                            {categoryPopoverProductId === prod.id && (
                              <div
                                ref={categoryPopoverRef}
                                className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-brand-sand shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95 duration-150"
                              >
                                <div className="px-3 py-1.5 border-b border-brand-sand/60 mb-1 flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-teal">
                                    Reassign Category:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setCategoryPopoverProductId(null)}
                                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-brand-sand/40"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>

                                <div className="space-y-1">
                                  {categories.map((opt) => {
                                    const isCurrent = prod.category === opt.id;
                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => handleUpdateCategory(prod.id, opt.id)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs transition-all ${
                                          isCurrent
                                            ? "bg-brand-emerald text-white font-bold shadow-xs"
                                            : "text-brand-charcoal hover:bg-brand-sand/50 font-medium"
                                        }`}
                                      >
                                        <span className="text-sm shrink-0">{opt.icon || "✨"}</span>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-bold text-xs truncate leading-tight">
                                            {opt.label}
                                          </p>
                                          <p
                                            className={`text-[10px] truncate leading-tight ${
                                              isCurrent ? "text-white/80" : "text-slate-400"
                                            }`}
                                          >
                                            {opt.description || opt.id}
                                          </p>
                                        </div>
                                        {isCurrent && (
                                          <Check className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* INTERACTIVE MERCHANDISING BADGE CELL (1-CLICK POPOVER) */}
                        <td className="p-4 relative">
                          <div className="relative inline-block">
                            <button
                              type="button"
                              onClick={() =>
                                setBadgePopoverProductId(
                                  badgePopoverProductId === prod.id ? null : prod.id
                                )
                              }
                              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all shadow-2xs hover:scale-105 active:scale-95 ${
                                badgeMeta
                                  ? `${badgeMeta.colorClass} shadow-xs`
                                  : "border-dashed border-slate-300 text-slate-500 bg-white hover:border-brand-emerald hover:text-brand-emerald"
                              }`}
                              title="Click to change marketing badge"
                            >
                              {badgeMeta ? (
                                <>
                                  {badgeMeta.icon}
                                  <span>{badgeMeta.label}</span>
                                </>
                              ) : (
                                <>
                                  <Tag className="w-3 h-3 text-slate-400 group-hover:text-brand-emerald" />
                                  <span>+ Add Badge</span>
                                </>
                              )}
                              <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                            </button>

                            {/* Floating Badge Popover Palette */}
                            {badgePopoverProductId === prod.id && (
                              <div
                                ref={badgePopoverRef}
                                className="absolute left-0 top-full mt-2 w-56 bg-brand-ivory rounded-2xl shadow-2xl border border-brand-sand p-2 z-50 animate-in fade-in zoom-in-95"
                              >
                                <div className="px-3 py-2 border-b border-brand-sand/60 mb-1 flex items-center justify-between">
                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block">
                                      Assign Badge
                                    </span>
                                    <span className="text-[11px] font-bold text-brand-emerald font-serif">
                                      {prod.title.split(" ")[0]} {prod.title.split(" ")[1]}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setBadgePopoverProductId(null)}
                                    className="p-1 rounded-full hover:bg-brand-sand text-brand-charcoal/60"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="space-y-1">
                                  {BADGE_OPTIONS.map((opt) => {
                                    const isCurrent =
                                      (opt.id === "NONE" && !prod.badge) ||
                                      prod.badge === opt.id;

                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => handleUpdateBadge(prod.id, opt.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                                          isCurrent
                                            ? "bg-brand-emerald text-white shadow-xs font-bold"
                                            : "hover:bg-brand-sand/80 text-brand-charcoal"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm">{opt.icon}</span>
                                          <div>
                                            <p className="text-xs font-bold leading-tight">
                                              {opt.label}
                                            </p>
                                            <p
                                              className={`text-[9px] ${
                                                isCurrent
                                                  ? "text-yellow-200"
                                                  : "text-brand-charcoal/60"
                                              }`}
                                            >
                                              {opt.desc}
                                            </p>
                                          </div>
                                        </div>
                                        {isCurrent && (
                                          <Check className="w-3.5 h-3.5 text-brand-gold shrink-0 ml-2" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* INTERACTIVE PRICE COLUMN (PEN EDITABLE ONLY) */}
                        <td className="p-4">
                          {isInlineEditing ? (
                            <div className="flex items-center gap-1.5 animate-in fade-in">
                              <span className="text-sm font-bold text-brand-emerald">₹</span>
                              <input
                                type="number"
                                autoFocus
                                value={inlinePriceVal}
                                onChange={(e) => setInlinePriceVal(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveInlineEdit(prod.id);
                                  if (e.key === "Escape") setInlineEditId(null);
                                }}
                                className="w-24 px-2 py-1 rounded-lg border-2 border-brand-emerald bg-white text-brand-emerald font-bold text-sm focus:outline-none shadow-xs"
                              />
                              <button
                                onClick={() => handleSaveInlineEdit(prod.id)}
                                className="p-1 rounded-lg bg-brand-emerald text-white hover:bg-brand-emerald/90"
                                title="Save Price (Enter)"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setInlineEditId(null)}
                                className="p-1 rounded-lg bg-brand-sand text-brand-charcoal hover:bg-slate-200"
                                title="Cancel (Esc)"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => handleStartInlineEdit(prod)}
                              className="group inline-flex items-center gap-2 cursor-pointer p-1.5 -m-1 rounded-xl hover:bg-brand-sand/70 transition-colors border border-transparent hover:border-brand-sand"
                              title="Click pencil to edit price"
                            >
                              <span className="font-bold font-serif text-brand-emerald text-base">
                                ₹{prod.basePrice.toLocaleString("en-IN")}
                              </span>
                              <div className="p-1 rounded-md bg-brand-sand text-brand-charcoal/70 group-hover:bg-brand-emerald group-hover:text-white transition-colors">
                                <Edit3 className="w-3 h-3" />
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Actions: Preview Studio & Delete Provision */}
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            {/* 2D Studio Preview */}
                            <Link
                              href={`/customize/${prod.slug}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-brand-sand bg-white hover:bg-brand-sand text-brand-charcoal text-[11px] font-bold transition-all shadow-2xs"
                              title="Preview 2D Studio"
                            >
                              <Eye className="w-3 h-3 text-brand-gold" />
                              <span>Studio</span>
                            </Link>

                            {/* Provision to Delete Any CMS Entry */}
                            <button
                              onClick={() => setDeleteCandidate(prod)}
                              className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors border border-transparent hover:border-red-200"
                              title={`Delete ${prod.title}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 3. ADD NEW PRODUCT CREATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-lg bg-brand-ivory rounded-3xl border border-brand-sand shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-brand-sand bg-white/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-emerald to-brand-gold flex items-center justify-center text-white shadow-xs">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-brand-emerald leading-tight">
                    Add New Resin Creation to CMS
                  </h3>
                  <p className="text-[11px] text-brand-charcoal/70">
                    Immediately publishes to all shoppers on the Collections page.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-sand text-brand-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProduct} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Royal Ocean Geode Clock or Lotus Coaster Set"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-sand bg-white text-brand-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                  Subtitle / Aesthetic Tagline
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Hand-poured emerald geode resin with raw chalcedony crystals"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-sand bg-white text-brand-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-sand bg-white text-brand-charcoal text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon || "✨"} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                    Base Price (INR ₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-serif font-bold text-brand-emerald">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newBasePrice}
                      onChange={(e) => setNewBasePrice(parseInt(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-brand-sand bg-white text-brand-charcoal text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                    Compare-At Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-serif font-bold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={newComparePrice}
                      onChange={(e) => setNewComparePrice(parseInt(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-brand-sand bg-white text-slate-600 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider">
                    Creation Image *
                  </label>
                  {/* Mode switcher tabs */}
                  <div className="flex items-center gap-1 bg-brand-sand/60 p-0.5 rounded-lg border border-brand-sand">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode("LOCAL")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        imageSourceMode === "LOCAL"
                          ? "bg-white text-brand-emerald shadow-xs"
                          : "text-brand-charcoal/70 hover:text-brand-charcoal"
                      }`}
                    >
                      <FolderOpen className="w-3 h-3 text-brand-gold" />
                      <span>Browse Local Disk</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode("PRESET")}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                        imageSourceMode === "PRESET"
                          ? "bg-white text-brand-emerald shadow-xs"
                          : "text-brand-charcoal/70 hover:text-brand-charcoal"
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-brand-gold" />
                      <span>Presets / URL</span>
                    </button>
                  </div>
                </div>

                {/* Hidden File Input for Add Modal */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleAddModalFileUpload(e.target.files[0]);
                      e.target.value = "";
                    }
                  }}
                />

                {isOptimizingImage && (
                  <div className="p-3 bg-brand-sand/30 rounded-xl border border-brand-sand flex items-center justify-center gap-2 text-xs font-bold text-brand-emerald">
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-gold" />
                    <span>Optimizing high-resolution resin image for retina display...</span>
                  </div>
                )}

                {imageSourceMode === "LOCAL" ? (
                  <div>
                    {uploadedImageName ? (
                      /* Uploaded Image Preview & Metadata Card */
                      <div className="p-3 bg-white rounded-2xl border-2 border-brand-emerald/30 flex items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={newImageUrl}
                            alt="Uploaded preview"
                            className="w-14 h-14 rounded-xl object-cover bg-brand-sand border border-brand-sand shrink-0 shadow-xs"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                                Ready to Publish
                              </span>
                              {uploadedImageSize && (
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {uploadedImageSize}
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-brand-emerald truncate max-w-[200px] sm:max-w-[260px]">
                              {uploadedImageName}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Client-side canvas retina optimized
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-xl border border-brand-sand bg-brand-sand/30 hover:bg-brand-sand text-[11px] font-bold text-brand-charcoal transition-all"
                          >
                            Change File
                          </button>
                          <button
                            type="button"
                            onClick={handleClearUploadedImage}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Drag-and-drop & Browse Dropzone */
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                          isDragging
                            ? "border-brand-emerald bg-brand-emerald/10 scale-[1.01]"
                            : "border-brand-sand hover:border-brand-emerald/60 bg-white/70 hover:bg-brand-sand/30"
                        }`}
                      >
                        <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-brand-sand/60 flex items-center justify-center text-brand-emerald group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-6 h-6 text-brand-gold" />
                        </div>
                        <p className="text-xs font-bold text-brand-emerald">
                          Click to browse image from your computer
                        </p>
                        <p className="text-[11px] text-brand-charcoal/60 mt-0.5">
                          or drag and drop your artisan resin photo here
                        </p>
                        <p className="text-[9px] text-slate-400 mt-2 font-mono uppercase tracking-wider">
                          PNG, JPG, JPEG, WEBP, AVIF (Auto-resized for Retina)
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Presets & URL Mode */
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNewImageUrl(preset.url);
                            setUploadedImageName(null);
                            setUploadedImageSize(null);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border transition-all ${
                            newImageUrl === preset.url && !uploadedImageName
                              ? "bg-brand-emerald text-white border-brand-emerald shadow-xs"
                              : "bg-white text-brand-charcoal border-brand-sand hover:bg-brand-sand"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src={newImageUrl}
                        alt="Preset preview"
                        className="w-10 h-10 rounded-xl object-cover bg-brand-sand border border-brand-sand shrink-0 shadow-2xs"
                      />
                      <input
                        type="url"
                        required
                        value={newImageUrl}
                        onChange={(e) => {
                          setNewImageUrl(e.target.value);
                          setUploadedImageName(null);
                          setUploadedImageSize(null);
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-brand-sand bg-white text-brand-charcoal text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-brand-sand/40 rounded-xl border border-brand-sand">
                <div>
                  <span className="text-xs font-bold text-brand-emerald block">
                    Customizable Product
                  </span>
                  <span className="text-[10px] text-brand-charcoal/60">
                    Enables 2D interactive customizer studio for customers
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={newIsCustomizable}
                  onChange={(e) => setNewIsCustomizable(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-emerald focus:ring-brand-emerald"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-teal uppercase tracking-wider mb-1">
                  Initial Merchandising Badge
                </label>
                <select
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value as BadgeOptionId)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-sand bg-white text-brand-charcoal text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-emerald/30"
                >
                  <option value="NEW_ARRIVAL">✨ New Arrival (Recommended)</option>
                  <option value="BESTSELLER">🔥 Bestseller</option>
                  <option value="MASTERPIECE">👑 Masterpiece</option>
                  <option value="FESTIVE_SPECIAL">🪔 Festive Special</option>
                  <option value="LIMITED_EDITION">⏳ Limited Edition</option>
                  <option value="NONE">✕ No Badge</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 border-t border-brand-sand">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-brand-sand text-xs font-bold text-brand-charcoal hover:bg-brand-sand text-center min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-emerald text-white text-xs font-bold hover:bg-brand-emerald/90 shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <Plus className="w-4 h-4 text-brand-gold" />
                  <span>Publish Creation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. PROVISION TO DELETE ANY CMS ENTRY (CONFIRMATION MODAL) */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-md bg-brand-ivory rounded-3xl border border-brand-sand shadow-2xl overflow-hidden p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-brand-emerald leading-tight">
                  Delete Product Listing?
                </h3>
                <p className="text-xs text-brand-charcoal/70">
                  This action removes the creation from CMS and the customer-facing Collections catalog.
                </p>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-brand-sand flex items-center gap-3">
              <img
                src={deleteCandidate.imageUrl}
                alt={deleteCandidate.title}
                className="w-12 h-12 rounded-xl object-cover bg-brand-sand"
              />
              <div>
                <p className="text-xs font-bold text-brand-emerald line-clamp-1">
                  {deleteCandidate.title}
                </p>
                <p className="text-[11px] text-slate-500 font-mono">
                  Base Price: ₹{deleteCandidate.basePrice.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-full border border-brand-sand text-xs font-bold text-brand-charcoal hover:bg-brand-sand"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-full bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Creation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Oversized File (> 5 MB) Permission & Compression Modal */}
      {oversizedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-brand-sand max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-brand-emerald">
                    Image Exceeds 5 MB Limit
                  </h3>
                </div>
                <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                  The selected photo is larger than the catalog CMS upper limit of 5.00 MB.
                </p>
              </div>
            </div>

            {/* File Details Comparison Card */}
            <div className="p-4 bg-brand-sand/30 rounded-2xl border border-brand-sand/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-charcoal/60 font-medium">Selected File:</span>
                <span className="font-bold text-brand-emerald truncate max-w-[200px]" title={oversizedFile.file.name}>
                  {oversizedFile.file.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-charcoal/60 font-medium">Original File Size:</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold font-mono text-[11px]">
                  {oversizedFile.originalSizeMb} MB
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-charcoal/60 font-medium">Upper Allowed Limit:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-[11px]">
                  5.00 MB
                </span>
              </div>
            </div>

            <p className="text-xs text-brand-charcoal/80 leading-relaxed font-sans">
              Would you like to automatically reduce and optimize this image to meet the <strong>5 MB upper limit</strong>? High retina resolution and visual clarity will be preserved.
            </p>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-sand/60">
              <button
                type="button"
                onClick={handleCancelCompression}
                disabled={isCompressingOversized}
                className="px-4 py-2.5 rounded-full border border-brand-sand text-xs font-bold text-brand-charcoal hover:bg-brand-sand/40 transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmCompression}
                disabled={isCompressingOversized}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-emerald text-white hover:bg-brand-teal text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isCompressingOversized ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-gold" />
                    <span>Compressing &amp; Uploading...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-brand-gold" />
                    <span>Compress &amp; Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-emerald text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-brand-gold/40 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Quick Table Row Image Replacement */}
      <input
        ref={rowFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleRowFileSelected(e.target.files[0]);
            e.target.value = "";
          }
        }}
      />

      <Footer />
    </div>
  );
}
