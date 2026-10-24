import Link from "next/link";
import { Phone, Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <aside aria-label="Announcement" className="bg-[#111317] border-b border-[#22262E] text-xs text-[#A4A8B0] py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 bg-[#D71920]/20 text-[#F1262D] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border border-[#D71920]/40">
            <Sparkles className="w-3 h-3 text-[#F1262D]" /> Special Offer
          </span>
          <span className="text-gray-300">
            CHICAGOLAND CUSTOMIZATION: Save up to $200 on Forged Wheel &amp; Tire Packages.
          </span>
          <Link
            href="/shop"
            className="text-white underline hover:text-[#F1262D] font-medium transition-colors ml-1"
          >
            Shop Now &rarr;
          </Link>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <span className="hidden md:inline-block">311 N Cicero Ave, Chicago, IL</span>
          <a
            href="tel:+17732873000"
            className="flex items-center gap-1.5 text-white hover:text-[#F1262D] font-semibold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#D71920]" />
            +1 773-287-3000
          </a>
        </div>
      </div>
    </aside>
  );
}
