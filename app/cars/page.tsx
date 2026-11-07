import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CarFront, Search, SlidersHorizontal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { getInventoryFacets, getInventoryPage, parseInventoryFilters } from "@/lib/inventory";
import { allowIndexing, siteConfig } from "@/lib/site";
import { INVENTORY_PAGE_SIZE } from "@/lib/types/inventory";

export const revalidate = 60;

type SearchParams = Record<string, string | string[] | undefined>;
type PageProps = { searchParams: Promise<SearchParams> };

function queryString(filters: ReturnType<typeof parseInventoryFilters>, page: number) {
  const params = new URLSearchParams();
  for (const key of ["q", "make", "body", "fuel", "transmission", "drive", "yearFrom", "yearTo", "priceMin", "priceMax", "sort"] as const) {
    const value = filters[key];
    if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/cars?${query}` : "/cars";
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const hasNonPaginationParams = Object.entries(params).some(([key, value]) =>
    key !== "page" && (Array.isArray(value) ? value.some(Boolean) : Boolean(value)),
  );
  const requestedPage = typeof params.page === "string" ? Number.parseInt(params.page, 10) : 1;
  const pageSuffix = !hasNonPaginationParams && Number.isSafeInteger(requestedPage) && requestedPage > 1
    ? `?page=${requestedPage}`
    : "";
  return {
    title: "Japanese Used Cars for Export | Browse Vehicle Inventory",
    description: "Browse Japanese used vehicles available for export. Search by make, model, body type, fuel, year and FOB asking price, then enquire about destination-specific export arrangements.",
    alternates: { canonical: `${siteConfig.url}/cars${pageSuffix}` },
    robots: allowIndexing
      ? hasNonPaginationParams ? { index: false, follow: true } : { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: "Japanese Used Cars for Export | Wazir Trading LLC",
      description: "Browse available vehicle records from Japan and enquire about export arrangements.",
      url: `${siteConfig.url}/cars${pageSuffix}`,
      type: "website",
    },
  };
}

export default async function CarsPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const filters = parseInventoryFilters(rawParams);
  const [{ cars, totalCount, error }, facets] = await Promise.all([
    getInventoryPage(filters),
    getInventoryFacets(),
  ]);
  const pages = Math.max(1, Math.ceil(totalCount / INVENTORY_PAGE_SIZE));
  if (!error && filters.page > pages) redirect(queryString(filters, pages));
  const hasActiveFilters = Boolean(filters.q || filters.make || filters.body || filters.fuel || filters.transmission || filters.drive || filters.yearFrom || filters.yearTo || filters.priceMin || filters.priceMax);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="inventory-page">
        <section className="inventory-hero">
          <div className="site-container">
            <nav className="inventory-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>Vehicle inventory</span></nav>
            <div className="inventory-hero-grid">
              <div>
                <span className="eyebrow eyebrow-light">Wazir Trading · Japan</span>
                <h1>Japanese used cars <em>for export.</em></h1>
                <p>Explore the vehicles currently listed in our inventory. Review the available specifications and photographs, then request a quotation for your destination.</p>
              </div>
              <div className="inventory-hero-mark"><CarFront size={68} strokeWidth={1.1} /><span>LIVE VEHICLE CATALOGUE</span></div>
            </div>
            <div className="inventory-hero-foot"><span>FOB asking prices shown in USD where provided</span><span>Availability is confirmed individually</span></div>
          </div>
        </section>

        <section className="inventory-content site-container">
          <div className="inventory-heading-row">
            <div>
              <span className="eyebrow">Browse inventory</span>
              <h2>Vehicles from Japan</h2>
              <p>{error ? "The inventory service is temporarily unavailable." : `${totalCount.toLocaleString("en-US")} ${totalCount === 1 ? "vehicle" : "vehicles"} currently match this view.`}</p>
            </div>
            <div className="seo-inventory-hub-links"><Link href="/makes">Browse by make <ArrowRight size={14} /></Link><Link href="/vehicle-types">Browse by vehicle type <ArrowRight size={14} /></Link></div>
          </div>

          <div className="inventory-layout">
            <aside className="inventory-filter-panel">
              <div className="inventory-filter-title"><SlidersHorizontal size={17} /><strong>Refine your search</strong></div>
              <form action="/cars" method="get" className="inventory-filter-form">
                <label className="inventory-field inventory-search-field">
                  <span>Search vehicles</span>
                  <div><Search size={16} /><input name="q" type="search" defaultValue={filters.q} placeholder="Make, model or reference" maxLength={80} /></div>
                </label>
                <label className="inventory-field"><span>Make</span><select name="make" defaultValue={filters.make}><option value="">All makes</option>{facets.makes.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.count})</option>)}</select></label>
                <label className="inventory-field"><span>Body type</span><select name="body" defaultValue={filters.body}><option value="">All body types</option>{facets.bodies.map((item) => <option key={item.value} value={item.value}>{item.value} ({item.count})</option>)}</select></label>
                <label className="inventory-field"><span>Fuel type</span><select name="fuel" defaultValue={filters.fuel}><option value="">All fuel types</option>{facets.fuels.map((item) => <option key={item.value} value={item.value}>{item.value}</option>)}</select></label>
                <label className="inventory-field"><span>Transmission</span><select name="transmission" defaultValue={filters.transmission}><option value="">Any transmission</option>{facets.transmissions.map((item) => <option key={item.value} value={item.value}>{item.value}</option>)}</select></label>
                <label className="inventory-field"><span>Drive</span><select name="drive" defaultValue={filters.drive}><option value="">Any drive</option><option value="2WD">2WD</option><option value="4WD">4WD</option><option value="AWD">AWD</option><option value="FWD">FWD</option></select></label>
                <div className="inventory-filter-group"><span>Model year</span><div className="inventory-two-fields"><input aria-label="Year from" type="number" min="1950" max="2100" name="yearFrom" defaultValue={filters.yearFrom} placeholder="From" /><input aria-label="Year to" type="number" min="1950" max="2100" name="yearTo" defaultValue={filters.yearTo} placeholder="To" /></div></div>
                <div className="inventory-filter-group"><span>FOB price (USD)</span><div className="inventory-two-fields"><input aria-label="Minimum FOB price" type="number" min="0" name="priceMin" defaultValue={filters.priceMin} placeholder="Min $" /><input aria-label="Maximum FOB price" type="number" min="0" name="priceMax" defaultValue={filters.priceMax} placeholder="Max $" /></div></div>
                <input type="hidden" name="sort" value={filters.sort} />
                <button type="submit" className="button button-primary inventory-apply">Apply filters <ArrowRight size={16} /></button>
              </form>
            </aside>

            <div className="inventory-results">
              <div className="inventory-results-toolbar">
                <span>{error ? "Inventory status" : `Showing ${cars.length ? ((filters.page - 1) * INVENTORY_PAGE_SIZE + 1).toLocaleString("en-US") : 0}–${Math.min(filters.page * INVENTORY_PAGE_SIZE, totalCount).toLocaleString("en-US")} of ${totalCount.toLocaleString("en-US")}`}</span>
                <form action="/cars" method="get" className="inventory-sort-form">
                  {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}
                  {filters.make ? <input type="hidden" name="make" value={filters.make} /> : null}
                  {filters.body ? <input type="hidden" name="body" value={filters.body} /> : null}
                  {filters.fuel ? <input type="hidden" name="fuel" value={filters.fuel} /> : null}
                  {filters.transmission ? <input type="hidden" name="transmission" value={filters.transmission} /> : null}
                  {filters.drive ? <input type="hidden" name="drive" value={filters.drive} /> : null}
                  {filters.yearFrom ? <input type="hidden" name="yearFrom" value={filters.yearFrom} /> : null}
                  {filters.yearTo ? <input type="hidden" name="yearTo" value={filters.yearTo} /> : null}
                  {filters.priceMin ? <input type="hidden" name="priceMin" value={filters.priceMin} /> : null}
                  {filters.priceMax ? <input type="hidden" name="priceMax" value={filters.priceMax} /> : null}
                  <label htmlFor="inventory-sort">Sort by</label>
                  <select id="inventory-sort" name="sort" defaultValue={filters.sort}>
                    <option value="newest">Newest first</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="year_desc">Year: newest first</option><option value="mileage_asc">Mileage: low to high</option>
                  </select>
                  <button type="submit" className="inventory-sort-submit">Sort</button>
                </form>
              </div>

              {error ? (
                <div className="inventory-state-panel"><CarFront size={36} /><h3>We cannot load the vehicle catalogue right now.</h3><p>Please try again shortly or contact our team for current vehicle availability. The site has not assumed that the inventory is empty.</p><Link href="/#request-quote" className="button button-primary">Ask about a vehicle <ArrowRight size={16} /></Link></div>
              ) : cars.length ? (
                <div className="vehicle-grid">{cars.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div>
              ) : (
                <div className="inventory-state-panel"><Search size={34} /><h3>{hasActiveFilters ? "No vehicles match these filters." : "There are no vehicles to display right now."}</h3><p>{hasActiveFilters ? "Try widening your search or clearing one or more filters." : "Please contact Wazir Trading to discuss your vehicle requirements."}</p><Link href="/cars" className="button button-secondary">Clear filters</Link></div>
              )}

              {!error && pages > 1 ? (
                <nav className="inventory-pagination" aria-label="Inventory pagination">
                  {filters.page > 1 ? <Link href={queryString(filters, filters.page - 1)} rel="prev">Previous</Link> : <span className="is-disabled">Previous</span>}
                  <span>Page {filters.page} of {pages}</span>
                  {filters.page < pages ? <Link href={queryString(filters, filters.page + 1)} rel="next">Next</Link> : <span className="is-disabled">Next</span>}
                </nav>
              ) : null}
              <p className="inventory-fob-note">Prices marked FOB are vehicle asking prices at the named export terms. Freight, insurance, destination handling, taxes, duties and registration are additional unless a written quotation states otherwise.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
