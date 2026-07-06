# By-Bookey — Editorial Fashion Portfolio

Premium, editorial portfolio site for the By-Bookey fashion design studio.
Avant-garde, minimalist, structural — built with React, Tailwind CSS v4, and Vite.

## Stack

- **React 19** + **React Router** (client-side routing across Home, Work, Process, About/Contact)
- **Tailwind CSS 4** via the `@tailwindcss/vite` plugin — design tokens live in `src/index.css`
- **Vite** build tooling
- **Google Fonts**: Playfair Display (serif headings) + Inter (sans body)

## Getting started

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Deploying to Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- `public/_redirects` (`/*  /index.html  200`) is included so client-side
  routes survive deep links and refreshes.
- `vite.config.js` sets `base: './'` so asset paths stay relative.

## Embedding photography

Every image slot on the site is a `<Placeholder>` component
(`src/components/Placeholder.jsx`).

### Quick preview: drag & drop

Drag an image file from your computer straight onto any grey placeholder
frame in the browser — it displays immediately and persists across reloads
(stored in that browser's localStorage). Hover the image and press
**Remove** to clear it.

Note: drag & drop is a *design preview* only — it lives in your browser,
not in the project, so it will not appear on the deployed site or for
other visitors. For the real site, use the permanent method below.

### Permanent: the `src` prop

1. Drop the file into `public/images/` (e.g. `public/images/hero.jpg`).
2. Add a `src` prop to the matching `<Placeholder>` — keep the `label`,
   it becomes the alt text:

```jsx
<Placeholder src="images/hero.jpg" label="Hero — campaign, garment in motion" ... />
```

That's it — the grey frame is replaced by the photo (object-cover, same
aspect ratio, lazy-loaded; add `eager` for above-the-fold images like the
hero). If the file is missing or fails to load, the labeled grey frame
comes back automatically. Recommended sizes: ~1600px long edge for
portraits, ~2400px wide for the hero and full-bleed banners, JPG (~80
quality) or WebP.

## Inserting the logo

Drop the final logo artwork into `public/` as **`logo.svg`** (or update
`LOGO_SRC` in `src/config.js` to match your filename, e.g. `logo.png`).
The header and footer pick it up automatically — no code changes needed.
Until the file exists, the site shows the serif "By–Bookey" wordmark as a
fallback. An SVG (or a transparent PNG at 2x height, ≥ 64px tall) on the
light background works best.

## Floating dock: WhatsApp + Studio Concierge chatbot

A fixed dock in the bottom-right corner holds two actions:

- **WhatsApp** — opens a chat with the studio number. Set `WHATSAPP_NUMBER`
  in `src/config.js` (international format, digits only).
- **Studio Concierge** — a floating retrieval chatbot (`src/components/chat/`).
  It answers questions from the knowledge base in `src/data/knowledge.js`
  (brand, collections, process, materials…) and, for commissions, press,
  buyers, or anything it cannot answer, runs a guided capture flow
  (name → email → message → confirm) and sends the query by email.

### Email delivery

Queries are posted to the Netlify Form **`chatbot-queries`** (registered via
the hidden form in `index.html`). After the first deploy, open the Netlify
dashboard → **Forms → chatbot-queries → Notifications** and add an
**Email notification** pointing at the dedicated inbox.

When the form endpoint is unreachable (e.g. local development), the bot
falls back to opening a pre-filled `mailto:` draft addressed to
`CONTACT_EMAIL` from `src/config.js`.

## Status

The **Homepage** establishes the design language in a luxury-maison style
(inspired by houses like Gucci): solid white header with centered logo and
full-screen hamburger menu, campaign hero with centered title and CTA,
two-up campaign tiles, a snap-scrolling "Selected Looks" carousel, an
atelier banner, a client-services strip, and a footer with link columns,
newsletter signup (Netlify Form "newsletter"), and a giant wordmark.
Work, Process, and About/Contact are stubbed and will be extended with the
same system once the homepage is approved.
