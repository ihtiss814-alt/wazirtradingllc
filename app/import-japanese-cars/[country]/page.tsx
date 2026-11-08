import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, FileText, ShieldAlert } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LandingBreadcrumbs, LandingCta, LandingHero, LandingSectionHeading } from "@/components/seo/landing-components";
import { DESTINATION_GUIDE_BY_SLUG } from "@/lib/landing-pages";
import { pageMetadata } from "@/lib/page-metadata";
import { allowIndexing } from "@/lib/site";

type Props = { params: Promise<{ country: string }> };
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const guide = DESTINATION_GUIDE_BY_SLUG.get(country);
  if (!guide) return { title: "Destination guide not found", robots: { index: false, follow: true } };
  const approved = allowIndexing && guide.publicationStatus === "published" && guide.serviceVerified && guide.sources.length >= 2;
  return {
    ...pageMetadata({
      title: `Import Japanese Vehicles to ${guide.country} | Buyer Checks`,
      description: guide.description,
      path: `/import-japanese-cars/${guide.slug}`,
    }),
    robots: approved ? { index: true, follow: true } : { index: false, follow: true },
  };
}

export default async function DestinationGuidePage({ params }: Props) {
  const { country } = await params;
  const guide = DESTINATION_GUIDE_BY_SLUG.get(country);
  if (!guide) notFound();
  const preview = guide.publicationStatus !== "published" || !guide.serviceVerified;

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="seo-landing-page">
        <LandingBreadcrumbs items={[{ label: "Destination guides", href: "/import-japanese-cars" }, { label: guide.country, path: `/import-japanese-cars/${guide.slug}` }]} />
        <LandingHero
          eyebrow={`${guide.region} · destination research`}
          title={<>Import Japanese vehicles to <em>{guide.country}.</em></>}
          description={guide.intro}
          actions={[{ label: "Browse vehicles from Japan", href: "/cars" }, { label: "Ask about this destination", href: "/contact" }]}
          aside={<div className="seo-hero-stat-card"><FileText size={34} /><span>OFFICIAL REFERENCE REVIEW</span><strong>{guide.lastReviewed}</strong><small>date sources were last checked for this draft</small></div>}
        />
        <section className="seo-landing-section">
          <div className="site-container">
            {preview ? (
              <div className="seo-destination-draft-notice"><ShieldAlert size={22} /><div><strong>Research preview — not an export-service confirmation</strong><p>This country page is not approved for search indexing. Wazir Trading&apos;s current service coverage, shipping route and ability to handle a specific order for {guide.country} have not been independently confirmed in this project. Ask the team for written confirmation before treating any export arrangement as available.</p></div></div>
            ) : null}
            {guide.sections.map((section, index) => (
              <section className="seo-editorial-section" key={section.title}>
                <div className="seo-editorial-index">{String(index + 1).padStart(2, "0")}</div>
                <div><LandingSectionHeading eyebrow={`Buyer research · ${guide.country}`} title={section.title} />
                  {section.body.map((paragraph) => <p className="seo-editorial-paragraph" key={paragraph}>{paragraph}</p>)}
                  {section.bullets ? <ul className="seo-country-checklist">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
                </div>
              </section>
            ))}
          </div>
        </section>
        <section className="seo-landing-section seo-landing-section-muted">
          <div className="site-container">
            <LandingSectionHeading eyebrow="Government and official references" title={`Sources for ${guide.country} import checks.`} description={`These source links were checked on ${guide.lastReviewed}. Government notices can change; consult the current text and a qualified local customs professional before making a purchase.`} />
            <div className="seo-source-grid">
              {guide.sources.map((source) => <a key={source.url} className="seo-source-card" href={source.url} target="_blank" rel="noopener noreferrer"><span>{source.publisher}</span><strong>{source.label}</strong><small>{source.note}</small><b>Open official source <ArrowUpRight size={14} /></b></a>)}
            </div>
            <p className="seo-legal-disclaimer">This page is general buyer research, not legal, tax, customs or financial advice. The buyer must verify the current rules and the correct import route with the relevant government authority or a licensed customs professional. A vehicle&apos;s export from Japan does not guarantee its import eligibility or registration.</p>
          </div>
        </section>
        <LandingCta
          title={`Discuss a Japanese vehicle for ${guide.country}.`}
          description="Share the vehicle or model, buyer/importer situation and intended destination. Wazir Trading must separately confirm whether it can handle the specific export and shipping arrangement."
          message={`Hello, I am researching the import of a Japanese vehicle to ${guide.country}. Please confirm whether Wazir Trading can currently handle an export enquiry for this destination and what details you need to assess the vehicle and route.`}
        />
        <div className="site-container seo-back-link-wrap"><Link href="/import-japanese-cars" className="seo-inline-link">All destination information <ArrowUpRight size={15} /></Link></div>
      </main>
      <SiteFooter />
    </>
  );
}
