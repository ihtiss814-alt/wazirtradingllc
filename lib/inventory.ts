import { unstable_cache } from "next/cache";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import type { InventoryFilters, InventoryOption, Vehicle } from "@/lib/types/inventory";
import { INVENTORY_PAGE_SIZE } from "@/lib/types/inventory";
import { vehicleImageUrls } from "@/lib/vehicle-seo";

// Explicit select lists prevent internal columns from leaking through `select('*')`.
const LIST_SELECT = [
  "id", "ref_number", "make", "model", "variant", "year", "engine_cc",
  "fuel_type", "transmission", "body_type", "color", "drive", "steering",
  "seats", "doors", "mileage_km", "auction_grade", "fob_price_usd",
  "stock_location", "port_of_loading", "shipment_method", "status", "collection",
  "is_featured", "is_new_arrival", "created_at",
  "car_images(image_url,is_primary,display_order)",
].join(",");

const DETAIL_SELECT = [
  "id", "ref_number", "make", "model", "variant", "year", "manufacture_month",
  "engine_cc", "engine_code", "model_code", "fuel_type", "transmission", "body_type",
  "color", "drive", "steering", "seats", "doors", "mileage_km", "auction_grade",
  "exterior_grade", "interior_grade", "fob_price_usd", "stock_location",
  "port_of_loading", "shipment_method", "status", "collection", "is_featured",
  "is_new_arrival", "features", "lot_number", "created_at", "updated_at",
  "car_images(image_url,is_primary,display_order)",
].join(",");

