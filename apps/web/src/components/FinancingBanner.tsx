import Link from "next/link";
import { CreditCard, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export default function FinancingBanner() {
  return (
    <section className="py-16 bg-[#08090B] border-b border-[#22262E] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#111317] via-[#16191F] to-[#111317] border border-[#292D34] rounded-2xl p-5 xs:p-6 sm:p-10 md:p-12 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D71920]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-3 sm:space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#D71920]/15 text-[#F1262D] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#D71920]/30">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Flexible Payment Solutions</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                GET THE WHEELS YOU WANT TODAY. <span className="text-[#D71920]">0% DOWN OPTIONS.</span>
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed">
                We partner with leading automotive financing providers including Snap Finance and Acima. Fast pre-qualification with no impact on your credit score and flexible 100-day cash payoff programs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant Pre-Approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No Hard Credit Pull</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100-Day Cash Payoff</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/financing"
                className="btn-primary px-8 py-4 rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red text-center"
              >
                <span>Check Financing Eligibility</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-gray-500 text-center max-w-xs leading-normal">
                Subject to provider underwriting &amp; approval. Chi-Town Customs does not execute credit decisions directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
