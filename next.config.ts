import type { NextConfig } from "next";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // output: 'standalone', // Disabled for development - only needed for Docker builds
  /* config options here */
};

export default withPWA(nextConfig);
