# Wazir Trading LLC — Phase 2 handoff

## What Phase 2 adds

- `/cars` server-rendered inventory catalogue backed by the existing Supabase `cars` and `car_images` tables.
- GET-based search and filters for make, body type, fuel, transmission, drive, year range and FOB price range.
- Sorting by newest, FOB price, year and mileage.
- 12-item server-side pagination with crawlable links.
- `/cars/[ref]` vehicle details resolved using the existing stable `ref_number`; sold/unavailable records remain viewable as historical pages but are `noindex` and direct buyers toward similar stock.
- Transient detail-query failures bubble to Next.js error handling instead of being misreported as a vehicle-not-found 404.
- Multi-photo gallery with thumbnails, keyboard-capable lightbox and separate auction inspection map when a `_map` image is present.
- Vehicle data panels for specifications, recorded condition grades, features, stock/port/shipment information and FOB price.
- Related available vehicles.
- Vehicle-specific WhatsApp enquiry form. Available listings ask for a quote; sold/unavailable listings invite buyers to ask about similar stock or sourcing. Form values are only placed in a WhatsApp draft; the website does not silently store or transmit them.
- Server-generated title, description, canonical URL, Open Graph/Twitter data, Product/Car JSON-LD and BreadcrumbList JSON-LD.
- An inventory sitemap containing only available records that pass a conservative quality gate: reference, make, model, year, at least one specification and at least one valid image.
- Search/filter/sort query URLs are `noindex,follow` and canonicalize to `/cars`; pagination-only URLs retain self-canonicals so distinct result pages remain discoverable.
- Inventory reads are cached briefly (60 seconds) and use the Supabase public anon/publishable key only.
- Cloudinary delivery transformations (`f_auto`, `q_auto`, width cap) for existing public Cloudinary image URLs. No Cloudinary API secret is required for image delivery.

## Database mapping taken from the supplied legacy source

| Table | Fields used |
|---|---|
| `cars` | `id`, `ref_number`, `make`, `model`, `variant`, `year`, `manufacture_month`, `engine_cc`, `engine_code`, `model_code`, `fuel_type`, `transmission`, `body_type`, `color`, `drive`, `steering`, `seats`, `doors`, `mileage_km`, `auction_grade`, `exterior_grade`, `interior_grade`, `fob_price_usd`, `stock_location`, `port_of_loading`, `shipment_method`, `status`, `collection`, `is_featured`, `is_new_arrival`, `features`, `lot_number`, `created_at`, `updated_at` |
| `car_images` | `image_url`, `is_primary`, `display_order` (related by `car_id`) |

The legacy code consistently filtered public inventory using `status = 'available'` and used `ref_number` for vehicle detail URLs. This implementation follows that contract for inventory and related stock. A known reference can still resolve to a sold/unavailable historical record so an old listing URL does not become a false 404; those records are noindex and do not show an active offer. The public detail query intentionally does not select `chassis_number` or use `select('*')`.

## Supabase setup

The `.env.example` file contains the Supabase project URL, the supplied **public anon key**, and Cloudinary cloud name. Copy it to `.env.local` for local development. The key used by the public website is the anon/publishable key and must remain subject to Row Level Security.

This build environment did not have DNS/network access to the Supabase host, so it could not inspect live data, test current table permissions, verify current row counts or prove that RLS allows public reads. The mapping above is based on real queries and types in the original supplied source project, not a live database introspection.

Run `supabase/PHASE2_ACCESS_AUDIT.sql` in Supabase SQL Editor and review its output before production. It is read-only. In particular:

- RLS should be enabled on `cars` and `car_images`.
- `anon` should have SELECT access only to public catalogue fields and approved available vehicle rows.
- `anon` must not have INSERT/UPDATE/DELETE access to `cars` or `car_images`.
- Avoid table-wide grants if internal columns must remain private; inspect the current table grants and existing policies before changing anything.
- `inquiries` is not written by this phase. The enquiry forms open WhatsApp drafts so no unverified INSERT policy is assumed.

Do not put `SUPABASE_SERVICE_ROLE_KEY`, Cloudinary API secret, or database password in any `NEXT_PUBLIC_*` variable, browser bundle, example file, or Git commit. These are not needed for public catalogue reads or image delivery.

## Cloudinary behavior

Vehicle photos are read from `car_images.image_url`. Existing Cloudinary URLs receive responsive width/format/quality delivery transformations. Non-Cloudinary URLs are left unchanged. The Cloudinary Admin API is not called by the public site; Phase 2 does not need the API key or API secret.

## SEO behavior

- `/cars` is indexable only when `NEXT_PUBLIC_ALLOW_INDEXING=true`.
- Filter and search query URLs canonicalize to `/cars` and become `noindex,follow`.
- Vehicle detail pages are indexable only when the global indexing flag is true and the record has an available status, valid reference, make, model, year, meaningful specification and at least one valid HTTPS image. Sold/unavailable records can remain useful to visitors but are noindex.
- Sitemap vehicle URLs follow the same completeness rules.
- No made-up ratings, reviews, shipping cost, destination eligibility or availability claims are added.
- FOB prices are labelled clearly; freight, insurance, destination charges, duties and taxes are not implied to be included.

## Local setup

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000/cars` and test:

1. Inventory loads from Supabase and the number of available rows is plausible.
2. Search by make/model/reference, all filters, sorting, pagination and clearing filters.
3. Open an individual vehicle from a card; check images, specifications, grades, related stock and WhatsApp form.
4. Try a reference that does not exist; it should return the custom 404 page.
5. View page source for vehicle H1, facts, canonical, Open Graph and JSON-LD without waiting for client-side JavaScript.
6. Try query URLs such as `/cars?make=Toyota` and confirm they are noindex with canonical `/cars`.
7. Check `/robots.txt` and `/sitemap.xml` while indexing is disabled and after production approval.
8. Test widths 360, 375, 390, 412, 768, 1280 and 1440px, plus a real Android/Oppo device.

## Verification limitation

TypeScript/TSX syntax transpilation passed for all source files. A real `npm install`, `npm run typecheck`, `npm run lint` and `npm run build` could not be completed in this environment because the npm registry could not be reached and the required package cache was not present. Supabase live queries were also blocked by DNS/network unavailability. Run the commands locally after extraction and resolve any environment/RLS issue before deploying.

## Security actions required

The user pasted privileged Supabase and Cloudinary credentials in chat. Rotate the Supabase service-role key and database password, and rotate the Cloudinary API secret (and API key if available) before production. The website does not use these privileged values. Use only the public anon key in `.env.local` for the public read-only inventory path.
