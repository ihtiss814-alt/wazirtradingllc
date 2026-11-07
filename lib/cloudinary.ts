type CloudinaryOptions = {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  crop?: "fill" | "fit" | "limit" | "scale";
  format?: "auto" | "webp" | "avif";
};

/** Build a delivery URL for a public Cloudinary asset (never an upload/signing URL). */
export function cloudinaryImageUrl(publicId: string, options: CloudinaryOptions = {}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !publicId.trim()) return null;

  const transforms = [
    `f_${options.format ?? "auto"}`,
    `q_${options.quality ?? "auto"}`,
    options.width ? `w_${Math.round(options.width)}` : null,
    options.height ? `h_${Math.round(options.height)}` : null,
    `c_${options.crop ?? "limit"}`,
  ].filter(Boolean);

  return `https://res.cloudinary.com/${encodeURIComponent(cloudName)}/image/upload/${transforms.join(",")}/${publicId
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}
