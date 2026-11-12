# Artआलय — Comprehensive Production Requirements Specification (FRS)
## Multi-Agent Backlog Audit & Holistic Release Blueprint

**Document Version:** 3.0.0 (Production Master Gate)  
**Authors:**  
- **Sofia (BMad Product Owner 🎯)** — Scope Governance, Acceptance Criteria & Production Readiness  
- **Mary (BMad Business Analyst 📊)** — Indian Tax Compliance, Customer Journeys & MECE Traceability  
- **Winston (BMad System Architect 🏗️)** — Technical Feasibility, Data Integrity, Edge Cases & Security  
**Product:** **Artआलय** (Handcrafted Resin E-Commerce Platform)  
**Target Market:** India Domestic D2C (INR ₹, UPI via Razorpay, Shiprocket Logistics, WhatsApp Cloud API)  
**Scope Status:** Fully Audited, Multi-Agent Approved for Production Scaffolding  

---

## 1. Multi-Agent Cross-Functional Audit Report

### 1.1 The PO, Architect & Analyst Roundtable

```
┌─────────────────────────────────────────────────────────────────────────────┐
│             BMAD CROSS-FUNCTIONAL PRODUCTION AUDIT ROUNDTABLE               │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🎯 Sofia (PO):                                                              │
│ "We must eliminate all launch blockers: seamless guest checkout to prevent  │
│ cart drop-offs, full order summaries, and transparent cancellation bounds." │
│                                                                             │
│ 📊 Mary (Analyst):                                                          │
│ "Indian GST compliance requires strict tax invoices: HSN 3926/4420 codes,   │
│ State Place of Supply (CGST+SGST vs IGST), and B2B GSTIN input for ITC."    │
│                                                                             │
│ 🏗️ Winston (Architect):                                                     │
│ "Architecture must handle async PDF invoice rendering (@react-pdf), server- │
│ side coupon validation, phone-linked guest order claiming, and webhook     │
│ idempotency for Razorpay and Shiprocket."                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Identified Production Gaps & Solutions Engineered

| Area Audited | Identified Gap in v2.0 | Architectural & Business Solution (v3.0) | User Story Added |
| :--- | :--- | :--- | :--- |
| **Guest Checkout** | Forcing registration before checkout increases mobile drop-off by 35%. | Enable 1-click **Guest Checkout** with phone number; auto-link past guest orders when the user subsequently registers with that phone. | `US-3.6` |
| **Order Summary & Billing** | Gifting orders lacked separate Billing vs. Shipping address handling. | Comprehensive pre-payment Order Summary screen with explicit *"Bill to me, Ship to Recipient"* toggle and GST breakdown. | `US-3.7` |
| **GST Tax Invoices** | Missing legal Indian invoice requirements (HSN codes, CGST/SGST/IGST). | Asynchronous **Automated GST Tax Invoice Generator** producing signed PDF with HSN 3926/4420, QR code, and consumer tax breakdown. | `US-3.8` |
| **Promotions & Coupons** | No mechanism for marketing campaigns, influencer codes, or free shipping. | Server-side **Coupon & Promotional Engine** (percentage/flat discounts, minimum order value, dynamic free shipping threshold ₹999). | `US-3.9` |
| **Cancellations & Refunds** | Custom resin cannot be refunded after pouring; no explicit policy in place. | Policy-enforced **Order Cancellation & Refund Engine**: Instant cancellation allowed before "In Production"; restricted once resin is poured. | `US-3.10` |
| **Social Proof & Reviews** | Customers hesitate to buy handmade resin without seeing real photos. | **Verified Buyer Reviews & Photo Testimonials** module with automatic post-delivery WhatsApp review requests and star ratings. | `US-2.4` |
| **Search & Discovery** | Catalog had filters but lacked keyword search. | **Instant Search & Predictive Auto-Suggest** indexing titles, categories, occasions, and colorways with instant thumbnail previews. | `US-2.5` |
| **Artisan Analytics** | Artisan had Kanban but no financial dashboard. | **Artisan Business Intelligence & Sales Analytics**: Daily revenue, AOV, top-selling colorways, and material depletion projections. | `US-7.6` |

---

### 1.3 Master Functional Hierarchy (8 Core Epics — 40 Production Stories)

```
                                  ┌───────────────────────────────────┐
                                  │    Artआलय PLATFORM ARCHITECTURE   │
                                  └─────────────────┬─────────────────┘
         ┌──────────────────┬───────────────────────┼───────────────────────┬──────────────────┐
         ▼                  ▼                       ▼                       ▼                  ▼
    [EPIC 0: Auth]    [EPIC 1: Customizer]    [EPIC 2: Catalog]       [EPIC 3: Checkout] [EPIC 4: Proof]
    • Phone OTP/Email • Konva 2D Engine       • Mobile-First PDPs     • Guest Checkout   • WhatsApp Loop
    • RBAC Guard      • Layer Stacking        • Disclaimers & Care    • Razorpay UPI     • Skip / Upload
    • Address Book    • 300 DPI Export        • Reviews & Search      • GST Tax Invoice  • 1-Click Signoff
         │                  │                       │                       │                  │
         └──────────────────┼───────────────────────┴───────────────────────┼──────────────────┘
                            ▼                                               ▼
                   [EPIC 5: WhatsApp Consultation]                 [EPIC 6: Workshop]
                   • Direct Date & Price Agreement                 • Drag-and-Drop Kanban
                   • 50% Token Refund Guarantee                    • Batch Pour Volume Calc
                   • Shiprocket Live Scans                         • 1-Click Label Printing
                            │
                            ▼
                   [EPIC 7: Artisan CMS]
                   • Product Creation & Gallery
                   • Masterpiece / Bestseller Badges
                   • Customizer Template Binding
                   • Sales & Inventory Analytics
```

---

## 2. EPIC-0: Identity, Authentication, Role-Based Access & User Profiles

### Epic Description
As a user (customer or artisan admin), I want a secure, frictionless registration and login system with role-based permissions, self-service password recovery, and profile management, so that my account, orders, delivery addresses, and administrative controls are protected and easily accessible.

---

### Story 0.1: Multi-Channel Customer Registration (Phone OTP, Email & Google SSO)
- **ID:** `US-0.1` | **FR Reference:** `FR-AUTH-01`
- **As a:** New customer visiting Artआलय
- **I want to:** Register using either my Indian mobile phone number (via 6-digit SMS OTP), email/password, or 1-tap Google login
- **So that:** I can create an account in under 15 seconds without filling cumbersome forms.

#### Acceptance Criteria (Given / When / Then)
```gherkin
Scenario: Customer registers via Indian Mobile Phone Number
  Given a guest user is on the Artआलय registration modal
  When the user enters a valid 10-digit Indian phone number (e.g., 9876543210)
  Then the system generates a cryptographic 6-digit OTP via Twilio / Fast2SMS
  And the OTP is delivered within 10 seconds with a 60-second expiry timer
  When the user inputs the matching OTP
  Then an account is provisioned with Role = CUSTOMER
  And a secure JWT session cookie is established (HttpOnly, SameSite=Lax).

Scenario: Customer registers with Google OAuth
  Given a user clicks "Continue with Google"
  When Google authentication succeeds
  Then the system checks if the email already exists
  And if not, creates a new CUSTOMER profile populating name and avatar URL.
