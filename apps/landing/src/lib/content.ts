import type { ImageKey } from "./images";

// All site copy lives here so the client can edit it in one place.
// Text is tightened from the current site (typos fixed); confirm final wording with the client.

export const company = {
  name: "Sri Lanka Balloon",
  legal: "Lanka Ballooning (Pvt) Ltd",
  tagline: "Hot air balloon rides over Dambulla, Kandalama and Sigiriya",
  address: ["1st Mile Post, Batuyaya, Kandalama Road", "Dambulla 21100, Sri Lanka"],
  phone: "+94 77 472 7700",
  phoneHref: "tel:+94774727700",
  whatsapp: "https://wa.me/94774727700",
  fax: "+94 66 205 3700",
  email: "fly@srilankaballoon.com",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15809.213450943244!2d80.664076!3d7.863288!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x733e56dcd94f035d!2sLanka+Ballooning+(Pvt)+Ltd!5e0!3m2!1sen!2slk",
  season: "November to May",
  tripadvisor:
    "https://www.tripadvisor.com/Attraction_Review-g304133-d11891936-Reviews-Lanka_Ballooning_Pvt_Ltd-Dambulla_Central_Province.html",
  social: [
    { label: "Facebook", href: "https://www.facebook.com/srilankaballoon" },
    { label: "Instagram", href: "https://www.instagram.com/srilankaballoon/" },
    { label: "X", href: "https://twitter.com/lankaballooning" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/srilankaballoon" },
    { label: "YouTube", href: "https://www.youtube.com/channel/UCYAP2zew7q_AvBP8k5Cj89A" },
  ],
};

export const nav = [
  { label: "Flights", href: "/flights" },
  { label: "About", href: "/about" },
  { label: "Corporate", href: "/corporate" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const pickupAreas = ["Dambulla", "Kandalama", "Sigiriya", "Habarana"];

export type Rate = {
  id: "child" | "adult" | "private";
  name: string;
  price: number;
  unit: string;
  includes: string[];
};

const standardIncludes = [
  "Hotel transfers in Dambulla, Kandalama, Sigiriya and Habarana",
  "Breakfast at the launch site",
  "1-hour balloon flight",
  "Cold water on board",
  "Landing celebration",
  "Personalised flight certificate",
  "Insurance",
];

export const rates: Rate[] = [
  { id: "adult", name: "Standard flight, adult", price: 250, unit: "per adult", includes: standardIncludes },
  { id: "child", name: "Standard flight, child", price: 200, unit: "per child", includes: standardIncludes },
  {
    id: "private",
    name: "Private flight, 1–16 guests",
    price: 4000,
    unit: "per balloon",
    includes: [
      "Private hotel transfers in Dambulla, Kandalama, Sigiriya and Habarana",
      "Breakfast at the launch site",
      "1.5-hour balloon flight",
      "Cold water on board",
      "Landing celebration",
      "Personalised flight certificates",
      "Insurance",
    ],
  },
];

export const extras = [
  { id: "gift_voucher", label: "Gift voucher", price: 5 },
  { id: "birthday_cake", label: "Birthday cake", price: 20 },
] as const;

// The morning is a real sequence, so it's shown as a timeline.
export const flightDay: { when: string; title: string; body: string; image: ImageKey }[] = [
  {
    when: "Sunrise − 60 min",
    title: "Hotel pick-up",
    body: "We collect you in an air-conditioned company vehicle from any hotel in Dambulla, Kandalama, Sigiriya or Habarana.",
    image: "pickupVehicle",
  },
  {
    when: "Sunrise − 40 min",
    title: "Breakfast at the launch field",
    body: "Ceylon tea, coffee and a breakfast box of sandwiches, bananas and biscuits while the crew inflates the balloons beside Kandalama.",
    image: "breakfast",
  },
  {
    when: "Sunrise − 10 min",
    title: "Safety briefing and take-off",
    body: "Your pilot walks you through everything you need to know, then the balloon lifts gently off the field by the lake.",
    image: "boarding",
  },
  {
    when: "Sunrise",
    title: "One hour in the air",
    body: "About 60 minutes (± 10) over lakes, jungle, temples and villages — from tree-top level up to 2,000 ft.",
    image: "kandalamaLake",
  },
  {
    when: "After landing",
    title: "Landing celebration",
    body: "Champagne, juice and cake, and your pilot presents your personalised flight certificate.",
    image: "champagne",
  },
  {
    when: "About 3 hours in total",
    title: "Back at your hotel",
    body: "Our minibuses return you in time for any morning sightseeing you've planned.",
    image: "pickupVehicle",
  },
];

export const whyUs = [
  { title: "Best safety record", body: "The best safety record in Sri Lanka, and the only operator with safety belts in every basket." },
  { title: "Newest, roomiest balloons", body: "Ultramagic (Spain) and Lindstrand (UK) balloons with VIP baskets and the latest EASA safety features." },
  { title: "Fewer passengers per basket", body: "We carry fewer guests per balloon, so everyone has space at the rail." },
  { title: "A longer, scenic route", body: "We don't just fly straight — we drop to tree-top level over lakes and forest, then climb for the wide view." },
  { title: "Pilots with decades of experience", body: "Commercial pilots licensed and validated by CAASL, many with 20 years in ballooning." },
  { title: "No hidden costs", body: "Prices include all taxes and fees. If weather cancels your flight, you pay nothing." },
];

export const occasions = [
  {
    title: "Marriage proposal",
    body: "Pop the question 500 feet up. Tell us a few days ahead and our ground crew will unroll a banner with your message right after take-off — then champagne in the sky.",
  },
  {
    title: "Birthday",
    body: "A banner on the basket and a flight they'll never forget. Add a birthday cake to your booking for the landing celebration.",
  },
  {
    title: "Wedding anniversary",
    body: "We decorate the basket with a banner and flowers. You just smile for the in-flight camera.",
  },
  {
    title: "Private flight",
    body: "The whole balloon for your couple, family or group of up to 16 — just you and your pilot.",
  },
];

export const testimonials = [
  {
    name: "Gabriella K",
    date: "April 2024",
    title: "A must-do in Sri Lanka",
    body: "Sunrise colours, a calm flight, plenty of room in the basket, punctual pick-up and friendly, clearly experienced staff. One of the best things we've ever done.",
  },
  {
    name: "171HelenM",
    date: "April 2024",
    title: "Stunning!",
    body: "Great communication when booking, pick-up as expected, a thorough safety briefing and a graceful landing right next to the vans. We'd go again.",
  },
  {
    name: "nahsmir",
    date: "July 2024",
    title: "Stunning views all round",
    body: "Smooth from take-off to landing, with Sigiriya in view. Highly recommended for anyone who wants a unique adventure.",
  },
  {
    name: "Lanka B",
    date: "November 2023",
    title: "Unique experience",
    body: "Hills, lakes, jungle, fishermen and temples — ballooning in Sri Lanka is different. Thanks to Pilot Alparslan and the team.",
  },
];

export const videos = ["ADOqqxW0aI0", "IvqeFTwbFd0", "-Wa_pQaxfwU", "FW8T6w0H_m8", "B0qRauQt4CY", "g1fVgVaFCrY"];

export const certifications = [
  {
    title: "Air Operator Certificate",
    body: "Fully licensed and approved by the Civil Aviation Authority of Sri Lanka (CAASL). Every flight runs with CAASL and local authority permission.",
    image: "operatorLicense" as ImageKey,
  },
  {
    title: "Pilot licences",
    body: "Our pilots hold commercial balloon pilot licences with CAASL validation certificates, and are tested every year by Sri Lankan examiners.",
    image: "pilotLicense" as ImageKey,
  },
  {
    title: "Passenger insurance",
    body: "Fully insured by Sri Lanka Insurance Corporation, with policies inspected and approved by CAASL.",
    image: "insurance" as ImageKey,
  },
];

// `count: false` for the year — it's a date, not a quantity, so it neither counts
// up nor takes a thousands separator.
export const stats: { to: number; suffix?: string; label: string; count?: boolean }[] = [
  { to: 4, label: "Hot air balloons" },
  { to: 56, label: "Passengers per flight" },
  { to: 2016, label: "Flying since", count: false },
  { to: 2000, suffix: " ft", label: "Maximum altitude" },
];

// The photo rail on the home page. Ordered as a morning: crew inflating in the dark,
// take-off, the view, the people, the landing.
export const gallery: { image: ImageKey; alt: string }[] = [
  { image: "faqInflation", alt: "Ground crew inflating a balloon envelope before dawn" },
  { image: "boarding", alt: "Guests boarding the basket as the balloon lifts off" },
  { image: "homeHeaderMobile", alt: "Balloons over the Dambulla countryside at sunrise" },
  { image: "faqArea", alt: "The view down over lakes and jungle from 600 metres" },
  { image: "faqSigiriya", alt: "Sigiriya rock seen from a hot air balloon" },
  { image: "faqGuests1", alt: "Guests at the rail of the basket during the flight" },
  { image: "faqHigh", alt: "A balloon high above the Kandalama landscape" },
  { image: "faqGuests2", alt: "Guests watching the sunrise from the balloon" },
  { image: "faqWicker", alt: "Close-up of the woven wicker basket" },
  { image: "champagne", alt: "Champagne celebration after landing" },
];

export const team: { name: string; role: string; bio: string; image: ImageKey; instagram?: string }[] = [
  { name: "Mahmut Sami Uluer", role: "Managing Director, Commercial & Instructor Pilot", image: "teamMahmut",
    bio: "Honorary Consul of Sri Lanka to Cappadocia, attorney-at-law and former examiner pilot, with 18+ years in ballooning. Certified Lindstrand and Ultramagic maintenance technician." },
  { name: "Melih Topaç", role: "Chief Pilot, Quality Manager", image: "teamMelih", instagram: "https://www.instagram.com/melihtopac050",
    bio: "550+ flight hours across Cappadocia, Pamukkale, Soğanlı and Sri Lanka. Certified technician and safety management specialist." },
  { name: "Mustafa Kırım", role: "Instructor Pilot, Maintenance Manager", image: "teamMustafa", instagram: "https://www.instagram.com/kirim.krm",
    bio: "1,500+ flight hours over 10 years on Lindstrand, Ultramagic, Cameron, Kubicek and Pasha balloons. Has trained many professional pilots." },
  { name: "Alparslan Uluer", role: "Pilot", image: "teamAlparslan", instagram: "https://www.instagram.com/alparslanuluer",
    bio: "3,000+ flight hours over 19 years, flight instructor and former Turkish Civil Aviation examiner pilot." },
  { name: "M. Ali Koçak", role: "Pilot", image: "teamAli", instagram: "https://www.instagram.com/pilot.mali",
    bio: "1,100+ flight hours in Cappadocia, the Serengeti and Sri Lanka. Instructor pilot and international volleyball referee." },
  { name: "Aflal Faleel", role: "General Manager", image: "teamAflal", instagram: "https://www.instagram.com/aflalfaleel",
    bio: "Runs marketing and reservations with guests, agencies, hotels and guides. Speaks English, Sinhala, Tamil, Turkish and Arabic." },
  { name: "Hiras Jiffry", role: "Operation Manager", image: "teamHiras", instagram: "https://www.instagram.com/hirasjiffry",
    bio: "Plans each day's operation and will greet you at the take-off field. Speaks English, Sinhala, Tamil and Turkish." },
  { name: "Chalani Hansika", role: "Reservation and Sales Officer", image: "teamChalani",
    bio: "Born in Dambulla, with 4+ years in hospitality. Looks after reservations and guest communication in Sinhala and English." },
  { name: "Nadun Rohan", role: "Operations & Transport Coordinator", image: "teamNadun", instagram: "https://www.instagram.com/dananjaya7371",
    bio: "Manages ground handling and transport, and meets you at pick-up. Speaks English and Sinhala." },
];

export const fleet: { reg: string; capacity: string; maker: string; origin: string; image: ImageKey }[] = [
  { reg: "4R-BTL", capacity: "16 + 1", maker: "Ultramagic", origin: "Spain", image: "fleetBTL" },
  { reg: "4R-SLB", capacity: "16 + 1", maker: "Ultramagic", origin: "Spain", image: "fleetSLB" },
  { reg: "4R-ULR", capacity: "16 + 1", maker: "Lindstrand", origin: "UK", image: "fleetULR" },
  { reg: "4R-BLN", capacity: "10 + 1", maker: "Lindstrand", origin: "UK", image: "fleetBLN" },
];

export const corporateUses = [
  "An event in the sky for your team",
  "A meeting in the air",
  "An unforgettable experience for your customers",
  "A tethered flight at your own venue",
  "A balloon for a film or commercial shoot",
];

export const caseStudies: { brand: string; body: string; image?: ImageKey; video?: string }[] = [
  { brand: "Dialog – Genie", image: "corpDialog2",
    body: "A Valentine's Day flight for Genie users, with branding on the balloon and the flight filmed from the ground and by drone." },
  { brand: "Signal (Unilever)", image: "corpSignal", video: "GgLQBRyjkoU",
    body: "Our balloon featured across locations in Signal's advert “Celebrating the Art of Sri Lankan Smile”." },
  { brand: "PE Plus", image: "corpPE", video: "k_HlehPOiBw",
    body: "A private flight as the prize of the PE Plus Blue Tech competition, with in-flight footage used in national TV ads." },
  { brand: "Huawei", image: "corpHuawei",
    body: "The P30 Lite launch imagery was shot with our balloon and used in Huawei's campaigns worldwide." },
  { brand: "Sunday Times Travel Magazine", image: "corpTravelMag",
    body: "A cover story on Sri Lanka Balloon, including an in-flight interview with Mahmut Sami Uluer." },
  { brand: "Young Business Club", image: "corpYBC", video: "VwMmZ6kjKAE",
    body: "An interview on investing in Sri Lanka and building balloon tourism." },
  { brand: "Rupavahini TV", image: "corpRupavahini",
    body: "An in-flight interview on ballooning's role in civil aviation, tourism and the economy." },
];

// Grouped so a 16-question list reads as three short ones. `faqTopics` sets the order.
export const faqTopics = ["How ballooning works", "Before you fly", "Booking and payment"] as const;
export type FaqTopic = (typeof faqTopics)[number];

export const faqs: { q: string; a: string; topic: FaqTopic; image?: ImageKey }[] = [
  { q: "How do hot air balloons fly?", topic: "How ballooning works", image: "faqHowFly",
    a: "A burner heats the air inside the envelope to about 100°C. Hot air is lighter than the cooler air around it, so the balloon rises. A vent at the top (the parachute) releases air to descend." },
  { q: "How big are the balloons?", topic: "How ballooning works", image: "faqHowBig",
    a: "Balloons range from one person to 32 passengers. We fly medium-size balloons for 10 and 16 guests, which we find gives the best experience." },
  { q: "What are the balloons made of?", topic: "How ballooning works", image: "faqMaterial",
    a: "The envelope is tightly woven, coated nylon or polyester. Ours use Hyperlast new-generation fabric, leather-covered padded baskets with safety belts, and Quad Shadow burners." },
  { q: "Why are flights so early?", topic: "How ballooning works", image: "faqEarly",
    a: "Winds are calmest just after sunrise. Afternoon flights aren't practical in Sri Lanka because of the heat." },
  { q: "How do you steer?", topic: "How ballooning works", image: "faqSteer",
    a: "The wind steers. Pilots change height to find wind layers going in different directions, so we can follow a more scenic route rather than flying straight." },
  { q: "How high do you fly?", topic: "How ballooning works", image: "faqHigh",
    a: "Anywhere from tree-top level to a few thousand feet. The CAASL limit is 2,000 ft above ground." },
  { q: "How long is the flight?", topic: "How ballooning works", image: "faqLong",
    a: "About one hour, depending on weather and landing spots. Allow 3 hours from pick-up to drop-off." },
  { q: "Is it cold up there?", topic: "Before you fly",
    a: "No. We don't fly high enough for a big temperature change, and the burner keeps the basket warm." },
  { q: "What if I have vertigo?", topic: "Before you fly", image: "faqDambulla",
    a: "The basket is stable and doesn't swing, and there's no fixed edge to judge height against. Guests with severe vertigo have told us they felt comfortable once airborne." },
  { q: "Who can fly?", topic: "Before you fly", image: "faqChildren",
    a: "Most people aged 6 to 90 who can stand for the flight, climb in and out of the basket, and follow safety instructions. Contact us about children under 6." },
  { q: "Who shouldn't fly?", topic: "Before you fly",
    a: "Anyone recently operated on, with severe mid-body pain, fragile or broken bones, or who needs mobility aids; pregnant women; and children under 6 unless arranged with us." },
  { q: "What should I wear and bring?", topic: "Before you fly", image: "faqFriends",
    a: "Comfortable low-heeled shoes, sunglasses and a hat. Bring your camera or phone — our crew will help you capture the moment." },
  { q: "Do I pay in advance?", topic: "Booking and payment",
    a: "Yes. Once you send a reservation we email payment instructions. We accept all major credit cards and bank deposit to our Sri Lankan account." },
  { q: "What if the weather cancels my flight?", topic: "Booking and payment", image: "faqBalloonFlight",
    a: "You get a full refund, or you can join the next day's flight if there's space. The pilot makes the final call after checking with the meteorological department and the Sri Lanka Air Force." },
  { q: "Can I cancel?", topic: "Booking and payment",
    a: "Yes, up to 48 hours before the flight for a full refund. Gift voucher dates can be changed on request, subject to availability." },
  { q: "Why are balloon flights expensive?", topic: "Booking and payment", image: "faqAbout",
    a: "Balloons and parts are imported from the UK and Spain and have limited lifespans, propane prices fluctuate, and civil aviation compliance is costly. Running the fleet also takes around 20 skilled staff." },
];

export const giftVoucher = {
  body: "Book a flight as a gift for a birthday, anniversary, wedding or the holidays. Tick “Gift voucher” on the booking form and we'll email the voucher once your booking is confirmed. Vouchers are valid for a set date or any flying day within one year.",
};

export const gettingHere = [
  { from: "Colombo", options: "Fly Cinnamon Air (CMB → Sigiriya), take the train to Habarana (2 a day), or an A/C bus — about 170 km, 4 hours. A taxi is around LKR 20,000." },
  { from: "Kandy", options: "Public bus, about 90 km, 2.5 hours. Ask us about private Kandy–Dambulla transfers." },
];
