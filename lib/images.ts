/**
 * Add safe Cloudinary delivery transformations to an already-published image URL.
 * Non-Cloudinary URLs are returned unchanged. No API credentials are required
 * for delivery transformations on public Cloudinary assets.
 */
export function optimizeVehicleImage(url: string, width: number, quality: "auto" | number = "auto") {
  const marker = "/image/upload/";
  const index = url.indexOf(marker);
  if (index < 0) return url;
  const after = url.slice(index + marker.length);
  // Existing transformation segment — do not stack transformations indefinitely.
  if (/^(?:[a-z]_[^/]+,)*[a-z]_[^/]+\//i.test(after)) return url;
  const q = quality === "auto" ? "q_auto" : `q_${Math.max(1, Math.min(100, Math.round(quality)))}`;
  const transform = `f_auto,${q},w_${Math.max(120, Math.min(2400, Math.round(width)))},c_limit`;
  return `${url.slice(0, index + marker.length)}${transform}/${after}`;
}
