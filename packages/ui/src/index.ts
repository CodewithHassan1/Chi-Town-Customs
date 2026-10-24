export const BRAND_TOKENS = {
  colors: {
    bgPrimary: "#08090B",
    bgElevated: "#111317",
    bgSecondary: "#191C21",
    bgCardHover: "#20242B",
    borderSubtle: "#22262E",
    borderDefault: "#292D34",
    borderHighlight: "#3F4552",
    brandRed: "#D71920",
    brandRedHover: "#F1262D",
    brandRedDark: "#9E0E14",
    brandRedGlow: "rgba(215, 25, 32, 0.35)",
    metallicChrome: "#E2E8F0",
    metallicGraphite: "#94A3B8",
    textPrimary: "#F5F5F5",
    textSecondary: "#A4A8B0",
    textMuted: "#64748B",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  typography: {
    activePreset: "MODERN_WHEEL_SPECIALIST",
    fontDisplay: "'Oswald', sans-serif",
    fontBody: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  shopInfo: {
    name: "Chi-Town Customs USA",
    address: "311 N Cicero Ave, Chicago, IL 60644",
    phone: "+1 773-287-3000",
    rating: 4.5,
    reviewsCount: 207,
  },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export const RECOMMENDED_FONT_PAIRINGS = [
  {
    id: "MODERN_WHEEL_SPECIALIST",
    headingFont: "Oswald",
    headingWeight: "Bold (700)",
    bodyFont: "Inter",
    bodyWeight: "Regular / Medium (400 / 500)",
    brandVibe: "High-performance, precise, modern wheel specialist",
    isRecommendedDefault: true,
    cssVariables: {
      heading: "var(--font-oswald)",
      body: "var(--font-inter)",
    },
  },
  {
    id: "TRADITIONAL_GARAGE",
    headingFont: "Montserrat",
    headingWeight: "Black (900)",
    bodyFont: "Roboto",
    bodyWeight: "Regular (400)",
    brandVibe: "Reliable, heavy-duty, traditional garage",
    isRecommendedDefault: false,
    cssVariables: {
      heading: "var(--font-montserrat)",
      body: "var(--font-roboto)",
    },
  },
  {
    id: "EMERGENCY_ROADSIDE",
    headingFont: "Teko",
    headingWeight: "Medium (500)",
    bodyFont: "Open Sans",
    bodyWeight: "Regular (400)",
    brandVibe: "Fast, urgent, emergency roadside assistance",
    isRecommendedDefault: false,
    cssVariables: {
      heading: "var(--font-teko)",
      body: "var(--font-open-sans)",
    },
  },
] as const;

