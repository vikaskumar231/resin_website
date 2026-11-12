-- ============================================================================
-- Artआलय (Handcrafted Resin E-Commerce Platform)
-- Master Relational Database DDL Schema (PostgreSQL 15+)
-- Version: 1.0.0
-- Lead Architect: Winston (BMad System Architect)
-- Standard: ANSI/ISO SQL & PostgreSQL Extensions
-- Currency Precision: NUMERIC(10, 2) (INR ₹)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. ENUMERATED TYPES (ENUMS)
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'CUSTOMER',
        'ARTISAN_ADMIN',
        'WORKSHOP_MAKER',
        'SUPER_ADMIN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_type AS ENUM (
        'READY_TO_SHIP',
        'CUSTOMIZABLE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_badge AS ENUM (
        'BESTSELLER',
        'MASTERPIECE',
        'FESTIVE_SPECIAL',
        'LIMITED_EDITION',
        'NEW_ARRIVAL'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM (
        'PAYMENT_PENDING',
        'ORDER_CONFIRMED',
        'PROOF_PENDING',
        'PROOF_APPROVED',
        'IN_PRODUCTION',
        'FINISHING_QC',
        'PACKED',
        'DISPATCHED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM (
        'PENDING',
        'AUTHORIZED',
        'CAPTURED',
        'FAILED',
        'REFUNDED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM (
        'OFFLINE_SETTLEMENT',
        'RAZORPAY_UPI',
        'RAZORPAY_CARD',
        'RAZORPAY_NETBANKING',
        'COD_PARTIAL_DEPOSIT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE proof_status AS ENUM (
        'NOT_REQUIRED',
        'PENDING_ARTISAN_UPLOAD',
        'PENDING_CUSTOMER_APPROVAL',
        'APPROVED',
        'REVISION_REQUESTED',
        'SKIPPED_BY_ARTISAN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE discount_type AS ENUM (
        'PERCENTAGE',
        'FLAT_AMOUNT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE review_status AS ENUM (
        'PENDING',
        'APPROVED',
        'REJECTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE breakage_claim_status AS ENUM (
        'PENDING_REVIEW',
        'APPROVED_REPLACEMENT',
        'REJECTED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE batch_status AS ENUM (
        'PLANNED',
        'MIXING',
        'POURED',
        'CURING_48H',
        'COMPLETED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. CORE TRIGGER FUNCTION FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 4. TABLE DEFINITIONS
-- ============================================================================

-- 4.1 USERS (Customers, Artisans, Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(150),
    password_hash VARCHAR(255),
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 4.2 ADDRESSES (Multi-Address Book)
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag VARCHAR(30) NOT NULL DEFAULT 'Home', -- 'Home', 'Work', 'Recipient'
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street TEXT NOT NULL,
    landmark VARCHAR(150),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_pincode_format CHECK (pincode ~ '^[1-9][0-9]{5}$')
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_pincode ON addresses(pincode);

-- 4.3 VERIFICATION TOKENS (SMS / WhatsApp OTP & Email Verification)
CREATE TABLE IF NOT EXISTS verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(255) NOT NULL, -- Phone or Email
    token VARCHAR(64) NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_max_attempts CHECK (attempts <= 5)
);

CREATE INDEX IF NOT EXISTS idx_verification_identifier_token ON verification_tokens(identifier, token);
CREATE INDEX IF NOT EXISTS idx_verification_expires ON verification_tokens(expires_at);

-- 4.4 PASSWORD RESET TOKENS
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(128) NOT NULL UNIQUE,
    is_used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);

