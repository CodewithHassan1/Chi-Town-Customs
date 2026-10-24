"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, CheckCircle2, ShieldCheck, AlertCircle, ArrowRight, ExternalLink, Phone } from "lucide-react";

export default function FinancingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    estimatedAmount: "$2,500 – $4,000",
    preferredProvider: "Snap Finance",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiryType: "FINANCING_LEAD",
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          vehicleYearMakeModel: formData.vehicle,
          requestedService: `Financing via ${formData.preferredProvider} (Budget: ${formData.estimatedAmount})`,
          message: `Customer pre-qualification referral requested for ${formData.preferredProvider} on vehicle ${formData.vehicle}.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090B] py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D71920]">
            <CreditCard className="w-4 h-4" />
            <span>0% Down Automotive Financing</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            NO CREDIT NEEDED &bull; <span className="text-gradient-chrome">INSTANT PRE-APPROVAL</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Upgrade your car today with custom forged wheels and performance tires. Take advantage of flexible 100-day cash payoff options through leading automotive financing providers.
          </p>
        </div>

        {/* 3 Provider Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Snap Finance */}
          <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded">
                High Approval Rates
              </span>
              <h3 className="text-xl font-black text-white">Snap Finance</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Up to $5,000 approval. 100-Day Cash Payoff option with accessible requirements for drivers rebuilding credit.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 18+ years old &amp; active checking
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> $1,000/mo steady income
                </li>
              </ul>
            </div>
            <a
              href="https://consumer.snapfinance.com/#/pre-approval"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <span>Apply on Snap</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Acima */}
          <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2.5 py-1 rounded">
                Flexible Lease-to-Own
              </span>
              <h3 className="text-xl font-black text-white">Acima Leasing</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Simple lease-to-own terms. Instant decision with early buyout discount options and no credit needed.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Three months stable income
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 90-day early purchase option
                </li>
              </ul>
            </div>
            <a
              href="https://www.acima.com/apply-now"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <span>Apply on Acima</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Affirm */}
          <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400 bg-purple-950/40 border border-purple-800/40 px-2.5 py-1 rounded">
                0% APR Available
              </span>
              <h3 className="text-xl font-black text-white">Affirm</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Pay in 3, 6, or 12 monthly installments with transparent terms, no hidden fees, and zero prepayment penalties.
              </p>
              <ul className="text-xs text-gray-300 space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant pre-check at checkout
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Never any late fees
                </li>
              </ul>
            </div>
            <Link
              href="/shop"
              className="btn-secondary w-full py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <span>Select at Checkout</span>
            </Link>
          </div>
        </div>

        {/* Pre-qualification Referral Form */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="border-b border-[#22262E] pb-6 mb-6">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">
              Request Assisted Shop Financing Pre-Check
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Want our Chicago team to calculate your wheel package cost and text you the direct pre-approval link? Fill out this basic inquiry below.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase">Inquiry Transmitted</h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Thank you, {formData.name}. Our Chicago team has received your request and will text your direct pre-qualification application link to {formData.phone}.
              </p>
              <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider">
                <span>Browse Wheel Inventory</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Full Name *
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
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Phone Number (For Texting Application Link) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Vehicle Year, Make, Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    placeholder="e.g. 2024 Ford Mustang GT"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Target Package Budget
                  </label>
                  <select
                    value={formData.estimatedAmount}
                    onChange={(e) => setFormData({ ...formData, estimatedAmount: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  >
                    <option value="$1,000 – $2,500">$1,000 – $2,500</option>
                    <option value="$2,500 – $4,000">$2,500 – $4,000</option>
                    <option value="$4,000 – $6,000">$4,000 – $6,000</option>
                    <option value="$6,000+">$6,000+ (Forged Bespoke)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Preferred Provider
                  </label>
                  <select
                    value={formData.preferredProvider}
                    onChange={(e) => setFormData({ ...formData, preferredProvider: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  >
                    <option value="Snap Finance">Snap Finance (100-Day Payoff)</option>
                    <option value="Acima Leasing">Acima Leasing (90-Day Early Purchase)</option>
                    <option value="Affirm">Affirm (Installment Plan)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-[#08090B] rounded-lg border border-[#22262E] text-[11px] text-gray-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Privacy Guarantee:</strong> Chi-Town Customs USA will never ask for your Social Security Number, banking passwords, or credit card details through a website form. All credit decisions are handled exclusively on the financing provider's secure external portal.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red"
              >
                {loading ? "Submitting Inquiry..." : "Submit Assisted Pre-Check Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
