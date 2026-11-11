# Artआलय — Technical Stack Selection & Trade-Off Analysis
## Comparative Evaluation: Frameworks, Customizer Engines, Database & Hosting Costs

**Document Version:** 1.0.0  
**Evaluator:** Winston (BMad System Architect 🏗️) & Mary (BMad Business Analyst 📊)  
**Primary Optimization Metrics:**
1. **Zero License Fees (100% Free, Permissive Open-Source Software — MIT / Apache 2.0).**
2. **Minimum Operational Cost (Target: ₹0 to <₹500/month base infrastructure, pay-as-you-grow).**
3. **High Mobile Performance on Indian 4G/Budget Devices (60fps canvas, sub-1.5s FCP).**
4. **Developer Productivity & Single-Monorepo Simplicity.**

---

## 1. Executive Summary: Architecture Reconfirmed

Following a rigorous comparative trade-off analysis against 4 alternative web frameworks, 5 graphics/customizer rendering engines, and multiple hosting options, **Next.js 14+ (App Router)** and **Konva.js (`react-konva`)** are reconfirmed as the optimal architectural choices for **Artआलय**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       RECONFIRMED PRODUCTION STACK                          │
├──────────────────────┬──────────────────────┬───────────────┬───────────────┤
│ Layer                │ Chosen Technology    │ License       │ Base OpEx     │
├──────────────────────┼──────────────────────┼───────────────┼───────────────┤
│ Web Application      │ Next.js 14+ (App)    │ MIT (Free)    │ ₹0 / mo       │
│ Customizer Engine    │ Konva.js (react)     │ MIT (Free)    │ ₹0 / mo       │
│ Database & ORM       │ PostgreSQL + Prisma  │ Apache/Open   │ ₹0 / mo       │
│ Styling & Motion     │ Tailwind + Framer    │ MIT (Free)    │ ₹0 / mo       │
│ Media & Proof CDN    │ Cloudinary           │ Free Tier     │ ₹0 / mo       │
│ Invoicing Engine     │ @react-pdf/renderer  │ MIT (Free)    │ ₹0 / mo       │
│ Payment Gateway      │ Razorpay UPI/Cards   │ Pay-per-sale  │ 2% per txn    │
│ Courier Automation   │ Shiprocket API       │ Free Plan     │ Pay-per-label │
├──────────────────────┴──────────────────────┴───────────────┴───────────────┤
│ TOTAL FIXED MONTHLY COST: ₹0 / month (Fully serverless & scale-to-zero)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Web Application Framework Evaluation

We evaluated 5 architectural approaches for the e-commerce storefront, routing, and backend services:

```
Candidate Matrix:
• Option A: Next.js 14+ App Router (React Server Components + API Routes) [RECOMMENDED]
• Option B: Vite + React SPA + Separate Node/Express Backend
• Option C: Remix / React Router v7
• Option D: Astro + React Customizer Islands
• Option E: Headless Shopify / MedusaJS
```

### Detailed Framework Comparison Table

| Evaluation Dimension | Next.js 14+ (App Router) | Vite React SPA + Express | Remix / RR v7 | Astro + React Islands | Shopify Headless |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **License Cost** | **MIT (100% Free)** | MIT (100% Free) | MIT (100% Free) | MIT (100% Free) | **$39–$399/mo (SaaS Fee)** |
| **Base Operational Cost** | **₹0 / month** (Vercel Free or $4 VPS Docker) | **₹800–₹1,500/mo** (Express needs persistent server) | **₹0 / month** (Cloudflare / Vercel) | **₹0 / month** (Cloudflare / Netlify) | **₹3,200+/month** + Shopify fees |
| **SEO Capabilities** | **Superior (Built-in SSR/SSG)** | **Poor (Client JS only, Google indexing delays)** | Excellent (SSR) | Superior (Static-first) | Good (Liquid/Hydrogen) |
| **Architecture Footprint** | **Unified Monorepo (No CORS, shared TS types)** | Fragmented (2 repos, CORS headers, 2 deploys) | Unified Monorepo | Unified Monorepo | Vendor Lock-in (Shopify backend) |
| **E-Commerce Ecosystem** | **Massive** (Drop-in Razorpay, Shiprocket, Cloudinary) | Good (Manual wiring required) | Moderate (Fewer Indian payment wrappers) | Moderate (Custom cart integration) | High (Shopify App Store) |
| **Mobile Performance** | **High** (Auto Image/Font optimization) | High (Client-only) | High | Ultra-High (Zero JS default) | Moderate |

