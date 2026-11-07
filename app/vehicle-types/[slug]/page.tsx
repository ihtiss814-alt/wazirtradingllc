import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CarFront } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { LandingBreadcrumbs, LandingCta, LandingHero, LandingFeatureList, LandingSectionHeading, LandingSchema, SeoIndexNote } from "@/components/seo/landing-components";
import { VEHICLE_CATEGORY_BY_SLUG } from "@/lib/landing-pages";
import { collectionPageJsonLd, getLandingInventory, taxonomyIsIndexable } from "@/lib/seo-landings";
import { pageMetadata } from "@/lib/page-metadata";
import { allowIndexing, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export const revalidate = 180;

async function getPageData(slug: string) {
  const category = VEHICLE_CATEGORY_BY_SLUG.get(slug);
  if (!category) return null;
  const inventory = await getLandingInventory({ bodyTypes: category.bodyTypes, fuelContains: category.fuelContains });
  return { category, inventory };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPageData(slug);
  if (!data) return { title: "Vehicle category not found", robots: { index: false, follow: true } };
  const { category, inventory } = data;
  const indexable = allowIndexing && !inventory.error && taxonomyIsIndexable(inventory.eligibleCount);
  return {
    ...pageMetadata({ title: category.name, description: category.description, path: `/vehicle-types/${category.slug}` }),
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function VehicleTypePage({ params }: Props) {
  const { slug } = await params;
  const data = await getPageData(slug);
  if (!data) notFound();
  const { category, inventory } = data;
  const collectionSchema = collectionPageJsonLd({
    name: category.name,
    description: category.description,
    url: `${siteConfig.url}/vehicle-types/${category.slug}`,
    vehicles: inventory.vehicles,
  });

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="seo-landing-page">
        <LandingBreadcrumbs items={[{ label: "Vehicle types", href: "/vehicle-types" }, { label: category.shortName, path: `/vehicle-types/${category.slug}` }]} />
        <LandingHero
          eyebrow="Japanese vehicle inventory"
          title={<>{category.shortName} <em>from Japan.</em></>}
          description={category.intro}
          actions={[{ label: "View all vehicles", href: "/cars" }, { label: "Ask about this category", href: "/contact" }]}
          aside={<div className="seo-hero-stat-card"><CarFront size={34} /><span>CURRENT MATCHES</span><strong>{inventory.matchedCount.toLocaleString("en-US")}</strong><small>available inventory records; individual availability must be reconfirmed</small></div>}
        />
        <section className="seo-landing-section">
          <div className="site-container">
            <div className="seo-results-heading"><div><span className="eyebrow">Current listings</span><h2>{category.shortName} available to review</h2><p>Vehicle records are displayed with the specifications and photographs currently available.</p></div><Link href="/cars" className="seo-inline-link">All inventory <ArrowRight size={15} /></Link></div>
            {inventory.error ? (
              <div className="seo-empty-panel"><CarFront size={32} /><h3>We could not load this category.</h3><p>The inventory service may be temporarily unavailable. Please retry or contact the team.</p></div>
            ) : inventory.vehicles.length ? (
              <div className="vehicle-grid">{inventory.vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div>
            ) : (
              <div className="seo-empty-panel"><CarFront size={32} /><h3>No listing currently meets the detail standard for this page.</h3><p>Contact the team to ask about current availability or a sourcing requirement.</p></div>
            )}
            <SeoIndexNote />
          </div>
        </section>
        <section className="seo-landing-section seo-landing-section-muted">
          <div className="site-container seo-two-column-content">
            <div><LandingSectionHeading eyebrow="Buyer checklist" title={`What to compare when choosing ${category.shortName.toLowerCase()}.`} description="Use these checks alongside the exact vehicle record and a destination-specific import review." /><LandingFeatureList items={category.buyerChecks} /></div>
            <aside className="seo-editorial-note"><span className="eyebrow">Before you commit</span><h3>One category can contain very different vehicles.</h3><p>Make decisions from the individual vehicle's recorded variant, year, specifications, images, condition information and written quotation. A category label is only a starting point.</p><Link href="/how-it-works" className="seo-inline-link">Understand the buying process <ArrowRight size={15} /></Link></aside>
          </div>
        </section>
        <LandingCta message={`Hello, I am interested in ${category.shortName} from Japan. Please share the available options and the information needed to confirm export arrangements for my destination.`} />
        <LandingSchema value={collectionSchema} />
      </main>
      <SiteFooter />
    </>
  );
}
