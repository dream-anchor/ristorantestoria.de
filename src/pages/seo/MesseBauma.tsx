import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { getLocalizedPath } from "@/config/routes";
import { messeContent } from "./messeContent";
import heroBild from "@/assets/business-lunch-food.webp";
import heroBild600 from "@/assets/business-lunch-food-600w.webp";
import { faqSchema, Tabelle, MenueKarten, AnfrageBlock, Hero, Zitat, Faq, H2 } from "./MesseMuenchen";

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
        <Hero kicker={b.kicker} h1={b.h1} intro={b.intro} ctaAnfrage={b.ctaAnfrage} ctaMenues={b.ctaMenues} bild={heroBild} bild600={heroBild600} alt={`STORIA, Karlstraße 47a – ${b.kicker}`} />
        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto font-sans">
            <BreadcrumbNav crumbs={[{ label: t.breadcrumb.home, href: home }, { label: c.hub.breadcrumb, href: hub }, { label: b.breadcrumb }]} />

            <section className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border rounded overflow-hidden">
              {b.zahlen.map(([wert, text]) => (
                <div key={wert} className="bg-card p-4 md:p-5">
                  <p className="text-xl md:text-2xl font-serif font-semibold mb-1">{wert}</p>
                  <p className="text-[13px] text-muted-foreground">{text}</p>
                </div>
              ))}
            </section>

            <section className="mb-16">
              <H2>{b.andersTitel}</H2>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <p className="mb-4">{b.andersP1}</p>
                  <p>{b.andersP2}</p>
                </div>
                <div className="border border-border rounded p-6 bg-card">
                  <h3 className="text-lg font-serif font-semibold mb-2">{b.beispieleTitel}</h3>
                  <ul className="list-disc pl-5 space-y-1">{b.beispiele.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <H2>{b.wegTitel}</H2>
              <Tabelle kopf={b.wegKopf} zeilen={b.wege} />
              <Zitat>{b.wegSatz}</Zitat>
              <p className="text-xs text-muted-foreground mt-2">{c.hub.anfahrtHinweis}</p>
            </section>

            <section className="mb-16">
              <H2 id="menues">{b.menuesTitel}</H2>
              <MenueKarten m={c.menue} lang={language} detail={false} />
              <p className="text-sm text-muted-foreground mt-4">
                {b.menuesHinweis} <LocalizedLink to="messe-muenchen" className="underline">{b.menuesHubLink}</LocalizedLink> {b.menuesUnd} <LocalizedLink to="speisekarte" className="underline">{c.hub.speisekarteLink}</LocalizedLink>.
              </p>
            </section>

            <Faq titel={b.faqTitel} faq={b.faq} />

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
