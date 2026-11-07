import { unstable_cache } from "next/cache";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import { isIndexableVehicle } from "@/lib/vehicle-seo";
import type { Vehicle } from "@/lib/types/inventory";
import { modelSlugFor, slugify } from "@/lib/landing-pages";
import { siteConfig } from "@/lib/site";

const LANDING_SELECT = [
  "id", "ref_number", "make", "model", "variant", "year", "manufacture_month",
  "engine_cc", "engine_code", "model_code", "fuel_type", "transmission", "body_type",
  "color", "drive", "steering", "seats", "doors", "mileage_km", "auction_grade",
  "exterior_grade", "interior_grade", "fob_price_usd", "stock_location", "port_of_loading",
  "shipment_method", "status", "collection", "is_featured", "is_new_arrival", "features",
  "lot_number", "created_at", "updated_at", "car_images(image_url,is_primary,display_order)",
].join(",");

export const MIN_INDEXABLE_LANDING_VEHICLES = 4;
export const LANDING_CARD_LIMIT = 12;

type LandingFilter = {
  make?: string;
  model?: string;
  bodyTypes?: string[];
  fuelContains?: string;
};

export type LandingInventory = {
  vehicles: Vehicle[];
  matchedCount: number;
  eligibleCount: number;
  error: boolean;
};

const cachedLandingInventory = unstable_cache(
  async (filter: LandingFilter): Promise<LandingInventory> => {
    const supabase = createPublicServerClient();
    if (!supabase) return { vehicles: [], matchedCount: 0, eligibleCount: 0, error: true };
    try {
      const eligible: Vehicle[] = [];
      let matchedCount = 0;
      const batchSize = 200;
      const scanLimit = 3_000;
      for (let from = 0; from < scanLimit && eligible.length < LANDING_CARD_LIMIT; from += batchSize) {
        let query = supabase
          .from("cars")
          .select(LANDING_SELECT, { count: "exact" })
          .eq("status", "available");
        if (filter.make) query = query.ilike("make", filter.make);
        if (filter.model) query = query.ilike("model", filter.model);
        if (filter.bodyTypes?.length) query = query.in("body_type", filter.bodyTypes);
        if (filter.fuelContains) query = query.ilike("fuel_type", `%${filter.fuelContains}%`);
        const { data, count, error } = await query
          .order("created_at", { ascending: false, nullsFirst: false })
          .order("id", { ascending: true })
          .range(from, from + batchSize - 1);
        if (error) throw error;
        if (from === 0) matchedCount = count ?? 0;
        const batch = ((data ?? []) as unknown as Vehicle[]).filter(isIndexableVehicle);
        eligible.push(...batch);
        if (!data || data.length < batchSize) break;
      }
      return {
        vehicles: eligible.slice(0, LANDING_CARD_LIMIT),
        matchedCount,
        eligibleCount: eligible.length,
        error: false,
      };
    } catch (error) {
      console.error("SEO landing inventory query failed:", error);
      return { vehicles: [], matchedCount: 0, eligibleCount: 0, error: true };
    }
  },
  ["wazir-seo-landing-inventory-v1"],
  { revalidate: 180, tags: ["inventory"] },
);

export function getLandingInventory(filter: LandingFilter) {
  return cachedLandingInventory(filter);
}

export type MakeOption = { name: string; slug: string; count: number; eligibleCount: number };
export type ModelOption = { make: string; model: string; slug: string; count: number; eligibleCount: number };
export type TaxonomySnapshot = { makes: MakeOption[]; models: ModelOption[]; error: boolean; truncated: boolean };

type TaxonomyRow = {
  ref_number: string | null;
  make: string | null;
  model: string | null;
  year: number | string | null;
  variant: string | null;
  mileage_km: number | null;
  engine_cc: number | null;
  fuel_type: string | null;
  transmission: string | null;
  body_type: string | null;
  drive: string | null;
  color: string | null;
  auction_grade: string | null;
  car_images: Array<{ image_url: string | null }> | null;
};

