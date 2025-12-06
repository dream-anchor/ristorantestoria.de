import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Testimonial {
  quote: string;
  author: string;
}

interface SocialProofProps {
  rating?: number;
  reviewCount?: string;
  testimonials?: Testimonial[];
  googleReviewsUrl?: string;
}

const SocialProof = ({
  rating = 4.6,
  reviewCount = "500+",
  testimonials,
  googleReviewsUrl = "https://www.google.com/maps/place/STORIA+Ristorante/@48.1446,11.5596,17z/",
}: SocialProofProps) => {
  const { language } = useLanguage();

  const defaultTestimonials: Testimonial[] = [
    {
      quote: language === "de" 
        ? "Beste neapolitanische Pizza in München! Der Teig ist perfekt."
        : "Best Neapolitan pizza in Munich! The dough is perfect.",
      author: "Michael K.",
    },
    {
      quote: language === "de"
        ? "Authentische italienische Küche und wunderbarer Service. Wir kommen immer wieder!"
        : "Authentic Italian cuisine and wonderful service. We keep coming back!",
      author: "Sandra W.",
    },
    {
      quote: language === "de"
        ? "Perfekt für unser Firmenevent. Alles war hervorragend organisiert."
        : "Perfect for our company event. Everything was excellently organized.",
      author: "Thomas B.",
    },
  ];

  const testimonialsToShow = testimonials || defaultTestimonials;

  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="container mx-auto px-4 text-center">
        {/* Star Rating */}
        <div className="flex items-center justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-6 w-6 md:h-7 md:w-7 ${
                i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-yellow-400/30 text-yellow-400/30"
              }`}
            />
          ))}
        </div>
        
        <p className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-1">
          {rating} {language === "de" ? "von 5 Sternen" : "out of 5 stars"}
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          {language === "de" 
            ? `Basierend auf ${reviewCount} Google-Bewertungen`
            : `Based on ${reviewCount} Google reviews`}
        </p>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto">
          {testimonialsToShow.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-lg shadow-sm text-left relative"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              <p className="text-sm md:text-base text-foreground leading-relaxed mb-4 italic">
                "{testimonial.quote}"
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                — {testimonial.author}
              </p>
            </div>
          ))}
        </div>

        {/* Google Reviews Link */}
        <a
          href={googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 hover:underline mt-8 text-sm font-medium transition-colors"
        >
          {language === "de" 
            ? "Alle Bewertungen auf Google ansehen"
            : "View all reviews on Google"}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
};

export default SocialProof;
