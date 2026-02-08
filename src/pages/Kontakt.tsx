import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ConsentGoogleMaps from "@/components/ConsentGoogleMaps";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import BackToLandingPage from "@/components/BackToLandingPage";
import StaticBotContent from "@/components/StaticBotContent";
import OpenStatusBadge from "@/components/OpenStatusBadge";
import { Phone, Mail, MapPin, Clock, MessageCircle, Car, Train, Landmark, Building, GraduationCap, Navigation as NavigationIcon, ParkingSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Kontakt = () => {
  const { t, language } = useLanguage();
  usePrerenderReady(true);

  // SEO titles and descriptions per language
  const seoContent = {
    de: {
      title: 'Kontakt & Anfahrt – Pizza Maxvorstadt',
      description: 'STORIA München Kontakt: Karlstraße 47a, Maxvorstadt. Nähe Hauptbahnhof, Königsplatz & TU München. Öffnungszeiten Mo-Fr 9-1 Uhr. Jetzt anrufen: +49 89 51519696!',
      h1: 'Kontakt & Anfahrt – Italiener nahe Königsplatz München',
      intro: 'Besuchen Sie uns in der Karlstraße 47a – zentral in der Maxvorstadt, nur wenige Gehminuten vom Hauptbahnhof, Königsplatz und der TU München entfernt.',
      nearLocation: 'Nähe Königsplatz & Hauptbahnhof',
      callNow: 'Jetzt anrufen',
      getDirections: 'Route planen',
      parking: 'Parkmöglichkeiten',
      publicTransport: 'Öffentliche Verkehrsmittel',
      nearby: 'In der Nähe',
    },
    en: {
      title: 'Contact & Directions – Italian Restaurant Munich',
      description: 'STORIA Munich contact: Karlstraße 47a, Maxvorstadt. Near main station, Königsplatz & TU Munich. Open Mon-Fri 9am-1am. Call now: +49 89 51519696!',
      h1: 'Contact & Directions – Italian Restaurant near Königsplatz Munich',
      intro: 'Visit us at Karlstraße 47a – centrally located in Maxvorstadt, just a few minutes walk from the main station, Königsplatz and TU Munich.',
      nearLocation: 'Near Königsplatz & main station',
      callNow: 'Call now',
      getDirections: 'Get directions',
      parking: 'Parking options',
      publicTransport: 'Public transport',
      nearby: 'Nearby',
    },
    it: {
      title: 'Contatto & Come Raggiungerci – Ristorante Italiano Monaco',
      description: 'STORIA Monaco contatto: Karlstraße 47a, Maxvorstadt. Vicino alla stazione centrale, Königsplatz & TU Monaco. Aperto Lun-Ven 9-1. Chiamaci: +49 89 51519696!',
      h1: 'Contatto & Come Raggiungerci – Ristorante Italiano vicino Königsplatz Monaco',
      intro: 'Visitateci in Karlstraße 47a – posizione centrale a Maxvorstadt, a pochi minuti a piedi dalla stazione centrale, Königsplatz e TU Monaco.',
      nearLocation: 'Vicino Königsplatz & stazione centrale',
      callNow: 'Chiama ora',
      getDirections: 'Indicazioni stradali',
      parking: 'Parcheggio',
      publicTransport: 'Trasporto pubblico',
      nearby: 'Nelle vicinanze',
    },
    fr: {
      title: 'Contact & Itinéraire – Restaurant Italien Munich',
      description: 'STORIA Munich contact: Karlstraße 47a, Maxvorstadt. Près de la gare centrale, Königsplatz & TU Munich. Ouvert Lun-Ven 9h-1h. Appelez: +49 89 51519696!',
      h1: 'Contact & Itinéraire – Restaurant Italien près de Königsplatz Munich',
      intro: 'Rendez-nous visite au Karlstraße 47a – au centre de Maxvorstadt, à quelques minutes à pied de la gare centrale, Königsplatz et TU Munich.',
      nearLocation: 'Près de Königsplatz & gare centrale',
      callNow: 'Appelez maintenant',
      getDirections: 'Itinéraire',
      parking: 'Parking',
      publicTransport: 'Transports en commun',
      nearby: 'À proximité',
    },
  };

  const content = seoContent[language as keyof typeof seoContent] || seoContent.de;

  return (
    <>
      <StaticBotContent
        title={content.title}
        description={content.description}
        sections={[
          { heading: t.contact.openingHours, content: [`${t.contact.monFri}: 09:00 - 01:00`, `${t.contact.satSun}: 12:00 - 01:00`] },
          { heading: t.contact.address, content: content.intro }
        ]}
      />
      <SEO
        title={content.title}
        description={content.description}
        canonical="/kontakt"
      />
      <StructuredData type="restaurant" />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.contact.title, url: '/kontakt' }
        ]}
      />
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
          <BackToLandingPage />
          <h1 className="text-4xl font-bold mb-4 text-center">
            {content.h1}
          </h1>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            {content.intro}
          </p>

          {/* Prominente CTA Buttons mit Glow-Effekt */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="tel:+498951519696"
              className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground
                         px-8 py-4 rounded-2xl text-lg font-medium
                         shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40
                         hover:scale-105 transition-all duration-300"
            >
              <Phone className="h-6 w-6" />
              {content.callNow}
            </a>
            <a
              href="https://maps.google.com/?q=Karlstraße+47a,+80333+München"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-secondary text-secondary-foreground
                         border-2 border-primary/20
                         px-8 py-4 rounded-2xl text-lg font-medium
                         hover:bg-secondary/80 hover:border-primary/40
                         hover:scale-105 transition-all duration-300"
            >
              <NavigationIcon className="h-6 w-6" />
              {content.getDirections}
            </a>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Card - Glassmorphism Style */}
            <div className="bg-gradient-to-br from-card/80 to-card backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold">{t.contact.contactUs}</h2>
                <OpenStatusBadge />
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t.contact.phone}</p>
                    <a href="tel:+498951519696" className="text-muted-foreground hover:text-primary transition-colors">
                      +49 89 51519696
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t.contact.email}</p>
                    <a href="mailto:info@ristorantestoria.de" className="text-muted-foreground hover:text-primary transition-colors">
                      info@ristorantestoria.de
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#25D366]/10 rounded-xl">
                    <MessageCircle className="h-5 w-5 text-[#25D366]" />
                  </div>
                  <div>
                    <p className="font-medium">{t.contact.whatsapp}</p>
                    <a
                      href="https://wa.me/491636033912"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#25D366] transition-colors"
                    >
                      {t.contact.whatsappChat}
                    </a>
                    <p className="text-sm text-muted-foreground/70 mt-0.5">{t.contact.whatsappHint}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{t.contact.address}</p>
                    <p className="text-muted-foreground">
                      Karlstr. 47a<br />
                      80333 München
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1 italic">
                      {content.nearLocation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Opening Hours Card - Glassmorphism Style */}
            <div className="bg-gradient-to-br from-card/80 to-card backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-serif font-bold mb-6">{t.contact.openingHours}</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-3 pb-3 border-b border-border/50">
                      <span className="font-medium">{t.contact.monFri}</span>
                      <span className="text-muted-foreground font-mono">09:00 - 01:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t.contact.satSun}</span>
                      <span className="text-muted-foreground font-mono">12:00 - 01:00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-secondary/50 rounded-xl border border-secondary">
                <h3 className="font-semibold mb-2">{t.contact.breakfast}</h3>
                <p className="text-sm text-muted-foreground">{t.contact.breakfastHours}</p>
              </div>

              {/* In der Nähe - Local SEO */}
              <div className="mt-8">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary" />
                  {content.nearby}
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Landmark className="h-4 w-4 text-primary/70" />
                    <span>Königsplatz (5 Min.)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4 text-primary/70" />
                    <span>Pinakotheken (8 Min.)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4 text-primary/70" />
                    <span>TU München (10 Min.)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Train className="h-4 w-4 text-primary/70" />
                    <span>Hauptbahnhof (7 Min.)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progressive Disclosure: Parking & Transit Accordion */}
          <div className="max-w-4xl mx-auto mt-8">
            <Accordion type="single" collapsible className="bg-gradient-to-br from-card/80 to-card backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
              <AccordionItem value="parking" className="border-b border-border/50">
                <AccordionTrigger className="px-8 py-5 text-lg font-medium hover:no-underline hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    {content.parking}
                  </div>
                </AccordionTrigger>
                <AccordionContent forceMount className="px-8 pb-6 text-muted-foreground data-[state=closed]:hidden">
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-4">
                      <ParkingSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Parkhaus Marsstraße (P22)</p>
                        <p className="text-sm">Hirtenstraße 14 &bull; 5 Min. Fußweg &bull; 750 Plätze &bull; 24h geöffnet</p>
                        <p className="text-sm text-muted-foreground/70 mt-1">€4,00/Stunde, max. €40/Tag</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Straßenparkplätze</p>
                        <p className="text-sm">Augustenstraße, Gabelsbergerstraße, Theresienstraße (kostenpflichtig)</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="transit" className="border-none">
                <AccordionTrigger className="px-8 py-5 text-lg font-medium hover:no-underline hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Train className="h-5 w-5 text-primary" />
                    </div>
                    {content.publicTransport}
                  </div>
                </AccordionTrigger>
                <AccordionContent forceMount className="px-8 pb-6 text-muted-foreground data-[state=closed]:hidden">
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#0065ae] text-white text-xs font-bold px-2.5 py-1.5 rounded flex-shrink-0">U</div>
                      <div>
                        <p className="font-medium text-foreground">U-Bahn Königsplatz (U2, U8)</p>
                        <p className="text-sm">3 Minuten Fußweg &bull; Ausgang Arcisstraße</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-[#408335] text-white text-xs font-bold px-2.5 py-1.5 rounded flex-shrink-0">S</div>
                      <div>
                        <p className="font-medium text-foreground">S-Bahn Hauptbahnhof (alle Linien)</p>
                        <p className="text-sm">7 Minuten Fußweg &bull; Ausgang Arnulfstraße</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-[#eb690b] text-white text-xs font-bold px-2.5 py-1.5 rounded flex-shrink-0">Tram</div>
                      <div>
                        <p className="font-medium text-foreground">Tram 27/28 Karolinenplatz</p>
                        <p className="text-sm">4 Minuten Fußweg</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Google Maps */}
          <div id="map" className="max-w-4xl mx-auto mt-8">
            <div className="bg-gradient-to-br from-card/80 to-card backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
              <ConsentGoogleMaps
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2662.063!2d11.5628!3d48.1447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479e75f0a0c3c6e7%3A0x8c0b2b0b0b0b0b0b!2sKarlstra%C3%9Fe%2047a%2C%2080333%20M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1700000000000!5m2!1sde!2sde"
                height={400}
                title="STORIA Ristorante Standort"
                className="w-full"
              />
            </div>
          </div>

          <ReservationCTA />

          {/* LLM-optimierter Kontext für AI-Suchmaschinen */}
          <section
            id="llm-context"
            className="sr-only"
            aria-label="Kontakt und Anfahrt für Suchmaschinen"
          >
            <h2>STORIA Restaurant München - Kontakt & Anfahrt</h2>
            <dl>
              <dt>Adresse</dt>
              <dd>Karlstraße 47a, 80333 München, Deutschland</dd>
              <dt>Stadtteil</dt>
              <dd>Maxvorstadt, zwischen Königsplatz und Hauptbahnhof</dd>
              <dt>Telefon</dt>
              <dd>+49 89 51519696</dd>
              <dt>WhatsApp</dt>
              <dd>+49 163 6033912</dd>
              <dt>E-Mail</dt>
              <dd>info@ristorantestoria.de</dd>
              <dt>Öffnungszeiten</dt>
              <dd>Montag-Freitag 09:00-01:00 Uhr, Samstag-Sonntag 12:00-01:00 Uhr</dd>
              <dt>ÖPNV-Anbindung</dt>
              <dd>U-Bahn Königsplatz (U2, U8) 3 Minuten, Hauptbahnhof (alle Linien) 7 Minuten, Tram 27/28 Karolinenplatz 4 Minuten</dd>
              <dt>Parken</dt>
              <dd>Parkhaus Marsstraße (P22), Hirtenstraße 14, 750 Stellplätze, 24h geöffnet, 5 Minuten Fußweg, €4/Stunde max €40/Tag</dd>
              <dt>Barrierefreiheit</dt>
              <dd>Ebenerdig, rollstuhlgerecht, breiter Eingang</dd>
              <dt>Reservierung</dt>
              <dd>Online über OpenTable oder telefonisch. Am Wochenende empfohlen.</dd>
              <dt>Koordinaten</dt>
              <dd>48.1456, 11.5656</dd>
              <dt>In der Nähe</dt>
              <dd>Königsplatz 5 Min, Pinakotheken 8 Min, TU München 10 Min, Hauptbahnhof 7 Min</dd>
            </dl>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Kontakt;