### Why Next.js 14 Wins:
1. **Zero License & Zero Base Cost:** Can be hosted on Vercel's generous free tier ($0/mo) or deployed as a single self-hosted Docker container on any low-cost Indian cloud provider (e.g., DigitalOcean / Hetzner / AWS Lightsail at \$4/mo).
2. **SEO is Non-Negotiable for D2C:** High-intent keywords like *"custom resin nameplate Bangalore"* or *"buy diwali shubh labh online"* require pre-rendered HTML for Google search indexing. A pure Vite SPA fails this requirement because web crawlers see empty `div id="root"` containers.
3. **Eliminates Backend Operational Burden:** Next.js Route Handlers (`/api/*`) and Server Actions completely eliminate the need to run, monitor, and pay for an idle Express.js backend server.
4. **Rejection of Shopify:** Shopify's $39/month platform fee (~₹3,250/mo) plus transaction surcharges violates the user's explicit directive for minimum operational cost.

---

## 3. Interactive Customizer Engine Evaluation

The customizer is the core differentiator of Artआलय. It must render layered resin textures, text typography, botanicals, and photo crops smoothly on mobile phones, and export an uncompressed 300-DPI snapshot for laser cutting and resin pouring.

```
Candidate Matrix:
• Option 1: Konva.js via `react-konva` [RECOMMENDED]
• Option 2: Fabric.js
• Option 3: SVG DOM / SVG.js / Paper.js
• Option 4: Three.js / React Three Fiber (3D WebGL)
• Option 5: PixiJS (2D WebGL)
```

### Detailed Customizer Engine Comparison Table

| Evaluation Dimension | Konva.js (`react-konva`) | Fabric.js | SVG DOM (Inline SVG) | Three.js / R3F (3D) | PixiJS (2D WebGL) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **License Cost** | **MIT (100% Free)** | MIT (100% Free) | Open Standard (Free) | MIT (100% Free) | MIT (100% Free) |
| **Operational / Asset Cost** | **₹0 (WebP textures)** | ₹0 (WebP textures) | ₹0 (Vector paths) | **High (Requires 3D GLTF models from 3D artists)** | ₹0 |
| **React Integration** | **First-Class (`react-konva` declarative tree)** | **Imperative Only** (Messy `useEffect` hacks) | Native JSX (`<svg>`) | Good (`@react-three/fiber`) | Moderate (`@pixi/react`) |
| **Mobile 60fps Performance** | **High (Canvas 2D hardware-accelerated)** | Moderate | **Poor with >200 elements (Glitter/Botanicals)** | **Heavy (Drains budget phone battery/GPU)** | Very High (Sprite-based) |
| **Blend Modes & Textures** | **Native (`overlay`, `screen`, `multiply`)** | Good | Poor (SVG `feBlend` is slow on mobile) | Requires custom GLSL shaders | Native |
| **300-DPI Print Export** | **1-Line (`pixelRatio: 3`)** | Supported (`multiplier: 3`) | Flaky (Font embedding & CORS issues) | Heavy buffer readback | Complex |
| **Touch Gestures (Pan/Pinch)** | **Built-in Touch Support** | Good | Manual touch event math required | Native OrbitControls | Manual |

