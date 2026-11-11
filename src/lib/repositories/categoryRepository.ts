import fs from "fs";
import path from "path";
import { CategoryItem, INITIAL_CATEGORIES } from "@/types/category";

export type { CategoryItem };
export { INITIAL_CATEGORIES };

export class FileCategoryRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), "src", "data", "categories.json");
    this.ensureFileExists();
  }

  private ensureFileExists(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(INITIAL_CATEGORIES, null, 2), "utf-8");
    } else {
      try {
        const raw = fs.readFileSync(this.filePath, "utf-8").trim();
        if (!raw) {
          fs.writeFileSync(this.filePath, JSON.stringify(INITIAL_CATEGORIES, null, 2), "utf-8");
        }
      } catch {
        fs.writeFileSync(this.filePath, JSON.stringify(INITIAL_CATEGORIES, null, 2), "utf-8");
      }
    }
  }

  private readFromDisk(): CategoryItem[] {
    try {
      this.ensureFileExists();
      const raw = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(raw);
    } catch (err) {
      console.error("[FileCategoryRepository] Error reading categories from disk:", err);
      return INITIAL_CATEGORIES;
    }
  }

  private writeToDisk(categories: CategoryItem[]): void {
    try {
      this.ensureFileExists();
      fs.writeFileSync(this.filePath, JSON.stringify(categories, null, 2), "utf-8");
    } catch (err) {
      console.error("[FileCategoryRepository] Error writing categories to disk:", err);
      throw new Error("Failed to write categories to disk storage.");
    }
  }

  async getAll(): Promise<CategoryItem[]> {
    const list = this.readFromDisk();
    return list.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getById(id: string): Promise<CategoryItem | null> {
    const list = this.readFromDisk();
    const cleanId = id.trim().toUpperCase();
    return list.find((c) => c.id === cleanId) || null;
  }

  async getBySlug(slug: string): Promise<CategoryItem | null> {
    const list = this.readFromDisk();
    const cleanSlug = slug.trim().toLowerCase();
    return list.find((c) => c.slug === cleanSlug) || null;
  }

  async create(data: {
    label: string;
    icon?: string;
    description?: string;
    id?: string;
    slug?: string;
  }): Promise<CategoryItem> {
    const list = this.readFromDisk();

    // Clean label & derive IDs
    const label = data.label.trim();
    if (!label) throw new Error("Category label is required.");

    const generatedId = (
      data.id?.trim() ||
      label
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/(^_|_$)/g, "")
    ).toUpperCase();

    const generatedSlug = (
      data.slug?.trim() ||
      label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    ).toLowerCase();

    // Prevent duplicates
    if (list.some((c) => c.id === generatedId)) {
      throw new Error(`Category code '${generatedId}' already exists.`);
    }

    const nextOrder = list.length > 0 ? Math.max(...list.map((c) => c.displayOrder)) + 1 : 1;

    const newCategory: CategoryItem = {
      id: generatedId,
      slug: generatedSlug,
      label,
      icon: data.icon?.trim() || "✨",
      description: data.description?.trim() || "Handcrafted bespoke resin creations",
      isDefault: false,
      displayOrder: nextOrder,
    };

    list.push(newCategory);
    this.writeToDisk(list);
    return newCategory;
  }

  async update(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem | null> {
    const list = this.readFromDisk();
    const cleanId = id.trim().toUpperCase();
    const index = list.findIndex((c) => c.id === cleanId);
    if (index === -1) return null;

    const existing = list[index];
    const updatedItem: CategoryItem = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable ID
    };

    list[index] = updatedItem;
    this.writeToDisk(list);
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const list = this.readFromDisk();
    const cleanId = id.trim().toUpperCase();
    const filtered = list.filter((c) => c.id !== cleanId);
    if (filtered.length === list.length) return false;

    this.writeToDisk(filtered);
    return true;
  }
}

export const categoryRepository = new FileCategoryRepository();
