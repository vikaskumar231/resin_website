import { NextRequest, NextResponse } from "next/server";
import { categoryRepository } from "@/lib/repositories/categoryRepository";
import { productRepository } from "@/lib/repositories/productRepository";
import { verifyAdminSession } from "@/lib/auth/adminGuard";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.isAuthorized) {
      return auth.errorResponse!;
    }

    const { id } = params;
    const body = await req.json();

    const updated = await categoryRepository.update(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Category '${id}' not found.` },
        { status: 404 }
      );
    }

    const products = await productRepository.getAll();
    const count = products.filter((p) => p.category?.toUpperCase() === updated.id.toUpperCase()).length;

    return NextResponse.json({
      success: true,
      category: {
        ...updated,
        productCount: count,
      },
    });
  } catch (error: any) {
    console.error("[PATCH /api/categories/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = await verifyAdminSession(req);
    if (!auth.isAuthorized) {
      return auth.errorResponse!;
    }

    const { id } = params;
    const cleanId = id.toUpperCase();

    // Guard: Prevent deletion of core default categories if desired, or check for products assigned
    const products = await productRepository.getAll();
    const productsInCategory = products.filter((p) => p.category?.toUpperCase() === cleanId);

    if (productsInCategory.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category '${cleanId}' because ${productsInCategory.length} active creation(s) are currently assigned to it. Please reassign or delete the products first.`,
        },
        { status: 400 }
      );
    }

    const deleted = await categoryRepository.delete(cleanId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Category '${cleanId}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Category '${cleanId}' deleted successfully.`,
    });
  } catch (error: any) {
    console.error("[DELETE /api/categories/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}

