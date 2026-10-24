"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { RandomLetterSwap } from "@/components/ui/random-letter-swap";
import { CircleMenu, CircleMenuItem } from "@/components/ui/circle-menu";
import {
  ShoppingCart,
  Phone,
  ShieldCheck,
  User,
  Home,
  Disc,
  ShoppingBag,
  Wrench,
  Gauge,
  CircleDollarSign,
  Info,
} from "lucide-react";

// Semantic, authoritative navigation routes for Chi-Town Customs USA
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Wheels", href: "/shop?category=custom-wheels" },
  { label: "Tires", href: "/shop?category=performance-tires" },
  { label: "Services", href: "/services" },
  { label: "Fitment", href: "/fitment" },
  { label: "Financing", href: "/financing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Radial mobile menu destinations with genuine Lucide icons
const mobileMenuItems: CircleMenuItem[] = [
  { label: "Home", href: "/", icon: <Home className="w-5 h-5 text-gray-200" /> },
  { label: "Wheels", href: "/shop?category=custom-wheels", icon: <Disc className="w-5 h-5 text-gray-200" /> },
  { label: "Tires", href: "/shop?category=performance-tires", icon: <ShoppingBag className="w-5 h-5 text-gray-200" /> },
  { label: "Services", href: "/services", icon: <Wrench className="w-5 h-5 text-gray-200" /> },
  { label: "Fitment", href: "/fitment", icon: <Gauge className="w-5 h-5 text-gray-200" /> },
  { label: "Financing", href: "/financing", icon: <CircleDollarSign className="w-5 h-5 text-gray-200" /> },
  { label: "About", href: "/about", icon: <Info className="w-5 h-5 text-gray-200" /> },
  { label: "Contact", href: "/contact", icon: <Phone className="w-5 h-5 text-gray-200" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#08090B]/95 backdrop-blur-md border-b border-[#22262E] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Three-Part Desktop & Responsive Mobile Layout */}
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4 lg:gap-6">
          {/* Part 1 — Left: Chi-Town Customs USA Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link
              href="/"
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D71920] rounded-sm group py-1"
              aria-label="Chi-Town Customs USA Homepage"
            >
              <Image
                src="/images/logo.svg"
                alt="Chi-Town Customs USA - Wheel Repair & Custom Rim Specialist Chicago"
                width={210}
                height={40}
                className="h-8 sm:h-9 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
                priority
              />
            </Link>
          </div>

          {/* Part 2 — Center: Desktop Navigation with RandomLetterSwap Animation */}
          <nav
            className="hidden lg:flex items-center justify-center gap-3.5 xl:gap-5 2xl:gap-6 h-full flex-1 px-2"
            aria-label="Primary Navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || (pathname ? pathname.startsWith(link.href) : false);

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative flex items-center h-full px-2 py-1 text-xs xl:text-sm font-semibold tracking-wider uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D71920] rounded group ${
                    isActive ? "text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  <RandomLetterSwap
                    label={link.label}
                    className="cursor-pointer"
                    staggerDuration={0.025}
                    transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
                  />
                  {isActive && (
                    <span
                      className="absolute bottom-2.5 left-2 right-2 h-[2px] bg-[#D71920] rounded-full shadow-[0_0_8px_rgba(215,25,32,0.8)]"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Part 3 — Right: CTA & Utility Actions */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 xl:gap-3.5 flex-shrink-0">
            {/* Primary CTA: Call Chi-Town Customs Shop */}
            <a
              href="tel:+17732873000"
              className="hidden xl:inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#D71920]/20 hover:shadow-[#D71920]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D71920] active:scale-[0.98] flex-shrink-0"
              title="Call Chi-Town Customs Shop: (773) 287-3000"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>(773) 287-3000</span>
            </a>

            {/* Customer Account Shortcut */}
            <Link
              href="/account"
              className="hidden sm:inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#16191F] border border-transparent hover:border-[#292D34] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D71920]"
              title="Customer Account & Orders"
            >
              <User className="w-4 h-4 text-[#A4A8B0]" />
              <span className="hidden 2xl:inline">Account</span>
            </Link>

            {/* Staff Hub Shortcut */}
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-1.5 h-10 px-3 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-[#16191F] border border-transparent hover:border-[#292D34] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D71920]"
              title="Staff & Management Hub"
            >
              <ShieldCheck className="w-4 h-4 text-[#A4A8B0]" />
              <span className="hidden 2xl:inline">Staff Hub</span>
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#111317] hover:bg-[#191C21] border border-[#292D34] hover:border-[#D71920] text-white transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D71920]"
              aria-label={`View Shopping Cart (${itemCount} items)`}
            >
              <ShoppingCart className="w-4.5 h-4.5 text-gray-300 group-hover:text-white transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D71920] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border-2 border-[#08090B]">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Navigation Trigger: CircleMenu */}
            <div className="lg:hidden flex items-center">
              <CircleMenu items={mobileMenuItems} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
