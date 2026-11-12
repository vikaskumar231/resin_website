import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { productRepository } from "@/lib/repositories/productRepository";
import { HERO_PRODUCTS } from "@/lib/mockData";
import { sanitizeLaserText } from "@/lib/sanitizer";
import { evaluateCoupon } from "@/lib/discounts/couponEngine";
import { orderRepository } from "@/lib/repositories/orderRepository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      items,
      shippingAddress,
      billingAddress,
      isBillingSameAsShipping,
      paymentMethod,
      isGift,
      giftMessage,
      couponCode,
      customerPhone,
      customerEmail,
      neededByDate,
      neededByReason,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.pincode || !customerPhone) {
      return NextResponse.json({ error: "Missing required shipping details" }, { status: 400 });
    }

    // Input Validation & Sanitization: Phone format (E.164 / 10-digit standard)
    const rawPhone = (customerPhone || "").trim();
    const cleanPhone = rawPhone.replace(/[\s\-()]/g, "");
    if (!/^\+?[0-9]{10,14}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Input Validation: Indian PIN code (6 digits)
    const cleanPincode = (shippingAddress.pincode || "").trim();
    if (!/^\d{6}$/.test(cleanPincode)) {
      return NextResponse.json(
        { error: "Please enter a valid 6-digit Indian postal PIN code." },
        { status: 400 }
      );
    }

    // Sanitize address and gift message against stored HTML/script tags
    shippingAddress.fullName = (shippingAddress.fullName || "").replace(/[<>]/g, "").trim().substring(0, 100);
    if (shippingAddress.addressLine1) {
      shippingAddress.addressLine1 = shippingAddress.addressLine1.replace(/[<>]/g, "").trim().substring(0, 200);
    }
    const cleanGiftMessage = giftMessage ? giftMessage.replace(/[<>]/g, "").trim().substring(0, 300) : "";

    // 1. Zero-Trust Server-Side Price Verification & Sanitization
    let subtotal = 0;
    const verifiedOrderItems = [];

    for (const item of items) {
      // Enforce reasonable upper bound on line item quantity (prevent DoS & math overflow)
      const qty = Math.min(50, Math.max(1, parseInt(item.quantity) || 1));

      // Verify product existence in catalog repository
      let product =
        (await productRepository.getById(item.productId)) ||
        (await productRepository.getBySlug(item.productSlug || item.productId));

      if (!product) {
        product = HERO_PRODUCTS.find((p) => p.id === item.productId || p.slug === item.productSlug) || null;
      }

      if (!product) {
        return NextResponse.json(
          { error: `Product '${item.title || item.productId}' is invalid or no longer available.` },
          { status: 400 }
        );
      }

      // Compute deterministic price server-side (Base Price + Surcharges)
      let verifiedUnitPrice = product.basePrice;
      const details = item.customizationDetails;

      if (details) {
        // Sanitize laser text and recipient names
        if (details.typography) {
          if (details.typography.line1) {
            details.typography.line1 = sanitizeLaserText(details.typography.line1).sanitized;
          }
          if (details.typography.line2) {
            details.typography.line2 = sanitizeLaserText(details.typography.line2).sanitized;
          }
        }
        if (details.personalizedName) {
          details.personalizedName = sanitizeLaserText(details.personalizedName).sanitized;
        }
        if (details.engravedText) {
          details.engravedText = sanitizeLaserText(details.engravedText).sanitized;
        }
        if (details.customText) {
          details.customText = sanitizeLaserText(details.customText).sanitized;
        }

        const category = product.category ? product.category.toUpperCase() : "NAMEPLATES";

        if (category === "KEYRINGS" || category === "KEYRING") {
          // Keyring Surcharges (Optional Laser-Engraved Tag)
          if (details.hasEngravedTag) verifiedUnitPrice += 99;
        } else if (category === "BOOKMARKS" || category === "BOOKMARK") {
          // Bookmark Surcharges
          if (details.isPersonalized) verifiedUnitPrice += 49;
        } else if (category === "FESTIVE") {
          // Festive / Toran / Shubh Labh Surcharges
          if (details.crystalBorder === "AMETHYST" || details.crystalBorder === "GOLD_NUGGETS") verifiedUnitPrice += 149;
          if (details.hangingElement === "BRASS_BELLS") verifiedUnitPrice += 199;
          if (details.hangingElement === "PEARL_DROPS") verifiedUnitPrice += 149;
          if (details.hasLedBacklight) verifiedUnitPrice += 399;
          if (details.scriptStyle === "CUSTOM_BLESSING") verifiedUnitPrice += 199;
        } else {
          // Nameplate Surcharges (Streamlined Size & 12V LED Halo Backlight)
          if (details.size === "16x10") verifiedUnitPrice += 500;
          if (details.size === "18x12") verifiedUnitPrice += 900;
          if (details.hasLedBacklight) verifiedUnitPrice += 799;
        }
      }

      // Check for price tampering attempt
      const clientPrice = parseFloat(item.unitPrice);
      if (!isNaN(clientPrice) && Math.abs(clientPrice - verifiedUnitPrice) > 1) {
        console.warn(
          `[Zero-Trust Security Alert] Price Tampering Blocked for product '${product.title}'. Client sent ₹${clientPrice}, Server enforced ₹${verifiedUnitPrice}.`
        );
      }

      subtotal += verifiedUnitPrice * qty;
      verifiedOrderItems.push({
        ...item,
        unitPrice: verifiedUnitPrice,
        title: product.title,
      });
    }

    // 2. Centralized Server Coupon Validation (Enforces minimum order invariants)
    const couponEval = evaluateCoupon(couponCode, subtotal);
    const discount = couponEval.valid ? couponEval.discountAmount : 0;

    // 3. Shipping & Gifting
    const shippingFee = subtotal >= 999 ? 0 : 99;
    const giftWrapFee = isGift ? 99 : 0;
    const grandTotal = Math.max(0, subtotal - discount + shippingFee + giftWrapFee);

    // 4. Offline Payment & Settlement Policy
    // No online payment gateway is invoked. All payments are handled offline directly with the artisan
    // (Cash on Delivery or Direct UPI upon design approval / delivery).
    const isTokenDeposit = false;
    const tokenBookingAmount = 0;
    const remainingTentativeBalance = grandTotal;
    const refundPolicyNotes =
      "Payment will be settled offline directly with the artisan (Cash on Delivery or Direct UPI upon design approval / delivery).";

    // 5. Generate Cryptographically Secure Unpredictable Order Number
    const year = new Date().getFullYear();
    const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    const orderNumber = `ART-${year}-${randomSuffix}`;

    // 6. Persist order directly to disk/database repository with OFFLINE_SETTLEMENT status
    try {
      orderRepository.saveOrder({
        orderNumber,
        userId: body.userId || null,
        customerName: shippingAddress.fullName || "Artisan Patron",
        customerEmail: customerEmail || null,
        customerPhone: cleanPhone,
        grandTotal,
        subtotal,
        discount,
        shippingFee,
        giftWrapFee,
        isTokenDeposit,
        tokenAmountPaid: 0,
        remainingTentativeBalance: grandTotal,
        refundPolicyNotes,
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: cleanPhone,
          street: shippingAddress.addressLine1 || shippingAddress.street || "Delivery Address",
          city: shippingAddress.city || "Pune",
          state: shippingAddress.state || "Maharashtra",
          pincode: cleanPincode,
        },
        items: verifiedOrderItems,
        neededByDate: neededByDate || null,
        neededByReason: neededByReason || null,
        status: "ORDER_CONFIRMED",
        statusLabel: "Stage 1: Laser Cutting & Timber Prep",
        stageIndex: 1,
        paymentDetails: {
          method: "OFFLINE_SETTLEMENT",
          status: "PENDING_OFFLINE",
        },
      });
    } catch (saveErr) {
      console.error("[create-order] Order repository save warning:", saveErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      paymentMethod: "OFFLINE_SETTLEMENT",
      paymentStatus: "PENDING_OFFLINE",
      grandTotal,
      subtotal,
      discount,
      shippingFee,
      giftWrapFee,
      currency: "INR",
      message: "Order placed successfully. Payment will be handled offline directly with the artisan.",
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
