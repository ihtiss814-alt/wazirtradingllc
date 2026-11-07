import type { Metadata } from "next";
import Link from "next/link";
import { CarFront, ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LandingBreadcrumbs, LandingCta, LandingHero, LandingSectionHeading } from "@/components/seo/landing-components";
import { getAvailableTaxonomy, MIN_INDEXABLE_LANDING_VEHICLES, taxonomyIsIndexable } from "@/lib/seo-landings";
import { pageMetadata } from "@/lib/page-metadata";
import { allowIndexing } from "@/lib/site";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const taxonomy = await getAvailableTaxonomy();
  const eligible = taxonomy.makes.filter((make) => make.eligibleCount >= MIN_INDEXABLE_LANDING_VEHICLES).length;
  return {
    ...pageMetadata({
      title: "Japanese Car Makes | Browse Toyota, Honda, Nissan & More",
      description: "Explore Japanese vehicle makes represented in the current Wazir Trading inventory. Browse makes and continue to live vehicle listings and specifications.",
      path: "/makes",
    }),
    robots: allowIndexing && !taxonomy.error && !taxonomy.truncated && taxonomyIsIndexable(eligible) ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function MakesPage() {
  const taxonomy = await getAvailableTaxonomy();
  const makes = taxonomy.makes.filter((make) => make.count > 0);
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="seo-landing-page">
        <LandingBreadcrumbs items={[{ label: "Vehicle makes", path: "/makes" }]} />
        <LandingHero
          eyebrow="Explore vehicle manufacturers"
          title={<>Browse Japanese car makes <em>from live stock.</em></>}
          description="Choose a manufacturer to see the models and vehicles currently represented in the public inventory. Manufacturer logos and names are used for identification only; they do not imply an authorized-dealer relationship."
          actions={[{ label: "Browse all vehicles", href: "/cars" }, { label: "Discuss a sourcing request", href: "/contact" }]}
          aside={<div className="seo-hero-stat-card"><CarFront size={34} /><span>MAKES IN CURRENT STOCK</span><strong>{taxonomy.error ? "—" : makes.length.toString().padStart(2, "0")}</strong><small>based on public available inventory records</small></div>}
        />
        <section className="seo-landing-section">
          <div className="site-container">
            <LandingSectionHeading eyebrow="Manufacturer directory" title="Find vehicles by make." description="The directory is generated from available inventory. A manufacturer with only a small number of qualifying vehicle records will remain non-indexable until it meets the page-quality threshold." />
            {taxonomy.error ? (
              <div className="seo-empty-panel"><CarFront size={32} /><h3>Manufacturer data is temporarily unavailable.</h3><p>Please try again later or browse the main catalogue.</p><Link href="/cars" className="button button-primary">Browse vehicles <ArrowRight size={15} /></Link></div>
            ) : makes.length ? (
              <div className="seo-make-grid">
                {makes.map((make) => (
                  <Link key={make.slug} href={`/makes/${make.slug}`} className="seo-make-card">
                    <span className="seo-make-monogram">{make.name.slice(0, 2).toUpperCase()}</span>
                    <span className="seo-make-copy"><strong>{make.name}</strong><small>{make.count.toLocaleString("en-US")} available records</small></span>
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="seo-empty-panel"><CarFront size={32} /><h3>No makes are currently available.</h3><p>Contact Wazir Trading to discuss a vehicle requirement.</p></div>
            )}
            {taxonomy.truncated ? <p className="seo-index-note">The manufacturer list reached its safety limit while reading inventory records. Confirm the full catalogue in the database before using this directory for a complete stock report.</p> : null}
          </div>
        </section>
        <LandingCta message="Hello, I would like to enquire about Japanese vehicles by manufacturer. Please let me know which makes and models are currently available." />
      </main>
      <SiteFooter />
    </>
  );
}
