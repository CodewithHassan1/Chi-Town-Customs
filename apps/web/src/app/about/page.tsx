import Image from "next/image";
import Link from "next/link";
import { Wrench, ShieldCheck, Award, MapPin, Phone, Star, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#08090B] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D71920]">
            <Award className="w-4 h-4" />
            <span>Chicago Born &bull; Performance Driven</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            ABOUT CHI-TOWN CUSTOMS USA
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            From the bustling highways to the demanding streets of Chicago, our mission is to craft the finest forged wheels, deliver precision rim repair, and ensure every ride is built to stand out.
          </p>
        </div>

        {/* Visual Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#22262E] shadow-2xl">
            <Image
              src="/images/wheel-repair.jpg"
              alt="Chi-Town Customs Chicago Workshop Master Technician"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D71920]">
              Our Facility &bull; 311 N Cicero Ave
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              A DEDICATED FACILITY ENGINEERED FOR PRECISION
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Chi-Town Customs USA was established to provide Chicagoland drivers with an uncompromising wheel and tire experience. Whether you are driving a 900-horsepower sports car, an aggressive widebody coupe, or an everyday commuter contending with Midwest pothole season, we treat your wheels with master craftsmanship.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Unlike quick-lube shops that treat wheels as commodities, we operate computerized hydraulic truing equipment, high-frequency AC/DC TIG arc welders, Hunter Road Force diagnostic tire balancers, and a complete electrostatic powder coating line.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-[#111317] border border-[#22262E] p-4 rounded-xl space-y-1">
                <span className="text-2xl font-black text-white">4.5 ★</span>
                <p className="text-xs text-gray-400">Over 207 verified reviews from Chicago car enthusiasts</p>
              </div>
              <div className="bg-[#111317] border border-[#22262E] p-4 rounded-xl space-y-1">
                <span className="text-2xl font-black text-white">&lt; 0.015"</span>
                <p className="text-xs text-gray-400">Radial and lateral runout tolerance on all restored rims</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-8 sm:p-12 mb-20">
          <h3 className="text-xl font-black text-white uppercase tracking-tight text-center mb-10">
            THE CHI-TOWN CUSTOMS COMMITMENT
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-gray-300">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#191C21] border border-[#292D34] flex items-center justify-center text-[#D71920]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase">Aerospace Metallurgy</h4>
              <p className="text-gray-400 leading-relaxed">
                All custom forged wheels are CNC machined from solid blocks of 6061-T6 aerospace aluminum for maximum strength-to-weight ratio.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#191C21] border border-[#292D34] flex items-center justify-center text-[#D71920]">
                <Wrench className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase">Honest Repair Assessments</h4>
              <p className="text-gray-400 leading-relaxed">
                We never compromise your safety. If a wheel is structurally fatigued beyond safe OEM metallurgical thresholds, we will inform you honestly.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-lg bg-[#191C21] border border-[#292D34] flex items-center justify-center text-[#D71920]">
                <Star className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase">Local Chicago Service</h4>
              <p className="text-gray-400 leading-relaxed">
                Local pickups, same-day tire emergency mounting, and direct telephone consultations with master technicians who know Chicago roads.
              </p>
            </div>
          </div>
        </div>

        {/* Visit Call to Action */}
        <div className="bg-gradient-to-r from-[#191C21] via-[#111317] to-[#191C21] border border-[#292D34] rounded-2xl p-8 sm:p-12 text-center space-y-5">
          <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            VISIT OUR CHICAGO SHOWROOM &bull; 311 N CICERO AVE
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
            Stop by during business hours to inspect wheel finish samples, discuss custom offsets, or test-truing on your damaged rims.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/shop"
              className="btn-primary px-7 py-3 rounded text-xs font-bold uppercase tracking-wider"
            >
              Shop Custom Wheels
            </Link>
            <a
              href="tel:+17732873000"
              className="btn-secondary px-7 py-3 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#D71920]" />
              <span>(773) 287-3000</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
