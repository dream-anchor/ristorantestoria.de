import { Link } from "react-router-dom";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import GoogleReviews from "@/components/GoogleReviews";
import LocalizedLink from "@/components/LocalizedLink";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

// Parent slug mapping for each language
const PARENT_SLUGS = {
  de: 'besondere-anlaesse',
  en: 'special-occasions',
  it: 'occasioni-speciali',
  fr: 'occasions-speciales',
} as const;

const BesondereAnlaesse = () => {
  const { language, t } = useLanguage();
  usePrerenderReady(true);

  const eventLinks = [
    {
      slug: "osterbrunch",
      slug_en: "easter-brunch", slug_it: "pranzo-pasquale", slug_fr: "brunch-pascal",
      label: t.seo?.besondereAnlaesse?.osterbrunch || "Osterbrunch",
    },
    {
      slug: "valentinstag-menue",
      slug_en: "valentines-day-menu", slug_it: "menu-san-valentino", slug_fr: "menu-saint-valentin",
      label: t.seo?.besondereAnlaesse?.valentinstag || "Valentinstag-Men\u00fc",
    },
    {
      slug: "weihnachtsmenue",
      slug_en: "christmas-menu", slug_it: "menu-natalizio", slug_fr: "menu-noel",
      label: t.seo?.besondereAnlaesse?.weihnachten || "Weihnachtsmenü",
    },
    {
      slug: "silvester",
      slug_en: "new-years-eve", slug_it: "capodanno", slug_fr: "reveillon",
      label: t.seo?.besondereAnlaesse?.silvester || "Silvester Gala-Dinner",
    },
  ];

  const parentSlug = PARENT_SLUGS[language as keyof typeof PARENT_SLUGS];
  const basePath = language === "de" ? "" : `/${language}`;

  const getSlug = (event: typeof eventLinks[0]) => {
    if (language === 'en' && event.slug_en) return event.slug_en;
    if (language === 'it' && event.slug_it) return event.slug_it;
    if (language === 'fr' && event.slug_fr) return event.slug_fr;
    return event.slug;
  };

  return (
    <>
      <SEO
        title={t.seo?.besondereAnlaesse?.seoTitle || "Besondere Anlässe im STORIA München"}
        description={t.seo?.besondereAnlaesse?.seoDescription || "Feiern Sie besondere Anlässe im STORIA München: Osterbrunch, Valentinstag, Weihnachtsfeier, Silvester & mehr. Italienische Menüs für jeden Anlass in der Maxvorstadt."}
        canonical="/besondere-anlaesse/"
      />
      <StructuredData type="restaurant" />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Navigation />

        <main id="main-content" className="flex-grow">
          <section className="py-24 md:py-32">
            <div className="container mx-auto px-4 max-w-4xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {t.seo?.besondereAnlaesse?.h1 || "Besondere Anlässe im Ristorante STORIA"}
              </h1>
              <div className="text-lg text-muted-foreground mb-8 space-y-4">
                <p>
                  {t.seo?.besondereAnlaesse?.intro || "Das Ristorante STORIA in der Münchner Maxvorstadt ist der perfekte Ort, um besondere Anlässe in stilvollem Ambiente zu feiern."}
                </p>
                {t.seo?.besondereAnlaesse?.introP2 && (
                  <p>{t.seo.besondereAnlaesse.introP2}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {eventLinks.map((event) => (
                  <Link
                    key={event.slug}
                    to={`${basePath}/${parentSlug}/${getSlug(event)}/`}
                    className="block p-6 rounded-2xl border bg-card hover:bg-accent transition-colors"
                  >
                    <h2 className="text-xl font-semibold">{event.label}</h2>
                  </Link>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-secondary/50 border">
                <p className="text-muted-foreground">
                  Für Ihre{" "}
                  <LocalizedLink to="weihnachtsfeier-muenchen" className="text-primary hover:underline font-medium">
                    Firmen-Weihnachtsfeier
                  </LocalizedLink>{" "}
                  bieten wir spezielle Gruppen-Menüs ab 45 € pro Person. Entdecken Sie auch unsere{" "}
                  <LocalizedLink to="catering" className="text-primary hover:underline font-medium">
                    Catering-Angebote
                  </LocalizedLink>{" "}
                  für externe Events.
                </p>
              </div>
            </div>
          </section>

          <GoogleReviews compact />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BesondereAnlaesse;
