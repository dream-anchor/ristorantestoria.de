import { useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import MenuStructuredData from "@/components/MenuStructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import BotContent from "@/components/BotContent";
import LocalizedLink from "@/components/LocalizedLink";
import SeasonalSignupForm from "@/components/SeasonalSignupForm";
import MenuDisplay from "@/components/MenuDisplay";
import storiaLogo from "@/assets/storia-logo.webp";
import weihnachtsfeierImage from "@/assets/weihnachtsfeier-event.webp";
import romantischesDinnerImage from "@/assets/romantisches-dinner-hero.webp";
import sommerfestImage from "@/assets/sommerfest-event.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAlternateLinks } from "@/contexts/AlternateLinksContext";
import { useSpecialMenuBySlug } from "@/hooks/useSpecialMenus";
import { useArchivedSeasonalMenu } from "@/hooks/useArchivedSeasonalMenu";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { findSeasonalMenuBySlug, PARENT_SLUGS } from "@/config/seasonalMenus";
import type { SeasonalMenuConfig } from "@/config/seasonalMenus";
import { ArrowUp, Utensils, Calendar, BookOpen } from "lucide-react";
import SilvesterMuenchen from "@/pages/seo/SilvesterMuenchen";
import WeihnachtenMuenchen from "@/pages/seo/WeihnachtenMuenchen";
import ValentinstagMuenchen from "@/pages/seo/ValentinstagMuenchen";

// Map seasonal event keys to hero images
const SEASONAL_HERO_IMAGES: Record<string, string> = {
  valentinstag: romantischesDinnerImage,
  weihnachten: weihnachtsfeierImage,
  silvester: sommerfestImage,
};

const BesondererAnlass = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const { setAlternates, clearAlternates } = useAlternateLinks();
  const queryClient = useQueryClient();
  const { data: menu, isLoading, error } = useSpecialMenuBySlug(slug || '');
  const seasonalConfig = findSeasonalMenuBySlug(slug || '');

  // Hook must be called unconditionally (React rules of hooks)
  const { data: archivedMenu } = useArchivedSeasonalMenu(
    !menu && seasonalConfig ? seasonalConfig.key : undefined
  );

  usePrerenderReady(!isLoading && (!!menu || !!seasonalConfig));

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
      ].filter(Boolean);

      slugVariants.forEach((slugVariant) => {
        if (slugVariant && slugVariant !== slug) {
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

    return () => clearAlternates();
  }, [menu, setAlternates, clearAlternates]);

  // Silvester: dedicated rich landing page (both active and inactive states)
  if (seasonalConfig?.key === 'silvester') {
    return <SilvesterMuenchen menu={menu} archivedMenu={archivedMenu} seasonalConfig={seasonalConfig} />;
  }

  // Weihnachten: dedicated rich landing page (both active and inactive states)
  if (seasonalConfig?.key === 'weihnachten') {
    return <WeihnachtenMuenchen menu={menu} archivedMenu={archivedMenu} seasonalConfig={seasonalConfig} />;
  }

  // Valentinstag: dedicated rich landing page (both active and inactive states)
  if (seasonalConfig?.key === 'valentinstag') {
    return <ValentinstagMuenchen menu={menu} archivedMenu={archivedMenu} seasonalConfig={seasonalConfig} />;
  }

  // Seasonal placeholder: known seasonal slug but no Supabase data yet
  // Must be checked BEFORE isLoading to ensure SSR renders placeholder (not skeleton)
  if (!menu && seasonalConfig) {
    return <SeasonalPlaceholder config={seasonalConfig} archivedMenu={archivedMenu} />;
  }

  // Loading state (only for non-seasonal pages that might still be fetching)
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

  // Redirect to overview if menu not found and not a known seasonal page
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
    return langSlug || menu.slug;
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

// ============================================================
// Seasonal Placeholder Component (isActive=false)
// ============================================================

interface SeasonalPlaceholderProps {
  config: SeasonalMenuConfig;
  archivedMenu: any;
}

const SeasonalPlaceholder = ({ config, archivedMenu }: SeasonalPlaceholderProps) => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const seasonalTitle = config.titles[language] || config.titles.de;
  const descriptions = config.descriptions?.[language] || config.descriptions?.de || [];
  const faqItems = config.faq?.[language] || config.faq?.de || [];
  const expectedMonth = config.expectedMonth?.[language] || config.expectedMonth?.de || '';
  const heroImage = SEASONAL_HERO_IMAGES[config.key] || storiaLogo;

  const parentSlug = PARENT_SLUGS[language] || PARENT_SLUGS.de;
  const seasonalSlug = config.slugs[language] || config.slugs.de;
  const canonicalPath = language === 'de'
    ? `/${parentSlug}/${seasonalSlug}/`
    : `/${language}/${parentSlug}/${seasonalSlug}/`;

  const alternates = (['de', 'en', 'it', 'fr'] as const).map((lang) => ({
    lang,
    url: lang === 'de'
      ? `https://www.ristorantestoria.de/${PARENT_SLUGS[lang]}/${config.slugs[lang]}/`
      : `https://www.ristorantestoria.de/${lang}/${PARENT_SLUGS[lang]}/${config.slugs[lang]}/`,
  }));

  const breadcrumbParentLabels: Record<string, string> = {
    de: 'Besondere Anlässe',
    en: 'Special Occasions',
    it: 'Occasioni Speciali',
    fr: 'Occasions Spéciales',
  };

  // Build page title with year and month
  const pageHeadline = t.seasonalSignup.titleTemplate
    .replace('{event}', seasonalTitle)
    .replace('{year}', String(currentYear))
    .replace('{month}', expectedMonth);

  // SEO description from config placeholder
  const seoDescription = config.placeholder[language] || config.placeholder.de;

  // FAQ structured data for SEO
  const faqStructuredData = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  } : null;

  return (
    <>
      <SEO
        title={seasonalTitle}
        description={seoDescription}
        canonical={canonicalPath}
        alternates={alternates}
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: breadcrumbParentLabels[language] || breadcrumbParentLabels.de, url: `/${parentSlug}` },
          { name: seasonalTitle, url: canonicalPath }
        ]}
      />
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      )}
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero Section with seasonal image */}
        <div className="relative w-full h-64 md:h-80 overflow-hidden">
          <img
            src={heroImage}
            alt={seasonalTitle}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-white tracking-wide">
                {pageHeadline}
              </h1>
            </div>
          </div>
        </div>

        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-4xl mx-auto">

            {/* Description Section */}
            <section className="mb-12">
              {descriptions.map((paragraph, i) => (
                <p key={i} className="text-lg text-muted-foreground leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </section>

            {/* Email Signup Form */}
            <section id="signup-form" className="bg-card p-8 md:p-12 rounded-lg border border-border mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-semibold mb-2">
                  {t.seasonalSignup.signupHeading}
                </h2>
                <p className="text-muted-foreground">
                  {t.seasonalSignup.signupSubheading}
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <SeasonalSignupForm seasonalEvent={config.key} />
              </div>
            </section>

            {/* Contact CTA */}
            <div className="bg-secondary p-8 rounded-lg text-center mb-12">
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

            {/* Archived Menu (conditional) */}
            {archivedMenu && (
              <section className="mb-12">
                <div className="relative">
                  <Badge
                    variant="secondary"
                    className="absolute -top-3 right-4 z-10"
                  >
                    {t.seasonalSignup.archivedMenuBadge.replace('{year}', String(archivedMenu.archive_year))}
                  </Badge>
                  <div className="bg-card p-8 rounded-lg border border-dashed border-border/70 opacity-90">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-serif font-semibold mb-2">
                        {t.seasonalSignup.archivedMenuTitle
                          .replace('{event}', seasonalTitle)
                          .replace('{year}', String(archivedMenu.archive_year))}
                      </h2>
                      <p className="text-muted-foreground">
                        {t.seasonalSignup.archivedMenuIntro}
                      </p>
                    </div>
                    <MenuDisplay menuType="special" menuId={archivedMenu.id} showTitle={false} />
                    <div className="text-center mt-8 space-y-4">
                      <p className="text-sm text-muted-foreground italic">
                        {t.seasonalSignup.archivedMenuDisclaimer.replace('{year}', String(currentYear))}
                      </p>
                      <Button variant="outline" asChild>
                        <a href="#signup-form">
                          <ArrowUp className="w-4 h-4 mr-2" />
                          {t.seasonalSignup.backToSignup}
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {faqItems.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-serif font-semibold mb-6 text-center">
                  {t.seasonalSignup.faqTitle}
                </h2>
                <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                  {faqItems.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent forceMount className="text-base text-muted-foreground pb-5 leading-relaxed data-[state=closed]:hidden">
                        <p>{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* Internal Links */}
            <section className="mb-12">
              <h2 className="text-xl font-serif font-semibold mb-6 text-center">
                {t.seasonalSignup.relatedTitle}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <LocalizedLink
                  to="speisekarte"
                  className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors group"
                >
                  <Utensils className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{t.seasonalSignup.relatedMenu}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="besondere-anlaesse"
                  className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors group"
                >
                  <Calendar className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{t.seasonalSignup.relatedOccasions}</span>
                </LocalizedLink>
                <LocalizedLink
                  to="reservierung"
                  className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors group"
                >
                  <BookOpen className="w-8 h-8 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{t.seasonalSignup.relatedReservation}</span>
                </LocalizedLink>
              </div>
            </section>

            <ReservationCTA />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BesondererAnlass;
