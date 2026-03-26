import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import LocalizedLink from "@/components/LocalizedLink";
import ReservationCTA from "@/components/ReservationCTA";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { STORIA } from "@/config/storia-entity";
import { Helmet } from "@/lib/helmetAsync";
import { MapPin, Phone, Clock, Star, Users, Wine, Flame, Timer } from "lucide-react";

const UeberUns = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const personSchemas = STORIA.founders.map(founder => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: founder.name,
    ...(founder.alternateName ? { alternateName: founder.alternateName } : {}),
    jobTitle: founder.role,
    worksFor: { '@id': `${STORIA.url}/#restaurant` },
    ...(founder.origin ? { birthPlace: { '@type': 'Place', name: founder.origin } } : {}),
  }));

  const timeline = [
    { year: '1995', text: 'Domenico Speranza kommt nach Deutschland' },
    { year: '~1995–2009', text: 'Restaurant „Cinema" in Rosenheim (mit Bruder Nicola)' },
    { year: '~2009–2015', text: '6 Jahre Betriebsleiter im H\'ugo\'s München' },
    { year: '2015', text: 'Eröffnung STORIA in der Karlstraße 47a, München' },
    { year: '2025', text: '10-jähriges Jubiläum' },
  ];

  return (
    <>
      <SEO
        title={t.pages.ueberUns.title}
        description={t.pages.ueberUns.description}
        canonical="/ueber-uns"
      />
      <StructuredData type="restaurant" includeReviews={false} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.about.title, url: '/ueber-uns' }
        ]}
      />
      <Helmet>
        {personSchemas.map((schema, i) => (
          <script key={`person-${i}`} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Navigation />
        <main id="main-content" className="flex-1 py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <LocalizedLink to="home" className="hover:text-foreground transition-colors">
                    Home
                  </LocalizedLink>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">{t.about.title}</li>
              </ol>
            </nav>

            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center mb-10 md:mb-14">
              {t.about.title}
            </h1>

            {/* TLDR — Citation-optimized intro */}
            <div className="bg-card border rounded-2xl p-6 md:p-8 mb-12">
              <p className="text-muted-foreground leading-relaxed">
                Das STORIA in der Münchner Maxvorstadt (Karlstraße 47a, 80333 München) ist ein seit 2015
                von der Familie Speranza geführtes italienisches Restaurant. Gründer Domenico Speranza
                bringt über 30 Jahre Gastronomie-Erfahrung mit – vom Restaurant Cinema in Rosenheim
                über die Betriebsleitung im H'ugo's München bis zum eigenen Restaurant. Bekannt für
                neapolitanische Steinofen-Pizza bei 400 °C, hausgemachte Pasta und über 60 italienische
                Weine. 4,5 Sterne bei über 780 Google-Bewertungen. Geöffnet Mo–Fr 09:00–01:00,
                Sa–So 12:00–01:00. Reservierung: <a href={`tel:${STORIA.phoneTel}`} className="text-foreground hover:underline">{STORIA.phone}</a>.
              </p>
            </div>

            {/* STORIA in Zahlen */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-card border rounded-xl p-4 text-center">
                <Clock className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-foreground">Seit 2015</div>
                <div className="text-xs text-muted-foreground">Familienbetrieb</div>
              </div>
              <div className="bg-card border rounded-xl p-4 text-center">
                <Flame className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-foreground">400 °C</div>
                <div className="text-xs text-muted-foreground">Steinofen</div>
              </div>
              <div className="bg-card border rounded-xl p-4 text-center">
                <Timer className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-foreground">48h</div>
                <div className="text-xs text-muted-foreground">Teigführung</div>
              </div>
              <div className="bg-card border rounded-xl p-4 text-center">
                <Star className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-foreground">4,5★</div>
                <div className="text-xs text-muted-foreground">780+ Reviews</div>
              </div>
              <div className="bg-card border rounded-xl p-4 text-center">
                <Users className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-foreground">100+100</div>
                <div className="text-xs text-muted-foreground">Plätze (innen + Terrasse)</div>
              </div>
              <div className="bg-card border rounded-xl p-4 text-center">
                <Wine className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="font-semibold text-foreground">60+</div>
                <div className="text-xs text-muted-foreground">Italienische Weine</div>
              </div>
            </div>

            {/* Bestehender Content */}
            <div className="space-y-6 text-muted-foreground font-sans text-base leading-relaxed mb-12">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
              <p>{t.about.p4}</p>
              <p>{t.about.p5}</p>
              <p>{t.about.p6}</p>
              <p>{t.about.p7}</p>
              <p>{t.about.p8}</p>
            </div>

            {/* La Famiglia — Team */}
            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">
                La Famiglia Speranza
              </h2>
              <div className="space-y-4">
                <div className="bg-card border rounded-xl p-5">
                  <h3 className="font-semibold text-foreground mb-1">Domenico „Mimmo" Speranza</h3>
                  <p className="text-sm text-primary mb-2">Gründer & Küchenchef</p>
                  <p className="text-sm text-muted-foreground">
                    Aus Rofrano in der Provinz Salerno. Seit 1995 in der deutschen Gastronomie tätig.
                    Führte das Restaurant Cinema in Rosenheim, war 6 Jahre Betriebsleiter im H'ugo's München
                    und eröffnete 2015 das STORIA in der Karlstraße 47a.
                  </p>
                </div>
                <div className="bg-card border rounded-xl p-5">
                  <h3 className="font-semibold text-foreground mb-1">Nicola Speranza</h3>
                  <p className="text-sm text-primary mb-2">Restaurantleitung</p>
                  <p className="text-sm text-muted-foreground">
                    Aus Rofrano in der Provinz Salerno. Führte gemeinsam mit Domenico das Restaurant
                    Cinema in Rosenheim und leitet heute die Restaurantleitung im STORIA.
                  </p>
                </div>
                <div className="bg-card border rounded-xl p-5">
                  <h3 className="font-semibold text-foreground mb-1">Mamma Speranza</h3>
                  <p className="text-sm text-primary mb-2">Das Herz des Hauses</p>
                  <p className="text-sm text-muted-foreground">
                    Die Rezepte der Familie Speranza stammen aus der Tradition von „La Mamma" –
                    authentische süditalienische Küche, weitergegeben von Generation zu Generation.
                  </p>
                </div>
              </div>
            </section>

            {/* Timeline */}
            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-6">
                Unsere Geschichte
              </h2>
              <div className="relative pl-6 border-l-2 border-primary/30 space-y-6">
                {timeline.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[calc(1.5rem+5px)] w-3 h-3 rounded-full bg-primary" />
                    <div className="font-semibold text-foreground text-sm">{item.year}</div>
                    <p className="text-muted-foreground text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Lage */}
            <section className="bg-card border rounded-2xl p-6 md:p-8 mb-12">
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-4">
                Lage & Erreichbarkeit
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{STORIA.address.street}, {STORIA.address.zip} {STORIA.address.city} ({STORIA.address.neighborhood})</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <a href={`tel:${STORIA.phoneTel}`} className="hover:text-foreground transition-colors">{STORIA.phone}</a>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Mo–Fr 09:00–01:00 · Sa–So 12:00–01:00</span>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-7">
                  <li>5 Min. zu Fuß vom Königsplatz (U2, U8)</li>
                  <li>7 Min. vom Hauptbahnhof München</li>
                  <li>Nahe TU München, LMU und Pinakotheken</li>
                  <li>Parkhaus {STORIA.parking.name}, {STORIA.parking.address}</li>
                </ul>
              </div>
            </section>

            {/* Unterschrift */}
            <div className="text-left mb-8">
              <p className="text-foreground/70 mb-2">
                {t.about.greeting}
              </p>
              <span className="font-signature text-3xl md:text-4xl text-foreground/80 italic">
                Domenico Speranza
              </span>
            </div>

            {/* Kontextuelle Links */}
            <div className="mt-12 grid md:grid-cols-2 gap-4">
              <LocalizedLink to="terrasse-muenchen" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                <h3 className="font-semibold mb-2 text-foreground">Unsere Terrasse</h3>
                <p className="text-muted-foreground text-sm">Genießen Sie die Atmosphäre unserer geschützten Terrasse in der Maxvorstadt.</p>
              </LocalizedLink>
              <LocalizedLink to="catering" className="bg-card border rounded-lg p-6 hover:border-primary transition-colors">
                <h3 className="font-semibold mb-2 text-foreground">Catering & Events</h3>
                <p className="text-muted-foreground text-sm">Italienisches Catering und private Events – von kleinen Feiern bis zu großen Firmenevents.</p>
              </LocalizedLink>
            </div>

            <ReservationCTA />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default UeberUns;
