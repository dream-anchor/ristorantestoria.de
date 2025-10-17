import chefsImage from "@/assets/chefs.jpg";
import pastaImage from "@/assets/pasta.jpg";
import drinksImage from "@/assets/drinks.jpg";
import breakfastImage from "@/assets/breakfast.jpg";
import restaurantImage from "@/assets/restaurant.jpg";
import aperitivoImage from "@/assets/aperitivo.jpg";
import dessertImage from "@/assets/dessert.jpg";

interface ImageCardProps {
  image: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

const ImageCard = ({ image, title, subtitle, className = "" }: ImageCardProps) => {
  return (
    <div className={`relative overflow-hidden group ${className}`}>
      <img 
        src={image} 
        alt={title || ""} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {(title || subtitle) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm px-6 py-4 rounded-lg">
            {title && (
              <h3 className="text-white text-xl md:text-2xl font-semibold mb-2">{title}</h3>
            )}
            {subtitle && (
              <p className="text-white text-sm md:text-base font-medium whitespace-pre-line leading-relaxed">{subtitle}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ImageGrid = () => {
  return (
    <section className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Row 1 */}
          <ImageCard 
            image={chefsImage} 
            className="aspect-square"
          />
          <ImageCard 
            image={pastaImage} 
            title="Öffnungszeiten:"
            subtitle="Mo - Fr 09.00 - 01.00 Uhr\nSa - So 12.00 - 1.00 Uhr"
            className="aspect-square"
          />
          <ImageCard 
            image={drinksImage} 
            className="aspect-square"
          />
          <ImageCard 
            image={aperitivoImage} 
            title="STORIA Notturno"
            subtitle="Late Night Aperitivo – stile italiano\n21.00-22.30 Uhr"
            className="aspect-square"
          />

          {/* Row 2 */}
          <ImageCard 
            image={breakfastImage} 
            title="Mo-So ab 9.00 Uhr:"
            subtitle="Frühstücken im STORIA"
            className="aspect-square"
          />
          <ImageCard 
            image={restaurantImage} 
            className="aspect-square"
          />
          <ImageCard 
            image={dessertImage} 
            className="aspect-square"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageGrid;
