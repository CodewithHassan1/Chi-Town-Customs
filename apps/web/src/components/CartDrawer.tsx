"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0d0f13] border-l border-[#292D34] text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#22262E] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#D71920]" />
              <h2 className="text-base font-bold tracking-wide uppercase">Your Cart ({itemCount})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-[#191C21] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#191C21] border border-[#292D34] flex items-center justify-center mx-auto text-gray-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-gray-400 font-medium">Your shopping cart is empty.</p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block bg-[#191C21] hover:bg-[#20242B] border border-[#292D34] text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Browse Custom Wheels &rarr;
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-[#111317] border border-[#22262E] rounded-lg p-3.5 flex gap-3.5 relative"
                >
                  <div className="relative w-20 h-20 bg-[#08090B] rounded border border-[#22262E] overflow-hidden shrink-0">
                    <Image
                      src={item.image || "/images/wheel-forged.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{item.specs}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">SKU: {item.sku}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#292D34] bg-[#08090B] rounded">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2 py-1 text-gray-400 hover:text-white hover:bg-[#191C21] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2 py-1 text-gray-400 hover:text-white hover:bg-[#191C21] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-white">
                          ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-5 bg-[#111317] border-t border-[#22262E] space-y-3.5">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">
                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Pickup</span>
                  <span className="text-emerald-400 font-medium">Free at 311 N Cicero Ave</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Taxes &amp; Shipping</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-[#22262E] pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Estimated Total</span>
                <span className="text-lg font-black text-white">
                  ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 bg-[#08090B] px-3 py-1.5 rounded border border-[#22262E]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Fitment Guarantee &amp; Secure Checkout</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-secondary py-2.5 rounded text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="btn-primary py-2.5 rounded text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
