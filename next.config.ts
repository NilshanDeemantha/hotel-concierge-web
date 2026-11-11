import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Static files only: Firebase Hosting's free plan cannot run a Next.js server.
  output: "export",
  // The image optimizer needs a server too.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
