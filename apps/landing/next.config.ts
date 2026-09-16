import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Site photos are served from /public/images; only YouTube thumbnails are remote.
    remotePatterns: [{ protocol: "https", hostname: "i.ytimg.com" }],
  },
  // Keep Google rankings: every old WordPress URL 301s to its new page.
  async redirects() {
    return [
      { source: "/about-lanka-ballooning", destination: "/about", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/hot-air-ballooning-sri-lanka", destination: "/flights", permanent: true },
      { source: "/corporate-ballooning", destination: "/corporate", permanent: true },
      { source: "/faq-sri-lanka-ballooning", destination: "/faq", permanent: true },
      { source: "/contact-hot-air-balloon-dambulla", destination: "/contact", permanent: true },
      { source: "/balloon-ride-reservation", destination: "/book", permanent: true },
      { source: "/make-a-reservation", destination: "/book", permanent: true },
    ];
  },
};

export default nextConfig;
