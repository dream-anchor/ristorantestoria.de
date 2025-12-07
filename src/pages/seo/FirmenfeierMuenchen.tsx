import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ElfsightReviews from "@/components/ElfsightReviews";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Users, Utensils, TreePine, Briefcase, Sun, Phone, Mail, Star, PartyPopper, Calendar } from "lucide-react";

// Images
import firmenfeierEvent from "@/assets/firmenfeier-event.webp";
import weihnachtsfeierEvent from "@/assets/weihnachtsfeier-event.webp";
import geburtstagsfeierEvent from "@/assets/geburtstagsfeier-event.webp";
import hausAussen from "@/assets/haus-aussen-2.webp";

const FirmenfeierMuenchen = () => {
  const { language } = useLanguage();

  const benefits = [
    {
      icon: MapPin,
      title: language === 'de' ? 'Zentrale Lage' : 'Central Location',
      description: language === 'de' ? '5 Min. vom Hauptbahnhof' : '5 min from main station'
    },
    {
      icon: Utensils,
      title: language === 'de' ? 'Individuelle Menüs' : 'Custom Menus',
      description: language === 'de' ? 'Auf Ihre Wünsche abgestimmt' : 'Tailored to your needs'
    },
    {
      icon: Users,
      title: language === 'de' ? '10–80 Personen' : '10–80 Guests',
      description: language === 'de' ? 'Flexibel für jede Teamgröße' : 'Flexible for any team size'
    },
    {
      icon: Sun,
      title: language === 'de' ? 'Sonnige Terrasse' : 'Sunny Terrace',
      description: language === 'de' ? 'Perfekt für Sommerfeste' : 'Perfect for summer events'
    },
    {
      icon: TreePine,
      title: language === 'de' ? 'Weihnachtsfeiern' : 'Christmas Parties',
      description: language === 'de' ? 'Festliche Atmosphäre' : 'Festive atmosphere'
    },
    {
      icon: Briefcase,
      title: language === 'de' ? 'Business-Dinner' : 'Business Dinners',
      description: language === 'de' ? 'Professioneller Rahmen' : 'Professional setting'
    }
  ];

  const eventPackages = [
    {
      title: language === 'de' ? 'After-Work' : 'After-Work',
      description: language === 'de' ? 'Aperitivo, Antipasti & entspannte Atmosphäre' : 'Aperitivo, antipasti & relaxed atmosphere',
      details: language === 'de' ? 'Ab 10 Personen' : 'From 10 guests'
    },
    {
      title: language === 'de' ? 'Weihnachtsfeier' : 'Christmas Party',
      description: language === 'de' ? 'Festliches Menü mit traditionellen Spezialitäten' : 'Festive menu with traditional specialties',
      details: language === 'de' ? 'Bis 80 Personen' : 'Up to 80 guests'
    },
    {
      title: language === 'de' ? 'Sommerfest' : 'Summer Party',
      description: language === 'de' ? 'Terrasse, frische Küche & italienisches Flair' : 'Terrace, fresh cuisine & Italian flair',
      details: language === 'de' ? 'Ideal für Teams' : 'Ideal for teams'
    }
  ];

  const galleryImages = [
    { src: weihnachtsfeierEvent, alt: language === 'de' ? 'Weihnachtsfeier mit Gästen im STORIA München' : 'Christmas party with guests at STORIA Munich' },
    { src: firmenfeierEvent, alt: language === 'de' ? 'Elegante Tafel für Firmenevents' : 'Elegant table setting for corporate events' },
    { src: geburtstagsfeierEvent, alt: language === 'de' ? 'Festliche Dekoration für Events' : 'Festive decoration for events' },
    { src: hausAussen, alt: language === 'de' ? 'STORIA Restaurant Außenansicht Maxvorstadt' : 'STORIA restaurant exterior Maxvorstadt' }
  ];

  return (
    <>
      <SEO 
        title={language === 'de' ? 'Firmenfeier München – Team-Event im Italiener' : 'Corporate Event Munich – Team Event at Italian Restaurant'}
        description={language === 'de' 
          ? 'Firmenfeier München im STORIA: Team-Events, Weihnachtsfeiern & Business-Dinner in der Maxvorstadt. Italienisches Restaurant nahe Hauptbahnhof. Jetzt anfragen!'
          : 'Corporate event Munich at STORIA: Team events, Christmas parties & business dinners in Maxvorstadt. Italian restaurant near main station. Inquire now!'}
        canonical="/firmenfeier-muenchen"
      />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Firmenfeier München' : 'Corporate Event Munich', url: '/firmenfeier-muenchen' }
        ]} 
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero Section with Full Image */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <img 
            src={firmenfeierEvent} 
            alt={language === 'de' ? 'Elegante Firmenfeier im STORIA München' : 'Elegant corporate event at STORIA Munich'}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <p className="text-sm md:text-base mb-3 tracking-[0.3em] uppercase opacity-90">
              {language === 'de' ? 'Firmenevents im STORIA' : 'Corporate Events at STORIA'}
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              {language === 'de' 
                ? <>Feiern Sie mit Ihrem Team –<br className="hidden md:block" /> wir kümmern uns um den Rest</>
                : <>Celebrate with your team –<br className="hidden md:block" /> we take care of the rest</>
              }
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              {language === 'de'
                ? 'Weihnachtsfeier, Team-Building oder Business-Dinner – authentisch italienisch in der Maxvorstadt.'
                : 'Christmas party, team building or business dinner – authentically Italian in Maxvorstadt.'}
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-base md:text-lg px-8 py-6"
              asChild
            >
              <a href="tel:+498951519696">
                <Phone className="w-5 h-5 mr-2" />
                {language === 'de' ? 'Jetzt unverbindlich anfragen' : 'Inquire now – no obligation'}
              </a>
            </Button>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="bg-primary text-primary-foreground py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                <span>4.8 Google Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <PartyPopper className="w-5 h-5" />
                <span>{language === 'de' ? '500+ Firmenfeiern' : '500+ Corporate Events'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{language === 'de' ? 'Seit 1985 in München' : 'Since 1985 in Munich'}</span>
              </div>
            </div>
          </div>
        </section>

        <Navigation />
        
        <main className="flex-grow">
          
          {/* Pain Points Section */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <p className="text-lg md:text-xl text-muted-foreground mb-4">
                {language === 'de' 
                  ? 'Catering-Suche, Location-Stress, Menü-Abstimmung mit 40 Kollegen?' 
                  : 'Catering search, location stress, menu coordination with 40 colleagues?'}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {language === 'de' 
                  ? 'Bei uns ist alles aus einer Hand.' 
                  : 'With us, everything is from one source.'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'de'
                  ? 'Lehnen Sie sich zurück – von der Planung bis zum letzten Espresso kümmern wir uns um jedes Detail.'
                  : 'Sit back – from planning to the last espresso, we take care of every detail.'}
              </p>
            </div>
          </section>

          {/* Benefits Grid */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {language === 'de' ? 'Warum STORIA für Ihre Firmenfeier?' : 'Why STORIA for Your Corporate Event?'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center p-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Event Gallery */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {language === 'de' ? 'Einblicke in unsere Events' : 'Insights into Our Events'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Event Packages */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {language === 'de' ? 'Unsere beliebtesten Formate' : 'Our Most Popular Formats'}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {language === 'de' 
                  ? 'Jedes Event wird individuell auf Ihre Wünsche abgestimmt.' 
                  : 'Each event is individually tailored to your wishes.'}
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {eventPackages.map((pkg, index) => (
                  <div 
                    key={index} 
                    className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-serif font-semibold mb-3">{pkg.title}</h3>
                    <p className="text-muted-foreground mb-4">{pkg.description}</p>
                    <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                      {pkg.details}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="py-16 md:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <blockquote className="text-xl md:text-2xl font-serif italic mb-6">
                {language === 'de'
                  ? '"Unsere Weihnachtsfeier war perfekt organisiert. Das Team war begeistert von der Atmosphäre und dem Essen!"'
                  : '"Our Christmas party was perfectly organized. The team was thrilled with the atmosphere and the food!"'}
              </blockquote>
              <p className="opacity-80">
                — Marketing-Abteilung, Münchner Unternehmen
              </p>
            </div>
          </section>

          {/* Final CTA with Urgency */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 text-center max-w-2xl">
              <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg">
                <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <TreePine className="w-4 h-4" />
                  {language === 'de' ? 'Weihnachtstermine sind schnell ausgebucht!' : 'Christmas dates book up fast!'}
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                  {language === 'de' ? 'Sichern Sie sich jetzt Ihren Wunschtermin' : 'Secure your preferred date now'}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {language === 'de'
                    ? 'Kontaktieren Sie uns für ein unverbindliches Angebot – wir beraten Sie gerne persönlich.'
                    : 'Contact us for a non-binding offer – we are happy to advise you personally.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-base" asChild>
                    <a href="tel:+498951519696">
                      <Phone className="w-5 h-5 mr-2" />
                      +49 89 51519696
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-base" asChild>
                    <a href="mailto:info@ristorantestoria.de">
                      <Mail className="w-5 h-5 mr-2" />
                      {language === 'de' ? 'E-Mail senden' : 'Send Email'}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Elfsight Reviews */}
          <ElfsightReviews />
          
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FirmenfeierMuenchen;
