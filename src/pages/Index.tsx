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
import HomeBotContent from "@/components/HomeBotContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Index = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <SEO
        title="Italiener München Maxvorstadt – STORIA seit 1995"
        canonical="/"
        description="Familienbetrieb seit 1995 am Königsplatz: Neapolitanische Pizza (400°C Steinofen), hausgemachte Pasta & Aperitivo. Mo–Fr ab 09 Uhr. Jetzt reservieren!"
      />
      <StructuredData type="restaurant" />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <HomeBotContent />
        <Hero />
        <Navigation />
        <main>
          <ImageGrid />

          <HomeIntro />
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
