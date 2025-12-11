import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ElfsightReviews from "@/components/ElfsightReviews";
import StaticBotContent from "@/components/StaticBotContent";
import ReservationCTA from "@/components/ReservationCTA";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { MapPin, Clock, Utensils, Star, ChefHat, Euro, ArrowRight, Salad, Pizza, Users, Receipt, Building, CalendarClock, BadgeCheck, MessageCircle } from "lucide-react";

// Images
import businessLunchAtmosphere from "@/assets/business-lunch-atmosphere.webp";
import businessLunchFood from "@/assets/business-lunch-food.webp";

const LunchMuenchen = () => {
  const { language } = useLanguage();
  const location = useLocation();
  usePrerenderReady(true);

  // Scroll position restoration
  useEffect(() => {
    const savedPosition = sessionStorage.getItem('lunchScrollPosition');
    if (savedPosition && location.state?.fromLunch) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('lunchScrollPosition');
      }, 100);
    }
  }, [location]);

  const handleMenuClick = () => {
    sessionStorage.setItem('lunchScrollPosition', String(window.scrollY));
  };

  const benefits = [
    {
      icon: Clock,
      title: language === 'de' ? 'Schneller Service' : 'Quick Service',
      description: language === 'de' ? 'Zuverlässig & pünktlich' : 'Reliable & on time'
    },
    {
      icon: MapPin,
      title: language === 'de' ? 'Zentrale Lage' : 'Central Location',
      description: language === 'de' ? '5 Min. vom Hauptbahnhof' : '5 min from main station'
    },
    {
      icon: Utensils,
      title: language === 'de' ? 'Frische Zutaten' : 'Fresh Ingredients',
      description: language === 'de' ? 'Täglich frisch zubereitet' : 'Freshly prepared daily'
    },
    {
      icon: Euro,
      title: language === 'de' ? 'Faire Preise' : 'Fair Prices',
      description: language === 'de' ? 'Attraktive Mittagspreise' : 'Attractive lunch prices'
    },
    {
      icon: ChefHat,
      title: language === 'de' ? 'Wechselnde Gerichte' : 'Changing Dishes',
      description: language === 'de' ? 'Regelmäßig neue Auswahl' : 'Regularly new selection'
    }
  ];

  const businessBenefits = [
    {
      icon: Receipt,
      title: language === 'de' ? 'Firmenrechnung' : 'Company Invoice',
      description: language === 'de' ? 'Unkomplizierte Rechnungsstellung' : 'Easy invoicing'
    },
    {
      icon: Users,
      title: language === 'de' ? 'Team-Reservierung' : 'Team Booking',
      description: language === 'de' ? 'Gruppentische für 2–20 Personen' : 'Group tables for 2-20 people'
    },
    {
      icon: Clock,
      title: language === 'de' ? 'Zuverlässiger Service' : 'Reliable Service',
      description: language === 'de' ? 'Pünktlich zurück ins Büro' : 'Back to office on time'
    },
    {
      icon: Building,
      title: language === 'de' ? 'Zentrale Lage' : 'Central Location',
      description: language === 'de' ? '5 Min. vom Hbf – ideal für Kundenbesuche' : '5 min from station – ideal for client visits'
    }
  ];

  const lunchOffers = [
    {
      title: language === 'de' ? 'Pasta-Klassiker' : 'Pasta Classics',
      description: language === 'de' ? 'Regelmäßig wechselnde Kreationen aus frischen Zutaten' : 'Regularly changing creations from fresh ingredients',
      icon: ChefHat,
      badge: null
    },
    {
      title: language === 'de' ? 'Pizza aus dem Steinofen' : 'Stone Oven Pizza',
      description: language === 'de' ? 'Knusprig & authentisch neapolitanisch' : 'Crispy & authentically Neapolitan',
      icon: Pizza,
      badge: language === 'de' ? 'Beliebt' : 'Popular'
    },
    {
      title: language === 'de' ? 'Insalata & Antipasti' : 'Salads & Antipasti',
      description: language === 'de' ? 'Leichte Gerichte für die schnelle Pause' : 'Light dishes for a quick break',
      icon: Salad,
      badge: null
    }
  ];

  const menuHighlights = [
    { icon: ChefHat, text: language === 'de' ? 'Hausgemachte Pasta' : 'Homemade pasta' },
    { icon: Pizza, text: language === 'de' ? 'Pizza aus dem Steinofen' : 'Stone oven pizza' },
    { icon: Salad, text: language === 'de' ? 'Frische Salate' : 'Fresh salads' }
  ];

  return (
    <>
      <StaticBotContent
        title={language === 'de' ? 'Lunch München Maxvorstadt – Italienisches Mittagessen' : 'Lunch Munich Maxvorstadt – Italian Lunch'}
        description={language === 'de' 
          ? 'Mittagessen im STORIA München Maxvorstadt: Regelmäßig wechselnde italienische Gerichte, frische Pasta & knusprige Pizza. Ideal für Berufstätige und Teams nahe Hauptbahnhof & TU München.'
          : 'Lunch at STORIA Munich Maxvorstadt: Regularly changing Italian dishes, fresh pasta & crispy pizza. Ideal for professionals and teams near main station & TU Munich.'}
        sections={[
          { heading: language === 'de' ? 'Unsere Vorteile' : 'Our Benefits', content: [
            language === 'de' ? 'Schneller & zuverlässiger Service' : 'Quick & reliable service',
            language === 'de' ? 'Zentrale Lage – 5 Min. vom Hauptbahnhof' : 'Central location – 5 min from main station',
            language === 'de' ? 'Regelmäßig wechselnde Gerichte' : 'Regularly changing dishes',
            language === 'de' ? 'Faire Mittagspreise' : 'Fair lunch prices'
          ]},
          { heading: language === 'de' ? 'Für Firmenkunden' : 'For Business Clients', content: [
            language === 'de' ? 'Firmenrechnung möglich' : 'Company invoicing available',
            language === 'de' ? 'Team-Reservierungen für 2–20 Personen' : 'Team reservations for 2-20 people',
            language === 'de' ? 'Ideal für Geschäftsessen & Kundenbesuche' : 'Ideal for business meals & client visits'
          ]},
          { heading: language === 'de' ? 'Öffnungszeiten Mittag' : 'Lunch Hours', content: language === 'de' ? 'Mo–Fr 11:30–14:30 Uhr' : 'Mon–Fri 11:30 AM–2:30 PM' }
        ]}
      />
      <SEO
        title={language === 'de' ? 'Lunch Maxvorstadt – Business Lunch & Mittagsmenü' : 'Lunch Maxvorstadt – Business Lunch & Menu'}
        description={language === 'de' 
          ? 'Business Lunch im STORIA München: Italienischer Mittagstisch Mo–Fr in der Maxvorstadt. Ideal für Teams & Geschäftsessen nahe Hauptbahnhof. Jetzt Tisch reservieren!'
          : 'Business lunch at STORIA Munich: Italian lunch Mon-Fri in Maxvorstadt. Ideal for teams & business meals near main station. Book your table!'}
        canonical="/lunch-muenchen-maxvorstadt"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: language === 'de' ? 'Lunch München' : 'Lunch Munich', url: '/lunch-muenchen-maxvorstadt' }
        ]} 
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero Section with Full Image */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <img 
            src={businessLunchAtmosphere} 
            alt={language === 'de' ? 'Business Lunch Atmosphäre im STORIA Restaurant München Maxvorstadt' : 'Business lunch atmosphere at STORIA Restaurant Munich Maxvorstadt'}
            width={1200}
            height={800}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12">
              <p className="text-sm md:text-base mb-3 tracking-[0.3em] uppercase">
                {language === 'de' ? 'Business Lunch in der Maxvorstadt' : 'Business Lunch in Maxvorstadt'}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                {language === 'de' 
                  ? <>Der perfekte Ort für<br className="hidden md:block" /> Ihr Geschäftsessen</>
                  : <>The perfect place for<br className="hidden md:block" /> your business meal</>
                }
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {language === 'de'
                  ? 'Ob Teamessen, Kundenbesuch oder schnelle Pause zwischen Meetings – genießen Sie italienische Qualität in zentraler Lage.'
                  : 'Whether team meal, client visit or quick break between meetings – enjoy Italian quality in a central location.'}
              </p>
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base md:text-lg px-8 py-6 shadow-lg"
                asChild
              >
                <Link to="/reservierung?from=lunch-muenchen-maxvorstadt">
                  {language === 'de' ? 'Jetzt Tisch reservieren' : 'Reserve a table now'}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="bg-primary text-primary-foreground py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5" />
                <span>{language === 'de' ? 'Seit 1995 in München' : 'Since 1995 in Munich'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{language === 'de' ? 'Ideal für Teams ab 2 Personen' : 'Ideal for teams of 2+'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                <span>{language === 'de' ? 'Firmenrechnung möglich' : 'Company invoice available'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Urgency Banner */}
        <section className="bg-muted/50 border-b border-border py-3">
          <div className="container mx-auto px-4">
            <Link 
              to="/reservierung?from=lunch-muenchen-maxvorstadt" 
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
            >
              <CalendarClock className="w-4 h-4 text-primary" />
              <span className="underline-offset-2 group-hover:underline">
                {language === 'de' 
                  ? 'Beliebte Zeiten (12:00–13:00) schnell ausgebucht – am besten vorab reservieren' 
                  : 'Peak times (12:00–13:00) book up fast – reserve ahead'}
              </span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </section>

        <Navigation />
        
        <main className="flex-grow">

          {/* 3-Gänge Mittagsmenü Highlight */}
          <section className="py-12 md:py-16 bg-card border-b border-border">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <span className="text-sm uppercase tracking-wider text-primary font-medium mb-2 block">
                {language === 'de' ? 'Unser Tipp' : 'Our Recommendation'}
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {language === 'de' ? '3-Gänge Mittagsmenü' : '3-Course Lunch Menu'}
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                {language === 'de' 
                  ? 'Vorspeise, Hauptgang und Dessert – das komplette italienische Mittags-Erlebnis zu einem fairen Preis.' 
                  : 'Starter, main course and dessert – the complete Italian lunch experience at a fair price.'}
              </p>
              <Button variant="default" size="lg" asChild>
                <Link to="/mittags-menu?from=lunch-muenchen-maxvorstadt" onClick={handleMenuClick}>
                  {language === 'de' ? 'Menü ansehen' : 'View menu'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </section>
          
          {/* Pain Points Section */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <p className="text-lg md:text-xl text-muted-foreground mb-4">
                {language === 'de' 
                  ? 'Teamessen organisieren kostet Zeit? Wichtiger Kundenbesuch steht an?' 
                  : 'Organizing team meals takes time? Important client visit coming up?'}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {language === 'de' 
                  ? 'Bei uns finden Sie den perfekten Rahmen für geschäftliche Anlässe.' 
                  : 'With us, you\'ll find the perfect setting for business occasions.'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'de'
                  ? 'Professionell, aber entspannt – italienische Gastfreundschaft trifft auf Business-Effizienz.'
                  : 'Professional yet relaxed – Italian hospitality meets business efficiency.'}
              </p>
            </div>
          </section>

          {/* Business Benefits */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {language === 'de' ? 'Vorteile für Firmenkunden' : 'Benefits for Business Clients'}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {language === 'de' 
                  ? 'Wir machen Ihr Business-Lunch unkompliziert.' 
                  : 'We make your business lunch effortless.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
                {businessBenefits.map((benefit, index) => {
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
            </div>
          </section>

          {/* Benefits Grid */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {language === 'de' ? 'Warum STORIA für Ihre Mittagspause?' : 'Why STORIA for Your Lunch Break?'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 max-w-5xl mx-auto">
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
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" asChild>
                  <Link to="/reservierung?from=lunch-muenchen-maxvorstadt">
                    {language === 'de' ? 'Jetzt für Ihr Team reservieren' : 'Reserve for your team now'}
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Lunch Offers */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {language === 'de' ? 'Unser Mittagsangebot' : 'Our Lunch Offer'}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {language === 'de' 
                  ? 'Frisch zubereitet – für die perfekte Mittagspause.' 
                  : 'Freshly prepared – for the perfect lunch break.'}
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {lunchOffers.map((offer, index) => {
                  const OfferIcon = offer.icon;
                  return (
                    <div 
                      key={index} 
                      className={`relative bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow ${offer.badge ? 'border-primary border-2' : 'border-border'}`}
                    >
                      {offer.badge && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                          {offer.badge}
                        </span>
                      )}
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <OfferIcon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-serif font-semibold mb-3">{offer.title}</h3>
                      <p className="text-muted-foreground">{offer.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Business Lunch Food Image */}
          <section className="py-16 md:py-20 bg-card">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {language === 'de' ? 'Ihr Business-Lunch-Erlebnis' : 'Your Business Lunch Experience'}
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
                {language === 'de' 
                  ? 'Professionelle Atmosphäre, authentisch italienische Küche.' 
                  : 'Professional atmosphere, authentic Italian cuisine.'}
              </p>
              <div className="max-w-3xl mx-auto">
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src={businessLunchFood}
                    alt={language === 'de' ? 'Italienische Gerichte für Ihr Business Lunch im STORIA München' : 'Italian dishes for your business lunch at STORIA Munich'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Menu Teaser Section */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                  {language === 'de' ? 'Unser aktuelles Mittagsmenü' : 'Our Current Lunch Menu'}
                </h2>
                <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
                  {language === 'de' 
                    ? 'Entdecken Sie unsere regelmäßig wechselnden Gerichte und Klassiker.' 
                    : 'Discover our regularly changing dishes and classics.'}
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
                  <Link to="/mittags-menu?from=lunch-muenchen-maxvorstadt">
                    {language === 'de' ? 'Aktuelles Mittagsmenü ansehen' : 'View current lunch menu'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Cross-Selling: Catering & Events */}
          <section className="py-12 md:py-16 bg-card border-y border-border">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">
                {language === 'de' ? 'Größere Gruppe? Firmenfeier geplant?' : 'Larger group? Planning a company event?'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'de' 
                  ? 'Für Gruppen ab 8 Personen und geschlossene Gesellschaften kontaktieren Sie uns direkt oder entdecken Sie unsere Event-Angebote.' 
                  : 'For groups of 8+ and private events, contact us directly or discover our event offerings.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/firmenfeier-muenchen">
                    {language === 'de' ? 'Firmenfeier planen' : 'Plan company event'}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://www.events-storia.de/" target="_blank" rel="noopener noreferrer">
                    {language === 'de' ? 'Catering & Events' : 'Catering & Events'}
                  </a>
                </Button>
              </div>
            </div>
          </section>

          {/* Testimonial Section */}
          <section className="py-16 md:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <blockquote className="text-xl md:text-2xl font-serif italic mb-6">
                {language === 'de'
                  ? '"Das STORIA ist unser festes Stammlokal für Teamessen – schnell, lecker und die perfekte Atmosphäre für Geschäftsgespräche."'
                  : '"STORIA is our regular spot for team lunches – fast, delicious and the perfect atmosphere for business talks."'}
              </blockquote>
              <p className="opacity-80">
                — {language === 'de' ? 'Thomas K., Teamleiter bei einer Münchner Digitalagentur' : 'Thomas K., Team Lead at a Munich Digital Agency'}
              </p>
            </div>
          </section>

          {/* Elfsight Reviews */}
          <ElfsightReviews />

          {/* Final Funnel CTA - Last element before Footer */}
          <section className="py-20 md:py-24 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                {language === 'de' 
                  ? 'Bereit für Ihren nächsten Business Lunch?' 
                  : 'Ready for your next business lunch?'}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {language === 'de' 
                  ? 'Reservieren Sie jetzt und genießen Sie italienische Qualität in zentraler Lage.' 
                  : 'Reserve now and enjoy Italian quality in a central location.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/reservierung?from=lunch-muenchen-maxvorstadt">
                    {language === 'de' ? 'Jetzt Tisch reservieren' : 'Reserve a table now'}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6" asChild>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
              <p className="text-sm mt-8 opacity-70">
                {language === 'de' 
                  ? 'Für Gruppen ab 8 Personen empfehlen wir eine telefonische Anfrage: +49 89 51519696' 
                  : 'For groups of 8+, we recommend calling: +49 89 51519696'}
              </p>
            </div>
          </section>
          
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LunchMuenchen;