import type { NextConfig } from "next";

import "./src/env"; // Validate environment variables at build time

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  devIndicators: { position: "bottom-right" },
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@base-ui/react",
      "framer-motion",
      "cmdk",
    ],
  },
};

export default nextConfig;
