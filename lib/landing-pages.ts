/**
 * Curated landing-page taxonomy.
 * Keep labels and filters aligned with the values used by the Supabase `cars` table.
 * A route is not automatically indexable merely because it exists: its live
 * inventory must pass the quality threshold in lib/seo-landings.ts.
 */
export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Separate make and model slugs with a reserved delimiter to reduce collisions. */
export function modelSlugFor(make: string, model: string) {
  return `${slugify(make)}--${slugify(model)}`;
}

export type VehicleCategory = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  intro: string;
  bodyTypes?: string[];
  fuelContains?: string;
  icon: string;
  buyerChecks: string[];
};

export const VEHICLE_CATEGORIES: VehicleCategory[] = [
  {
    slug: "suvs",
    name: "Japanese SUVs and crossovers",
    shortName: "SUVs & crossovers",
    description: "Explore available Japanese SUVs and crossovers, with vehicle-level specifications and photographs.",
    intro: "SUV listings can differ in seating, drivetrain, engine, ground clearance and equipment. Compare the individual vehicle record and confirm the configuration that suits your intended use and destination rules.",
    bodyTypes: ["SUV", "Compact SUV", "Off-Road Vehicles"],
    icon: "/icons/car-bt-compact-suv.svg",
    buyerChecks: ["Confirm the exact drivetrain (2WD, 4WD or AWD) from the vehicle record.", "Compare engine size, fuel type, mileage and seating capacity.", "Check local import eligibility and any emissions or safety requirements before purchase."],
  },
  {
    slug: "sedans",
    name: "Japanese sedans",
    shortName: "Sedans",
    description: "Browse Japanese sedan listings and compare the recorded year, mileage, engine, transmission and condition details.",
    intro: "Sedans range from compact daily-use cars to larger passenger models. Use the actual dimensions, engine, equipment and condition information for each listing rather than relying on a model name alone.",
    bodyTypes: ["Sedan", "Compact Sedan"],
    icon: "/icons/car-bt-compact-sedan.svg",
    buyerChecks: ["Check engine displacement and fuel type against your budget and local rules.", "Review mileage and available auction or inspection grades.", "Confirm whether the FOB asking price includes only the vehicle at the agreed export handover point."],
  },
  {
    slug: "hatchbacks",
    name: "Japanese hatchbacks",
    shortName: "Hatchbacks",
    description: "Find available Japanese hatchbacks and compare compact vehicle options from the live inventory.",
    intro: "Hatchbacks are often considered for their compact footprint and practical cargo access. Confirm the exact model, trim, seating, transmission and vehicle condition before requesting a final quotation.",
    bodyTypes: ["Hatchback", "Compact Hatchback", "Subcompact Hatchback"],
    icon: "/icons/car-bt-compact-hatchback.svg",
    buyerChecks: ["Compare the exact variant and factory equipment.", "Check mileage, inspection information and photographs.", "Verify the model-year and vehicle-age calculation used by your importing country."],
  },
  {
    slug: "vans-and-mpvs",
    name: "Japanese vans and MPVs",
    shortName: "Vans & MPVs",
    description: "Browse Japanese van and MPV inventory for passenger, family and practical transport requirements.",
    intro: "Van and MPV configurations vary substantially. Check the seat count, door layout, dimensions, engine and whether a listing is intended for passenger or commercial use.",
    bodyTypes: ["Van", "Mini Van", "Micro Van", "MPV"],
    icon: "/icons/car-bt-micro-van.svg",
    buyerChecks: ["Confirm passenger capacity and seat configuration.", "Check vehicle dimensions and any destination registration category.", "Review the actual images and condition record for the specific unit."],
  },
  {
    slug: "pickup-trucks",
    name: "Japanese pickup trucks",
    shortName: "Pickup trucks",
    description: "Explore available Japanese pickup listings, including recorded cab and drivetrain specifications.",
    intro: "Pickup trucks can be classified differently by destination customs and registration authorities. Confirm the exact body, cab, payload and tariff classification before choosing a vehicle.",
    bodyTypes: ["Pickup Truck", "Single Cabin", "Double Cabin"],
    icon: "/icons/car-bt-double-cabin.svg",
    buyerChecks: ["Confirm single-cab or double-cab configuration.", "Check payload and vehicle classification with a local customs professional.", "Verify dimensions, drivetrain and destination import requirements."],
  },
  {
    slug: "commercial-vehicles",
    name: "Japanese commercial vehicles",
    shortName: "Commercial vehicles",
    description: "Review Japanese commercial vehicle listings and request an export quotation for the intended use and destination.",
    intro: "Commercial vehicles cover different classes and use cases. Vehicle classification, gross weight, intended use and local standards can affect import eligibility and costs, so confirm these details before purchase.",
    bodyTypes: ["Truck", "Bus"],
    icon: "/icons/car-bt-bus.svg",
    buyerChecks: ["Confirm gross vehicle weight, body and intended-use classification.", "Check any local safety, emissions, inspection and registration requirements.", "Confirm the export documents and shipping method for the specific vehicle."],
  },
  {
    slug: "station-wagons",
    name: "Japanese station wagons",
    shortName: "Station wagons",
    description: "Browse available Japanese station wagon listings and compare vehicle-level equipment and specifications.",
    intro: "Station wagons combine a passenger-car layout with an extended cargo area. Confirm the exact body type recorded for the vehicle and compare cargo, seating and drivetrain requirements.",
    bodyTypes: ["Station Wagon", "Wagon"],
    icon: "/icons/car-bt-compact-sedan.svg",
    buyerChecks: ["Review the vehicle's body style, seating and cargo configuration.", "Compare fuel, engine, transmission and mileage details.", "Check local registration and import eligibility before confirming a purchase."],
  },
  {
    slug: "hybrid-vehicles",
    name: "Japanese hybrid vehicles",
    shortName: "Hybrid vehicles",
    description: "Explore Japanese vehicles with hybrid fuel descriptions in the current inventory.",
    intro: "Hybrid descriptions can refer to different powertrain systems. Check the exact fuel description, engine details and model variant in each listing, and ask for any available battery or inspection documentation before committing.",
    fuelContains: "hybrid",
    icon: "/icons/car-bt-compact-hatchback.svg",
    buyerChecks: ["Confirm the exact hybrid system and fuel description.", "Ask what battery condition or diagnostic records are available; do not assume a test is included.", "Check destination-specific rules for hybrid or electrified vehicles."],
  },
  {
    slug: "electric-vehicles",
    name: "Japanese electric vehicles",
    shortName: "Electric vehicles",
    description: "See available Japanese electric vehicle listings where the inventory fuel field identifies an electric powertrain.",
    intro: "Electric vehicle suitability depends on battery condition, charging standards, parts support, destination infrastructure and local import rules. Review the vehicle record and request the available battery information for the specific unit.",
    fuelContains: "electric",
    icon: "/icons/car-bt-compact-hatchback.svg",
    buyerChecks: ["Request available battery health or diagnostic records for the specific unit.", "Confirm charging connector and electrical compatibility for your market.", "Check local EV import, safety, tax and registration requirements."],
  },
  {
    slug: "diesel-vehicles",
    name: "Japanese diesel vehicles",
    shortName: "Diesel vehicles",
    description: "Browse Japanese vehicle listings whose recorded fuel type includes diesel.",
    intro: "Diesel vehicles can be subject to local emissions, fuel-quality and age rules. Check the engine and emissions information available for the specific vehicle and confirm local eligibility before purchase.",
    fuelContains: "diesel",
    icon: "/icons/car-bt-single-cabin.svg",
    buyerChecks: ["Confirm the engine and emissions information available for the vehicle.", "Check destination rules for diesel vehicles and emissions standards.", "Compare mileage, service or inspection records where available."],
  },
];

