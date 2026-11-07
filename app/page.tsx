import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CarFront,
  Check,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Ship,
} from "lucide-react";
import { LeadRequestForm } from "@/components/lead-request-form";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig, whatsappUrl } from "@/lib/site";
import { getFeaturedVehicles } from "@/lib/inventory";
import { getAvailableTaxonomy, getLandingInventory } from "@/lib/seo-landings";
import { VEHICLE_CATEGORY_BY_SLUG } from "@/lib/landing-pages";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { organizationJsonLd, safeJsonLd, websiteJsonLd } from "@/lib/structured-data";

const categories = [
  {
    slug: "suvs",
    title: "SUVs & crossovers",
    description: "Practical space, higher ride height and versatile everyday use.",
    icon: "/icons/car-bt-compact-suv.svg",
    note: "Explore SUV options",
  },
  {
    slug: "sedans",
    title: "Sedans",
    description: "Comfortable passenger cars for commuting and longer journeys.",
    icon: "/icons/car-bt-compact-sedan.svg",
    note: "Explore sedan options",
  },
  {
    slug: "hatchbacks",
    title: "Hatchbacks",
    description: "Compact footprints with flexible interiors and easy city use.",
    icon: "/icons/car-bt-compact-hatchback.svg",
    note: "Explore hatchbacks",
  },
  {
    slug: "vans-and-mpvs",
    title: "Vans & people carriers",
    description: "Flexible passenger and cargo configurations for different needs.",
    icon: "/icons/car-bt-micro-van.svg",
    note: "Explore vans",
  },
  {
    slug: "pickup-trucks",
    title: "Pickup trucks",
    description: "Utility-focused vehicles for work, transport and everyday driving.",
    icon: "/icons/car-bt-double-cabin.svg",
    note: "Explore pickups",
  },
  {
    slug: "commercial-vehicles",
    title: "Commercial vehicles",
    description: "Commercial and specialist vehicle enquiries are welcome.",
    icon: "/icons/car-bt-bus.svg",
    note: "Discuss your requirements",
  },
];

const brands = [
  { name: "Toyota", logo: "/logos/toyota.svg" },
  { name: "Honda", logo: "/logos/honda.svg" },
  { name: "Nissan", logo: "/logos/nissan.svg" },
  { name: "Suzuki", logo: "/logos/suzuki.svg" },
  { name: "Mazda", logo: "/logos/mazda.svg" },
  { name: "Mitsubishi", logo: "/logos/mitsubishi.svg" },
  { name: "Subaru", logo: "/logos/subaru.svg" },
  { name: "Daihatsu", logo: "/logos/daihatsu.svg" },
];

const processSteps = [
  {
    number: "01",
    icon: CarFront,
    title: "Tell us what you need",
    body: "Share your preferred make, model, budget and destination. We can discuss available vehicles or a sourcing request.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Review the vehicle details",
    body: "Before you decide, clarify the vehicle record, condition information, sale terms and any inspection documents available.",
  },
  {
    number: "03",
    icon: Ship,
    title: "Confirm export arrangements",
    body: "Confirm the final quotation, required documents, shipping option and destination-specific import requirements before payment.",
  },
];

const commitments = [
  {
    icon: FileCheck2,
    title: "Information before commitment",
    body: "Ask for the available vehicle details and documents before confirming a purchase.",
  },
  {
    icon: Globe2,
    title: "Destination-aware enquiries",
    body: "Export eligibility, shipping routes and import rules are checked against the intended destination.",
  },
  {
    icon: MessageCircle,
    title: "Direct communication",
    body: "Speak with the team about the vehicle, quotation and next steps through a clear enquiry channel.",
  },
];