function cleanSearchTerm(input: string) {
  return input
    .normalize("NFKC")
    .replace(/[(),.%_*\\]/g, " ")
    .replace(/[^\p{L}\p{N}\s+\-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function safeNumber(value: string, minimum = 0, maximum = 1_000_000) {
  if (!value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= minimum && number <= maximum ? number : null;
}

function cleanExactText(input: string, max = 80) {
  return input.trim().replace(/[\u0000-\u001f]/g, "").slice(0, max);
}

export function parseInventoryFilters(params: Record<string, string | string[] | undefined>): InventoryFilters {
  const get = (key: string) => typeof params[key] === "string" ? params[key] as string : "";
  const parsedPage = Number.parseInt(get("page") || "1", 10);
  return {
    q: cleanSearchTerm(get("q")),
    make: cleanExactText(get("make")),
    body: cleanExactText(get("body")),
    fuel: cleanExactText(get("fuel")),
    transmission: cleanExactText(get("transmission")),
    drive: cleanExactText(get("drive")),
    yearFrom: String(safeNumber(get("yearFrom"), 1950, 2100) ?? ""),
    yearTo: String(safeNumber(get("yearTo"), 1950, 2100) ?? ""),
    priceMin: String(safeNumber(get("priceMin"), 0, 100_000_000) ?? ""),
    priceMax: String(safeNumber(get("priceMax"), 0, 100_000_000) ?? ""),
    sort: ["newest", "price_asc", "price_desc", "year_desc", "mileage_asc"].includes(get("sort")) ? get("sort") : "newest",
    page: Number.isFinite(parsedPage) ? Math.min(10_000, Math.max(1, parsedPage)) : 1,
  };
}

type PublicSupabaseClient = NonNullable<ReturnType<typeof createPublicServerClient>>;

function createAvailableCarsQuery(supabase: PublicSupabaseClient) {
  return supabase
    .from("cars")
    .select(LIST_SELECT, { count: "exact" })
    .eq("status", "available");
}

type AvailableCarsQuery = ReturnType<typeof createAvailableCarsQuery>;

function applyFilters(query: AvailableCarsQuery, filters: InventoryFilters) {
  if (filters.q) {
    // Match each search word against any public vehicle field. This supports
    // combined searches such as "Toyota Aqua 2021" without a full-text schema.
    const terms = filters.q.split(/\s+/).filter(Boolean).slice(0, 6);
    for (const term of terms) {
      const like = `%${term}%`;
      const conditions = [
        `make.ilike.${like}`,
        `model.ilike.${like}`,
        `variant.ilike.${like}`,
        `ref_number.ilike.${like}`,
        `body_type.ilike.${like}`,
        `fuel_type.ilike.${like}`,
        `transmission.ilike.${like}`,
        `color.ilike.${like}`,
      ];
      if (/^\d{4}$/.test(term)) conditions.push(`year.eq.${term}`);
      query = query.or(conditions.join(","));
    }
  }
  if (filters.make) query = query.ilike("make", filters.make);
  if (filters.body) query = query.ilike("body_type", filters.body);
  if (filters.fuel) query = query.ilike("fuel_type", filters.fuel);
  if (filters.transmission) query = query.ilike("transmission", filters.transmission);
  if (filters.drive) query = query.ilike("drive", filters.drive);

  const yearFrom = safeNumber(filters.yearFrom, 1950, 2100);
  const yearTo = safeNumber(filters.yearTo, 1950, 2100);
  const priceMin = safeNumber(filters.priceMin, 0, 100_000_000);
  const priceMax = safeNumber(filters.priceMax, 0, 100_000_000);
  if (yearFrom !== null) query = query.gte("year", yearFrom);
  if (yearTo !== null) query = query.lte("year", yearTo);
  if (priceMin !== null) query = query.gte("fob_price_usd", priceMin);
  if (priceMax !== null) query = query.lte("fob_price_usd", priceMax);

  switch (filters.sort) {
    case "price_asc": query = query.order("fob_price_usd", { ascending: true, nullsFirst: false }); break;
    case "price_desc": query = query.order("fob_price_usd", { ascending: false, nullsFirst: false }); break;
    case "year_desc": query = query.order("year", { ascending: false, nullsFirst: false }); break;
    case "mileage_asc": query = query.order("mileage_km", { ascending: true, nullsFirst: false }); break;
    default: query = query.order("created_at", { ascending: false, nullsFirst: false });
  }
  return query;
}

type InventoryResult = {
  cars: Vehicle[];
  totalCount: number;
  error: boolean;
};

const cachedInventory = unstable_cache(
  async (filters: InventoryFilters): Promise<InventoryResult> => {
    const supabase = createPublicServerClient();
    if (!supabase) return { cars: [], totalCount: 0, error: true };
    try {
      const from = (filters.page - 1) * INVENTORY_PAGE_SIZE;
      let query = createAvailableCarsQuery(supabase);
      query = applyFilters(query, filters);
      const { data, count, error } = await query.range(from, from + INVENTORY_PAGE_SIZE - 1);
      if (error) throw error;
      return { cars: (data ?? []) as unknown as Vehicle[], totalCount: count ?? 0, error: false };
    } catch (error) {
      console.error("Public inventory query failed:", error);
      return { cars: [], totalCount: 0, error: true };
    }
  },
  ["wazir-public-inventory-v2"],
  { revalidate: 60, tags: ["inventory"] },
);

export async function getInventoryPage(filters: InventoryFilters) {
  return cachedInventory(filters);
}

const cachedFeatured = unstable_cache(
  async (): Promise<Vehicle[]> => {
    const supabase = createPublicServerClient();
    if (!supabase) return [];
    try {
      const selections = [
        supabase.from("cars").select(LIST_SELECT).eq("status", "available").eq("is_featured", true).order("created_at", { ascending: false }).limit(16),
        supabase.from("cars").select(LIST_SELECT).eq("status", "available").eq("is_new_arrival", true).order("created_at", { ascending: false }).limit(16),
        supabase.from("cars").select(LIST_SELECT).eq("status", "available").order("created_at", { ascending: false }).limit(16),
      ];
      const resultSets = await Promise.all(selections);
      const ids = new Set<string>();
      const selected: Vehicle[] = [];
      for (const result of resultSets) {
        if (result.error) continue;
        for (const row of result.data ?? []) {
          const vehicle = row as unknown as Vehicle;
          const hasPhoto = vehicleImageUrls(vehicle).length > 0;
          if (hasPhoto && !ids.has(vehicle.id)) {
            ids.add(vehicle.id);
            selected.push(vehicle);
          }
          if (selected.length === 4) return selected;
        }
      }
      return selected;
    } catch (error) {
      console.error("Featured vehicle query failed:", error);
      return [];
    }
  },
  ["wazir-home-featured-vehicles-v2"],
  { revalidate: 60, tags: ["inventory"] },
);

export async function getFeaturedVehicles() {
  return cachedFeatured();
}

const cachedFacets = unstable_cache(
  async (): Promise<{ makes: InventoryOption[]; bodies: InventoryOption[]; fuels: InventoryOption[]; transmissions: InventoryOption[] }> => {
    const supabase = createPublicServerClient();
    if (!supabase) return { makes: [], bodies: [], fuels: [], transmissions: [] };
    try {
      const allRows: Array<{ make: string | null; body_type: string | null; fuel_type: string | null; transmission: string | null }> = [];
      const batchSize = 1000;
      for (let from = 0; from < 5000; from += batchSize) {
        const { data, error } = await supabase
          .from("cars")
          .select("make,body_type,fuel_type,transmission")
          .eq("status", "available")
          .range(from, from + batchSize - 1);
        if (error) throw error;
        allRows.push(...((data ?? []) as unknown as SitemapVehicleRow[]));
        if (!data || data.length < batchSize) break;
      }
      const data = allRows;
      const countValues = (field: "make" | "body_type" | "fuel_type" | "transmission") => {
        const counts = new Map<string, number>();
        for (const row of data ?? []) {
          const raw = row[field];
          const value = typeof raw === "string" ? raw.trim() : "";
          if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
        }
        return [...counts.entries()]
          .map(([value, count]) => ({ value, count }))
          .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
      };
      return {
        makes: countValues("make"),
        bodies: countValues("body_type"),
        fuels: countValues("fuel_type"),
        transmissions: countValues("transmission"),
      };
    } catch (error) {
      console.error("Inventory facet query failed:", error);
      return { makes: [], bodies: [], fuels: [], transmissions: [] };
    }
  },
  ["wazir-inventory-facets-v2"],
  { revalidate: 300, tags: ["inventory"] },
);

export async function getInventoryFacets() {
  return cachedFacets();
}

const cachedVehicle = unstable_cache(
  async (ref: string): Promise<Vehicle | null> => {
    const supabase = createPublicServerClient();
    if (!supabase || !ref || ref.length > 100 || /[\\/]/.test(ref)) return null;
    try {
      const { data, error } = await supabase
        .from("cars")
        .select(DETAIL_SELECT)
        .eq("ref_number", ref)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as Vehicle | null;
    } catch (error) {
      // Do not turn a transient database outage into a false 404. Let Next.js
      // return an error response so search engines can retry the vehicle URL.
      console.error("Vehicle detail query failed:", error);
      throw error;
    }
  },
  ["wazir-public-vehicle-detail-v2"],
  { revalidate: 60, tags: ["inventory"] },
);

export async function getVehicleByRef(ref: string) {
  return cachedVehicle(ref);
}

const cachedRelated = unstable_cache(
  async (make: string, model: string, body: string, excludedId: string): Promise<Vehicle[]> => {
    const supabase = createPublicServerClient();
    if (!supabase) return [];
    try {
      const queries = await Promise.all([
        supabase.from("cars").select(LIST_SELECT).eq("status", "available").ilike("make", make).ilike("model", model).neq("id", excludedId).order("created_at", { ascending: false }).limit(8),
        supabase.from("cars").select(LIST_SELECT).eq("status", "available").ilike("make", make).neq("id", excludedId).order("created_at", { ascending: false }).limit(12),
        ...(body ? [supabase.from("cars").select(LIST_SELECT).eq("status", "available").ilike("body_type", body).neq("id", excludedId).order("created_at", { ascending: false }).limit(12)] : []),
      ]);
      const unique = new Map<string, Vehicle>();
      for (const result of queries) {
        if (result.error) continue;
        for (const row of result.data ?? []) {
          const vehicle = row as unknown as Vehicle;
          const hasPhoto = vehicleImageUrls(vehicle).length > 0;
          if (hasPhoto && vehicle.ref_number && !unique.has(vehicle.ref_number)) unique.set(vehicle.ref_number, vehicle);
        }
      }
      return [...unique.values()].slice(0, 4);
    } catch (error) {
      console.error("Related vehicle query failed:", error);
      return [];
    }
  },
  ["wazir-related-vehicles-v2"],
  { revalidate: 120, tags: ["inventory"] },
);

export async function getRelatedVehicles(vehicle: Vehicle) {
  return cachedRelated(vehicle.make, vehicle.model, vehicle.body_type ?? "", vehicle.id);
}

type SitemapImageRow = {
  image_url: string | null;
};

type SitemapVehicleRow = {
  ref_number: string | null;
  make: string | null;
  model: string | null;
  year: number | string | null;
  variant: string | null;
  mileage_km: number | string | null;
  engine_cc: number | string | null;
  fuel_type: string | null;
  transmission: string | null;
  body_type: string | null;
  drive: string | null;
  color: string | null;
  auction_grade: string | null;
  updated_at: string | null;
  car_images: SitemapImageRow[] | null;
};

const cachedSitemapRefs = unstable_cache(
  async (): Promise<Array<{ ref_number: string; updated_at: string | null }>> => {
    const supabase = createPublicServerClient();
    if (!supabase) return [];
    try {
      const allRows: SitemapVehicleRow[] = [];
      const batchSize = 1000;
      for (let from = 0; from < 5000; from += batchSize) {
        const { data, error } = await supabase
          .from("cars")
          .select("ref_number,make,model,year,variant,mileage_km,engine_cc,fuel_type,transmission,body_type,drive,color,auction_grade,updated_at,car_images(image_url,is_primary,display_order)")
          .eq("status", "available")
          .order("updated_at", { ascending: false, nullsFirst: false })
          .range(from, from + batchSize - 1);
        if (error) throw error;
        allRows.push(...((data ?? []) as unknown as SitemapVehicleRow[]));
        if (!data || data.length < batchSize) break;
      }
      return allRows.filter((row) => {
        const image = Array.isArray(row.car_images) && row.car_images.some((item) => {
          const imageUrl = typeof item.image_url === "string" ? item.image_url : "";
          const filename = imageUrl.split("/").pop() ?? "";
          return /^https:\/\//i.test(imageUrl) && !/_map(?:\.[^.]+)?(?:\?.*)?$/i.test(filename);
        });
        const meaningfulValues: Array<string | number | null> = [
          row.variant,
          row.mileage_km,
          row.engine_cc,
          row.fuel_type,
          row.transmission,
          row.body_type,
          row.drive,
          row.color,
          row.auction_grade,
        ];
        const meaningful = meaningfulValues.some((value) => value !== null && String(value).trim() !== "");
        return Boolean(
          row.ref_number
          && !/[\\/]/.test(row.ref_number)
          && row.make
          && row.model
          && row.year !== null
          && Number.isFinite(Number(row.year))
          && image
          && meaningful,
        );
      }).map((row) => ({ ref_number: String(row.ref_number), updated_at: row.updated_at ?? null }));
    } catch (error) {
      console.error("Vehicle sitemap query failed:", error);
      return [];
    }
  },
  ["wazir-vehicle-sitemap-v2"],
  { revalidate: 600, tags: ["inventory"] },
);

export async function getIndexableVehicleRefs() {
  return cachedSitemapRefs();
}
