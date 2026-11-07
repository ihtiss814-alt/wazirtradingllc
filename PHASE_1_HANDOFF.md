# Phase 1 handoff — what is ready and what stays out of scope

## Architecture decisions

- Next.js App Router is the only application router.
- Public pages are Server Components unless a real interaction requires client state.
- The current interactive components are limited to the responsive navigation and WhatsApp request form.
- Canonical metadata uses `NEXT_PUBLIC_SITE_URL`; the current default follows the previous site's `www` canonical.
- Robots and page metadata are non-indexable until `NEXT_PUBLIC_ALLOW_INDEXING=true` is explicitly configured.
- Organization JSON-LD is deliberately conservative: no star rating, founding date, aggregate reviews, unsupported office list, or export-volume statistics.
- `sitemap.xml` currently lists only `/`. Future inventory and editorial routes must be added only when implemented and genuinely useful.
- Supabase client factories use the public publishable/anon key. Never expose Supabase service-role keys in the browser or any `NEXT_PUBLIC_*` variable.
- Cloudinary helper generates public delivery URLs only. Signing, upload, and Admin API operations are not part of the public site foundation.

## Home page content hierarchy

1. Japan-based sourcing/export hero and two actions.
2. Service approach/trust strip without fabricated metrics.
3. Vehicle category enquiry shortcuts.
4. Selected manufacturer marks with non-affiliation disclaimer.
5. Three-step buying/export process.
6. CEO/company section using supplied portrait.
7. Japan office contact panel.
8. WhatsApp enquiry form.
9. Direct contact close and footer.

## Acceptance checklist for Phase 1

- [ ] `npm install` succeeds and lockfile is committed.
- [ ] `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- [ ] Desktop at 1440px and 1280px has no horizontal overflow.
- [ ] Android widths 360px, 375px, 390px and 412px have no clipped navigation, text or form fields.
- [ ] Test on a real Oppo/Android device, not only browser emulation.
- [ ] Keyboard can access every navigation item and form control; focus state is visible.
- [ ] Reduced-motion preference is respected.
- [ ] View-source/HTML response contains the H1, key homepage copy and JSON-LD without waiting for client JavaScript.
- [ ] `/robots.txt` is disallow-all on preview and allows crawling only when the explicit index flag is set.
- [ ] `/sitemap.xml` lists only the real homepage in Phase 1.
- [ ] WhatsApp form opens a prefilled message; it sends/stores nothing automatically.
- [ ] Contact details, canonical domain and hero image receive business-owner approval before production.
- [ ] Existing production website and database remain unchanged until the migration plan is approved.

## Known Phase 1 limitations

- Hero visual is a temporary Unsplash Honda Integra photograph by mintosko (from a Japan-tagged image page). Replace with an owned/licensed Wazir vehicle image before launch.
- No live Supabase reads are made from the homepage yet; inventory table field mapping belongs to Phase 2.
- No Supabase inquiry insert is made; the form is WhatsApp-based to avoid assuming an unknown RLS schema.
- The only routable page in this phase is `/`. The remaining menu and footer actions are in-page anchors, not broken links to unbuilt routes.
