# Phase 4 handoff — International SEO landing-page system

This package contains the cumulative Wazir Trading Next.js rebuild through Phase 4. It does not replace or modify the original website.

## What Phase 4 adds

### Inventory-derived make and model pages

- `/makes` — live manufacturer directory from public, available inventory.
- `/makes/[slug]` — make landing pages generated from the make values in `cars`.
- `/models/[slug]` — combined make/model pages generated from the current taxonomy. A model slug includes separate make and model segments joined by a reserved `--` delimiter (for example, `/models/toyota--prius`) to reduce collisions.
- Make and model pages show current vehicle records, model links, and vehicle-level facts. Manufacturer names and logos are used for identification; the pages do not imply authorized-dealer status.

### Inventory-derived vehicle categories

- `/vehicle-types` — category directory.
- `/vehicle-types/suvs`
- `/vehicle-types/sedans`
- `/vehicle-types/hatchbacks`
- `/vehicle-types/vans-and-mpvs`
- `/vehicle-types/pickup-trucks`
- `/vehicle-types/commercial-vehicles`
- `/vehicle-types/station-wagons`
- `/vehicle-types/hybrid-vehicles`
- `/vehicle-types/electric-vehicles`
- `/vehicle-types/diesel-vehicles`

Category mappings use the actual body-type/fuel labels found in the legacy application. Review these mappings whenever inventory data-entry conventions change.

### Destination research architecture

- `/import-japanese-cars` — destination directory, indexable only when at least three country guides are approved.
- `/import-japanese-cars/pakistan` — first destination research preview.

**Pakistan remains draft and noindex.** The legacy site collecting enquiries from Pakistan does not prove that Wazir Trading currently supports the route. The draft makes no shipping/service promise and links to official government references for buyer verification. Do not publish until both destination service capability and the local legal guidance are reviewed and approved.

## Indexation safeguards

- `NEXT_PUBLIC_ALLOW_INDEXING` must be `true` only on the approved production domain. Preview/local environments should remain non-indexable.
- Make/model/category pages require at least `MIN_INDEXABLE_LANDING_VEHICLES` (currently 4) records that satisfy the vehicle indexability checks: a safe reference, make, model, numeric year, at least one additional vehicle specification and at least one real HTTPS vehicle image (not an auction map image).
- The threshold is an internal publishing gate, not a Google ranking guarantee. Reassess it after reviewing the live inventory and Search Console performance. A page must still offer meaningful utility; passing the numeric gate does not automatically make a page high quality.
- Arbitrary filter/search/sort URLs remain outside the indexable landing-page system.
- The makes directory is noindex and omitted from the sitemap if the taxonomy scan is truncated.
- Destination guides appear in the sitemap only when `publicationStatus` is `published`, `serviceVerified` is `true`, and at least two sources are supplied.
- The destination directory appears in the sitemap only after at least three destination guides meet those conditions.
- The homepage now links to category cards only when matching available inventory exists. It links popular make marks only when those makes occur in the current inventory.
- CollectionPage/ItemList and BreadcrumbList JSON-LD are generated from visible vehicle and route data. Structured data does not guarantee rich results.

## Data contract

- Main table: `cars`.
- Public availability filter: `status = 'available'`.
- Stable detail route: `ref_number`.
- Public vehicle photos: related `car_images` rows, field `image_url`.
- The landing queries use an explicit public select list. Do not replace it with `select('*')` or include `chassis_number`, credentials, customer data or internal operational fields.
- Public queries use the anon/publishable key with Supabase RLS. Never add the Supabase service-role key, database password or Cloudinary API secret to `NEXT_PUBLIC_*` variables or client bundles.

## Local validation

From the project root:

```powershell
Copy-Item .env.example .env.local
npm install
npm run typecheck
npm run lint
npm run build
npm run dev
```

Then inspect:

- `/makes`
- `/makes/toyota` (only if Toyota exists in the current inventory)
- `/models/toyota-prius` (only if this make/model exists; use the exact generated slug)
- `/vehicle-types`
- Each category route with current stock
- `/import-japanese-cars`
- `/import-japanese-cars/pakistan` (must remain noindex while a draft)
- `/sitemap.xml` and `/robots.txt`

Check a few routes on an actual Android device as well as desktop. Verify the inventory and photo relationship against the production Supabase schema and RLS policies before launch.

## Known verification limitation

The build environment could not access the npm registry, so dependencies could not be installed and a full Next.js build/typecheck/lint or browser test could not be completed here. Static TypeScript/TSX syntax parsing, local import resolution and CSS parsing were performed separately. Re-run the package commands above in the local development environment or CI with working npm access before deploying.

## SEO editorial policy

Do not create country, make, model or category pages purely by substituting keywords. Google identifies doorway pages and scaled low-value content as spam risks. Each page needs its own genuine buyer utility, current inventory or verified country information, accurate internal links, and review ownership. Keep unsupported destination pages as drafts/noindex. See Google's Search Essentials and spam policies before expanding the taxonomy.
