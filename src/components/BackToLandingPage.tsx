import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface LandingPageInfo {
  name: { de: string; en: string; it: string; fr: string };
  path: string;
}

const landingPageNames: Record<string, LandingPageInfo> = {
  'firmenfeier-muenchen': { 
    name: {
      de: 'Firmenfeier München',
      en: 'Corporate Event Munich',
      it: 'Evento Aziendale Monaco',
      fr: 'Événement d\'entreprise Munich',
    },
    path: '/firmenfeier-muenchen'
  },
  'geburtstagsfeier-muenchen': { 
    name: {
      de: 'Geburtstagsfeier München',
      en: 'Birthday Party Munich',
      it: 'Festa di Compleanno Monaco',
      fr: 'Fête d\'anniversaire Munich',
    },
    path: '/geburtstagsfeier-muenchen'
  },
  'eventlocation-muenchen': { 
    name: {
      de: 'Eventlocation München',
      en: 'Event Location Munich',
      it: 'Location Eventi Monaco',
      fr: 'Lieu d\'événement Munich',
    },
    path: '/eventlocation-muenchen-maxvorstadt'
  },
  'lunch-muenchen-maxvorstadt': { 
    name: {
      de: 'Lunch München',
      en: 'Lunch Munich',
      it: 'Pranzo Monaco',
      fr: 'Déjeuner Munich',
    },
    path: '/lunch-muenchen-maxvorstadt'
  },
  'aperitivo-muenchen': { 
    name: {
      de: 'Aperitivo München',
      en: 'Aperitivo Munich',
      it: 'Aperitivo Monaco',
      fr: 'Aperitivo Munich',
    },
    path: '/aperitivo-muenchen'
  },
  'romantisches-dinner': { 
    name: {
      de: 'Romantisches Dinner',
      en: 'Romantic Dinner',
      it: 'Cena Romantica',
      fr: 'Dîner Romantique',
    },
    path: '/romantisches-dinner-muenchen'
  },
  'neapolitanische-pizza': { 
    name: {
      de: 'Neapolitanische Pizza',
      en: 'Neapolitan Pizza',
      it: 'Pizza Napoletana',
      fr: 'Pizza Napolitaine',
    },
    path: '/neapolitanische-pizza-muenchen'
  }
};

const BackToLandingPage = () => {
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const fromSlug = searchParams.get('from');

  if (!fromSlug || !landingPageNames[fromSlug]) {
    return null;
  }

  const landingPage = landingPageNames[fromSlug];
  const pageName = landingPage.name[language as keyof typeof landingPage.name] || landingPage.name.de;

  return (
    <div className="mb-6">
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
        <Link to={landingPage.path} state={{ fromLunch: fromSlug === 'lunch-muenchen-maxvorstadt' }}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.common.backTo} {pageName}
        </Link>
      </Button>
    </div>
  );
};

export default BackToLandingPage;