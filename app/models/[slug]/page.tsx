import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CarFront } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { LandingBreadcrumbs, LandingCta, LandingHero, LandingLinkCard, LandingSchema, LandingSectionHeading, SeoIndexNote } from "@/components/seo/landing-components";
import { VEHICLE_CATEGORY_BY_SLUG, slugify } from "@/lib/landing-pages";
import { collectionPageJsonLd, getAvailableTaxonomy, getLandingInventory, taxonomyIsIndexable, vehicleTypeSlugFor } from "@/lib/seo-landings";
import { pageMetadata } from "@/lib/page-metadata";
import { allowIndexing, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;

async function getModelData(slug: string) {
  const taxonomy = await getAvailableTaxonomy();
  if (taxonomy.error) throw new Error("The public inventory taxonomy could not be loaded.");
  const model = taxonomy.models.find((item) => item.slug === slug);
  if (!model) return null;
  const inventory = await getLandingInventory({ make: model.make, model: model.model });
  return { model, inventory };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getModelData(slug);
  if (!data) return { title: "Vehicle model not found", robots: { index: false, follow: true } };
  const { make, model } = data.model;
  const description = `Browse available ${make} ${model} vehicles from Japan. Review current vehicle photographs, model-year information, mileage, engine, fuel and other specifications from Wazir Trading's inventory.`;
  return {
    ...pageMetadata({ title: `${make} ${model} Vehicles from Japan`, description, path: `/models/${data.model.slug}` }),
    robots: allowIndexing && !data.inventory.error && taxonomyIsIndexable(data.inventory.eligibleCount) ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function ModelPage({ params }: Props) {
  const { slug } = await params;
  const data = await getModelData(slug);
  if (!data) notFound();
  const { model, inventory } = data;
  if (!inventory.error && inventory.matchedCount === 0) notFound();
  const makeSlug = slugify(model.make);
  const title = `${model.make} ${model.model}`;
  const description = `Browse available ${title} vehicles from Japan. Review current vehicle photographs, model-year information, mileage, engine, fuel and other specifications from Wazir Trading's inventory.`;
  const years = [...new Set(inventory.vehicles.map((vehicle) => vehicle.year).filter((year): year is number => year !== null))].sort((a, b) => b - a);
  const fuelTypes = [...new Set(inventory.vehicles.map((vehicle) => vehicle.fuel_type).filter((value): value is string => Boolean(value)))].sort();
  const bodyTypes = [...new Set(inventory.vehicles.map((vehicle) => vehicle.body_type).filter((value): value is string => Boolean(value)))].sort();
  type VehicleTypeSlug = NonNullable<ReturnType<typeof vehicleTypeSlugFor>>;
  const categorySlugs = Array.from(new Set(inventory.vehicles
    .map((vehicle) => vehicleTypeSlugFor(vehicle))
    .filter((value): value is VehicleTypeSlug => value !== null)));
  const category = categorySlugs.length === 1 ? VEHICLE_CATEGORY_BY_SLUG.get(categorySlugs[0]) : undefined;
  const collectionSchema = collectionPageJsonLd({ name: title, description, url: `${siteConfig.url}/models/${model.slug}`, vehicles: inventory.vehicles });

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="seo-landing-page">
        <LandingBreadcrumbs items={[{ label: "Makes", href: "/makes" }, { label: model.make, href: `/makes/${makeSlug}` }, { label: model.model, path: `/models/${model.slug}` }]} />
        <LandingHero
          eyebrow="Japanese vehicle model inventory"
          title={<>{title} <em>from Japan.</em></>}
          description={`Explore current ${title} listings in the Wazir Trading inventory. Each vehicle is a separate record: compare its own year, variant, mileage, powertrain, photographs and available condition information.`}
          actions={[{ label: "Browse all vehicles", href: "/cars" }, { label: `Explore ${model.make}`, href: `/makes/${makeSlug}` }]}
          aside={<div className="seo-hero-stat-card"><CarFront size={34} /><span>MODEL RECORDS</span><strong>{model.count.toLocaleString("en-US")}</strong><small>available records matched to this make and model</small></div>}
        />
        <section className="seo-landing-section">
          <div className="site-container">
            <div className="seo-results-heading"><div><span className="eyebrow">Current listings</span><h2>Available {title} vehicles</h2><p>Only the current vehicle record can confirm its specific configuration and asking price.</p></div><Link href="/cars" className="seo-inline-link">All vehicles <ArrowRight size={15} /></Link></div>
            {inventory.error ? <div className="seo-empty-panel"><CarFront size={32} /><h3>Model inventory could not be loaded.</h3><p>Please try again later or contact the team.</p></div> : inventory.vehicles.length ? <div className="vehicle-grid">{inventory.vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <div className="seo-empty-panel"><CarFront size={32} /><h3>No qualifying photographs and specifications are currently available for this model page.</h3><p>Contact us to confirm whether another unit can be discussed.</p></div>}
            <SeoIndexNote />
          </div>
        </section>
        <section className="seo-landing-section seo-landing-section-muted">
          <div className="site-container seo-two-column-content">
            <div><LandingSectionHeading eyebrow="Model listing overview" title="What appears in the current records." description="These are summaries of fields present on the currently displayed vehicles, not specifications guaranteed for every trim or year." />
              <div className="seo-fact-chips">
                {years.length ? <span><strong>Years</strong>{years.slice(0, 8).join(", ")}</span> : null}
                {fuelTypes.length ? <span><strong>Fuel types</strong>{fuelTypes.join(", ")}</span> : null}
                {bodyTypes.length ? <span><strong>Body types</strong>{bodyTypes.join(", ")}</span> : null}
              </div>
            </div>
            <aside className="seo-editorial-note"><span className="eyebrow">Buying guidance</span><h3>Model name alone is not a condition report.</h3><p>Review each unit&apos;s photographs, auction or inspection information (where supplied), mileage, equipment and sale terms. Confirm destination eligibility with the relevant local authority before purchase.</p><Link href="/how-it-works" className="seo-inline-link">How the purchase process works <ArrowRight size={15} /></Link></aside>
          </div>
          {category ? <div className="site-container seo-related-taxonomy"><LandingLinkCard href={`/vehicle-types/${category.slug}`} title={category.shortName} description={`Browse other available vehicles in the ${category.shortName.toLowerCase()} category.`} meta="VEHICLE CATEGORY" /></div> : null}
        </section>
        <LandingCta message={`Hello, I am interested in a ${title} from Japan. Please share currently available units, vehicle details and the export information needed for my destination.`} />
        <LandingSchema value={collectionSchema} />
      </main>
      <SiteFooter />
    </>
  );
}
