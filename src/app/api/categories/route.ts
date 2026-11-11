import { NextRequest, NextResponse } from "next/server";
import { categoryRepository } from "@/lib/repositories/categoryRepository";
import { productRepository } from "@/lib/repositories/productRepository";

export async function GET() {
  try {
    const categories = await categoryRepository.getAll();
    const products = await productRepository.getAll();

    // Enrich categories with live product count
    const enriched = categories.map((cat) => {
      const count = products.filter((p) => p.category?.toUpperCase() === cat.id.toUpperCase()).length;
      return {
        ...cat,
        productCount: count,
      };
    });

    return NextResponse.json({
      success: true,
      categories: enriched,
    });
  } catch (error: any) {
    console.error("[GET /api/categories] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { label, icon, description, id, slug } = body;

    if (!label || typeof label !== "string" || !label.trim()) {
      return NextResponse.json(
        { success: false, error: "Category title / label is required." },
        { status: 400 }
      );
    }

    const newCategory = await categoryRepository.create({
      label: label.trim(),
      icon: icon?.trim() || "✨",
      description: description?.trim() || "Handcrafted bespoke creations",
      id: id?.trim(),
      slug: slug?.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        category: {
          ...newCategory,
          productCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/categories] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create category" },
      { status: 400 }
    );
  }
}

