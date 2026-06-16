import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "digitalassets.tesla.com",
        pathname: "/tesla-contents/image/upload/**",
      },
    ],
    // Allow unoptimized external images
    unoptimized: true,
  },
};

export default nextConfig;
