import type { Metadata } from "next";
import { Oswald, Inter, Montserrat, Roboto, Teko, Open_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import StorefrontShell from "@/components/StorefrontShell";

// Pairing 1 (Primary / Recommended): Modern Wheel Specialist — High-Performance & Precise
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

// Pairing 2: Traditional Garage — Reliable & Heavy-Duty
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

// Pairing 3: Emergency Roadside — Fast & Urgent
const teko = Teko({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-teko",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Chi-Town Customs USA | Custom Forged Wheels, Tires & Rim Repair",
  description:
    "Chicago's premier wheel repair and tire shop at 311 N Cicero Ave. Custom 6061-T6 forged rims, Michelin & Continental tires, CNC bent rim truing, crack TIG welding, and powder coating. Call +1 773-287-3000.",
  keywords: [
    "wheel repair chicago",
    "custom wheels chicago",
    "forged rims chicago",
    "tire shop cicero ave",
    "powder coating wheels",
    "bent rim straightening",
    "chi-town customs",
  ],
  authors: [{ name: "Chi-Town Customs USA" }],
  icons: {
    icon: "/images/logo-emblem.svg",
    shortcut: "/images/logo-emblem.svg",
    apple: "/images/logo-emblem.svg",
  },
  openGraph: {
    title: "Chi-Town Customs USA | Built To Stand Out",
    description:
      "Custom forged wheels, performance tires, and precision rim repair in Chicago, IL. 311 N Cicero Ave.",
    url: "https://chitowncustoms.com",
    siteName: "Chi-Town Customs USA",
    images: [
      {
        url: "/images/hero-car.jpg",
        width: 1920,
        height: 1080,
        alt: "Chi-Town Customs USA Performance Car on Custom Wheels",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${oswald.variable} ${inter.variable} ${montserrat.variable} ${roboto.variable} ${teko.variable} ${openSans.variable}`}
    >
      <body className="min-h-screen bg-[#08090B] text-[#F5F5F5] flex flex-col font-body selection:bg-[#D71920] selection:text-white">
        <CartProvider>
          <StorefrontShell>{children}</StorefrontShell>
        </CartProvider>
      </body>
    </html>
  );
}
