interface GalleryImage {
  src: string;
  alt: string;
}

interface FoodGalleryProps {
  images: GalleryImage[];
  title?: string;
}

const FoodGallery = ({ images, title }: FoodGalleryProps) => {
  return (
    <section className="py-12 md:py-16 overflow-hidden bg-muted/30">
      {title && (
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8 md:mb-10 px-4">
          {title}
        </h2>
      )}
      
      <div className="flex gap-4 md:gap-6 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[280px] md:w-[350px] lg:w-[400px] snap-center"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg group">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint for mobile */}
      <p className="text-center text-xs text-muted-foreground mt-4 md:hidden">
        ← Wischen für mehr →
      </p>
    </section>
  );
};

export default FoodGallery;