function rowCanSupportLanding(row: TaxonomyRow) {
  const hasIdentity = Boolean(row.ref_number?.trim() && !/[\\/]/.test(row.ref_number) && row.make?.trim() && row.model?.trim() && row.year !== null && row.year !== undefined && Number.isFinite(Number(row.year)));
  const imageUrls = (row.car_images ?? []).map((image) => image.image_url ?? "");
  const hasPhoto = imageUrls.some((url) => /^https:\/\//i.test(url) && !/_map(?:\.[^.]+)?(?:\?.*)?$/i.test(url.split("/").pop() ?? ""));
  const hasDetail = [row.variant, row.mileage_km, row.engine_cc, row.fuel_type, row.transmission, row.body_type, row.drive, row.color, row.auction_grade]
    .some((value) => value !== null && value !== undefined && String(value).trim() !== "");
  return hasIdentity && hasPhoto && hasDetail;
}

const cachedTaxonomy = unstable_cache(
  async (): Promise<TaxonomySnapshot> => {
    const supabase = createPublicServerClient();
    if (!supabase) return { makes: [], models: [], error: true, truncated: false };
    try {
      const rows: TaxonomyRow[] = [];
      const batchSize = 1000;
      const maxRows = 30_000;
      for (let from = 0; from < maxRows; from += batchSize) {
        const { data, error } = await supabase
          .from("cars")
          .select("ref_number,make,model,year,variant,mileage_km,engine_cc,fuel_type,transmission,body_type,drive,color,auction_grade,car_images(image_url)")
          .eq("status", "available")
          .order("make", { ascending: true })
          .range(from, from + batchSize - 1);
        if (error) throw error;
        rows.push(...((data ?? []) as unknown as TaxonomyRow[]));
        if (!data || data.length < batchSize) break;
      }
      const truncated = rows.length === maxRows;
      const makeGroups = new Map<string, { name: string; count: number; eligibleCount: number }>();
      const modelGroups = new Map<string, { make: string; model: string; count: number; eligibleCount: number }>();
      for (const row of rows) {
        const make = row.make?.trim() ?? "";
        const model = row.model?.trim() ?? "";
        if (!make || !model) continue;
        const makeKey = make.toLocaleLowerCase("en");
        const modelKey = `${makeKey}|${model.toLocaleLowerCase("en")}`;
        const eligible = rowCanSupportLanding(row);
        const makeGroup = makeGroups.get(makeKey) ?? { name: make, count: 0, eligibleCount: 0 };
        makeGroup.count += 1;
        if (eligible) makeGroup.eligibleCount += 1;
        makeGroups.set(makeKey, makeGroup);
        const modelGroup = modelGroups.get(modelKey) ?? { make, model, count: 0, eligibleCount: 0 };
        modelGroup.count += 1;
        if (eligible) modelGroup.eligibleCount += 1;
        modelGroups.set(modelKey, modelGroup);
      }
      const makes = [...makeGroups.values()]
        .map((item) => ({ ...item, slug: slugify(item.name) }))
        .sort((a, b) => b.eligibleCount - a.eligibleCount || a.name.localeCompare(b.name));
      const models = [...modelGroups.values()]
        .map((item) => ({ ...item, slug: modelSlugFor(item.make, item.model) }))
        .sort((a, b) => b.eligibleCount - a.eligibleCount || a.make.localeCompare(b.make) || a.model.localeCompare(b.model));
      return { makes, models, error: false, truncated };
    } catch (error) {
      console.error("SEO landing taxonomy query failed:", error);
      return { makes: [], models: [], error: true, truncated: false };
    }
  },
  ["wazir-seo-landing-taxonomy-v1"],
  { revalidate: 600, tags: ["inventory"] },
);

export function getAvailableTaxonomy() {
  return cachedTaxonomy();
}

export function collectionPageJsonLd(input: {
  name: string;
  description: string;
  url: string;
  vehicles: Vehicle[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: input.url,
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: input.vehicles.length,
      itemListElement: input.vehicles.map((vehicle, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteConfig.url}/cars/${encodeURIComponent(vehicle.ref_number)}`,
        name: [vehicle.make, vehicle.model, vehicle.variant, vehicle.year].filter(Boolean).join(" "),
      })),
    },
  };
}

export function taxonomyIsIndexable(eligibleCount: number) {
  return eligibleCount >= MIN_INDEXABLE_LANDING_VEHICLES;
}

export function vehicleTypeSlugFor(vehicle: Vehicle) {
  const body = (vehicle.body_type ?? "").toLowerCase();
  const fuel = (vehicle.fuel_type ?? "").toLowerCase();
  if (fuel.includes("hybrid")) return "hybrid-vehicles";
  if (fuel.includes("electric")) return "electric-vehicles";
  if (fuel.includes("diesel")) return "diesel-vehicles";
  if (["suv", "compact suv", "off-road vehicles"].includes(body)) return "suvs";
  if (["sedan", "compact sedan"].includes(body)) return "sedans";
  if (["hatchback", "compact hatchback", "subcompact hatchback"].includes(body)) return "hatchbacks";
  if (["van", "mini van", "micro van", "mpv"].includes(body)) return "vans-and-mpvs";
  if (["pickup truck", "single cabin", "double cabin"].includes(body)) return "pickup-trucks";
  if (["truck", "bus"].includes(body)) return "commercial-vehicles";
  if (["station wagon", "wagon"].includes(body)) return "station-wagons";
  return null;
}
