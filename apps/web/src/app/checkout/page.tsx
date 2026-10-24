"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [fulfillmentType, setFulfillmentType] = useState<"LOCAL_PICKUP" | "SHIPPING">("LOCAL_PICKUP");
  const [formData, setFormData] = useState({
    name: "Alexander Hayes",
    email: "alex.hayes@example.com",
    phone: "+1 312-555-0182",
    street: "1440 N Lake Shore Dr Apt 12B",
    city: "Chicago",
    state: "IL",
    zipCode: "60610",
    cardNumber: "4242 •••• •••• 4242",
    cardExp: "12/28",
    cardCvc: "882",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shippingAmount = fulfillmentType === "SHIPPING" ? items.length * 45.0 : 0.0;
  const taxAmount = subtotal * 0.1025; // 10.25% Cook County tax
  const totalAmount = subtotal + taxAmount + shippingAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        fulfillmentType,
        shippingAddress:
          fulfillmentType === "SHIPPING"
            ? {
                street: formData.street,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                country: "US",
              }
            : undefined,
        billingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: "US",
        },
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        paymentMethod: "STRIPE_CARD",
        notes: formData.notes,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed. Please check your inventory or information.");
      }

      // Success! Clear cart and redirect
      clearCart();
      router.push(`/order-confirmation/${data.orderId}`);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center space-y-4">
        <p className="text-gray-400">You don't have any items in your checkout session.</p>
        <Link href="/shop" className="btn-primary px-6 py-3 rounded text-xs font-bold uppercase tracking-wider">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090B] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-[#22262E] pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            SECURE CHECKOUT &bull; <span className="text-[#D71920]">CHI-TOWN CUSTOMS</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Authoritative order submission and instant inventory reservation.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800 rounded-xl flex items-center gap-3 text-red-300 text-xs font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Information & Form Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-[#111317] border border-[#22262E] rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#22262E] pb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D71920] text-white flex items-center justify-center text-xs">
                  1
                </span>
                Customer Contact Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Phone Number (For Order Updates &amp; Pickup)
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Fulfillment Selection */}
            <div className="bg-[#111317] border border-[#22262E] rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#22262E] pb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D71920] text-white flex items-center justify-center text-xs">
                  2
                </span>
                Fulfillment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    fulfillmentType === "LOCAL_PICKUP"
                      ? "bg-[#D71920]/10 border-[#D71920] shadow-glow-subtle"
                      : "bg-[#08090B] border-[#292D34] hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillmentType === "LOCAL_PICKUP"}
                        onChange={() => setFulfillmentType("LOCAL_PICKUP")}
                        className="text-[#D71920] focus:ring-[#D71920]"
                      />
                      <span className="text-xs font-bold text-white uppercase">In-Store Pickup</span>
                    </div>
                    <span className="text-xs font-black text-emerald-400">FREE</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Pick up at <strong>311 N Cicero Ave, Chicago, IL 60644</strong>. Ready in 24 hours. Free package mounting inspection.
                  </p>
                </label>

                <label
                  className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    fulfillmentType === "SHIPPING"
                      ? "bg-[#D71920]/10 border-[#D71920] shadow-glow-subtle"
                      : "bg-[#08090B] border-[#292D34] hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillmentType === "SHIPPING"}
                        onChange={() => setFulfillmentType("SHIPPING")}
                        className="text-[#D71920] focus:ring-[#D71920]"
                      />
                      <span className="text-xs font-bold text-white uppercase">Freight Ground Shipping</span>
                    </div>
                    <span className="text-xs font-black text-white">$45/wheel</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Insured freight transit with heavy-duty rim edge protector boxes and tracking.
                  </p>
                </label>
              </div>

              {fulfillmentType === "SHIPPING" && (
                <div className="pt-4 border-t border-[#22262E] space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Shipping Address
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] text-gray-400 mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Zip Code</label>
                      <input
                        type="text"
                        required
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#D71920]"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Payment Method */}
            <div className="bg-[#111317] border border-[#22262E] rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#22262E] pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#D71920] text-white flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Payment Gateway (Stripe Sandbox / Test)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-Bit SSL Secure</span>
                </div>
              </h2>

              <div className="p-4 bg-[#08090B] border border-[#292D34] rounded-xl space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Credit / Debit Card</span>
                  <div className="flex gap-2">
                    <span className="bg-[#191C21] px-2 py-0.5 rounded text-[10px] text-white font-mono">VISA</span>
                    <span className="bg-[#191C21] px-2 py-0.5 rounded text-[10px] text-white font-mono">MC</span>
                    <span className="bg-[#191C21] px-2 py-0.5 rounded text-[10px] text-white font-mono">AMEX</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="w-full bg-[#111317] border border-[#292D34] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Expiration</label>
                    <input
                      type="text"
                      required
                      value={formData.cardExp}
                      onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                      placeholder="MM/YY"
                      className="w-full bg-[#111317] border border-[#292D34] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D71920]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      required
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                      placeholder="123"
                      className="w-full bg-[#111317] border border-[#292D34] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D71920]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Installation or Vehicle Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Bringing 2024 Mustang GT for shop mounting Saturday morning."
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D71920]"
                />
              </div>
            </div>
          </div>

          {/* Order Review Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#111317] border border-[#22262E] rounded-xl p-6 space-y-6 shadow-2xl sticky top-28">
              <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-[#22262E] pb-3">
                Order Review ({items.length} items)
              </h3>

              {/* Items preview list */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((i) => (
                  <div key={i.variantId} className="flex gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded bg-[#08090B] border border-[#22262E] shrink-0 overflow-hidden">
                      <Image src={i.image || "/images/wheel-forged.jpg"} alt={i.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{i.name}</p>
                      <p className="text-[11px] text-gray-400">{i.specs}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-gray-500 font-mono">Qty: {i.quantity}</span>
                        <span className="font-bold text-white font-mono">
                          ${(i.price * i.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="border-t border-[#22262E] pt-4 space-y-2 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold font-mono">
                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fulfillment</span>
                  <span className="text-emerald-400 font-semibold font-mono">
                    {fulfillmentType === "LOCAL_PICKUP" ? "Free In-Store Pickup" : `$${shippingAmount.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cook County Sales Tax (10.25%)</span>
                  <span className="text-white font-semibold font-mono">
                    ${taxAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-[#292D34] pt-3 flex justify-between items-center text-sm">
                  <span className="font-bold text-white uppercase">Final Amount</span>
                  <span className="text-xl font-black text-white font-mono">
                    ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red"
              >
                {loading ? (
                  "Authorizing & Reserving Stock..."
                ) : (
                  <>
                    <span>Place Order &bull; ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live authoritative database transaction guarantees inventory reservation</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
