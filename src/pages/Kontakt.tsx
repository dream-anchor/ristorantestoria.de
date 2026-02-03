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
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
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
    },
    en: {
      title: 'Contact & Directions – Italian Restaurant Munich',
      description: 'STORIA Munich contact: Karlstraße 47a, Maxvorstadt. Near main station, Königsplatz & TU Munich. Open Mon-Fri 9am-1am. Call now: +49 89 51519696!',
      h1: 'Contact & Directions – Italian Restaurant near Königsplatz Munich',
      intro: 'Visit us at Karlstraße 47a – centrally located in Maxvorstadt, just a few minutes walk from the main station, Königsplatz and TU Munich.',
      nearLocation: 'Near Königsplatz & main station',
    },
    it: {
      title: 'Contatto & Come Raggiungerci – Ristorante Italiano Monaco',
      description: 'STORIA Monaco contatto: Karlstraße 47a, Maxvorstadt. Vicino alla stazione centrale, Königsplatz & TU Monaco. Aperto Lun-Ven 9-1. Chiamaci: +49 89 51519696!',
      h1: 'Contatto & Come Raggiungerci – Ristorante Italiano vicino Königsplatz Monaco',
      intro: 'Visitateci in Karlstraße 47a – posizione centrale a Maxvorstadt, a pochi minuti a piedi dalla stazione centrale, Königsplatz e TU Monaco.',
      nearLocation: 'Vicino Königsplatz & stazione centrale',
    },
    fr: {
      title: 'Contact & Itinéraire – Restaurant Italien Munich',
      description: 'STORIA Munich contact: Karlstraße 47a, Maxvorstadt. Près de la gare centrale, Königsplatz & TU Munich. Ouvert Lun-Ven 9h-1h. Appelez: +49 89 51519696!',
      h1: 'Contact & Itinéraire – Restaurant Italien près de Königsplatz Munich',
      intro: 'Rendez-nous visite au Karlstraße 47a – au centre de Maxvorstadt, à quelques minutes à pied de la gare centrale, Königsplatz et TU Munich.',
      nearLocation: 'Près de Königsplatz & gare centrale',
    },
  };

  const content = seoContent[language] || seoContent.de;

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
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-6">{t.contact.contactUs}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">{t.contact.phone}</p>
                    <a href="tel:+498951519696" className="text-muted-foreground hover:text-primary">
                      +49 89 51519696
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium">{t.contact.email}</p>
                    <a href="mailto:info@ristorantestoria.de" className="text-muted-foreground hover:text-primary">
                      info@ristorantestoria.de
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-[#25D366] mt-1" />
                  <div>
                    <p className="font-medium">{t.contact.whatsapp}</p>
                    <a 
                      href="https://wa.me/491636033912" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#25D366]"
                    >
                      {t.contact.whatsappChat}
                    </a>
                    <p className="text-sm text-muted-foreground/70 mt-0.5">{t.contact.whatsappHint}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
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

            <div className="bg-card p-8 rounded-lg border border-border">
              <h2 className="text-2xl font-serif font-bold mb-6">{t.contact.openingHours}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{t.contact.monFri}</span>
                      <span className="text-muted-foreground">09:00 - 01:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">{t.contact.satSun}</span>
                      <span className="text-muted-foreground">12:00 - 01:00</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-secondary rounded-lg">
                <h3 className="font-semibold mb-2">{t.contact.breakfast}</h3>
                <p className="text-sm text-muted-foreground">{t.contact.breakfastHours}</p>
              </div>

            </div>
          </div>

          {/* Google Maps */}
          <div id="map" className="max-w-4xl mx-auto mt-8">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
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
              <dd>U-Bahn Königsplatz (U2, U8) 3 Minuten, Hauptbahnhof (alle Linien) 7 Minuten</dd>
              <dt>Parken</dt>
              <dd>Parkhaus Marsstraße (P22), Hirtenstraße 14, 750 Stellplätze, 24h geöffnet, 5 Minuten Fußweg</dd>
              <dt>Barrierefreiheit</dt>
              <dd>Ebenerdig, rollstuhlgerecht, breiter Eingang</dd>
              <dt>Reservierung</dt>
              <dd>Online über OpenTable oder telefonisch. Am Wochenende empfohlen.</dd>
              <dt>Koordinaten</dt>
              <dd>48.1456, 11.5656</dd>
            </dl>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Kontakt;