"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, Expand, Images, X } from "lucide-react";
import type { VehicleImage } from "@/lib/types/inventory";
import { optimizeVehicleImage } from "@/lib/images";
import { isMapVehicleImage } from "@/lib/vehicle-seo";

export function VehicleGallery({ images, vehicleName }: { images: VehicleImage[]; vehicleName: string }) {
  const sorted = useMemo(() => [...images]
    .filter((image) => /^https:\/\//i.test(image.image_url ?? ""))
    .sort((a, b) => Number(Boolean(b.is_primary)) - Number(Boolean(a.is_primary))
      || (a.display_order ?? 0) - (b.display_order ?? 0)), [images]);
  const galleryImages = sorted.filter((image) => !isMapVehicleImage(image.image_url));
  const inspectionMap = sorted.find((image) => isMapVehicleImage(image.image_url));
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const galleryImageCount = galleryImages.length;
  const current = galleryImages[active];

  // Depend on a stable primitive rather than reading a property expression in
  // the dependency array. This keeps React Compiler's memoization analysis clear.
  const previous = useCallback(
    () => setActive((index) => (index - 1 + galleryImageCount) % galleryImageCount),
    [galleryImageCount],
  );
  const next = useCallback(
    () => setActive((index) => (index + 1) % galleryImageCount),
    [galleryImageCount],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, previous, next]);

  if (galleryImages.length === 0) {
    return (
      <div className="vehicle-gallery-empty">
        <Camera size={40} strokeWidth={1.2} />
        <strong>{vehicleName}</strong>
        <span>Vehicle photographs are not currently available.</span>
      </div>
    );
  }

  return (
    <div className="vehicle-gallery">
      <div className="vehicle-gallery-main">
        <Image key={current.image_url} src={optimizeVehicleImage(current.image_url, 1800)} alt={`${vehicleName} — vehicle photograph ${active + 1}`} fill priority unoptimized sizes="(max-width: 900px) 100vw, 62vw" />
        <span className="vehicle-gallery-count"><Images size={14} /> {active + 1} / {galleryImages.length}</span>
        {galleryImages.length > 1 ? (
          <>
            <button className="vehicle-gallery-arrow is-left" type="button" aria-label="Previous photo" onClick={previous}><ChevronLeft size={22} /></button>
            <button className="vehicle-gallery-arrow is-right" type="button" aria-label="Next photo" onClick={next}><ChevronRight size={22} /></button>
          </>
        ) : null}
        <button className="vehicle-gallery-expand" type="button" onClick={() => setLightbox(true)}><Expand size={15} /> View full size</button>
      </div>
      {galleryImages.length > 1 ? (
        <div className="vehicle-gallery-thumbs" aria-label="Choose a vehicle photograph">
          {galleryImages.map((image, index) => (
            <button key={`${image.image_url}-${index}`} type="button" className={index === active ? "is-active" : ""} onClick={() => setActive(index)} aria-label={`Show photograph ${index + 1}`} aria-pressed={index === active}>
              <Image src={optimizeVehicleImage(image.image_url, 260)} alt="" fill unoptimized sizes="90px" />
            </button>
          ))}
        </div>
      ) : null}
      {inspectionMap ? (
        <details className="vehicle-inspection-map">
          <summary>View auction inspection map</summary>
          <div className="vehicle-inspection-map-image">
            <Image src={optimizeVehicleImage(inspectionMap.image_url, 1400)} alt={`${vehicleName} auction inspection map`} fill unoptimized sizes="(max-width: 900px) 100vw, 62vw" />
          </div>
        </details>
      ) : null}
      {lightbox ? (
        <div className="vehicle-lightbox" role="dialog" aria-modal="true" aria-label={`${vehicleName} photo viewer`} onClick={() => setLightbox(false)}>
          <button type="button" className="vehicle-lightbox-close" aria-label="Close photo viewer" onClick={() => setLightbox(false)}><X size={25} /></button>
          {galleryImages.length > 1 ? <button type="button" className="vehicle-lightbox-arrow left" aria-label="Previous photo" onClick={(event) => { event.stopPropagation(); previous(); }}><ChevronLeft size={30} /></button> : null}
          <div className="vehicle-lightbox-image" onClick={(event) => event.stopPropagation()}>
            <Image src={optimizeVehicleImage(current.image_url, 2200)} alt={`${vehicleName} — vehicle photograph ${active + 1}`} fill unoptimized sizes="100vw" />
          </div>
          {galleryImages.length > 1 ? <button type="button" className="vehicle-lightbox-arrow right" aria-label="Next photo" onClick={(event) => { event.stopPropagation(); next(); }}><ChevronRight size={30} /></button> : null}
          <span className="vehicle-lightbox-caption">{active + 1} of {galleryImages.length}</span>
        </div>
      ) : null}
    </div>
  );
}
