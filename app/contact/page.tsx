import type { Metadata } from "next";
import Link from "next/link";
import { CarFront, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactEnquiryForm } from "@/components/contact-enquiry-form";
import { Breadcrumbs, Notice, TrustPageHero } from "@/components/trust-pages";
import { pageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, safeJsonLd } from "@/lib/structured-data";
import { siteConfig, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact Wazir Trading",
  description: "Contact Wazir Trading LLC in Japan about available Japanese used vehicles, sourcing requests, export information, shipping quotations and payment questions.",
  path: "/contact",
});

const breadcrumb = breadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
]);

function formatWhatsappNumber(number: string) {
  if (number.startsWith("81") && number.length === 12) return `+81 ${number.slice(2, 4)} ${number.slice(4, 8)} ${number.slice(8)}`;
  return `+${number}`;
}

export default function ContactPage() {
  const whatsapp = formatWhatsappNumber(siteConfig.whatsappNumber);
  const waLink = whatsappUrl("Hello Wazir Trading LLC, I have a question about buying a Japanese used vehicle.");
  const mapLink = "https://www.google.com/maps/search/?api=1&query=Heights%20Mizutani%201C%2C%20158-1%20Jizou%2C%20Kuwana%2C%20Mie%2C%20Japan";

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Wazir Trading LLC",
    url: `${siteConfig.url}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: siteConfig.name,
      email: siteConfig.email,
      telephone: whatsapp,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.streetAddress,
        addressLocality: siteConfig.address.addressLocality,
        addressRegion: siteConfig.address.addressRegion,
        addressCountry: siteConfig.address.addressCountry,
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(contactPageJsonLd) }} />
      <SiteHeader />
      <main id="main-content">
        <TrustPageHero
          eyebrow="Contact Wazir Trading LLC · Japan"
          title={<>Let&apos;s discuss your <em>vehicle or export enquiry.</em></>}
          description="Contact the Japan-based team about a vehicle reference, sourcing requirement, shipping route or payment document. Include your destination country so the enquiry can be considered in context."
          actions={[{ href: waLink, label: "Chat on WhatsApp", external: true }, { href: `mailto:${siteConfig.email}`, label: "Send an email", variant: "secondary", external: true }]}
          aside={<div className="trust-hero-stat-card"><span className="trust-card-overline">Direct contact</span><MessageCircle size={31} /><strong>{whatsapp}</strong><span>WhatsApp · International format</span></div>}
        />
        <Breadcrumbs items={[{ label: "Contact" }]} />

        <section className="trust-section contact-section">
          <div className="site-container contact-layout">
            <div className="contact-information-column">
              <span className="eyebrow">Japan office details</span>
              <h2>Contact the team directly.</h2>
              <p className="contact-intro">For the most useful reply, include the vehicle reference (if you have one), destination country and the specific information you need.</p>

              <div className="contact-detail-card">
                <span className="contact-detail-icon"><MapPin size={20} /></span>
                <div>
                  <strong>Japan headquarters</strong>
                  <address>{siteConfig.address.streetAddress}<br />{siteConfig.address.addressLocality}, {siteConfig.address.addressRegion}<br />Japan</address>
                  <a className="text-link" href={mapLink} target="_blank" rel="noreferrer">View on Google Maps <span>↗</span></a>
                  <small>Visits by appointment only. Please contact us before travelling.</small>
                </div>
              </div>
              <div className="contact-detail-card">
                <span className="contact-detail-icon"><MessageCircle size={20} /></span>
                <div>
                  <strong>WhatsApp</strong>
                  <a href={waLink} target="_blank" rel="noreferrer">{whatsapp}</a>
                  <small>Send a message with your vehicle or destination details.</small>
                </div>
              </div>
              <div className="contact-detail-card">
                <span className="contact-detail-icon"><Mail size={20} /></span>
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                  <small>Use email for written questions and document-related enquiries.</small>
                </div>
              </div>
              <Notice title="Protect your transaction">
                <p>Use the contact details published here to verify quotations and payment instructions. Be cautious of unsolicited messages, third-party agents and unexpected changes to bank details.</p>
                <Link className="text-link" href="/payment-information">Read payment safety guidance <span>→</span></Link>
              </Notice>
            </div>
            <ContactEnquiryForm />
          </div>
        </section>

        <section className="trust-section trust-section-muted">
          <div className="site-container contact-bottom-note">
            <div className="contact-bottom-icon"><ShieldCheck size={23} /></div>
            <div>
              <h2>Make your enquiry specific.</h2>
              <p>For an existing listing, include its reference number. For a sourcing request, include your preferred vehicle, budget range and destination. For shipping, include the arrival port if known.</p>
            </div>
            <Link className="button button-outline-navy" href="/cars">Browse vehicles <CarFront size={15} /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
