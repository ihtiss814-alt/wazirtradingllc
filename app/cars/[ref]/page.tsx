import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2, Fuel, Gauge, MapPin, Settings2, ShieldCheck, Truck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VehicleCard } from "@/components/inventory/vehicle-card";
import { VehicleGallery } from "@/components/inventory/vehicle-gallery";
import { VehicleInquiryForm } from "@/components/inventory/vehicle-inquiry-form";
import { getRelatedVehicles, getVehicleByRef } from "@/lib/inventory";
import { allowIndexing, siteConfig } from "@/lib/site";
import { breadcrumbJsonLd, formatUsd, isIndexableVehicle, safeJsonLd, vehicleDescription, vehicleImageUrls, vehicleJsonLd, vehicleName, vehicleTitle } from "@/lib/vehicle-seo";
import type { Vehicle } from "@/lib/types/inventory";
import { slugify } from "@/lib/landing-pages";
import { vehicleTypeSlugFor } from "@/lib/seo-landings";

export const revalidate = 60;

type PageProps = { params: Promise<{ ref: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ref } = await params;
  const vehicle = await getVehicleByRef(ref);
  if (!vehicle) {
    return {
      title: { absolute: "Vehicle not found | Wazir Trading LLC" },
      robots: { index: false, follow: true },
    };
  }
  const indexable = allowIndexing && isIndexableVehicle(vehicle);
  const images = vehicleImageUrls(vehicle);
  const canonical = `${siteConfig.url}/cars/${encodeURIComponent(vehicle.ref_number)}`;
  return {
    title: { absolute: vehicleTitle(vehicle) },
    description: vehicleDescription(vehicle),
    alternates: { canonical },
    robots: indexable ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } } : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      title: vehicleTitle(vehicle),
      description: vehicleDescription(vehicle),
      images: images.slice(0, 4).map((url) => ({ url, alt: `${vehicleName(vehicle)} vehicle photo` })),
    },
    twitter: {
      card: "summary_large_image",
      title: vehicleTitle(vehicle),
      description: vehicleDescription(vehicle),
      images: images.slice(0, 1),
    },
  };
}

function formatNumber(value: number | null | undefined, suffix = "") {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "Not listed";
  return `${Number(value).toLocaleString("en-US")}${suffix}`;
}

function displayFeatures(input: Vehicle["features"]) {
  const aliases: Record<string, string> = {
    ps: "Power steering", pw: "Power windows", aw: "Alloy wheels", abs: "Anti-lock brakes",
    aac: "Automatic air conditioning", navi: "Navigation", ac: "Air conditioning",
    keyless: "Keyless entry", hid: "HID headlights",
  };
  if (Array.isArray(input)) return input.map(String).map((value) => aliases[value.toLowerCase()] ?? value).filter(Boolean).slice(0, 24);
  if (input && typeof input === "object") return Object.entries(input)
    .filter(([, enabled]) => Boolean(enabled))
    .map(([key]) => aliases[key.toLowerCase()] ?? key.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()))
    .slice(0, 24);
  return [];
}

function specValue(value: string | number | null | undefined, suffix = "") {
  return value === null || value === undefined || String(value).trim() === "" ? "Not listed" : `${value}${suffix}`;
}

function gradeClass(grade: string | null | undefined) {
  if (!grade) return "vehicle-grade grade-empty";
  const first = grade.toUpperCase().charAt(0);
  if (["A", "S"].includes(first)) return "vehicle-grade grade-good";
  if (first === "B") return "vehicle-grade grade-mid";
  if (["C", "D", "R", "RA"].includes(first)) return "vehicle-grade grade-review";
  return "vehicle-grade";
}

