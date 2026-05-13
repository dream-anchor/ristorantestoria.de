import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface LightboxImage {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  caption?: string;
}

interface ImageLightboxProps {
  image: LightboxImage;
  className?: string;
  imgClassName?: string;
}

const ImageLightbox = ({ image, className, imgClassName }: ImageLightboxProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <figure className={`overflow-hidden rounded-xl cursor-zoom-in ${className ?? ""}`} onClick={() => setOpen(true)}>
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={image.sizes}
          alt={image.alt}
          className={imgClassName ?? "w-full h-72 object-cover hover:scale-105 transition-transform duration-500"}
          loading="lazy"
        />
        {image.caption && (
          <figcaption className="text-xs text-muted-foreground mt-2 text-center">{image.caption}</figcaption>
        )}
      </figure>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden border-0 bg-black/95">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 z-50 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes="95vw"
            alt={image.alt}
            className="w-full h-auto max-h-[95vh] object-contain"
          />
          {image.caption && (
            <p className="text-xs text-white/60 text-center py-2 px-4">{image.caption}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageLightbox;
