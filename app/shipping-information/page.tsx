import type { Metadata } from "next";
import Link from "next/link";
import { Anchor, ClipboardCheck, ClipboardList, Container, FileCheck2, MapPin, Ship, Truck, Waves } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs, FeatureCard, Notice, SectionHeading, StepCard, TrustCta, TrustPageHero } from "@/components/trust-pages";
import { pageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, safeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Shipping Japanese Used Cars",
  description: "Learn about RoRo and container shipping for vehicles exported from Japan, the details needed for a route quotation, and the documents to confirm before shipment.",
  path: "/shipping-information",
});

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Shipping Information", path: "/shipping-information" },
]);

export default function ShippingInformationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }} />
      <SiteHeader />
      <main id="main-content">
        <TrustPageHero
          eyebrow="Vehicle export · Shipping from Japan"
          title={<>Shipping planned around <em>your vehicle and destination.</em></>}
          description="The right shipping arrangement depends on the vehicle, destination port, carrier availability and import requirements. Wazir Trading confirms the available option and route details as part of the individual quotation."
          actions={[{ href: "/contact", label: "Request shipping information" }, { href: "/how-it-works", label: "Understand the process", variant: "secondary" }]}
          aside={<div className="trust-hero-stat-card"><span className="trust-card-overline">Export planning</span><Ship size={31} /><strong>Route-specific details</strong><span>Method, ports, costs and timing confirmed for each shipment.</span></div>}
        />
        <Breadcrumbs items={[{ label: "Shipping Information" }]} />

        <section className="trust-section">
          <div className="site-container">
            <SectionHeading eyebrow="Shipping methods" title="Two common ways to move a vehicle by sea." description="The method that can be used is not universal. It depends on the destination service, vehicle dimensions and condition, carrier requirements and current sailing availability." align="center" />
            <div className="trust-feature-grid trust-feature-grid-2">
              <FeatureCard icon={<Ship size={23} />} title="RoRo (Roll-on / Roll-off)">
                <p>Vehicles that meet the carrier&apos;s acceptance requirements are driven or moved onto a specialized vehicle ship and secured for the voyage. At the destination, they are driven or moved off the vessel.</p>
                <ul className="trust-mini-list"><li>Designed for wheeled, operable cargo accepted by the carrier.</li><li>Vehicle access and personal effects restrictions are carrier-specific.</li><li>Service availability depends on the destination and sailing.</li></ul>
              </FeatureCard>
              <FeatureCard icon={<Container size={23} />} title="Container shipping">
                <p>A vehicle is secured inside a shipping container for transport. Container services can be considered where the route, vehicle and carrier conditions make them suitable.</p>
                <ul className="trust-mini-list"><li>Container size and loading arrangements must suit the vehicle.</li><li>Loading, securing, handling and destination charges need to be quoted.</li><li>Availability and consolidation options vary by route.</li></ul>
              </FeatureCard>
            </div>
            <Notice title="No assumed sailing date or transit time">
              <p>Vessel schedules and estimated transit times change. A route or delivery estimate is not confirmed until the carrier, departure, destination and booking details have been checked for the specific shipment.</p>
            </Notice>
          </div>
        </section>

        <section className="trust-section trust-section-muted">
          <div className="site-container">
            <SectionHeading eyebrow="How shipping is arranged" title="The details that need to be confirmed." description="A useful shipping enquiry starts with enough detail to identify the vehicle and the destination service." align="center" />
            <div className="trust-step-grid trust-step-grid-4">
              <StepCard number="01" icon={<Truck size={20} />} title="Identify the vehicle">Share the listing reference or provide the make, model, dimensions where known, and whether the vehicle is operable.</StepCard>
              <StepCard number="02" icon={<MapPin size={20} />} title="Confirm destination">Specify the destination country and preferred arrival port. Check whether the vehicle can be imported under local rules.</StepCard>
              <StepCard number="03" icon={<Anchor size={20} />} title="Compare the method">Confirm whether RoRo or container service is available and review the carrier, route, expected schedule and quoted charges.</StepCard>
              <StepCard number="04" icon={<FileCheck2 size={20} />} title="Review documents">Confirm which export and transport documents will be issued and what your destination customs authority requires.</StepCard>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="site-container trust-two-column align-start">
            <div>
              <SectionHeading eyebrow="What to include in your enquiry" title="Help us quote the correct route." description="Include as many of these details as you can. We can then identify what still needs to be checked." />
              <ul className="trust-check-list">
                <li><ClipboardList size={17} /> Vehicle reference or full make and model</li>
                <li><ClipboardList size={17} /> Destination country and preferred arrival port</li>
                <li><ClipboardList size={17} /> Whether the vehicle is operable</li>
                <li><ClipboardList size={17} /> Preferred shipping method, if you have one</li>
                <li><ClipboardList size={17} /> Target timing or any special handling requirements</li>
              </ul>
            </div>
            <div className="trust-side-panel">
              <Waves size={25} />
              <h3>Understand the full cost.</h3>
              <p>A vehicle&apos;s FOB price is not the same as the total amount payable to receive it in your country. Ask for an itemized quotation that states what is included and what remains payable at destination.</p>
              <p>Import duty, taxes, customs clearance, inspection, registration, inland delivery and compliance costs may be separate. Confirm them with the relevant destination authority or a qualified local agent.</p>
              <Link className="text-link" href="/payment-information">Review payment and quotation guidance <span>→</span></Link>
            </div>
          </div>
        </section>

        <section className="trust-section trust-section-muted">
          <div className="site-container">
            <SectionHeading eyebrow="Documents" title="Ask which documents apply to your shipment." description="The exact document set depends on the shipment, carrier and destination customs requirements. Confirm availability and format before the vehicle leaves Japan." align="center" />
            <div className="trust-feature-grid trust-feature-grid-3">
              <FeatureCard icon={<FileCheck2 size={21} />} title="Export documentation">Ask which Japanese export or deregistration documents will be issued and when they will be available.</FeatureCard>
              <FeatureCard icon={<Ship size={21} />} title="Transport document">Confirm the bill of lading or other carrier document, consignee details and release process.</FeatureCard>
              <FeatureCard icon={<ClipboardCheck size={21} />} title="Destination clearance">Check with your customs authority or local clearing professional for any additional certificates, inspections or translations.</FeatureCard>
            </div>
          </div>
        </section>
        <TrustCta title="Need a route-specific shipping quote?" description="Send the vehicle reference, destination country and preferred port. We will discuss the shipping information that can be confirmed for your enquiry." href="/contact" label="Request a shipping quote" />
      </main>
      <SiteFooter />
    </>
  );
}
