import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Wrench } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)] flex flex-col justify-between bg-[#08090B] overflow-hidden border-b border-[#22262E]">
      {/* Background Cinematic Image with Layered Vignette & Reflections */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-car.jpg"
          alt="Chi-Town Customs USA - Luxury Performance Sports Car on Forged Wheels"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Layered Cinematic Overlays for razor sharp text contrast across all device viewports */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090B] via-[#08090B]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090B]/95 via-[#08090B]/55 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-[#08090B]/80" />
      </div>

      {/* Main Content Container - Vertically Balanced across all screen sizes */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center py-4 xs:py-6 sm:py-8 lg:py-10">
        {/* Chicago Authority Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3 xs:mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-1.5 xs:gap-2 bg-[#111317]/90 backdrop-blur-md border border-[#292D34] px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-full shadow-xl">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#D71920] animate-pulse shrink-0" />
            <span className="text-[10px] xs:text-xs font-bold tracking-wider sm:tracking-widest uppercase text-gray-200">
              Chicago's Premier Custom Wheel &amp; Tire Authority
            </span>
            <span className="hidden sm:inline text-gray-500 font-mono text-[10px] xs:text-xs">
              | 311 N Cicero Ave
            </span>
          </div>
        </div>

        {/* Cinematic Headline - Fluid scaling from narrow phones (344px) to smart displays (1280px) and large tablets */}
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7.5xl font-heading font-black tracking-tight text-white uppercase max-w-4xl leading-[1.08] xs:leading-[1.05] sm:leading-[1.02] drop-shadow-2xl">
          BUILT TO <span className="text-gradient-chrome">STAND OUT.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-2.5 xs:mt-3.5 sm:mt-4 lg:mt-5 text-xs xs:text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl font-body font-normal leading-relaxed drop-shadow">
          Engineered from aerospace-grade 6061-T6 forged alloy. Offering custom wheel fitments, track-tested tires, and computerized hydraulic rim repair &amp; powder coating at our Chicago facility.
        </p>

        {/* Action CTAs - Responsive wrapping with touch targets */}
        <div className="mt-4 xs:mt-5 sm:mt-8 flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href="/shop?category=custom-wheels"
            className="btn-primary flex-1 xs:flex-initial px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-glow-red text-center whitespace-nowrap"
          >
            <span>Shop Custom Wheels</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </Link>

          <Link
            href="/services"
            className="btn-secondary flex-1 xs:flex-initial px-4 xs:px-5 sm:px-7 py-2.5 xs:py-3 sm:py-3.5 rounded-lg text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 text-center whitespace-nowrap"
          >
            <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D71920] shrink-0" />
            <span>Explore Services</span>
          </Link>

          <a
            href="tel:+17732873000"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 xs:gap-2 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 text-[11px] sm:text-xs font-bold tracking-wider uppercase text-gray-300 hover:text-white transition-colors border border-[#292D34] hover:border-[#D71920] rounded-lg bg-[#111317]/80 whitespace-nowrap"
          >
            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D71920] shrink-0" />
            <span>(773) 287-3000</span>
          </a>
        </div>

        {/* Quick Highlights Row - Responsive 2-col or 4-col layout */}
        <div className="mt-4 xs:mt-6 sm:mt-8 lg:mt-10 pt-3 xs:pt-4 sm:pt-6 border-t border-[#292D34]/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 xs:gap-3.5 sm:gap-6 w-full max-w-4xl text-xs text-gray-400">
          <div className="space-y-0.5">
            <p className="text-white font-extrabold text-xs xs:text-sm sm:text-base tracking-wide">6061-T6</p>
            <p className="text-[10px] xs:text-[11px] sm:text-xs text-gray-400">Aerospace Forged Alloy</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-white font-extrabold text-xs xs:text-sm sm:text-base tracking-wide">4.5 ★ Rating</p>
            <p className="text-[10px] xs:text-[11px] sm:text-xs text-gray-400">207+ Verified Reviews</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-white font-extrabold text-xs xs:text-sm sm:text-base tracking-wide">24-48 HR</p>
            <p className="text-[10px] xs:text-[11px] sm:text-xs text-gray-400">CNC Truing &amp; Coating</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-white font-extrabold text-xs xs:text-sm sm:text-base tracking-wide">0% Down</p>
            <p className="text-[10px] xs:text-[11px] sm:text-xs text-gray-400">Snap &amp; Acima Approval</p>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Cue at Viewport Bottom */}
      <div className="relative z-10 w-full flex items-center justify-center pb-2 pt-1">
        <a
          href="#fitment-finder"
          className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-white transition-colors animate-bounce"
          aria-label="Scroll down to vehicle fitment finder"
        >
          <span>Scroll To Explore</span>
          <svg className="w-3.5 h-3.5 text-[#D71920]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
