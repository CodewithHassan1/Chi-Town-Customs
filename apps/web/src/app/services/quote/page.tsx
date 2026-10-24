"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Wrench, CheckCircle2, Phone, MapPin, AlertCircle, ArrowRight } from "lucide-react";

export default function ServiceQuotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#08090B] flex items-center justify-center text-gray-400">Loading Quote Form...</div>}>
      <ServiceQuoteContent />
    </Suspense>
  );
}

function ServiceQuoteContent() {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "Bent Rim Straightening & CNC Truing";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    service: preselectedService,
    preferredDate: "",
    message: "",
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
          inquiryType: "SERVICE_QUOTE",
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          vehicleYearMakeModel: formData.vehicle,
          requestedService: formData.service,
          preferredDate: formData.preferredDate || undefined,
          message: formData.message || `Quote requested for ${formData.service} on ${formData.vehicle}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please check your information.");
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D71920]">
            <Wrench className="w-4 h-4" />
            <span>Chicago Shop Repair Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            REQUEST A SERVICE QUOTE &bull; APPOINTMENT
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Tell us about your vehicle and wheel condition. Our Chicago technicians will provide an itemized quote within 2–4 business hours.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-8 sm:p-12 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white uppercase">Quote Request Received!</h2>
              <p className="text-xs text-gray-400">
                A lead technician at Chi-Town Customs USA will review your request and call/email you shortly.
              </p>
            </div>

            <div className="bg-[#08090B] border border-[#22262E] rounded-xl p-5 max-w-md mx-auto text-xs text-gray-300 space-y-2 text-left">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D71920]" />
                <span>311 N Cicero Ave, Chicago, IL 60644</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D71920]" />
                <span>Immediate phone assistance: +1 773-287-3000</span>
              </p>
            </div>

            <Link
              href="/services"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded text-xs font-bold uppercase tracking-wider"
            >
              <span>Back to Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-10 shadow-2xl">
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-800 rounded-xl flex items-center gap-3 text-red-300 text-xs font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. marcus@example.com"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. (312) 555-0199"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Vehicle Year, Make, Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    placeholder="e.g. 2023 BMW M4 Competition"
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Requested Service *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  >
                    <option value="Bent Rim Straightening & CNC Truing">Bent Rim Straightening &amp; CNC Truing</option>
                    <option value="Aircraft-Grade TIG Crack Welding">Aircraft-Grade TIG Crack Welding</option>
                    <option value="Custom Electrostatic Powder Coating & Curing">Custom Powder Coating &amp; Curing</option>
                    <option value="Hunter Road Force Elite Balancing">Hunter Road Force Elite Balancing</option>
                    <option value="Full Wheel Refinishing & Straightening Package">Full Refinishing &amp; Truing Package</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Preferred Drop-off Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Describe Damage / Service Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. Hit a pothole on the Dan Ryan Expressway. Front right 20-inch rim has a noticeable lip bend and steering wheel shakes above 50 MPH."
                  className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red"
              >
                {loading ? "Transmitting to Chicago Shop..." : "Submit Quote Request"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
