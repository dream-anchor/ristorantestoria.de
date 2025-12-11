import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ElfsightReviews from "@/components/ElfsightReviews";
import StaticBotContent from "@/components/StaticBotContent";
import { EventInquiryForm } from "@/components/EventInquiryForm";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { MapPin, Users, Utensils, TreePine, Briefcase, Sun, Phone, Mail, Star, PartyPopper, Calendar, ChefHat, Wine, ArrowRight, Clock, MessageCircle } from "lucide-react";

// Images
import firmenfeierEvent from "@/assets/firmenfeier-event.webp";
import weihnachtsfeierEvent from "@/assets/weihnachtsfeier-event.webp";
import geburtstagsfeierEvent from "@/assets/geburtstagsfeier-event.webp";
import sommerfestEvent from "@/assets/sommerfest-event.webp";

const getSeasonalUrgency = (language: string) => {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();
  
  // Weihnachtszeit: 15. Oktober bis 24. Dezember
  if ((month === 10 && day >= 15) || month === 11 || (month === 12 && day <= 24)) {
    return {
      icon: TreePine,
      text: language === 'de' ? 'Weihnachtstermine sind schnell ausgebucht!' : 'Christmas dates book up fast!'
    };
  }
  
  // Winter/Frühling: 25. Dezember bis 31. März → Frühjahrsfeste
  if ((month === 12 && day >= 25) || month <= 3) {
    return {
      icon: PartyPopper,
      text: language === 'de' ? 'Frühjahrstermine sind gefragt!' : 'Spring dates are in demand!'
    };
  }
  
  // Sommer: April bis September → Sommerfeste
  if (month >= 4 && month <= 9) {
    return {
      icon: Sun,
      text: language === 'de' ? 'Sommerfesttermine sind schnell ausgebucht!' : 'Summer party dates book up fast!'
    };
  }
  
  // Herbst (vor Weihnachtszeit): Oktober bis 14. Oktober
  return {
    icon: Briefcase,
    text: language === 'de' ? 'Beliebte Termine sind schnell vergeben!' : 'Popular dates book up fast!'
  };
};

