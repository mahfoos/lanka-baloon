# Current site check — srilankaballoon.com

Things found on the live WordPress site, and how the redesign handles them.

## Broken or inconsistent
- **Stat counters show "0"** on the Flights page (Hot Air Balloons 0, Passengers 0…). Replaced with real numbers.
- **Footer links use different URLs** than the menu (`/about-us/`, `/faq/`), and the Contact page button goes to `/make-a-reservation/`. All now redirect to one page each.
- **Contact page's internal title is "Travel Blog".**
- **Duplicate reviews** in the Tripadvisor slider (same reviews repeated). Shown once each now.
- **Conflicting facts** — confirm with the client:
  - About page: 4 balloons / 56 seats; FAQ: "operating three balloons"; Twitter meta: "3 Hot Air Balloons".
  - Home: "9 years of flying"; a 2026 Facebook post: 11th consecutive season.
  - Gift vouchers: "valid any day for one year" vs "a specific date or any day for one year".
  - Emails in use: fly@, info@ and booking@srilankaballoon.com.
- "over 20 years" on the home page links to uluergroup.com for no clear reason.
- Copyright reads "© Copyright 2016 -" with no end year (now automatic).

## Typos fixed in the new copy
unfergettable, Wheather, Chidren, spesific, depanding, feets, Largerst, Excutive, Commcerial, Graduted, "1,5 Hours".

## Performance / tech
- Heavy WordPress + page-builder theme with a full-screen "Loading…" screen, Instagram/Facebook/Twitter feed plugins and six YouTube iframes loaded on the home page.
- Redesign: static pages, next/image optimisation, YouTube loads only on click, no social feed scripts.

## SEO kept / added
- 301 redirects from every old URL, per-page titles and descriptions, sitemap.xml, robots.txt, TouristAttraction and FAQPage structured data.

## Booking
- The old form has no live price and no visible field labels in the page source. The new form shows a running total, validates input, saves to Supabase with a booking reference, and gives staff an admin list with status tracking.
