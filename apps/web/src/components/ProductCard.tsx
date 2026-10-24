"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Eye, Check, Star } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    productType: string;
    basePrice: number;
    salePrice?: number | null;
    primaryImage: string;
    shortDescription?: string | null;
    brand?: { name: string } | null;
    category?: { name: string; slug: string } | null;
    variants?: Array<{
      id: string;
      sku: string;
      diameter?: number | null;
      width?: number | null;
      boltPattern?: string | null;
      finish?: string | null;
      tireWidth?: number | null;
      aspectRatio?: number | null;
      price: number;
      stockOnHand: number;
    }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const defaultVariant = product.variants?.[0];
  const displayPrice = defaultVariant?.price || product.salePrice || product.basePrice;
  const isSale = product.salePrice && product.salePrice < product.basePrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultVariant) return;

    let specsSummary = "";
    if (defaultVariant.diameter && defaultVariant.width) {
      specsSummary = `${defaultVariant.diameter}"x${defaultVariant.width}" ${defaultVariant.boltPattern || ""} ${defaultVariant.finish || ""}`.trim();
    } else if (defaultVariant.tireWidth && defaultVariant.aspectRatio) {
      specsSummary = `${defaultVariant.tireWidth}/${defaultVariant.aspectRatio}R${defaultVariant.diameter || ""}`.trim();
    } else {
      specsSummary = defaultVariant.finish || "Standard";
    }

    addItem({
      variantId: defaultVariant.id,
      productId: product.id,
      name: product.name,
      sku: defaultVariant.sku,
      price: displayPrice,
      quantity: 1,
      image: product.primaryImage,
      specs: specsSummary,
      stockOnHand: defaultVariant.stockOnHand,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group bg-[#111317] border border-[#22262E] hover:border-[#3F4552] rounded-xl overflow-hidden transition-all duration-300 flex flex-col hover:shadow-2xl hover:translate-y-[-2px]">
      {/* Product Image Box */}
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square bg-[#08090B] overflow-hidden">
        <Image
          src={product.primaryImage || "/images/wheel-forged.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.productType === "WHEEL" && (
            <span className="bg-[#D71920] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
              6061-T6 Forged
            </span>
          )}
          {product.productType === "SERVICE" && (
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
              Shop Service
            </span>
          )}
          {isSale && (
            <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
              Special Price
            </span>
          )}
        </div>

        {/* Quick View Overlay on Desktop */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <span className="bg-[#111317]/90 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-md border border-[#292D34] flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
            <Eye className="w-4 h-4 text-[#D71920]" /> View Specs
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span className="font-bold tracking-wider uppercase text-gray-500">
              {product.brand?.name || "Chi-Town Customs"}
            </span>
            <span className="text-gray-500 font-mono">
              {defaultVariant?.stockOnHand && defaultVariant.stockOnHand > 0 ? (
                <span className="text-emerald-400 font-semibold">&bull; In Stock ({defaultVariant.stockOnHand})</span>
              ) : (
                <span className="text-amber-400 font-semibold">&bull; Built to Order</span>
              )}
            </span>
          </div>

          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F1262D] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {product.shortDescription || "Precision manufactured automotive component with guaranteed fitment."}
          </p>

          {/* Specs Snippet if available */}
          {defaultVariant?.boltPattern && (
            <div className="pt-1.5 flex flex-wrap gap-1.5 text-[10px] text-gray-400">
              <span className="bg-[#191C21] px-2 py-0.5 rounded border border-[#292D34]">
                PCD: {defaultVariant.boltPattern}
              </span>
              {defaultVariant.diameter && (
                <span className="bg-[#191C21] px-2 py-0.5 rounded border border-[#292D34]">
                  {defaultVariant.diameter}" Dia
                </span>
              )}
              {defaultVariant.finish && (
                <span className="bg-[#191C21] px-2 py-0.5 rounded border border-[#292D34]">
                  {defaultVariant.finish}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Add To Cart Button */}
        <div className="pt-4 mt-3 border-t border-[#1F232B] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase text-gray-500 block">Starting at</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-white">
                ${displayPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              {isSale && (
                <span className="text-xs text-gray-500 line-through">
                  ${product.basePrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={added}
            className={`px-3.5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              added
                ? "bg-emerald-600 text-white"
                : "bg-[#191C21] hover:bg-[#D71920] text-white border border-[#292D34] hover:border-[#D71920]"
            }`}
            title="Add to Cart"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
