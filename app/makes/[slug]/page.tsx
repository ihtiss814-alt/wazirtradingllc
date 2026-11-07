import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CarFront } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { LandingBreadcrumbs, LandingCta, LandingHero, LandingLinkCard, LandingSchema, LandingSectionHeading, SeoIndexNote } from "@/components/seo/landing-components";
import { getAvailableTaxonomy, getLandingInventory, collectionPageJsonLd, MIN_INDEXABLE_LANDING_VEHICLES, taxonomyIsIndexable } from "@/lib/seo-landings";
import { pageMetadata } from "@/lib/page-metadata";
import { allowIndexing, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 300;

async function getMakeData(slug: string) {
  const taxonomy = await getAvailableTaxonomy();
  if (taxonomy.error) throw new Error("The public inventory taxonomy could not be loaded.");
  const make = taxonomy.makes.find((item) => item.slug === slug);
  if (!make) return null;
  const [inventory] = await Promise.all([getLandingInventory({ make: make.name })]);
  const models = taxonomy.models
    .filter((model) => model.make.toLowerCase() === make.name.toLowerCase() && model.eligibleCount >= MIN_INDEXABLE_LANDING_VEHICLES)
    .slice(0, 18);
  return { make, inventory, models };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getMakeData(slug);
  if (!data) return { title: "Vehicle make not found", robots: { index: false, follow: true } };
  const description = `Browse available ${data.make.name} vehicles from Japan in Wazir Trading's public inventory. Compare listing details, photographs and recorded specifications before requesting an export quotation.`;
  return {
    ...pageMetadata({ title: `${data.make.name} Used Vehicles from Japan`, description, path: `/makes/${data.make.slug}` }),
    robots: allowIndexing && !data.inventory.error && taxonomyIsIndexable(data.inventory.eligibleCount) ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function MakePage({ params }: Props) {
  const { slug } = await params;
  const data = await getMakeData(slug);
  if (!data) notFound();
  const { make, inventory, models } = data;
  if (!inventory.error && inventory.matchedCount === 0) notFound();
  const description = `Browse available ${make.name} vehicles from Japan in Wazir Trading's public inventory. Compare listing details, photographs and recorded specifications before requesting an export quotation.`;
  const collectionSchema = collectionPageJsonLd({ name: `${make.name} vehicles`, description, url: `${siteConfig.url}/makes/${make.slug}`, vehicles: inventory.vehicles });

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="seo-landing-page">
        <LandingBreadcrumbs items={[{ label: "Makes", href: "/makes" }, { label: make.name, path: `/makes/${make.slug}` }]} />
        <LandingHero
          eyebrow="Japanese vehicle manufacturer"
          title={<>{make.name} vehicles <em>from Japan.</em></>}
          description={`Explore ${make.name} vehicle records currently available in the public Wazir Trading inventory. Review each vehicle's own year, variant, mileage, photographs and recorded condition details.`}
          actions={[{ label: `Browse all ${make.name} vehicles`, href: "/cars" }, { label: "Ask about a model", href: "/contact" }]}
          aside={<div className="seo-hero-stat-card"><span className="seo-make-hero-mark">{make.name.slice(0, 2).toUpperCase()}</span><span>AVAILABLE RECORDS</span><strong>{make.count.toLocaleString("en-US")}</strong><small>records currently associated with this make</small></div>}
        />
        <section className="seo-landing-section">
          <div className="site-container">
            <div className="seo-results-heading"><div><span className="eyebrow">Current inventory</span><h2>{make.name} vehicles to review</h2><p>Vehicle availability and export suitability must be confirmed for the specific unit and destination.</p></div><Link href="/cars" className="seo-inline-link">Main inventory <ArrowRight size={15} /></Link></div>
            {inventory.error ? <div className="seo-empty-panel"><CarFront size={32} /><h3>Vehicle records could not be loaded.</h3><p>Please try again shortly.</p></div> : inventory.vehicles.length ? <div className="vehicle-grid">{inventory.vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div> : <div className="seo-empty-panel"><CarFront size={32} /><h3>No vehicles currently meet this page's detail standard.</h3><p>Ask the team about current availability or a sourcing request.</p></div>}
            <SeoIndexNote />
          </div>
        </section>
        {models.length ? (
          <section className="seo-landing-section seo-landing-section-muted">
            <div className="site-container"><LandingSectionHeading eyebrow={`${make.name} model directory`} title={`Explore ${make.name} models.`} description="Choose a model to see vehicle records grouped by the make and model values held in the inventory." />
              <div className="seo-model-grid">{models.map((model) => <LandingLinkCard key={model.slug} href={`/models/${model.slug}`} title={`${make.name} ${model.model}`} description={`${model.count.toLocaleString("en-US")} available records in the current catalogue.`} meta="MODEL" />)}</div>
            </div>
          </section>
        ) : null}
        <LandingCta message={`Hello, I am interested in ${make.name} vehicles from Japan. Please share suitable available listings and confirm the export details for my destination.`} />
        <LandingSchema value={collectionSchema} />
      </main>
      <SiteFooter />
    </>
  );
}
