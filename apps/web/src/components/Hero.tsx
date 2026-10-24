import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Wrench } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-[#08090B] overflow-hidden border-b border-[#22262E]">
      {/* Background Cinematic Image with Subtle Vignette & Wet Ground Reflections */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-car.jpg"
          alt="Chi-Town Customs USA - Luxury Performance Sports Car on Forged Wheels"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Layered Cinematic Overlays for razor sharp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-[#08090B]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090B]/90 via-[#08090B]/40 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-[#08090B]/80" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-start justify-center">
        {/* Chicago Authority Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 bg-[#111317]/90 backdrop-blur-md border border-[#292D34] px-3.5 py-1.5 rounded-full shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#D71920] animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-gray-200">
              Chicago's Premier Custom Wheel &amp; Tire Authority
            </span>
            <span className="text-gray-500 font-mono text-xs">| 311 N Cicero Ave</span>
          </div>
        </div>

        {/* Cinematic Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-white uppercase max-w-3xl leading-[1.05] drop-shadow-2xl">
          BUILT TO <span className="text-gradient-chrome">STAND OUT.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl font-body font-normal leading-relaxed drop-shadow">
          Engineered from aerospace-grade 6061-T6 forged alloy. Offering custom wheel fitments, track-tested tires, and computerized hydraulic rim repair &amp; powder coating at our Chicago facility.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <Link
            href="/shop?category=custom-wheels"
            className="btn-primary px-8 py-4 rounded-md text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 w-full sm:w-auto shadow-glow-red"
          >
            <span>Shop Custom Wheels</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/services"
            className="btn-secondary px-7 py-4 rounded-md text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Wrench className="w-4 h-4 text-[#D71920]" />
            <span>Explore Our Services</span>
          </Link>

          <a
            href="tel:+17732873000"
            className="flex items-center justify-center gap-2 px-5 py-4 text-xs font-bold tracking-wider uppercase text-gray-300 hover:text-white transition-colors border border-transparent hover:border-[#292D34] rounded-md"
          >
            <Phone className="w-4 h-4 text-[#D71920]" />
            <span>Call (773) 287-3000</span>
          </a>
        </div>

        {/* Quick Highlights Row */}
        <div className="mt-14 pt-8 border-t border-[#292D34]/80 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-4xl text-xs text-gray-400">
          <div className="space-y-1">
            <p className="text-white font-extrabold text-base tracking-wide">6061-T6</p>
            <p className="text-gray-400">Aerospace Forged Aluminum</p>
          </div>
          <div className="space-y-1">
            <p className="text-white font-extrabold text-base tracking-wide">4.5 ★ Rating</p>
            <p className="text-gray-400">207+ Verified Chicago Drivers</p>
          </div>
          <div className="space-y-1">
            <p className="text-white font-extrabold text-base tracking-wide">24-48 HR</p>
            <p className="text-gray-400">Wheel Truing &amp; Powder Coating</p>
          </div>
          <div className="space-y-1">
            <p className="text-white font-extrabold text-base tracking-wide">0% Down</p>
            <p className="text-gray-400">Snap &amp; Acima Pre-Approval</p>
          </div>
        </div>
      </div>
    </section>
  );
}