function GradeValue({ value }: { value: string | null | undefined }) {
  return value ? <span className={gradeClass(value)}>{value}</span> : <span className="vehicle-muted-value">Not listed</span>;
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { ref } = await params;
  const vehicle = await getVehicleByRef(ref);
  if (!vehicle) notFound();
  const [related] = await Promise.all([getRelatedVehicles(vehicle)]);
  const name = vehicleName(vehicle);
  const price = formatUsd(vehicle.fob_price_usd);
  const available = vehicle.status?.toLowerCase() === "available";
  const features = displayFeatures(vehicle.features);
  const makeSlug = slugify(vehicle.make);
  const modelSlug = slugify(`${vehicle.make}-${vehicle.model}`);
  const categorySlug = vehicleTypeSlugFor(vehicle);
  const specs = [
    { label: "Model year", value: specValue(vehicle.year) , icon: CalendarDays },
    { label: "Mileage", value: formatNumber(vehicle.mileage_km, " km"), icon: Gauge },
    { label: "Engine", value: formatNumber(vehicle.engine_cc, " cc"), icon: Settings2 },
    { label: "Fuel", value: specValue(vehicle.fuel_type), icon: Fuel },
    { label: "Transmission", value: specValue(vehicle.transmission), icon: Settings2 },
    { label: "Body type", value: specValue(vehicle.body_type), icon: Truck },
  ];

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="vehicle-detail-page">
        <div className="site-container">
          <nav className="inventory-breadcrumb vehicle-detail-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/cars">Vehicle inventory</Link><span>/</span><span>{name}</span></nav>

          <div className="vehicle-detail-heading">
            <div>
              <span className="eyebrow">Vehicle reference · {vehicle.ref_number}</span>
              <h1>{name}</h1>
              {vehicle.variant ? <p className="vehicle-detail-variant">{vehicle.variant}</p> : null}
              <div className="vehicle-detail-tags">
                <span className={available ? "vehicle-status is-available" : "vehicle-status is-unavailable"}><i />{available ? "Listed as available" : vehicle.status?.toLowerCase() === "sold" ? "Sold record" : "Availability to be confirmed"}</span>
                {vehicle.stock_location ? <span><MapPin size={14} />{vehicle.stock_location}</span> : null}
                {vehicle.is_new_arrival ? <span className="vehicle-new-tag">New arrival</span> : null}
              </div>
            </div>
            <Link href="/cars" className="vehicle-back-link"><ArrowLeft size={15} /> Back to inventory</Link>
          </div>

          <div className="vehicle-detail-grid">
            <div className="vehicle-detail-primary">
              <VehicleGallery images={vehicle.car_images ?? []} vehicleName={name} />

              <section className="vehicle-detail-panel">
                <div className="vehicle-panel-heading"><div><span className="eyebrow">At a glance</span><h2>Key specifications</h2></div><span className="vehicle-panel-ref">REF {vehicle.ref_number}</span></div>
                <div className="vehicle-spec-grid">
                  {specs.map(({ label, value, icon: Icon }) => <div className="vehicle-spec-item" key={label}><span className="vehicle-spec-icon"><Icon size={17} /></span><div><small>{label}</small><strong>{value}</strong></div></div>)}
                </div>
              </section>

              <section className="vehicle-detail-panel">
                <div className="vehicle-panel-heading"><div><span className="eyebrow">Vehicle record</span><h2>Additional details</h2></div></div>
                <dl className="vehicle-detail-list">
                  {[
                    ["Reference number", vehicle.ref_number], ["Make", vehicle.make], ["Model", vehicle.model],
                    ["Variant", vehicle.variant], ["Manufacture month", vehicle.manufacture_month],
                    ["Exterior colour", vehicle.color], ["Drive", vehicle.drive], ["Steering", vehicle.steering],
                    ["Seats", vehicle.seats], ["Doors", vehicle.doors], ["Engine code", vehicle.engine_code],
                    ["Model code", vehicle.model_code],
                    ["Lot number", vehicle.lot_number], ["Stock location", vehicle.stock_location],
                    ["Port of loading", vehicle.port_of_loading], ["Shipment method", vehicle.shipment_method],
                  ].filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "").map(([label, value]) => (
                    <div key={String(label)}><dt>{label}</dt><dd>{String(value)}</dd></div>
                  ))}
                </dl>
              </section>

              {(vehicle.auction_grade || vehicle.exterior_grade || vehicle.interior_grade) ? (
                <section className="vehicle-detail-panel">
                  <div className="vehicle-panel-heading"><div><span className="eyebrow">Condition information</span><h2>Recorded grades</h2></div></div>
                  <div className="vehicle-grade-grid">
                    <div><small>Overall auction grade</small><GradeValue value={vehicle.auction_grade} /></div>
                    <div><small>Exterior grade</small><GradeValue value={vehicle.exterior_grade} /></div>
                    <div><small>Interior grade</small><GradeValue value={vehicle.interior_grade} /></div>
                  </div>
                  <p className="vehicle-panel-note">Auction and condition grades are shown as recorded in the vehicle data. Ask for the original auction sheet or supporting inspection documents where available.</p>
                </section>
              ) : null}

              {features.length ? (
                <section className="vehicle-detail-panel">
                  <div className="vehicle-panel-heading"><div><span className="eyebrow">Equipment</span><h2>Listed features</h2></div></div>
                  <ul className="vehicle-features-list">{features.map((feature) => <li key={feature}><CheckCircle2 size={15} />{feature}</li>)}</ul>
                </section>
              ) : null}

              <section className="vehicle-detail-note"><ShieldCheck size={20} /><p>Vehicle information is based on the current inventory record. Confirm availability, specifications, condition documents, sale terms and export eligibility with Wazir Trading before making a payment.</p></section>
              <nav className="seo-vehicle-taxonomy-links" aria-label="Explore related vehicle pages">
                <span>Explore more</span>
                <Link href={`/makes/${makeSlug}`}>More {vehicle.make} vehicles <ArrowUpRight size={14} /></Link>
                <Link href={`/models/${modelSlug}`}>Browse {vehicle.make} {vehicle.model} <ArrowUpRight size={14} /></Link>
                {categorySlug ? <Link href={`/vehicle-types/${categorySlug}`}>Browse {categorySlug.replace(/-/g, " ")} <ArrowUpRight size={14} /></Link> : null}
              </nav>
            </div>

            <aside className="vehicle-detail-aside">
              <div className="vehicle-price-panel">
                <span className="eyebrow">{available ? "FOB asking price" : "Last recorded FOB price"}</span>
                <strong className="vehicle-price-main">{price ?? "Request price"}</strong>
                <p>USD · {price ? (available ? "FOB price as recorded" : "Historical listing price; not a current offer") : "Price not listed"}</p>
                <div className="vehicle-price-divider" />
                <div className="vehicle-price-clarification"><ShieldCheck size={16} /><span>Freight, insurance, destination charges, taxes and import duties are not included unless specified in a written quotation.</span></div>
                {available ? <span className="vehicle-price-availability"><i /> Inventory status: available</span> : <span className="vehicle-price-unavailable">Availability must be reconfirmed</span>}
              </div>
              <VehicleInquiryForm vehicleName={name} reference={vehicle.ref_number} available={available} />
              <div className="vehicle-aside-help"><span>Need help with export terms?</span><p>Ask the team to clarify FOB terms, shipping options and the requirements for your destination before proceeding.</p><a href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Vehicle enquiry ${vehicle.ref_number}`)}`}>Email Wazir Trading <ArrowUpRight size={14} /></a></div>
            </aside>
          </div>

          {related.length ? (
            <section className="related-vehicles-section">
              <div className="inventory-heading-row"><div><span className="eyebrow">Continue exploring</span><h2>Similar vehicles</h2><p>Other currently available vehicles in the inventory.</p></div><Link href="/cars" className="inventory-reset-link">View all vehicles <ArrowUpRight size={15} /></Link></div>
              <div className="vehicle-grid vehicle-grid-related">{related.map((item) => <VehicleCard key={item.id} vehicle={item} />)}</div>
            </section>
          ) : null}
        </div>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(vehicleJsonLd(vehicle)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd(vehicle)) }} />
    </>
  );
}
