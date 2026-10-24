"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  ShoppingCart,
  Heart,
  Share2,
  Wrench,
  Gauge,
  Phone,
} from "lucide-react";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    productType: string;
    description: string;
    shortDescription?: string | null;
    basePrice: number;
    salePrice?: number | null;
    primaryImage: string;
    galleryImages: string; // JSON string
    technicalSpecs: string; // JSON string
    brand?: { name: string } | null;
    category?: { name: string; slug: string } | null;
    variants: Array<{
      id: string;
      sku: string;
      barcode?: string | null;
      diameter?: number | null;
      width?: number | null;
      boltPattern?: string | null;
      offset?: number | null;
      centerBore?: number | null;
      finish?: string | null;
      tireWidth?: number | null;
      aspectRatio?: number | null;
      speedRating?: string | null;
      season?: string | null;
      price: number;
      salePrice?: number | null;
      stockOnHand: number;
      stockReserved: number;
      weightLbs?: number | null;
    }>;
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();

  // Parse images & specs
  let gallery: string[] = [];
  try {
    gallery = JSON.parse(product.galleryImages);
  } catch {
    gallery = [product.primaryImage];
  }
  if (!gallery.includes(product.primaryImage)) {
    gallery.unshift(product.primaryImage);
  }

  let specs: Record<string, string> = {};
  try {
    specs = JSON.parse(product.technicalSpecs);
  } catch {
    specs = {};
  }

  // Selected variant state
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [selectedImage, setSelectedImage] = useState<string>(gallery[0] || product.primaryImage);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const currentVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const currentPrice = currentVariant?.price || product.salePrice || product.basePrice;
  const isAvailable = currentVariant ? currentVariant.stockOnHand > 0 : false;
  const maxAvailable = currentVariant ? currentVariant.stockOnHand : 0;

  // Build spec summary
  let specsSummary = "";
  if (currentVariant?.diameter && currentVariant?.width) {
    specsSummary = `${currentVariant.diameter}"x${currentVariant.width}" ${currentVariant.boltPattern || ""} ET${currentVariant.offset || ""} ${currentVariant.finish || ""}`.trim();
  } else if (currentVariant?.tireWidth && currentVariant?.aspectRatio) {
    specsSummary = `${currentVariant.tireWidth}/${currentVariant.aspectRatio}R${currentVariant.diameter || ""} (${currentVariant.speedRating || ""})`.trim();
  } else {
    specsSummary = currentVariant?.finish || "Standard";
  }

  const handleAddToCart = () => {
    if (!currentVariant || !isAvailable) return;

    addItem({
      variantId: currentVariant.id,
      productId: product.id,
      name: product.name,
      sku: currentVariant.sku,
      price: currentPrice,
      quantity: Math.min(quantity, maxAvailable),
      image: selectedImage,
      specs: specsSummary,
      stockOnHand: currentVariant.stockOnHand,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mb-8">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-white transition-colors">
          Catalog
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/shop?category=${product.category.slug}`}
              className="hover:text-white transition-colors uppercase"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-300 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery Column */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square bg-[#111317] border border-[#22262E] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover transition-all duration-300"
              priority
            />
          </div>

          {/* Thumbnails row */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? "border-[#D71920] shadow-glow-subtle"
                      : "border-[#22262E] hover:border-gray-500 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name} preview ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Variant Config Column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D71920]">
                {product.brand?.name || "Chi-Town Customs USA"}
              </span>
              <span className="text-xs text-gray-500 font-mono">SKU: {currentVariant?.sku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{product.description}</p>
          </div>

          {/* Dynamic Authoritative Pricing & Stock */}
          <div className="p-4 bg-[#111317] border border-[#22262E] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase text-gray-400 block font-bold">
                Price Per {product.productType === "TIRE" ? "Tire" : "Wheel"}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  ${currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                {product.salePrice && product.salePrice < product.basePrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.basePrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              {isAvailable ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{currentVariant.stockOnHand} In Stock &bull; Chicago</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Custom Build Order (7-10 Days)</span>
                </div>
              )}
            </div>
          </div>

          {/* Variant Selector Matrix */}
          {product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
                Select Wheel Specification / Finish
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  const label =
                    v.diameter && v.width
                      ? `${v.diameter}"x${v.width}" | ${v.boltPattern} | ${v.finish || ""}`
                      : v.tireWidth && v.aspectRatio
                      ? `${v.tireWidth}/${v.aspectRatio}R${v.diameter} (${v.speedRating})`
                      : v.finish || v.sku;

                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariantId(v.id);
                        setQuantity(1);
                      }}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "bg-[#D71920]/15 border-[#D71920] shadow-glow-subtle"
                          : "bg-[#08090B] border-[#292D34] hover:border-gray-500"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-xs font-bold text-white leading-tight">{label}</span>
                        <span className="text-xs font-black text-white shrink-0">
                          ${v.price.toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                        <span>SKU: {v.sku}</span>
                        <span className={v.stockOnHand > 0 ? "text-emerald-400" : "text-amber-400"}>
                          {v.stockOnHand > 0 ? `${v.stockOnHand} in shop` : "Order"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector & Add to Cart */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            {/* Quantity */}
            <div className="flex items-center border border-[#292D34] bg-[#111317] rounded-lg p-1.5 w-full sm:w-auto justify-between">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-gray-400 hover:text-white rounded hover:bg-[#191C21]"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-mono font-bold text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(maxAvailable || 99, quantity + 1))}
                className="p-2 text-gray-400 hover:text-white rounded hover:bg-[#191C21]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={added || !isAvailable}
              className={`flex-1 w-full py-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                added
                  ? "bg-emerald-600 text-white"
                  : isAvailable
                  ? "btn-primary shadow-glow-red"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
              }`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Added to Cart
                </>
              ) : isAvailable ? (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add {quantity} to Cart &bull; $
                  {(currentPrice * quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </>
              ) : (
                "Out of Stock &bull; Call (773) 287-3000"
              )}
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="border-t border-[#22262E] pt-6 space-y-3 text-xs text-gray-300">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#D71920] shrink-0" />
              <span>
                <strong>Free In-Store Pickup:</strong> 311 N Cicero Ave, Chicago, IL 60644. Ready in 24 hours.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>100% Fitment Guarantee:</strong> Guaranteed brake clearance and correct PCD offset.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D71920] shrink-0" />
              <span>
                Have fitment questions? Speak to a Chicago technician at{" "}
                <a href="tel:+17732873000" className="text-white font-bold underline">
                  +1 773-287-3000
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Table */}
      {Object.keys(specs).length > 0 && (
        <div className="mt-16 bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-6 border-b border-[#22262E] pb-3">
            Technical Engineering Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="p-3 bg-[#08090B] rounded-lg border border-[#22262E] space-y-1">
                <span className="text-gray-500 font-bold uppercase tracking-wider block">{key}</span>
                <span className="text-white font-semibold text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
