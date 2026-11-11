import { NextRequest, NextResponse } from "next/server";
import { productRepository } from "@/lib/repositories/productRepository";
import { verifyAdminSession } from "@/lib/auth/adminGuard";

// GET /api/admin/products - Retrieve all products from disk/database
export async function GET() {
  try {
    const products = await productRepository.getAll();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("[API GET /api/admin/products] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve products" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create a new product on disk/database (Admin Protected)
export async function POST(req: NextRequest) {
  try {
    // Defense-in-depth: Verify Artisan Admin Cryptographic Session
    const auth = await verifyAdminSession(req);
    if (!auth.isAuthorized) {
      return auth.errorResponse!;
    }

    const body = await req.json();
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Valid product title is required" },
        { status: 400 }
      );
    }

    const basePrice = parseFloat(body.basePrice);
    if (isNaN(basePrice) || basePrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid positive base price is required (e.g. ₹299+)" },
        { status: 400 }
      );
    }

    // Sanitize string inputs against Stored XSS
    const sanitizedTitle = body.title.replace(/[<>]/g, "").trim();
    const sanitizedDesc = (body.description || "").replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").trim();

    const created = await productRepository.create({
      ...body,
      title: sanitizedTitle,
      description: sanitizedDesc,
      basePrice,
    });
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error: any) {
    console.error("[API POST /api/admin/products] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
