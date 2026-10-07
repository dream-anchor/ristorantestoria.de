import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import LocalizedLink from "@/components/LocalizedLink";
import EmailLink, { EmailAddress } from "@/components/EmailLink";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { getLocalizedPath } from "@/config/routes";
import { FACTS } from "@/config/facts";
import { MaestroPakete } from "@/components/MaestroWidget";
import { messeContent, PREISE, eur, dauer, kalender, HOTELS_ZENTRAL, HOTELS_MESSE, type MesseTexte } from "./messeContent";

export const faqSchema = (faq: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const Tabelle = ({ kopf, zeilen }: { kopf: string[]; zeilen: (string | null)[][] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-border text-left">
          {kopf.map((k) => <th key={k} className="py-2 pr-4 font-semibold">{k}</th>)}
        </tr>
      </thead>
      <tbody>
        {zeilen.map((z, i) => (
          <tr key={i} className="border-b border-border/50 align-top">
            {z.map((c, j) => <td key={j} className="py-2 pr-4">{c ?? "–"}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const MenueKarten = ({ m, lang, detail }: { m: MesseTexte["menue"]; lang: Language; detail: boolean }) => (
  <div className="grid md:grid-cols-3 gap-6">
    {m.menues.map((menue) => (
      <div key={menue.key} className="border border-border rounded-xl p-6 bg-card flex flex-col">
        <h3 className="text-xl font-serif font-bold">{menue.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{menue.art}</p>
        <p className="text-2xl font-bold">{eur(PREISE[menue.key].menue, lang)} <span className="text-sm font-normal text-muted-foreground">{m.proPerson}</span></p>
        <p className="text-sm mb-4">{m.mitWein}: {eur(PREISE[menue.key].wein, lang)}</p>
        {detail && (
          <ul className="text-sm space-y-1 list-disc pl-5 mb-4 flex-grow">
            {menue.gaenge.map((g) => <li key={g}>{g}</li>)}
          </ul>
        )}
        <Button variant="outline" asChild className="mt-auto"><a href="#anfrage">{m.anfragen}</a></Button>
      </div>
    ))}
  </div>
);

const KONTAKT: Record<Language, { tel: string; mail: string }> = {
  de: { tel: "Telefon", mail: "E-Mail" },
  en: { tel: "Phone", mail: "Email" },
  it: { tel: "Telefono", mail: "E-mail" },
  fr: { tel: "Téléphone", mail: "E-mail" },
};

// ponytail: Kontaktwege statt Formular — es gibt in MAESTRO noch kein Messe-Anfrage-Widget.
// Sobald eines existiert, hier <MaestroWidget widgetId=… lang={language} anchorId="anfrage" /> einsetzen.
export const AnfrageBlock = ({ titel, lead, lang }: { titel: string; lead: string; lang: Language }) => (
  <section id="anfrage" className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12 text-center mb-16 scroll-mt-24">
    <h2 className="text-3xl font-serif font-bold mb-4">{titel}</h2>
    <p className="mb-8 opacity-90">{lead}</p>
    <div className="flex flex-wrap justify-center gap-6">
      <a href={`tel:${FACTS.phoneTel}`} className="flex items-center gap-2 hover:opacity-80"><Phone className="w-4 h-4" /> {KONTAKT[lang].tel}: {FACTS.phoneFormatted}</a>
      <EmailLink className="flex items-center gap-2 hover:opacity-80"><Mail className="w-4 h-4" /> <EmailAddress /></EmailLink>
      <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
    </div>
  </section>
);

const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2 id={id} className="text-3xl font-serif font-bold mb-6 scroll-mt-24">{children}</h2>
);

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
        <section className="bg-secondary/40 py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <p className="text-sm uppercase tracking-widest text-primary mb-3">{h.kicker}</p>
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">{h.h1}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-3xl">{h.intro}</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild><a href="#anfrage">{h.ctaAnfrage}</a></Button>
              <Button size="lg" variant="outline" asChild><a href="#menues">{h.ctaMenues}</a></Button>
            </div>
          </div>
        </section>
        <Navigation />

        <main className="container mx-auto px-4 py-12 flex-grow">
          <article className="max-w-5xl mx-auto">
            <BreadcrumbNav crumbs={[{ label: t.breadcrumb.home, href: language === "de" ? "/" : `/${language}/` }, { label: h.breadcrumb }]} />

            <section className="mb-16 border border-border rounded-xl p-6 bg-card">
              <h2 className="text-2xl font-serif font-bold mb-4">{h.blickTitel}</h2>
              <dl className="grid md:grid-cols-[14rem_1fr] gap-x-6 gap-y-2 text-sm">
                {h.blick.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="font-semibold">{k}</dt>
                    <dd className="text-muted-foreground mb-2 md:mb-0">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mb-16">
              <H2 id="menues">{h.menuesTitel}</H2>
              <p className="mb-6 text-muted-foreground">{h.menuesIntro}</p>
              <MenueKarten m={c.menue} lang={language} detail />
              {/* Zusatz: live aus MAESTRO (Kategorie messe); der statische Inhalt oben bleibt im Prerender-HTML. */}
              <div className="mt-8"><MaestroPakete kategorie="messe" lang={language} /></div>
              <p className="text-sm text-muted-foreground mt-4">{h.allergene} <LocalizedLink to="speisekarte" className="underline">{h.speisekarteLink}</LocalizedLink>.</p>
            </section>

            <section className="mb-16">
              <H2>{h.platzTitel}</H2>
              <p className="mb-6">{h.platzP1}</p>
              <h3 className="text-xl font-serif font-bold mb-2">{h.hausTitel}</h3>
              <p>{h.hausP}</p>
            </section>

            <section className="mb-16">
              <H2>{h.ablaufTitel}</H2>
              <ol className="grid md:grid-cols-4 gap-6">
                {h.ablauf.map(([titel, text], i) => (
                  <li key={titel} className="border border-border rounded-xl p-5 bg-card">
                    <span className="text-primary font-bold">{i + 1}</span>
                    <h3 className="font-semibold mb-1">{titel}</h3>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mb-16">
              <H2 id="anfahrt">{h.anfahrtTitel}</H2>
              <p className="font-semibold mb-4">{h.anfahrtLead}</p>
              <ol className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {h.schritte.map(([nr, titel, text]) => (
                  <li key={titel} className="border border-border rounded-xl p-4 bg-card">
                    <span className="inline-block w-7 h-7 rounded-full bg-primary text-primary-foreground text-center leading-7 text-sm font-bold mb-2">{nr}</span>
                    <p className="font-semibold">{titel}</p>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </li>
                ))}
              </ol>
              <p className="mb-6">{h.anfahrtSatz}</p>
              <Tabelle kopf={h.wegKopf} zeilen={h.wege} />
              <p className="text-xs text-muted-foreground mt-2">{h.anfahrtHinweis}</p>
            </section>

            <section className="mb-16 space-y-4">
              <p className="text-xs text-muted-foreground">{h.hotelStand}</p>
              <details className="border border-border rounded-xl p-4 bg-card">
                <summary className="font-serif font-bold text-lg cursor-pointer">{h.hotelsZentralTitel}</summary>
                <div className="mt-4"><Tabelle kopf={h.hotelsZentralKopf} zeilen={HOTELS_ZENTRAL.map(([n, a, m, min, taxi]) => [n, a, `${m} · ${dauer(language, min, false)}`, taxi && dauer(language, taxi, false)])} /></div>
              </details>
              <details className="border border-border rounded-xl p-4 bg-card">
                <summary className="font-serif font-bold text-lg cursor-pointer">{h.hotelsMesseTitel}</summary>
                <p className="mt-4 text-sm">{h.hotelsMesseLead}</p>
                <div className="mt-4"><Tabelle kopf={h.hotelsMesseKopf} zeilen={HOTELS_MESSE.map(([n, a, oepnv, linie, taxi]) => [n, a, `${dauer(language, oepnv, false)}${linie ? ` (${linie})` : ""}`, dauer(language, taxi, false)])} /></div>
              </details>
            </section>

            <section className="mb-16 grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-3">{h.nachTitel}</h2>
                <p>{h.nachP}</p>
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold mb-3">{h.planTitel}</h2>
                <p>{h.planP}</p>
              </div>
            </section>

            <section className="mb-16">
              <H2>{h.naechsteTitel}</H2>
              <p className="text-xs text-muted-foreground mb-4">{h.naechsteStand}</p>
              <div className="grid md:grid-cols-3 gap-6">
                {h.naechste.map((m) => (
                  <div key={m.id} className="border border-border rounded-xl p-6 bg-card">
                    <h3 className="text-xl font-serif font-bold">{m.name}</h3>
                    <p className="text-sm text-muted-foreground">{m.branche}</p>
                    <p className="font-semibold my-2">{m.termin}</p>
                    <p className="text-sm mb-3">{m.text}</p>
                    {m.id === "bauma"
                      ? <LocalizedLink to="messe-muenchen/bauma" className="text-primary underline text-sm">{m.link}</LocalizedLink>
                      : <a href="#messekalender" className="text-primary underline text-sm">{m.link}</a>}
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-16">
              <H2 id="messekalender">{h.kalenderTitel}</H2>
              <p className="mb-4 text-muted-foreground">{h.kalenderLead}</p>
              <Tabelle kopf={h.kalenderKopf} zeilen={kalender(language).map((k) => [k.monat, k.name, k.branche, k.turnus])} />
              <Button className="mt-6" asChild><a href="#anfrage">{h.kalenderCta}</a></Button>
            </section>

            <section className="mb-16">
              <H2>{h.faqTitel}</H2>
              <div className="space-y-6">
                {h.faq.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-semibold text-lg mb-1">{f.q}</h3>
                    <p className="text-muted-foreground">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

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
