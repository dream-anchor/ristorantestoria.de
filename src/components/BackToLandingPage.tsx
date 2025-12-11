import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const landingPageNames: Record<string, { de: string; en: string; path: string }> = {
  'firmenfeier-muenchen': { 
    de: 'Firmenfeier München', 
    en: 'Corporate Event Munich',
    path: '/firmenfeier-muenchen'
  },
  'geburtstagsfeier-muenchen': { 
    de: 'Geburtstagsfeier München', 
    en: 'Birthday Party Munich',
    path: '/geburtstagsfeier-muenchen'
  },
  'eventlocation-muenchen': { 
    de: 'Eventlocation München', 
    en: 'Event Location Munich',
    path: '/eventlocation-muenchen-maxvorstadt'
  },
  'lunch-muenchen-maxvorstadt': { 
    de: 'Lunch München', 
    en: 'Lunch Munich',
    path: '/lunch-muenchen-maxvorstadt'
  },
  'aperitivo-muenchen': { 
    de: 'Aperitivo München', 
    en: 'Aperitivo Munich',
    path: '/aperitivo-muenchen'
  },
  'romantisches-dinner': { 
    de: 'Romantisches Dinner', 
    en: 'Romantic Dinner',
    path: '/romantisches-dinner-muenchen'
  },
  'neapolitanische-pizza': { 
    de: 'Neapolitanische Pizza', 
    en: 'Neapolitan Pizza',
    path: '/neapolitanische-pizza-muenchen'
  }
};

const BackToLandingPage = () => {
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const fromSlug = searchParams.get('from');

  if (!fromSlug || !landingPageNames[fromSlug]) {
    return null;
  }

  const landingPage = landingPageNames[fromSlug];
  const pageName = language === 'de' ? landingPage.de : landingPage.en;

  return (
    <div className="mb-6">
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
        <Link to={landingPage.path}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'de' ? `Zurück zu ${pageName}` : `Back to ${pageName}`}
        </Link>
      </Button>
    </div>
  );
};

export default BackToLandingPage;