### Why Konva.js Wins Over Fabric.js, SVG & Three.js:
1. **Konva.js vs. Fabric.js:** Fabric.js is historically popular for t-shirt print customizers, but its core architecture is **imperative and object-oriented**. Integrating Fabric.js into React requires manual canvas disposal, canvas element mutation, and bidirectional state synchronization that frequently causes race conditions and memory leaks. In contrast, **`react-konva` is fully declarative**—canvas nodes (`<Stage>`, `<Layer>`, `<Image>`, `<Text>`) behave exactly like standard React components, binding seamlessly to Zustand state.
2. **Konva.js vs. SVG:** Resin products contain organic textures—glitter flakes, mica swirls, dried flowers, and ocean foam. In SVG, every piece of glitter is a distinct DOM node. Rendering 500 glitter specks in SVG produces 500 DOM elements, causing severe scroll lag and battery drain on Android smartphones. HTML5 Canvas (Konva) draws thousands of particles directly into a pixel buffer at 60fps with zero DOM overhead.
3. **Konva.js vs. Three.js:** 3D WebGL requires hiring 3D artists to model every single variation in Blender, creating 5MB–10MB `.gltf` 3D files. On budget Indian smartphones (e.g., Redmi, Realme with 3GB–4GB RAM), WebGL contexts frequently crash or stutter. Konva.js achieves photorealistic 2.5D depth using lightweight 30KB WebP texture swatches and simulated 3D acrylic drop-shadows at a fraction of the bandwidth.
4. **300-DPI Export:** With Konva.js, exporting a crystal-clear 2400x2400 production-ready proof for workshop laser cutters requires a single zero-cost method call:
   ```typescript
   stageRef.current.toDataURL({ pixelRatio: 3, mimeType: 'image/jpeg', quality: 0.95 });
   ```

---

## 4. Database, Invoicing & Infrastructure Cost Analysis

### 4.1 Database Layer: PostgreSQL + Prisma ORM
* **License:** PostgreSQL (PostgreSQL License, OSI-approved Free) + Prisma ORM (Apache 2.0 Free).
* **Operational Cost:**
  * **Option A: Supabase Free Tier:** Includes 500MB PostgreSQL database, 50,000 monthly active users, and 1GB file storage for **₹0/month**. More than sufficient for the first 10,000 orders.
  * **Option B: Neon Serverless Postgres:** Free tier with 0.5 GiB storage and scale-to-zero compute for **₹0/month**.
  * **Option C: Self-Hosted Docker PostgreSQL:** ₹0 on any VPS.
* **Why Not MongoDB?** E-commerce requires strict relational integrity (orders linked to user IDs, order items linked to product IDs, payment IDs linked to orders). Relational foreign keys and ACID transactions prevent orphan data and double-charging bugs.

---

### 4.2 Invoicing Pipeline: Headless `@react-pdf/renderer` vs. Alternatives

| Invoicing Approach | License | Hosting & Compute Cost | Evaluation & Fit |
| :--- | :--- | :--- | :--- |
| **`@react-pdf/renderer` (Recommended)** | **MIT (Free)** | **₹0 (Runs in standard serverless function)** | **Fast, pure JavaScript rendering; zero external binary dependencies; runs in <300ms.** |
| Puppeteer / Headless Chrome | Apache 2.0 (Free) | High (Requires dedicated memory >1GB per browser instance) | Exceeds serverless memory limits; prone to timeout crashes on cheap hosting. |
| Third-Party Invoicing API (e.g. DocRaptor) | Proprietary | $15–$50 / month | Violates zero operational cost metric. |

---

### 4.3 Third-Party Services: Zero-Fixed-Cost Model

| Service | Role | Pricing Model | Fixed Cost |
| :--- | :--- | :--- | :--- |
| **Razorpay** | UPI & Cards Payment Gateway | 2% per successful transaction (Standard Indian RBI rate) | **₹0 / month** (No setup or AMC fee) |
| **Shiprocket** | Multi-Courier Logistics Aggregator | Pay-as-you-ship (deducted per shipping label) | **₹0 / month** (Free Core Plan) |
| **Cloudinary** | Media Storage & Real-time WebP Transform | Free Tier: 25 Monthly Credits (~25,000 transforms, 25GB storage) | **₹0 / month** |
| **WhatsApp Cloud API** | Proof Sign-off & Milestone Alerts | Meta gives 1,000 free service conversations per month | **₹0 / month** for initial volume |

---

## 5. Architectural Reconfirmation Sign-Off

### Final Verdict (Winston 🏗️ & Mary 📊):
* **Next.js 14+ (App Router)** is the most cost-effective, high-performing, and SEO-compliant foundation available for an Indian D2C e-commerce platform.
* **Konva.js (`react-konva`)** is the optimal 2D customizer engine, providing 60fps mobile hardware acceleration, declarative React state, zero license fees, and instant 300-DPI exports.
* The entire platform operates at **₹0 fixed monthly operational cost**, scaling only on variable transaction fees as revenue is earned.

**Technical Architecture Reconfirmed & Approved:** Winston (System Architect 🏗️)

