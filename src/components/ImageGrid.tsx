import weinserviceImage from "@/assets/weinservice.webp";
import ravioliImage from "@/assets/ravioli.webp";
import drinksImage from "@/assets/cocktails.webp";
import breakfastImage from "@/assets/aussen.webp";
import restaurantImage from "@/assets/haus-aussen-2.webp";
import aperitivoImage from "@/assets/meeresfruchte.webp";
import dessertImage from "@/assets/tiramisu.webp";
import terrasseImage from "@/assets/menschen-aussen.jpeg";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImageCardProps {
  image: string;
  alt: string;
  title?: string;
  subtitle?: string;
  className?: string;
  imageClassName?: string;
}

const ImageCard = ({ image, alt, title, subtitle, className = "", imageClassName = "" }: ImageCardProps) => {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img 
        src={image} 
        alt={alt}
        width={400}
        height={400}
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageClassName}`}
        loading="lazy"
      />
      {(title || subtitle) && (
        <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 pointer-events-none">
          <div className="bg-neutral-800/60 backdrop-blur-sm px-4 py-3 md:px-5 md:py-4">
            {title && (
              <h3 className="text-white text-base md:text-lg font-serif font-semibold mb-1 tracking-wide">{title}</h3>
            )}
            {subtitle && (
              <p className="text-white/90 text-xs md:text-sm font-medium leading-relaxed">
                {subtitle.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < subtitle.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ImageGrid = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-12" aria-label={t.imageGrid.altTerrasse}>
      <div className="container mx-auto px-4">
        <h2 className="sr-only">
          {t.internalLinks.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1 */}
          <ImageCard 
            image={weinserviceImage} 
            alt={t.imageGrid.altWine}
            className="aspect-square"
            imageClassName="object-center"
          />
          <ImageCard 
            image={ravioliImage} 
            alt={t.imageGrid.altPasta}
            title={t.imageGrid.openingHoursTitle}
            subtitle={t.imageGrid.openingHoursText}
            className="aspect-square"
            imageClassName="object-bottom"
          />
          <ImageCard 
            image={drinksImage} 
            alt={t.imageGrid.altWine}
            className="aspect-square"
          />
          <ImageCard 
            image={aperitivoImage} 
            alt={t.imageGrid.altDessert}
            title={t.imageGrid.notturnoTitle}
            subtitle={t.imageGrid.notturnoText}
            className="aspect-square"
          />

          {/* Row 2 */}
          <ImageCard 
            image={breakfastImage} 
            alt={t.imageGrid.altTerrasse}
            title={t.imageGrid.breakfastTitle}
            subtitle={t.imageGrid.breakfastText}
            className="aspect-square"
          />
          <ImageCard 
            image={restaurantImage} 
            alt={t.imageGrid.altTerrasse}
            className="aspect-square"
            imageClassName="object-bottom"
          />
          <ImageCard 
            image={dessertImage} 
            alt={t.imageGrid.altDessert}
            className="aspect-square"
          />
          <ImageCard 
            image={terrasseImage} 
            alt={t.imageGrid.altTerrasse}
            className="aspect-square"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageGrid;