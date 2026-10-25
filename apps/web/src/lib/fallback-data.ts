export interface FallbackVariant {
  id: string;
  sku: string;
  price: number;
  diameter?: number;
  width?: number;
  boltPattern?: string;
  offset?: number;
  finish?: string;
  tireWidth?: number;
  aspectRatio?: number;
  season?: string;
  stockOnHand: number;
}

export interface FallbackProduct {
  id: string;
  name: string;
  slug: string;
  productType: string;
  description: string;
  shortDescription?: string;
  basePrice: number;
  salePrice?: number | null;
  primaryImage: string;
  galleryImages: string;
  technicalSpecs?: string;
  brand?: { name: string; slug: string };
  category?: { name: string; slug: string };
  variants: FallbackVariant[];
}

export const FALLBACK_CATEGORIES = [
  { id: "cat-1", name: "Custom Wheels", slug: "custom-wheels" },
  { id: "cat-2", name: "Performance Tires", slug: "performance-tires" },
  { id: "cat-3", name: "Shop Services", slug: "services" },
];

export const FALLBACK_BRANDS = [
  { id: "br-1", name: "Apex Forge", slug: "apex-forge" },
  { id: "br-2", name: "Michelin", slug: "michelin" },
  { id: "br-3", name: "Continental", slug: "continental" },
  { id: "br-4", name: "Chi-Town In-House", slug: "chi-town" },
];

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  {
    id: "whl-apx-01",
    name: "Chi-Town Apex-7 Forged Monoblock",
    slug: "apex-7-forged",
    productType: "WHEEL",
    description: "Aerospace-grade 6061-T6 forged monoblock wheel engineered for high-performance track and street setups in Chicago.",
    shortDescription: "Ultra-lightweight 6061-T6 forged rim",
    basePrice: 1150,
    primaryImage: "/images/wheel-apex7.jpg",
    galleryImages: JSON.stringify(["/images/wheel-apex7.jpg", "/images/finishes-showcase.jpg"]),
    technicalSpecs: JSON.stringify({ diameter: "20", width: "9.5", boltPattern: "5x114.3", offset: "35" }),
    brand: { name: "Apex Forge", slug: "apex-forge" },
    category: { name: "Custom Wheels", slug: "custom-wheels" },
    variants: [
      { id: "var-01", sku: "CT-APX7-2095-5114-GB", price: 1150, diameter: 20, width: 9.5, boltPattern: "5x114.3", offset: 35, finish: "Gloss Black", stockOnHand: 8 }
    ]
  },
  {
    id: "whl-apx-02",
    name: "Chi-Town Veloce Track-Spec",
    slug: "veloce-track-spec",
    productType: "WHEEL",
    description: "Multi-spoke forged competition wheel designed for extreme rigidity, heat dissipation, and big brake kit clearance.",
    shortDescription: "High-rigidity competition forged wheel",
    basePrice: 1280,
    primaryImage: "/images/wheel-streetviper.jpg",
    galleryImages: JSON.stringify(["/images/wheel-streetviper.jpg", "/images/wheel-apex7.jpg"]),
    technicalSpecs: JSON.stringify({ diameter: "21", width: "10.5", boltPattern: "5x120", offset: "28" }),
    brand: { name: "Apex Forge", slug: "apex-forge" },
    category: { name: "Custom Wheels", slug: "custom-wheels" },
    variants: [
      { id: "var-02", sku: "CT-VEL-2110-5120-BB", price: 1280, diameter: 21, width: 10.5, boltPattern: "5x120", offset: 28, finish: "Brushed Bronze", stockOnHand: 4 }
    ]
  },
  {
    id: "tire-ps4s-01",
    name: "Michelin Pilot Sport 4S",
    slug: "michelin-pilot-sport-4s",
    productType: "TIRE",
    description: "Ultra-high performance summer tire delivering maximum grip and steering precision on dry and wet pavement.",
    shortDescription: "Flagship max performance summer tire",
    basePrice: 380,
    primaryImage: "/images/michelin-ps4s.jpg",
    galleryImages: JSON.stringify(["/images/michelin-ps4s.jpg", "/images/michelin-ps4s-tread.jpg"]),
    technicalSpecs: JSON.stringify({ tireWidth: 275, aspectRatio: 35, diameter: 20, speedRating: "Y", season: "Summer" }),
    brand: { name: "Michelin", slug: "michelin" },
    category: { name: "Performance Tires", slug: "performance-tires" },
    variants: [
      { id: "var-03", sku: "TIR-PS4S-2753520", price: 380, tireWidth: 275, aspectRatio: 35, diameter: 20, season: "Summer", stockOnHand: 16 }
    ]
  },
  {
    id: "tire-dws06-01",
    name: "Continental ExtremeContact DWS06 Plus",
    slug: "continental-extremecontact-dws06",
    productType: "TIRE",
    description: "True all-season ultra-high performance tire tuned specifically for demanding Midwest wet, dry, and light snow conditions.",
    shortDescription: "Chicago all-season performance standard",
    basePrice: 310,
    primaryImage: "/images/continental-dws06.jpg",
    galleryImages: JSON.stringify(["/images/continental-dws06.jpg", "/images/continental-dws06-tread.jpg"]),
    technicalSpecs: JSON.stringify({ tireWidth: 255, aspectRatio: 35, diameter: 19, speedRating: "W", season: "All-Season" }),
    brand: { name: "Continental", slug: "continental" },
    category: { name: "Performance Tires", slug: "performance-tires" },
    variants: [
      { id: "var-04", sku: "TIR-DWS-2553519", price: 310, tireWidth: 255, aspectRatio: 35, diameter: 19, season: "All-Season", stockOnHand: 12 }
    ]
  },
  {
    id: "srv-repair-01",
    name: "Precision CNC Wheel Straightening & Repair",
    slug: "precision-wheel-straightening",
    productType: "SERVICE",
    description: "Hydraulic dial-indicator straightening restoring bent or pothole-damaged alloy rims to factory runout tolerances.",
    shortDescription: "Chicago pothole bend restoration",
    basePrice: 150,
    primaryImage: "/images/service-straightening.jpg",
    galleryImages: JSON.stringify(["/images/service-straightening.jpg"]),
    technicalSpecs: JSON.stringify({ serviceDuration: "2-4 hours", warranty: "Lifetime Trueness Guarantee" }),
    brand: { name: "Chi-Town In-House", slug: "chi-town" },
    category: { name: "Shop Services", slug: "services" },
    variants: [
      { id: "var-05", sku: "SRV-STR-STANDARD", price: 150, stockOnHand: 999 }
    ]
  },
  {
    id: "srv-powder-01",
    name: "Full Custom Powder Coating Package",
    slug: "custom-powder-coating",
    productType: "SERVICE",
    description: "Multi-stage chemical stripping, outgas baking, high-voltage electrostatic powder coat, and clear coat cure.",
    shortDescription: "Industrial durable 4-stage finish",
    basePrice: 200,
    primaryImage: "/images/service-powder-coating.jpg",
    galleryImages: JSON.stringify(["/images/service-powder-coating.jpg"]),
    technicalSpecs: JSON.stringify({ finishes: "Gloss Black, Satin Bronze, Hyper Silver, Candy Red", warranty: "3-Year Adhesion" }),
    brand: { name: "Chi-Town In-House", slug: "chi-town" },
    category: { name: "Shop Services", slug: "services" },
    variants: [
      { id: "var-06", sku: "SRV-PWC-SET", price: 200, stockOnHand: 999 }
    ]
  }
];
