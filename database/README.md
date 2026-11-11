# Artआलय — PostgreSQL Database Schema & Migration Guide
## Architecture Reference & Deployment Manual

**Lead Architect:** Winston (BMad System Architect 🏗️)  
**Schema File:** [`database/schema.sql`](file:///d:/Projects/resin_website/database/schema.sql)  
**Specification Document:** [`docs/DATABASE_SCHEMA_SPECIFICATION_ARTAALAY.md`](file:///d:/Projects/resin_website/docs/DATABASE_SCHEMA_SPECIFICATION_ARTAALAY.md)  
**Target Engine:** PostgreSQL 15+ (Standard SQL DDL)  

---

## 1. Quick Start Execution

### Option A: Local PostgreSQL (Command Line / psql)
If PostgreSQL is running locally on port 5432:
```bash
# 1. Create database if not exists
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE art_aalay;"

# 2. Execute master DDL schema & seed data
psql -U postgres -h localhost -p 5432 -d art_aalay -f database/schema.sql
```

### Option B: Local Docker Container
Run an isolated, zero-configuration PostgreSQL instance:
```bash
# 1. Spin up PostgreSQL 16 container
docker run --name art-aalay-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=art_aalay -p 5432:5432 -d postgres:16-alpine

# 2. Apply the schema
docker exec -i art-aalay-db psql -U postgres -d art_aalay < database/schema.sql
```

### Option C: Cloud Database (Supabase / Neon / AWS RDS)
1. Open the **SQL Editor** in your Supabase or Neon console.
2. Copy and paste the contents of [`database/schema.sql`](file:///d:/Projects/resin_website/database/schema.sql).
3. Click **Run**. The tables, extensions, enums, triggers, and hero seed products will be created in under 2 seconds.

---

## 2. Relational Schema Highlights

| Entity Domain | Relational Tables | Design Highlights |
| :--- | :--- | :--- |
| **Authentication & RBAC** | `users`, `addresses`, `verification_tokens`, `password_reset_tokens` | Multi-role RBAC, phone OTP verification, 6-digit PIN code regex validation, multi-address book. |
| **Catalog & Products** | `categories`, `products`, `product_images`, `reviews` | Bestseller/Masterpiece badges, HSN codes (3926/4420), PostgreSQL tsvector full-text search. |
| **2D Customizer Engine** | `saved_designs`, `order_items (customization_details JSONB)` | Captures live canvas parameters (woods, resin swatches, inclusions, 3D typography, emblems). |
| **Indian Tax & Checkout** | `orders`, `order_items`, `tax_invoices`, `coupons`, `refunds` | Sequential GST invoices (`INV-YYYY-XXXXX`), separate Bill/Ship addresses, CGST/SGST/IGST breakdown, Anti-RTO ₹199 advance COD deposit. |
| **Payments** | `payments` | Razorpay UPI Intent & Card signature verification, webhook audit logging. |
| **Proof Approval Loop** | `proof_requests`, `proof_revisions` | WhatsApp photo proof approval before pour, artisan "Skip Proof & Pour" fast-track. |
| **Workshop Kanban & Curing** | `production_batches`, `batch_order_items`, `order_status_history` | Batch resin mixing calculator, 48-hour slow cure tracking, immutable state transitions. |
| **Shiprocket Logistics** | `shipping_manifests`, `transit_events`, `transit_breakage_claims` | Automated AWB numbers, 4"x6" shipping labels, transit scan events, safe transit claims. |
| **Inventory & BI** | `raw_materials`, `material_inventory_logs` | Real-time epoxy resin (Part A/B), teakwood, and acrylic stock depletion alerts. |

---

## 3. Database Invariants Checked & Enforced

1. **Strict Decimal Precision:** All monetary amounts (`subtotal`, `grand_total`, `tax_amount`, `discount`, `unit_price`) use `NUMERIC(10, 2)`. Zero floating-point calculation drift.
2. **Sequential Invoices:** `tax_invoices.invoice_number` enforces unique sequential IDs.
3. **Audit Trails:** Automatic `updated_at` timestamps via `trigger_set_timestamp()`. Every order state change creates an immutable row in `order_status_history`.
4. **Referential Integrity:** Deleting a user soft-decouples orders (`ON DELETE SET NULL`) to protect financial and tax reporting compliance.

