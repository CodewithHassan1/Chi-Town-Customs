import Link from "next/link";
import Image from "next/image";
import { Wrench, CheckCircle2, Clock, ShieldCheck, ArrowRight, Phone, Sparkles } from "lucide-react";

export default function ServicesPage() {
  const serviceList = [
    {
      id: "bent-rim-straightening",
      name: "Bent Rim Truing & Hydraulic Straightening",
      tagline: "Computer-controlled hydraulic truing lathe",
      price: "$125 – $165 per rim",
      turnaround: "24 – 48 Hours (Same-Day Emergency Service Available)",
      desc: "Chicago potholes cause severe radial and lateral bends. Our technicians measure runout with dial indicators, gently heat the forged or cast alloy to prevent micro-fracturing, and apply multi-directional hydraulic pressure to bring the rim back to under 0.015\" OEM factory tolerance.",
      features: [
        "Eliminates high-speed steering wheel shudder",
        "Prevents slow bead seal air leaks",
        "Safe for forged, flow-formed, and cast wheels",
        "Runout certified with precision dial indicator gauge",
      ],
      image: "/images/wheel-repair.jpg",
    },
    {
      id: "tig-crack-welding",
      name: "Aircraft-Grade TIG Crack Welding",
      tagline: "High-frequency AC/DC arc welding",
      price: "$140 – $185 per rim",
      turnaround: "24 – 48 Hours",
      desc: "Inner barrel fractures are carefully excavated with carbide rotary tools into a 60-degree V-groove. Using Miller syncrowave TIG welders and certified 4043/5356 aluminum filler rods, we achieve 100% weld root penetration. The bead is machined flush and tested at 65 PSI underwater.",
      features: [
        "100% full-penetration structural weld",
        "Tested to 65 PSI in submersion tank",
        "Lifetime structural weld guarantee",
        "Honest structural fatigue assessment",
      ],
      image: "/images/wheel-repair.jpg",
    },
    {
      id: "custom-powder-coating",
      name: "Custom Electrostatic Powder Coating & Curing",
      tagline: "Chemical strip, zinc primer, color & 400°F bake",
      price: "$175 – $225 per wheel",
      turnaround: "2 – 3 Business Days",
      desc: "Our multi-stage powder coating process strips previous paint down to raw bare aluminum. Any curb rash is repaired with aluminum filler, followed by an aerospace zinc-rich primer, electrostatic powder coat in your choice of finish, and a high-temp clear coat baked in an industrial oven.",
      features: [
        "Showroom finishes: Candy Apple Red, Satin Bronze, Liquid Titanium, Piano Black",
        "Extreme resistance to road salts, gravel, and brake dust",
        "2-Year powder adhesion warranty against peeling or chipping",
        "Includes chemical strip and curb rash prep",
      ],
      image: "/images/finishes-showcase.jpg",
    },
    {
      id: "road-force-balancing",
      name: "Hunter Road Force Elite Wheel Balancing",
      tagline: "1,250 lbs roller load simulation",
      price: "$35 – $45 per wheel",
      turnaround: "Same-Day While You Wait",
      desc: "Standard spin balancers only measure centrifugal weight imbalance. The Hunter Road Force Elite applies up to 1,250 lbs of roller load to the tire, measuring radial and lateral tire stiffness variation. It match-mounts the tire's high point to the wheel's low spot for a buttery smooth ride.",
      features: [
        "Solves persistent vibrations that normal balancers miss",
        "Match-mounts tire high spot with wheel low spot",
        "Laser-guided adhesive weight placement behind spokes",
        "Touchless tire mounting with nylon leverless heads",
      ],
      image: "/images/tire-performance.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090B] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 border-b border-[#22262E] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D71920]">
              <Wrench className="w-4 h-4" />
              <span>Chicago's Dedicated Wheel Repair Center</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              PRECISION WHEEL REPAIR &bull; <span className="text-gradient-chrome">POWDER COATING</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Serving Chicagoland at 311 N Cicero Ave. Equipped with computerized hydraulic truing machines, aerospace TIG welding stations, and Hunter Road Force diagnostic balancers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/services/quote"
              className="btn-primary px-7 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+17732873000"
              className="btn-secondary px-6 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#D71920]" />
              <span>(773) 287-3000</span>
            </a>
          </div>
        </div>

        {/* Detailed Service Cards */}
        <div className="space-y-12">
          {serviceList.map((svc, idx) => (
            <div
              key={svc.id}
              className="bg-[#111317] border border-[#22262E] hover:border-[#3F4552] rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all shadow-xl"
            >
              {/* Image Side */}
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden border border-[#292D34] shadow-2xl">
                <Image src={svc.image} alt={svc.name} fill className="object-cover" />
                <div className="absolute top-3 left-3 bg-[#08090B]/90 backdrop-blur-sm border border-[#292D34] px-3 py-1 rounded-full text-xs font-mono font-bold text-white">
                  {svc.price}
                </div>
              </div>

              {/* Text Description Side */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D71920]">
                    {svc.tagline}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    {svc.name}
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{svc.desc}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {svc.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#1F232B] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-4 h-4 text-[#D71920]" />
                    <span>Turnaround: <strong>{svc.turnaround}</strong></span>
                  </div>

                  <Link
                    href={`/services/quote?service=${encodeURIComponent(svc.name)}`}
                    className="btn-primary px-6 py-2.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dropoff Instructions Box */}
        <div className="mt-16 bg-[#16191F] border border-[#292D34] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white uppercase tracking-wide">
              Have Damaged Wheels You Need Looked At Today?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Drive straight into our shop at <strong>311 N Cicero Ave, Chicago, IL</strong> for an instant diagnostic runout inspection. No appointment strictly required for evaluation!
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=311+N+Cicero+Ave+Chicago+IL+60644"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-6 py-3.5 rounded text-xs font-bold uppercase tracking-wider shrink-0"
          >
            Get Shop Directions &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
