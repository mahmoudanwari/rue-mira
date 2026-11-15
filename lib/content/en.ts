import type { SiteContent } from "./types";

const sizeRows = [
  ["XS", "32–34", "80–84", "62–66", "88–92"],
  ["S", "36", "85–88", "67–70", "93–96"],
  ["M", "38", "89–92", "71–74", "97–100"],
  ["L", "40", "93–97", "75–79", "101–105"],
  ["XL", "42", "98–102", "80–84", "106–110"],
];
const waistRows = [
  ["24", "XS", "61–62"],
  ["26", "XS–S", "66–67"],
  ["28", "S–M", "71–72"],
  ["30", "M", "76–77"],
  ["32", "L", "81–82"],
  ["34", "XL", "86–87"],
];
const shoeRows = [
  ["36", "3.5", "23.0"],
  ["37", "4", "23.7"],
  ["38", "5", "24.3"],
  ["39", "6", "25.0"],
  ["40", "6.5", "25.7"],
  ["41", "7.5", "26.3"],
];

export const SIZE_ROWS = { sizeRows, waistRows, shoeRows };

const content: SiteContent = {
  about: {
    intro:
      "RUE MIRA is a fictional label imagined for a design portfolio: a small Brussels studio making everyday clothes and accessories that feel considered, warm and quietly special — at prices that stay friendly.",
    sections: [
      {
        heading: "The idea",
        paragraphs: [
          "Most of what we wear is worn on ordinary days. RUE MIRA starts there: the tram, the desk, the market, the dinner that wasn't planned. The pieces are designed to work together, to last more than one season and to feel good the hundredth time you put them on.",
          "Colours come from the city — brick burgundy, stone, espresso, a pale morning blue — so that a dress, a jacket and a bag can meet in one outfit without trying too hard.",
        ],
      },
      {
        heading: "The (imagined) studio",
        paragraphs: [
          "Our story is invented: there is no real atelier, no real team and no products for sale. What is real is the craft behind this website — the art direction, interface design, accessibility and front-end engineering you can explore on every page.",
        ],
      },
      {
        heading: "What we stand for",
        paragraphs: [
          "Honest presentation. You will not find invented reviews, fake scarcity or countdown timers here. Stock numbers are demo numbers and are labelled as such.",
          "Inclusive, adult-led imagery. Every model in our photography is an adult, and every image was generated specifically for this demo.",
        ],
      },
    ],
    quote: "“We design for the day you actually have, not the one in the magazine.”",
    portraitAlt: "Portrait of the fictional RUE MIRA founder in the studio",
    studioAlt: "The imagined RUE MIRA studio with fabric samples and a work table",
  },
  journal: {
    intro: "Two short stories from the (fictional) studio — about getting dressed, and about the city that inspires us.",
    readMore: "Read the story",
    backToJournal: "Back to the journal",
    stories: [
      {
        slug: "city-uniform",
        title: "In praise of the city uniform",
        dek: "Why the best wardrobes repeat themselves — and how to make repetition feel like you.",
        date: "2026-03-12",
        image: "/images/Home page and campaign images/75-home-editorial-city-style.png",
        imageAlt: "",
        pull: "Repetition is not boring when every piece earns its place.",
        body: [
          "There is a quiet confidence in people who seem to wear the same thing every day. Look closer and it is rarely the same thing — it is the same idea: a shape that works, colours that agree, one detail that changes.",
          "Our city pieces start with that idea. A wide trouser that sits at the waist. A shirt that can be tucked, knotted or worn open. A cropped trench that ends exactly where a high waist begins.",
          "Build three of those and you have a week. Add a small bag in a warm colour and the week becomes yours.",
          "This article is fictional editorial content written for a portfolio demo.",
        ],
      },
      {
        slug: "slow-weekend",
        title: "Notes on a slow weekend",
        dek: "Markets, terraces and the art of dressing for nowhere in particular.",
        date: "2026-04-02",
        image: "/images/Home page and campaign images/76-home-weekend-edit.png",
        imageAlt: "",
        pull: "The best weekend outfit is the one you forget you're wearing.",
        body: [
          "Weekend clothes have a different job. They need to survive a market, a long lunch and a walk home that takes the scenic route.",
          "We reach for floral viscose that moves, a woven shopper big enough for flowers and bread, and sandals with a heel low enough to forget about.",
          "Nothing too precious, nothing too planned — and still, somehow, put together.",
          "This article is fictional editorial content written for a portfolio demo.",
        ],
      },
    ],
  },
  help: {
    intro: "Answers to common questions — written for this demo store. Nothing here describes a real service.",
    faq: [
      { q: "Can I really buy something?", a: "No. RUE MIRA is a portfolio demo. The checkout is simulated from start to finish and never asks for or stores payment details." },
      { q: "Where is my bag saved?", a: "In your browser's local storage, on this device only. If your browser blocks storage, the bag lasts for this visit only." },
      { q: "Is there a promo code?", a: "Yes — try MIRA10 in the bag for a 10% demo discount." },
      { q: "How does shipping work?", a: "It doesn't — but the demo calculates it: €4.95 home delivery (free from €70 before discounts) or €2.95 to a pickup point. All rates are fictional." },
      { q: "How do I find my size?", a: "Open the size guide from any product page, or visit the size guide page for full tables in centimetres." },
      { q: "What is the Demo Studio?", a: "A public playground that imitates a back-office. You can edit prices, stock and visibility — but only in your own browser." },
      { q: "How do I reset everything?", a: "Open the Demo Studio and choose “Reset demo”. You'll be asked to confirm first." },
    ],
  },
  delivery: {
    intro: "Our delivery and returns policy — entirely fictional, written to make the demo feel complete.",
    sections: [
      { heading: "Delivery in Belgium (demo)", paragraphs: ["Home delivery: €4.95, estimated 2–4 working days. Free from €70 (subtotal before discounts).", "Pickup point: €2.95, estimated 3–5 working days."] },
      { heading: "Returns (demo)", paragraphs: ["In a real shop, you'd have 30 days to return unworn items. In this demo, nothing is ever shipped, so nothing needs returning."] },
      { heading: "Prices and VAT", paragraphs: ["All prices are shown in euros and include 21% Belgian VAT. Totals are calculated in whole cents to avoid rounding errors."] },
    ],
  },
  sizeGuide: {
    intro: "Measurements are in centimetres and describe your body, not the garment. These tables are illustrative for this demo.",
    howTo: {
      heading: "How to measure",
      paragraphs: [
        "Bust: around the fullest part of your chest. Waist: around your natural waistline. Hips: around the fullest part of your hips. Foot: heel to longest toe, standing.",
        "Between two sizes? Choose the larger size for a relaxed fit and the smaller for a closer fit.",
      ],
    },
    tables: [
      { caption: "Clothing (XS–XL)", headers: ["Size", "EU", "Bust", "Waist", "Hips"], rows: sizeRows },
      { caption: "Denim (waist sizes)", headers: ["Waist size", "Equivalent", "Waist (cm)"], rows: waistRows },
      { caption: "Shoes (EU)", headers: ["EU", "UK", "Foot length (cm)"], rows: shoeRows },
    ],
  },
  privacy: {
    intro: "This demo is designed to collect nothing. Here is exactly what happens with data on this site.",
    sections: [
      { heading: "What is stored", paragraphs: ["Only non-personal demo state, in your own browser's local storage: bag lines (product ID, size, quantity), wishlist and compare product IDs, Demo Studio edits, your language choice and demo order records (code, items, totals, time)."] },
      { heading: "What is never stored or sent", paragraphs: ["Names, addresses, emails and messages you type into checkout, contact or newsletter forms stay in the page's memory and disappear when you leave. Nothing is sent to a server — there is no server.", "No payment details are ever requested."] },
      { heading: "Cookies and tracking", paragraphs: ["This demo uses no cookies, analytics or third-party trackers."] },
      { heading: "Clearing your data", paragraphs: ["Use “Reset demo” in the Demo Studio, or clear this site's data in your browser settings."] },
    ],
  },
  terms: {
    intro: "Plain-language terms for a demo store.",
    sections: [
      { heading: "No sale", paragraphs: ["RUE MIRA is fictional. Nothing on this site is offered for sale, and no contract is formed by using the checkout."] },
      { heading: "Content", paragraphs: ["Product names, descriptions, prices, people and policies are invented. Photography was generated for this demo; all depicted models are adults. Any resemblance to real brands or people is unintended."] },
      { heading: "Use", paragraphs: ["You are welcome to explore every feature. Please don't enter real personal or financial information — it isn't needed."] },
    ],
  },
  demo: {
    intro: "RUE MIRA is a portfolio project that demonstrates a complete, accessible, multilingual e-commerce front end — running entirely as a static site.",
    sections: [
      { heading: "What works", paragraphs: ["Search with typeahead, composable filters and sorting with shareable URLs, quick view, zoomable galleries, size guide, wishlist, compare (up to 4), bag with promo code and shipping maths, a five-step simulated checkout, demo order history, a shoppable lookbook and a local Demo Studio."] },
      { heading: "What is simulated", paragraphs: ["Payments, emails, accounts, inventory and delivery. Everything happens in your browser and is clearly labelled."] },
      { heading: "How it's built", paragraphs: ["Next.js App Router with static export, TypeScript, Tailwind CSS and Motion. All pages — including 96 product pages in three languages — are generated at build time and can be hosted on GitHub Pages."] },
      { heading: "Accessibility", paragraphs: ["Keyboard-operable menus, dialogs with focus management, visible focus states, semantic landmarks, translated labels and reduced-motion support."] },
    ],
  },
};

export default content;
