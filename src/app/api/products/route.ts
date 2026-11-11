import { NextResponse } from "next/server";
import { productRepository } from "@/lib/repositories/productRepository";

// GET /api/products - Public Catalog Retrieval (Accessible by customers, storefront, and customizer)
export async function GET() {
  try {
    const products = await productRepository.getAll();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("[API GET /api/products] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve catalog products" },
      { status: 500 }
    );
  }
}

