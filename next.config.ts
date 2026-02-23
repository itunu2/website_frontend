import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL ?? "http://127.0.0.1:1337";

const remotePatterns: RemotePattern[] = (() => {
  const patterns: RemotePattern[] = [];

  // Allow images from the Strapi backend
  try {
    const { protocol, hostname, port } = new URL(strapiUrl);
    const normalizedProtocol = protocol.replace(":", "");
    if (normalizedProtocol === "http" || normalizedProtocol === "https") {
      patterns.push({
        protocol: normalizedProtocol,
        hostname,
        port: port || undefined,
        pathname: "/**",
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Unable to parse NEXT_PUBLIC_STRAPI_BASE_URL for image optimization", error);
    }
  }

  // Allow images from Supabase Storage
  patterns.push({
    protocol: "https",
    hostname: "*.supabase.co",
    pathname: "/storage/v1/object/public/**",
  });

  return patterns;
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns,
    dangerouslyAllowLocalIP: true,
  },
  turbopack: {
    root: __dirname,
  },
  experimental: {
    optimizePackageImports: ["clsx", "tailwind-merge"],
  },
};

export default nextConfig;
