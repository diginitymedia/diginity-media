# Diginity Media — Website Project

Complete production-ready website for Diginity Media, a digital marketing agency in Bangalore. Built as a single-page application (SPA) with 26 internal pages, a full content library, and backend integration scaffolding.

---

## 🚀 Run This Locally (no setup needed)

1. Unzip this folder anywhere on your computer
2. Double-click **`index.html`**
3. It opens directly in your browser — no server, no install, no command line required

That's it. The whole site — navigation, all 26 inner pages, the pricing calculator, contact form, everything — works straight off your hard drive using `file://`.

**Recommended for best experience:** open it in Chrome or Edge, and test resizing the browser window to see the mobile responsive layout.

---

## 📁 Folder Structure

```
diginity-media/
├── index.html                      ← Main website (homepage + 26 SPA pages)
├── manifest.json                   ← PWA manifest
├── sitemap.xml                     ← XML sitemap (for Google, once live)
├── robots.txt                      ← Crawler rules (for Google, once live)
├── netlify.toml                    ← Netlify deployment config
├── .htaccess                       ← Apache hosting config (optional, only if hosting on cPanel)
│
├── assets/
│   └── logo.svg                    ← Standalone logo file (all variants)
│
├── pages/
│   ├── 404.html                    ← Custom 404 error page
│   ├── case-studies.html           ← 6 detailed case studies
│   ├── careers.html                ← Careers application form
│   ├── landing-ads.html            ← Standalone Google Ads landing page
│   ├── setup-guide.html            ← Step-by-step deployment guide (read this next!)
│   ├── sitemap.html                ← Human-readable sitemap page
│   │
│   ├── blog/
│   │   ├── seo-bangalore.html
│   │   ├── ai-seo-aeo.html
│   │   ├── local-seo.html
│   │   ├── meta-ads.html
│   │   ├── whatsapp-marketing.html
│   │   └── google-ads-guide.html
│   │
│   ├── legal/
│   │   ├── privacy-policy.html
│   │   ├── terms.html
│   │   ├── cookie-policy.html
│   │   └── refund-policy.html
│   │
│   └── tools/
│       ├── pricing-calculator.html
│       └── lead-dashboard.html
│
└── backend/                        ← Optional Node.js backend (advanced — see below)
    ├── server.js
    ├── package.json
    ├── .env.example
    └── .gitignore
```

---

## ✅ What's Already Working

- **26 pages** inside `index.html`, switched via JavaScript hash routing (`#about`, `#portfolio`, etc.) — works on `file://` and any web host
- **Browser back/forward buttons** work correctly between pages
- **Mobile responsive** — hamburger menu, drawer navigation, fluid typography at 5 breakpoints
- **Contact form** with 4-layer submission: Netlify Forms → EmailJS → localStorage backup → WhatsApp auto-open
- **AI chatbot** wired to the Claude API (needs your own API key/proxy to go live — see Setup Guide)
- **Pricing calculator** — interactive, 40+ services, generates a WhatsApp quote message
- **Lead dashboard** — simple CRM using browser localStorage
- **SEO** — meta tags, Open Graph, Twitter Cards, JSON-LD schema (Organization, LocalBusiness, FAQPage, BreadcrumbList)
- **Legal pages** — Privacy Policy, Terms, Cookie Policy, Refund Policy — all cross-linked correctly
- **All blog posts, case studies, and tools** — fully built, cross-linked, no broken links

---

## 🔶 Before You Go Live — Replace These Placeholders

Open `index.html` in any text editor (VS Code recommended) and use **Find & Replace** for:

| Find | Replace with |
|---|---|
| `91XXXXXXXXXX` | Your real WhatsApp number, e.g. `919876543210` |
| `+91 XXXXX XXXXX` | Your real phone number, e.g. `+91 98765 43210` |
| `hello@diginity.in` | Your real email (if different) |
| `Arjun Kumar` | Your real founder/team name (if used) |
| `G-REPLACE-WITH-YOUR-GA4-ID` | Your Google Analytics 4 Measurement ID |
| `YOUR_EMAILJS_PUBLIC_KEY` | Your EmailJS public key |
| `YOUR_SERVICE_ID` | Your EmailJS service ID |
| `YOUR_TEMPLATE_ID` | Your EmailJS template ID |

These same placeholders also appear in a few of the standalone pages (blog posts, case studies, careers form) — search across all files in your editor ("Find in Files") to catch every instance.

**👉 For step-by-step instructions on every one of these, open `pages/setup-guide.html` in your browser.** It has copy-paste code blocks for EmailJS, Netlify, domain setup, Google Analytics, Search Console, and WhatsApp Business.

---

## 🌐 Going Live (after local testing)

1. Read `pages/setup-guide.html` — it covers everything below in detail
2. Deploy free to [Netlify](https://netlify.com) — drag and drop this whole folder
3. Buy a domain (e.g. `diginity.in`) and connect it in Netlify
4. Set up EmailJS so contact form leads land in your inbox
5. Add your Google Analytics ID
6. Submit `sitemap.xml` to Google Search Console

---

## ⚙️ Optional: Node.js Backend (Advanced)

The `backend/` folder contains an Express.js server for teams who want persistent lead storage in a database instead of relying on Netlify Forms + localStorage. This is **not required** to run or deploy the site — skip it unless you specifically need a custom API.

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your Gmail App Password and WhatsApp number
npm start
```

See `pages/setup-guide.html` → Step 4 for full instructions.

---

## ⚠️ Known Limitations

- **Sitemap URLs vs. actual routing:** `sitemap.xml` lists pretty URLs like `/services/seo/` for SEO planning purposes, but the site itself uses hash-based routing (`#sem`, `#seo`, etc.) for the single-page app. Search engines generally do not index hash-fragment content as separate pages. If deep SEO indexing of individual service pages matters to your strategy, consider migrating those high-priority service pages to real server-rendered routes (e.g. with Next.js, Astro, or static page generation) rather than relying on the SPA hash router for those specific pages.
- **AI chatbot** calls the Anthropic API directly from the browser — this will not work as-is in production because it exposes no API key (and shouldn't expose one client-side). You'll need a small server-side proxy endpoint before this goes live; see `pages/setup-guide.html` for guidance.
- **Netlify Forms** only activates once actually hosted on Netlify — locally it silently does nothing (by design), and the form still works via the EmailJS + WhatsApp layers.

---

## 🧪 Testing Checklist

- [ ] Open `index.html` locally — homepage loads, no console errors
- [ ] Click through all nav links (Home, Services, About, Work, Blog, Pricing, Contact)
- [ ] Resize browser to mobile width — hamburger menu opens/closes correctly
- [ ] Submit the contact form — WhatsApp should open with a pre-filled message
- [ ] Click each footer link (Legal section) — Privacy, Terms, Cookie, Refund all open correctly
- [ ] Open `pages/sitemap.html` — verify all links work
- [ ] Open each blog post from the Blog page — verify "Back to Website" link works
- [ ] Open `pages/tools/pricing-calculator.html` — select services, verify price updates

---

Questions? Everything related to deployment is in `pages/setup-guide.html`.
