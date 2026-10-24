import Link from "next/link";
import Image from "next/image";
import db from "@/lib/db";
import Hero from "@/components/Hero";
import FitmentWidget from "@/components/FitmentWidget";
import ProductCard from "@/components/ProductCard";
import ServicesShowcase from "@/components/ServicesShowcase";
import FinancingBanner from "@/components/FinancingBanner";
import TrustReviewsSection from "@/components/TrustReviewsSection";
import { ArrowRight, Sparkles, MapPin, Phone, HelpCircle } from "lucide-react";

export const revalidate = 0; // Ensure fresh database queries

export default async function HomePage() {
  // Fetch featured products from authoritative database
  const products = await db.product.findMany({
    where: { isActive: true },
    include: {
      brand: true,
      category: true,
      variants: {
        where: { isActive: true },
      },
    },
    take: 8,
  });

  const featuredWheels = products.filter((p) => p.productType === "WHEEL");
  const performanceTires = products.filter((p) => p.productType === "TIRE");

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. Interactive Vehicle Fitment Entry Point */}
      <section className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <FitmentWidget />
      </section>

      {/* 3. Featured Custom Wheel Collections */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-[#22262E] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D71920]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aerospace 6061-T6 Forged</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
              FEATURED FORGED WHEELS
            </h2>
          </div>

          <Link
            href="/shop?category=custom-wheels"
            className="text-xs font-bold text-gray-300 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Wheels</span>
            <ArrowRight className="w-4 h-4 text-[#D71920] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredWheels.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Category Visual Showcase Tiles */}
      <section className="py-12 bg-[#0c0e12] border-y border-[#22262E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tile 1: Custom Wheels */}
            <Link
              href="/shop?category=custom-wheels"
              className="group relative h-72 rounded-2xl overflow-hidden border border-[#22262E] hover:border-[#D71920] transition-all flex flex-col justify-end p-6"
            >
              <Image
                src="/images/wheel-forged.jpg"
                alt="Custom Forged Wheels"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              <div className="relative z-10 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D71920]">
                  Monoblock &amp; 2-Piece
                </span>
                <h3 className="text-xl font-bold text-white uppercase">Custom Forged Rims</h3>
                <p className="text-xs text-gray-300">Custom PCD, offsets, and deep-dish fitments.</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white pt-1">
                  Explore Wheels &rarr;
                </span>
              </div>
            </Link>

            {/* Tile 2: Performance Tires */}
            <Link
              href="/shop?category=performance-tires"
              className="group relative h-72 rounded-2xl overflow-hidden border border-[#22262E] hover:border-[#D71920] transition-all flex flex-col justify-end p-6"
            >
              <Image
                src="/images/tire-performance.jpg"
                alt="Ultra-High Performance Tires"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              <div className="relative z-10 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Michelin &bull; Continental &bull; Nitto
                </span>
                <h3 className="text-xl font-bold text-white uppercase">Performance Tires</h3>
                <p className="text-xs text-gray-300">Max traction summer, track, and all-season tires.</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white pt-1">
                  Explore Tires &rarr;
                </span>
              </div>
            </Link>

            {/* Tile 3: Wheel Repair & Powder Coating */}
            <Link
              href="/services"
              className="group relative h-72 rounded-2xl overflow-hidden border border-[#22262E] hover:border-[#D71920] transition-all flex flex-col justify-end p-6"
            >
              <Image
                src="/images/wheel-repair.jpg"
                alt="Wheel Repair & Powder Coating"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              <div className="relative z-10 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D71920]">
                  Chicago Cicero Ave Facility
                </span>
                <h3 className="text-xl font-bold text-white uppercase">Wheel Repair &amp; Refinishing</h3>
                <p className="text-xs text-gray-300">Bent rim truing, crack welding, and powder coat.</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white pt-1">
                  Shop Services &rarr;
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Services & Repair Showcase */}
      <ServicesShowcase />

      {/* 6. Popular Performance Tires */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-[#22262E] pb-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D71920]">
              Direct From Manufacturer
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
              POPULAR STREET &amp; TRACK TIRES
            </h2>
          </div>

          <Link
            href="/shop?category=performance-tires"
            className="text-xs font-bold text-gray-300 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Tires</span>
            <ArrowRight className="w-4 h-4 text-[#D71920] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {performanceTires.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Financing Banner */}
      <FinancingBanner />

      {/* 8. Verified Reviews & Trust Information */}
      <TrustReviewsSection />

      {/* 9. FAQ Section */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#D71920]">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Answers regarding custom wheel fitment, rim repair procedures, turnaround times, and financing options.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Can cracked or severely bent aluminum wheels be safely repaired?
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Yes. Using computerized hydraulic truing lathes and aerospace-grade high-frequency TIG arc welding, we restore aluminum wheels back to strict OEM radial and lateral runout tolerances (under 0.015 inches). If a wheel is structurally fatigued beyond safe limits, our master technicians will advise you honestly.
            </p>
          </div>

          <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              What is the turnaround time for wheel powder coating?
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Our standard turnaround time is 24 to 48 hours for standard colors. We chemically strip wheels down to raw virgin alloy, blast, apply aerospace zinc-rich primer, spray the electrostatic color coat, and bake at 400°F for an indestructible finish.
            </p>
          </div>

          <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Do you offer no-credit-needed financing?
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Yes. We partner with Snap Finance, Acima, and Affirm to provide flexible financing with 0% down options and convenient 100-day cash payoff programs. You can pre-qualify online in minutes without affecting your credit score.
            </p>
          </div>

          <div className="bg-[#111317] border border-[#22262E] rounded-xl p-5 space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Where is the shop located and how can I bring my car in?
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              We are located at 311 N Cicero Ave, Chicago, IL 60644. You can drive in during shop hours (Mon–Fri 8am–6pm, Sat 8am–4pm) or call us directly at +1 773-287-3000 to reserve a service appointment or pick up your online order.
            </p>
          </div>
        </div>
      </section>

      {/* 10. Visit Shop Banner */}
      <section className="py-12 bg-[#0c0e12] border-t border-[#22262E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#111317] border border-[#292D34] flex items-center justify-center text-[#D71920] shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase">Visit Chi-Town Customs USA</h3>
              <p className="text-xs text-gray-400">
                311 N Cicero Ave, Chicago, IL 60644 &bull; Call +1 773-287-3000
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://maps.google.com/?q=311+N+Cicero+Ave+Chicago+IL+60644"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-5 py-3 rounded-md text-xs font-bold uppercase tracking-wider"
            >
              Get Directions
            </a>
            <a
              href="tel:+17732873000"
              className="btn-primary px-5 py-3 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> Call Shop
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
