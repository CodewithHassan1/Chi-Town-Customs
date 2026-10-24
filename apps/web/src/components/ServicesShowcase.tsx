import Link from "next/link";
import Image from "next/image";
import { Wrench, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Clock } from "lucide-react";

export default function ServicesShowcase() {
  const services = [
    {
      title: "Bent Rim Straightening & CNC Truing",
      desc: "Computer-controlled hydraulic pressure restores radial and lateral runout to strict OEM tolerances (under 0.015 inches). Eliminates steering wheel shake.",
      turnaround: "24-48 Hours",
      price: "From $125 / rim",
      image: "/images/wheel-repair.jpg",
    },
    {
      title: "Aircraft-Grade TIG Crack Welding",
      desc: "Structural aluminum fractures are V-groove prepped, penetrated with high-frequency TIG arc welding, and remachined flush. Pressure tested to 65 PSI.",
      turnaround: "24-48 Hours",
      price: "From $140 / rim",
      image: "/images/wheel-repair.jpg",
    },
    {
      title: "Custom Powder Coating & Refinishing",
      desc: "Chemical strip down to bare alloy, multi-stage electrostatic powder application, and 400°F oven cure. Candy Red, Satin Bronze, Titanium, and Piano Black.",
      turnaround: "2-3 Business Days",
      price: "From $175 / rim",
      image: "/images/finishes-showcase.jpg",
    },
    {
      title: "Hunter Road Force Elite Balancing",
      desc: "Simulates up to 1,250 lbs of road force to detect tire uniformity defects, radial pull, and rim runout. Guaranteed buttery smooth highway ride.",
      turnaround: "Same-Day Service",
      price: "From $35 / wheel",
      image: "/images/tire-performance.jpg",
    },
  ];

  return (
    <section className="py-20 bg-[#0d0f13] border-b border-[#22262E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D71920]">
              <Wrench className="w-4 h-4" />
              <span>Chicago's Master Wheel Repair Facility</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
              PRECISION CRAFTED. <span className="text-gradient-chrome">FOCUSED ON PERFORMANCE.</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Potholes, curb rash, and hairline cracks don't mean your expensive forged wheels are scrap. Our technicians at 311 N Cicero Ave restore damaged wheels to showroom condition.
            </p>
          </div>

          <Link
            href="/services/quote"
            className="btn-primary px-7 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-glow-red"
          >
            <span>Request a Service Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="bg-[#111317] border border-[#22262E] hover:border-[#3F4552] rounded-xl overflow-hidden flex flex-col justify-between transition-all group"
            >
              <div className="relative aspect-[16/10] bg-[#08090B] overflow-hidden">
                <Image
                  src={svc.image}
                  alt={svc.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-2.5 right-2.5 bg-[#08090B]/85 backdrop-blur-sm border border-[#292D34] px-2.5 py-1 rounded text-[10px] font-bold text-gray-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#D71920]" />
                  <span>{svc.turnaround}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-[#F1262D] transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{svc.desc}</p>
                </div>

                <div className="pt-4 border-t border-[#1F232B] flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{svc.price}</span>
                  <Link
                    href="/services/quote"
                    className="text-xs font-bold text-[#F1262D] hover:underline flex items-center gap-1"
                  >
                    Book Now &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Powder Coating Showcase Box */}
        <div className="mt-12 bg-[#111317] border border-[#292D34] rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#D71920] bg-[#D71920]/10 px-3 py-1 rounded border border-[#D71920]/20 inline-block">
              Signature Finishes
            </span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              ELECTROSTATIC POWDER COAT FINISHES
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Transform your wheels with our industrial multi-layer powder coating. Choose from high-gloss candy apple red, deep satin bronze gold, liquid smoke brushed titanium, or mirror piano black.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-gray-300">
              <span className="bg-[#191C21] px-3 py-1 rounded-full border border-[#292D34] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 2-Year Adhesion Warranty
              </span>
              <span className="bg-[#191C21] px-3 py-1 rounded-full border border-[#292D34] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Chemical &amp; Salt Resistant
              </span>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative aspect-[16/9] rounded-xl overflow-hidden border border-[#292D34] shadow-2xl">
            <Image
              src="/images/finishes-showcase.jpg"
              alt="Custom Wheel Finishes Showcase"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
