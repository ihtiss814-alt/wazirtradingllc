export type VehicleImage = {
  id?: string;
  image_url: string;
  is_primary?: boolean | null;
  display_order?: number | null;
};

/** Public vehicle fields only. Private/internal identifiers are not selected. */
export type Vehicle = {
  id: string;
  ref_number: string;
  make: string;
  model: string;
  variant: string | null;
  year: number | null;
  manufacture_month: string | number | null;
  engine_cc: number | null;
  engine_code: string | null;
  model_code: string | null;
  fuel_type: string | null;
  transmission: string | null;
  body_type: string | null;
  color: string | null;
  drive: string | null;
  steering: string | null;
  seats: number | null;
  doors: number | null;
  mileage_km: number | null;
  auction_grade: string | null;
  exterior_grade: string | null;
  interior_grade: string | null;
  fob_price_usd: number | null;
  stock_location: string | null;
  port_of_loading: string | null;
  shipment_method: string | null;
  status: string | null;
  collection: string | null;
  is_featured: boolean | null;
  is_new_arrival: boolean | null;
  features: Record<string, unknown> | string[] | null;
  lot_number: string | number | null;
  created_at: string | null;
  updated_at: string | null;
  car_images: VehicleImage[] | null;
};

export type InventoryFilters = {
  q: string;
  make: string;
  body: string;
  fuel: string;
  transmission: string;
  drive: string;
  yearFrom: string;
  yearTo: string;
  priceMin: string;
  priceMax: string;
  sort: string;
  page: number;
};

export type InventoryOption = { value: string; count: number };

export const INVENTORY_PAGE_SIZE = 12;
