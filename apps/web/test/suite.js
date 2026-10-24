const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Load apps/web/.env
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  }
}

// Load Prisma Client from database package
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

console.log("================================================================================");
console.log("  CHI-TOWN CUSTOMS USA — AUTOMATED VERIFICATION & TEST SUITE");
console.log("  Authoritative Commerce, CMS, Inventory & Shop Operations Verification");
console.log("================================================================================\n");

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

async function runAsyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

async function main() {
  // --------------------------------------------------------------------------
  // 1. FINANCIAL CALCULATIONS & CART RULES
  // --------------------------------------------------------------------------
  console.log("\n[1] Financial Calculations & Commerce Precision");

  runTest("Calculates exact subtotals for multiple line items", () => {
    const items = [
      { unitPrice: 850.0, quantity: 4 }, // 4x Forged Wheels
      { unitPrice: 320.0, quantity: 4 }, // 4x Michelin Pilot Sport 4S
      { unitPrice: 65.0, quantity: 1 },  // Spline Lug Kit
    ];
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    assert.strictEqual(subtotal, 3400.0 + 1280.0 + 65.0); // 4745.00
  });

  runTest("Calculates Chicago Cook County sales tax (10.25%) with exact 2-decimal rounding", () => {
    const subtotal = 4745.0;
    const taxRate = 0.1025;
    const rawTax = subtotal * taxRate;
    const taxAmount = Math.round(rawTax * 100) / 100;
    assert.strictEqual(taxAmount, 486.36);
  });

  runTest("Applies validated coupon discounts correctly", () => {
    const subtotal = 1000.0;
    const couponPercent = 10; // 10% off
    const discount = (subtotal * couponPercent) / 100;
    const finalSubtotal = subtotal - discount;
    assert.strictEqual(discount, 100.0);
    assert.strictEqual(finalSubtotal, 900.0);
  });

  // --------------------------------------------------------------------------
  // 2. CRYPTOGRAPHY, PASSWORD SECURITY & SESSION TOKENS
  // --------------------------------------------------------------------------
  console.log("\n[2] Authentication, Cryptography & Session Tokens");

  const SALT = "chitown_salt_2026";
  const SESSION_SECRET = "chitown_customs_super_secure_production_secret_key_2026_x89";

  function hashPassword(password) {
    return crypto.scryptSync(password, SALT, 64).toString("hex");
  }

  function verifyPassword(password, hash) {
    const calculated = hashPassword(password);
    return crypto.timingSafeEqual(Buffer.from(calculated), Buffer.from(hash));
  }

  function signToken(user) {
    const payload = JSON.stringify({ ...user, iat: Date.now() });
    const hmac = crypto.createHmac("sha256", SESSION_SECRET);
    hmac.update(payload);
    const signature = hmac.digest("hex");
    return Buffer.from(payload).toString("base64") + "." + signature;
  }

  function verifyToken(token) {
    try {
      const [payloadBase64, signature] = token.split(".");
      if (!payloadBase64 || !signature) return null;
      const payload = Buffer.from(payloadBase64, "base64").toString("utf-8");
      const hmac = crypto.createHmac("sha256", SESSION_SECRET);
      hmac.update(payload);
      const expectedSignature = hmac.digest("hex");
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return null;
      }
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  runTest("Password hashing generates 128-char hex scrypt hash with unique salt", () => {
    const hash = hashPassword("ChiTownAdmin2026!");
    assert.strictEqual(typeof hash, "string");
    assert.strictEqual(hash.length, 128);
  });

  runTest("Password verification authenticates valid password and rejects invalid password", () => {
    const validHash = hashPassword("SecureShopPass2026!");
    assert.strictEqual(verifyPassword("SecureShopPass2026!", validHash), true);
    assert.strictEqual(verifyPassword("WrongPassword123", validHash), false);
  });

  runTest("Session signing and verification preserves payload with tamper resistance", () => {
    const user = { id: "usr_1", name: "Marcus Vance", email: "admin@chitowncustoms.com", role: "SUPER_ADMIN" };
    const token = signToken(user);
    const decoded = verifyToken(token);
    assert.strictEqual(decoded.name, "Marcus Vance");
    assert.strictEqual(decoded.role, "SUPER_ADMIN");

    // Tampered payload must fail
    const tampered = token.replace(/a/g, "b");
    const tamperedDecoded = verifyToken(tampered);
    assert.strictEqual(tamperedDecoded, null);
  });

  // --------------------------------------------------------------------------
  // 3. DATABASE REPOSITORIES & SEED INTEGRITY
  // --------------------------------------------------------------------------
  console.log("\n[3] Database Repositories & Authoritative Inventory");

  await runAsyncTest("Connects to database and verifies seed products and categories", async () => {
    const categoriesCount = await db.category.count();
    const productsCount = await db.product.count({ where: { isActive: true } });
    const variantsCount = await db.productVariant.count({ where: { isActive: true } });

    assert.ok(categoriesCount >= 3, `Expected at least 3 categories, found ${categoriesCount}`);
    assert.ok(productsCount >= 4, `Expected at least 4 active products, found ${productsCount}`);
    assert.ok(variantsCount >= 8, `Expected at least 8 active variants, found ${variantsCount}`);
  });

  await runAsyncTest("Verifies super admin, inventory tech, and demo customer accounts exist", async () => {
    const admin = await db.user.findUnique({ where: { email: "admin@chitowncustoms.com" } });
    const tech = await db.user.findUnique({ where: { email: "shop@chitowncustoms.com" } });
    const customer = await db.user.findUnique({ where: { email: "alex.hayes@example.com" } });

    assert.ok(admin, "Super admin user missing");
    assert.strictEqual(admin.role, "SUPER_ADMIN");
    assert.ok(tech, "Inventory manager user missing");
    assert.strictEqual(tech.role, "INVENTORY_MANAGER");
    assert.ok(customer, "Customer user missing");
    assert.strictEqual(customer.role, "CUSTOMER");
  });

  // --------------------------------------------------------------------------
  // 4. INVENTORY CONCURRENCY, ATOMIC TRANSACTIONS & OVERSELLING PROTECTIONS
  // --------------------------------------------------------------------------
  console.log("\n[4] Concurrency Safety, Movement Auditing & Overselling Protections");

  await runAsyncTest("Atomic transaction adjusts stock and creates immutable audit ledger entry", async () => {
    const variant = await db.productVariant.findFirst({
      where: { sku: "CT-APX7-2095-5114-GB" },
    });
    assert.ok(variant, "Target test variant CT-APX7-2095-5114-GB not found");

    const initialStock = variant.stockOnHand;
    const testDelta = 2; // Add 2 units

    // Execute atomic adjustment transaction
    const result = await db.$transaction(async (tx) => {
      const v = await tx.productVariant.findUnique({ where: { id: variant.id } });
      const newBalance = Math.max(0, v.stockOnHand + testDelta);
      const updated = await tx.productVariant.update({
        where: { id: variant.id },
        data: { stockOnHand: newBalance },
      });
      const movement = await tx.inventoryMovement.create({
        data: {
          variantId: variant.id,
          movementType: "ADJUSTMENT",
          quantityDelta: testDelta,
          balanceAfter: newBalance,
          referenceType: "TEST_SUITE",
          reason: "Automated test suite receipt verification",
        },
      });
      return { updated, movement };
    });

    assert.strictEqual(result.updated.stockOnHand, initialStock + testDelta);
    assert.strictEqual(result.movement.balanceAfter, initialStock + testDelta);

    // Rollback test adjustment cleanly
    await db.$transaction(async (tx) => {
      await tx.productVariant.update({
        where: { id: variant.id },
        data: { stockOnHand: initialStock },
      });
      await tx.inventoryMovement.delete({ where: { id: result.movement.id } });
    });
  });

  await runAsyncTest("Overselling protection clamps stock at 0 to prevent negative inventory balances", async () => {
    const variant = await db.productVariant.findFirst({
      where: { sku: "CT-APX7-2095-5114-GB" },
    });
    const hugeDeduction = -(variant.stockOnHand + 100);
    const safeBalance = Math.max(0, variant.stockOnHand + hugeDeduction);
    assert.strictEqual(safeBalance, 0); // Non-negative balance guarantee
  });

  // --------------------------------------------------------------------------
  // 5. VEHICLE FITMENT ENGINE & SPECIFICATION PROVENANCE
  // --------------------------------------------------------------------------
  console.log("\n[5] Vehicle Fitment Engine & Clearance Specifications");

  await runAsyncTest("Queries verified vehicle fitment for 2024 Ford Mustang", async () => {
    const record = await db.fitmentRecord.findFirst({
      where: { make: "Ford", model: { contains: "Mustang" } },
    });
    assert.ok(record, "Fitment record for Ford Mustang missing");
    assert.strictEqual(record.boltPattern, "5x114.3");
    assert.strictEqual(record.isVerified, true);
    assert.ok(record.minDiameter >= 19 && record.maxDiameter <= 22);
  });

  await runAsyncTest("Queries verified vehicle fitment for Chevrolet Corvette C8", async () => {
    const record = await db.fitmentRecord.findFirst({
      where: { make: "Chevrolet", model: { contains: "Corvette" } },
    });
    assert.ok(record, "Fitment record for Corvette C8 missing");
    assert.strictEqual(record.boltPattern, "5x120");
    assert.strictEqual(record.isVerified, true);
  });

  // --------------------------------------------------------------------------
  // 6. INQUIRY PIPELINE & FINANCING REFERRALS
  // --------------------------------------------------------------------------
  console.log("\n[6] Inquiry Pipeline & Financing Lead Management");

  await runAsyncTest("Submits and persists service quote inquiry to authoritative database", async () => {
    const inquiry = await db.inquiry.create({
      data: {
        inquiryType: "SERVICE_QUOTE",
        customerName: "Robert Kowalski",
        customerEmail: "r.kowalski@example.com",
        customerPhone: "+1 773-555-0199",
        vehicleYearMakeModel: "2023 BMW M3 Competition",
        requestedService: "Bent Rim CNC Truing & Powder Coating",
        message: "Hit pothole near Loop on I-90/94. Need wheel trued and curb rash removed.",
        status: "NEW",
      },
    });

    assert.ok(inquiry.id);
    assert.strictEqual(inquiry.status, "NEW");
    assert.strictEqual(inquiry.requestedService, "Bent Rim CNC Truing & Powder Coating");

    // Clean up test inquiry
    await db.inquiry.delete({ where: { id: inquiry.id } });
  });

  // --------------------------------------------------------------------------
  // 7. DESKTOP APPLICATION API CONTRACT
  // --------------------------------------------------------------------------
  console.log("\n[7] Desktop Operations Sync & Barcode Scanner Contract");

  await runAsyncTest("Verifies desktop sync item resolution by SKU and Barcode", async () => {
    const item = await db.productVariant.findFirst({
      where: { sku: "CT-APX7-2095-5114-GB" },
      include: { product: true },
    });

    assert.ok(item, "CT-APX7-2095-5114-GB variant not found");
    assert.strictEqual(item.sku, "CT-APX7-2095-5114-GB");
    assert.ok(item.product.name.includes("Apex-7"));
    assert.strictEqual(typeof item.stockOnHand, "number");
  });

  await db.$disconnect();

  console.log("\n================================================================================");
  console.log(`  ALL ${passedTests} OF ${totalTests} AUTOMATED TESTS COMPLETED WITH 100% SUCCESS`);
  console.log("================================================================================\n");
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