```

- **AC 0.1.3 (Prominent Global Header Visibility):**
  - The sticky global navigation header (`Navbar.tsx`) must feature clearly visible, high-contrast, dedicated Call-to-Action buttons for both **"Sign In"** and **"Register"** on desktop and mobile viewports.
  - Clicking either CTA opens the unified `AuthModal` with the corresponding tab pre-selected, or navigates to `/login`.
  - When a user is authenticated, the header transforms dynamically:
    - Standard Customer: Displays user's first name, avatar initial, and account dropdown with "Sign Out".
    - Artisan Administrator (`ARTISAN_ADMIN`): Displays a prominent emerald-and-gold **"👑 Artisan Admin"** pill with quick-access links to `/admin/categories` (Categories CMS) and `/admin/products` (Catalog CMS) (Workshop Kanban, Resin Inventory, and Job Sheets are tracked offline by the artist).

---

### Story 0.2: Unified Login, Pre-Configured Admin User & RBAC Middleware
- **ID:** `US-0.2` | **FR Reference:** `FR-AUTH-02`
- **As a:** Platform administrator & prospective artisan reviewer
- **I want:** Unified login credentials and a pre-configured dummy admin account (`Vikas` / `Vikas`) to route users dynamically to either the Customer Account Hub or the Artisan Admin Portal based on their assigned role (`CUSTOMER`, `ARTISAN_ADMIN`, `WORKSHOP_MAKER`)
- **So that:** Administrative routes (`/admin/*`) are completely accessible to authorized artisans and reviewers while shielded from unauthorized public access.

#### Acceptance Criteria
- **AC 0.2.1:** Next.js Edge Middleware inspects the session role on every request to `/admin/*`.
- **AC 0.2.2:** If an unauthenticated user or `CUSTOMER` attempts to navigate to `/admin/*`, they are redirected to `/login?error=unauthorized` with HTTP 403 or prompted to log in as an administrator.
- **AC 0.2.3:** **Pre-Configured Admin Demo Account (`Vikas` / `Vikas`):**
  - Username: `Vikas` (case-insensitive identifier: `vikas` or `Vikas`)
  - Password: `Vikas`
  - Name: `Vikas Kumar (Master Artisan)`
  - Role: `ARTISAN_ADMIN`
  - Logging in with these credentials immediately unlocks all Admin Studio screens (`/admin/categories`, `/admin/products`), sets the `art_aalay_role=ARTISAN_ADMIN` cookie, and reveals the Artisan Admin workspace pill in the global header (Workshop Kanban, Resin Inventory, and Job Sheet links removed as they are tracked offline by the artist).
- **AC 0.2.4:** **Zero Public Admin Visibility & Dynamic Role Assignment:** All public customer interfaces, including `AuthModal` and `/login`, must present a clean, standard authentication form without any visible admin bypass cards, pre-filled demo credentials, or one-click access buttons. The `ARTISAN_ADMIN` role is determined dynamically by the system solely upon authenticated login with valid administrator credentials.
- **AC 0.2.5:** Session tokens persist across browser refreshes via `useAuthStore` localStorage and cookie sync; remember-me toggle supported.
- **AC 0.2.6 (Production Security Hardening Gate):**
  - In production mode, `/admin/*` and administrative REST APIs (`/api/admin/*`) strictly reject requests lacking a cryptographically signed, HttpOnly session cookie confirming `role === 'ARTISAN_ADMIN'`.
  - Client-side role spoofing (via `document.cookie` or localStorage) is rejected by Edge Middleware.
  - Development mock credentials (`Vikas` / `Vikas`) are disabled in production in favor of database-persisted bcrypt hashed credentials.

---

### Story 0.3: Password Lifecycle Management & Self-Service Recovery
- **ID:** `US-0.3` | **FR Reference:** `FR-AUTH-03`
- **As an:** Account holder who forgot their password
- **I want to:** Request a secure password reset link via email or receive a one-time verification OTP on my registered phone number
- **So that:** I can regain access to my account without contacting customer support.

#### Acceptance Criteria
- **AC 0.3.1:** Password input fields enforce security policy: Minimum 8 characters, at least 1 uppercase letter, 1 number, and 1 special symbol. Passwords stored using `bcrypt` (salt rounds: 12).
- **AC 0.3.2:** "Forgot Password" sends a single-use signed reset token valid for exactly 15 minutes.
- **AC 0.3.3:** Reset link expires immediately upon first successful password change.
- **AC 0.3.4:** Rate limiting enforced: Max 3 reset requests per phone number / email per hour to prevent SMS/email bombing.

---

### Story 0.4: Customer Account Hub (Address Book, Orders & Tax Invoices)
- **ID:** `US-0.4` | **FR Reference:** `FR-AUTH-04`
- **As a:** Logged-in customer
- **I want to:** Manage multiple saved delivery addresses (Home, Office, Parents), view past orders with live status badges, and download official PDF GST invoices
- **So that:** Reordering is instant and I have formal records of my purchases.

#### Acceptance Criteria
- **AC 0.4.1:** Address book allows adding, editing, and deleting addresses with fields: Full Name, 10-digit Phone, Street Address, Landmark, City, State, and 6-digit PIN code.
- **AC 0.4.2:** PIN code field auto-populates City and State using the Postal Pincode Directory API.
- **AC 0.4.3:** Order history page (`/account/orders`) lists past orders with: Order Number (e.g. `ART-2026-1049`), Date, Thumbnail, Total Amount, Customization summary, and Status Pill (`Proof Pending`, `Stage 4: Slow Dust-Free Resin Curing`, `Delivered`).
- **AC 0.4.4:** Each completed order provides a `[📄 View GST Tax Invoice]` button generating an official PDF with Artआलय's GSTIN and state tax breakup (CGST/SGST/IGST).
- **AC 0.4.5 (Interactive Customer Header Dropdown):** Clicking the logged-in customer pill in the Navbar reveals a dropdown with "My Orders" (`/account/orders`), direct live tracking links, and "Sign Out".
- **AC 0.4.6 (Universal Track Order Modal & Navigation):** The Navbar provides a visible "Track Order" trigger opening a fast Order # lookup modal allowing both authenticated and guest shoppers to input their order reference and jump straight to their live 6-stage curing radar.

---

### Story 0.5: Artisan/Admin Profile & Workshop Configuration Suite
- **ID:** `US-0.5` | **FR Reference:** `FR-AUTH-05`
- **As an:** Artisan store administrator
- **I want to:** Configure workshop business details (Studio Name, Pickup Address, GSTIN, Support WhatsApp Number) and toggle automated notification preferences
- **So that:** System-generated invoices, shipping labels, and WhatsApp notifications carry authentic workshop branding and operational details.

#### Acceptance Criteria
- **AC 0.5.1:** Admin Settings page allows updating: Studio Physical Address (used as Shiprocket default origin pickup point), Official GSTIN number, and WhatsApp Business Account credentials.
- **AC 0.5.2:** Toggles for system events: Enable/Disable WhatsApp order alerts, Enable/Disable COD payment mode across the site.
- **AC 0.5.3:** Ability to invite assistant workshop staff with restricted roles (e.g. `WORKSHOP_MAKER` role can view Kanban and print job sheets, but cannot modify pricing or bank payout settings).

---

## 3. EPIC-1: Interactive 2D Product Customizer Engine (Konva.js & Polymorphic Studios)

### Epic Description
As a shopper on Artआलय, I want product-specific, interactive, responsive 2D visual customizers tailored to each unique craft category (Bespoke Nameplates, Crystal Monogram Keyrings, Pressed Botanical Bookmarks, and Auspicious Festive Decor), so that I can see the exact physical form, dimensions, materials, colors, fonts, and inclusions of my chosen piece before purchasing.

---

### Story 1.1: Product-Specific Polymorphic Customizer Router & Base Substrates
- **ID:** `US-1.1` | **FR Reference:** `FR-CUST-01`
- **As a:** Customer navigating to `/customize/[slug]`
- **I want:** The customizer studio to automatically adapt its 2D canvas stage, aspect ratio, and control drawer to match the specific product being customized (Nameplate vs. Keyring vs. Bookmark)
- **So that:** A keyring renders as a 3D monogram letter with key loop hardware, a bookmark renders as a slim vertical botanical strip with a silk tassel, and a nameplate renders as a grand timber plank.

#### Acceptance Criteria
- **AC 1.1.1:** The route `/customize/[slug]` inspects the active product category (retrieved reactively from `useProductStore` with `HERO_PRODUCTS` fallback) and renders the appropriate category-specific customizer studio:
  - `NAMEPLATES`: 16:10 landscape stage, carefully sourced quality base (durable foundation curated by the artist for lasting resin adhesion; customer cannot choose substrate materials), multi-line typography, sacred emblems, LED backlighting.
  - `KEYRINGS`: 1:1 square stage, crystal-clear 3D initial letter, metal key loop and chain, attached charms, and optional personalized mini tag.
  - `BOOKMARKS`: 4:10 portrait slim stage (standard 5.5"x1.2" format), pressed Himalayan flora, floating metallic foil flecks, top hole with looped silk tassel, and optional laser-etched quote.
  - `FESTIVE` (Toran/Shubh Labh): Dual geode disc / hanging toran stage, authentic emerald/crimson/gold geode layers, raw crystal quartz borders, 3D gold Devanagari calligraphy ("शुभ", "लाभ", "सुस्वागतम्", or custom blessing), and hanging brass temple bells / marigold tassels.
- **AC 1.1.2:** Dynamic product resolution ensures products added or re-categorized in Admin CMS immediately load their matching category customizer studio instead of defaulting to the nameplate studio.
- **AC 1.1.3:** Seamless state transition when navigating between different products with zero cross-product state pollution.
- **AC 1.1.4:** Base price, available options, and live pricing calculations automatically bind to the active product's schema.
- **AC 1.1.5 (Catalog Collections Customization Entrypoint & Studio Removal from Navbar):**
  - "2D Customizer Studio" is removed from the top navigation bar. Customers discover handcrafted pieces in the curated catalog (`/#catalog`) or category collections and click **"Customize"** directly on any product card to launch that item's tailored customizer (`/customize/[slug]`).
  - Top header action CTA links directly to `/#catalog` (`Collections`), guiding customers through product discovery before customization.
- **AC 1.1.6 (Photographic Base Live 2D Artisan Preview & Zero Blueprint Mode):**
  - In the 2D customizer studio (`/customize/[slug]`), the visual stage renders the original product's actual photograph (derived dynamically from `useCustomizerStore.productImage` or `useProductStore` catalog image) as the realistic physical foundation.
  - Blueprint mode is completely decommissioned across ALL categories; strictly the genuine Artisan Photo Preview is maintained with live overlays.
  - Floating requirement indicators and reference photo badges render over the canvas to give instant feedback as users configure options.

---

### Story 1.1A: Bespoke Nameplate Streamlined Customizer (5-Point Core + Requirements & WhatsApp Reference)
- **ID:** `US-1.1A` | **FR Reference:** `FR-CUST-01A`
- **As a:** Homeowner designing an entrance nameplate
- **I want to:** Use an intuitive, clutter-free single-pane customizer where I can: (1) Inscribe my family name and house number without forced default text like "The Sharmas" on the canvas, (2) Describe my custom requirements (preferred colors, themes, layout ideas) in a free-text field, (3) Select size (12"x8", 16"x10", 18"x12"), (4) Toggle 12V Warm LED backlighting, and (5) Upload a sample/reference photo with direct WhatsApp consultation with the lead artisan
- **So that:** I can effortlessly configure my bespoke entrance art without being restricted by rigid colour swatches, understanding that the artisan carefully sources quality base foundations (customer does not select raw substrate types), and discuss exact colorways and nuances with the artist on WhatsApp prior to pouring.

#### Acceptance Criteria
- **AC 1.1A.1 (Zero Forced Text on Canvas & Curated Quality Base):** The artisan photographic canvas does not display `"The Sharmas"` or any other fake default text by default. Typography renders in 3D mirror gold acrylic only when entered by the customer in Line 1 or Line 2. The foundation is fixed to artisan-curated, durable quality bases; customer cannot choose the raw substrate material.
- **AC 1.1A.2 (Streamlined 5-Point Controls & Free-Text Requirements):** All complex nested tabs, font style selectors, sacred emblem pickers, wood/substrate pickers, and rigid colour palettes are removed. Controls consist strictly of:
  1. Text to be printed on nameplate (Line 1 max 20 chars, Line 2 max 28 chars with laser safety sanitization).
  2. Describe Your Requirements (free-text up to 1,000 characters for colors, themes, nuances).
  3. Size selection (`12"x8"` Base ₹2,499, `16"x10"` +₹500, `18"x12"` +₹900).
  4. LED inclusion toggle (12V Warm LED Backlighting +₹799).
  5. Sample reference image upload for WhatsApp discussion.
- **AC 1.1A.3 (Sample Image Upload & WhatsApp Bridge):**
  - Customer can upload a sample/reference image (PNG, JPG, WEBP up to 5MB) via drag-and-drop or file picker using client-side `FileReader`.
  - Live canvas renders a floating "Reference Photo Attached" badge with a thumbnail.
  - A prominent WhatsApp consultation card displays direct chat link (`wa.me/919876543210`) reassuring the buyer that the lead artist will review reference images and share pour progress over WhatsApp.
  - Uploaded reference data URL and requirements text persist into cart customization payload (`referenceImage`, `requirementsText`).
- **AC 1.1A.4 (Dynamic Deterministic Pricing):** Price tallies base price (₹2,499) + size upgrade + LED addon with 1-tap checkout.

---

### Story 1.1B: Crystal Monogram Resin Initial Keyring Customizer (Streamlined Requirements + WhatsApp Reference)
- **ID:** `US-1.1B` | **FR Reference:** `FR-CUST-01B`
- **As a:** Shopper purchasing a personalized gift or everyday accessory
- **I want to:** Use a clean, single-pane customizer where I can: (1) Select my monogram initial (A–Z) and optional engraved tag without forced default letters/names on canvas, (2) Describe my custom resin styling and colour requirements in a free-text field, and (3) Upload a reference photo for WhatsApp consultation with the artisan (hardware finish and dangling charm pickers removed for an unencumbered creative flow)
- **So that:** I can create a pocket luxury keepsake tailored to my name and discuss custom details and tentative pricing on WhatsApp.

#### Acceptance Criteria
- **AC 1.1B.1 (Clean Canvas Without Forced Defaults):** The 2D canvas displays the chosen monogram initial letter without hardcoded fallback names on the engraved tag (e.g. no forced "Priya" tag). If the engraved tag text is empty, the tag does not display fake placeholder names. The key ring loop renders in classic polished brass gold.
- **AC 1.1B.2 (Streamlined 3-Section Controls & Elimination of Hardware/Charm Selectors):** Hardware metal finish and dangling charm option pickers are completely removed. Controls are streamlined into:
  1. Monogram Initial (A–Z letter selector) & Optional Tag Engraving (laser-etched text, max 10 chars, +₹99 tentative).
  2. Describe Your Requirements (free-text up to 1,000 characters for resin colors, glazes, gold flakes, glitter accents, or charm styling wishes).
  3. Reference photo upload for WhatsApp consultation.
- **AC 1.1B.3 (Reference Image Upload & WhatsApp Bridge):**
  - Allows uploading a sample/reference image (e.g. calligraphy style, couple initials, pet photo, car key pairing).
  - Live canvas displays a floating "Reference Photo Attached" badge and customer requirements pill.
  - Includes direct WhatsApp consultation callout (`wa.me/919876543210`) for custom styling discussion.
  - Reference image and requirements text persist in cart customization payload (`requirementsText`, `referenceImage`).
- **AC 1.1B.4 (Tentative Pricing & Token Booking Deposit Policy):**
  - Displayed price is a tentative estimate (Base ₹399 tentative + ₹99 optional engraved tag).
  - Sticky bottom bar prompts customer to pay ₹199 Token Deposit at checkout to confirm booking and initiate WhatsApp discussion.
  - Guarantees 50% token refund if final price or design is not agreed later.

---

### Story 1.1C: Pressed Himalayan Flora Botanical Bookmark Customizer (Streamlined Requirements + WhatsApp Reference)
- **ID:** `US-1.1C` | **FR Reference:** `FR-CUST-01C`
- **As a:** Book lover or mindful gifting customer
- **I want to:** Customize a resin bookmark with focused artisan decisions: (1) Write recipient's name without forced default text like "Your Name" on canvas, (2) Choose if natural pressed flowers are needed, (3) Describe my color preferences and floral themes in a free-text field, and (4) Upload a reference photo for WhatsApp consultation
- **So that:** I have an effortless, focused customization experience and can discuss custom flower themes with the artist.

#### Acceptance Criteria
- **AC 1.1C.1 (Clean Canvas Without Forced Defaults):** When `personalizedName` is empty, the canvas and export proof do NOT render `"Your Name"` or `"Personalized"`. The bookmark renders with its pure botanical/resin beauty, displaying the recipient's name only when typed.
- **AC 1.1C.2 (Core Streamlined Decisions & Free-Text Requirements):** Fixed colour palettes are removed. Controls consist of:
  1. Name Personalization: Optional recipient name (max 24 chars, +₹49) with laser-safe character sanitization.
  2. Flower Inclusion: Toggle between Real Pressed Botanical Wildflowers vs Pure Optical Resin.
  3. Describe Your Requirements: Free-text up to 1,000 characters for color palette desires, floral styles, or custom gifting messages.
  4. Sample Reference Photo Upload for WhatsApp consultation.
- **AC 1.1C.3 (Reference Image Upload & WhatsApp Bridge):**
  - Customer can upload sample/reference image (e.g. specific dried flower variety, wedding palette, book spine dimensions).
  - Live canvas displays floating "Reference Photo Attached" badge and customer requirements indicator pill.
  - WhatsApp consultation banner with direct chat link (`wa.me/919876543210`).
  - Reference image and requirements text persist in cart customization payload.
- **AC 1.1C.4 (Pricing):** Base price is ₹499 (+₹49 if personalized name is added).

---

### Story 1.1D: Sacred Toran & Shubh Labh Geode Entrance Decor Customizer (Free-Text Requirements & WhatsApp Reference)
- **ID:** `US-1.1D` | **FR Reference:** `FR-CUST-01D`
- **As a:** Homeowner or devotee seeking auspicious entrance decor
- **I want to:** Use a simplified, consultation-first customizer where I can freely describe my custom requirements (preferred colors, entrance/mandir dimensions, sacred symbols, and hanging preferences), optionally upload a reference photo, and submit so that I can discuss the custom design 1-on-1 with the artist over WhatsApp.
- **So that:** I can create sacred entrance decor tailored to my mandir/home without being restricted by rigid technical options.

#### Acceptance Criteria
- **AC 1.1D.1 (Artisan Photo Canvas & Preview):** Canvas displays the genuine high-resolution artisan studio piece with live indicators for attached reference photos and custom requirements.
- **AC 1.1D.2 (Free-Text Requirements Input):** Provides an expansive multi-line text area (up to 1,000 characters) for buyers to freely describe their custom requirements (preferred colors, doorway/mandir dimensions, sacred inscriptions like Shubh Labh, Om, Swastik, Suswagatam, hanging bells or tassels).
- **AC 1.1D.3 (Optional Reference Photo Upload):** Allows uploading an entrance, mandir, or design sample photo (PNG, JPG, WEBP up to 5MB) that attaches directly to the order.
- **AC 1.1D.4 (WhatsApp Consultation Bridge & Submission):** Submitting adds the item with custom requirements and reference photo to the bag; our master artisan connects directly over WhatsApp with physical layout proofs and confirms delivery before resin pouring. Transparent starting price reflects base catalog price.

---

### Story 1.2: Real-Time Typography, Font Engine & Laser-Cut Character Limiter
- **ID:** `US-1.2` | **FR Reference:** `FR-CUST-02`
- **As a:** Customer
- **I want to:** Type my family name, house number, or personal quote and choose between 6 curated fonts (Serif, Minimalist, Devanagari/Hindi Calligraphy)
- **So that:** I can evaluate readability and aesthetic harmony in real time.

#### Acceptance Criteria
- **AC 1.2.1:** Text renders on canvas with smooth kerning and auto-centering.
- **AC 1.2.2:** Strict character limits enforced: Nameplate Line 1 (Max 20 chars), Line 2 (Max 28 chars), Bookmark (Max 18 chars).
- **AC 1.2.3:** Characters beyond the limit are blocked with a clear warning: *"Maximum character limit reached for this size."*
- **AC 1.2.4:** Text color defaults to 3D Mirror Gold Acrylic with simulated specular drop-shadow.

---

### Story 1.3: Custom Requirements & WhatsApp Pigment Consultation (Replacing Fixed Swatches)
- **ID:** `US-1.3` | **FR Reference:** `FR-CUST-03`
- **As a:** Customer
- **I want to:** Freely describe my desired color themes, pigment styles, and aesthetic vision via a multi-line requirements field and reference photo upload
- **So that:** I am not restricted by fixed color swatches and can discuss exact pigment hues (Ocean Froth, Emerald Geode, Midnight Gold, Ruby Wine) directly with the artist over WhatsApp.

#### Acceptance Criteria
- **AC 1.3.1:** Fixed preset colorway swatches are removed across all customizers in favor of expansive, free-text requirements fields (`requirementsText` up to 1,000 chars).
- **AC 1.3.2:** Canvas displays live visual confirmation badges when custom requirements and reference photos are provided.
- **AC 1.3.3:** Final resin pigment blend and glitter/foil inclusion are approved via physical high-resolution WhatsApp proof photograph prior to resin curing.

---

### Story 1.4: Inclusions & Botanical Embed Selector
- **ID:** `US-1.4` | **FR Reference:** `FR-CUST-04`
- **As a:** Customer
- **I want to:** Select dried botanical flowers (Lavender, Baby's Breath, Dried Rose Petals) and metallic foil flecks (24K Gold, Silver, Rose Gold)
- **So that:** My keyring, bookmark, or nameplate has unique organic texture.

#### Acceptance Criteria
- **AC 1.4.1:** Customers can select up to 2 simultaneous inclusion types.
- **AC 1.4.2:** Each inclusion toggle renders a realistic semi-transparent scatter layer over the resin base.
- **AC 1.4.3:** Selecting premium inclusions (e.g., 24K Gold Leaf) dynamically updates the running price tally (+₹99).

---

### Story 1.5: Photo Upload, Interactive Cropper & Preflight DPI Validator
- **ID:** `US-1.5` | **FR Reference:** `FR-CUST-05`
- **As a:** Customer ordering a Photo Keyring or Memorial Keepsake
- **I want to:** Upload an image from my mobile gallery or desktop and crop it directly within the designated circle/heart boundary
- **So that:** My photo is centered properly and doesn't print blurry.

#### Acceptance Criteria
- **AC 1.5.1:** If image resolution is < 150 DPI for the target print size, display a yellow caution banner: *"Photo resolution is slightly low. For best glossy results, use an uncompressed original."*
- **AC 1.5.2:** If image resolution is >= 300 DPI, display a green badge: *"Image Quality: Excellent (Print-Ready)"*.
- **AC 1.5.3:** Crop modal supports smooth touch panning, 1x to 3x zoom, and rotation before confirming.

---

### Story 1.6: Dynamic Real-Time Pricing Calculator
- **ID:** `US-1.6` | **FR Reference:** `FR-CUST-06`
- **As a:** Customer
- **I want to:** View an instant itemized breakdown of the price as I select add-ons (LED backlighting, size upgrades, brass bells)
- **So that:** There are zero hidden costs at checkout.

#### Acceptance Criteria
- **AC 1.6.1:** Base price prominently displayed at all times in INR (₹).
- **AC 1.6.2:** Price recalculates synchronously on every option toggle:
  $$\text{Current Price} = \text{Base Price} + \text{Size Premium} + \text{Inclusions Premium} + \text{LED/Hardware Addon}$$
- **AC 1.6.3:** Expandable *"Price Breakdown"* accordion details itemized costs including GST.

---

### Story 1.7: High-Resolution (300 DPI) Production Proof Generator
- **ID:** `US-1.7` | **FR Reference:** `FR-CUST-07`
- **As an:** Artisan workshop operator
- **I want:** The customizer to export a clean, high-resolution rendering (3x pixel ratio) alongside the exact JSON configuration upon order submission
- **So that:** I have an exact 1:1 digital specification sheet for laser-cutting acrylic and pouring resin.

#### Acceptance Criteria
- **AC 1.7.1:** On "Add to Cart", canvas executes: `stage.toDataURL({ pixelRatio: 3, mimeType: 'image/jpeg', quality: 0.95 })`.
- **AC 1.7.2:** Image uploaded to Cloudinary/Supabase Storage.
- **AC 1.7.3:** Layer configuration JSON saved in `OrderItem.customizationDetails`.

---

## 4. EPIC-2: Storefront, Product Discovery & Heritage Visual Experience

### Epic Description
As a visitor to Artआलय, I want an inspiring, culturally resonant, mobile-first shopping experience that educates me on resin artistry, provides clear product dimensions, customer reviews, and sets realistic expectations about handmade resin craft.

---

### Story 2.1: Mobile-First Responsive Catalog with Instant Filters
- **ID:** `US-2.1` | **FR Reference:** `FR-CAT-01`
- **As a:** Mobile shopper
- **I want to:** Browse the 4 Hero Collections (Name Plates, Keyrings, Bookmarks, Shubh Labh) with quick visual filters (Occasion: Griha Pravesh, Diwali, Birthday; Price: Under ₹500, ₹500–₹1,500, Above ₹1,500)
- **So that:** I can find the perfect product in under 3 taps.

#### Acceptance Criteria
- **AC 2.1.1:** Storefront achieves Google Lighthouse Mobile Score >= 90.
- **AC 2.1.2 (Interactive Category Filtering):** The Collections section on the storefront provides an interactive category pill selector (*All Collections*, *Nameplate*, *Keyrings*, *Bookmark*, *Toran/Shubh Labh*) allowing customers to filter products with zero page reloads.
- **AC 2.1.3:** Product cards display high-res visuals, Artआलय styling, starting price, and `[Customize Now 🎨]` CTA.
- **AC 2.1.4 (Authentic Craft Presentation — Removal of Dummy Ratings):** Artificial/dummy star ratings (e.g. ⭐ 4.9) are completely removed from product cards to maintain transparent artisanal integrity and avoid misleading customers with fabricated reviews.

---

### Story 2.2: Product Details Page (PDP) with Artisan Craft Disclaimers
- **ID:** `US-2.2` | **FR Reference:** `FR-CAT-02`
- **As a:** Customer on a product page
- **I want to:** Read a transparent disclosure regarding the organic nature of epoxy resin
- **So that:** I understand that natural fluid swirls and micro-bubbles are normal signatures of authentic handcrafted art, not defects.

#### Acceptance Criteria
- **AC 2.2.1:** PDP displays an expandable *"The Artisan's Touch"* badge explaining natural fluid resin swirls and microscopic air bubbles.
- **AC 2.2.2:** Production timeline banner: *"Handcrafted & Cured with Care — Dispatches in 5–7 Business Days"*.

---

### Story 2.3: The Home-Based Small Artist Story & Multi-Disciplinary Art Journey
- **ID:** `US-2.3` | **FR Reference:** `FR-CAT-03`
- **As a:** Visitor interested in the origins of Artआलय
- **I want to:** Learn about the home-based small artist behind the brand and their passion for creating various forms of art
- **So that:** I connect emotionally with the authentic handmade journey behind my bespoke piece.

#### Acceptance Criteria
- **AC 2.3.1:** Dedicated `#artisan-story` section accessible directly from the global navigation header.
- **AC 2.3.2:** Story outlines the humble beginnings of an independent home-based artist experimenting with multiple art disciplines: reclaimed woodworking, fluid resin pigment chemistry, botanical flower foraging, and crystal geode crafting.
- **AC 2.3.3:** Reinforces small-batch dedication: High-gloss UV-stabilized resin that resists yellowing, individual attention to each custom piece, and sustainable home-studio ethics.

---

### Story 2.4: Verified Customer Reviews & Photo Testimonials
- **ID:** `US-2.4` | **FR Reference:** `FR-CAT-04`
- **As a:** Prospective buyer
- **I want to:** Read verified buyer reviews and browse real customer unboxing photos of cured resin pieces
- **So that:** I feel complete confidence in the craftsmanship and finish before ordering.

#### Acceptance Criteria
- **AC 2.4.1:** PDP features a *"Customer Creations & Reviews"* gallery with overall star rating (1 to 5) and rating distribution.
- **AC 2.4.2:** Reviews submitted by confirmed purchasers display a green *"Verified Buyer"* badge.
- **AC 2.4.3:** Customers can upload up to 3 photos of their delivered piece; image gallery supports lightbox zoom.
- **AC 2.4.4:** Automated post-delivery WhatsApp trigger sends a polite review request link 48 hours after delivery confirmation.

---

### Story 2.5: Instant Search & Predictive Auto-Suggest
- **ID:** `US-2.5` | **FR Reference:** `FR-CAT-05`
- **As a:** Store visitor
- **I want to:** Type keywords (e.g., *"ocean nameplate"*, *"ganesh"*, *"diwali gift"*) into a sticky search bar and see instant predictive suggestions with thumbnail previews
- **So that:** I can jump directly to relevant products without manual navigation.

#### Acceptance Criteria
- **AC 2.5.1:** Search input queries indexed product titles, categories, occasions, tags, and colorways with debounce (300ms).
- **AC 2.5.2:** Dropdown displays top 4 product matches with thumbnail, price, badge (`Bestseller`), and top matching category suggestions.
- **AC 2.5.3:** Zero-results state displays helpful recommendations and popular search pills (*Name Plates*, *Toran*, *Car Dashboard*).

---

## 5. EPIC-3: Frictionless Indian D2C Cart, Checkout & Invoicing

### Epic Description
As an Indian consumer, I want a lightning-fast checkout supporting guest checkout, instant UPI app redirection, separate billing/shipping addresses, GST-compliant tax invoices, and coupon codes, so that checkout takes less than 45 seconds without frustrating hurdles.

---

### Story 3.1: Persistent Customization Cart
- **ID:** `US-3.1` | **FR Reference:** `FR-CHK-01`
- **As a:** Customer
- **I want:** My customized items (with preview thumbnails and custom text) to stay stored in my shopping cart even if I close my mobile browser
- **So that:** I don't have to redesign my piece from scratch.

#### Acceptance Criteria
- **AC 3.1.1:** Cart state persisted in `localStorage` for guests and synced to database for authenticated users.
- **AC 3.1.2:** Cart items display customizer preview thumbnail, customization summary, an `[Edit Design]` button that restores customizer state, and price.
- **AC 3.1.3 (Accurate Product Photo Thumbnail in Shopping Bag):**
  - The photo thumbnail in the shopping bag (`CartDrawer.tsx`) must strictly represent the specific selected product's photo (`imageUrl`, including artisan photos uploaded in the CMS), dynamically bound across all product categories (`Nameplate`, `Keyrings`, `Bookmark`, `Toran/Shubh Labh`), rather than hardcoded static stock imagery.

---

### Story 3.2: Gifting Suite (Custom Handwritten Greeting & Price Concealment)
- **ID:** `US-3.2` | **FR Reference:** `FR-CHK-02`
- **As a:** Gift buyer sending directly to a friend/relative
- **I want to:** Add an aesthetic greeting card with a personal handwritten message (+₹49) and conceal the price on the package
- **So that:** The recipient receives an unboxing experience that feels like a heartfelt personal present.

#### Acceptance Criteria
- **AC 3.2.1:** Checkbox on cart page: `[🎁 This is a Gift]`.
- **AC 3.2.2:** Form reveals Recipient Name, Greeting Message (up to 200 chars), and Occasion Selector.
- **AC 3.2.3:** System flags `Order.isGift = true` and conceals product prices on the physical packing slip.

---

### Story 3.3: Razorpay Payment Gateway Integration with Mobile UPI Intent
- **ID:** `US-3.3` | **FR Reference:** `FR-CHK-03`
- **As an:** Indian mobile shopper
- **I want:** The checkout to trigger native UPI Intent apps (GPay, PhonePe, Paytm, CRED) directly on my phone without manually copying and pasting a VPA address
- **So that:** I can complete payment in one touch via fingerprint/UPI PIN.

#### Acceptance Criteria
- **AC 3.3.1:** Razorpay SDK launches native UPI Intent on mobile browsers.
- **AC 3.3.2:** PhonePe/GPay opens automatically with the exact order amount.
- **AC 3.3.3:** Upon UPI authorization, user returned to Order Confirmation within 2 seconds; order status set to `ORDER_CONFIRMED`.

---

### Story 3.4: Tentative Pricing, Token Booking Deposit & 50% Refund Guarantee
- **ID:** `US-3.4` | **FR Reference:** `FR-CHK-04`
- **As a:** Buyer ordering bespoke resin creations
- **I want to:** Pay only a token amount (standard ₹199 per custom creation) at checkout to confirm my interest and initiate direct 1-on-1 WhatsApp discussions with the artist, knowing that all catalog prices are tentative estimates that will only be finalized after mutual agreement on design proofs
- **So that:** I can freely discuss design ideas with the artist without committing full funds upfront, backed by a guaranteed 50% token refund if final price or design is not agreed.

#### Acceptance Criteria
- **AC 3.4.1 (Tentative Pricing Architecture):** All prices across storefront, catalog cards, and customizer studios are presented as tentative estimates (e.g. `Tentative Est. ₹...`). The final price is finalized only after the design is approved and discussed over WhatsApp between the buyer and artist.
- **AC 3.4.2 (Token Booking Deposit Payable Today):** At checkout, the buyer pays only a token amount (standard ₹199 per custom piece via UPI/Cards) to confirm interest and reserve workshop queue time.
- **AC 3.4.3 (Transparent Balance Disclosure):** Cart drawer and checkout screens display:
  - Tentative Total Order Value
  - Token Deposit Payable Today (₹199 per piece)
  - Remaining Tentative Balance (due only after WhatsApp design approval)
- **AC 3.4.4 (50% Token Refund Guarantee Policy):** If the buyer and artisan do not reach an agreement on the final price or design during WhatsApp consultation, **50% of the token amount is promptly returned** to the buyer's original payment method. Reassurance badges are prominently displayed across customizers, cart drawer, checkout, and order confirmation.

---

### Story 3.5: Automated Pincode Serviceability & Delivery Date Estimator
- **ID:** `US-3.5` | **FR Reference:** `FR-CHK-05`
- **As a:** Customer
- **I want to:** Enter my 6-digit Indian PIN code on the product or checkout page
- **So that:** I know immediately if delivery is available and the estimated arrival date.

#### Acceptance Criteria
- **AC 3.5.1:** Validates against Shiprocket Pincode Serviceability API on 6 digits entered.
- **AC 3.5.2:** Delivery arrival date calculated as:
  $$\text{Delivery Date} = \text{Current Date} + 6\text{ days (Artisan Curing)} + \text{Courier Transit Days (2-4 days)}$$
- **AC 3.5.3:** Unserviceable pincodes display alternative guidance for India Post SpeedPost delivery.

---

### Story 3.6: Frictionless Guest Checkout & Account Linking
- **ID:** `US-3.6` | **FR Reference:** `FR-CHK-06`
- **As a:** First-time mobile visitor
- **I want to:** Complete my purchase as a guest by simply providing my 10-digit phone number, shipping address, and email (without creating a password upfront)
- **So that:** I can checkout in 30 seconds without password friction.

#### Acceptance Criteria
- **AC 3.6.1:** Checkout allows guests to enter Shipping Address + Phone + Email without mandatory password creation.
- **AC 3.6.2:** On successful payment, the guest is presented with a 1-tap `[Set Password to Save Account]` prompt.
- **AC 3.6.3:** If a guest never sets a password, they can still track their order anytime via Phone OTP login.
- **AC 3.6.4:** When an account is created with that phone number later, all past guest orders automatically associate with `User.id`.

---

### Story 3.7: Comprehensive Order Summary & Split Billing/Shipping Addresses
- **ID:** `US-3.7` | **FR Reference:** `FR-CHK-07`
- **As a:** Customer finalizing checkout
- **I want to:** Review an exhaustive Order Summary before payment—including itemized customizations, gift wrap, shipping fees, tax breakup, and an explicit option to provide different Billing and Shipping addresses
- **So that:** I have total transparency, and my gift recipient doesn't receive the invoice.

#### Acceptance Criteria
- **AC 3.7.1:** Pre-payment Order Summary screen displays:
  - Each item with customizer thumbnail, personalized text, and selected size.
  - Subtotal, Gift Wrap (+₹49 if selected), Delivery Fee (Free if >₹999, else ₹99).
  - Discount amount (if coupon applied).
  - GST Tax breakdown (CGST 9% + SGST 9% for intra-state Karnataka, or IGST 18% for inter-state).
  - Grand Total in bold INR (₹).
- **AC 3.7.2:** Checkbox: `[Billing address is different from shipping address]`. When checked, displays separate billing address form.
- **AC 3.7.3:** Consumer (B2C) Invoicing: The option for customers to claim B2B GST Input Tax Credit (ITC) has been removed. All customer orders are issued standard B2C consumer tax invoices with Artआलय's seller GSTIN under HSN 3926/4420.
- **AC 3.7.4 (Flexible Delivery Target Date & Customer Reason):**
  - Checkout provides an optional target delivery scheduling card: `Do you need this creation by a specific date? (e.g. Wedding, Housewarming, Birthday, Anniversary)`.
  - Customer can specify `neededByDate` (ISO Date) and `neededByReason` (text up to 200 chars).
  - Clear customer notice states: *"Each product delivery lead time varies based on workshop backlog, artist availability, and inventory status. The actual delivery date will be confirmed by the artist when designs are approved over WhatsApp."*
  - The requested date and reason persist into the order record (`neededByDate`, `neededByReason`) and surface on order tracking and workshop job sheets.

---

### Story 3.8: Automated GST Tax Invoice Generation & HSN Engine
- **ID:** `US-3.8` | **FR Reference:** `FR-CHK-08`
- **As a:** Customer and Platform Accountant
- **I want:** The system to automatically generate an official, legally compliant GST Tax Invoice PDF upon payment completion
- **So that:** Customers have a formal tax receipt and the business complies with Indian tax authority regulations.

#### Acceptance Criteria
- **AC 3.8.1:** Invoice PDF is generated asynchronously upon `ORDER_CONFIRMED` using `@react-pdf/renderer` and saved to Cloudinary/S3.
- **AC 3.8.2:** Invoice complies with GST rules, containing:
  - Consecutive Financial Year Invoice Number (e.g. `AA/26-27/0042`).
  - Artआलय registered business name, studio address, and 15-digit GSTIN.
  - Customer Name, Shipping Address, and Billing Address (Consumer B2C Tax Invoicing).
  - Date of Invoice and Place of Supply (Customer State).
  - HSN Classification: **HSN 3926** (Decorative resin/plastic goods) and **HSN 4420** (Wood-inlaid resin nameplates).
  - Tax Table detailing Taxable Value, CGST (9%), SGST (9%), or IGST (18%).
- **AC 3.8.3:** PDF link is emailed/WhatsApped to customer and available for download in Customer Account Hub and Admin Order Card.

---

### Story 3.9: Server-Side Promotional Coupons & Dynamic Free Shipping
- **ID:** `US-3.9` | **FR Reference:** `FR-CHK-09`
- **As a:** Store owner running marketing campaigns
- **I want to:** Create discount coupons (percentage or flat discount) with usage limits, expiry dates, and minimum order values, alongside an automatic free shipping threshold (₹999)
- **So that:** We drive holiday sales and increase average order value (AOV).

#### Acceptance Criteria
- **AC 3.9.1:** Coupon input field on cart/checkout validates coupon code via server-side API:
  `POST /api/cart/apply-coupon`.
- **AC 3.9.2:** Coupon rules supported:
  - Flat discount (e.g. `DIWALI200` gives ₹200 off on minimum order of ₹1,499).
  - Percentage discount (e.g. `WELCOME10` gives 10% off up to max ₹300).
- **AC 3.9.3:** If order subtotal >= ₹999, shipping fee automatically sets to ₹0 with a green badge: *"Congratulations! You have unlocked FREE Express Shipping 🚚"*.
- **AC 3.9.4:** Coupon discounts are verified server-side at payment gateway creation to prevent client-side price tampering.

---

### Story 3.10: Order Cancellation & Automated Refund Engine
- **ID:** `US-3.10` | **FR Reference:** `FR-CHK-10`
- **As a:** Customer and Artisan
- **I want:** A fair, automated cancellation policy where non-customized or un-poured orders can be cancelled for an instant refund, while poured custom goods are protected
- **So that:** Customer disputes are minimized and the artisan never loses money on irreversibly poured epoxy resin.

#### Acceptance Criteria
- **AC 3.10.1:** Cancellation Window:
  - *Standard Ready-to-Ship items:* Cancellation allowed anytime before dispatch.
  - *Customizable Made-to-Order items:* Cancellation allowed **within 12 hours of order placement** or until the artisan marks the order as `IN_PRODUCTION` (whichever is earlier).
- **AC 3.10.2:** Once `Order.status = IN_PRODUCTION`, the cancel button is disabled with an explanatory notice:
  > *"Because your custom resin piece has already been poured in our workshop mold and is curing, this order can no longer be cancelled. Please contact us via WhatsApp if you need assistance."*
- **AC 3.10.3:** When eligible cancellation is confirmed, the system triggers Razorpay Refund API (`POST /v1/payments/{payment_id}/refund`) and returns funds to original UPI/Card account within 3–5 business days.

---

## 6. EPIC-4: The Flexible Artisan Proof & WhatsApp Sign-Off Loop

### Epic Description
As an artisan and customer, I want a flexible proof approval loop where the artisan can either upload an actual physical layout photo for customer WhatsApp approval, or skip the step for standard items, ensuring quality control without unnecessary delays.

---

### Story 4.1: Artisan Proof Decision Engine ("Upload Photo" vs "Skip & Pour")
- **ID:** `US-4.1` | **FR Reference:** `FR-PRF-01`
- **As an:** Artisan viewing an incoming order on the admin dashboard
- **I want:** Two clear action buttons: `[📸 Upload Photo Proof & Send to WhatsApp]` and `[⚡ Skip Proof & Start Pouring]`
- **So that:** I can bypass approval for simple keyrings/bookmarks but verify complex ₹3,000+ nameplates with the customer.

#### Acceptance Criteria
- **AC 4.1.1:** Default recommendations: Nameplates default to Photo Proof; Keyrings/Bookmarks default to Skip.
- **AC 4.1.2:** Clicking `[⚡ Skip Proof & Start Pouring]` advances status immediately to `IN_PRODUCTION` and notifies customer via WhatsApp.
- **AC 4.1.3:** Clicking `[📸 Upload Photo Proof]` opens mobile camera/file uploader with optional artisan note.

---

### Story 4.2: Automated WhatsApp Interactive Proof Dispatch
- **ID:** `US-4.2` | **FR Reference:** `FR-PRF-02`
- **As an:** Artisan
- **I want:** The uploaded proof photo to be automatically delivered to the customer's WhatsApp with two interactive buttons (`[✅ Approve & Pour]` and `[✏️ Request 1 Change]`)
- **So that:** The customer can approve from their phone in one tap without logging into a website.

#### Acceptance Criteria
- **AC 4.2.1:** Dispatches via WhatsApp Business Cloud API.
- **AC 4.2.2:** Payload contains high-res photo, order number, and Quick-Reply interactive buttons: `[✅ Approve & Pour]` and `[✏️ Request Change]`.
- **AC 4.2.3:** Includes web fallback link: `art-aalay.in/proof/[token]`.

---

### Story 4.3: Customer 1-Click WhatsApp Action Webhook Handler
- **ID:** `US-4.3` | **FR Reference:** `FR-PRF-03`
- **As a:** System
- **I want to:** Process WhatsApp webhook callbacks instantly when a customer taps an action button
- **So that:** The workshop board updates in real time.

#### Acceptance Criteria
- **AC 4.3.1:** Customer tapping `[✅ Approve & Pour]` updates order status to `PROOF_APPROVED` and moves card to "Ready to Pour" column.
- **AC 4.3.2:** Customer tapping `[✏️ Request Change]` prompts for revision text; updates order status to `REVISION_REQUESTED` with alert badge.

---

### Story 4.4: Web Fallback Proof Portal & Revision Limits
- **ID:** `US-4.4` | **FR Reference:** `FR-PRF-04`
- **As a:** Customer without active WhatsApp
- **I want to:** Access a secure, passwordless web link (`/proof/[token]`) to review the photo and submit approval or revision feedback
- **So that:** Proof sign-off is never blocked by WhatsApp delivery issues.

#### Acceptance Criteria
- **AC 4.4.1:** Web link supports high-res pinch-to-zoom on the proof photo.
- **AC 4.4.2:** Maximum of 1 complimentary revision included; subsequent revisions prompt a nominal ₹149 re-layout fee.

---

## 7. EPIC-5: Customer Post-Purchase Experience & Direct WhatsApp Artisan Consultation

### Epic Description
As a customer who placed a bespoke resin order with a token deposit, I want a dedicated WhatsApp consultation portal where the artist connects directly with me to finalize custom requirements, mutually agree on the delivery date and final price, and provide reassurance through a 50% token refund guarantee if terms cannot be aligned.

---

### Story 5.1: Direct Artisan WhatsApp Consultation & Order Status Hub (`/track/[orderNumber]`)
- **ID:** `US-5.1` | **FR Reference:** `FR-TRK-01`
- **As a:** Customer viewing my order status page
- **I want to:** See transparent order details, tentative pricing breakdowns, a direct 1-tap WhatsApp consultation button to agree on delivery date and final price with the artist, and clear refund guarantee terms
- **So that:** I have total clarity on my bespoke order without being subjected to artificial, synthetic timeline radars.

#### Acceptance Criteria
- **AC 5.1.1:** Hub displays full item specs, shipping address, payment status, and tentative price breakdown (₹199 token deposit paid now, remaining balance payable upon final approval).
- **AC 5.1.2:** Prominent 1-tap WhatsApp Consultation action pre-populates message with Order Reference and customization parameters.
- **AC 5.1.3:** Delivery date and final price policy is prominently highlighted: delivery schedule and price are confirmed 1-on-1 between buyer and artist over WhatsApp based on studio workload and custom complexity.
- **AC 5.1.4:** 50% Token Refund Guarantee banner is clearly stated: if design or final price cannot be mutually agreed during WhatsApp discussion, 50% of the token deposit is refunded immediately.
- **AC 5.1.5:** Real-time Shiprocket courier tracking and Transit Breakage Replacement claims are available once dispatched.

---

### Story 5.2: Automated Milestone WhatsApp & SMS Notifications
- **ID:** `US-5.2` | **FR Reference:** `FR-TRK-02`
- **As a:** Customer
- **I want:** Brief, delightful WhatsApp notifications when key milestones are achieved
- **So that:** I am kept informed without having to manually check the website every day.

#### Acceptance Criteria
- **AC 5.2.1:** Automated WhatsApp alerts sent on: Order Initiated (Token Received), Proof & Layout Ready for Discussion, Order Approved & In Production, and Dispatched with Shiprocket tracking link.

---

### Story 5.3: Integrated Shiprocket Live Courier Tracking & Transit Protection
- **ID:** `US-5.3` | **FR Reference:** `FR-TRK-03`
- **As a:** Customer
- **I want to:** Click my tracking link and see real-time transit scans (Out for Delivery, In Transit, Delivered) directly on the Artआलय website
- **So that:** I don't have to navigate to third-party courier websites.

#### Acceptance Criteria
- **AC 5.3.1:** Artआलय ingests Shiprocket webhook events (`/api/webhooks/shiprocket`).
- **AC 5.3.2:** In-app modal displays courier partner, AWB number, current city, and live transit timeline.
- **AC 5.3.3:** Free Transit Breakage Replacement claim workflow available directly on the order details page.

---

## 8. EPIC-6: Artisan Workshop Production & Kanban Operations

### Epic Description
As the workshop maker and operations manager, I want a visual production Kanban board, batch pouring aggregators, printable 300-DPI spec sheets, and one-click shipping label generation, so that my workshop team runs error-free with zero wasted resin.

---

### Story 6.1: Drag-and-Drop Production Kanban Board
- **ID:** `US-6.1` | **FR Reference:** `FR-OPS-01`
- **As a:** Workshop manager
- **I want:** A visual Kanban board with columns: `Proof Pending`, `Ready to Pour`, `In Curing Chamber`, `Finishing & Hardware`, `QC & Packaging`, `Ready to Ship`
- **So that:** I can drag order cards across stages and see workshop bottlenecks at a glance.

#### Acceptance Criteria
- **AC 6.1.1:** Drag-and-drop interface powered by `@hello-pangea/dnd`.
- **AC 6.1.2:** Moving card updates database status and logs timestamp.
- **AC 6.1.3:** Cards color-coded: Red border for aging orders (>48h in stage), Gold for high-ticket nameplates with LED wiring.

---

### Story 6.2: Batch Pouring & Material Requirement Aggregator
- **ID:** `US-6.2` | **FR Reference:** `FR-OPS-02`
- **As a:** Resin artisan
- **I want to:** Filter orders by resin colorway (e.g., *"Show all Ocean Wave orders"*) and view total required epoxy volume in milliliters (ml)
- **So that:** I can mix one large batch of resin and pour 10 orders at once without wasting expensive chemical epoxy.

#### Acceptance Criteria
- **AC 6.2.1:** Single button filter: `[Batch Pouring Mode]`.
- **AC 6.2.2:** Calculates total resin volume: Nameplate (~350ml), Shubh Labh (~120ml), Keyring (~25ml), Bookmark (~20ml).
- **AC 6.2.3:** Displays exact Part A (Resin) and Part B (Hardener) mixing proportions for the selected batch.

---

### Story 6.3: Printable High-DPI Workshop Production Sheets
- **ID:** `US-6.3` | **FR Reference:** `FR-OPS-03`
- **As an:** Acrylic laser-cutting operator and resin caster
- **I want to:** Print an A4 physical production job card for each order with the exact 1:1 scale text layout, font name, and colorway codes
- **So that:** I don't need to carry laptops or phones near sticky uncured resin molds.

#### Acceptance Criteria
- **AC 6.3.1:** Single-click `[🖨️ Print Job Sheet]` generates A4 PDF.
- **AC 6.3.2:** Contains high-contrast 1:1 vector outline for laser cutters, 300-DPI color preview, QR code linking to digital order, and customization checklist.

---

### Story 6.4: One-Click Shiprocket Shipping Label & Manifest Generation
- **ID:** `US-6.4` | **FR Reference:** `FR-OPS-04`
- **As a:** Dispatch manager
- **I want to:** Click one button on a packed order to automatically assign a courier via Shiprocket, generate the shipping AWB, and print the thermal courier label
- **So that:** Packing and dispatching 50 parcels takes less than 15 minutes.

#### Acceptance Criteria
- **AC 6.4.1:** Clicking `[Generate Courier Label]` triggers Shiprocket API and assigns optimal courier partner.
- **AC 6.4.2:** Returns printable 4"x6" thermal label PDF with tracking barcode and COD collection amount.
- **AC 6.4.3:** Automatically schedules courier pickup request for the next business morning.

---

## 9. EPIC-7: Artisan Admin Catalog Management & Merchandising Suite

### Epic Description
As an artisan shop owner, I want a rich administrative CMS to create and publish products, upload image galleries, assign merchandising labels (`Bestseller`, `Masterpiece`, `Festive Special`, `Limited Edition`), configure customizer parameters, and analyze sales performance, so that I can control my business without touching code.

---

### Story 7.1: Product Creation & Multi-Media Gallery Uploader
- **ID:** `US-7.1` | **FR Reference:** `FR-CMS-01`
- **As an:** Artisan store administrator
- **I want to:** Add a new product listing with title, description, category, dimensions, base price, and drag-and-drop multi-image/video upload
- **So that:** I can launch new resin creations and seasonal pieces in under 5 minutes.

#### Acceptance Criteria
- **AC 7.1.1:** Form includes: Product Title, Subtitle, Category (Nameplates, Keyrings, Bookmarks, Shubh Labh, Home Decor), Base Price (₹), SKU/Slug, and Rich Text Description.
- **AC 7.1.2:** Media uploader supports up to 8 high-resolution images (JPEG/PNG/WebP, max 10MB each) and 1 short product video (MP4, max 50MB).
- **AC 7.1.3:** Drag-and-drop reordering of gallery images; first image designated as primary catalog card thumbnail.
- **AC 7.1.4:** Media files are automatically optimized and served via Cloudinary with responsive WebP transformations.
- **AC 7.1.5 (Category-First Selection & Filtration):**
  - The Product Catalog screen (`/admin/products`) must implement a category-first selection bar featuring high-contrast interactive chips with live product count badges:
    - `All Categories` (`ALL`, showing total count)
    - `Bespoke Nameplates` (`NAMEPLATES`, showing count)
    - `Monogram Keyrings` (`KEYRINGS`, showing count)
    - `Botanical Bookmarks` (`BOOKMARKS`, showing count)
    - `Festive & Mandir Decor` (`FESTIVE`, showing count)
  - Selecting a category instantly filters the product table to show only items belonging to that category, with an empty state fallback if no items match.
- **AC 7.1.6 (Interactive Dual-Mode Price Editing Engine):**
  - The price column must not be static text. It must support two intuitive editing workflows:
    1. **Inline Table Quick-Edit:** Clicking on the price value or its edit pencil icon turns the cell into an active numeric input field (`₹ [ 2499 ]`) with instant keyboard Enter/Save (`✓`) and Escape/Cancel (`✕`) actions.
    2. **Dedicated Price & Margins Modal:** Clicking the "Edit Price" action button opens a focused dialog allowing modification of:
       - **Selling Base Price (₹)**: Validated to ensure positive numeric value (> 0).
       - **Compare-At / Strikethrough Price (₹)**: Optional MRP for displaying customer savings.
       - **Live Margin / Discount Calculation**: Real-time percentage badge showing savings (e.g. `15% OFF`).
       - **Promotional Badge Selector**: Quick reassignment of marketing badge (`BESTSELLER`, `MASTERPIECE`, `FESTIVE_SPECIAL`, `NEW_ARRIVAL`, `NONE`).
  - Upon saving:
    - The product price updates immediately in the active catalog table.
    - An emerald success toast confirms: *"Price updated for [Product Title]! New Base Price: ₹X,XXX"*.
    - Updated prices persist and propagate to customizer and checkout calculations.
- **AC 7.1.7 (Streamlined Action Architecture & Product Deletion):**
  - The redundant "Edit Price" button is removed from the quick actions column; the pencil icon `✎` directly against the price in the Price column serves as the single, clean inline editing affordance.
  - A dedicated "Delete Product" action (with trash icon `Trash2` and a modal confirmation safeguard) is provided for every CMS entry. Deleting an item removes it from the catalog with instant confirmation.
- **AC 7.1.8 (Cross-Platform State Sync between CMS & Collections Page):**
  - Products added, edited, or deleted in the Admin CMS persist across the application via `useProductStore` (backed by persistent client storage with `HERO_PRODUCTS` fallback).
  - All creations added by an admin immediately display in real-time on the customer-facing Collections catalog (`/#catalog`) without requiring a code rebuild.
- **AC 7.1.9 (Local Machine Image Browse, 5 MB Limit Intercept & Permission-Based Canvas Optimizer):**
  - When adding new creations or replacing product imagery in CMS, administrators can browse and upload resin creation photos directly from their local machine disk (`.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`).
  - Provides a drag-and-drop dropzone with a 1-click system file dialog trigger (`<input type="file" accept="image/*" />`).
  - **Oversized Image Safeguard (> 5 MB) with User Permission:** If the selected image file size exceeds the upper limit of 5.00 MB, the system intercepts the upload and presents a confirmation modal (`Image Exceeds 5 MB Limit`) displaying the original filename, current file size, and target limit.
  - Upon administrator permission (`[Compress & Upload]`), a client-side HTML5 canvas optimizer progressively tunes compression quality and downscales dimensions (maintaining retina clarity and aspect ratio) until the resulting file strictly meets the 5 MB ceiling.
  - The compressed image is verified with valid JPEG magic bytes and transmitted to `/api/admin/upload`, completely eliminating server 413 Payload Too Large errors. If cancelled, the operation safely aborts without uploading.
  - Displays an immediate visual preview with thumbnail, original filename, formatted file size, and 1-click replace/clear controls.
  - Offers a toggleable tab to choose curated studio presets or direct external URLs when preferred.
- **AC 7.1.10 (Standardized 4-Category Taxonomy, Interactive Row-Level Category Reassignment & Classification Column Removal):**
  - Product categories across the entire application are standardized to exactly 4 distinct collections: **Nameplate**, **Keyrings**, **Bookmark**, and **Toran/Shubh Labh**.
  - In `/admin/products`, the redundant "Classification" column is removed from the catalog table to optimize visual density.
  - The Category cell in the CMS table is an interactive 1-click switcher popover: clicking any category pill opens an inline menu allowing administrators to instantly reassign a creation to any category (e.g., from Nameplate to Bookmark) with real-time reactive persistence to `useProductStore` and toast feedback.
- **AC 7.1.11 (Server-Side Disk Storage & Pluggable Database-Ready Architecture):**
  - **Server-Side Media Storage (`public/uploads/`):** Uploaded photos are handled by `POST /api/admin/upload` and saved directly as binary image files on the server filesystem in `public/uploads/`, eliminating browser Base64 storage bloat and `QuotaExceededError`. The server returns a lightweight static relative URL (e.g. `/uploads/artisan_[id].jpg`).
  - **Server-Side File Catalog (`src/data/products.json`):** CMS products are persisted server-side in `src/data/products.json` via Next.js REST API routes (`GET /api/admin/products`, `POST /api/admin/products`, `PATCH /api/admin/products/[id]`, `DELETE /api/admin/products/[id]`).
  - **Database-Ready DAL (PostgreSQL Migration Readiness):** All server read/write operations utilize an abstract `ProductRepository` interface. The initial implementation is `FileProductRepository`, designed to be drop-in replaceable with `PostgresProductRepository` (Prisma/PostgreSQL) without requiring frontend or API contract changes.
  - **Zero Data Loss Across Browsers & Origins:** The CMS catalog and images are permanently saved on disk, completely immune to browser storage flushes, origin switches (`localhost` vs `127.0.0.1`), or browser resets.
- **AC 7.1.12 (Removal of Fixed Cure Time Input & Lead Time from Catalog):**
  - When adding new creations via the "+ Add New Creation" modal in CMS, the input field for defining cure time is removed. Administrators do not specify fixed curing days.
  - Fixed lead time / cure days are removed from the CMS product table and customer-facing catalog views.
  - Delivery timelines dynamically reflect artisanal craft realities (workshop backlog, artist availability, slow chemical curing), and the actual delivery date is confirmed directly by the artist upon WhatsApp design approval.

---

### Story 7.2: Marketing Badges & Merchandising Tags Engine
- **ID:** `US-7.2` | **FR Reference:** `FR-CMS-02`
- **As an:** Artisan store owner
- **I want to:** Assign visual marketing badges to products—such as `🔥 Bestseller / High Selling`, `👑 Masterpiece`, `🪔 Festive Special`, `✨ Limited Edition`, or `🌿 Staff Pick`
- **So that:** High-margin or signature creations catch the shopper's eye on the storefront catalog and search listings.

#### Acceptance Criteria
- **AC 7.2.1:** Product editor features a Badge dropdown with options:
  - `BESTSELLER` (Renders gold/amber flame badge on catalog card).
  - `MASTERPIECE` (Renders royal emerald crown badge for signature luxury pieces).
  - `FESTIVE_SPECIAL` (Renders festive diya icon for Diwali/Griha Pravesh collections).
  - `LIMITED_EDITION` (Renders urgency tag with remaining count).
  - `NEW_ARRIVAL` (Auto-applied for the first 14 days of publication).
- **AC 7.2.2:** Filter on storefront catalog allowing shoppers to filter by *"Masterpieces"* or *"Bestsellers"*.
- **AC 7.2.3:** Badges are indexed in SEO structured data (`Product` schema markup).
- **AC 7.2.4 (1-Click Table-Row Interactive Badge Picker):**
  - In the Product Catalog table (`/admin/products`), the "Merchandising Badge" cell must not be static text.
  - Clicking on the active badge pill (or the empty badge placeholder `[+ Add Badge]`) opens an inline, floating glassmorphic popover palette displaying all available merchandising badges with their distinctive iconography and visual themes:
    - 🔥 **Bestseller** (Amber-gold glow, flame icon)
    - 👑 **Masterpiece** (Royal emerald, crown icon)
    - 🪔 **Festive Special** (Warm saffron/vermilion, diya icon)
    - ✨ **New Arrival** (Cyan-teal glow, sparkle icon)
    - ⏳ **Limited Edition** (Crimson-rose, hourglass icon)
    - ✕ **None / Remove Badge** (Neutral slate, resets to unbadged)
  - Selecting any badge immediately updates the product record in state without requiring a modal form.
  - A success toast confirms: *"Merchandising badge updated to [Badge] for [Product]!"*.
- **AC 7.2.5 (Harmonized Visual Styling & Token Alignment):**
  - Each badge renders with dedicated semantic styling across both the Admin table and customer-facing PDP / Catalog Bento cards:
    - Bestseller: `bg-amber-100 text-amber-900 border-amber-300`
    - Masterpiece: `bg-emerald-100 text-emerald-950 border-emerald-300`
    - Festive Special: `bg-orange-100 text-orange-900 border-orange-300`
    - New Arrival: `bg-teal-100 text-teal-900 border-teal-300`
    - Limited Edition: `bg-rose-100 text-rose-900 border-rose-300`

---

### Story 7.3: Product Operational Classification (Ready-to-Ship vs Made-to-Order)
- **ID:** `US-7.3` | **FR Reference:** `FR-CMS-03`
- **As an:** Artisan
- **I want to:** Designate whether a product is a "Standard Ready-to-Ship Creation" (pre-poured inventory) or a "Customizable Made-to-Order Piece" (triggers 2D customizer)
- **So that:** Ready-made items can ship in 24 hours while customizable items enter the customizer and curing workflow.

#### Acceptance Criteria
- **AC 7.3.1:** Toggle switch in product editor: `[Customizable Product: ON / OFF]`.
- **AC 7.3.2:** If `OFF` (Standard Ready-to-Ship):
  - PDP displays standard `[Add to Cart]` and `[Buy Now]` buttons.
  - Delivery estimate reflects instant 24-48h dispatch.
  - Requires inventory stock count (quantity > 0).
- **AC 7.3.3:** If `ON` (Customizable Made-to-Order):
  - PDP displays `[Customize Your Piece 🎨]` button opening the Konva customizer.
  - Production delivery timeline notice indicates that actual delivery date is confirmed directly by the artist upon WhatsApp design approval.
  - Inventory operates on made-to-order mode.

---

### Story 7.4: Customizer Template Binding & Rule Configuration
- **ID:** `US-7.4` | **FR Reference:** `FR-CMS-04`
- **As an:** Artisan administrator
- **I want to:** Bind specific customization rules to a customizable product (allowed fonts, active colorway swatches, inclusion toggles, size options, and price surcharges)
- **So that:** Different products have appropriately restricted customizer options (e.g. keyrings don't offer LED backlighting).

#### Acceptance Criteria
- **AC 7.4.1:** Admin configuration panel for each customizable product allows:
  - Selecting allowed font families (checkboxes from font library).
  - Enabling/disabling specific colorway palettes.
  - Enabling/disabling inclusion categories (e.g., Botanicals: Yes, Gold Flakes: Yes, Photos: No).
  - Configuring add-on prices (e.g. Size 16"x10": +₹500, LED Backlight: +₹799).
- **AC 7.4.2:** Configuration is saved as a structured JSON schema in `Product.customizerConfig`.
- **AC 7.4.3:** The frontend Konva customizer dynamically renders only the rules enabled for that specific product slug.

---

### Story 7.5: Inventory Tracking, Stock Alerts & Price Overrides
- **ID:** `US-7.5` | **FR Reference:** `FR-CMS-05`
- **As an:** Artisan store manager
- **I want to:** Track inventory counts for pre-made pieces and raw hardware (clocks, teakwood planks, keyrings), set low-stock warning thresholds, and update base prices
- **So that:** We never accept orders for substrates or hardware that are out of stock in the workshop.

#### Acceptance Criteria
- **AC 7.5.1:** Admin Inventory table lists all products with SKU, Stock on Hand, Stock Reserved in Orders, and Available Stock.
- **AC 7.5.2:** Low stock alert threshold (e.g. <= 5 units) triggers an amber alert badge and sends a daily email digest to the artisan.
- **AC 7.5.3:** If an item or specific size substrate reaches 0 stock, the storefront automatically flags it as *"Temporarily Sold Out / Join Waitlist"* and disables the checkout CTA.
- **AC 7.5.4:** Quick inline price override allows adjusting base prices or holiday promotional discounts with an optional `compareAtPrice` (strike-through MRP).

---

### Story 7.6: Artisan Business Intelligence & Sales Analytics
- **ID:** `US-7.6` | **FR Reference:** `FR-CMS-06`
- **As an:** Artisan store owner
- **I want to:** View an executive analytics dashboard summarizing gross revenue, net profit, Average Order Value (AOV), return-to-origin (RTO) rate, and top-selling resin swatches
- **So that:** I can make data-driven decisions on which raw materials to bulk-order and which products to feature.

#### Acceptance Criteria
- **AC 7.6.1:** Analytics dashboard features date range picker (Today, Last 7 Days, Month to Date, Year to Date).
- **AC 7.6.2:** KPI metric cards:
  - Total Sales Revenue (₹).
  - Total Orders Placed & Completion Rate.
  - Average Order Value (AOV).
  - Curing Turnaround Time (Average hours from pouring to dispatch).
- **AC 7.6.3:** Visual charts:
  - Top 5 Best-Selling Products by Revenue.
  - Most Popular Resin Colorways (Ocean Blue vs. Emerald Geode vs. Ruby).
  - Pincode heat map of top delivery cities in India (Bangalore, Mumbai, Delhi-NCR, Hyderabad, Pune).

---

### Story 7.7: Category Management & Dynamic Storefront Taxonomy CMS
- **ID:** `US-7.7` | **FR Reference:** `FR-CMS-07`
- **As an:** Artisan store owner / administrator
- **I want to:** Add, edit, manage, and delete product categories through a dedicated Admin Category CMS screen (`/admin/categories`), choosing custom emoji badges, unique category keys, and descriptions
- **So that:** I can freely expand the Artआलय catalog to 5-6+ new resin categories (such as Coasters, Wall Clocks, Serving Trays, Trinket Dishes, and Mantra Art) and have them dynamically reflect across the storefront collection filters, customizer studios, catalog management tables, and product creation forms without editing code.

#### Acceptance Criteria
- **AC 7.7.1:** Dedicated Category CMS screen at `/admin/categories` guarded with `ARTISAN_ADMIN` role authorization, presenting category KPI metrics (Total Categories, Custom Categories, Default Core Categories, and Catalog Coverage %).
- **AC 7.7.2:** Interactive Category Creator modal providing:
  - Category Display Title (e.g. "Coasters & Slices").
  - Auto-generated uppercase unique ID code (e.g. `COASTERS`).
  - Curated 20+ preset emoji picker (☕, 🕒, 🍱, 💍, 🕉️, 🌿, 💎, 🌸, 🌊, etc.) plus custom emoji input.
  - Short descriptive tagline for customer tooltips and customizer studios.
- **AC 7.7.3:** Real-time Storefront & Studio Sync:
  - Storefront Collections filter bar (`/`) dynamically renders scrollable category tabs with real-time product counts.
  - Customizer Studio (`/customize`) renders category tabs and aspect ratio descriptions.
  - Product Catalog CMS (`/admin/products`) enables 1-click table-row category reassignment popover and dynamic dropdown options in the "+ Add New Creation" modal.
- **AC 7.7.4:** Deletion Safety Guard: The system prevents deleting any category that currently has active catalog products assigned to it, showing an explicit safety modal and warning toast.
- **AC 7.7.5:** Backend Persistence & Auditing: Categories persist to disk storage (`src/data/categories.json`) with timestamps (`createdAt`, `updatedAt`) through RESTful API endpoints (`GET /api/categories`, `POST /api/categories`, `PATCH /api/categories/[id]`, `DELETE /api/categories/[id]`).

---

## 10. Non-Functional Requirements (NFRs)

| NFR ID | Category | Requirement Description | Verification Metric |
| :--- | :--- | :--- | :--- |
| **NFR-01** | **Performance** | Customizer canvas input latency (typing text, switching swatches) must render smoothly at 60fps on mobile devices. | Input-to-render latency < 50ms. |
| **NFR-02** | **Mobile Responsiveness** | All storefront, customizer, and admin screens must be touch-friendly on viewports down to 360px width. | 0 horizontal overflow; touch targets >= 44x44px. |
| **NFR-03** | **Security & Auth** | Passwords salted with bcrypt; JWT session tokens stored in HttpOnly, Secure, SameSite=Lax cookies; RBAC enforced at edge. | 0 unauthorized `/admin/*` route access. |
| **NFR-04** | **Payment Integrity** | Razorpay payment webhooks cryptographically verified using `HmacSHA256` signature verification before order status advance. | 0 spoofed confirmations; zero ghost orders. |
| **NFR-05** | **Asset Privacy** | Customer-uploaded photos stored with signed private URLs and never indexed in public search results. | Cloudinary authenticated access URLs. |
| **NFR-06** | **High Availability** | Platform availability >= 99.9% during festive surges (Diwali, Raksha Bandhan). | Serverless auto-scaling on Vercel & Supabase. |
| **NFR-07** | **Tax Compliance** | Automated GST calculation must adhere strictly to Indian Place of Supply rules (Intra-state CGST+SGST vs Inter-state IGST). | 100% tax reconciliation accuracy on invoices. |

---

## 11. Multi-Agent Production Sign-Off

The cross-functional review is formally closed. All functional, architectural, regulatory, and commercial requirements for **Artआलय** are validated and approved for production engineering.

- **Sofia (Product Owner 🎯):** *"Scope is complete, prioritized, and commercialized."*
- **Mary (Business Analyst 📊):** *"Tax, compliance, user journeys, and edge cases are fully covered."*
- **Winston (System Architect 🏗️):** *"Architecture is resilient, decoupled, and ready for code scaffolding."*

