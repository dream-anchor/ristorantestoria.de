import { Link } from "react-router-dom";
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
import { MapPin, Clock, Utensils, Star, Coffee, ChefHat, Euro, Phone, ArrowRight, Salad, Pizza } from "lucide-react";

// Images
import pastaImage from "@/assets/pasta.jpg";

const LunchMuenchen = () => {
  const { language } = useLanguage();
  usePrerenderReady(true);

  const benefits = [
    {
      icon: Clock,
      title: language === 'de' ? 'Schneller Service' : 'Quick Service',
      description: language === 'de' ? 'In 15 Min. auf dem Tisch' : 'Served in 15 minutes'
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
      description: language === 'de' ? 'Täglich neue Auswahl' : 'New selection daily'
    },
    {
      icon: Coffee,
      title: language === 'de' ? 'Espresso inklusive' : 'Espresso Included',
      description: language === 'de' ? 'Italienischer Abschluss' : 'Italian finish'
    }
  ];

  const lunchOffers = [
    {
      title: language === 'de' ? 'Pasta des Tages' : 'Pasta of the Day',
      description: language === 'de' ? 'Täglich wechselnde Pasta-Kreation aus frischen Zutaten' : 'Daily changing pasta creation from fresh ingredients',
      icon: ChefHat
    },
    {
      title: language === 'de' ? 'Pizza aus dem Steinofen' : 'Stone Oven Pizza',
      description: language === 'de' ? 'Knusprig & authentisch neapolitanisch' : 'Crispy & authentically Neapolitan',
      icon: Pizza
    },
    {
      title: language === 'de' ? 'Insalata & Antipasti' : 'Salads & Antipasti',
      description: language === 'de' ? 'Leichte Gerichte für die schnelle Pause' : 'Light dishes for a quick break',
      icon: Salad
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
          ? 'Mittagessen im STORIA München Maxvorstadt: Täglich wechselnde italienische Gerichte, frische Pasta & knusprige Pizza. Ideal für Berufstätige nahe Hauptbahnhof & TU München.'
          : 'Lunch at STORIA Munich Maxvorstadt: Daily changing Italian dishes, fresh pasta & crispy pizza. Ideal for professionals near main station & TU Munich.'}
        sections={[
          { heading: language === 'de' ? 'Unsere Vorteile' : 'Our Benefits', content: [
            language === 'de' ? 'Schneller Service – in 15 Minuten auf dem Tisch' : 'Quick service – served in 15 minutes',
            language === 'de' ? 'Zentrale Lage – 5 Min. vom Hauptbahnhof' : 'Central location – 5 min from main station',
            language === 'de' ? 'Täglich wechselnde Gerichte' : 'Daily changing dishes',
            language === 'de' ? 'Faire Mittagspreise' : 'Fair lunch prices'
          ]},
          { heading: language === 'de' ? 'Mittagsangebot' : 'Lunch Offer', content: [
            language === 'de' ? 'Pasta des Tages – täglich frisch' : 'Pasta of the day – fresh daily',
            language === 'de' ? 'Pizza aus dem Steinofen' : 'Stone oven pizza',
            language === 'de' ? 'Frische Salate & Antipasti' : 'Fresh salads & antipasti'
          ]},
          { heading: language === 'de' ? 'Öffnungszeiten Mittag' : 'Lunch Hours', content: language === 'de' ? 'Mo–Fr 11:30–14:30 Uhr' : 'Mon–Fri 11:30 AM–2:30 PM' }
        ]}
      />
      <SEO
        title={language === 'de' ? 'Lunch Maxvorstadt – Mittagsmenü' : 'Lunch Maxvorstadt – Lunch Menu'}
        description={language === 'de' 
          ? 'Mittagsmenü im STORIA München: Italienischer Lunch Mo–Fr in der Maxvorstadt. Frische Pasta & Pizza nahe Hauptbahnhof. Jetzt Tisch reservieren!'
          : 'Lunch menu at STORIA Munich: Italian lunch Mon-Fri in Maxvorstadt. Fresh pasta & pizza near main station. Book your table!'}
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
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <img 
            src={pastaImage} 
            alt={language === 'de' ? 'Frische Pasta im STORIA München – Italienischer Mittagstisch' : 'Fresh pasta at STORIA Munich – Italian lunch'}
            width={1200}
            height={800}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12">
              <p className="text-sm md:text-base mb-3 tracking-[0.3em] uppercase">
                {language === 'de' ? 'Mittagstisch im STORIA' : 'Lunch at STORIA'}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                {language === 'de' 
                  ? <>Mittagspause auf Italienisch –<br className="hidden md:block" /> frisch, schnell & lecker</>
                  : <>Italian lunch break –<br className="hidden md:block" /> fresh, fast & delicious</>
                }
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {language === 'de'
                  ? 'Genießen Sie authentisch italienische Küche in der Maxvorstadt – nur 5 Minuten vom Hauptbahnhof.'
                  : 'Enjoy authentic Italian cuisine in Maxvorstadt – just 5 minutes from the main station.'}
              </p>
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 text-base md:text-lg px-8 py-6"
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
                <Star className="w-5 h-5 fill-current" />
                <span>{language === 'de' ? 'Seit 1995 in München' : 'Since 1995 in Munich'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{language === 'de' ? '5 Min. vom Hbf' : '5 min from station'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Mo–Fr 11:30–14:30</span>
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
                  ? 'Keine Zeit für lange Mittagspausen? Immer dasselbe Essen in der Kantine?' 
                  : 'No time for long lunch breaks? Always the same food in the canteen?'}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {language === 'de' 
                  ? 'Bei uns genießen Sie authentisch italienisch – schnell serviert.' 
                  : 'With us, enjoy authentic Italian – served quickly.'}
              </h2>
              <p className="text-muted-foreground">
                {language === 'de'
                  ? 'Frisch zubereitet, fair bepreist und in entspannter Atmosphäre – die perfekte Auszeit vom Arbeitsalltag.'
                  : 'Freshly prepared, fairly priced and in a relaxed atmosphere – the perfect break from work.'}
              </p>
            </div>
          </section>

          {/* Benefits Grid */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {language === 'de' ? 'Warum STORIA für Ihre Mittagspause?' : 'Why STORIA for Your Lunch Break?'}
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
              <div className="text-center mt-12">
                <Button size="lg" variant="outline" asChild>
                  <Link to="/reservierung?from=lunch-muenchen-maxvorstadt">
                    {language === 'de' ? 'Jetzt Tisch reservieren' : 'Reserve a table now'}
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Lunch Offers */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {language === 'de' ? 'Unser Mittagsangebot' : 'Our Lunch Offer'}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {language === 'de' 
                  ? 'Täglich frisch zubereitet – für die perfekte Mittagspause.' 
                  : 'Freshly prepared daily – for the perfect lunch break.'}
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {lunchOffers.map((offer, index) => {
                  const OfferIcon = offer.icon;
                  return (
                    <div 
                      key={index} 
                      className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
                    >
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

          {/* Menu Teaser Section */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                  {language === 'de' ? 'Unser aktuelles Mittagsmenü' : 'Our Current Lunch Menu'}
                </h2>
                <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
                  {language === 'de' 
                    ? 'Entdecken Sie unsere wechselnden Tagesgerichte und Klassiker.' 
                    : 'Discover our changing daily dishes and classics.'}
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

          {/* Testimonial Section */}
          <section className="py-16 md:py-20 bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <blockquote className="text-xl md:text-2xl font-serif italic mb-6">
                {language === 'de'
                  ? '"Mein Lieblingsort für die Mittagspause – schnell, lecker und das Team ist super freundlich!"'
                  : '"My favorite place for lunch – fast, delicious and the team is super friendly!"'}
              </blockquote>
              <p className="opacity-80">
                — {language === 'de' ? 'Stammgast aus der Maxvorstadt' : 'Regular guest from Maxvorstadt'}
              </p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                  {language === 'de' ? 'Reservieren Sie Ihren Mittagstisch' : 'Reserve Your Lunch Table'}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {language === 'de' 
                    ? 'Sichern Sie sich Ihren Platz und genießen Sie Ihre Mittagspause ohne Wartezeit.' 
                    : 'Secure your spot and enjoy your lunch break without waiting.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/reservierung?from=lunch-muenchen-maxvorstadt">
                      {language === 'de' ? 'Online reservieren' : 'Reserve online'}
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="tel:+498951519696">
                      <Phone className="w-5 h-5 mr-2" />
                      +49 89 51519696
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

export default LunchMuenchen;
