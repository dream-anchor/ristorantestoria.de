import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ImageGrid from "@/components/ImageGrid";
import InternalLinks from "@/components/InternalLinks";
import ConsentElfsightReviews from "@/components/ConsentElfsightReviews";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import HomeBotContent from "@/components/HomeBotContent";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Index = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <SEO 
        canonical="/" 
        description={t.pages.index.description}
      />
      <StructuredData type="restaurant" />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <HomeBotContent />
        <Hero />
        <Navigation />
        <main>
          <ImageGrid />
          <ConsentElfsightReviews />
          <InternalLinks />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;