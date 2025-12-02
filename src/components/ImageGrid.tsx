import weinserviceImage from "@/assets/weinservice.webp";
import pastaImage from "@/assets/pasta.jpg";
import drinksImage from "@/assets/cocktails.webp";
import breakfastImage from "@/assets/aussen.webp";
import restaurantImage from "@/assets/haus-aussen-2.webp";
import aperitivoImage from "@/assets/meeresfruchte.webp";
import dessertImage from "@/assets/tiramisu.webp";
import terrasseImage from "@/assets/menschen-aussen.jpeg";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImageCardProps {
  image: string;
  title?: string;
  subtitle?: string;
  className?: string;
  imageClassName?: string;
}

const ImageCard = ({ image, title, subtitle, className = "", imageClassName = "" }: ImageCardProps) => {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img 
        src={image} 
        alt={title || ""} 
        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageClassName}`}
      />
      {(title || subtitle) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <div className="bg-primary/85 backdrop-blur-sm px-8 py-5 rounded-sm">
            {title && (
              <h3 className="text-primary-foreground text-lg md:text-xl font-serif font-semibold mb-2 tracking-wide">{title}</h3>
            )}
            {subtitle && (
              <p className="text-primary-foreground/90 text-sm md:text-base font-medium leading-relaxed">
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
    <section className="bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1 */}
          <ImageCard 
            image={weinserviceImage} 
            className="aspect-square"
          />
          <ImageCard 
            image={pastaImage} 
            title={t.imageGrid.openingHoursTitle}
            subtitle={t.imageGrid.openingHoursText}
            className="aspect-square"
          />
          <ImageCard 
            image={drinksImage} 
            className="aspect-square"
          />
          <ImageCard 
            image={aperitivoImage} 
            title={t.imageGrid.notturnoTitle}
            subtitle={t.imageGrid.notturnoText}
            className="aspect-square"
          />

          {/* Row 2 */}
          <ImageCard 
            image={breakfastImage} 
            title={t.imageGrid.breakfastTitle}
            subtitle={t.imageGrid.breakfastText}
            className="aspect-square"
          />
          <ImageCard 
            image={restaurantImage} 
            className="aspect-square"
            imageClassName="object-bottom"
          />
          <ImageCard 
            image={dessertImage} 
            className="aspect-square"
          />
          <ImageCard 
            image={terrasseImage} 
            className="aspect-square"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageGrid;
