import type { Metadata } from "next";
import { CarFront } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { LandingBreadcrumbs, LandingCta, LandingHero, LandingLinkCard, LandingSectionHeading } from "@/components/seo/landing-components";
import { VEHICLE_CATEGORIES } from "@/lib/landing-pages";
import { getLandingInventory, MIN_INDEXABLE_LANDING_VEHICLES, taxonomyIsIndexable } from "@/lib/seo-landings";
import { pageMetadata } from "@/lib/page-metadata";
import { allowIndexing } from "@/lib/site";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const results = await Promise.all(VEHICLE_CATEGORIES.map((category) => getLandingInventory({ bodyTypes: category.bodyTypes, fuelContains: category.fuelContains })));
  const indexableGroups = results.filter((result) => !result.error && result.eligibleCount >= MIN_INDEXABLE_LANDING_VEHICLES).length;
  return {
    ...pageMetadata({
      title: "Japanese Used Vehicle Types | SUVs, Sedans, Vans & More",
      description: "Browse Japanese used vehicles by body style and fuel type. Explore available SUVs, sedans, hatchbacks, vans, pickups, commercial vehicles and electrified options.",
      path: "/vehicle-types",
    }),
    robots: allowIndexing && taxonomyIsIndexable(indexableGroups) ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function VehicleTypesPage() {
  const results = await Promise.all(VEHICLE_CATEGORIES.map(async (category) => ({
    category,
    inventory: await getLandingInventory({ bodyTypes: category.bodyTypes, fuelContains: category.fuelContains }),
  })));
  const populated = results.filter(({ inventory }) => !inventory.error && inventory.matchedCount > 0);
  const featured = results.filter(({ inventory }) => !inventory.error && inventory.vehicles.length > 0).slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="seo-landing-page">
        <LandingBreadcrumbs items={[{ label: "Vehicle types", path: "/vehicle-types" }]} />
        <LandingHero
          eyebrow="Browse by body style and powertrain"
          title={<>Explore Japanese vehicles <em>by type.</em></>}
          description="Start with the vehicle shape or powertrain that suits your needs. Each category connects to current inventory records, specifications and photographs—not a static catalogue of unavailable models."
          actions={[{ label: "Browse all vehicles", href: "/cars" }, { label: "Ask about a vehicle", href: "/contact" }]}
          aside={<div className="seo-hero-stat-card"><CarFront size={36} /><span>LIVE INVENTORY LINKS</span><strong>{populated.length.toString().padStart(2, "0")}</strong><small>categories with listed stock when data is available</small></div>}
        />
        <section className="seo-landing-section">
          <div className="site-container">
            <LandingSectionHeading eyebrow="Choose a vehicle type" title="Browse categories connected to inventory." description="Categories appear here when matching vehicle records exist. A category with limited qualifying records may be available to browse but will not be indexable until it has enough useful inventory." />
            {populated.length ? (
              <div className="seo-category-grid">
                {populated.map(({ category, inventory }) => (
                  <LandingLinkCard
                    key={category.slug}
                    href={`/vehicle-types/${category.slug}`}
                    title={category.shortName}
                    description={category.description}
                    meta={`${inventory.matchedCount.toLocaleString("en-US")} matching records`}
                  />
                ))}
              </div>
            ) : (
              <div className="seo-empty-panel"><CarFront size={34} /><h3>Category inventory is not available right now.</h3><p>{results.some(({ inventory }) => inventory.error) ? "The inventory service could not be reached. Please try again later." : "There are currently no matching available records. Contact the team to discuss a requirement."}</p></div>
            )}
          </div>
        </section>
        {featured.length ? (
          <section className="seo-landing-section seo-landing-section-muted">
            <div className="site-container">
              <LandingSectionHeading eyebrow="Recently listed" title="A few vehicles to explore." description="These vehicles are selected from currently available inventory and link to their individual records." />
              <div className="vehicle-grid">{featured.flatMap(({ inventory }) => inventory.vehicles.slice(0, 1)).slice(0, 4).map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div>
            </div>
          </section>
        ) : null}
        <LandingCta message="Hello, I would like help choosing a Japanese vehicle category. Please let me know what is currently available and what details you need from me." />
      </main>
      <SiteFooter />
    </>
  );
}
