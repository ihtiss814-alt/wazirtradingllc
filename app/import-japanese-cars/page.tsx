import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LandingBreadcrumbs, LandingCta, LandingHero, LandingSectionHeading } from "@/components/seo/landing-components";
import { DESTINATION_GUIDES } from "@/lib/landing-pages";
import { pageMetadata } from "@/lib/page-metadata";
import { allowIndexing } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const approvedMarkets = DESTINATION_GUIDES.filter((item) => item.publicationStatus === "published" && item.serviceVerified && item.sources.length >= 2).length;
  const ready = allowIndexing && approvedMarkets >= 3;
  return {
    ...pageMetadata({
      title: "Import Japanese Vehicles by Destination | Wazir Trading",
      description: "Destination-focused information for buyers researching Japanese vehicle exports. Check local import requirements and confirm vehicle and route availability before purchase.",
      path: "/import-japanese-cars",
    }),
    robots: ready ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default function ImportJapaneseCarsPage() {
  const approved = DESTINATION_GUIDES.filter((item) => item.publicationStatus === "published" && item.serviceVerified && item.sources.length >= 2);
  const drafts = DESTINATION_GUIDES.filter((item) => item.publicationStatus === "draft");
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="seo-landing-page">
        <LandingBreadcrumbs items={[{ label: "Destination guides", path: "/import-japanese-cars" }]} />
        <LandingHero
          eyebrow="Destination-aware vehicle enquiries"
          title={<>Japanese vehicle export information <em>by destination.</em></>}
          description="Import rules, documents, taxes and shipping arrangements differ by country. Start with the official local requirements, then confirm the exact vehicle, export documents, route and quotation before making a purchase."
          actions={[{ label: "Browse available vehicles", href: "/cars" }, { label: "Discuss your destination", href: "/contact" }]}
          aside={<div className="seo-hero-stat-card"><Globe2 size={36} /><span>DESTINATION FIRST</span><strong>01</strong><small>verify local rules and service availability before committing</small></div>}
        />
        <section className="seo-landing-section">
          <div className="site-container">
            <LandingSectionHeading eyebrow="Country research" title="Destination guides are published only after review." description="A useful country page must do more than swap a country name. It needs current official references, local buyer guidance and confirmed business service information." />
            {approved.length ? (
              <div className="seo-country-grid">
                {approved.map((guide) => <Link href={`/import-japanese-cars/${guide.slug}`} key={guide.slug} className="seo-country-card"><span className="seo-country-region">{guide.region}</span><strong>{guide.country}</strong><span>{guide.description}</span><b>Read destination guide <ArrowRight size={15} /></b></Link>)}
              </div>
            ) : (
              <div className="seo-empty-panel seo-destination-review-panel"><ShieldCheck size={34} /><h3>Destination service coverage is confirmed individually.</h3><p>We are not presenting a public list of guaranteed shipping countries or ports. Tell us your destination and preferred vehicle so the team can check the current export arrangements and the requirements that apply.</p><Link href="/contact" className="button button-primary">Ask about your destination <ArrowRight size={15} /></Link></div>
            )}
            {drafts.length ? (
              <div className="seo-draft-guides">
                <span className="eyebrow">Editorial preparation</span>
                <p>Some country research pages are being reviewed against official sources and current business capability. They are not yet published as search landing pages.</p>
                {drafts.map((guide) => <Link key={guide.slug} href={`/import-japanese-cars/${guide.slug}`}>{guide.country} — research preview <ArrowRight size={14} /></Link>)}
              </div>
            ) : null}
          </div>
        </section>
        <section className="seo-landing-section seo-landing-section-muted">
          <div className="site-container seo-two-column-content">
            <div><LandingSectionHeading eyebrow="What needs checking" title="A destination quote is more than ocean freight." description="The cost and suitability of an import depend on the vehicle, importer, country rules, selected port and agreed sale terms." /></div>
            <div className="seo-checklist-panel"><ul><li>Vehicle eligibility and importer requirements</li><li>Customs classification, valuation, duties and taxes</li><li>Safety, emissions, inspection and certification rules</li><li>Export documents and destination clearance documents</li><li>Shipping method, port, freight, insurance and local charges</li></ul></div>
          </div>
        </section>
        <LandingCta message="Hello, I am considering importing a Japanese vehicle. My destination country and preferred port are not yet confirmed. Please tell me what information you need to check vehicle eligibility and export arrangements." />
      </main>
      <SiteFooter />
    </>
  );
}