-- 4.5 CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 4.6 PRODUCTS (The Catalog)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    product_type product_type NOT NULL DEFAULT 'CUSTOMIZABLE',
    badge product_badge,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price >= base_price),
    inventory_count INT NOT NULL DEFAULT 50 CHECK (inventory_count >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    curing_lead_days INT NOT NULL DEFAULT 3 CHECK (curing_lead_days >= 1),
    dimensions VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    customizer_config JSONB, -- Substrates, swatches, sizes, typography settings
    search_vector TSVECTOR, -- PostgreSQL Full-text search
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_badge ON products(badge);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_products_customizer_config ON products USING GIN(customizer_config);

-- 4.7 PRODUCT IMAGES (Multi-Angle, Gallery, Zoom)
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- 4.8 SAVED DESIGNS (Shareable Deep Links & Saved Customizer Configurations)
CREATE TABLE IF NOT EXISTS saved_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    share_token VARCHAR(32) NOT NULL UNIQUE,
    design_state JSONB NOT NULL,
    preview_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_saved_designs_token ON saved_designs(share_token);

-- 4.9 PROMOTIONAL COUPONS
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type discount_type NOT NULL DEFAULT 'PERCENTAGE',
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    max_discount_amount NUMERIC(10, 2),
    min_order_value NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (min_order_value >= 0),
    usage_limit INT,
    usage_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 4.10 ORDERS (Master Order Header)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'ART-2026-1001'
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable for Guest Checkout
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    status order_status NOT NULL DEFAULT 'ORDER_CONFIRMED',
    payment_status payment_status NOT NULL DEFAULT 'PENDING',
    payment_method payment_method NOT NULL DEFAULT 'OFFLINE_SETTLEMENT',
    
    -- Financial Breakdowns
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_fee >= 0),
    grand_total NUMERIC(10, 2) NOT NULL CHECK (grand_total >= 0),
    
    -- Anti-RTO COD Deposit Governance
    is_cod_deposit BOOLEAN NOT NULL DEFAULT FALSE,
    cod_deposit_amount NUMERIC(10, 2) DEFAULT 0.00,
    balance_cod_amount NUMERIC(10, 2) DEFAULT 0.00,
    
    -- Address Snapshots (Immutable at time of purchase)
    shipping_address JSONB NOT NULL,
    billing_address JSONB,
    is_billing_same_as_shipping BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Gifting Suite
    is_gift BOOLEAN NOT NULL DEFAULT FALSE,
    gift_message VARCHAR(300),
    gift_wrap_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    
    -- Cancellation Governance
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 4.11 ORDER ITEMS (Line Items with Customizer Details & Snapshots)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Direct user linkage for item-level data isolation
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    
    -- 2D Customizer JSON Snapshot & Rendered Proof Assets
    customization_details JSONB,
    preview_image_url TEXT,
    
    -- Proof Workflow Status
    proof_status proof_status NOT NULL DEFAULT 'NOT_REQUIRED',
    proof_image_url TEXT,
    proof_revision_count INT NOT NULL DEFAULT 0 CHECK (proof_revision_count <= 3),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_user_id ON order_items(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_proof_status ON order_items(proof_status);
CREATE INDEX IF NOT EXISTS idx_order_items_customization ON order_items USING GIN(customization_details);

-- 4.12 ORDER STATUS HISTORY (Immutable Audit Timeline)
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    previous_status order_status,
    new_status order_status NOT NULL,
    changed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);

-- 4.13 PAYMENTS (Razorpay Transactions & Webhook Verifications)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(100) NOT NULL,
    razorpay_payment_id VARCHAR(100) UNIQUE,
    razorpay_signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    status payment_status NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    gateway_fee NUMERIC(10, 2) DEFAULT 0.00,
    gateway_tax NUMERIC(10, 2) DEFAULT 0.00,
    raw_webhook_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order_id ON payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);

-- 4.15 PROOF REQUESTS & REVISIONS (Artisan WhatsApp Approval Loop)
CREATE TABLE IF NOT EXISTS proof_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE CASCADE,
    status proof_status NOT NULL DEFAULT 'PENDING_ARTISAN_UPLOAD',
    proof_image_url TEXT,
    artisan_notes TEXT,
    is_skipped_by_artisan BOOLEAN NOT NULL DEFAULT FALSE,
    skip_reason TEXT,
    whatsapp_message_sid VARCHAR(100),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proof_requests_order_item ON proof_requests(order_item_id);
CREATE INDEX IF NOT EXISTS idx_proof_requests_status ON proof_requests(status);

CREATE TABLE IF NOT EXISTS proof_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proof_request_id UUID NOT NULL REFERENCES proof_requests(id) ON DELETE CASCADE,
    revision_number INT NOT NULL DEFAULT 1,
    customer_feedback TEXT NOT NULL,
    adjusted_mockup_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proof_revisions_request ON proof_revisions(proof_request_id);

