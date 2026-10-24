"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Truck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();
  const [fulfillmentType, setFulfillmentType] = useState<"LOCAL_PICKUP" | "SHIPPING">("LOCAL_PICKUP");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Chicago sales tax (10.25%)
  const taxRate = 0.1025;
  const shippingAmount = fulfillmentType === "SHIPPING" ? items.length * 45.0 : 0.0;
  const discountAmount = appliedDiscount;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = taxableAmount * taxRate;
  const totalAmount = taxableAmount + taxAmount + shippingAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "CHITOWN2026") {
      setAppliedDiscount(100);
      setCouponMsg({ text: "Promo code applied! $100 saved.", error: false });
    } else if (couponCode.trim().toUpperCase() === "FORGED5") {
      const discount = subtotal * 0.05;
      setAppliedDiscount(discount);
      setCouponMsg({ text: "Promo code applied! 5% discount.", error: false });
    } else {
      setCouponMsg({ text: "Invalid promo code. Try CHITOWN2026", error: true });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-[#111317] border border-[#292D34] flex items-center justify-center text-gray-500 shadow-xl">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-gray-400 max-w-md">
          Explore our custom forged wheels, performance street tires, or schedule a rim repair service at our Chicago shop.
        </p>
        <Link
          href="/shop"
          className="btn-primary px-8 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-glow-red"
        >
          <span>Browse Wheels &amp; Tires</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090B] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-[#22262E] pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              SHOPPING CART <span className="text-gray-500 font-mono text-xl">({itemCount} ITEMS)</span>
            </h1>
            <p className="text-xs text-gray-400">Review your products, select fulfillment, and proceed to checkout.</p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear All Items
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items List Column */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="bg-[#111317] border border-[#22262E] rounded-xl p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-[#08090B] rounded-lg border border-[#292D34] overflow-hidden shrink-0">
                    <Image
                      src={item.image || "/images/wheel-forged.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400">{item.specs}</p>
                    <p className="text-[11px] font-mono text-gray-500">SKU: {item.sku}</p>
                    <p className="text-xs font-semibold text-[#D71920]">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-0 border-[#1F232B]">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[#292D34] bg-[#08090B] rounded">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-mono font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="px-2.5 py-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-white">
                      ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* In-store pickup notice */}
            <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 flex items-start gap-3.5 text-xs text-gray-300">
              <Truck className="w-5 h-5 text-[#D71920] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Shop Pickup &amp; Installation:</strong> You can choose Free In-Store Pickup at 311 N Cicero Ave in Chicago. Our technicians can mount, balance, and install your package on-site!
              </div>
            </div>
          </div>

          {/* Order Summary & Checkout Column */}
          <div className="space-y-6">
            <div className="bg-[#111317] border border-[#22262E] rounded-xl p-6 space-y-6 shadow-xl">
              <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-[#22262E] pb-3">
                Order Summary
              </h2>

              {/* Fulfillment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Fulfillment Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType("LOCAL_PICKUP")}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      fulfillmentType === "LOCAL_PICKUP"
                        ? "bg-[#D71920]/15 border-[#D71920] text-white font-bold"
                        : "bg-[#08090B] border-[#292D34] text-gray-400 hover:text-white"
                    }`}
                  >
                    <div className="font-bold">In-Store Pickup</div>
                    <div className="text-[10px] text-emerald-400">Free at Cicero Ave</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType("SHIPPING")}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      fulfillmentType === "SHIPPING"
                        ? "bg-[#D71920]/15 border-[#D71920] text-white font-bold"
                        : "bg-[#08090B] border-[#292D34] text-gray-400 hover:text-white"
                    }`}
                  >
                    <div className="font-bold">Freight Ground</div>
                    <div className="text-[10px] text-gray-400">$45 / wheel</div>
                  </button>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. CHITOWN2026"
                    className="flex-1 bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-[#D71920]"
                  />
                  <button
                    type="submit"
                    className="btn-secondary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-[11px] ${couponMsg.error ? "text-red-400" : "text-emerald-400"}`}>
                    {couponMsg.text}
                  </p>
                )}
              </form>

              {/* Calculations breakdown */}
              <div className="border-t border-[#22262E] pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Items Subtotal</span>
                  <span className="text-white font-semibold">
                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount Code</span>
                    <span>-${discountAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-400">
                  <span>Shipping &amp; Handling</span>
                  <span className={fulfillmentType === "LOCAL_PICKUP" ? "text-emerald-400 font-semibold" : "text-white font-semibold"}>
                    {fulfillmentType === "LOCAL_PICKUP"
                      ? "Free Pickup (Chicago)"
                      : `$${shippingAmount.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400">
                  <span>Estimated Tax (10.25% Cook County)</span>
                  <span className="text-white font-semibold">
                    ${taxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="border-t border-[#292D34] pt-3 flex justify-between items-center text-sm">
                  <span className="font-bold text-white uppercase tracking-wider">Estimated Total</span>
                  <span className="text-xl font-black text-white">
                    ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href={`/checkout?fulfillment=${fulfillmentType}&discount=${appliedDiscount}`}
                className="btn-primary w-full py-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red text-center"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>256-Bit SSL Encrypted &bull; Authoritative Inventory Reservation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
