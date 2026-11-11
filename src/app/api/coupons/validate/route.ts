import { NextRequest, NextResponse } from "next/server";
import { evaluateCoupon } from "@/lib/discounts/couponEngine";

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json();
    const total = parseFloat(cartTotal) || 0;

    const evaluation = evaluateCoupon(code, total);
    if (!evaluation.valid) {
      return NextResponse.json(
        { error: evaluation.error || "Invalid or expired coupon code" },
        { status: 400 }
      );
    }

    return NextResponse.json(evaluation);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}

