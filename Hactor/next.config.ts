import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fdoafczqtijfjnsltctd.supabase.co",
        pathname: "/storage/v1/object/public/Activity/**",
      },
    ],
  },
};

export default nextConfig;