-- 4.16 WORKSHOP PRODUCTION BATCHES & KANBAN
CREATE TABLE IF NOT EXISTS production_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_code VARCHAR(50) NOT NULL UNIQUE, -- e.g. 'BATCH-OCEAN-20261102'
    colorway VARCHAR(50) NOT NULL,
    total_resin_volume_ml INT NOT NULL CHECK (total_resin_volume_ml > 0),
    hardener_volume_ml INT NOT NULL CHECK (hardener_volume_ml > 0),
    assigned_artisan_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status batch_status NOT NULL DEFAULT 'PLANNED',
    pour_started_at TIMESTAMPTZ,
    curing_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS batch_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES production_batches(id) ON DELETE CASCADE,
    order_item_id UUID NOT NULL UNIQUE REFERENCES order_items(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_batch_items_batch_id ON batch_order_items(batch_id);

-- 4.17 LOGISTICS & SHIPPING MANIFESTS (Shiprocket Courier Automation)
CREATE TABLE IF NOT EXISTS shipping_manifests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE RESTRICT,
    shiprocket_shipment_id VARCHAR(100),
    shiprocket_order_id VARCHAR(100),
    awb_number VARCHAR(100) UNIQUE,
    courier_name VARCHAR(100),
    shipping_label_url TEXT,
    tracking_url TEXT,
    pickup_scheduled_date DATE,
    dispatched_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shipping_manifests_order ON shipping_manifests(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_manifests_awb ON shipping_manifests(awb_number);

CREATE TABLE IF NOT EXISTS transit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipping_manifest_id UUID NOT NULL REFERENCES shipping_manifests(id) ON DELETE CASCADE,
    location VARCHAR(150),
    status_code VARCHAR(50) NOT NULL,
    activity_description TEXT NOT NULL,
    event_timestamp TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transit_events_manifest ON transit_events(shipping_manifest_id);

-- 4.18 TRANSIT BREAKAGE CLAIMS (Safe Transit Guarantee)
CREATE TABLE IF NOT EXISTS transit_breakage_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    customer_phone VARCHAR(20) NOT NULL,
    photo_proof_urls TEXT[] NOT NULL,
    description TEXT NOT NULL,
    status breakage_claim_status NOT NULL DEFAULT 'PENDING_REVIEW',
    replacement_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    artisan_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_breakage_claims_order ON transit_breakage_claims(order_id);

-- 4.19 REVIEWS & TESTIMONIALS (Verified Buyer Social Proof)
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(150) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    headline VARCHAR(200),
    comment TEXT NOT NULL,
    photo_urls TEXT[],
    is_verified_buyer BOOLEAN NOT NULL DEFAULT FALSE,
    status review_status NOT NULL DEFAULT 'APPROVED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

-- 4.21 REFUNDS (Financial Cancellations & Compensations)
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    razorpay_refund_id VARCHAR(100) UNIQUE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    reason TEXT NOT NULL,
    status payment_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON refunds(order_id);

-- ============================================================================
-- 5. AUTOMATED TRIGGERS FOR TIMESTAMPS
-- ============================================================================

CREATE TRIGGER set_timestamp_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_addresses BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_categories BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_coupons BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_orders BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_payments BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_proof_requests BEFORE UPDATE ON proof_requests FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_batches BEFORE UPDATE ON production_batches FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_manifests BEFORE UPDATE ON shipping_manifests FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
CREATE TRIGGER set_timestamp_reviews BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

-- ============================================================================
-- 6. FULL-TEXT SEARCH TRIGGER FOR PRODUCTS CATALOG
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_update_product_search()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.subtitle, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_search_vector
BEFORE INSERT OR UPDATE OF title, subtitle, description ON products
FOR EACH ROW EXECUTE FUNCTION trigger_update_product_search();

-- ============================================================================
-- 7. DETERMINISTIC INITIAL SEED DATA
-- ============================================================================

-- 7.1 Seed Categories
INSERT INTO categories (id, slug, name, description, display_order)
VALUES 
    ('c1111111-1111-1111-1111-111111111111', 'nameplates', 'Bespoke Nameplates', 'Hand-poured resin on reclaimed Burmese teakwood and acrylic bases', 1),
    ('c2222222-2222-2222-2222-222222222222', 'keyrings', 'Monogram Keyrings', 'High-gloss optical clarity initial keychains with 24K gold foil', 2),
    ('c3333333-3333-3333-3333-333333333333', 'bookmarks', 'Botanical Bookmarks', 'Pressed natural Himalayan wild flora preserved in thin resin', 3),
    ('c4444444-4444-4444-4444-444444444444', 'festive', 'Auspicious Festive Decor', 'Shubh Labh, toran, and spiritual entrance accents', 4)
ON CONFLICT (slug) DO NOTHING;

-- 7.2 Seed The Signature 4 Hero Products
INSERT INTO products (
    id, category_id, slug, title, subtitle, description, product_type, badge, 
    base_price, compare_at_price, inventory_count, curing_lead_days, dimensions, 
    hsn_code, gst_rate, is_active, customizer_config
) VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'c1111111-1111-1111-1111-111111111111',
    'bespoke-teakwood-nameplate',
    'Bespoke Teakwood & Ocean Wave Resin Nameplate',
    'Reclaimed Burmese teak with hand-poured ocean gradient & 3D mirror gold typography',
    'Our signature heirloom nameplate. Real seasoned teakwood timber paired with layered epoxy resin replicating ocean waves and shoreline froth. Embellished with 24K gold leaf flecks and laser-cut 3D mirror gold acrylic lettering.',
    'CUSTOMIZABLE',
    'BESTSELLER',
    2499.00,
    3499.00,
    100,
    5,
    '16" x 10" (Customizable up to 18" x 12")',
    '3926',
    18.00,
    TRUE,
    '{
      "substrates": ["RAW_TEAKWOOD", "FROSTED_ACRYLIC", "MATTE_BLACK_ACRYLIC"],
      "colorways": ["OCEAN_WAVE", "EMERALD_GEODE", "MIDNIGHT_GOLD", "RUBY_WINE"],
      "sizes": [
        { "id": "12x8", "label": "Compact 12\" x 8\"", "surcharge": 0 },
        { "id": "16x10", "label": "Grand Heirloom 16\" x 10\"", "surcharge": 500 },
        { "id": "18x12", "label": "Estate Villa 18\" x 12\"", "surcharge": 900 }
      ],
      "inclusions": ["GOLD_FOIL", "SILVER_FOIL", "DRIED_BOTANICALS"],
      "emblems": ["NONE", "GANESHA", "SWASTIK", "LOTUS", "EVIL_EYE"],
      "fonts": ["Cinzel", "Playfair", "Plus Jakarta Sans", "Rozha One"]
    }'::jsonb
), (
    'a2222222-2222-2222-2222-222222222222',
    'c2222222-2222-2222-2222-222222222222',
    'crystal-initial-keyring',
    'Crystal Monogram Resin Letter Keyring',
    'High-gloss crystal monogram infused with 24K gold foil and rose petals',
    'Everyday luxury in your pocket. Heavy brass gold key loop paired with diamond-clarity UV-stabilized resin enclosing real dried botanicals and shimmering metallic gold foil.',
    'CUSTOMIZABLE',
    'NEW_ARRIVAL',
    399.00,
    599.00,
    250,
    3,
    '1.8" x 1.5"',
    '3926',
    18.00,
    TRUE,
    '{
      "letters": ["A", "B", "C", "D", "E", "M", "P", "R", "S", "V"],
      "colorways": ["GOLD_FOIL_CLEAR", "BLUSH_ROSE_PETAL", "EMERALD_MINT"]
    }'::jsonb
), (
    'a3333333-3333-3333-3333-333333333333',
    'c3333333-3333-3333-3333-333333333333',
    'pressed-floral-bookmark',
    'Pressed Himalayan Flora Botanical Bookmark',
    'Natural wild chamomile, ferns, and gold flake enclosed in ultra-thin resin',
    'An eternal sanctuary for your favorite books. Hand-foraged Himalayan wild flora preserved forever in optical resin with silk tassel accents and personalized laser-etched quotes.',
    'CUSTOMIZABLE',
    'MASTERPIECE',
    499.00,
    699.00,
    150,
    3,
    '5.5" x 1.2"',
    '3926',
    18.00,
    TRUE,
    '{
      "tasselColors": ["GOLDEN_AMBER", "EMERALD_GREEN", "ROYAL_BURGUNDY"],
      "hasNameEngraving": true
    }'::jsonb
), (
    'a4444444-4444-4444-4444-444444444444',
    'c4444444-4444-4444-4444-444444444444',
    'auspicious-shubh-labh-pair',
    'Sacred Shubh Labh Entrance Geode Set',
    'Emerald green geode resin with raw chalcedony crystals & auspicious blessings',
    'Welcome prosperity and grace into your home. Handcrafted geode art featuring rich emerald green swirls, genuine crystal quartz chips along the border, and raised 3D gold Devanagari शुभ and लाभ calligraphy.',
    'READY_TO_SHIP',
    'FESTIVE_SPECIAL',
    1299.00,
    1699.00,
    80,
    4,
    'Pair of 4.5" diameter geode discs',
    '3926',
    18.00,
    TRUE,
    NULL
)
ON CONFLICT (slug) DO NOTHING;

-- 7.3 Seed Product Images
INSERT INTO product_images (product_id, url, alt_text, display_order, is_primary)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', 'Teakwood and Ocean Resin Nameplate', 1, TRUE),
    ('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', 'Crystal Monogram Letter Keyring', 1, TRUE),
    ('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80', 'Pressed Himalayan Botanical Bookmark', 1, TRUE),
    ('a4444444-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', 'Sacred Shubh Labh Geode Entrance Set', 1, TRUE)
ON CONFLICT DO NOTHING;

-- 7.4 Seed Promotional Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, usage_limit, is_active)
VALUES 
    ('AALAYFIRST10', 'PERCENTAGE', 10.00, 999.00, 1000, TRUE),
    ('FESTIVE500', 'FLAT_AMOUNT', 500.00, 2999.00, 500, TRUE)
ON CONFLICT (code) DO NOTHING;


