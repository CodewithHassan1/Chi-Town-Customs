"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export interface CircleMenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface CircleMenuProps {
  items: CircleMenuItem[];
  className?: string;
  radius?: number;
}

export function CircleMenu({ items, className = "", radius = 115 }: CircleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dynamicRadius, setDynamicRadius] = useState(radius);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Responsive radius calculation for narrow viewports (320px - 390px)
  useEffect(() => {
    const updateRadius = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        if (width < 360) {
          setDynamicRadius(98);
        } else if (width < 420) {
          setDynamicRadius(108);
        } else {
          setDynamicRadius(radius);
        }
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, [radius]);

  // Close on Escape key & manage focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => closeButtonRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Dimmed Blurred Backdrop */}
      <div
        onClick={closeMenu}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Center wheel container */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center z-10 pointer-events-auto select-none">
        {/* Outer decorative rim / halo */}
        <div className="absolute inset-4 rounded-full border border-[#D71920]/30 bg-gradient-radial from-[#16191F]/90 to-[#08090B]/95 pointer-events-none shadow-[0_0_60px_rgba(215,25,32,0.2)] animate-pulse" />

        {/* Radial Items distributed evenly in a circle */}
        {items.map((item, index) => {
          const angle = (index / items.length) * 2 * Math.PI - Math.PI / 2;
          const x = Math.cos(angle) * dynamicRadius;
          const y = Math.sin(angle) * dynamicRadius;

          return (
            <div
              key={item.label}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: `transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.03}s, opacity 0.3s ease ${index * 0.03}s`,
              }}
              className="absolute flex flex-col items-center justify-center group will-change-transform"
            >
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className="flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D71920] rounded-full p-1"
                  aria-label={item.label}
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#16191F] border border-[#292D34] text-gray-200 group-hover:text-white group-hover:border-[#D71920] group-hover:bg-[#D71920] flex items-center justify-center transition-all duration-200 shadow-lg group-hover:shadow-[0_0_15px_rgba(215,25,32,0.5)] group-hover:scale-110 active:scale-95">
                    {item.icon}
                  </div>
                  <span className="mt-1 text-[9px] sm:text-[10px] font-bold font-sans tracking-wider uppercase text-gray-300 group-hover:text-white bg-[#08090B]/95 border border-[#22262E] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    item.onClick?.();
                    closeMenu();
                  }}
                  className="flex flex-col items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D71920] rounded-full p-1"
                  aria-label={item.label}
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#16191F] border border-[#292D34] text-gray-200 group-hover:text-white group-hover:border-[#D71920] group-hover:bg-[#D71920] flex items-center justify-center transition-all duration-200 shadow-lg group-hover:shadow-[0_0_15px_rgba(215,25,32,0.5)] group-hover:scale-110 active:scale-95">
                    {item.icon}
                  </div>
                  <span className="mt-1 text-[9px] sm:text-[10px] font-bold font-sans tracking-wider uppercase text-gray-300 group-hover:text-white bg-[#08090B]/95 border border-[#22262E] px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              )}
            </div>
          );
        })}

        {/* Center Close Hub Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closeMenu}
          aria-label="Close navigation menu"
          className="relative z-10 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#D71920] hover:bg-[#B5141A] text-white flex items-center justify-center shadow-[0_0_25px_rgba(215,25,32,0.6)] border-2 border-white/20 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Navbar Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        className="p-2.5 rounded-lg bg-[#111317] hover:bg-[#191C21] text-gray-200 hover:text-white border border-[#292D34] hover:border-[#D71920] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D71920]"
      >
        <Menu className="w-5 h-5 text-gray-300" />
      </button>

      {/* Portal modal to document.body for clean stacking and backdrop blur */}
      {mounted && createPortal(modalContent, document.body)}
    </div>
  );
}

export default CircleMenu;
