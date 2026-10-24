/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@chi-town/contracts", "@chi-town/database", "@chi-town/ui"],
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
