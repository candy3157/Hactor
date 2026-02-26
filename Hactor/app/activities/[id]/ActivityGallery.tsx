"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

type ActivityGalleryProps = {
  imageUrls: string[];
  title: string;
};

export default function ActivityGallery({
  imageUrls,
  title,
}: ActivityGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => {
          if (current === null) {
            return current;
          }

          return (current + 1) % imageUrls.length;
        });
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => {
          if (current === null) {
            return current;
          }

          return (current - 1 + imageUrls.length) % imageUrls.length;
        });
      }
    };

    const scrollY = window.scrollY;
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.width = previousBodyStyles.width;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, imageUrls.length]);

  if (imageUrls.length === 0) {
    return (
      <p className="mt-4 text-sm italic text-[#7d7d7d]">
        No gallery images uploaded.
      </p>
    );
  }

  const selectedImageUrl =
    selectedIndex !== null ? imageUrls[selectedIndex] : null;
  const canPortal = typeof window !== "undefined";

  const modal =
    selectedImageUrl && selectedIndex !== null ? (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Gallery image preview"
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
        onClick={() => setSelectedIndex(null)}
      >
        {imageUrls.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIndex(
                  (selectedIndex - 1 + imageUrls.length) % imageUrls.length,
                );
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-3 py-2 text-2xl leading-none text-white/90 hover:bg-white/10 sm:left-6"
              aria-label="Previous image"
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setSelectedIndex((selectedIndex + 1) % imageUrls.length);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 px-3 py-2 text-2xl leading-none text-white/90 hover:bg-white/10 sm:right-6"
              aria-label="Next image"
            >
              {">"}
            </button>
          </>
        )}

        <div
          className="w-full max-w-6xl"
          onClick={(event) => event.stopPropagation()}
        >
          <Image
            src={selectedImageUrl}
            alt={`${title} image ${selectedIndex + 1}`}
            width={2200}
            height={2200}
            className="max-h-[85vh] w-full rounded-lg object-contain"
            priority
          />
          <p className="mt-3 text-center text-xs tracking-[0.16em] text-white/80">
            {selectedIndex + 1} / {imageUrls.length}
          </p>
        </div>
      </div>
    ) : null;

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {imageUrls.map((url, index) => (
          <button
            key={`${url}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group relative overflow-hidden rounded-md border border-[#dedede] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a2a86]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label={`Open image ${index + 1}`}
          >
            <Image
              src={url}
              alt={`${title} image ${index + 1}`}
              width={1200}
              height={1200}
              className="aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/20" />
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-[#777]">
        {imageUrls.length} image
        {imageUrls.length > 1 ? "s" : ""}
      </p>

      {canPortal && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
