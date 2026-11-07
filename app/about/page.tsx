import Image from "next/image";
import type { Metadata } from "next";
import { Building2, ClipboardCheck, FileSearch, Globe2, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs, FeatureCard, SectionHeading, TrustCta, TrustPageHero } from "@/components/trust-pages";
import { pageMetadata } from "@/lib/page-metadata";
import { safeJsonLd, breadcrumbJsonLd, organizationJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About Wazir Trading",
  description: "Learn about Wazir Trading LLC, its Japan-based vehicle sourcing and export operation, leadership, and approach to clear vehicle information and buyer communication.",
  path: "/about",
});

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "About Wazir Trading", path: "/about" },
]);

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbs) }} />
      <SiteHeader />
      <main id="main-content">
        <TrustPageHero
          eyebrow="About Wazir Trading LLC · Japan"
          title={<>Japanese vehicle sourcing, <em>with a clear process.</em></>}
          description="Wazir Trading LLC helps international buyers explore Japanese used vehicle listings, review the information available for each vehicle, and discuss export arrangements from its Japan-based operation."
          actions={[
            { href: "/cars", label: "Explore available vehicles" },
            { href: "/contact", label: "Talk to our team", variant: "secondary" },
          ]}
          aside={
            <div className="trust-hero-stat-card">
              <span className="trust-card-overline">Japan operation</span>
              <Building2 size={30} />
              <strong>Kuwana, Mie</strong>
              <span>Japan headquarters address</span>
            </div>
          }
        />
        <Breadcrumbs items={[{ label: "About Wazir Trading" }]} />

        <section className="trust-section">
          <div className="site-container trust-two-column about-story-grid">
            <div className="trust-operation-card">
              <div className="trust-operation-brand">
                <Image src="/brand-lockup.webp" alt="Wazir Trading LLC" width={180} height={136} />
              </div>
              <span className="trust-operation-kicker">Japan-based operation</span>
              <h3>Vehicle sourcing & export enquiries.</h3>
              <div className="trust-operation-detail"><MapPin size={18} /><span><strong>Kuwana, Mie Prefecture</strong><small>Japan headquarters</small></span></div>
              <div className="trust-operation-detail"><Globe2 size={18} /><span><strong>International buyers</strong><small>Destination-specific export enquiries</small></span></div>
              <div className="trust-operation-rule" />
              <p>Start with the listing details. Confirm the sale, shipping and destination requirements for your specific vehicle.</p>
            </div>
            <div className="trust-prose">
              <span className="eyebrow">What we do</span>
              <h2>Connect buyers with vehicle information from Japan.</h2>
              <p>Buying a used vehicle from another country involves more than choosing a make and model. Buyers need to understand the listing, available photographs and specifications, the sale terms, and the export steps that apply to their destination.</p>
              <p>Our website brings available vehicle records together in one place. Each listing can be reviewed by its reference, specifications, photographs, recorded condition fields and published price information. Buyers can then contact the team to clarify availability and discuss the next steps.</p>
              <p>Shipping options, documentation, costs and import requirements are confirmed for the individual vehicle and destination. We avoid treating a general estimate as a confirmed quotation.</p>
              <div className="trust-inline-facts">
                <div><MapPin size={17} /><span><strong>Japan-based operation</strong><small>Kuwana, Mie Prefecture</small></span></div>
                <div><MessageCircle size={17} /><span><strong>Direct buyer enquiries</strong><small>Vehicle and export questions</small></span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-section trust-section-muted">
          <div className="site-container">
            <SectionHeading
              eyebrow="Leadership"
              title="A direct line to the people behind the business."
              description="The company’s leadership information is presented alongside a clear way to contact the Japan operation with questions about a vehicle or export enquiry."
              align="center"
            />
            <article className="leader-card">
              <div className="leader-card-photo">
                <Image src="/images/mumtaz-khan-ceo.webp" alt="Mr. Mumtaz Khan" fill sizes="(max-width: 760px) 100vw, 38vw" className="trust-cover-image" />
              </div>
              <div className="leader-card-copy">
                <span className="trust-eyebrow trust-eyebrow-light"><span /> Company leadership</span>
                <h3>Mr. Mumtaz Khan</h3>
                <p className="leader-role">Chief Executive Officer</p>
                <p>Mr. Mumtaz Khan leads Wazir Trading LLC. The company’s work connects Japanese used vehicle listings with buyer enquiries, export information and destination-specific discussions.</p>
                <a className="leader-contact-link" href={`mailto:${siteConfig.email}`}>Contact the company <span>→</span></a>
              </div>
            </article>
          </div>
        </section>

        <section className="trust-section">
          <div className="site-container">
            <SectionHeading eyebrow="How we work" title="Useful information before a buying decision." description="Our approach is built around practical information and direct confirmation—not unverified guarantees." align="center" />
            <div className="trust-feature-grid trust-feature-grid-4">
              <FeatureCard icon={<FileSearch size={21} />} title="Listing-led review">Start with the vehicle’s own reference, photographs, specifications and recorded condition information.</FeatureCard>
              <FeatureCard icon={<ClipboardCheck size={21} />} title="Clarify the details">Ask questions about missing records, availability, sale terms and any documents provided for the vehicle.</FeatureCard>
              <FeatureCard icon={<Globe2 size={21} />} title="Destination-aware planning">Shipping availability, import eligibility and destination charges need to be checked for the specific country.</FeatureCard>
              <FeatureCard icon={<ShieldCheck size={21} />} title="Clear communication">Review the written quotation and official instructions before making a commitment or arranging payment.</FeatureCard>
            </div>
          </div>
        </section>

        <section className="trust-section trust-section-muted">
          <div className="site-container trust-address-panel">
            <div className="trust-address-icon"><MapPin size={23} /></div>
            <div>
              <span className="eyebrow">Japan headquarters</span>
              <h2>Wazir Trading LLC</h2>
              <address>
                {siteConfig.address.streetAddress}<br />
                {siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}<br />
                Japan
              </address>
              <p>Office visits are by appointment. Please contact the team before travelling.</p>
              <a href="https://www.google.com/maps/search/?api=1&query=Heights%20Mizutani%201C%2C%20158-1%20Jizou%2C%20Kuwana%2C%20Mie%2C%20Japan" target="_blank" rel="noreferrer" className="text-link">View location in Google Maps <span>↗</span></a>
            </div>
          </div>
        </section>
        <TrustCta title="Start with the vehicle and your destination." description="Browse the current listings or contact Wazir Trading to discuss a vehicle requirement and the export information you need." href="/cars" label="Browse vehicles" />
      </main>
      <SiteFooter />
    </>
  );
}