const FirmenfeierMuenchen = () => {
  const { language } = useLanguage();
  usePrerenderReady(true);
  const seasonalUrgency = getSeasonalUrgency(language);
  const SeasonalIcon = seasonalUrgency.icon;

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
      title: language === 'de' ? '6–300 Personen' : '6–300 Guests',
      description: language === 'de' ? 'Flexibel für jede Teamgröße' : 'Flexible for any team size'
    },
    {
      icon: Sun,
      title: language === 'de' ? 'Überdachte Terrasse' : 'Covered Terrace',
      description: language === 'de' ? 'Bei jedem Wetter genießen' : 'Enjoy in any weather'
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
    { src: sommerfestEvent, alt: language === 'de' ? 'Sommerfest auf der Terrasse mit Weinservice' : 'Summer party on the terrace with wine service' },
    { src: geburtstagsfeierEvent, alt: language === 'de' ? 'Festliche Dekoration für Events' : 'Festive decoration for events' }
  ];

  const menuHighlights = [
    { icon: ChefHat, text: language === 'de' ? 'Hausgemachte Pasta-Variationen' : 'Homemade pasta variations' },
    { icon: Utensils, text: language === 'de' ? 'Frische Antipasti-Auswahl' : 'Fresh antipasti selection' },
    { icon: Wine, text: language === 'de' ? 'Erlesene italienische Weine' : 'Fine Italian wines' }
  ];

  return (
    <>
      <StaticBotContent
        title={language === 'de' ? 'Firmenfeier München – Team-Event im italienischen Restaurant' : 'Corporate Event Munich – Team Event at Italian Restaurant'}
        description={language === 'de' 
          ? 'Firmenfeier im STORIA München: Weihnachtsfeiern, Team-Events & Business-Dinner für 6-300 Personen. Zentrale Lage Maxvorstadt nahe Hauptbahnhof. Überdachte Terrasse, individuelle Menüs.'
          : 'Corporate event at STORIA Munich: Christmas parties, team events & business dinners for 6-300 guests. Central location Maxvorstadt near main station. Covered terrace, custom menus.'}
        sections={[
          { heading: language === 'de' ? 'Unsere Vorteile' : 'Our Benefits', content: [
            language === 'de' ? 'Zentrale Lage – 5 Min. vom Hauptbahnhof' : 'Central location – 5 min from main station',
            language === 'de' ? 'Individuelle Menüs auf Ihre Wünsche abgestimmt' : 'Custom menus tailored to your needs',
            language === 'de' ? 'Kapazität für 6–300 Personen' : 'Capacity for 6–300 guests',
            language === 'de' ? 'Überdachte Terrasse für jedes Wetter' : 'Covered terrace for any weather'
          ]},
          { heading: language === 'de' ? 'Beliebte Event-Formate' : 'Popular Event Formats', content: [
            language === 'de' ? 'After-Work Events mit Aperitivo & Antipasti' : 'After-work events with aperitivo & antipasti',
            language === 'de' ? 'Weihnachtsfeiern mit festlichem Menü' : 'Christmas parties with festive menu',
            language === 'de' ? 'Sommerfeste auf der Terrasse' : 'Summer parties on the terrace'
          ]},
          { heading: language === 'de' ? 'Kontakt' : 'Contact', content: language === 'de' ? 'Jetzt unverbindlich anfragen: +49 89 51519696' : 'Inquire now: +49 89 51519696' }
        ]}
      />
      <SEO
        title={language === 'de' ? 'Firmenfeier – Team-Events' : 'Corporate Events – Team Parties'}
        description={language === 'de' 
          ? 'Firmenfeier München im STORIA: Team-Events, Weihnachtsfeiern & Business-Dinner in der Maxvorstadt. Italienisches Restaurant nahe Hauptbahnhof. Jetzt anfragen!'
          : 'Corporate event Munich at STORIA: Team events, Christmas parties & business dinners in Maxvorstadt. Italian restaurant near main station. Inquire now!'}
        canonical="/firmenfeier-muenchen"
      />
      <StructuredData type="restaurant" />
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
            width={1200}
            height={800}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12">
              <p className="text-sm md:text-base mb-3 tracking-[0.3em] uppercase">
                {language === 'de' ? 'Firmenevents im STORIA' : 'Corporate Events at STORIA'}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                {language === 'de' 
                  ? <>Feiern Sie mit Ihrem Team –<br className="hidden md:block" /> wir kümmern uns um den Rest</>
                  : <>Celebrate with your team –<br className="hidden md:block" /> we take care of the rest</>
                }
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {language === 'de'
                  ? 'Weihnachtsfeier, Team-Building oder Business-Dinner – authentisch italienisch in der Maxvorstadt.'
                  : 'Christmas party, team building or business dinner – authentically Italian in Maxvorstadt.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-base md:text-lg px-8 py-6"
                  asChild
                >
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    {language === 'de' ? 'Jetzt anrufen' : 'Call now'}
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  className="bg-[#25D366] hover:bg-[#20BD5A] text-white text-base md:text-lg px-8 py-6"
                  asChild
                >
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
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
                <span>{language === 'de' ? '100+ Firmenfeiern' : '100+ Corporate Events'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{language === 'de' ? 'Seit 1995 in München und Bayern' : 'Since 1995 in Munich and Bavaria'}</span>
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
                {benefits.map((benefit, index) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <div key={index} className="text-center p-4">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <BenefitIcon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
              
              {/* CTA after Benefits */}
              <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    {language === 'de' ? 'Jetzt Termin anfragen' : 'Request a date now'}
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10" asChild>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Event Gallery - Emotional Visual Section */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {language === 'de' ? 'Einblicke in unsere Events' : 'Insights into Our Events'}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {language === 'de' 
                  ? 'So feiern unsere Gäste – von Weihnachtsfeiern bis Sommerfesten.' 
                  : 'This is how our guests celebrate – from Christmas parties to summer events.'}
              </p>
              
              {/* Dynamic Gallery Layout - 3 Images */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {galleryImages.map((image, index) => (
                  <div 
                    key={index} 
                    className={`overflow-hidden rounded-lg ${index === 1 ? 'md:scale-105 md:z-10 shadow-xl' : ''}`}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      width={600}
                      height={450}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

              {/* CTA after Gallery */}
              <div className="text-center mt-12">
                <p className="text-muted-foreground mb-4">
                  {language === 'de' ? 'Haben Sie Fragen zu Ihrer Veranstaltung?' : 'Do you have questions about your event?'}
                </p>
                <a 
                  href="tel:+498951519696" 
                  className="text-primary hover:underline font-semibold inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  +49 89 51519696
                </a>
              </div>
            </div>
          </section>

          {/* Event Packages */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {language === 'de' ? 'Die beliebtesten Anlässe unserer Gäste' : 'Our Guests\' Most Popular Occasions'}
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

          {/* Menu Teaser Section */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                  {language === 'de' ? 'Kulinarische Highlights für Ihr Event' : 'Culinary Highlights for Your Event'}
                </h2>
                <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
                  {language === 'de' 
                    ? 'Authentisch italienische Küche – frisch zubereitet von unserer Küche für Ihre Gäste.' 
                    : 'Authentic Italian cuisine – freshly prepared by our kitchen for your guests.'}
                </p>
                
                <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10">
                  {menuHighlights.map((item, index) => {
                    const ItemIcon = item.icon;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <ItemIcon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium">{item.text}</span>
                      </div>
                    );
                  })}
                </div>

                <Button variant="outline" asChild>
                  <Link to="/speisekarte?from=firmenfeier-muenchen">
                    {language === 'de' ? 'Unsere Speisekarte entdecken' : 'Discover our menu'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
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

          {/* Final CTA with Inquiry Form */}
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-8">
                  {language === 'de' ? 'Jetzt unverbindlich anfragen' : 'Send your inquiry now'}
                </h2>
                <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
                  <EventInquiryForm />
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
