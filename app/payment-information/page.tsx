import type { Metadata } from "next";
import { BadgeCheck, ClipboardCheck, FileText, LockKeyhole, ShieldCheck, Ship } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumbs, FeatureCard, Notice, SectionHeading, StepCard, TrustCta, TrustPageHero } from "@/components/trust-pages";
import { pageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, safeJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Payment Information and Safety",
  description: "Review practical payment safety guidance for purchasing a Japanese used vehicle: written quotations, invoice checks, beneficiary verification and transaction records.",
  path: "/payment-information",
});

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Payment Information", path: "/payment-information" },
]);

export default function PaymentInformationPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }} />
      <SiteHeader />
      <main id="main-content">
        <TrustPageHero
          eyebrow="Payment information · Buyer safety"
          title={<>Review the paperwork. <em>Verify before you pay.</em></>}
          description="Vehicle purchases and export arrangements should be supported by clear written terms. Use the guidance below to review your quotation and independently confirm payment instructions before sending funds."
          actions={[{ href: "/contact", label: "Verify instructions with us" }, { href: "/how-it-works", label: "See the buying process", variant: "secondary" }]}
          aside={<div className="trust-hero-stat-card trust-hero-stat-card-warning"><span className="trust-card-overline">Important</span><ShieldCheck size={31} /><strong>Verify the beneficiary</strong><span>Never rely on changed or informal account instructions.</span></div>}
        />
        <Breadcrumbs items={[{ label: "Payment Information" }]} />

        <section className="trust-section">
          <div className="site-container">
            <SectionHeading eyebrow="A safer transaction process" title="Use official documents and direct verification." description="This website does not collect card details or accept online payments. Payment arrangements are handled for the specific transaction and should be confirmed in the official written documents." align="center" />
            <div className="trust-step-grid trust-step-grid-4">
              <StepCard number="01" icon={<FileText size={20} />} title="Receive the written quotation">Check the vehicle reference, price, currency, sale terms, shipping scope and quotation validity.</StepCard>
              <StepCard number="02" icon={<ClipboardCheck size={20} />} title="Review the invoice">Make sure the buyer, seller, vehicle details, amounts, due dates and included or excluded charges match what was agreed.</StepCard>
              <StepCard number="03" icon={<LockKeyhole size={20} />} title="Verify independently">Confirm the beneficiary name and payment details directly with Wazir Trading using the published company contact details.</StepCard>
              <StepCard number="04" icon={<BadgeCheck size={20} />} title="Keep your records">Retain the signed or accepted documents, payment receipt and written communication for your records.</StepCard>
            </div>
          </div>
        </section>

        <section className="trust-section trust-section-muted">
          <div className="site-container trust-two-column align-start">
            <div>
              <SectionHeading eyebrow="Invoice review" title="What to check before authorizing a transfer." description="Do not rely on a headline vehicle price alone. Read the complete quotation and ask for clarification if a line item or condition is unclear." />
              <ul className="trust-check-list">
                <li><ClipboardCheck size={17} /> Full legal names and contact details of the parties</li>
                <li><ClipboardCheck size={17} /> Vehicle reference and description</li>
                <li><ClipboardCheck size={17} /> Currency, total due and payment deadline</li>
                <li><ClipboardCheck size={17} /> Shipping, insurance and other included charges</li>
                <li><ClipboardCheck size={17} /> Charges that remain payable separately</li>
                <li><ClipboardCheck size={17} /> Cancellation, refund and other transaction terms</li>
                <li><ClipboardCheck size={17} /> Beneficiary and bank details independently confirmed</li>
              </ul>
            </div>
            <Notice title="Bank-detail change warning" tone="warning">
              <p>Unexpected changes to account numbers, beneficiary names or payment destinations are a serious warning sign. Do not pay based only on a forwarded message, a new email address, a social-media account or instructions from an intermediary. Stop and verify the change using the contact details already published on this website.</p>
              <p>Wazir Trading&apos;s published contact email is <a className="inline-link" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>
            </Notice>
          </div>
        </section>

        <section className="trust-section">
          <div className="site-container">
            <SectionHeading eyebrow="Pricing terminology" title="Understand what the quotation includes." description="These are common international trade terms. The actual agreed scope must be stated in your written quotation." align="center" />
            <div className="trust-feature-grid trust-feature-grid-3">
              <FeatureCard icon={<FileText size={21} />} title="FOB — Free On Board">Under FOB, the seller delivers the goods on board the vessel nominated by the buyer at the named port of shipment. Risk transfers when the goods are on board; the buyer generally arranges and pays the main sea carriage. Insurance is not included by default and should be arranged separately by the buyer if desired.</FeatureCard>
              <FeatureCard icon={<Ship size={21} />} title="CFR — Cost and Freight">Under CFR, the seller arranges and pays the cost and freight to the named destination port. Risk nevertheless transfers when the goods are on board at the port of shipment; the seller is not required to buy cargo insurance under CFR.</FeatureCard>
              <FeatureCard icon={<ShieldCheck size={21} />} title="CIF — Cost, Insurance and Freight">Under CIF, the seller arranges and pays the cost and freight to the named destination port and obtains the required insurance cover. Under Incoterms® 2020, the default CIF insurance cover is limited minimum cover unless the parties agree otherwise.</FeatureCard>
            </div>
            <p className="trust-footnote">Incoterms® 2020 FOB, CFR and CIF are sea and inland-waterway rules. The named place or port and the agreed version should be written into the contract. For containerized cargo handed over at a container terminal, FCA may be more appropriate than FOB. These definitions are a general guide, not a substitute for contract review. See the <a className="inline-link" href="https://library.iccwbo.org/clp/clp-incoterms.htm" target="_blank" rel="noreferrer">International Chamber of Commerce (ICC) Incoterms® guidance</a>.</p>
          </div>
        </section>

        <section className="trust-section trust-section-muted">
          <div className="site-container">
            <Notice title="Do not publish or rely on bank details copied from old pages" tone="warning">
              <p>For security, this website intentionally does not display account numbers or bank coordinates. Request the current official payment document and verify its details directly with the company before transferring any funds.</p>
            </Notice>
          </div>
        </section>
        <TrustCta title="Need to confirm a payment instruction?" description="Contact Wazir Trading using the email or WhatsApp details published on this website before authorizing a transfer." href="/contact" label="Contact the Japan office" />
      </main>
      <SiteFooter />
    </>
  );
}
