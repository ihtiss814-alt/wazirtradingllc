import type { Metadata } from "next";
import { ArrowLeftRight, ClipboardCheck, FileText, MessageCircle, Search, Ship, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs, FeatureCard, Notice, SectionHeading, StepCard, TrustCta, TrustPageHero } from "@/components/trust-pages";
import { pageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, safeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "How to Buy a Used Car from Japan",
  description: "Understand the steps for browsing Japanese used vehicles, reviewing listing details, requesting a written quotation, confirming payment terms and arranging export with Wazir Trading LLC.",
  path: "/how-it-works",
});

const steps = [
  { number: "01", icon: <Search size={21} />, title: "Browse or describe what you need", copy: "Explore available vehicle listings and note the reference number of a vehicle you like. If you do not see a suitable match, send the team your preferred make, model, year range, budget and destination." },
  { number: "02", icon: <ClipboardCheck size={21} />, title: "Review the vehicle information", copy: "Ask questions about the listing, photographs, specifications, recorded condition grades, availability and any supporting documents that can be provided. Clarify anything you do not understand before proceeding." },
  { number: "03", icon: <FileText size={21} />, title: "Request a written quotation", copy: "Share the destination country and arrival port so the quotation can identify the vehicle price, shipping arrangement and any included or excluded charges. Review the terms and validity period on the written documents." },
  { number: "04", icon: <ShieldCheck size={21} />, title: "Verify the payment instructions", copy: "Only proceed after you receive the official transaction documents and independently confirm the beneficiary and payment instructions with Wazir Trading through its published contact details." },
  { number: "05", icon: <Ship size={21} />, title: "Confirm export and shipping", copy: "Once the purchase and shipping arrangements are confirmed, the team can advise which export documents are available for your shipment and what you will need for destination clearance." },
];

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "How It Works", path: "/how-it-works" },
]);

export default function HowItWorksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }} />
      <SiteHeader />
      <main id="main-content">
        <TrustPageHero
          eyebrow="Buying process · From Japan to your destination"
          title={<>A clear path from <em>vehicle search to export.</em></>}
          description="Every purchase is different. Use this overview to understand the main decisions, the information to request and the points to confirm before you commit."
          actions={[{ href: "/cars", label: "Browse vehicle inventory" }, { href: "/contact", label: "Ask a question", variant: "secondary" }]}
          aside={<div className="trust-hero-stat-card"><span className="trust-card-overline">The process</span><ArrowLeftRight size={30} /><strong>Review · Confirm · Arrange</strong><span>Keep the vehicle, paperwork and destination aligned.</span></div>}
        />
        <Breadcrumbs items={[{ label: "How It Works" }]} />

        <section className="trust-section">
          <div className="site-container">
            <SectionHeading eyebrow="The buying journey" title="Five steps to understand before you buy." description="Start with a vehicle listing or a sourcing request. Do not make payment or rely on a shipping estimate until the individual terms have been confirmed in writing." align="center" />
            <div className="trust-step-grid">
              {steps.map((step) => <StepCard key={step.number} number={step.number} icon={step.icon} title={step.title}>{step.copy}</StepCard>)}
            </div>
          </div>
        </section>

        <section className="trust-section trust-section-muted">
          <div className="site-container">
            <SectionHeading eyebrow="Two ways to begin" title="Choose a vehicle or describe your requirements." description="The next step depends on whether you have already found a listing or need help identifying a suitable vehicle." />
            <div className="trust-feature-grid trust-feature-grid-2">
              <FeatureCard icon={<Search size={21} />} title="Buy from available inventory">
                <p>Open a vehicle detail page to review the reference number, photographs, listed specifications, recorded grades and any FOB price shown. Contact the team to confirm that the vehicle is still available and request the current quotation.</p>
                <Link className="text-link" href="/cars">Explore available vehicles <span>→</span></Link>
              </FeatureCard>
              <FeatureCard icon={<MessageCircle size={21} />} title="Ask about a sourcing requirement">
                <p>Tell the team the make, model, acceptable year range, budget, preferred features and destination. The team can discuss whether it can help locate a suitable vehicle; a specific result or purchase is not guaranteed.</p>
                <Link className="text-link" href="/contact">Send your requirements <span>→</span></Link>
              </FeatureCard>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="site-container trust-two-column align-start">
            <div>
              <SectionHeading eyebrow="Before making payment" title="Check the documents and terms carefully." description="A written quotation should make it possible to understand what you are buying and what is included in the export arrangement." />
              <ul className="trust-check-list">
                <li><ClipboardCheck size={17} /> Vehicle reference, make, model, year and specification</li>
                <li><ClipboardCheck size={17} /> Current availability and sale validity</li>
                <li><ClipboardCheck size={17} /> Vehicle price and currency</li>
                <li><ClipboardCheck size={17} /> Shipping method, departure port and destination port</li>
                <li><ClipboardCheck size={17} /> Charges included and excluded from the quotation</li>
                <li><ClipboardCheck size={17} /> Payment deadlines, terms and official beneficiary details</li>
                <li><ClipboardCheck size={17} /> Export documents expected for the shipment</li>
              </ul>
            </div>
            <Notice title="Never rely on informal payment instructions" tone="warning">
              <p>Before transferring funds, verify the payment beneficiary and account details directly with Wazir Trading using the contact details published on this website. Do not send money to a personal account or an intermediary claiming to represent the company without independent confirmation.</p>
              <Link href="/payment-information" className="text-link">Read payment guidance <span>→</span></Link>
            </Notice>
          </div>
        </section>

        <section className="trust-section trust-section-muted">
          <div className="site-container">
            <SectionHeading eyebrow="Related information" title="Understand the export details too." align="center" />
            <div className="trust-feature-grid trust-feature-grid-3">
              <FeatureCard icon={<Ship size={21} />} title="Shipping arrangements"><p>Understand RoRo and container shipping and what needs to be confirmed for your route.</p><Link className="text-link" href="/shipping-information">Shipping information <span>→</span></Link></FeatureCard>
              <FeatureCard icon={<ShieldCheck size={21} />} title="Payment safety"><p>Review invoices and payment instructions carefully before making a transfer.</p><Link className="text-link" href="/payment-information">Payment information <span>→</span></Link></FeatureCard>
              <FeatureCard icon={<MessageCircle size={21} />} title="Ask the team"><p>Send the vehicle reference and destination so your question can be addressed specifically.</p><Link className="text-link" href="/contact">Contact Wazir Trading <span>→</span></Link></FeatureCard>
            </div>
          </div>
        </section>
        <TrustCta title="Have a vehicle in mind?" description="Send the listing reference and your destination. Start with a clear question and request the current written terms." href="/cars" label="Find a vehicle" />
      </main>
      <SiteFooter />
    </>
  );
}
