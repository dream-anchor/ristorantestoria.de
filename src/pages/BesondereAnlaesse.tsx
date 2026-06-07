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
import { isWmActive, WM_SLUG } from "@/config/seasonalFlags";

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

  // Saisonale WM-2026-Verlinkung – blendet sich nach dem Finale (19.7.2026) automatisch aus.
  const wmActive = isWmActive();

  const eventLinks = [
    {
      slug: "valentinstag-menue",
      slug_en: "valentines-day-menu", slug_it: "menu-san-valentino", slug_fr: "menu-saint-valentin",
      label: t.seo?.besondereAnlaesse?.valentinstag || "Valentinstag-Men\u00fc",
      teaser: "14. Februar – romantisches Dinner zu zweit, Pakete ab 55 € p. P.",
    },
    {
      slug: "weihnachtsmenue",
      slug_en: "christmas-menu", slug_it: "menu-natalizio", slug_fr: "menu-noel",
      label: t.seo?.besondereAnlaesse?.weihnachten || "Weihnachtsmenü",
      teaser: "In der Adventszeit – festliches Menü für Familien und Firmenfeiern, Gruppen-Menü ab 45 € p. P.",
    },
    {
      slug: "silvester",
      slug_en: "new-years-eve", slug_it: "capodanno", slug_fr: "reveillon",
      label: t.seo?.besondereAnlaesse?.silvester || "Silvester Gala-Dinner",
      teaser: "31. Dezember – Gala-Dinner mit 4-Gänge-Degustationsmenü ab 65,90 € p. P. (mit Weinbegleitung 99 €).",
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

  const eventsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.ristorantestoria.de/" },
          { "@type": "ListItem", "position": 2, "name": "Besondere Anlässe", "item": "https://www.ristorantestoria.de/besondere-anlaesse/" }
        ]
      },
      {
        "@type": "ItemList",
        "name": "Besondere Anlässe im Ristorante STORIA München",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "url": "https://www.ristorantestoria.de/besondere-anlaesse/valentinstag-menue/", "name": "Valentinstag-Menü" },
          { "@type": "ListItem", "position": 2, "url": "https://www.ristorantestoria.de/besondere-anlaesse/weihnachtsmenue/", "name": "Weihnachtsmenü" },
          { "@type": "ListItem", "position": 3, "url": "https://www.ristorantestoria.de/besondere-anlaesse/silvester/", "name": "Silvester Gala-Dinner" },
          ...(wmActive ? [{ "@type": "ListItem", "position": 4, "url": `https://www.ristorantestoria.de/${WM_SLUG}/`, "name": "WM 2026 Public Viewing" }] : [])
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Für wie viele Gäste ist das STORIA als Eventlocation geeignet?", "acceptedAnswer": { "@type": "Answer", "text": "Wir bieten Platz von der intimen Runde bis zu 300 Gästen – im Restaurant, in einem separaten Bereich oder bei schönem Wetter auf der Terrasse." } },
          { "@type": "Question", "name": "Gibt es vegetarische und vegane Menüvarianten?", "acceptedAnswer": { "@type": "Answer", "text": "Ja. Alle Event-Menüs lassen sich vegetarisch oder vegan gestalten – sagen Sie uns bei der Reservierung einfach Ihre Wünsche und Unverträglichkeiten." } },
          { "@type": "Question", "name": "Wie weit im Voraus sollte ich reservieren?", "acceptedAnswer": { "@type": "Answer", "text": "Für Feiertage wie Silvester, Weihnachten und den Valentinstag empfehlen wir eine Reservierung mehrere Wochen im Voraus. Für kleinere Anlässe genügen oft wenige Tage." } },
          { "@type": "Question", "name": "Kann ich einen separaten Bereich exklusiv buchen?", "acceptedAnswer": { "@type": "Answer", "text": "Ja, das STORIA verfügt über einen separaten Bereich, der für Firmenfeiern und private Anlässe exklusiv reserviert werden kann." } }
        ]
      }
    ]
  };

  return (
    <>
      <SEO
        title={t.seo?.besondereAnlaesse?.seoTitle || "Besondere Anlässe im STORIA München"}
        description={t.seo?.besondereAnlaesse?.seoDescription || "Feiern Sie besondere Anlässe im STORIA München: Osterbrunch, Valentinstag, Weihnachtsfeier, Silvester & mehr. Italienische Menüs für jeden Anlass in der Maxvorstadt."}
        canonical="/besondere-anlaesse/"
      />
      <StructuredData type="restaurant" includeReviews={false} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />

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
                    {event.teaser && (
                      <p className="mt-2 text-sm text-muted-foreground">{event.teaser}</p>
                    )}
                  </Link>
                ))}

                {wmActive && (
                  <LocalizedLink
                    to={WM_SLUG}
                    className="block p-6 rounded-2xl border bg-card hover:bg-accent transition-colors"
                  >
                    <h2 className="text-xl font-semibold">
                      {t.seo?.besondereAnlaesse?.wm || "WM 2026 Public Viewing"}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t.seo?.besondereAnlaesse?.wmTeaser || "11. Juni – 19. Juli – alle Spiele live auf der überdachten Terrasse, dazu süditalienische Küche & Aperitivo."}
                    </p>
                  </LocalizedLink>
                )}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-card border">
                <h2 className="text-lg font-semibold mb-3">Auf einen Blick</h2>
                <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
                  <li>Kapazität bis 300 Gäste</li>
                  <li>Maxvorstadt / Königsplatz</li>
                  <li>5 Min. vom Hauptbahnhof</li>
                  <li>Sprachen DE/EN/IT</li>
                  <li>Separater Bereich buchbar</li>
                  <li>4,5 Sterne bei 810 Bewertungen</li>
                </ul>
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
