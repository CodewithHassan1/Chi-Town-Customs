# Chi-Town Customs USA — Developer Documentation & Technical Architecture Guide

**Version:** 1.0.0-PROD  
**Target Environment:** Node.js 20+ | Next.js 15.5+ (App Router) | Prisma ORM 6.4+ | Electron 35+  
**Production URL:** [https://chi-town-customs.vercel.app](https://chi-town-customs.vercel.app)  
**Repository:** [https://github.com/CodewithHassan1/Chi-Town-Customs](https://github.com/CodewithHassan1/Chi-Town-Customs)

---

## 1. System Overview & Architecture

Chi-Town Customs USA is an end-to-end digital commerce, operations management, and desktop point-of-sale platform engineered specifically for an automotive wheel repair, custom forged wheel, and performance tire business located at 311 N Cicero Ave, Chicago, IL.

The platform is architected as a high-performance **pnpm monorepo** containing decoupled front-end, backend, desktop, and shared database contracts:

```
Chi-Town Customs Monorepo
├── apps/
│   ├── web/                     # Next.js 15 App Router (Storefront & Admin CMS)
│   │   ├── public/              # Static assets (logo, videos, images)
│   │   ├── src/
│   │   │   ├── app/             # App Router pages & server routes
│   │   │   │   ├── (store)/     # Public storefront routes
│   │   │   │   ├── admin/       # Protected staff operations hub
│   │   │   │   └── api/         # RESTful API endpoints
│   │   │   ├── components/      # UI components & interactive overlays
│   │   │   ├── context/         # Client state providers (CartContext, etc.)
│   │   │   ├── lib/             # Server utilities (db, auth, validation)
│   │   │   └── middleware.ts    # Edge route protection & header interception
│   │   └── next.config.js       # Next.js server configuration & tracing rules
│   │
│   └── desktop/                 # Electron desktop application for shop floor
│       ├── src/
│       │   ├── main/            # Electron main process & IPC handlers
│       │   ├── preload/         # Context isolation bridge
│       │   └── renderer/        # Shop POS, scanner, and receipt printing UI
│       └── package.json
│
├── packages/
│   ├── database/                # Authoritative data access layer
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Authoritative entity models & enums
│   │   │   └── dev.db           # Development SQLite binary database
│   │   └── src/
│   │       └── seed.ts          # Complete enterprise database seeder
│   │
│   ├── contracts/               # Shared TypeScript types, enums & Zod schemas
│   └── ui/                      # Shared styling tokens & design primitives
│
├── package.json                 # Monorepo root scripts & dev dependencies
└── pnpm-workspace.yaml          # Monorepo workspace configuration
```

---

## 2. Core Dependencies & Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `15.5.28` | SSR, Server Components, API Routes, Edge Middleware |
| **UI Library** | React | `19.0.0` | Client component rendering & concurrency |
| **Styling** | Vanilla CSS + Tailwind | `3.4.17` | Hardware-accelerated automotive dark theme |
| **Icons** | Lucide React | `1.16.0` | SVG icons for automotive UI and admin navigation |
| **ORM** | Prisma Client | `6.19.3` | Type-safe SQL querying and data access |
| **Database** | SQLite (dev/edge) / Postgres | Compatible | Cold-start resilient persistence |
| **Validation** | Zod | `3.24.2` | Runtime request body and parameter validation |
| **Desktop** | Electron | `35.0.0` | Internal shop operations, barcode scanning, POS |
| **Package Mgr** | pnpm | `10.28.0` | Strict dependency isolation & workspace caching |

---

## 3. Environment Variables & Configuration

Create an `.env` file in `apps/web/` and `packages/database/`:

```env
# Database Connection String
# For local SQLite:
DATABASE_URL="file:./dev.db"
# For production PostgreSQL / Supabase / Neon:
# DATABASE_URL="postgresql://user:password@host:5432/chitown?sslmode=require"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Cryptographic Session Signing Key (HMAC SHA-256)
SESSION_SECRET="chitown_production_hmac_secret_2026_super_secure_key"

# Port Configuration
PORT=3000
NODE_ENV="development" # or "production"

# Payment Gateways (Stripe integration)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

---

## 4. Local Installation & Development Workflow

### Prerequisites
* **Node.js**: v20.10.0 or higher
* **pnpm**: v9.0.0 or higher (`corepack enable pnpm`)
* **Git**: v2.40+

### Setup Commands
```bash
# 1. Clone repository
git clone https://github.com/CodewithHassan1/Chi-Town-Customs.git
cd "Chi-Town Customs"

# 2. Install monorepo dependencies
pnpm install

# 3. Generate Prisma client & initialize database schema
pnpm db:generate
pnpm db:push

# 4. Populate verified automotive demo catalog, users & inventory
pnpm db:seed

# 5. Launch web development server
pnpm dev:web
# Application launches on http://localhost:3000

# 6. Launch desktop Electron business client (optional)
pnpm dev:desktop
```

---

## 5. Authoritative Database Schema (Prisma ORM)

The relational schema is defined at `packages/database/prisma/schema.prisma`.

### Key Enums
* **`Role`**: `SUPER_ADMIN`, `ADMIN`, `INVENTORY_MANAGER`, `ORDER_MANAGER`, `CONTENT_MANAGER`, `FINANCE_MANAGER`, `STAFF`, `CUSTOMER`
* **`MovementType`**: `RECEIPT`, `ADJUSTMENT`, `SALE`, `RESERVATION`, `RELEASE`, `RETURN`, `DAMAGE`
* **`OrderStatus`**: `PENDING`, `CONFIRMED`, `PROCESSING`, `READY_FOR_PICKUP`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`
* **`InquiryType`**: `GENERAL_CONTACT`, `SERVICE_QUOTE`, `APPOINTMENT_REQUEST`, `FINANCING_LEAD`
* **`InquiryStatus`**: `NEW`, `CONTACTED`, `IN_PROGRESS`, `SCHEDULED`, `RESOLVED`, `CLOSED`

### Core Entity Relationships

```
┌──────────────┐          ┌────────────────────┐
│   Product    │ 1 ──── * │   ProductVariant   │
└──────────────┘          └────────────────────┘
       │                            │ 1
       │                            │
       │                            *
┌──────────────┐          ┌────────────────────┐
│    Order     │ 1 ──── * │ InventoryMovement  │
└──────────────┘          └────────────────────┘
       │ 1
       │
       *
┌──────────────┐
│  OrderItem   │
└──────────────┘
```

#### Product & ProductVariant Schema
`Product` represents the conceptual catalog item (e.g. *Chi-Town Apex-7 Forged Wheel*). `ProductVariant` represents physical, inventory-tracked SKUs containing exact fitment specifications:
* **Wheel Variants**: `diameter`, `width`, `boltPattern`, `offset` (ET), `centerBore`, `finish`.
* **Tire Variants**: `tireWidth`, `aspectRatio`, `diameter`, `speedRating`, `season`.
* **Inventory Control**: `stockOnHand`, `stockReserved`, `reorderLevel`, `price`, `salePrice`, `costPrice`.

#### Immutable Inventory Movement Ledger
All inventory adjustments are written to `InventoryMovement`. Direct mutation of `stockOnHand` without a ledger record is strictly prohibited by backend handlers. Each movement records:
* `variantId`: Targeted SKU
* `quantityDelta`: Integer (+ve for shipments received, -ve for sales/damages)
* `balanceAfter`: Post-transaction balance snapshot
* `movementType`: Audited category (`RECEIPT`, `SALE`, etc.)
* `referenceType` & `referenceId`: Linked Order ID or Purchase Order #
* `staffUserId`: Authenticated staff member responsible

#### Fitment Compatibility Engine (`FitmentRecord`)
Maps vehicle attributes (`year`, `make`, `model`, `trim`) to engineering parameters:
* `boltPattern` (e.g. `5x114.3`, `5x120`)
* `minDiameter` & `maxDiameter` (inches)
* `minOffset` & `maxOffset` (ET in millimeters)
* `tireSizeFront` & `tireSizeRear`

---

## 6. REST API Endpoints Specification

### Authentication API

#### `POST /api/auth/login`
Authenticates staff or customer and issues an HTTP-Only signed cookie.
* **Request Body:**
  ```json
  {
    "email": "admin@chitowncustoms.com",
    "password": "ChiTownAdmin2026!"
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "cmvlxykfh0000f2kowkiwqy5d",
      "name": "Marcus Vance (Owner)",
      "email": "admin@chitowncustoms.com",
      "role": "SUPER_ADMIN"
    },
    "redirectTo": "/admin"
  }
  ```
* **Cookie Set:** `chitown_session=<token>; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`

#### `POST /api/auth/logout`
Destroys session and expires cookie.
* **Response (200 OK):** `Set-Cookie: chitown_session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT`

#### `GET /api/auth/me`
Validates currently attached session token and returns active user state.

---

### Fitment & Catalog API

#### `GET /api/fitment`
Queries compatible bolt patterns, offsets, and wheel sizes for specific vehicle specs.
* **Query Parameters:** `year` (int), `make` (string), `model` (string), `trim` (optional string)
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "vehicle": "2023 BMW M3 Competition",
    "specs": {
      "boltPattern": "5x112",
      "diameterRange": [19, 21],
      "offsetRange": [20, 35],
      "tireSizeFront": "275/35R19",
      "tireSizeRear": "285/30R20"
    },
    "matchingWheelsCount": 8,
    "matchingTiresCount": 14
  }
  ```

#### `GET /api/products`
Retrieves paginated catalog products with multi-dimensional filtering.
* **Query Parameters:** `category` (`custom-wheels` | `performance-tires`), `diameter`, `boltPattern`, `brand`, `sort`

---

### Commerce & Checkout API

#### `POST /api/checkout`
Processes storefront orders, validates stock availability, deducts inventory, and records payment transaction.
* **Request Body:**
  ```json
  {
    "customer": {
      "name": "David Miller",
      "email": "david.m@example.com",
      "phone": "+1 312-555-0192"
    },
    "fulfillmentType": "LOCAL_PICKUP",
    "items": [
      { "variantId": "var_apex7_20x95_blk", "quantity": 4 }
    ],
    "paymentMethod": "STRIPE_CARD",
    "paymentToken": "tok_1N..."
  }
  ```

---

### Operations & Desktop Sync API

#### `GET /api/desktop/sync`
Full and incremental inventory sync for the shop floor Electron desktop client.
* **Query Parameters:** `barcode` (optional), `sku` (optional)
* **Response:** Returns variant array, active pricing, stock balances, and recent movement logs.

#### `POST /api/inventory/adjust`
Staff-authenticated inventory write endpoint creating auditable `InventoryMovement` entries.
* **Headers:** Cookie `chitown_session` (Role must be `SUPER_ADMIN`, `ADMIN`, or `INVENTORY_MANAGER`).

---

## 7. Security & Authentication Architecture

### 1. Edge Middleware Protection (`apps/web/src/middleware.ts`)
* Configured with route matcher: `["/admin", "/admin/:path*"]`.
* Inspects `request.cookies.get("chitown_session")`.
* Unauthenticated requests to `/admin` or any subroute (e.g. `/admin/inventory`, `/admin/orders`) immediately receive an **HTTP 307 Temporary Redirect** to `/admin/login?from=<pathname>`.
* Passes `x-pathname` header to downstream Server Components.

### 2. Server Layout Verification (`apps/web/src/app/admin/layout.tsx`)
* Server component executing inside Node.js runtime.
* Cryptographically verifies session token HMAC signature via `verifyToken(token)`.
* Enforces role authorization: Only `SUPER_ADMIN`, `ADMIN`, `INVENTORY_MANAGER`, and `STAFF` roles are permitted. Unauthorized roles (or customers) are ejected to `/admin/login`.
* Standalone isolation: If `x-pathname === "/admin/login"`, suppresses the admin sidebar navigation to present a dedicated login form.

### 3. Password Hashing & Secret Management
* Implemented in `apps/web/src/lib/auth.ts` using `crypto.scryptSync(password, salt, 64)`.
* Timing-safe comparison using `crypto.timingSafeEqual` prevents timing attack vectors.
* Tokens are signed with SHA-256 HMAC incorporating user ID, name, email, role, and issuance timestamp (`iat`).

---

## 8. Cold-Start Serverless Database Resilience (Vercel)

On serverless hosting environments (such as Vercel), the local SQLite filesystem is ephemeral and read-only outside `/tmp`.

* **Implementation:** `apps/web/src/lib/db.ts` detects serverless production execution.
* On container cold start, `seed.db` is replicated into `/tmp/chitown.db`.
* `next.config.js` includes `outputFileTracingIncludes` ensuring the SQLite seed binary is packaged into the Vercel deployment artifact.
* In the event of a database driver failure, `apps/web/src/lib/fallback-data.ts` serves verified catalog fallback objects so the storefront never throws an HTTP 500.

---

## 9. Performance & Build Verification Commands

```bash
# Run full monorepo type checking and compilation
pnpm build

# Target specific workspace packages
pnpm --filter web build
pnpm --filter desktop build

# Run automated integration and unit test suite
pnpm test
```
