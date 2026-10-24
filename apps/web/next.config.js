/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@chi-town/contracts", "@chi-town/database", "@chi-town/ui"],
  outputFileTracingIncludes: {
    "/**": ["./public/seed.db", "./seed.db", "../../packages/database/prisma/seed.db"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
