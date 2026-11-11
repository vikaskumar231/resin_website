import fs from "fs";
import path from "path";
import { ProductCatalogItem, HERO_PRODUCTS } from "@/lib/mockData";

export interface ProductRepository {
  getAll(): Promise<ProductCatalogItem[]>;
  getById(id: string): Promise<ProductCatalogItem | null>;
  getBySlug(slug: string): Promise<ProductCatalogItem | null>;
  create(item: Omit<ProductCatalogItem, "id">): Promise<ProductCatalogItem>;
  update(id: string, updates: Partial<ProductCatalogItem>): Promise<ProductCatalogItem | null>;
  delete(id: string): Promise<boolean>;
}

export class FileProductRepository implements ProductRepository {
  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), "src", "data", "products.json");
    this.ensureFileExists();
  }

  private ensureFileExists(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(HERO_PRODUCTS, null, 2), "utf-8");
    } else {
      try {
        const raw = fs.readFileSync(this.filePath, "utf-8").trim();
        if (!raw) {
          fs.writeFileSync(this.filePath, JSON.stringify(HERO_PRODUCTS, null, 2), "utf-8");
        }
      } catch {
        fs.writeFileSync(this.filePath, JSON.stringify(HERO_PRODUCTS, null, 2), "utf-8");
      }
    }
  }

  private readFromDisk(): ProductCatalogItem[] {
    try {
      this.ensureFileExists();
      const raw = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(raw);
    } catch (err) {
      console.error("[FileProductRepository] Error reading products from disk:", err);
      return HERO_PRODUCTS;
    }
  }

  private writeToDisk(products: ProductCatalogItem[]): void {
    try {
      this.ensureFileExists();
      fs.writeFileSync(this.filePath, JSON.stringify(products, null, 2), "utf-8");
    } catch (err) {
      console.error("[FileProductRepository] Error writing products to disk:", err);
      throw new Error("Failed to write products to disk storage.");
    }
  }

  async getAll(): Promise<ProductCatalogItem[]> {
    return this.readFromDisk();
  }

  async getById(id: string): Promise<ProductCatalogItem | null> {
    const list = this.readFromDisk();
    return list.find((p) => p.id === id) || null;
  }

  async getBySlug(slug: string): Promise<ProductCatalogItem | null> {
    const list = this.readFromDisk();
    return list.find((p) => p.slug === slug) || null;
  }

  async create(item: Omit<ProductCatalogItem, "id"> & { id?: string }): Promise<ProductCatalogItem> {
    const list = this.readFromDisk();
    const generatedId =
      item.id ||
      `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
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
      rating: item.rating ?? 5.0,
      reviewCount: item.reviewCount ?? 1,
      tags: item.tags ?? ["Handcrafted", "Resin Art", "Artआलय"],
    };

    const updated = [newProduct, ...list];
    this.writeToDisk(updated);
    return newProduct;
  }

  async update(id: string, updates: Partial<ProductCatalogItem>): Promise<ProductCatalogItem | null> {
    const list = this.readFromDisk();
    const index = list.findIndex((p) => p.id === id || p.slug === id);
    if (index === -1) return null;

    const updatedProduct = {
      ...list[index],
      ...updates,
    };

    list[index] = updatedProduct;
    this.writeToDisk(list);
    return updatedProduct;
  }

  async delete(id: string): Promise<boolean> {
    const list = this.readFromDisk();
    const filtered = list.filter((p) => p.id !== id && p.slug !== id);
    if (filtered.length === list.length) {
      return false;
    }
    this.writeToDisk(filtered);
    return true;
  }
}

// Pluggable Singleton Instance
// When ready to migrate to PostgreSQL, swap this instance to new PostgresProductRepository()
export const productRepository: ProductRepository = new FileProductRepository();

