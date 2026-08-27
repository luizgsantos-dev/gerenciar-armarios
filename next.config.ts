import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera .next/standalone com apenas o necessário para rodar em container.
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
