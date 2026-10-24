"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Gauge, CheckCircle2, AlertCircle, ArrowRight, RotateCcw } from "lucide-react";

const POPULAR_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];
const MAKES = ["Ford", "Chevrolet", "BMW", "Dodge", "Tesla", "Porsche", "Mercedes-Benz"];

const MODEL_MAP: Record<string, string[]> = {
  Ford: ["Mustang GT / Dark Horse", "F-150 / Raptor", "Explorer ST"],
  Chevrolet: ["Corvette C8 (Stingray/Z06)", "Camaro SS / ZL1", "Silverado 1500"],
  BMW: ["M3 / M4 (G80/G82)", "M5 (F90)", "330i / M340i", "X5 M"],
  Dodge: ["Charger (Scat Pack/Hellcat)", "Challenger Widebody", "Durango SRT"],
  Tesla: ["Model 3 Performance", "Model Y Performance", "Model S Plaid"],
  Porsche: ["911 Carrera / Turbo (992)", "Cayman / Boxster GT4", "Taycan"],
  "Mercedes-Benz": ["C63 AMG", "E63 S AMG", "AMG GT Coupe"],
};

export default function FitmentWidget() {
  const router = useRouter();
  const [year, setYear] = useState<string>("2024");
  const [make, setMake] = useState<string>("Ford");
  const [model, setModel] = useState<string>("Mustang GT / Dark Horse");
  const [fitmentResult, setFitmentResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = () => {
    setIsChecking(true);
    // Simulate query or direct match
    setTimeout(() => {
      setIsChecking(false);
      if (make === "Ford" && model.includes("Mustang")) {
        setFitmentResult({
          status: "VERIFIED",
          boltPattern: "5x114.3",
          diameterRange: "19\" – 21\"",
          offsetRange: "+30 to +45 mm",
          frontTire: "255/35ZR20",
          rearTire: "295/30ZR20",
          notes: "Direct bolt-on flush fitment. 100% clears front Brembo 6-piston brake calipers.",
        });
      } else if (make === "Chevrolet" && model.includes("Corvette")) {
        setFitmentResult({
          status: "VERIFIED",
          boltPattern: "5x120",
          diameterRange: "19\" – 21\"",
          offsetRange: "+35 to +52 mm",
          frontTire: "245/35ZR19",
          rearTire: "305/30ZR20",
          notes: "Staggered setup verified. Proper wheel speed sensor calibration guaranteed.",
        });
      } else if (make === "BMW" && model.includes("M3 / M4")) {
        setFitmentResult({
          status: "VERIFIED",
          boltPattern: "5x112",
          diameterRange: "19\" – 21\"",
          offsetRange: "+18 to +32 mm",
          frontTire: "275/35ZR19",
          rearTire: "285/30ZR20",
          notes: "Direct hubcentric fitment (66.6mm CB). Clears M compound calipers.",
        });
      } else {
        setFitmentResult({
          status: "CUSTOM_CHECK",
          notes:
            "Vehicle recognized. Our Chicago technicians will manually verify caliper spacing and offset upon order or via direct phone check at (773) 287-3000.",
        });
      }
    }, 300);
  };

  const handleShopCompatible = () => {
    if (fitmentResult?.boltPattern) {
      router.push(`/shop?boltPattern=${fitmentResult.boltPattern}`);
    } else {
      router.push(`/shop`);
    }
  };

  return (
    <div className="w-full bg-[#111317] border border-[#292D34] rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D71920]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 border-b border-[#22262E] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#191C21] border border-[#292D34] flex items-center justify-center text-[#D71920] shrink-0">
            <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide">
              Vehicle Fitment Compatibility Finder
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-400">
              Select your vehicle specs to filter 100% rub-free wheels and tires guaranteed by Chi-Town Customs.
            </p>
          </div>
        </div>

        {fitmentResult && (
          <button
            onClick={() => setFitmentResult(null)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Vehicle
          </button>
        )}
      </div>

      {/* Selector Grid - 1 col on mobile, 2 col on tablet/foldables, 4 col on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Year */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setFitmentResult(null);
            }}
            className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D71920]"
          >
            {POPULAR_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Make */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Make
          </label>
          <select
            value={make}
            onChange={(e) => {
              const newMake = e.target.value;
              setMake(newMake);
              setModel(MODEL_MAP[newMake]?.[0] || "");
              setFitmentResult(null);
            }}
            className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D71920]"
          >
            {MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
            Model &amp; Trim
          </label>
          <select
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setFitmentResult(null);
            }}
            className="w-full bg-[#08090B] border border-[#292D34] rounded-lg px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#D71920]"
          >
            {(MODEL_MAP[make] || []).map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <div className="flex items-end">
          <button
            onClick={handleCheck}
            disabled={isChecking}
            className="w-full btn-primary py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {isChecking ? "Checking Fitment..." : "Check Fitment"}
          </button>
        </div>
      </div>

      {/* Fitment Result Card */}
      {fitmentResult && (
        <div className="mt-6 p-5 bg-[#08090B] border border-[#22262E] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Fitment Confirmed for {year} {make} {model}
              </h4>
            </div>

            {fitmentResult.boltPattern ? (
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
                <span className="bg-[#191C21] px-2.5 py-1 rounded border border-[#292D34]">
                  Bolt Pattern: <strong className="text-white">{fitmentResult.boltPattern}</strong>
                </span>
                <span className="bg-[#191C21] px-2.5 py-1 rounded border border-[#292D34]">
                  Diameter: <strong className="text-white">{fitmentResult.diameterRange}</strong>
                </span>
                <span className="bg-[#191C21] px-2.5 py-1 rounded border border-[#292D34]">
                  Offset: <strong className="text-white">{fitmentResult.offsetRange}</strong>
                </span>
              </div>
            ) : null}

            <p className="text-xs text-gray-400 leading-relaxed">{fitmentResult.notes}</p>
          </div>

          <button
            onClick={handleShopCompatible}
            className="btn-primary px-6 py-3 rounded-md text-xs font-bold tracking-wider uppercase flex items-center gap-2 shrink-0 shadow-glow-red"
          >
            <span>Shop Compatible Wheels</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
