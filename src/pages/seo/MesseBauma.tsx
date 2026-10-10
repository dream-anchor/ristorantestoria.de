import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import LocalizedLink from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { getLocalizedPath } from "@/config/routes";
import { messeContent } from "./messeContent";
import { faqSchema, Tabelle, MenueKarten, AnfrageBlock } from "./MesseMuenchen";

const BASE = "https://www.ristorantestoria.de";

const MesseBauma = () => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);
  const c = messeContent[language];
  const b = c.bauma;
  const home = language === "de" ? "/" : `/${language}/`;
  const hub = getLocalizedPath("messe-muenchen", language);
  const pfad = getLocalizedPath("messe-muenchen/bauma", language);

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${BASE}${pfad}`,
    name: b.seoTitle,
    inLanguage: language,
    about: { "@id": `${BASE}/#restaurant` },
    mentions: {
      "@type": "Event",
      name: b.eventName,
      startDate: "2028-04-03",
      endDate: "2028-04-09",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: "Messe München",
        address: { "@type": "PostalAddress", streetAddress: "Am Messesee", postalCode: "81829", addressLocality: "München", addressCountry: "DE" },
      },
      organizer: { "@type": "Organization", name: "Messe München GmbH", url: "https://messe-muenchen.de" },
    },
  };

  return (
    <>
      <SEO title={b.seoTitle} description={b.seoDescription} canonical={pfad} />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[{ name: t.breadcrumb.home, url: home }, { name: c.hub.breadcrumb, url: hub }, { name: b.breadcrumb, url: pfad }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(b.faq)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <section className="bg-secondary/40 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">{b.kicker}</p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">{b.h1}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">{b.intro}</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild><a href="#anfrage">{b.ctaAnfrage}</a></Button>
              <Button size="lg" variant="outline" asChild><a href="#menues">{b.ctaMenues}</a></Button>
            </div>
          </div>
        </section>
        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto">
            <BreadcrumbNav crumbs={[{ label: t.breadcrumb.home, href: home }, { label: c.hub.breadcrumb, href: hub }, { label: b.breadcrumb }]} />

            <section className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {b.zahlen.map(([wert, text]) => (
                <div key={wert} className="border border-border rounded-xl p-4 bg-card">
                  <p className="text-xl font-bold">{wert}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </section>

            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6">{b.andersTitel}</h2>
              <p className="mb-4">{b.andersP1}</p>
              <p>{b.andersP2}</p>
              <h3 className="text-xl font-serif font-bold mt-6 mb-2">{b.beispieleTitel}</h3>
              <ul className="list-disc pl-5 space-y-1">{b.beispiele.map((x) => <li key={x}>{x}</li>)}</ul>
            </section>

            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6">{b.wegTitel}</h2>
              <Tabelle kopf={b.wegKopf} zeilen={b.wege} />
              <p className="mt-4">{b.wegSatz}</p>
              <p className="text-xs text-muted-foreground mt-2">{c.hub.anfahrtHinweis}</p>
            </section>

            <section className="mb-16">
              <h2 id="menues" className="text-3xl font-serif font-bold mb-6 scroll-mt-24">{b.menuesTitel}</h2>
              <MenueKarten m={c.menue} lang={language} detail={false} />
              <p className="text-sm text-muted-foreground mt-4">
                {b.menuesHinweis} <LocalizedLink to="messe-muenchen" className="underline">{b.menuesHubLink}</LocalizedLink> {b.menuesUnd} <LocalizedLink to="speisekarte" className="underline">{c.hub.speisekarteLink}</LocalizedLink>.
              </p>
            </section>

            <section className="mb-16">
              <h2 className="text-3xl font-serif font-bold mb-6">{b.faqTitel}</h2>
              <div className="space-y-6">
                {b.faq.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-semibold text-lg mb-1">{f.q}</h3>
                    <p className="text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <AnfrageBlock titel={b.formTitel} lead={b.formLead} lang={language} />

            <p className="text-xs text-muted-foreground">{b.disclaimer}</p>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MesseBauma;
