import type { Vehicle } from "@/lib/types/inventory";
import { siteConfig } from "@/lib/site";

export function isMapVehicleImage(url: string) {
  const filename = url.split("?")[0]?.split("/").pop() ?? "";
  return /_map(?:\.[^.]+)?$/i.test(filename);
}

export function vehicleName(vehicle: Vehicle) {
  return [vehicle.make, vehicle.model, vehicle.variant, vehicle.year ? String(vehicle.year) : ""]
    .filter(Boolean).join(" ").trim();
}

export function vehicleImageUrls(vehicle: Vehicle) {
  const images = (vehicle.car_images ?? [])
    .filter((image) => /^https:\/\//i.test(image.image_url ?? "") && !isMapVehicleImage(image.image_url))
    .sort((a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary))
      || (a.display_order ?? 0) - (b.display_order ?? 0));
  return [...new Set(images.map((image) => image.image_url))];
}

function trimToWordBoundary(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const clipped = value.slice(0, Math.max(1, maxLength - 1)).replace(/\s+\S*$/, "").trim();
  return `${clipped || value.slice(0, maxLength - 1).trim()}…`;
}

export function vehicleTitle(vehicle: Vehicle) {
  const reference = String(vehicle.ref_number ?? "").trim();
  const suffix = reference ? ` | ${reference} | Wazir Trading LLC` : " | Wazir Trading LLC";
  const maxNameLength = Math.max(16, 65 - suffix.length);
  const fullName = vehicleName(vehicle);
  const conciseName = [vehicle.make, vehicle.model, vehicle.year ? String(vehicle.year) : ""]
    .filter(Boolean).join(" ").trim();
  return `${trimToWordBoundary(fullName.length <= maxNameLength ? fullName : conciseName, maxNameLength)}${suffix}`;
}

export function vehicleDescription(vehicle: Vehicle) {
  const facts = [
    vehicle.mileage_km != null ? `${vehicle.mileage_km.toLocaleString("en-US")} km` : null,
    vehicle.engine_cc != null ? `${vehicle.engine_cc} cc` : null,
    vehicle.transmission,
    vehicle.fuel_type,
    vehicle.body_type,
    vehicle.color ? `${vehicle.color} exterior` : null,
  ].filter(Boolean);
  const detail = facts.length ? ` Recorded details: ${facts.join(", ")}.` : " Review the available vehicle specifications and photos. ";
  const available = vehicle.status?.toLowerCase() === "available";
  const price = vehicle.fob_price_usd && vehicle.fob_price_usd > 0
    ? available
      ? ` FOB asking price: ${formatUsd(vehicle.fob_price_usd)}.`
      : ` Last recorded FOB price: ${formatUsd(vehicle.fob_price_usd)}; not a current offer.`
    : available ? " Contact us for the current asking price." : " No current asking price is available.";
  const nextStep = available
    ? " Ask Wazir Trading about current availability and export arrangements."
    : " Ask Wazir Trading about similar available vehicles or sourcing options.";
  return `${vehicleName(vehicle)} (Ref ${vehicle.ref_number}) from Japan.${detail}${price}${nextStep}`
    .replace(/\s+/g, " ").trim().slice(0, 160);
}

export function vehicleCanonical(ref: string) {
  return `${siteConfig.url}/cars/${encodeURIComponent(ref)}`;
}

export function isIndexableVehicle(vehicle: Vehicle) {
  const hasSpec = [vehicle.variant, vehicle.mileage_km, vehicle.engine_cc, vehicle.fuel_type,
    vehicle.transmission, vehicle.body_type, vehicle.drive, vehicle.color, vehicle.auction_grade]
    .some((value) => value !== null && value !== undefined && String(value).trim() !== "");
  return Boolean(
    vehicle.ref_number && !/[\\/]/.test(vehicle.ref_number)
    && vehicle.make?.trim() && vehicle.model?.trim()
    && Number.isFinite(vehicle.year) && vehicle.status?.toLowerCase() === "available"
    && hasSpec && vehicleImageUrls(vehicle).length > 0,
  );
}

export function formatUsd(value: number | null | undefined) {
  if (value === null || value === undefined || !Number.isFinite(Number(value)) || Number(value) <= 0) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value));
}

export function vehicleJsonLd(vehicle: Vehicle) {
  const images = vehicleImageUrls(vehicle);
  const available = vehicle.status?.toLowerCase() === "available";
  const price = Number(vehicle.fob_price_usd);
  const value: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Product", "Car"],
    name: vehicleName(vehicle),
    description: vehicleDescription(vehicle),
    sku: vehicle.ref_number,
    url: vehicleCanonical(vehicle.ref_number),
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    itemCondition: "https://schema.org/UsedCondition",
    vehicleModelDate: vehicle.year ? String(vehicle.year) : undefined,
    image: images.length ? images : undefined,
    mileageFromOdometer: vehicle.mileage_km == null ? undefined : {
      "@type": "QuantitativeValue", value: vehicle.mileage_km, unitCode: "KMT",
    },
    vehicleTransmission: vehicle.transmission || undefined,
    fuelType: vehicle.fuel_type || undefined,
    bodyType: vehicle.body_type || undefined,
    color: vehicle.color || undefined,
    vehicleEngine: vehicle.engine_cc == null ? undefined : {
      "@type": "EngineSpecification",
      engineDisplacement: { "@type": "QuantitativeValue", value: vehicle.engine_cc, unitCode: "CMQ" },
    },
  };
  if (available && Number.isFinite(price) && price > 0) {
    value.offers = {
      "@type": "Offer",
      url: vehicleCanonical(vehicle.ref_number),
      priceCurrency: "USD",
      price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      description: "FOB asking price. Freight, destination charges, taxes and import duties are not included unless confirmed in a separate quotation.",
      seller: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    };
  }
  return value;
}

export function breadcrumbJsonLd(vehicle: Vehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteConfig.url}/` },
      { "@type": "ListItem", position: 2, name: "Japanese used cars", item: `${siteConfig.url}/cars` },
      { "@type": "ListItem", position: 3, name: vehicleName(vehicle), item: vehicleCanonical(vehicle.ref_number) },
    ],
  };
}

export function safeJsonLd(value: unknown) {
  return (JSON.stringify(value) ?? "null").replace(/</g, "\\u003c");
}

