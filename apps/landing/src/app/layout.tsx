import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Figtree, Young_Serif } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBookBar } from "@/components/MobileBookBar";
import { company } from "@/lib/content";
import { img } from "@/lib/images";

const display = Young_Serif({ weight: "400", subsets: ["latin"], variable: "--font-young-serif" });
const sans = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.srilankaballoon.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sri Lanka Balloon | Hot Air Balloon Rides in Dambulla & Sigiriya",
    template: "%s | Sri Lanka Balloon",
  },
  description:
    "Sunrise hot air balloon rides over Dambulla, Kandalama and Sigiriya with Lanka Ballooning (Pvt) Ltd — CAASL licensed, fully insured, all taxes included.",
  openGraph: { siteName: company.name, type: "website", images: [img("kandalamaLake")] },
  twitter: { card: "summary_large_image", images: [img("twitterCard")] },
  icons: { icon: img("appIcon"), apple: img("appIcon") },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  name: company.name,
  legalName: company.legal,
  url: siteUrl,
  telephone: company.phone,
  email: company.email,
  image: img("kandalamaLake"),
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address[0],
    addressLocality: "Dambulla",
    postalCode: "21100",
    addressCountry: "LK",
  },
  geo: { "@type": "GeoCoordinates", latitude: 7.863288, longitude: 80.664076 },
  sameAs: company.social.map((s) => s.href),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        {/* Marks that JS is available, before first paint, so scroll reveals can start
            hidden without hiding anything from visitors who have JS turned off. */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBookBar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
