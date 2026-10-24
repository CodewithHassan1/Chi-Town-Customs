"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

interface StorefrontShellProps {
  children: React.ReactNode;
}

/**
 * Shell component that selectively renders customer-facing storefront chrome
 * (Navbar, Cart Drawer, and Footer). Admin routes (/admin, /admin/login, and all sub-paths)
 * are cleanly isolated without storefront navigation and footer chrome.
 */
export default function StorefrontShell({ children }: StorefrontShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname?.startsWith("/admin/");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
