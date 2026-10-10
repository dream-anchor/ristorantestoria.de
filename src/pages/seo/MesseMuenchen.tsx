import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import LocalizedLink from "@/components/LocalizedLink";
import { Button } from "@/components/ui/button";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { getLocalizedPath } from "@/config/routes";
import MaestroWidget, { MaestroPakete, useMaestroGesendet, useMaestroTitel } from "@/components/MaestroWidget";
import heroBild from "@/assets/firmenfeier-eventlocation-storia-muenchen.webp";
import heroBild600 from "@/assets/firmenfeier-eventlocation-storia-muenchen-600w.webp";
import { messeContent, PREISE, eur, dauer, kalender, HOTELS_ZENTRAL, HOTELS_MESSE, type MesseTexte } from "./messeContent";

export const faqSchema = (faq: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2 id={id} className="text-2xl md:text-[30px] leading-tight font-serif font-bold mb-6 scroll-mt-24">{children}</h2>
);

export const Tabelle = ({ kopf, zeilen }: { kopf: string[]; zeilen: (string | null)[][] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-[15px] border-collapse bg-card border border-border rounded overflow-hidden">
      <thead>
        <tr className="text-left bg-muted">
          {kopf.map((k) => <th key={k} className="px-3 py-3 text-sm font-semibold border-b border-border">{k}</th>)}
        </tr>
      </thead>
      <tbody>
        {zeilen.map((z, i) => (
          <tr key={i} className="border-b border-border last:border-0 align-top">
            {z.map((c, j) => <td key={j} className="px-3 py-3">{c ?? "–"}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const knopf = "h-auto px-6 py-3 text-sm uppercase tracking-[.1em] font-semibold rounded";

export const Hero = ({ kicker, h1, intro, ctaAnfrage, ctaMenues, bild, bild600, alt }: { kicker: string; h1: string; intro: string; ctaAnfrage: string; ctaMenues: string; bild: string; bild600: string; alt: string }) => (
  <section className="py-8 md:py-14 font-sans">
    <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-[1.1fr_.9fr] gap-6 md:gap-10 items-center">
      <img src={bild} srcSet={`${bild600} 600w, ${bild} 1200w`} sizes="(min-width: 768px) 440px, 100vw" alt={alt} className="w-full aspect-[16/10] md:aspect-[4/3] object-cover rounded md:order-2" loading="eager" fetchPriority="high" />
      <div>
        <p className="font-display text-xl text-muted-foreground mb-2">{kicker}</p>
        <h1 className="text-[30px] md:text-[44px] leading-tight font-serif font-bold mb-5">{h1}</h1>
        <p className="text-base md:text-lg mb-8">{intro}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className={knopf}><a href="#anfrage">{ctaAnfrage}</a></Button>
          <Button variant="outline" asChild className={`${knopf} border-primary text-primary bg-transparent hover:bg-primary/5 hover:text-primary`}><a href="#menues">{ctaMenues}</a></Button>
        </div>
      </div>
    </div>
  </section>
);

export const Zitat = ({ children }: { children: React.ReactNode }) => (
  <p className="font-display text-[22px] md:text-[26px] leading-snug border-l-4 border-foreground/70 pl-5 my-6">{children}</p>
);

const Plus = () => (
  <span aria-hidden className="text-xl leading-none text-muted-foreground shrink-0"><span className="group-open:hidden">+</span><span className="hidden group-open:inline">–</span></span>
);
const summaryKlasse = "flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4";

export const Aufklapper = ({ titel, children }: { titel: string; children: React.ReactNode }) => (
  <details className="group bg-card border border-border rounded">
    <summary className={summaryKlasse}><h3 className="font-serif font-semibold text-lg">{titel}</h3><Plus /></summary>
    <div className="px-5 pb-5">{children}</div>
  </details>
);

export const Faq = ({ titel, faq }: { titel: string; faq: { q: string; a: string }[] }) => (
  <section className="mb-16">
    <H2>{titel}</H2>
    <div className="space-y-2">
      {faq.map((f) => <Aufklapper key={f.q} titel={f.q}><p>{f.a}</p></Aufklapper>)}
    </div>
  </section>
);

export const MenueKarten = ({ m, lang, detail }: { m: MesseTexte["menue"]; lang: Language; detail: boolean }) => (
  <div className="grid md:grid-cols-3 gap-6">
    {m.menues.map((menue) => (
      <div key={menue.key} className="border border-border rounded p-5 bg-card flex flex-col">
        <h3 className="text-[22px] font-serif font-semibold">{menue.name}</h3>
        <p className="text-xs uppercase tracking-[.1em] text-muted-foreground mb-3">{detail ? m.gaenge4 : menue.art}</p>
        <p className="mb-3"><span className="text-[30px] font-serif font-semibold">{eur(PREISE[menue.key].menue, lang)}</span> <span className="text-xs text-muted-foreground">{m.proPerson}</span></p>
        {detail && (
          <ul className="text-sm space-y-1 list-disc pl-5 mb-4">
            {menue.gaenge.map((g) => <li key={g}>{g}</li>)}
          </ul>
        )}
        <p className="text-xs text-muted-foreground mt-auto mb-3">{m.mitWein} {eur(PREISE[menue.key].wein, lang)} {m.proPerson.replace(/,?\s*(inkl|incl|IVA|TVA)\b.*$/, "")}</p>
        <Button asChild className={`${knopf} w-full`}><a href="#anfrage">{m.anfragen}</a></Button>
      </div>
    ))}
  </div>
);

// Datenschutzhinweis am Formular (Art. 13 DSGVO); das Widget selbst zeigt keinen.
const DATENSCHUTZ: Record<Language, [string, string]> = {
  de: ["Wir verwenden Ihre Angaben nur, um Ihre Anfrage zu bearbeiten. Mehr dazu in unserer ", "Datenschutzerklärung"],
  en: ["We only use your details to process your request. More in our ", "privacy policy"],
  it: ["Usiamo i vostri dati solo per elaborare la richiesta. Maggiori informazioni nella nostra ", "informativa sulla privacy"],
  fr: ["Nous utilisons vos données uniquement pour traiter votre demande. Plus d'informations dans notre ", "politique de confidentialité"],
};

// MAESTRO-Formular „Messe“ je Sprache (sql/683, Eingang ristorante_messe).
const MESSE_FORMULAR: Record<Language, string> = {
  de: "33f98d2a-ace2-4c66-838a-020e6fe93c73",
  en: "9af74aa4-a736-458e-914e-504736fde102",
  it: "5190e994-5860-439a-839d-e472cf08fd38",
  fr: "23d6fb27-59a7-48ef-a42f-89e033bfdc02",
};

export const AnfrageBlock = ({ titel, lead, lang }: { titel: string; lead: string; lang: Language }) => {
  const anzeigeTitel = useMaestroTitel(titel, lang);
  const gesendet = useMaestroGesendet();
  return (
  <section id="anfrage" className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center mb-16 scroll-mt-24">
    <h2 className="text-3xl font-serif font-bold mb-4">{anzeigeTitel}</h2>
    {!gesendet && <p className="mb-8 opacity-90">{lead}</p>}
    <div className="bg-background text-foreground rounded-xl p-4 md:p-8 text-left">
      <MaestroWidget widgetId={MESSE_FORMULAR[lang]} lang={lang} anchorId="messe-formular" />
    </div>
    <p className="mt-6 text-sm opacity-90">
      {DATENSCHUTZ[lang][0]}<LocalizedLink to="datenschutz" className="underline">{DATENSCHUTZ[lang][1]}</LocalizedLink>.
    </p>
  </section>
  );
};

const MesseMuenchen = () => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);
  const c = messeContent[language];
  const h = c.hub;
  const pfad = getLocalizedPath("messe-muenchen", language);

  return (
    <>
      <SEO title={h.seoTitle} description={h.seoDescription} canonical={pfad} />
      <StructuredData type="restaurant" />
      <StructuredData type="breadcrumb" breadcrumbs={[{ name: t.breadcrumb.home, url: language === "de" ? "/" : `/${language}/` }, { name: h.breadcrumb, url: pfad }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(h.faq)) }} />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Hero kicker={h.kicker} h1={h.h1} intro={h.intro} ctaAnfrage={h.ctaAnfrage} ctaMenues={h.ctaMenues} bild={heroBild} bild600={heroBild600} alt={`STORIA, Karlstraße 47a – ${h.kicker}`} />
        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto font-sans">
            <BreadcrumbNav crumbs={[{ label: t.breadcrumb.home, href: language === "de" ? "/" : `/${language}/` }, { label: h.breadcrumb }]} />

            <section className="mb-16 border border-border rounded p-6 bg-card">
              <h2 className="text-2xl font-serif font-bold mb-4">{h.blickTitel}</h2>
              <dl className="grid md:grid-cols-[200px_1fr] gap-x-6 gap-y-2 text-[15px]">
                {h.blick.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="font-semibold">{k}</dt>
                    <dd className="mb-2 md:mb-0">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mb-16">
              <H2 id="menues">{h.menuesTitel}</H2>
              <p className="mb-6 text-muted-foreground">{h.menuesIntro}</p>
              {/* Live aus MAESTRO (Kategorie messe); die statischen Karten sind der Fallback im Prerender-HTML. */}
              <MaestroPakete kategorie="messe" lang={language}><MenueKarten m={c.menue} lang={language} detail /></MaestroPakete>
              <p className="text-sm text-muted-foreground mt-4">{h.allergene} <LocalizedLink to="speisekarte" className="underline">{h.speisekarteLink}</LocalizedLink>.</p>
            </section>

            <section className="mb-16">
              <H2>{h.platzTitel}</H2>
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <p>{h.platzP1}</p>
                <div className="border border-border rounded p-6 bg-card">
                  <h3 className="text-lg font-serif font-semibold mb-2">{h.hausTitel}</h3>
                  <p>{h.hausP}</p>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <H2>{h.ablaufTitel}</H2>
              <ol className="list-decimal pl-5 space-y-2">
                {h.ablauf.map(([titel, text]) => (
                  <li key={titel}><strong>{titel}:</strong> {text}</li>
                ))}
              </ol>
            </section>

            <section className="mb-16">
              <H2 id="anfahrt">{h.anfahrtTitel}</H2>
              <p className="text-muted-foreground -mt-4 mb-4">{h.anfahrtLead}</p>
              <ol className="grid sm:grid-cols-4 gap-4 sm:gap-0 my-6">
                {h.schritte.map(([nr, titel, text], i) => (
                  <li key={titel} className="relative grid grid-cols-[46px_1fr] gap-3 items-center sm:block sm:text-center sm:px-2">
                    {i < h.schritte.length - 1 && <span aria-hidden className="sm:hidden absolute left-[22px] top-[23px] -bottom-4 w-[3px] bg-foreground" />}
                    {i > 0 && <span aria-hidden className="hidden sm:block absolute top-[22px] -left-1/2 w-full h-[3px] bg-foreground" />}
                    <span className={`relative z-10 w-[46px] h-[46px] rounded-full border-2 border-foreground grid place-items-center text-sm font-semibold sm:mx-auto sm:mb-2.5 ${nr === "S" ? "bg-foreground text-background" : "bg-card"}`}>{nr}</span>
                    <div>
                      <p className="font-semibold">{titel}</p>
                      <p className="text-[13px] text-muted-foreground">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Zitat>{h.anfahrtSatz}</Zitat>
              <Tabelle kopf={h.wegKopf} zeilen={h.wege} />
              <p className="text-xs text-muted-foreground mt-2">{h.anfahrtHinweis}</p>
            </section>

            <section className="mb-16 space-y-2">
              <p className="text-xs text-muted-foreground mb-2">{h.hotelStand}</p>
              <Aufklapper titel={h.hotelsZentralTitel}>
                <Tabelle kopf={h.hotelsZentralKopf} zeilen={HOTELS_ZENTRAL.map(([n, a, m, min, taxi]) => [n, a, `${m} · ${dauer(language, min, false)}`, taxi && dauer(language, taxi, false)])} />
              </Aufklapper>
              <Aufklapper titel={h.hotelsMesseTitel}>
                <p className="mb-4 text-sm">{h.hotelsMesseLead}</p>
                <Tabelle kopf={h.hotelsMesseKopf} zeilen={HOTELS_MESSE.map(([n, a, oepnv, linie, taxi]) => [n, a, `${dauer(language, oepnv, false)}${linie ? ` (${linie})` : ""}`, dauer(language, taxi, false)])} />
              </Aufklapper>
            </section>

            <section className="mb-16 grid md:grid-cols-2 gap-8">
              <div className="border border-border rounded p-6 bg-card">
                <h2 className="text-2xl md:text-[30px] leading-tight font-serif font-bold mb-3">{h.nachTitel}</h2>
                <p>{h.nachP}</p>
              </div>
              <div className="border border-border rounded p-6 bg-card">
                <h2 className="text-2xl md:text-[30px] leading-tight font-serif font-bold mb-3">{h.planTitel}</h2>
                <p>{h.planP}</p>
              </div>
            </section>

            <section className="mb-16">
              <H2>{h.naechsteTitel}</H2>
              <p className="inline-block text-xs text-muted-foreground bg-secondary border border-border rounded-full px-3 py-1 -mt-2 mb-4">{h.naechsteStand}</p>
              <div className="grid md:grid-cols-3 gap-4">
                {h.naechste.map((m) => (
                  <div key={m.id} className="border border-border rounded p-5 bg-card">
                    <h3 className="text-xl font-serif font-semibold">{m.name}</h3>
                    <p className="text-[13px] text-muted-foreground">{m.branche} · {m.termin}</p>
                    <p className="my-3">{m.text}</p>
                    {m.id === "bauma"
                      ? <LocalizedLink to="messe-muenchen/bauma" className="text-primary underline">{m.link}</LocalizedLink>
                      : <a href="#messekalender" className="text-primary underline">{m.link}</a>}
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-16">
              <H2 id="messekalender">{h.kalenderTitel}</H2>
              <p className="mb-4 text-muted-foreground">{h.kalenderLead}</p>
              <Tabelle kopf={h.kalenderKopf} zeilen={kalender(language).map((k) => [k.monat, k.name, k.branche, k.turnus])} />
              <Button className={`${knopf} mt-6`} asChild><a href="#anfrage">{h.kalenderCta}</a></Button>
            </section>

            <Faq titel={h.faqTitel} faq={h.faq} />

            <AnfrageBlock titel={h.formTitel} lead={h.formLead} lang={language} />

            <section className="mb-8">
              <h2 className="text-xl font-serif font-bold mb-3">{h.weiter}</h2>
              <ul className="flex flex-wrap gap-4">
                {h.links.map(([slug, label]) => <li key={slug}><LocalizedLink to={slug} className="text-primary underline">{label}</LocalizedLink></li>)}
              </ul>
            </section>

            <p className="text-xs text-muted-foreground">{h.disclaimer}</p>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MesseMuenchen;
