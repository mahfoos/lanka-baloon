import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.srilankaballoon.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/flights", "/about", "/corporate", "/faq", "/contact", "/book"].map((p) => ({
    url: base + p,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p === "/book" || p === "/flights" ? 0.9 : 0.7,
  }));
}
