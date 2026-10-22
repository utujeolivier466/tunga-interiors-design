# Tunga Interior — Implementation & Design Plan

## Product scope

A one-page, mobile-first website prototype for Tunga Interior, a Kigali-based interior design and build partner focused on new projects, finishes, renovations, and partitions. The site is consultation-led: no shop, e-commerce, sourcing, product catalog, or pricing.

## Design direction

- **Design movement:** Contemporary African editorial luxury — cinematic, tactile, architectural, and quiet rather than glossy or corporate.
- **Core principles:** 1) Let space and material do the selling. 2) Use generous dark space to create focus. 3) Make WhatsApp/quote conversion obvious without making it loud. 4) Keep the brand distinct from Palacina by leaning into Tunga's project-making and build intelligence rather than showroom/product language.
- **Color philosophy:** Charcoal black and near-black green-black create a gallery-like field; warm mineral gold signals craft, precision, and considered detail; bone/ivory provides reading comfort and a lighter architectural counterpoint. Gold is used as a signature accent, never as a full surface.
- **Layout paradigm:** Long-scroll editorial composition with asymmetric split sections, oversized type, vertical project labels, and offset image crops. Avoid repetitive centered cards; treat each section like a page in a lookbook.
- **Signature elements:** 1) Hairline gold rules with small index labels. 2) Rotated/vertical metadata such as “KIGALI / RWANDA”. 3) Dark framed image blocks with subtle gold corner markers.
- **Interaction philosophy:** Interactions should feel like a guided studio visit: small, immediate feedback; filters change the work wall without modal clutter; CTAs always return to WhatsApp or the quote path.
- **Animation:** Use slow image scale-in on reveal, 180–260ms hover transitions, gentle opacity/translate reveal on scroll, and smooth anchor scrolling. No loops, parallax overload, or distracting motion.
- **Typography system:** Display serif (Cormorant Garamond) for architectural headlines and editorial warmth; neutral sans (Manrope) for navigation, labels, controls, and readable body copy. Use uppercase tracking for metadata only.
- **Brand essence:** Tunga Interior turns ambitious spaces in Kigali into composed, lasting environments through design, finish, renovation, and partition expertise. Personality: **assured, tactile, precise**.
- **Brand voice:** Concise, observant, confident. Example lines: “Spaces with a point of view.” / “Tell us what you’re building. We’ll help shape what it becomes.”
- **Wordmark & logo concept:** A custom-feeling wordmark built from a wide, low-contrast serif for TUNGA and a compact sans “INTERIOR” lockup; a simple gold corner-bracket mark acts as the favicon/section marker.
- **Signature brand color:** Mineral gold `#C8A46A` — warmer and more earthen than bright yellow, ownable against the charcoal field.

## Page structure

1. **Header:** Tunga Interior wordmark, compact anchor nav, primary Request a Quote button, mobile menu.
2. **Hero:** Full-bleed cinematic interior image with dark gradient, “Spaces with a point of view.” headline, supporting line, Get a Quote + WhatsApp actions, Kigali / Rwanda metadata.
3. **Intro statement:** Short positioning statement and “Built for how you live, work, and gather.” editorial copy.
4. **Services:** Three focused image-led services — New Projects, Renovations, Partitions & Finishes — each with concise copy and a numbered index.
5. **Projects:** Large visual project wall with filters: All, New Projects, Renovations, Finishes. Simple client-side filtering.
6. **About / founder:** Tunga story plus James Manzi, CEO & Founder, shown as an editorial text-led founder note rather than an invented portrait.
7. **Contact:** Kigali/Gishushu location, phone, email placeholder, hours, and dominant WhatsApp CTA.
8. **Footer:** Minimal brand line and footer nav.
9. **Floating WhatsApp:** Persistent mobile/desktop action.

## Implementation approach

- React + TypeScript + Tailwind-compatible CSS in the existing managed web starter.
- Single-page app with semantic sections and local state for project filters and mobile nav.
- Bespoke generated JPG assets in `client/public/images/` used via relative paths.
- No backend, database, auth, or external API required for this prototype. WhatsApp and telephone CTAs use `wa.me`/`tel:` links with a placeholder-friendly Kigali number.
- `public/manus-routes.json` declares the root route.
- `app.config.ts` sets a durable project logo URL using a text-only data URI fallback.

## Project structure

- `client/src/App.tsx` — page content, filter state, mobile menu, reveal hooks, section components.
- `client/src/index.css` — global palette, typography, buttons, image treatments, responsive layout, reveal animation.
- `client/public/images/` — generated hero, service, and project imagery.
- `client/public/manus-routes.json` — managed route manifest.
- `plan.md` / `TODO.md` — approved scope and implementation outcomes.

## Iteration: interactive prototype layer

The quote path is now a four-step client-side intake modal: Direction, Your space, Scope, and Contact. Required choices gate progression; the final state creates a personalized WhatsApp handoff using the submitted name, service, and Kigali location. The modal supports backdrop click-to-close, Escape-style close control, back navigation, locked body scroll, progress feedback, responsive mobile layout, and an explicit success state.

The James Manzi founder card is now expandable. Its copy positions Tunga against showroom-led imitation: Tunga begins with how a space should feel, then makes every line, material, and transition earn its place. The interaction reveals the shorthand “local, specific, lived-in — never borrowed.” Service cards also open the quote flow with their service preselected, while the header, hero, mobile menu, and contact CTA all route into the same quote experience.

## Iteration: official brand and contact integration

