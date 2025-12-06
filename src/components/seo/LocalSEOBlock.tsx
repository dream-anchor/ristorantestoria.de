import { Badge } from "@/components/ui/badge";
import { MapPin, Train, Car, Clock } from "lucide-react";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationBadge {
  icon?: "walk" | "train" | "car";
  text: string;
}

interface LocalSEOBlockProps {
  title: string;
  description: string;
  badges?: LocationBadge[];
  showMap?: boolean;
}

const LocalSEOBlock = ({
  title,
  description,
  badges,
  showMap = true,
}: LocalSEOBlockProps) => {
  const { language } = useLanguage();

  const defaultBadges: LocationBadge[] = [
    { icon: "walk", text: language === "de" ? "3 Min. → Königsplatz" : "3 min. → Königsplatz" },
    { icon: "train", text: language === "de" ? "5 Min. → Hauptbahnhof" : "5 min. → Central Station" },
    { icon: "walk", text: language === "de" ? "8 Min. → TU München" : "8 min. → TU Munich" },
    { icon: "car", text: language === "de" ? "Parkhaus am Königsplatz" : "Parking at Königsplatz" },
  ];

  const badgesToShow = badges || defaultBadges;

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case "train":
        return <Train className="h-3 w-3 mr-1" />;
      case "car":
        return <Car className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <section className="py-12 md:py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* GEO-Text Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-2xl md:text-3xl font-serif font-semibold">
                {title}
              </h2>
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-6 text-sm md:text-base">
              {description}
            </p>

            {/* Location Badges */}
            <div className="flex flex-wrap gap-2">
              {badgesToShow.map((badge, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1.5 text-xs font-normal flex items-center"
                >
                  {getIcon(badge.icon)}
                  {badge.text}
                </Badge>
              ))}
            </div>

            {/* Address */}
            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <p className="font-semibold text-sm">STORIA Ristorante</p>
              <p className="text-sm text-muted-foreground">
                Karlstraße 47a, 80333 München
              </p>
              <p className="text-sm text-muted-foreground">
                {language === "de" ? "Maxvorstadt / Nähe Königsplatz" : "Maxvorstadt / Near Königsplatz"}
              </p>
            </div>
          </div>

          {/* Mini Map */}
          {showMap && (
            <div className="rounded-lg overflow-hidden shadow-lg h-64 md:h-80">
              <ConsentGoogleMaps
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.0876074!2d11.5596!3d48.1446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSTORIA%20Ristorante!5e0!3m2!1sde!2sde!4v1234567890"
                title="STORIA Ristorante München Maxvorstadt"
                height="100%"
                className="w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocalSEOBlock;
