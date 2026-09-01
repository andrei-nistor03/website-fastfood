import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    // The mascot artwork in public/brand is SVG; next/image blocks SVG
    // sources by default (they can carry scripts), so this opts back in
    // with the CSP Next recommends for that case.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
