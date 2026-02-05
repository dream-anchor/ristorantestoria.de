import { useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import MenuStructuredData from "@/components/MenuStructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import BotContent from "@/components/BotContent";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlternateLinks } from "@/contexts/AlternateLinksContext";
import { useSpecialMenuBySlug } from "@/hooks/useSpecialMenus";
import MenuDisplay from "@/components/MenuDisplay";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

// Parent slug mapping for each language
const PARENT_SLUGS = {
  de: 'besondere-anlaesse',
  en: 'special-occasions',
  it: 'occasioni-speciali',
  fr: 'occasions-speciales',
} as const;

const BesondererAnlass = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const { setAlternates, clearAlternates } = useAlternateLinks();
  const queryClient = useQueryClient();
  const { data: menu, isLoading, error } = useSpecialMenuBySlug(slug || '');
  usePrerenderReady(!isLoading && !!menu);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Pre-populate cache for all slug variants to enable instant language switching
  useEffect(() => {
    if (menu) {
      const slugVariants = [
        menu.slug,
        (menu as any).slug_en,
        (menu as any).slug_it,
        (menu as any).slug_fr,
      ].filter(Boolean); // Remove null/undefined

      // Set cache for all slug variants so language switching is instant
      slugVariants.forEach((slugVariant) => {
        if (slugVariant && slugVariant !== slug) {
          // Query key must match useSpecialMenuBySlug: ['special-menu', slug, language]
          queryClient.setQueryData(['special-menu', slugVariant, undefined], menu);
        }
      });
    }
  }, [menu, slug, queryClient]);

  // Set alternate links for language switcher when menu data is loaded
  useEffect(() => {
    if (menu) {
      const getLocalizedSlugForAlternates = (lang: 'de' | 'en' | 'it' | 'fr') => {
        if (lang === 'de') return menu.slug;
        const langSlug = (menu as any)[`slug_${lang}`];
        return langSlug || menu.slug;
      };

      const baseUrl = 'https://www.ristorantestoria.de';
      setAlternates([
        { lang: 'de', url: `${baseUrl}/${PARENT_SLUGS.de}/${getLocalizedSlugForAlternates('de')}/` },
        { lang: 'en', url: `${baseUrl}/en/${PARENT_SLUGS.en}/${getLocalizedSlugForAlternates('en')}/` },
        { lang: 'it', url: `${baseUrl}/it/${PARENT_SLUGS.it}/${getLocalizedSlugForAlternates('it')}/` },
        { lang: 'fr', url: `${baseUrl}/fr/${PARENT_SLUGS.fr}/${getLocalizedSlugForAlternates('fr')}/` },
      ]);
    }

    // Clear alternates when leaving the page
    return () => clearAlternates();
  }, [menu, setAlternates, clearAlternates]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Skeleton className="h-24 md:h-32 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
        </div>
        <Navigation />
        <main className="container mx-auto px-4 py-12 flex-grow">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-96" />
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect to overview if menu not found
  if (error || !menu) {
    return <Navigate to="/besondere-anlaesse" replace />;
  }

  // Helper für lokalisierte Texte
  const getLocalizedText = (de: string | null, en?: string | null, it?: string | null, fr?: string | null) => {
    if (language === 'it' && it) return it;
    if (language === 'fr' && fr) return fr;
    if (language === 'en' && en) return en;
    return de || '';
  };

  const menuTitle = getLocalizedText(menu.title, menu.title_en, menu.title_it, menu.title_fr);
  const menuSubtitle = getLocalizedText(menu.subtitle, menu.subtitle_en, menu.subtitle_it, menu.subtitle_fr);

  // Get localized slugs from menu data (fallback to German slug if not set)
  const getLocalizedSlug = (lang: 'de' | 'en' | 'it' | 'fr') => {
    if (lang === 'de') return menu.slug;
    const langSlug = (menu as any)[`slug_${lang}`];
    return langSlug || menu.slug; // Fallback to German slug
  };

  // Generate hreflang alternates for all languages
  const alternates = useMemo(() => {
    const baseUrl = 'https://www.ristorantestoria.de';
    return [
      { lang: 'de', url: `${baseUrl}/${PARENT_SLUGS.de}/${getLocalizedSlug('de')}/` },
      { lang: 'en', url: `${baseUrl}/en/${PARENT_SLUGS.en}/${getLocalizedSlug('en')}/` },
      { lang: 'it', url: `${baseUrl}/it/${PARENT_SLUGS.it}/${getLocalizedSlug('it')}/` },
      { lang: 'fr', url: `${baseUrl}/fr/${PARENT_SLUGS.fr}/${getLocalizedSlug('fr')}/` },
    ];
  }, [menu.slug, (menu as any).slug_en, (menu as any).slug_it, (menu as any).slug_fr]);

  // Get canonical URL for current language
  const currentSlug = getLocalizedSlug(language as 'de' | 'en' | 'it' | 'fr');
  const parentSlug = PARENT_SLUGS[language as keyof typeof PARENT_SLUGS];
  const canonicalPath = language === 'de'
    ? `/${parentSlug}/${currentSlug}/`
    : `/${language}/${parentSlug}/${currentSlug}/`;

  // SEO-optimized description based on slug
  const getSeoDescription = () => {
    if (slug?.includes('weihnacht')) {
      return language === 'de'
        ? `${menuTitle} im STORIA München: Italienische Weihnachtsfeier in der Maxvorstadt. Festliche Menüs für Firmenfeier, Familie & Freunde. Jetzt reservieren!`
        : `${menuTitle} at STORIA Munich: Italian Christmas celebration in Maxvorstadt. Festive menus for corporate events, family & friends. Book now!`;
    }
    if (slug?.includes('silvester')) {
      return language === 'de'
        ? `${menuTitle} im STORIA München: Silvester feiern in der Maxvorstadt. Italienisches Restaurant für Ihren Jahreswechsel. Jetzt Tisch sichern!`
        : `${menuTitle} at STORIA Munich: Celebrate New Year's Eve in Maxvorstadt. Italian restaurant for your celebration. Secure your table now!`;
    }
    return language === 'de'
      ? `${menuTitle} im STORIA München Maxvorstadt. Feiern Sie besondere Anlässe mit authentischer italienischer Küche. Jetzt reservieren!`
      : `${menuTitle} at STORIA Munich Maxvorstadt. Celebrate special occasions with authentic Italian cuisine. Book now!`;
  };

  // Breadcrumb labels per language
  const breadcrumbParentLabels = {
    de: 'Besondere Anlässe',
    en: 'Special Occasions',
    it: 'Occasioni Speciali',
    fr: 'Occasions Spéciales',
  };

  return (
    <>
      <SEO
        title={menuTitle}
        description={getSeoDescription()}
        canonical={canonicalPath}
        alternates={alternates}
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: breadcrumbParentLabels[language as keyof typeof breadcrumbParentLabels], url: `/${parentSlug}` },
          { name: menuTitle, url: canonicalPath }
        ]}
      />
      <MenuStructuredData menuId={menu.id} />
      <BotContent menuId={menu.id} />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-8 text-center">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA – Italienisches Restaurant München Logo" width={128} height={128} loading="eager" className="h-24 md:h-32 w-auto mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
            <p className="text-lg text-muted-foreground tracking-wide">
              {t.hero.subtitle}
            </p>
          </div>
        </div>
        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-lg border border-border mb-8">
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-wide mb-2">
                  {menuTitle}
                </h1>
                {menuSubtitle && (
                  <p className="text-lg text-muted-foreground italic">{menuSubtitle}</p>
                )}
                <div className="w-24 h-px bg-primary/30 mx-auto mt-6" />
              </div>
              <MenuDisplay menuType="special" menuId={menu.id} showTitle={false} />
            </div>

            {/* Contact CTA */}
            <div className="bg-secondary p-8 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-4">{t.specialOccasions.interested}</h2>
              <p className="text-muted-foreground mb-6">
                {t.specialOccasions.contactUs}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="tel:+498951519696">+49 89 51519696</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:info@ristorantestoria.de">{t.specialOccasions.sendEmail}</a>
                </Button>
              </div>
            </div>

            <ReservationCTA />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BesondererAnlass;
