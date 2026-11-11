/**
 * Artआलय Centralized Coupon & Promotional Discount Engine
 * 
 * Enforces unified business invariants and minimum cart thresholds across
 * both pre-flight coupon evaluation (/api/coupons/validate) and final
 * checkout order calculation (/api/checkout/create-order).
 */

export interface CouponEvaluation {
  valid: boolean;
  code: string;
  discountType?: "PERCENTAGE" | "FLAT_AMOUNT";
  discountValue?: number;
  discountAmount: number;
  message?: string;
  error?: string;
}

export function evaluateCoupon(
  code: string | undefined | null,
  subtotal: number
): CouponEvaluation {
  const cleanCode = (code || "").trim().toUpperCase();

  if (!cleanCode) {
    return {
      valid: false,
      code: "",
      discountAmount: 0,
      error: "Coupon code is required",
    };
  }

  // Welcome Discount: 10% off on minimum cart order of ₹999
  if (cleanCode === "AALAYFIRST10") {
    if (subtotal < 999) {
      return {
        valid: false,
        code: "AALAYFIRST10",
        discountAmount: 0,
        error: "AALAYFIRST10 requires a minimum order of ₹999",
      };
    }

    const discountAmount = Math.round((subtotal * 10) / 100);
    return {
      valid: true,
      code: "AALAYFIRST10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      discountAmount,
      message: "10% Welcome Discount applied!",
    };
  }

  // Festive Celebration Discount: Flat ₹500 off on minimum cart order of ₹2,999
  if (cleanCode === "FESTIVE500") {
    if (subtotal < 2999) {
      return {
        valid: false,
        code: "FESTIVE500",
        discountAmount: 0,
        error: "FESTIVE500 requires a minimum order of ₹2,999",
      };
    }

    return {
      valid: true,
      code: "FESTIVE500",
      discountType: "FLAT_AMOUNT",
      discountValue: 500,
      discountAmount: 500,
      message: "₹500 Festive Celebration Discount applied!",
    };
  }

  return {
    valid: false,
    code: cleanCode,
    discountAmount: 0,
    error: "Invalid or expired coupon code",
  };
}

