import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePublishedSpecialMenus } from "@/hooks/useSpecialMenus";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/config/routes";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import LocalizedLink from "@/components/LocalizedLink";

// Parent slug mapping for each language (same as BesondererAnlass.tsx)
const PARENT_SLUGS = {
  de: 'besondere-anlaesse',
  en: 'special-occasions',
  it: 'occasioni-speciali',
  fr: 'occasions-speciales',
} as const;

const BesondereAnlaesse = () => {
  const navigate = useNavigate();
  const { data: specialMenus, isLoading } = usePublishedSpecialMenus();
  const { language, t } = useLanguage();
  usePrerenderReady(!isLoading);

  // Client-side redirect zum ersten Special-Menü
  useEffect(() => {
    // Nur im Browser redirecten, nicht beim Pre-Rendering
    if (typeof window === 'undefined') return;
    if (isLoading) return;
    // Kein Redirect wenn Pre-Renderer aktiv
    if ((window as any).__PRERENDER_INJECTED) return;

    if (specialMenus && specialMenus.length > 0) {
      const firstMenu = specialMenus[0] as any;
      const getLocalizedMenuSlug = () => {
        if (language === 'en' && firstMenu.slug_en) return firstMenu.slug_en;
        if (language === 'it' && firstMenu.slug_it) return firstMenu.slug_it;
        if (language === 'fr' && firstMenu.slug_fr) return firstMenu.slug_fr;
        return firstMenu.slug || firstMenu.id;
      };

      const menuSlug = getLocalizedMenuSlug();
      const parentSlug = PARENT_SLUGS[language as keyof typeof PARENT_SLUGS];
      const basePath = language === "de" ? "" : `/${language}`;
      navigate(`${basePath}/${parentSlug}/${menuSlug}`, { replace: true });
    } else {
      navigate(getLocalizedPath("speisekarte", language), { replace: true });
    }
  }, [specialMenus, isLoading, navigate, language]);

  // Statische Links für Pre-Rendering und SEO
  const eventLinks = [
    { slug: "valentinstag-menue", label: t.seo?.besondereAnlaesse?.valentinstag || "Valentinstag-Menü" },
    { slug: "weihnachtsmenue", label: t.seo?.besondereAnlaesse?.weihnachten || "Weihnachtsmenü" },
    { slug: "silvester", label: t.seo?.besondereAnlaesse?.silvester || "Silvester Gala-Dinner" },
  ];

  const parentSlug = PARENT_SLUGS[language as keyof typeof PARENT_SLUGS];
  const basePath = language === "de" ? "" : `/${language}`;

  return (
    <>
      <SEO
        title={t.seo?.besondereAnlaesse?.seoTitle || "Besondere Anlässe im STORIA München"}
        description={t.seo?.besondereAnlaesse?.seoDescription || "Feiern Sie besondere Anlässe im STORIA München: Valentinstag, Weihnachtsfeier, Silvester & mehr. Italienische Menüs für jeden Anlass in der Maxvorstadt."}
        canonical="/besondere-anlaesse"
      />
      <StructuredData type="restaurant" />

      <div className="min-h-screen bg-background">
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {eventLinks.map((event) => (
                <Link
                  key={event.slug}
                  to={`${basePath}/${parentSlug}/${event.slug}`}
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
      </div>
    </>
  );
};

export default BesondereAnlaesse;
