import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gauge, Fuel, Settings2, CalendarDays, ImageOff } from "lucide-react";
import type { Vehicle } from "@/lib/types/inventory";
import { formatUsd, vehicleImageUrls, vehicleName } from "@/lib/vehicle-seo";
import { optimizeVehicleImage } from "@/lib/images";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const image = vehicleImageUrls(vehicle)[0];
  const price = formatUsd(vehicle.fob_price_usd);
  return (
    <article className="vehicle-card">
      <Link className="vehicle-card-image" href={`/cars/${encodeURIComponent(vehicle.ref_number)}`} aria-label={`View ${vehicleName(vehicle)}`}>
        {image ? (
          <Image src={optimizeVehicleImage(image, 720)} alt={`${vehicleName(vehicle)} — vehicle photo`} fill sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 25vw" unoptimized />
        ) : (
          <span className="vehicle-card-placeholder"><ImageOff size={28} /><small>Photos unavailable</small></span>
        )}
        {vehicle.is_new_arrival ? <span className="vehicle-card-badge">New arrival</span> : null}
        <span className="vehicle-card-ref">REF {vehicle.ref_number}</span>
      </Link>
      <div className="vehicle-card-body">
        <div className="vehicle-card-title-row">
          <div>
            <p className="vehicle-card-kicker">{vehicle.stock_location || "Japan stock"}</p>
            <h3><Link href={`/cars/${encodeURIComponent(vehicle.ref_number)}`}>{vehicleName(vehicle)}</Link></h3>
          </div>
          <Link className="vehicle-card-open" href={`/cars/${encodeURIComponent(vehicle.ref_number)}`} aria-label={`Open ${vehicleName(vehicle)}`}><ArrowUpRight size={18} /></Link>
        </div>
        <div className="vehicle-card-specs">
          {vehicle.year ? <span><CalendarDays size={14} />{vehicle.year}</span> : null}
          {vehicle.mileage_km != null ? <span><Gauge size={14} />{vehicle.mileage_km.toLocaleString("en-US")} km</span> : null}
          {vehicle.engine_cc != null ? <span>{vehicle.engine_cc.toLocaleString("en-US")} cc</span> : null}
          {vehicle.transmission ? <span><Settings2 size={14} />{vehicle.transmission}</span> : null}
          {vehicle.fuel_type ? <span><Fuel size={14} />{vehicle.fuel_type}</span> : null}
        </div>
        <div className="vehicle-card-footer">
          <div>
            <span className="vehicle-price-label">FOB asking price</span>
            <strong>{price ?? "Request price"}</strong>
          </div>
          <Link href={`/cars/${encodeURIComponent(vehicle.ref_number)}`} className="vehicle-card-link">View details <ArrowUpRight size={14} /></Link>
        </div>
      </div>
    </article>
  );
}
