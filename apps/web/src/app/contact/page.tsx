"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, Mail, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
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
          inquiryType: "GENERAL_CONTACT",
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          requestedService: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message.");
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D71920]">
            <MapPin className="w-4 h-4" />
            <span>Chicago Shop &bull; 311 N Cicero Ave</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            CONTACT CHI-TOWN CUSTOMS USA
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Visit our Chicago shop, give us a call, or send an inquiry. We are always ready to discuss wheel fitment, tire availability, and repair turnaround.
          </p>
        </div>

        {/* 2-Column Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shop Information Column */}
          <div className="space-y-8">
            <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-white uppercase tracking-tight border-b border-[#22262E] pb-3">
                Official Location &amp; Contact
              </h2>

              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#191C21] border border-[#292D34] flex items-center justify-center text-[#D71920] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Shop Address</h3>
                    <p className="text-gray-400 mt-0.5">311 N Cicero Ave, Chicago, IL 60644</p>
                    <a
                      href="https://maps.google.com/?q=311+N+Cicero+Ave+Chicago+IL+60644"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F1262D] font-bold mt-1 inline-block hover:underline"
                    >
                      Open in Google Maps &rarr;
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#191C21] border border-[#292D34] flex items-center justify-center text-[#D71920] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Direct Phone</h3>
                    <p className="text-gray-400 mt-0.5">Speak with a Chicago wheel specialist</p>
                    <a
                      href="tel:+17732873000"
                      className="text-white font-mono font-bold text-sm mt-1 inline-block hover:text-[#D71920]"
                    >
                      +1 773-287-3000
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#191C21] border border-[#292D34] flex items-center justify-center text-[#D71920] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Business Hours</h3>
                    <div className="text-gray-400 mt-0.5 space-y-0.5">
                      <p>Monday – Friday: 8:00 AM – 6:00 PM CST</p>
                      <p>Saturday: 8:00 AM – 4:00 PM CST</p>
                      <p className="text-gray-500">Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#191C21] border border-[#292D34] flex items-center justify-center text-[#D71920] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Official Email</h3>
                    <a
                      href="mailto:service@chitowncustoms.com"
                      className="text-gray-300 hover:text-white mt-0.5 inline-block"
                    >
                      service@chitowncustoms.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Chicago Map Visual Container */}
            <div className="bg-[#111317] border border-[#22262E] rounded-2xl overflow-hidden p-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Chicagoland Shop Navigation
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Conveniently located on North Cicero Avenue in Chicago, readily accessible from I-290 (Eisenhower Expressway) and Lake Street.
              </p>
              <a
                href="https://maps.google.com/?q=311+N+Cicero+Ave+Chicago+IL+60644"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-[#D71920]" />
                <span>Get Turn-by-Turn Driving Directions</span>
              </a>
            </div>
          </div>

          {/* Contact Inquiry Form Column */}
          <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl font-black text-white uppercase tracking-tight border-b border-[#22262E] pb-3 mb-6">
              Send an Inquiry to Our Shop
            </h2>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase">Message Delivered</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Thank you, {formData.name}. Your inquiry has been routed to our Chicago shop floor staff. We will reply within regular business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
                  }}
                  className="btn-secondary px-5 py-2 rounded text-xs font-bold uppercase"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      Phone Number *
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

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  >
                    <option value="Custom Wheel Fitment Consultation">Custom Wheel Fitment Consultation</option>
                    <option value="Wheel Repair & Powder Coating Quote">Wheel Repair &amp; Powder Coating Quote</option>
                    <option value="Order Status & Local Pickup">Order Status &amp; Local Pickup</option>
                    <option value="Financing Information">Financing Information</option>
                    <option value="General Shop Inquiry">General Shop Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your vehicle, desired wheel style, or repair needs..."
                    className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D71920]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red"
                >
                  {loading ? "Transmitting..." : "Send Message to Shop Staff"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
