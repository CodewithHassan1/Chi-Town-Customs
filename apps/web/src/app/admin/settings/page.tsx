import db from "@/lib/db";
import { Settings, ShieldCheck, CheckCircle2, Server, DollarSign, Truck, MapPin } from "lucide-react";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await db.siteSetting.findMany();

  return (
    <div className="p-6 sm:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#22262E] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#D71920]">
            System Configuration &bull; Environment
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            SYSTEM SETTINGS
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Verified business metadata, tax rates, payment sandboxes, and desktop client integration hooks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full">
          <Server className="w-4 h-4" />
          <span>Database &amp; Services Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
        {/* Business Identity */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#22262E] pb-3">
            <MapPin className="w-4 h-4 text-[#D71920]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Verified Business Identity
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-gray-500 font-bold uppercase block">Official Business Name</span>
              <span className="text-white font-semibold">Chi-Town Customs USA</span>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase block">Physical Address</span>
              <span className="text-white font-semibold">311 N Cicero Ave, Chicago, IL 60644</span>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase block">Verified Phone Number</span>
              <span className="text-white font-semibold font-mono">+1 773-287-3000</span>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase block">Public Rating Credentials</span>
              <span className="text-amber-400 font-bold">4.5 Stars &bull; 207 Verified Reviews</span>
            </div>
          </div>
        </div>

        {/* Commerce & Taxes */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#22262E] pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Tax &amp; Freight Policy
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-gray-500 font-bold uppercase block">Sales Tax Rate</span>
              <span className="text-white font-semibold">10.25% (Cook County / City of Chicago Combined)</span>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase block">Local Chicago Pickup</span>
              <span className="text-emerald-400 font-bold">Free In-Store Pickup at Cicero Ave Facility</span>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase block">Freight Ground Shipping</span>
              <span className="text-white font-semibold">$45.00 per wheel / tire (Heavy Freight Insured)</span>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase block">Payment Provider Gateway</span>
              <span className="text-emerald-400 font-mono font-bold">Stripe Sandbox / Test Mode (Active)</span>
            </div>
          </div>
        </div>

        {/* Desktop Client & Authoritative Sync */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-4 shadow-xl lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-[#22262E] pb-3">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Electron Desktop Application &bull; Authoritative Sync Endpoint
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-gray-500 font-bold uppercase block">Authoritative Database</span>
              <span className="text-white font-mono">SQLite (Local Dev) / PostgreSQL (Prod)</span>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase block">Desktop Sync Endpoint</span>
              <span className="text-white font-mono">/api/desktop/sync</span>
            </div>
            <div>
              <span className="text-gray-500 font-bold uppercase block">Barcode Scanner Interface</span>
              <span className="text-emerald-400 font-bold">Active &bull; USB / HID Wedge Ready</span>
            </div>
          </div>
        </div>

        {/* Brand Typography & Recommended Font Pairings */}
        <div className="bg-[#111317] border border-[#22262E] rounded-2xl p-6 space-y-6 shadow-xl lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#22262E] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">🛠️</span>
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Brand Typography &bull; Recommended Font Pairings
                </h2>
                <p className="text-[11px] text-gray-400">
                  Curated typography balancing high-energy title personality with exceptional body readability.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-[#D71920]/20 text-[#F1262D] border border-[#D71920]/40 px-2 py-0.5 rounded font-bold">
              ACTIVE: OSWALD + INTER
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pairing 1: Modern Wheel Specialist (Active Default) */}
            <div className="p-5 rounded-xl bg-[#08090B] border-2 border-[#D71920] relative flex flex-col justify-between gap-4 shadow-glow-subtle">
              <div className="absolute top-3 right-3">
                <span className="text-[9px] font-mono font-bold bg-[#D71920] text-white px-2 py-0.5 rounded uppercase">
                  Active Preset
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Preset 01</span>
                <h3 className="font-oswald text-2xl font-bold uppercase text-white tracking-wide leading-none">
                  BUILT TO STAND OUT
                </h3>
                <p className="font-inter text-xs text-gray-300 leading-relaxed pt-1">
                  Aerospace 6061-T6 custom forged wheels, performance tires, and computerized rim straightening.
                </p>
              </div>

              <div className="pt-3 border-t border-[#22262E] space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Heading:</span>
                  <span className="font-oswald font-bold text-white">Oswald (Bold)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Body:</span>
                  <span className="font-inter font-medium text-white">Inter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Brand Vibe:</span>
                  <span className="text-[#D71920] font-semibold text-right">High-performance wheel specialist</span>
                </div>
              </div>
            </div>

            {/* Pairing 2: Traditional Garage */}
            <div className="p-5 rounded-xl bg-[#08090B] border border-[#22262E] hover:border-gray-600 transition-colors flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Preset 02</span>
                <h3 className="font-montserrat text-xl font-black uppercase text-white tracking-tight leading-none">
                  BUILT TO STAND OUT
                </h3>
                <p className="font-roboto text-xs text-gray-300 leading-relaxed pt-1">
                  Aerospace 6061-T6 custom forged wheels, performance tires, and computerized rim straightening.
                </p>
              </div>

              <div className="pt-3 border-t border-[#22262E] space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Heading:</span>
                  <span className="font-montserrat font-black text-white">Montserrat (Black)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Body:</span>
                  <span className="font-roboto font-normal text-white">Roboto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Brand Vibe:</span>
                  <span className="text-gray-300 font-semibold text-right">Reliable, heavy-duty garage</span>
                </div>
              </div>
            </div>

            {/* Pairing 3: Emergency Roadside */}
            <div className="p-5 rounded-xl bg-[#08090B] border border-[#22262E] hover:border-gray-600 transition-colors flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Preset 03</span>
                <h3 className="font-teko text-3xl font-medium uppercase text-white tracking-wider leading-none">
                  BUILT TO STAND OUT
                </h3>
                <p className="font-opensans text-xs text-gray-300 leading-relaxed pt-1">
                  Aerospace 6061-T6 custom forged wheels, performance tires, and computerized rim straightening.
                </p>
              </div>

              <div className="pt-3 border-t border-[#22262E] space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Heading:</span>
                  <span className="font-teko font-medium text-white text-base">Teko (Medium)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Body:</span>
                  <span className="font-opensans font-normal text-white">Open Sans</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Brand Vibe:</span>
                  <span className="text-amber-400 font-semibold text-right">Fast, urgent roadside assist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
