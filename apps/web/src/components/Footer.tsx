import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Clock,
  Star,
  Shield,
  CreditCard,
  Wrench,
  CheckCircle2,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050607] border-t border-[#22262E] text-gray-400 text-sm">
      {/* Top Trust Banner */}
      <div className="border-b border-[#191C21] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#111317] border border-[#292D34] flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">4.5-Star Rated Shop</p>
              <p className="text-xs text-gray-500">Over 207 verified Chicago customer reviews</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#111317] border border-[#292D34] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#D71920]" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Guaranteed Fitment</p>
              <p className="text-xs text-gray-500">Precision bolt pattern &amp; caliper clearance</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#111317] border border-[#292D34] flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5 text-[#D71920]" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Master Rim Repair</p>
              <p className="text-xs text-gray-500">Hydraulic CNC truing &amp; TIG crack welding</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#111317] border border-[#292D34] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">0% Down Financing</p>
              <p className="text-xs text-gray-500">Snap, Acima &amp; Affirm pre-approval</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-48 h-12">
            <Image
              src="/images/logo.svg"
              alt="Chi-Town Customs USA"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Chi-Town Customs USA is Chicago's authority for custom forged alloy wheels, ultra-high performance tires, and precision master wheel repair. Built with pride in the Windy City.
          </p>
          <div className="space-y-2 pt-2 text-xs text-gray-300">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
              <span>311 N Cicero Ave, Chicago, IL 60644</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D71920] shrink-0" />
              <a href="tel:+17732873000" className="hover:text-white font-semibold">
                +1 773-287-3000
              </a>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#D71920] shrink-0 mt-0.5" />
              <div>
                <p>Mon – Fri: 8:00 AM – 6:00 PM CST</p>
                <p>Saturday: 8:00 AM – 4:00 PM CST</p>
                <p className="text-gray-500">Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#D71920] pl-2.5">
            Shop Catalog
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/shop?category=custom-wheels" className="hover:text-white transition-colors">
                Custom Forged Wheels
              </Link>
            </li>
            <li>
              <Link href="/shop?category=performance-tires" className="hover:text-white transition-colors">
                High Performance Tires
              </Link>
            </li>
            <li>
              <Link href="/shop?category=wheel-tire-packages" className="hover:text-white transition-colors">
                Wheel &amp; Tire Packages
              </Link>
            </li>
            <li>
              <Link href="/fitment" className="hover:text-white transition-colors">
                Vehicle Fitment Guide
              </Link>
            </li>
          </ul>
        </div>

        {/* Wheel Repair Services */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#D71920] pl-2.5">
            Shop Services
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/services" className="hover:text-white transition-colors">
                Bent Rim Straightening
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white transition-colors">
                TIG Crack Welding
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white transition-colors">
                Custom Powder Coating
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white transition-colors">
                Road Force Wheel Balancing
              </Link>
            </li>
            <li>
              <Link href="/services/quote" className="text-[#F1262D] font-bold hover:underline">
                Request a Quote &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer & Operations */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-[#D71920] pl-2.5">
            Operations &amp; Help
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/financing" className="hover:text-white transition-colors">
                0% Down Financing
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-white transition-colors">
                Customer Account
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Directions &amp; Contact
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Our Chicago Shop
              </Link>
            </li>
            <li className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-white font-medium bg-[#111317] border border-[#22262E] px-2.5 py-1 rounded"
              >
                <Shield className="w-3 h-3 text-[#D71920]" />
                Staff Admin Portal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#191C21] py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} Chi-Town Customs USA. All rights reserved. 311 N Cicero Ave, Chicago, IL 60644.
          </p>
          <div className="flex gap-4 text-xs">
            <span>Privacy Policy</span>
            <span>&bull;</span>
            <span>Warranty Terms</span>
            <span>&bull;</span>
            <span>Local Pickups</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
