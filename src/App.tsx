import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import Index from "./pages/Index";
import Reservierung from "./pages/Reservierung";
import Menu from "./pages/Menu";
import Mittagsmenu from "./pages/Mittagsmenu";
import Speisekarte from "./pages/Speisekarte";
import Getraenke from "./pages/Getraenke";
import BesondereAnlaesse from "./pages/BesondereAnlaesse";
import BesondererAnlass from "./pages/BesondererAnlass";
import Kontakt from "./pages/Kontakt";
import Catering from "./pages/Catering";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import CookieRichtlinie from "./pages/CookieRichtlinie";
import AGBRestaurant from "./pages/AGBRestaurant";
import AGBGutscheine from "./pages/AGBGutscheine";
import Widerrufsbelehrung from "./pages/Widerrufsbelehrung";
import Zahlungsinformationen from "./pages/Zahlungsinformationen";
import Lebensmittelhinweise from "./pages/Lebensmittelhinweise";
import Haftungsausschluss from "./pages/Haftungsausschluss";
import UeberUns from "./pages/UeberUns";
import FloatingActions from "./components/FloatingActions";
import CookieBanner from "./components/CookieBanner";
import CookieSettingsButton from "./components/CookieSettingsButton";
import ScrollToTop from "./components/ScrollToTop";
import GoogleAnalytics from "./components/GoogleAnalytics";

// SEO Landingpages
import LunchMuenchen from "./pages/seo/LunchMuenchen";
import AperitivoMuenchen from "./pages/seo/AperitivoMuenchen";
import RomantischesDinner from "./pages/seo/RomantischesDinner";
import EventlocationMuenchen from "./pages/seo/EventlocationMuenchen";
import FirmenfeierMuenchen from "./pages/seo/FirmenfeierMuenchen";
import GeburtstagsfeierMuenchen from "./pages/seo/GeburtstagsfeierMuenchen";
import NeapolitanischePizza from "./pages/seo/NeapolitanischePizza";

const queryClient = new QueryClient();

// Route configuration with components
const routeComponents: Record<string, React.ComponentType> = {
  home: Index,
  reservierung: Reservierung,
  menu: Menu,
  "mittags-menu": Mittagsmenu,
  speisekarte: Speisekarte,
  getraenke: Getraenke,
  "besondere-anlaesse": BesondereAnlaesse,
  kontakt: Kontakt,
  catering: Catering,
  "ueber-uns": UeberUns,
  impressum: Impressum,
  datenschutz: Datenschutz,
  "cookie-richtlinie": CookieRichtlinie,
  "agb-restaurant": AGBRestaurant,
  "agb-gutscheine": AGBGutscheine,
  widerrufsbelehrung: Widerrufsbelehrung,
  zahlungsinformationen: Zahlungsinformationen,
  lebensmittelhinweise: Lebensmittelhinweise,
  haftungsausschluss: Haftungsausschluss,
  "lunch-muenchen-maxvorstadt": LunchMuenchen,
  "aperitivo-muenchen": AperitivoMuenchen,
  "romantisches-dinner-muenchen": RomantischesDinner,
  "eventlocation-muenchen-maxvorstadt": EventlocationMuenchen,
  "firmenfeier-muenchen": FirmenfeierMuenchen,
  "geburtstagsfeier-muenchen": GeburtstagsfeierMuenchen,
  "neapolitanische-pizza-muenchen": NeapolitanischePizza,
};

// Import translations for slug mapping
import { de } from "@/translations/de";
import { en } from "@/translations/en";
import { it } from "@/translations/it";
import { fr } from "@/translations/fr";

const slugMaps = { de: de.slugs, en: en.slugs, it: it.slugs, fr: fr.slugs };
type Language = "de" | "en" | "it" | "fr";

// Generate all routes for all languages
const generateRoutes = () => {
  const routes: Array<{ path: string; element: React.ReactNode }> = [];
  
  // German routes (no prefix)
  for (const [baseSlug, Component] of Object.entries(routeComponents)) {
    const germanSlug = slugMaps.de[baseSlug as keyof typeof slugMaps.de];
    if (baseSlug === "home") {
      routes.push({ path: "/", element: <Component /> });
    } else if (germanSlug) {
      routes.push({ path: `/${germanSlug}`, element: <Component /> });
    }
  }
  
  // Other languages with prefix
  const otherLanguages: Language[] = ["en", "it", "fr"];
  for (const lang of otherLanguages) {
    const slugMap = slugMaps[lang];
    
    // Language root (e.g., /en, /it, /fr)
    routes.push({ path: `/${lang}`, element: <Index /> });
    
    for (const [baseSlug, Component] of Object.entries(routeComponents)) {
      if (baseSlug === "home") continue; // Already handled above
      const localizedSlug = slugMap[baseSlug as keyof typeof slugMap];
      if (localizedSlug) {
        routes.push({ path: `/${lang}/${localizedSlug}`, element: <Component /> });
      }
    }
  }
  
  return routes;
};

// Routes component with language-aware routing
const AppRoutes = () => {
  const routes = generateRoutes();
  
  return (
    <Routes>
      {/* Generated i18n routes */}
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
      
      {/* Dynamic routes for special occasions */}
      <Route path="/besondere-anlaesse/:slug" element={<BesondererAnlass />} />
      <Route path="/en/special-occasions/:slug" element={<BesondererAnlass />} />
      <Route path="/it/occasioni-speciali/:slug" element={<BesondererAnlass />} />
      <Route path="/fr/occasions-speciales/:slug" element={<BesondererAnlass />} />
      
      {/* Admin routes (no i18n) */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Legacy redirects - these are handled in .htaccess but also here for SPA */}
      <Route path="/lunch-muenchen" element={<LunchMuenchen />} />
      <Route path="/eventlocation-muenchen" element={<EventlocationMuenchen />} />
      
      {/* 404 catch-all - must be last */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// App component with all providers and contexts
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <CookieConsentProvider>
          <Toaster />
          <Sonner />
          <GoogleAnalytics />
          <ScrollToTop />
          <FloatingActions />
          <CookieBanner />
          <CookieSettingsButton />
          <AppRoutes />
        </CookieConsentProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
