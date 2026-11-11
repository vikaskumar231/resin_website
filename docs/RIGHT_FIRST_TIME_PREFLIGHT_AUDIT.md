# Artआलय — "Right First Time" (RFT) Pre-Flight Readiness Audit
## Quality Engineering Gate, Edge-Case Safeguards & Mock Architecture

**Document Version:** 1.0.0  
**Audit Board:**  
- **Winston (System Architect 🏗️)** — Technical Invariants & Mock Architecture  
- **Sofia (Product Owner 🎯)** — Acceptance Gates & Definition of Done  
- **Sally (UX Designer 🎨)** — Mobile Viewport & Font Fallback Safeguards  
- **Mary (Business Analyst 📊)** — Edge Cases, Compliance & Sanitization  
- **John (Product Manager 📋)** — Execution Velocity & Zero-Blocker Strategy  

**Status:** **GO FOR BUILD (100% Cleared)**  

---

## 1. Executive Pre-Flight Verdict: Ready for Build

The cross-functional team has completed the **Right First Time (RFT) Audit**. The product specification, architecture, UX design, and backlog are thoroughly vetted.

To ensure **zero development stalls**, **zero rework**, and a **flawless customer launch**, we have established **4 Critical Pre-Flight Safeguards**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 FOUR "RIGHT-FIRST-TIME" (RFT) SAFEGUARDS                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Dual-Mode Mock Architecture:                                             │
│    Zero dependency on external API approvals (Razorpay KYC, WhatsApp Meta   │
│    templates, Shiprocket AWB). Full local simulation runs on Day 1.         │
│                                                                             │
│ 2. Dynamic Mobile Viewport & Keyboard Isolation (dvh):                      │
│    Prevents soft-keyboard viewport crushing during customizer text input.   │
│                                                                             │
│ 3. Font Character Sanitization & Laser-Cut Validation:                      │
│    Stops unsupported emojis/tofu glyphs; replaces with laser-cut emblems.   │
│                                                                             │
│ 4. Deterministic Seed Data (The Hero 4 Catalog):                            │
│    Pre-populates realistic pricing, swatches, and dimensions on cold-start. │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Safeguard 1: Dual-Mode Mock Provider Architecture

### The Problem It Solves
In real-world D2C projects, developers often get blocked for 7–14 days waiting for third-party merchant approvals (Razorpay live KYC, WhatsApp Cloud API template approval, Shiprocket courier verification).

### The Solution: Pluggable Adapter Pattern (`MOCK_MODE=true`)
Every third-party service is implemented behind an interface with a **Mock Sandbox Provider** by default:

```typescript
// lib/providers/paymentProvider.ts
export interface PaymentProvider {
  createOrder(amountPaise: number, receiptId: string): Promise<{ orderId: string }>;
  verifySignature(orderId: string, paymentId: string, signature: string): boolean;
}

// In development, MockPaymentProvider simulates instant UPI success/failure.
// In production, RazorpayPaymentProvider uses live credentials automatically.
```

* **Mock Payment Gateway:** Simulates mobile UPI Intent (PhonePe/GPay) with 1-click `[Simulate Success]` and `[Simulate Failure]` test buttons.
* **Mock WhatsApp Inspector:** A simulated WhatsApp modal inside the `/admin` portal showing the exact interactive card delivered to the customer, allowing testing of `[Approve & Pour]` and `[Request Change]` without real SMS/WhatsApp charges.
* **Mock Courier Logistics:** Generates authentic-looking 4"x6" sample shipping labels and simulates live tracking transit scans.

---

## 3. Safeguard 2: Mobile Viewport & Soft-Keyboard Isolation

### The Problem It Solves
On mobile smartphones, when a customer taps an input field to type their name on a nameplate, the Android/iOS virtual keyboard pops up, shrinking the viewport by 40%–50%. In naive CSS implementations, this pushes the canvas off-screen or collapses layout containers.

### The Engineered Solution:
1. **Dynamic Viewport Units:** Uses CSS `dvh` (Dynamic Viewport Height) instead of `vh`.
2. **Sticky Visual Stage:** The Konva canvas stage is pinned to a fixed aspect ratio container at the top ($50\text{dvh}$), while the lower control drawer dynamically scrolls:
   ```css
   .customizer-container {
     height: 100dvh;
     display: flex;
     flex-direction: column;
     overflow: hidden;
   }
   ```
3. **Scroll-Into-View on Focus:** Input fields trigger `element.scrollIntoView({ behavior: 'smooth', block: 'center' })` on focus so the active input and live canvas reflection stay simultaneously visible.

---

## 4. Safeguard 3: Character Sanitization for Physical Laser-Cutting

### The Problem It Solves
Epoxy resin nameplates use physical 3mm laser-cut mirror acrylic letters. If a customer pastes emojis (e.g. *"The Sharmas 🌸👑"*) or obscure unicode glyphs into the text field, the laser cutter software (CorelDraw / LightBurn) fails or cuts empty rectangle boxes (tofu symbols).

### The Engineered Solution:
1. **Regex Input Sanitizer:** Text inputs restrict characters to supported Latin alphabets (`A–Z, a–z, 0–9, &, -, '`) and Devanagari Unicode ranges (`\u0900-\u097F`).
2. **Dedicated Sacred Emblem Selector:** Instead of pasting raw emojis, shoppers select from a curated library of physical vector emblems:
   - `[🕉️ Lord Ganesha Emblem (+₹199)]`
   - `[卐 Auspicious Swastik (+₹149)]`
   - `[🪷 Sacred Lotus (+₹149)]`
   - `[🧿 Evil Eye Charm (+₹149)]`
3. These emblems render as authentic 3D laser-cut acrylic vector shapes on the canvas and export clean vector paths in the A4 production job sheet (`US-6.3`).

---

## 5. Safeguard 4: Deterministic Seed Data (Hero 4 Lineup)

Cold-starting a blank database leads to broken UI and testing delays. The build will include `prisma/seed.ts` with complete production-grade records:

| Product | Base Substrate | Dimensions | Curated Colorways | Curated Fonts | Starting Price |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Bespoke Nameplate** | Raw Teakwood / Matte Acrylic | 12"x8", 16"x10", 18"x12" | Ocean Wave, Emerald Geode, Ruby Wine, Midnight Black | Royal Serif, Modern Minimal, Rozha Calligraphy | ₹1,899 |
| **Monogram Keyring** | Cast Crystal Resin | 4.5 cm (A–Z) | Gold Flakes, Silver Flakes, Dried Blue Hydrangea, Rose | Bold Geometric Monogram | ₹249 |
| **Floral Bookmark** | Slim 2.5mm Crystal Strip | 14 cm x 2.8 cm | Lavender Dream, Wild Daisy, Emerald Moss, Crimson | Italic Calligraphy, Vintage Roman | ₹299 |
| **Shubh Labh Set** | Pair of 4"/5" Medallions | Circular / Paisley | Royal Crimson, Peacock Blue, Haldi Yellow, Emerald | Traditional Devanagari Calligraphy | ₹599 |

---

## 6. Pre-Flight Verification Sign-Off

The cross-functional board confirms that:
* **All 8 Epics & 40 User Stories** are completely covered.
* **Architecture is decoupled & resilient** with zero license fees and ₹0 fixed monthly operational cost.
* **UX design is tailored for Gen Z mobile ergonomics** with dynamic keyboard safeguards.
* **Mock providers enable 100% development velocity** without external API blockers.

**Verdict:** **ALL GATES PASSED — CLEARED FOR BUILD EXECUTION.**