export const VEHICLE_CATEGORY_BY_SLUG = new Map<string, VehicleCategory>(
  VEHICLE_CATEGORIES.map((category) => [category.slug, category] as const),
);

export type DestinationGuide = {
  slug: string;
  country: string;
  region: string;
  publicationStatus: "draft" | "published";
  serviceVerified: boolean;
  lastReviewed: string;
  description: string;
  intro: string;
  sections: Array<{ title: string; body: string[]; bullets?: string[] }>;
  sources: Array<{ label: string; url: string; publisher: string; note: string }>;
};

/**
 * Destination pages remain noindex until Wazir verifies that it can serve the
 * market and approves the local buyer guidance. Pakistan is the first editorial
 * draft because the legacy project explicitly collected Pakistan enquiries.
 * This is NOT evidence of a live shipping route or an export-service promise.
 */
export const DESTINATION_GUIDES: DestinationGuide[] = [
  {
    slug: "pakistan",
    country: "Pakistan",
    region: "South Asia",
    publicationStatus: "draft",
    serviceVerified: false,
    lastReviewed: "2026-11-07",
    description: "Official reference points and pre-purchase checks for buyers researching the import of Japanese vehicles into Pakistan.",
    intro: "Before selecting a vehicle for Pakistan, identify the import route that applies to the importer and vehicle. Pakistan's official notices distinguish commercial imports from overseas-Pakistani gift and transfer-of-residence arrangements. Those routes should not be treated as interchangeable.",
    sections: [
      {
        title: "Start with the correct import route",
        body: [
          "The Federal Board of Revenue publishes vehicle-import guidance, while the Ministry of Commerce and the Trade Information Portal publish the underlying import-policy notices and amendments. Older summaries may not reflect later amendments. Check the current official notices for the exact route before committing to a vehicle.",
          "A commercial import, a gift, and a transfer-of-residence import can have different eligibility conditions, documentation and tax treatment. An export quotation from Japan does not itself establish that a vehicle is eligible for import or registration in Pakistan.",
        ],
      },
      {
        title: "Check current notices, duties and standards",
        body: [
          "Official government indexes show that Pakistan's vehicle-import framework received further notices during 2026. The Federal Board of Revenue's active import SRO index lists SRO 1065(I)/2026 relating to regulatory duty on commercial imports of used vehicles; the Ministry of Commerce's SRO index also lists a 29 July 2026 amendment to the Import Policy Order, 2022.",
          "Do not calculate the final payable amount from a generic online summary. The applicable tariff classification, vehicle category, importer route, valuation, customs duties, regulatory duty, taxes and prescribed safety or environmental standards must be confirmed against the current law and the specific vehicle.",
        ],
      },
      {
        title: "Questions to resolve before purchase",
        body: ["Ask a licensed Pakistan customs clearing agent or the relevant government authority to verify the current position for your exact case."],
        bullets: [
          "Which legal import route applies to the buyer: commercial import, gift or transfer of residence?",
          "What eligibility conditions apply to the importer and the vehicle?",
          "What PCT/customs classification, customs value, duties and taxes apply to this vehicle?",
          "Are there current safety, environmental, inspection or certification requirements?",
          "Which export, shipping and customs documents will be required, and who will arrange each one?",
        ],
      },
      {
        title: "Confirm the Japan-side arrangements separately",
        body: [
          "Wazir Trading must confirm the specific vehicle's availability, export eligibility, sale terms, documents, shipping option and route before any order is treated as accepted. Destination import approval and local clearance remain matters for the buyer and their appointed customs professional.",
        ],
      },
    ],
    sources: [
      {
        label: "Customs Active/Operative SROs — Import",
        url: "https://www.fbr.gov.pk/Activesrosimport",
        publisher: "Federal Board of Revenue, Government of Pakistan",
        note: "Official index of current import notifications, including SRO 1065(I)/2026.",
      },
      {
        label: "SROs — Ministry of Commerce",
        url: "https://www.commerce.gov.pk/sros/",
        publisher: "Ministry of Commerce, Government of Pakistan",
        note: "Official SRO index; lists the 29 July 2026 Import Policy Order amendment.",
      },
      {
        label: "SRO 1065(I)/2026 — Regulatory duty on commercial import of vehicles",
        url: "https://www.tipp.gov.pk/site/display/751",
        publisher: "Pakistan Trade Information Portal",
        note: "Official trade-information record for the vehicle regulatory-duty notification.",
      },
      {
        label: "Import Policy Order, 2022",
        url: "https://www.tipp.gov.pk/site/display/80",
        publisher: "Pakistan Trade Information Portal",
        note: "Consolidated trade-information reference; check amendments and subsequent notifications as well.",
      },
      {
        label: "Vehicles — Import guidance",
        url: "https://www.fbr.gov.pk/vehicles/131187",
        publisher: "Federal Board of Revenue, Government of Pakistan",
        note: "General FBR guidance. Check later amendments and notifications before relying on any summary text.",
      },
    ],
  },
];

export const DESTINATION_GUIDE_BY_SLUG = new Map<string, DestinationGuide>(
  DESTINATION_GUIDES.map((guide) => [guide.slug, guide] as const),
);
