import LocalizedLink from "@/components/LocalizedLink";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ReservationCTA from "@/components/ReservationCTA";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import StaticBotContent from "@/components/StaticBotContent";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const EventlocationMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <StaticBotContent
        title={t.seo.eventlocation.title}
        description={t.seo.eventlocation.description}
        sections={[
          { heading: t.seo.eventlocation.capacityTitle, content: [
            t.seo.eventlocation.capacity1,
            t.seo.eventlocation.capacity2,
            t.seo.eventlocation.capacity3,
            t.seo.eventlocation.capacity4,
          ]},
          { heading: t.seo.eventlocation.serviceTitle, content: t.seo.eventlocation.serviceDesc }
        ]}
      />
      <SEO
        title={t.seo.eventlocation.title}
        description={t.seo.eventlocation.description}
        canonical="/eventlocation-muenchen-maxvorstadt"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.internalLinks.eventLocation, url: '/eventlocation-muenchen-maxvorstadt' }
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
          <article className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif font-bold mb-6 text-center">
              {t.seo.eventlocation.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              {t.seo.eventlocation.description}
            </p>

            <div className="bg-card p-8 rounded-lg border border-border mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.eventlocation.capacityTitle}
              </h2>
              <p className="text-muted-foreground mb-4">{t.seo.eventlocation.capacityDesc}</p>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li>✓ {t.seo.eventlocation.capacity1}</li>
                <li>✓ {t.seo.eventlocation.capacity2}</li>
                <li>✓ {t.seo.eventlocation.capacity3}</li>
                <li>✓ {t.seo.eventlocation.capacity4}</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-secondary/50 p-6 rounded-lg">
                <h3 className="text-xl font-serif font-semibold mb-3">
                  {t.seo.eventlocation.cateringTitle}
                </h3>
                <p className="text-muted-foreground">
                  {t.seo.eventlocation.cateringDesc}
                </p>
              </div>
              <div className="bg-secondary/50 p-6 rounded-lg">
                <h3 className="text-xl font-serif font-semibold mb-3">
                  {t.seo.eventlocation.serviceTitle}
                </h3>
                <p className="text-muted-foreground">
                  {t.seo.eventlocation.serviceDesc}
                </p>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border text-center mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.eventlocation.contactTitle}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t.seo.eventlocation.contactDesc} {t.seo.eventlocation.contactWhatsapp}{' '}
                <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-medium">WhatsApp →</a>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="tel:+498951519696">+49 89 51519696</a>
                </Button>
                <Button size="lg" variant="outline" className="text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10" asChild>
                  <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:info@ristorantestoria.de">{t.specialOccasions.sendEmail}</a>
                </Button>
              </div>
            </div>

            <ReservationCTA />
            <ConsentElfsightReviews />
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default EventlocationMuenchen;
