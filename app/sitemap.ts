import type { MetadataRoute } from "next";
import { getIndexableVehicleRefs } from "@/lib/inventory";
import { DESTINATION_GUIDES, VEHICLE_CATEGORIES } from "@/lib/landing-pages";
import { getAvailableTaxonomy, getLandingInventory, MIN_INDEXABLE_LANDING_VEHICLES } from "@/lib/seo-landings";
import { allowIndexing, siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!allowIndexing) return [];
  const now = new Date();
  const [vehicles, taxonomy, categoryResults] = await Promise.all([
    getIndexableVehicleRefs(),
    getAvailableTaxonomy(),
    Promise.all(VEHICLE_CATEGORIES.map(async (category) => ({
      slug: category.slug,
      eligibleCount: (await getLandingInventory({ bodyTypes: category.bodyTypes, fuelContains: category.fuelContains })).eligibleCount,
    }))),
  ]);

  const candidateMakes = taxonomy.error ? [] : taxonomy.makes.filter((item) => item.eligibleCount >= MIN_INDEXABLE_LANDING_VEHICLES);
  const candidateModels = taxonomy.error ? [] : taxonomy.models.filter((item) => item.eligibleCount >= MIN_INDEXABLE_LANDING_VEHICLES);
  const eligibleMakes: typeof candidateMakes = [];
  const eligibleModels: typeof candidateModels = [];
  // Check the same image/spec quality threshold used by make/model page metadata.
  // Batch requests to avoid opening hundreds of Supabase requests at once.
  for (let index = 0; index < candidateMakes.length; index += 10) {
    const batch = candidateMakes.slice(index, index + 10);
    const checks = await Promise.all(batch.map(async (make) => ({
      make,
      result: await getLandingInventory({ make: make.name }),
    })));
    for (const check of checks) if (!check.result.error && check.result.eligibleCount >= MIN_INDEXABLE_LANDING_VEHICLES) eligibleMakes.push(check.make);
  }
  for (let index = 0; index < candidateModels.length; index += 10) {
    const batch = candidateModels.slice(index, index + 10);
    const checks = await Promise.all(batch.map(async (model) => ({
      model,
      result: await getLandingInventory({ make: model.make, model: model.model }),
    })));
    for (const check of checks) if (!check.result.error && check.result.eligibleCount >= MIN_INDEXABLE_LANDING_VEHICLES) eligibleModels.push(check.model);
  }
  const eligibleCategories = categoryResults.filter((item) => item.eligibleCount >= MIN_INDEXABLE_LANDING_VEHICLES);
  const destinations = DESTINATION_GUIDES.filter((item) => item.publicationStatus === "published" && item.serviceVerified && item.sources.length >= 2);

  const pages: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/cars`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteConfig.url}/how-it-works`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${siteConfig.url}/shipping-information`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/payment-information`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteConfig.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  if (!taxonomy.error && !taxonomy.truncated && eligibleMakes.length >= 4) {
    pages.push({ url: `${siteConfig.url}/makes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
  }
  if (eligibleCategories.length >= 4) {
    pages.push({ url: `${siteConfig.url}/vehicle-types`, lastModified: now, changeFrequency: "weekly", priority: 0.8 });
  }
  if (destinations.length >= 3) {
    pages.push({ url: `${siteConfig.url}/import-japanese-cars`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  }

  pages.push(
    ...eligibleMakes.map((make) => ({
      url: `${siteConfig.url}/makes/${make.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
    ...eligibleModels.map((model) => ({
      url: `${siteConfig.url}/models/${model.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...eligibleCategories.map((category) => ({
      url: `${siteConfig.url}/vehicle-types/${category.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.75,
    })),
    ...destinations.map((destination) => ({
      url: `${siteConfig.url}/import-japanese-cars/${destination.slug}`,
      lastModified: new Date(`${destination.lastReviewed}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...vehicles.map((vehicle) => ({
      url: `${siteConfig.url}/cars/${encodeURIComponent(vehicle.ref_number)}`,
      ...(vehicle.updated_at ? { lastModified: new Date(vehicle.updated_at) } : {}),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  );

  return pages;
}
