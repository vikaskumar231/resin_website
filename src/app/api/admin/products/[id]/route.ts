import { NextRequest, NextResponse } from "next/server";
import { productRepository } from "@/lib/repositories/productRepository";
import { verifyAdminSession } from "@/lib/auth/adminGuard";

interface RouteParams {
  params: {
    id: string;
  };
}

// PATCH /api/admin/products/[id] - Update product on disk/database (Admin Protected)
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.isAuthorized) {
      return auth.errorResponse!;
    }

    const id = params.id;
    const body = await req.json();

    if (body.basePrice !== undefined) {
      const basePrice = parseFloat(body.basePrice);
      if (isNaN(basePrice) || basePrice <= 0) {
        return NextResponse.json(
          { success: false, error: "Base price must be a valid positive number" },
          { status: 400 }
        );
      }
      body.basePrice = basePrice;
    }

    if (body.title && typeof body.title === "string") {
      body.title = body.title.replace(/[<>]/g, "").trim();
    }

    const updated = await productRepository.update(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Product with ID '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error(`[API PATCH /api/admin/products/${params.id}] Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product from disk/database (Admin Protected)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.isAuthorized) {
      return auth.errorResponse!;
    }

    const id = params.id;
    const deleted = await productRepository.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Product with ID '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: `Product '${id}' deleted` });
  } catch (error: any) {
    console.error(`[API DELETE /api/admin/products/${params.id}] Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