The supplied Tunga business card is now the source of truth for practical contact details: mobile/WhatsApp **+250 782 017 456**, office **+250 781 705 561**, **mjames@tungainteriordesigns.rw**, **Gishushu, KG 599 Kigali, Rwanda**, and **tungainteriordesigns.rw**. These values replace all placeholders across the quote WhatsApp handoff, contact section, footer, telephone links, email links, and map link.

The Tunga identity is carried into the site with a geometric roof/line mark inspired by the supplied logo and a normalized logo reference asset. The managed project logo metadata now points to the uploaded durable logo asset. The footer is practical rather than decorative: it surfaces address, mobile, email, office number, website, and direct back-to-top navigation.

## Iteration: multi-page navigation

The site is now route-oriented rather than scroll-oriented. The homepage remains the editorial overview at `/`, while `/services`, `/projects`, `/studio`, and `/contact` render focused content pages with the shared header, quote modal, footer, and floating WhatsApp action. Each route has a dedicated page-intro block and only the relevant content section is rendered, keeping the hierarchy clearer and making pages directly shareable.

All primary navigation, wordmark, hero work link, studio link, and footer back link now use normal page routes. Smooth scrolling has been disabled in favor of standard browser page navigation.

## Iteration: service navigation and dedicated service pages

The shared navigation now exposes a Services submenu. Desktop uses hover/focus-style disclosure with direct links to `/services/new-projects`, `/services/renovations`, and `/services/partitions-finishes`; mobile uses a tap-to-expand accordion inside the navigation drawer, with an All services link and direct links for each service. Route changes use ordinary browser navigation so the drawer does not depend on smooth scrolling or in-page state.

Each service route uses the PDF’s shared five-block structure: a dark/gold top section with Request a Quote and See Our Work, a confirmed-scope What's Included list, a four-step How It Works sequence, service-filtered project cards with the House/Office/Hotel/Apartment filter cue, and a closing WhatsApp section with a ready service-specific message. Draft claims marked [confirm] in the supplied PDF were intentionally not presented as confirmed promises. Service routes also set their PDF-aligned document titles.

## Iteration: mobile performance and image-led portfolio expansion

For faster mobile loading on Kigali networks, the hero image is preloaded with high fetch priority, all non-hero images use native lazy loading and asynchronous decoding, and below-the-fold project images use content visibility with intrinsic sizing on mobile. The navigation drawer and route/service dropdowns use contained transforms and shorter mobile transitions; reduced-data mode removes decorative grain and reveal motion. These changes preserve the editorial feel while reducing work before interaction.

The portfolio now includes seven image-led projects: house, apartment, office, hotel, and additional Kigali studies. The three dedicated service pages now filter their related projects by All, House, Office, Hotel, and Apartment so visitors can see more relevant imagery without loading another page.

## Iteration: launch checklist flow

The supplied website flow is now treated as the launch source of truth for the prototype. Service-page “See our work” links pass their service as a query to `/projects`, which initializes the gallery filter to New projects, Renovations, or Finishes. A `/thank-you` route closes the WhatsApp handoff with a truthful “handoff ready” state, direct phone/email recovery, and links back to Projects and Home.

Every standard route now updates the document title and description from route-aware metadata. `sitemap.xml` covers the indexable public pages and `robots.txt` allows the public site while excluding the handoff-only Thank You page. The existing Gishushu Google Maps directions link and persistent WhatsApp action remain active.

External launch work such as creating a Vercel project, connecting the paid domain, payment, Google Business Profile, Search Console, and replacing generated imagery with James’s real project photographs remains outside this sandbox iteration because it requires account access, payment, or source media from James.

## Iteration: richer gallery and mobile quote-flow check

Added three additional photorealistic editorial visual concepts to the Projects gallery and the category dataset: Villa Dining Study, Suite in Shadow, and The Meeting Room. These use reserved managed-image URLs and are intentionally treated as concept visuals, not as documentary Tunga project photographs. The gallery now contains ten cards and the service-page galleries inherit the same richer dataset.

The quote modal was exercised through opening, choosing Renovation, and advancing to the space-details step in the managed preview. The source flow requires four steps, guards progression until required fields are present, constructs a service-aware WhatsApp message, and exposes the final `wa.me` handoff link. A true mobile viewport resize was not available in the configured browser tool; the browser reported a 1280×1100 viewport, so mobile-device acceptance remains pending a real phone or a viewport-capable test runner.

## Iteration: supplied logo integration

Replaced the CSS-drawn roof mark with the supplied black Tunga roof-and-line logo. The cleaned transparent PNG is reused in the shared header and footer Wordmark component, with an inverse filter for dark backgrounds and responsive sizing for mobile. Project metadata now points to the durable uploaded logo asset. Removed the homepage hero labels “Kigali / Rwanda” and “Interior design & build” so the hero leads directly with the Tunga visual identity and headline.

## Iteration: complete horizontal logo lockup

The header and footer now use the supplied full horizontal lockup exactly as provided: roof mark, TUNGA, INTERIORS, and “Modern Interiors Rwanda”. The lockup is responsive on mobile and is also the project metadata logo. The previous symbol-only treatment and duplicate separate wordmark text are no longer used.

## Iteration: black-and-gold logo revision

Replaced the previous white-and-gold horizontal lockup with the newly supplied transparent black-and-gold Tunga Interiors logo. Because the new artwork uses black elements, the shared header/footer Wordmark now places it on a light brand plate for legibility while preserving the supplied artwork and gold accents.

## Iteration: transparent logo presentation

Removed the light CSS plate and all extra Wordmark padding. The site now renders the supplied RGBA logo directly on the page background, preserving its transparent pixels and black-and-gold artwork.
