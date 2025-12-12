import { useEffect } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const ConsentElfsightReviews = () => {
  const { hasConsent, openSettings, savePreferences, consent } = useCookieConsent();
  const { t } = useLanguage();

  const handleEnableExternal = () => {
    savePreferences({
      statistics: consent?.statistics ?? false,
      marketing: consent?.marketing ?? false,
      external: true,
    });
  };

  useEffect(() => {
    // Nur laden wenn Consent gegeben wurde
    if (hasConsent("external")) {
      if (!document.querySelector('script[src*="elfsight"]')) {
        const script = document.createElement('script');
        script.src = 'https://static.elfsight.com/platform/platform.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [hasConsent("external")]);

  if (!hasConsent("external")) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="bg-secondary/50 border border-border rounded-lg flex flex-col items-center justify-center p-8">
          <Star className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">{t.cookies.reviewsBlocked}</h3>
          <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
            {t.cookies.reviewsBlockedDesc}
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button onClick={handleEnableExternal} variant="default">
              {t.cookies.enableReviews}
            </Button>
            <Button onClick={openSettings} variant="outline">
              {t.cookies.settings}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Überschrift */}
      <div className="text-center mb-8">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
          {t.reviews.title}
        </h2>
        <p className="text-muted-foreground">
          {t.reviews.subtitle}
        </p>
      </div>
      
      {/* Elfsight Widget */}
      <div 
        className="elfsight-app-e58a6302-8498-4ada-9e27-e0a0ee5288ad" 
        data-elfsight-app-lazy 
      />
      
      {/* Catering-Hinweis */}
      <p className="text-center text-muted-foreground mt-8 italic">
        {t.reviews.deliveryNote}<br />
        {t.reviews.deliveryNote2}
      </p>
    </section>
  );
};

export default ConsentElfsightReviews;
