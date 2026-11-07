# Wazir Trading LLC — Phase 3 handoff

## Scope completed

Phase 3 adds the public business-information and trust layer to the Phase 1 + Phase 2 Next.js rebuild.

### New routes

| Route | Purpose | SEO handling |
|---|---|---|
| `/about` | Company overview, Japan operation, CEO profile and business approach | Unique title/description, canonical, Open Graph/Twitter metadata, Organization + BreadcrumbList JSON-LD |
| `/how-it-works` | Five-step buyer journey, stock vs sourcing entry points, pre-payment checklist | Unique metadata, canonical, breadcrumbs and internal links |
| `/shipping-information` | RoRo and container overview, route-quote inputs, shipping documents and timing caveats | Unique metadata, canonical, breadcrumbs and useful internal links |
| `/payment-information` | Invoice checks, beneficiary verification, fraud precautions and Incoterms® 2020 explainer | Unique metadata, canonical, breadcrumbs and ICC source link |
| `/contact` | Japan office address, WhatsApp, email, Google Maps link and enquiry form | Unique metadata, canonical, ContactPage + BreadcrumbList JSON-LD |

### Shared UI and navigation

- Reusable trust-page hero, breadcrumbs, section heading, feature cards, step cards, notices and CTA components.
- Responsive page styles aligned with the Phase 1 navy / crimson / white design system.
- Header navigation now points to real public routes instead of homepage hash placeholders.
- Footer now includes direct links to vehicles, About, How it Works, Shipping, Payment and Contact.
- All new pages use semantic headings, landmarks, lists, address markup and visible keyboard focus styles from the existing foundation.

## Business facts and content safeguards

Content was based on the source project, but stale or unsupported marketing claims were intentionally not carried forward.

Included:
- Japan office address: Heights Mizutani 1C, 158-1 Jizou, Kuwana-City, Mie Prefecture, Japan.
- Company email: `wazirtrading-pc@outlook.jp`.
- WhatsApp configured through `NEXT_PUBLIC_WHATSAPP_NUMBER` (source project default: Japan number supplied in the old project).
- Mr. Mumtaz Khan is identified in the source project as Chief Executive Officer; the supplied CEO image is reused.
- Office visits are described as appointment-only, matching the legacy Contact/About pages.

Not included because they require current confirmation:
- Claims of four overseas offices or regional teams.
- Fixed delivery/transit estimates and vessel schedules.
- Specific named vessel services or fixed routes as guaranteed services.
- Guaranteed quote/response turnaround times.
- A fixed 50/50 deposit split or other universal payment terms.
- Public bank account numbers, SWIFT/bank instructions or payment coordinates.
- Guarantees that a particular vehicle can be sourced, shipped or imported into a country.
- Stock counts, awards, testimonials or customer delivery claims without evidence.

Payment safety:
- No bank coordinates are published.
- Buyers are instructed to verify any beneficiary and payment detail using the contact information already published on the website.
- The page distinguishes general Incoterms® 2020 definitions from the terms that must appear in the actual sale contract.
- The CIF insurance section notes that the Incoterms® 2020 default CIF cover is minimum cover unless otherwise agreed.
- The page notes that FOB may be inappropriate where containerized goods are handed over to a carrier at a container terminal; ask which rule fits the actual delivery handover.

Contact form behavior:
- `components/contact-enquiry-form.tsx` validates fields in the browser and prepares a WhatsApp message.
- It does not submit to Supabase or store personal information on the site.
- The visitor must review and send the prepared WhatsApp message themselves; a fallback link is shown if the new tab is blocked.
- No unverified `inquiries` INSERT permission or public database write policy is assumed.

## Files added/changed

Added:
- `components/trust-pages.tsx`
- `components/contact-enquiry-form.tsx`
- `lib/page-metadata.ts`
- `app/about/page.tsx`
- `app/how-it-works/page.tsx`
- `app/shipping-information/page.tsx`
- `app/payment-information/page.tsx`
- `app/contact/page.tsx`

Updated:
- `components/site-header.tsx`
- `components/site-footer.tsx`
- `lib/structured-data.ts`
- `app/sitemap.ts`
- `app/globals.css`
- `README.md`

## Local validation

Run in the project directory:

```powershell
Copy-Item .env.example .env.local
npm install
npm run typecheck
npm run lint
npm run build
npm run dev
```

Then verify:

1. `/about`, `/how-it-works`, `/shipping-information`, `/payment-information` and `/contact` all return HTTP 200.
2. Page source contains each page's H1, page-specific title/description, canonical and JSON-LD where supplied before browser interaction.
3. Header and footer links work on desktop and mobile.
4. Contact form validation prevents incomplete submissions and opens a prefilled WhatsApp draft; it must not claim that the message has already been sent.
5. Click email, WhatsApp and map links.
6. Check the CEO image crop and the company OG image at desktop and small mobile widths.
7. Test 360, 375, 390, 412, 768, 1280 and 1440 px and one real Android device.
8. Keep `NEXT_PUBLIC_ALLOW_INDEXING=false` on local and preview deployments. Enable indexing only on the verified production domain after redirects, inventory and structured-data checks are complete.

## Verification limitation

- All 33 TypeScript/TSX files in this project passed TypeScript transpilation/syntax diagnostics.
- All local TypeScript/TSX imports resolved.
- The referenced local images exist.
- A full `npm install` timed out because the npm registry was unreachable from this environment. Therefore `npm run typecheck`, `npm run lint`, `npm run build`, browser rendering, and live route tests have **not** been verified here.
- Supabase connectivity/RLS was not required for the Phase 3 pages and was not tested.

Do not describe this package as a verified production build until the commands above pass in the local environment or CI.

## Security

This project uses only the public Supabase key and Cloudinary cloud name from `.env.example`. It does not need the Supabase service-role key, database password or Cloudinary API secret. Keep privileged credentials out of `NEXT_PUBLIC_*`, source files, example files and Git. Rotate any credentials previously pasted into chat before production use.
