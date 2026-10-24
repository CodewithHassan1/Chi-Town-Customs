import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = "chitown_salt_2026";
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

async function main() {
  console.log("🚀 Starting Chi-Town Customs USA database seed...");

  // 1. Clean existing records if any
  await prisma.auditLog.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.fitmentRecord.deleteMany();
  await prisma.cMSSection.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned database tables.");

  // 2. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      name: "Marcus Vance (Owner)",
      email: "admin@chitowncustoms.com",
      passwordHash: hashPassword("ChiTownAdmin2026!"),
      role: "SUPER_ADMIN",
      phone: "+1 773-287-3000",
    },
  });

  const shopStaff = await prisma.user.create({
    data: {
      name: "Darius Miller (Lead Tech)",
      email: "shop@chitowncustoms.com",
      passwordHash: hashPassword("ChiTownStaff2026!"),
      role: "INVENTORY_MANAGER",
      phone: "+1 773-287-3000",
    },
  });

  const demoCustomer = await prisma.user.create({
    data: {
      name: "Alexander Hayes",
      email: "alex.hayes@example.com",
      passwordHash: hashPassword("Customer123!"),
      role: "CUSTOMER",
      phone: "+1 312-555-0182",
    },
  });

  console.log("👤 Created Admin and Staff users.");

  // 3. Create Categories
  const catWheels = await prisma.category.create({
    data: {
      name: "Custom Wheels & Rims",
      slug: "custom-wheels",
      description: "Forged monoblock, multi-piece modular, and flow-formed lightweight rims.",
      imageUrl: "/images/wheel-forged.jpg",
      sortOrder: 1,
    },
  });

  const catTires = await prisma.category.create({
    data: {
      name: "Performance Tires",
      slug: "performance-tires",
      description: "Ultra-high performance summer, all-season, and track-rated street tires.",
      imageUrl: "/images/tire-performance.jpg",
      sortOrder: 2,
    },
  });

  const catPackages = await prisma.category.create({
    data: {
      name: "Wheel & Tire Packages",
      slug: "wheel-tire-packages",
      description: "Mounted, high-speed road-force balanced, TPMS installed packages ready to bolt on.",
      imageUrl: "/images/hero-car.jpg",
      sortOrder: 3,
    },
  });

  const catServices = await prisma.category.create({
    data: {
      name: "Wheel Repair & Powder Coating",
      slug: "wheel-repair-services",
      description: "Bent rim straightening, TIG crack welding, curb rash CNC restoration, and custom powder coat.",
      imageUrl: "/images/wheel-repair.jpg",
      sortOrder: 4,
    },
  });

  // 4. Create Brands
  const brandChiTown = await prisma.brand.create({
    data: {
      name: "Chi-Town Forged",
      slug: "chi-town-forged",
      logoUrl: "/images/logo.svg",
      description: "Bespoke aerospace-grade 6061-T6 forged aluminum wheels engineered and finished in Chicago.",
    },
  });

  const brandMichelin = await prisma.brand.create({
    data: {
      name: "Michelin",
      slug: "michelin",
      description: "World-class ultra high performance tires with benchmark wet and dry grip.",
    },
  });

  const brandContinental = await prisma.brand.create({
    data: {
      name: "Continental",
      slug: "continental",
      description: "German-engineered premium all-season performance tires.",
    },
  });

  // 5. Create Products & Variants
  // Product 1: Chi-Town Apex-7 Monoblock
  const prodApex = await prisma.product.create({
    data: {
      name: "Chi-Town Apex-7 Forged Monoblock",
      slug: "chi-town-apex-7-forged-monoblock",
      brandId: brandChiTown.id,
      categoryId: catWheels.id,
      productType: "WHEEL",
      description:
        "The Chi-Town Apex-7 is our flagship forged monoblock wheel, machined from aerospace-spec 6061-T6 forged aluminum for extreme structural rigidity and ultra-low unsprung rotational mass. Engineered specifically for high-horsepower sports cars, luxury coupes, and aggressive widebody stances.",
      shortDescription: "Ultra-lightweight 6061-T6 forged monoblock wheel with deep concave profile.",
      basePrice: 849.0,
      salePrice: 799.0,
      costPrice: 420.0,
      primaryImage: "/images/wheel-forged.jpg",
      galleryImages: JSON.stringify([
        "/images/wheel-forged.jpg",
        "/images/finishes-showcase.jpg",
        "/images/hero-car.jpg",
      ]),
      technicalSpecs: JSON.stringify({
        Material: "Aerospace Grade 6061-T6 Forged Aluminum",
        Construction: "1-Piece Forged Monoblock",
        LoadRating: "1,950 lbs per wheel",
        TPMSCompatible: "Yes, 100% OEM and Aftermarket TPMS Compatible",
        BrakeClearance: "Engineered for Brembo, AP Racing, and Ceramic Big Brake Kits",
        Warranty: "Lifetime Structural Warranty & 3-Year Finish Guarantee",
      }),
      isFeatured: true,
      isActive: true,
    },
  });

  // Variants for Apex-7
  const varApex1 = await prisma.productVariant.create({
    data: {
      productId: prodApex.id,
      sku: "CT-APX7-2095-5114-GB",
      barcode: "84029100101",
      diameter: 20,
      width: 9.5,
      boltPattern: "5x114.3",
      offset: 35,
      centerBore: 70.6,
      finish: "Gloss Piano Black",
      price: 799.0,
      costPrice: 420.0,
      stockOnHand: 16,
      stockReserved: 4,
      reorderLevel: 4,
      weightLbs: 21.4,
    },
  });

  const varApex2 = await prisma.productVariant.create({
    data: {
      productId: prodApex.id,
      sku: "CT-APX7-20105-5114-GB",
      barcode: "84029100102",
      diameter: 20,
      width: 10.5,
      boltPattern: "5x114.3",
      offset: 42,
      centerBore: 70.6,
      finish: "Gloss Piano Black",
      price: 849.0,
      costPrice: 450.0,
      stockOnHand: 12,
      stockReserved: 0,
      reorderLevel: 4,
      weightLbs: 22.8,
    },
  });

  const varApex3 = await prisma.productVariant.create({
    data: {
      productId: prodApex.id,
      sku: "CT-APX7-2095-5120-BT",
      barcode: "84029100103",
      diameter: 20,
      width: 9.5,
      boltPattern: "5x120",
      offset: 32,
      centerBore: 72.6,
      finish: "Brushed Liquid Smoke Titanium",
      price: 899.0,
      costPrice: 470.0,
      stockOnHand: 8,
      stockReserved: 0,
      reorderLevel: 2,
      weightLbs: 21.6,
    },
  });

  const varApex4 = await prisma.productVariant.create({
    data: {
      productId: prodApex.id,
      sku: "CT-APX7-2095-5112-SB",
      barcode: "84029100104",
      diameter: 20,
      width: 9.5,
      boltPattern: "5x112",
      offset: 28,
      centerBore: 66.6,
      finish: "Satin Bronze Gold",
      price: 879.0,
      costPrice: 460.0,
      stockOnHand: 6,
      stockReserved: 2,
      reorderLevel: 4,
      weightLbs: 21.5,
    },
  });

  // Product 2: Chi-Town StreetViper 2-Piece Modular
  const prodViper = await prisma.product.create({
    data: {
      name: "Chi-Town StreetViper 2-Piece Modular",
      slug: "chi-town-streetviper-2-piece-modular",
      brandId: brandChiTown.id,
      categoryId: catWheels.id,
      productType: "WHEEL",
      description:
        "The StreetViper features a stepped spun forged aluminum outer rim lip paired with an aggressive precision CNC-machined center face secured with stainless steel titanium hardware. Custom offset options allow for maximum deep-dish lip depth.",
      shortDescription: "Deep dish 2-piece modular forged wheel with stainless perimeter hardware.",
      basePrice: 1050.0,
      salePrice: 995.0,
      costPrice: 580.0,
      primaryImage: "/images/finishes-showcase.jpg",
      galleryImages: JSON.stringify([
        "/images/finishes-showcase.jpg",
        "/images/wheel-forged.jpg",
      ]),
      technicalSpecs: JSON.stringify({
        Material: "6061-T6 Center Face + 6061 Forged Spun Lip",
        Construction: "2-Piece Modular Welded/Fastened Assembly",
        Fasteners: "ARP Grade-5 Titanium Assembly Bolts",
        LipFinish: "Mirror Polished Chrome / Gloss Black Inner",
      }),
      isFeatured: true,
      isActive: true,
    },
  });

  const varViper1 = await prisma.productVariant.create({
    data: {
      productId: prodViper.id,
      sku: "CT-VIPR-2095-5114-CR",
      barcode: "84029100201",
      diameter: 20,
      width: 9.5,
      boltPattern: "5x114.3",
      offset: 25,
      centerBore: 70.6,
      finish: "Gloss Candy Apple Red",
      price: 995.0,
      costPrice: 580.0,
      stockOnHand: 8,
      stockReserved: 0,
      reorderLevel: 2,
      weightLbs: 24.1,
    },
  });

  // Product 3: Michelin Pilot Sport 4S
  const prodTire1 = await prisma.product.create({
    data: {
      name: "Michelin Pilot Sport 4S Ultra-High Performance",
      slug: "michelin-pilot-sport-4s",
      brandId: brandMichelin.id,
      categoryId: catTires.id,
      productType: "TIRE",
      description:
        "The benchmark in ultra-high performance street tires. Featuring multi-compound technology with hybrid rubber elastomer outer shoulder for dry cornering traction and silica-enriched inner ribs for phenomenal wet braking.",
      shortDescription: "The gold standard summer performance tire for sports cars and exotics.",
      basePrice: 389.0,
      salePrice: 369.0,
      costPrice: 245.0,
      primaryImage: "/images/tire-performance.jpg",
      galleryImages: JSON.stringify(["/images/tire-performance.jpg"]),
      technicalSpecs: JSON.stringify({
        UTQG: "300 AA A",
        Type: "Max Performance Summer",
        SpeedRating: "Y (186+ MPH)",
        Warranty: "30,000 Mile Manufacturer Treadwear Warranty",
      }),
      isFeatured: true,
      isActive: true,
    },
  });

  const varTire1 = await prisma.productVariant.create({
    data: {
      productId: prodTire1.id,
      sku: "MICH-PS4S-255-35-20",
      barcode: "08669910101",
      tireWidth: 255,
      aspectRatio: 35,
      diameter: 20,
      speedRating: "Y",
      season: "Summer",
      price: 369.0,
      costPrice: 245.0,
      stockOnHand: 24,
      stockReserved: 4,
      reorderLevel: 8,
      weightLbs: 26.5,
    },
  });

  const varTire2 = await prisma.productVariant.create({
    data: {
      productId: prodTire1.id,
      sku: "MICH-PS4S-295-30-20",
      barcode: "08669910102",
      tireWidth: 295,
      aspectRatio: 30,
      diameter: 20,
      speedRating: "Y",
      season: "Summer",
      price: 449.0,
      costPrice: 295.0,
      stockOnHand: 16,
      stockReserved: 2,
      reorderLevel: 4,
      weightLbs: 29.2,
    },
  });

  // Product 4: Continental ExtremeContact DWS06 Plus
  const prodTire2 = await prisma.product.create({
    data: {
      name: "Continental ExtremeContact DWS06 Plus",
      slug: "continental-extremecontact-dws06-plus",
      brandId: brandContinental.id,
      categoryId: catTires.id,
      productType: "TIRE",
      description:
        "True all-season ultra high performance engineered for Chicago climates. SportPlus Technology delivers responsive handling, exceptional wet braking, and confidence in light snow and slush.",
      shortDescription: "Premium all-season performance tire engineered for dry, wet, and Chicago snow.",
      basePrice: 289.0,
      salePrice: 269.0,
      costPrice: 175.0,
      primaryImage: "/images/tire-performance.jpg",
      galleryImages: JSON.stringify(["/images/tire-performance.jpg"]),
      technicalSpecs: JSON.stringify({
        UTQG: "560 A A",
        Type: "Ultra High Performance All-Season",
        SpeedRating: "W (168 MPH)",
        Warranty: "50,000 Mile Manufacturer Treadwear Warranty",
      }),
      isFeatured: false,
      isActive: true,
    },
  });

  const varTire3 = await prisma.productVariant.create({
    data: {
      productId: prodTire2.id,
      sku: "CONT-DWS6P-275-35-20",
      barcode: "05134210201",
      tireWidth: 275,
      aspectRatio: 35,
      diameter: 20,
      speedRating: "W",
      season: "All-Season",
      price: 269.0,
      costPrice: 175.0,
      stockOnHand: 20,
      stockReserved: 0,
      reorderLevel: 8,
      weightLbs: 27.8,
    },
  });

  // Product 5: Precision Wheel Repair & Powder Coating Package (Service)
  const prodService = await prisma.product.create({
    data: {
      name: "Precision Wheel Repair & Custom Powder Coating Package",
      slug: "precision-wheel-repair-powder-coating",
      brandId: brandChiTown.id,
      categoryId: catServices.id,
      productType: "SERVICE",
      description:
        "Comprehensive restoration of damaged wheels at our 311 N Cicero Ave Chicago facility. Includes hydraulic CNC truing of bent rims, aircraft-grade TIG welding for cracks, curb rash resurfacing, chemical stripping, and electrostatic powder coating in your choice of custom finish (Candy Red, Bronze, Titanium, or Piano Black).",
      shortDescription: "Complete bent rim truing, crack welding, and custom electrostatic powder coat.",
      basePrice: 175.0,
      salePrice: 175.0,
      primaryImage: "/images/wheel-repair.jpg",
      galleryImages: JSON.stringify([
        "/images/wheel-repair.jpg",
        "/images/finishes-showcase.jpg",
      ]),
      technicalSpecs: JSON.stringify({
        TurnaroundTime: "24-48 Hours (Same-Day Emergency Service Available)",
        Equipment: "Hydraulic Computerized Truing Lathe & Miller TIG Arc Welder",
        CuringProcess: "400°F Industrial Oven Electrostatic Bake",
        Warranty: "100% Trueness Guarantee (< 0.015\" Radial Runout) & 2-Year Powder Adhesion Warranty",
      }),
      isFeatured: true,
      isActive: true,
    },
  });

  const varService1 = await prisma.productVariant.create({
    data: {
      productId: prodService.id,
      sku: "SVC-WHEEL-REPAIR-FULL",
      barcode: "84029190001",
      finish: "Custom Selection",
      price: 175.0,
      stockOnHand: 999, // Service capacity
      reorderLevel: 10,
    },
  });

  console.log("🛠️ Products and variants seeded.");

  // 6. Record Initial Inventory Movements (The Auditable Ledger)
  await prisma.inventoryMovement.createMany({
    data: [
      {
        variantId: varApex1.id,
        movementType: "RECEIPT",
        quantityDelta: 20,
        balanceAfter: 20,
        referenceType: "PURCHASE_RECEIPT",
        referenceId: "PO-2026-001",
        reason: "Initial manufacturer batch arrival from forge facility",
        staffUserId: superAdmin.id,
      },
      {
        variantId: varApex1.id,
        movementType: "RESERVATION",
        quantityDelta: -4,
        balanceAfter: 16,
        referenceType: "ORDER",
        referenceId: "ORD-CHI-1001",
        reason: "Reserved for customer order ORD-CHI-1001",
        staffUserId: shopStaff.id,
      },
      {
        variantId: varApex2.id,
        movementType: "RECEIPT",
        quantityDelta: 12,
        balanceAfter: 12,
        referenceType: "PURCHASE_RECEIPT",
        referenceId: "PO-2026-001",
        reason: "Initial forged stock receipt",
        staffUserId: superAdmin.id,
      },
      {
        variantId: varTire1.id,
        movementType: "RECEIPT",
        quantityDelta: 28,
        balanceAfter: 28,
        referenceType: "PURCHASE_RECEIPT",
        referenceId: "PO-2026-002",
        reason: "Michelin direct distributor shipment",
        staffUserId: shopStaff.id,
      },
      {
        variantId: varTire1.id,
        movementType: "RESERVATION",
        quantityDelta: -4,
        balanceAfter: 24,
        referenceType: "ORDER",
        referenceId: "ORD-CHI-1001",
        reason: "Reserved for customer package mount & balance",
        staffUserId: shopStaff.id,
      },
    ],
  });

  console.log("📊 Inventory movements ledger initialized.");

  // 7. Seed Vehicle Fitment Records
  await prisma.fitmentRecord.createMany({
    data: [
      {
        year: 2024,
        make: "Ford",
        model: "Mustang",
        trim: "GT / Dark Horse",
        boltPattern: "5x114.3",
        minDiameter: 19.0,
        maxDiameter: 21.0,
        minOffset: 30,
        maxOffset: 45,
        tireSizeFront: "255/35ZR20",
        tireSizeRear: "295/30ZR20",
        notes: "Direct bolt-on with flush fitment. Clears Brembo 6-piston front calipers.",
        isVerified: true,
      },
      {
        year: 2023,
        make: "Chevrolet",
        model: "Corvette",
        trim: "Stingray / Z06 (C8)",
        boltPattern: "5x120",
        minDiameter: 19.0,
        maxDiameter: 21.0,
        minOffset: 35,
        maxOffset: 52,
        tireSizeFront: "245/35ZR19",
        tireSizeRear: "305/30ZR20",
        notes: "Staggered setup mandatory for traction control sensors.",
        isVerified: true,
      },
      {
        year: 2024,
        make: "BMW",
        model: "M3 / M4",
        trim: "Competition G80/G82",
        boltPattern: "5x112",
        minDiameter: 19.0,
        maxDiameter: 21.0,
        minOffset: 18,
        maxOffset: 32,
        tireSizeFront: "275/35ZR19",
        tireSizeRear: "285/30ZR20",
        notes: "Direct bolt-on fitment. Clears M Compound and Carbon Ceramic brakes.",
        isVerified: true,
      },
      {
        year: 2023,
        make: "Dodge",
        model: "Charger",
        trim: "Scat Pack / Hellcat Widebody",
        boltPattern: "5x115",
        minDiameter: 20.0,
        maxDiameter: 22.0,
        minOffset: 15,
        maxOffset: 25,
        tireSizeFront: "305/35ZR20",
        tireSizeRear: "305/35ZR20",
        notes: "Aggressive concave widebody fitment. Clears 6-piston front Brembos.",
        isVerified: true,
      },
      {
        year: 2024,
        make: "Tesla",
        model: "Model 3 / Model Y",
        trim: "Performance",
        boltPattern: "5x114.3",
        minDiameter: 19.0,
        maxDiameter: 21.0,
        minOffset: 34,
        maxOffset: 45,
        tireSizeFront: "255/35ZR20",
        tireSizeRear: "275/35ZR20",
        notes: "Load rating must be at least 1,850 lbs per wheel for battery weight rating.",
        isVerified: true,
      },
    ],
  });

  console.log("🚗 Vehicle fitment records populated.");

  // 8. Seed Initial Demonstration Order
  const demoOrder = await prisma.order.create({
    data: {
      orderNumber: "ORD-CHI-1001",
      userId: demoCustomer.id,
      guestEmail: demoCustomer.email,
      guestName: demoCustomer.name,
      guestPhone: demoCustomer.phone,
      status: "PROCESSING",
      paymentStatus: "PAID",
      paymentMethod: "STRIPE_CARD",
      paymentId: "pi_demo_3N8xKaChiTown2026",
      fulfillmentType: "LOCAL_PICKUP",
      subtotal: 4672.0,
      taxAmount: 478.88,
      shippingAmount: 0.0,
      discountAmount: 0.0,
      totalAmount: 5150.88,
      shippingAddressJson: JSON.stringify({
        name: "Alexander Hayes",
        street: "311 N Cicero Ave",
        city: "Chicago",
        state: "IL",
        zipCode: "60644",
        country: "US",
        type: "IN_STORE_PICKUP",
      }),
      billingAddressJson: JSON.stringify({
        name: "Alexander Hayes",
        street: "1440 N Lake Shore Dr Apt 12B",
        city: "Chicago",
        state: "IL",
        zipCode: "60610",
        country: "US",
      }),
      internalNotes: "Customer requested installation on 2024 Mustang GT Dark Horse. Scheduled pickup Saturday morning.",
    },
  });

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: demoOrder.id,
        variantId: varApex1.id,
        productName: "Chi-Town Apex-7 Forged Monoblock",
        variantSku: varApex1.sku,
        specsSummary: "20x9.5 | 5x114.3 | ET35 | Gloss Piano Black",
        unitPrice: 799.0,
        quantity: 4,
        lineTotal: 3196.0,
      },
      {
        orderId: demoOrder.id,
        variantId: varTire1.id,
        productName: "Michelin Pilot Sport 4S Ultra-High Performance",
        variantSku: varTire1.sku,
        specsSummary: "255/35ZR20 (97Y) Summer",
        unitPrice: 369.0,
        quantity: 4,
        lineTotal: 1476.0,
      },
    ],
  });

  await prisma.payment.create({
    data: {
      orderId: demoOrder.id,
      amount: 5150.88,
      currency: "USD",
      status: "SUCCESS",
      provider: "STRIPE",
      transactionRef: "ch_demo_9921_success",
    },
  });

  console.log("💳 Initial order and payment created.");

  // 9. Seed Inquiries (Quotes, Appointments, Financing Leads)
  await prisma.inquiry.createMany({
    data: [
      {
        inquiryType: "SERVICE_QUOTE",
        customerName: "Derrick Vance",
        customerEmail: "dvance@chicagolaw.com",
        customerPhone: "+1 312-555-8942",
        vehicleYearMakeModel: "2022 BMW M4 Competition",
        requestedService: "Curb rash repair & powder coat in Brushed Titanium",
        message:
          "Right rear 20\" wheel contacted curb on Wacker Drive. Noticeable scrape around 6 inches of outer lip. Need quote and appointment.",
        status: "NEW",
        assignedStaffId: shopStaff.id,
      },
      {
        inquiryType: "FINANCING_LEAD",
        customerName: "Marcus Washington",
        customerEmail: "marcus.w@gmail.com",
        customerPhone: "+1 773-555-3141",
        vehicleYearMakeModel: "2021 Dodge Charger Scat Pack",
        requestedService: "Chi-Town Apex-7 Wheel & Tire Package",
        message:
          "Looking to pre-qualify for 100-day cash payoff option through Snap Finance or Acima. Package total approx $4,200.",
        status: "IN_PROGRESS",
        internalNotes: "Pre-qualification referral link sent via SMS. Awaiting provider reference callback.",
        assignedStaffId: superAdmin.id,
      },
      {
        inquiryType: "APPOINTMENT_REQUEST",
        customerName: "Elena Rostova",
        customerEmail: "elena.r@lifestyleauto.com",
        customerPhone: "+1 847-555-0922",
        vehicleYearMakeModel: "2023 Porsche 911 Carrera S",
        requestedService: "Road-Force Wheel Balancing & Precision Alignment",
        preferredDate: "2026-10-30",
        message: "Slight high-speed vibration above 75 MPH on I-90. Need Road Force Elite diagnostic.",
        status: "SCHEDULED",
        assignedStaffId: shopStaff.id,
      },
    ],
  });

  // 10. Seed CMS Sections & Site Settings
  await prisma.cMSSection.createMany({
    data: [
      {
        sectionKey: "hero",
        title: "BUILT TO STAND OUT.",
        subtitle:
          "Chicago's authority for custom forged wheels, ultra-high performance tires, and precision master rim repair.",
        contentJson: JSON.stringify({
          headline: "BUILT TO STAND OUT.",
          subheadline:
            "Engineered with aerospace-grade forged aluminum and finished with artisanal precision. Located at 311 N Cicero Ave in Chicago, Illinois.",
          primaryCtaText: "SHOP CUSTOM WHEELS",
          primaryCtaUrl: "/shop?category=custom-wheels",
          secondaryCtaText: "EXPLORE SERVICES",
          secondaryCtaUrl: "/services",
          phoneCtaText: "+1 773-287-3000",
          phoneCtaUrl: "tel:+17732873000",
          heroImage: "/images/hero-car.jpg",
          badgeText: "CHICAGO'S WHEEL & TIRE AUTHORITY",
        }),
        isVisible: true,
        sortOrder: 1,
      },
      {
        sectionKey: "announcement_bar",
        title: "Top Announcement Bar",
        contentJson: JSON.stringify({
          text: "CHICAGOLAND SPRING SPECIAL: Up to $200 instant savings on custom wheel & tire packages. Call +1 773-287-3000",
          linkUrl: "/shop",
          linkText: "Shop Packages",
          isEnabled: true,
        }),
        isVisible: true,
        sortOrder: 0,
      },
      {
        sectionKey: "shop_trust",
        title: "Shop Trust & Verified Credentials",
        contentJson: JSON.stringify({
          rating: "4.5",
          reviewCount: "207",
          location: "311 N Cicero Ave, Chicago, IL 60644",
          phone: "+1 773-287-3000",
          stats: [
            { label: "Satisfied Drivers", value: "8,500+" },
            { label: "Wheels Restored & Finished", value: "14,000+" },
            { label: "Customer Rating", value: "4.5 ★ (207 Reviews)" },
            { label: "Turnaround Time", value: "24-48 Hours" },
          ],
        }),
        isVisible: true,
        sortOrder: 3,
      },
      {
        sectionKey: "faqs",
        title: "Frequently Asked Questions",
        contentJson: JSON.stringify([
          {
            q: "Can cracked or severely bent aluminum wheels be safely repaired?",
            a: "Yes. Using computerized hydraulic truing equipment and certified aerospace-grade TIG welding, we restore aluminum wheels to strict OEM radial and lateral runout tolerances (under 0.015 inches). If a rim is structurally compromised beyond safe engineering limits, we will advise you honestly.",
          },
          {
            q: "What is the turnaround time for wheel powder coating?",
            a: "Our standard turnaround time is 24 to 48 hours. We chemically strip the wheel down to bare virgin alloy, repair any imperfections, apply aerospace zinc-rich primer, electrostatic color coat, and high-temp clear coat baked at 400°F.",
          },
          {
            q: "Do you offer no-credit-needed financing?",
            a: "Yes. We partner with top automotive financing providers such as Snap Finance and Acima to offer convenient payment options including 100-day cash payoff options. Prequalification is fast and won't affect your primary credit score.",
          },
          {
            q: "How do I ensure custom wheels fit my specific car?",
            a: "You can use our interactive Vehicle Fitment Finder on our website or visit our shop at 311 N Cicero Ave. We calculate bolt pattern (PCD), center bore, offset (ET), and caliper clearance to guarantee 100% rub-free fitment.",
          },
        ]),
        isVisible: true,
        sortOrder: 6,
      },
    ],
  });

  // Site Settings
  await prisma.siteSetting.createMany({
    data: [
      {
        key: "business_info",
        description: "Official business contact and location details",
        valueJson: JSON.stringify({
          businessName: "Chi-Town Customs USA",
          address: "311 N Cicero Ave, Chicago, IL 60644",
          phone: "+1 773-287-3000",
          email: "service@chitowncustoms.com",
          hours: {
            monday_friday: "8:00 AM – 6:00 PM CST",
            saturday: "8:00 AM – 4:00 PM CST",
            sunday: "Closed",
          },
          coordinates: { lat: 41.8863, lng: -87.7457 },
        }),
      },
      {
        key: "commerce_settings",
        description: "Sales tax and shipping rates",
        valueJson: JSON.stringify({
          salesTaxRate: 0.1025, // Cook County / Chicago combined tax
          standardShippingPerWheel: 45.0,
          inStorePickupFree: true,
          currency: "USD",
        }),
      },
      {
        key: "financing_providers",
        description: "Supported customer financing options and URLs",
        valueJson: JSON.stringify({
          snapFinanceEnabled: true,
          acimaEnabled: true,
          affirmEnabled: true,
          disclaimer:
            "Financing decisions and terms are subject to provider approval. Chi-Town Customs USA does not store credit credentials or execute credit decisions directly.",
        }),
      },
    ],
  });

  console.log("🌐 CMS sections and site settings seeded.");
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
