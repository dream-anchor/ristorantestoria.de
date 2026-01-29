import LocalizedLink from "@/components/LocalizedLink";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import StaticBotContent from "@/components/StaticBotContent";
import { EventInquiryForm } from "@/components/EventInquiryForm";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { MapPin, Users, Utensils, TreePine, Briefcase, Sun, Phone, Star, PartyPopper, Calendar, ChefHat, Wine, ArrowRight, MessageCircle } from "lucide-react";

// Images
import firmenfeierEvent from "@/assets/firmenfeier-event.webp";
import weihnachtsfeierEvent from "@/assets/weihnachtsfeier-event.webp";
import geburtstagsfeierEvent from "@/assets/geburtstagsfeier-event.webp";
import sommerfestEvent from "@/assets/sommerfest-event.webp";

const FirmenfeierMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  const benefits = [
    { icon: MapPin, title: t.seo.firmenfeier.solution1Title, description: t.seo.firmenfeier.solution1Desc },
    { icon: Utensils, title: t.seo.firmenfeier.solution3Title, description: t.seo.firmenfeier.solution3Desc },
    { icon: Users, title: t.seo.firmenfeier.guests6_300, description: t.seo.firmenfeier.solution2Desc },
    { icon: Sun, title: t.seo.firmenfeier.solution2Title, description: t.seo.firmenfeier.solution2Desc },
    { icon: TreePine, title: t.seo.firmenfeier.galleryChristmas, description: t.seo.firmenfeier.heroDescription },
    { icon: Briefcase, title: t.seo.firmenfeier.solution4Title, description: t.seo.firmenfeier.solution4Desc },
  ];

  const eventPackages = [
    { title: t.seo.firmenfeier.package1Title, description: t.seo.firmenfeier.package1Desc, details: t.seo.firmenfeier.package1Price },
    { title: t.seo.firmenfeier.package2Title, description: t.seo.firmenfeier.package2Desc, details: t.seo.firmenfeier.package2Price },
    { title: t.seo.firmenfeier.package3Title, description: t.seo.firmenfeier.package3Desc, details: t.seo.firmenfeier.package3Price },
  ];

  const galleryImages = [
    { src: weihnachtsfeierEvent, alt: t.seo.firmenfeier.galleryChristmas },
    { src: sommerfestEvent, alt: t.seo.firmenfeier.gallerySummer },
    { src: geburtstagsfeierEvent, alt: t.seo.firmenfeier.galleryBirthday },
  ];

  const menuHighlights = [
    { icon: ChefHat, text: t.seo.firmenfeier.culinaryDesc },
    { icon: Utensils, text: t.seo.firmenfeier.culinaryDesc },
    { icon: Wine, text: t.seo.firmenfeier.culinaryDesc },
  ];

  return (
    <>
      <StaticBotContent
        title={t.seo.firmenfeier.heroTitle}
        description={t.seo.firmenfeier.heroDescription}
        sections={[
          { heading: t.seo.firmenfeier.solutionTitle, content: [t.seo.firmenfeier.solution1Title, t.seo.firmenfeier.solution2Title, t.seo.firmenfeier.solution3Title, t.seo.firmenfeier.solution4Title] },
          { heading: t.seo.firmenfeier.packagesTitle, content: [t.seo.firmenfeier.package1Title, t.seo.firmenfeier.package2Title, t.seo.firmenfeier.package3Title] },
        ]}
      />
      <SEO
        title={t.seo.firmenfeier.heroTitle}
        description={t.seo.firmenfeier.heroDescription}
        canonical="/firmenfeier-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.internalLinks.corporateEvent, url: '/firmenfeier-muenchen' }
        ]} 
      />
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        {/* Hero Section with Full Image */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <img 
            src={firmenfeierEvent} 
            alt={t.seo.firmenfeier.heroTitle}
            width={1200}
            height={800}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-8 py-10 md:px-12 md:py-12">
              <p className="text-sm md:text-base mb-3 tracking-[0.3em] uppercase">
                {t.seo.firmenfeier.heroSubtitle}
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                {t.seo.firmenfeier.heroTitle}
              </h1>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                {t.seo.firmenfeier.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 text-base md:text-lg px-8 py-6"
                  asChild
                >
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    {t.floatingActions.call}
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
                <span>{t.seo.firmenfeier.events100}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{t.seo.firmenfeier.since1995}</span>
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
                {t.seo.firmenfeier.painTitle}
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {t.seo.firmenfeier.pain1}
              </h2>
              <p className="text-muted-foreground">
                {t.seo.firmenfeier.pain2}
              </p>
            </div>
          </section>

          {/* Benefits Grid */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.firmenfeier.solutionTitle}
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
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
              
              {/* CTA after Benefits */}
              <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+498951519696">
                    <Phone className="w-5 h-5 mr-2" />
                    {t.floatingActions.call}
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

          {/* Event Gallery */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                {t.seo.firmenfeier.galleryTitle}
              </h2>
              <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                {t.seo.firmenfeier.galleryChristmas}, {t.seo.firmenfeier.gallerySummer}
              </p>
              
              {/* Gallery Grid */}
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
                  {t.seo.firmenfeier.contactWhatsapp}{' '}
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-medium">WhatsApp →</a>
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
              <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-12">
                {t.seo.firmenfeier.packagesTitle}
              </h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {eventPackages.map((pkg, index) => (
                  <div key={index} className="bg-card p-6 rounded-lg border border-border text-center">
                    <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                    <p className="text-muted-foreground mb-4">{pkg.description}</p>
                    <p className="text-primary font-semibold">{pkg.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Culinary Section */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                {t.seo.firmenfeier.culinaryTitle}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t.seo.firmenfeier.culinaryDesc}
              </p>
              <Button asChild>
                <LocalizedLink to="speisekarte">
                  {t.seo.firmenfeier.culinaryButton}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </LocalizedLink>
              </Button>
            </div>
          </section>

          {/* Testimonial */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <blockquote className="text-xl md:text-2xl font-serif italic mb-4">
                "{t.seo.firmenfeier.testimonial1Quote}"
              </blockquote>
              <p className="text-muted-foreground">– {t.seo.firmenfeier.testimonial1Author}</p>
            </div>
          </section>

          <ConsentElfsightReviews />

          {/* Contact Form Section */}
          <section className="py-16 md:py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold text-center mb-4">
                  {t.seo.firmenfeier.contactTitle}
                </h2>
                <p className="text-center text-muted-foreground mb-8">
                  {t.seo.firmenfeier.contactDesc}
                </p>
                <EventInquiryForm />
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FirmenfeierMuenchen;