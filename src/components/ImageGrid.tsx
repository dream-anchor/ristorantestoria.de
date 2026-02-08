import weinserviceImage from "@/assets/weinservice-italienische-weine-storia-muenchen.webp";
import ravioliImage from "@/assets/hausgemachte-ravioli-pasta-storia-muenchen.webp";
import drinksImage from "@/assets/aperitivo-cocktails-bar-storia-muenchen.webp";
import breakfastImage from "@/assets/restaurant-terrasse-maxvorstadt-muenchen.webp";
import restaurantImage from "@/assets/ristorante-storia-fassade-karlstrasse-muenchen.webp";
import aperitivoImage from "@/assets/meeresfruechte-antipasti-storia-muenchen.webp";
import dessertImage from "@/assets/tiramisu-dessert-italienisch-storia-muenchen.webp";
import terrasseImage from "@/assets/gaeste-terrasse-italiener-maxvorstadt-muenchen.webp";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImageCardProps {
  image: string;
  alt: string;
  title?: string;
  subtitle?: string;
  className?: string;
  imageClassName?: string;
  externalLink?: string;
}

const ImageCard = ({ image, alt, title, subtitle, className = "", imageClassName = "", externalLink }: ImageCardProps) => {
  const content = (
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

  if (externalLink) {
    return (
      <a 
        href={externalLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block cursor-pointer"
      >
        {content}
      </a>
    );
  }

  return content;
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
            title={t.imageGrid.cateringTitle}
            subtitle={t.imageGrid.cateringText}
            externalLink="https://www.events-storia.de"
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