export default async function HomePage() {
  const waLink = whatsappUrl("Hello, I would like to discuss buying a used vehicle from Japan.");
  const [featuredVehicles, taxonomy, categoryVisibility] = await Promise.all([
    getFeaturedVehicles(),
    getAvailableTaxonomy(),
    Promise.all(categories.map(async (category) => {
      const definition = VEHICLE_CATEGORY_BY_SLUG.get(category.slug);
      if (!definition) return { available: false, error: false };
      const result = await getLandingInventory({ bodyTypes: definition.bodyTypes, fuelContains: definition.fuelContains });
      return { available: !result.error && result.matchedCount > 0, error: result.error };
    })),
  ]);
  const visibleCategories = categories.filter((_, index) => categoryVisibility[index]?.available);
  const categoryLookupFailed = categoryVisibility.some((result) => result.error);
  const availableBrandTiles = taxonomy.error
    ? []
    : brands.map((brand) => ({ ...brand, make: taxonomy.makes.find((make) => make.name.toLowerCase() === brand.name.toLowerCase()) }))
      .filter((brand) => brand.make);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd()) }} />

      <SiteHeader />
      <main id="main-content">
        <section className="hero-section">
          <div className="hero-grain" aria-hidden="true" />
          <div className="site-container hero-grid">
            <div className="hero-copy">
              <div className="hero-kicker"><span /> Japan-based vehicle sourcing & export</div>
              <h1>Japanese used cars for export. <em>With clarity from Japan.</em></h1>
              <p className="hero-description">
                Find the right vehicle from Japan with clear information, a straightforward enquiry process and export details discussed for your destination.
              </p>
              <div className="hero-actions">
                <Link href="#request-quote" className="button button-primary">
                  Discuss a vehicle <ArrowUpRight size={17} />
                </Link>
                <Link href="#how-it-works" className="button button-ghost-light">
                  How buying works <ArrowDownRight size={17} />
                </Link>
              </div>
              <div className="hero-proofline">
                <span><Check size={14} /> Japan-based operation</span>
                <span><Check size={14} /> Vehicle details first</span>
                <span><Check size={14} /> Destination-specific quote</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-frame">
                <Image
                  src="https://images.unsplash.com/photo-1624833804885-d932d8f0f1ac?auto=format&fit=crop&w=1800&q=85"
                  alt=""
                  fill
                  preload
                  sizes="(max-width: 900px) 100vw, 54vw"
                  className="hero-image"
                />
                <div className="hero-image-shade" />
                <div className="image-caption">
                  <span className="image-caption-line" />
                  <span>Japanese vehicle export enquiries</span>
                </div>
              </div>
              <div className="hero-side-note">
                <span className="side-note-number">WT / 01</span>
                <span>From Japan<br />to your destination</span>
              </div>
              <div className="hero-stamp" aria-hidden="true">
                <Image src="/favicon.svg" alt="" width={45} height={45} />
                <span>WAZIR<br />TRADING LLC</span>
              </div>
            </div>
          </div>
          <div className="hero-bottom-rule"><span /> <span>Vehicle sourcing · Export process · Buyer support</span></div>
        </section>

        <section className="assurance-strip" aria-label="Service approach">
          <div className="site-container assurance-grid">
            <div><span className="assurance-icon"><MapPin size={18} /></span><span><strong>Based in Japan</strong><small>Kuwana, Mie Prefecture</small></span></div>
            <div><span className="assurance-icon"><ClipboardCheck size={18} /></span><span><strong>Review before purchase</strong><small>Ask for available vehicle records</small></span></div>
            <div><span className="assurance-icon"><Ship size={18} /></span><span><strong>Export planning</strong><small>Destination and route confirmed</small></span></div>
            <div><span className="assurance-icon"><MessageCircle size={18} /></span><span><strong>Direct enquiries</strong><small>Talk through your requirements</small></span></div>
          </div>
        </section>

        <section className="section inventory-home-section" id="featured-vehicles">
          <div className="site-container">
            <div className="section-heading section-heading-split inventory-home-heading">
              <div>
                <span className="eyebrow">Current vehicle inventory</span>
                <h2>Explore vehicles<br className="desktop-break" /> currently listed.</h2>
              </div>
              <div className="inventory-home-intro">
                <p>Browse the available vehicle records, review photographs and specifications, and ask us to confirm the export details for your destination.</p>
                <Link href="/cars" className="text-link">View all vehicles <ArrowUpRight size={16} /></Link>
              </div>
            </div>
            {featuredVehicles.length ? (
              <div className="vehicle-grid vehicle-grid-home">
                {featuredVehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
              </div>
            ) : (
              <div className="inventory-home-empty">
                <CarFront size={29} />
                <div><strong>Looking for a particular vehicle?</strong><p>Contact our Japan team to discuss current availability and sourcing options.</p></div>
                <Link href="#request-quote" className="button button-secondary">Make an enquiry <ArrowUpRight size={15} /></Link>
              </div>
            )}
          </div>
        </section>

        <section className="section section-white" id="vehicle-types">
          <div className="site-container">
            <div className="section-heading section-heading-split">
              <div>
                <span className="eyebrow">Explore by category</span>
                <h2>Start with the kind<br className="desktop-break" /> of vehicle you need.</h2>
              </div>
              <p>From everyday passenger cars to commercial vehicles, tell us what you are looking for and we can discuss suitable options and availability.</p>
            </div>

            <div className="category-grid">
              {visibleCategories.map((category, index) => (
                <Link href={`/vehicle-types/${category.slug}`} className="category-card" key={category.title}>
                  <div className="category-card-top">
                    <span className="category-index">0{index + 1}</span>
                    <ArrowUpRight size={18} className="category-arrow" />
                  </div>
                  <div className="category-icon-wrap">
                    <Image src={category.icon} alt="" width={76} height={58} />
                  </div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <span className="category-link">{category.note} <ArrowRight size={14} /></span>
                </Link>
              ))}
              {!visibleCategories.length ? <p className="brand-directory-fallback">{categoryLookupFailed ? "Vehicle categories could not be loaded right now. Please try the inventory again shortly." : "No category matches are currently listed. Browse all inventory or contact us about a sourcing request."}</p> : null}
            </div>
          </div>
        </section>

        <section className="section brand-section">
          <div className="site-container">
            <div className="section-heading section-heading-centered">
              <span className="eyebrow">Popular Japanese marques</span>
              <h2>Explore familiar names.</h2>
              <p>Tell us the make or model you have in mind. Vehicle availability and sourcing options are confirmed individually.</p>
            </div>
            <div className="brand-grid">
              {availableBrandTiles.map((brand) => (
                <Link href={`/makes/${brand.make!.slug}`} className="brand-tile" key={brand.name}>
                  <Image src={brand.logo} alt={`${brand.name} logo`} width={90} height={54} />
                  <span>{brand.name}</span>
                </Link>
              ))}
              {!availableBrandTiles.length ? <p className="brand-directory-fallback">Browse the live manufacturer directory to see the makes currently represented in stock.</p> : null}
            </div>
            <p className="brand-disclaimer">Brand marks are shown for identification only. Wazir Trading LLC is not represented as an authorized dealer of these manufacturers.</p>
            <div className="seo-home-directory-links"><Link href="/makes">Explore all available makes <ArrowRight size={14} /></Link><Link href="/vehicle-types">Browse every vehicle category <ArrowRight size={14} /></Link></div>
          </div>
        </section>

        <section className="section process-section" id="how-it-works">
          <div className="site-container">
            <div className="section-heading section-heading-centered section-heading-light">
              <span className="eyebrow eyebrow-light">A clearer way to buy</span>
              <h2>From first enquiry<br />to export arrangements.</h2>
              <p>Understand the steps, review the details and confirm the terms before moving ahead.</p>
            </div>
            <div className="process-grid">
              {processSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <article className="process-card" key={step.number}>
                    <div className="process-card-head"><span>{step.number}</span><Icon size={24} strokeWidth={1.65} /></div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    <span className="process-card-rule" />
                  </article>
                );
              })}
            </div>
            <div className="process-footnote"><ShieldCheck size={17} /> Always confirm the full quotation, sale terms and destination import requirements before making payment.</div>
          </div>
        </section>

        <section className="section section-white" id="about">
          <div className="site-container about-grid">
            <div className="about-photo-wrap">
              <div className="about-photo">
                <Image src="/images/mumtaz-khan-ceo.webp" alt="Mumtaz Khan, Chief Executive Officer of Wazir Trading LLC" fill sizes="(max-width: 800px) 100vw, 42vw" />
              </div>
              <div className="about-photo-caption"><span className="caption-mark">W</span><span><strong>Mumtaz Khan</strong><small>Chief Executive Officer</small></span></div>
              <div className="about-photo-index">PEOPLE BEHIND THE PROCESS / 01</div>
            </div>
            <div className="about-copy">
              <span className="eyebrow">About Wazir Trading LLC</span>
              <h2>A Japan-based operation with a focus on clear communication.</h2>
              <p className="about-lede">Buying a vehicle from another country involves more than choosing a model. Buyers need clear information about condition, purchase terms, documents, shipping and destination requirements.</p>
              <p>Wazir Trading LLC helps customers review Japanese used-vehicle options and discuss the steps involved in arranging an export. Our aim is to make each enquiry more informed, from the first vehicle request through confirmation of export arrangements.</p>
              <div className="commitment-list">
                {commitments.map((item) => {
                  const Icon = item.icon;
                  return <div className="commitment-item" key={item.title}><span><Icon size={18} /></span><div><h3>{item.title}</h3><p>{item.body}</p></div></div>;
                })}
              </div>
              <Link href="#request-quote" className="text-link">Talk to our team <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="japan-section">
          <div className="site-container japan-grid">
            <div>
              <span className="eyebrow eyebrow-light">Our Japan base</span>
              <h2>Grounded in Japan.<br /><em>Connected to your plans.</em></h2>
              <p>Wazir Trading LLC lists its Japan office in Kuwana City, Mie Prefecture. Contact the team before visiting to confirm availability and arrange an appointment.</p>
              <a className="button button-outline-light" href="https://maps.google.com/?q=Heights+Mizutani+1C+158-1+Jizou+Kuwana+Mie+Japan" target="_blank" rel="noreferrer">
                View location <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="japan-address-card">
              <div className="address-card-top"><span>JAPAN OFFICE</span><MapPin size={19} /></div>
              <h3>Wazir Trading LLC</h3>
              <p>Heights Mizutani 1C, 158-1 Jizou<br />Kuwana-City, Mie Prefecture<br />Japan</p>
              <div className="address-card-divider" />
              <a href={`mailto:${siteConfig.email}`}><span>Email</span>{siteConfig.email}<ArrowUpRight size={14} /></a>
              <a href={waLink} target="_blank" rel="noreferrer"><span>WhatsApp</span>+{siteConfig.whatsappNumber}<ArrowUpRight size={14} /></a>
              <small>Office visits by appointment. Please contact us first.</small>
            </div>
          </div>
        </section>

        <section className="section request-section" id="request-quote">
          <div className="site-container request-grid">
            <div className="request-side-copy">
              <span className="eyebrow">Your next step</span>
              <h2>Have a vehicle in mind?</h2>
              <p>Share your requirements and destination. We will receive your message in WhatsApp, where you can review it and choose whether to send it.</p>
              <div className="request-contact-line"><MessageCircle size={17} /><span>Prefer a direct conversation?</span><a href={waLink} target="_blank" rel="noreferrer">Open WhatsApp <ArrowUpRight size={14} /></a></div>
            </div>
            <LeadRequestForm />
          </div>
        </section>

        <section className="closing-band">
          <div className="site-container closing-inner">
            <div><span className="eyebrow eyebrow-light">Wazir Trading LLC · Japan</span><h2>Start with a clear conversation.</h2></div>
            <a className="button button-white" href={waLink} target="_blank" rel="noreferrer">Contact our team <ArrowUpRight size={16} /></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
