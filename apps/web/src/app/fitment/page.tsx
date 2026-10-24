import Link from "next/link";
import db from "@/lib/db";
import FitmentWidget from "@/components/FitmentWidget";
import { Gauge, ShieldCheck, CheckCircle2, ArrowRight, HelpCircle, Phone } from "lucide-react";

export const revalidate = 0;

export default async function FitmentPage() {
  const verifiedRecords = await db.fitmentRecord.findMany({
    orderBy: { year: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#08090B] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D71920]">
            <Gauge className="w-4 h-4" />
            <span>Guaranteed Fitment Standards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
            VEHICLE FITMENT &bull; <span className="text-gradient-chrome">ENGINEERING GUIDE</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Every wheel package ordered at Chi-Town Customs USA is backed by our 100% rub-free fitment guarantee. Use our interactive tool below or inspect our verified vehicle database.
          </p>
        </div>

        {/* Interactive Fitment Finder */}
        <div className="mb-16">
          <FitmentWidget />
        </div>

        {/* Engineering Guide: 4 Key Specifications */}
        <div className="mb-16 bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="border-b border-[#22262E] pb-4">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              UNDERSTANDING CUSTOM WHEEL FITMENT
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Four fundamental engineering measurements ensure your custom forged wheels clear your brakes, suspension struts, and fenders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-gray-300">
            {/* 1. Bolt Pattern */}
            <div className="bg-[#08090B] border border-[#22262E] rounded-xl p-5 space-y-2">
              <span className="text-[#D71920] font-black font-mono text-sm block">01 / PCD</span>
              <h3 className="text-sm font-bold text-white uppercase">Bolt Pattern (PCD)</h3>
              <p className="text-gray-400 leading-relaxed">
                The diameter of the imaginary circle passing through the center of all the wheel lug holes (e.g. 5x114.3, 5x120, 5x112). Must match your vehicle hub exactly.
              </p>
            </div>

            {/* 2. Wheel Offset */}
            <div className="bg-[#08090B] border border-[#22262E] rounded-xl p-5 space-y-2">
              <span className="text-[#D71920] font-black font-mono text-sm block">02 / ET</span>
              <h3 className="text-sm font-bold text-white uppercase">Wheel Offset (ET)</h3>
              <p className="text-gray-400 leading-relaxed">
                The distance from the mounting pad surface to the true centerline of the wheel. Positive offset pushes the wheel inward; lower offset pushes wheels outward for aggressive flush stance.
              </p>
            </div>

            {/* 3. Center Bore */}
            <div className="bg-[#08090B] border border-[#22262E] rounded-xl p-5 space-y-2">
              <span className="text-[#D71920] font-black font-mono text-sm block">03 / CB</span>
              <h3 className="text-sm font-bold text-white uppercase">Hubcentric Center Bore</h3>
              <p className="text-gray-400 leading-relaxed">
                The machined center hole that centers the wheel onto your car's hub spindle. Precision hub-centric rings or bespoke custom bores eliminate high-speed wheel vibration.
              </p>
            </div>

            {/* 4. Caliper Clearance */}
            <div className="bg-[#08090B] border border-[#22262E] rounded-xl p-5 space-y-2">
              <span className="text-[#D71920] font-black font-mono text-sm block">04 / X-FACTOR</span>
              <h3 className="text-sm font-bold text-white uppercase">Brembo Brake Clearance</h3>
              <p className="text-gray-400 leading-relaxed">
                The spoke profile curvature (concavity) and backspace pad thickness required to clear oversized multi-piston sport brake calipers without wheel spacers.
              </p>
            </div>
          </div>
        </div>

        {/* Verified Database Table */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-[#22262E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Verified Chicago Fitment Records
              </h3>
              <p className="text-xs text-gray-400">
                These chassis records have been test-fitted and verified on real vehicles at our 311 N Cicero Ave shop.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full shrink-0">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Proven Tolerances</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08090B] text-gray-400 uppercase tracking-wider font-mono border-b border-[#22262E]">
                <tr>
                  <th className="py-3.5 px-6">Vehicle Chassis</th>
                  <th className="py-3.5 px-6">Bolt Pattern</th>
                  <th className="py-3.5 px-6">Recommended Diameter</th>
                  <th className="py-3.5 px-6">Offset Range (ET)</th>
                  <th className="py-3.5 px-6">Tire Size Pairing</th>
                  <th className="py-3.5 px-6 text-right">Shop Compatible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F232B] text-gray-300">
                {verifiedRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#16191F] transition-colors">
                    <td className="py-4 px-6 font-bold text-white">
                      {rec.year} {rec.make} {rec.model}
                      {rec.trim && <span className="block text-[11px] text-[#D71920] font-normal">{rec.trim}</span>}
                    </td>
                    <td className="py-4 px-6 font-mono text-white font-bold">{rec.boltPattern}</td>
                    <td className="py-4 px-6 font-mono">
                      {rec.minDiameter}" – {rec.maxDiameter}"
                    </td>
                    <td className="py-4 px-6 font-mono">
                      +{rec.minOffset} to +{rec.maxOffset} mm
                    </td>
                    <td className="py-4 px-6 font-mono text-[11px]">
                      <div>F: {rec.tireSizeFront || "N/A"}</div>
                      <div>R: {rec.tireSizeRear || "N/A"}</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/shop?boltPattern=${rec.boltPattern}`}
                        className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-wider"
                      >
                        <span>Match</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Chassis Check Footer */}
        <div className="mt-12 text-center text-xs text-gray-400 space-y-2">
          <p>
            Don't see your specific custom widebody, air suspension setup, or classic muscle car?
          </p>
          <a
            href="tel:+17732873000"
            className="inline-flex items-center gap-2 text-white hover:text-[#D71920] font-bold text-sm transition-colors"
          >
            <Phone className="w-4 h-4 text-[#D71920]" />
            <span>Call Chi-Town Customs Shop Directly: +1 773-287-3000</span>
          </a>
        </div>
      </div>
    </div>
  );
}
