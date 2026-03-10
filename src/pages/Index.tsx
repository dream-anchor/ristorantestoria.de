import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ImageGrid from "@/components/ImageGrid";
import HomeIntro from "@/components/HomeIntro";
import InternalLinks from "@/components/InternalLinks";
import GoogleReviews from "@/components/GoogleReviews";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import HomeAbout from "@/components/HomeAbout";
import SeasonalBanner from "@/components/SeasonalBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Index = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <SEO
        title="Italiener München Maxvorstadt – STORIA seit 2015"
        canonical="/"
        description="Familienbetrieb seit 2015 am Königsplatz: Neapolitanische Pizza (400°C Steinofen), hausgemachte Pasta & Aperitivo. Mo–Fr ab 09 Uhr. Jetzt reservieren!"
      />
      <StructuredData type="restaurant" />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Hero />
        <Navigation />
        <main>
          <ImageGrid />

          <HomeIntro />
          <div className="container mx-auto px-4 max-w-4xl">
            <SeasonalBanner />
          </div>
          <HomeAbout />

          <GoogleReviews />
          <InternalLinks />

        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
