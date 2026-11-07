# Wazir Trading LLC — Next.js rebuild (Phase 1 + Phase 2 + Phase 3 + Phase 4)

The original Vite/TanStack/Wouter website remains untouched. This is the separate Next.js App Router rebuild.

## Stack

- Next.js App Router 16.4.5
- React 19 + TypeScript
- Tailwind CSS v4 (design-system CSS)
- Supabase SSR foundation and stateless public server-side catalogue client
- Cloudinary public delivery URL transformations
- Vercel-ready deployment

## Run locally (PowerShell)

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. Node.js 20.9 or newer is required; Node 22 LTS is recommended.

## Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Preferred canonical website origin; confirm www vs non-www before launch. |
| `NEXT_PUBLIC_ALLOW_INDEXING` | Keep `false` locally and on preview; enable only on the approved production domain. |
| `NEXT_PUBLIC_SUPABASE_URL` | Existing Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public anon/publishable key only; protected by RLS. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary public delivery cloud name. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number in international digits-only format. |

The example file includes only public project values. Never add a Supabase service-role key, database password, Cloudinary API secret or other privileged credential to a `NEXT_PUBLIC_*` variable or Git.

## Phase 1 — Foundation

- Next.js foundation, visual system, homepage, navigation and footer.
- Shared brand assets, responsive design and accessible interaction foundations.
- Organization and WebSite JSON-LD, metadata, canonical URLs, robots and sitemap foundation.
- Supabase/Cloudinary integration foundations and WhatsApp lead request form.

## Phase 2 — Vehicle platform

- Live `/cars` server-rendered catalogue.
- Search, make/body/fuel/transmission/drive/year/FOB filters, sorting and pagination.
- `/cars/[ref]` server-rendered vehicle details based on existing `ref_number`.
- Vehicle photo gallery, thumbnails, keyboard-enabled lightbox and optional auction inspection map.
- Specifications, recorded condition grades, features, FOB price explanation, related vehicles and WhatsApp enquiry.
- Vehicle-specific metadata, Product/Car and BreadcrumbList JSON-LD.
- Dynamic vehicle sitemap and noindex/canonical handling for search/filter URLs.

See `PHASE_2_HANDOFF.md` for the data contract, RLS review, local test procedure and known limitations.

## Phase 3 — Business, export and trust pages

- `/about`: company introduction, Japan operation, CEO profile and approach to vehicle information.
- `/how-it-works`: buyer journey, vehicle review, written quote, payment verification and export steps.
- `/shipping-information`: RoRo and container overview, route-quote inputs and document guidance.
- `/payment-information`: invoice review, payment-verification guidance, fraud warnings and general Incoterms® 2020 explanations.
- `/contact`: Japan office details, WhatsApp/email links, map link and privacy-conscious enquiry form.
- Reusable trust-page components, responsive styles, page-specific metadata, canonical URLs, breadcrumbs, structured data and internal links.
- Header and footer navigation updated to the new public routes; all five pages are included in the sitemap when indexing is enabled.

See `PHASE_3_HANDOFF.md` for page content safeguards, routes, validation steps and known limitations.


## Phase 4 — International SEO landing-page system

- `/makes` and `/makes/[slug]`: manufacturer directory and inventory-derived make pages.
- `/models/[slug]`: inventory-derived combined make/model landing pages.
- `/vehicle-types` and ten curated `/vehicle-types/[slug]` pages for body-style and fuel categories.
- `/import-japanese-cars` and `/import-japanese-cars/[country]`: destination research system with a Pakistan research preview that remains draft/noindex until service coverage and legal content are approved.
- Reusable landing components, buyer checklists, collection/item-list and breadcrumb JSON-LD, dynamic metadata/canonicals, and sitemap integration.
- Homepage category and make links are connected to currently available inventory rather than linking blindly to unavailable options.
- Indexation uses a minimum data-quality gate and excludes arbitrary search/filter permutations. Destination URLs are not indexable or added to the sitemap until service verification and editorial approval are recorded.

See `PHASE_4_HANDOFF.md` for route details, inventory thresholds, destination publication controls, data contract and launch checks.

## Important production checks

1. Run `supabase/PHASE2_ACCESS_AUDIT.sql` and inspect current policies and grants before production.
2. Confirm public anon SELECT access to `cars` and `car_images` is limited to approved public inventory. Never give the public key write permissions on inventory tables.
3. The code intentionally uses explicit select lists; it never selects `chassis_number` for public details and does not use `select('*')`.
4. Vehicle and contact enquiry forms open a prefilled WhatsApp draft. They do not silently store or send details automatically.
5. Replace temporary hero photography with Wazir-owned/licensed vehicle photography.
6. Confirm current business address, WhatsApp number, canonical domain, email, office status and payment processes before production.
7. Keep indexing disabled until full migration and URL redirects are approved.
8. Preserve old URLs and prepare a redirect map before switching the live domain.
9. Rotate exposed privileged credentials before production; this site does not use the service-role key, DB password or Cloudinary API secret.
10. Confirm shipping claims, destination eligibility, document availability and all transaction terms with the operations team before publication.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

The preparation environment could not install npm dependencies because the npm registry timed out. Syntax checks and local-import checks passed, but a full Next.js production build, lint/typecheck, browser rendering, and live database/RLS test remain to be run locally or in CI.
