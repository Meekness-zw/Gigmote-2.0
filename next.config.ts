import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * The CSP is intentionally moderate, not maximally strict:
 *   - `unsafe-inline` for styles is unavoidable while we ship Tailwind v4
 *     with arbitrary-value classes (each one becomes an inline style).
 *   - `unsafe-eval` for scripts is needed because Three.js compiles GLSL
 *     into runtime objects via Function().
 *   - Google Fonts is allowlisted (we load Inter Tight via CDN link).
 *   - data: + blob: in img-src is required for Next/Image responses,
 *     OG images, and the cursor halo SVG noise.
 *   - 'self' covers our own origin; that's where the auth + admin API live.
 *
 * Tighten further in production if you remove the CDN font (self-host)
 * and any inline tags.
 */
const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com",
      "connect-src 'self' https://*.public.blob.vercel-storage.com https://*.private.blob.vercel-storage.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  transpilePackages: ["three"],
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons", "@react-three/drei"],
  },
  async headers() {
    return [
      {
        // Apply to every route, including API.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
