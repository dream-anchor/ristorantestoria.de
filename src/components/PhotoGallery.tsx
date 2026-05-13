import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface GalleryImage {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  caption?: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3;
  className?: string;
  imgClassName?: string;
}

const PhotoGallery = ({ images, columns = 2, className, imgClassName }: PhotoGalleryProps) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, prev, next]);

  const gridClass = columns === 3
    ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4"
    : "grid md:grid-cols-2 gap-4";

  return (
    <>
      <div className={`${gridClass} ${className ?? ""}`}>
        {images.map((img, i) => (
          <figure
            key={i}
            className="overflow-hidden rounded-xl cursor-zoom-in"
            onClick={() => { setCurrent(i); setOpen(true); }}
          >
            <img
              src={img.src}
              srcSet={img.srcSet}
              sizes={img.sizes}
              alt={img.alt}
              className={imgClassName ?? "w-full h-72 object-cover hover:scale-105 transition-transform duration-500"}
              loading="lazy"
            />
            {img.caption && (
              <figcaption className="text-xs text-muted-foreground mt-2 text-center">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden border-0 bg-black/95 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-2 shrink-0">
            <span className="text-white/50 text-sm">{current + 1} / {images.length}</span>
            <button
              onClick={() => setOpen(false)}
              className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition-colors"
              aria-label="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Image */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            <img
              src={images[current].src}
              srcSet={images[current].srcSet}
              sizes="95vw"
              alt={images[current].alt}
              className="max-w-full max-h-[75vh] object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                  aria-label="Vorheriges Bild"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                  aria-label="Nächstes Bild"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Caption + dots */}
          <div className="shrink-0 pb-3 px-4 text-center">
            {images[current].caption && (
              <p className="text-xs text-white/60 mb-2">{images[current].caption}</p>
            )}
            {images.length > 1 && (
              <div className="flex justify-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/30 hover:bg-white/60"}`}
                    aria-label={`Bild ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PhotoGallery;
