import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ImageGrid from "@/components/ImageGrid";
import HomeVideo from "@/components/HomeVideo";
import HomeIntro from "@/components/HomeIntro";
import InternalLinks from "@/components/InternalLinks";
import GoogleReviews from "@/components/GoogleReviews";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import HomeAbout from "@/components/HomeAbout";
import SeasonalBanner from "@/components/SeasonalBanner";
import WmBanner from "@/components/WmBanner";
import FilmfestBanner from "@/components/FilmfestBanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Index = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <SEO
        title={t.seo.home.seoTitle}
        canonical="/"
        description={t.seo.home.seoDescription}
      />
      <StructuredData type="restaurant" />
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <Hero />
        <Navigation />
        <main>
          <ImageGrid />

          <HomeVideo />

          <HomeIntro />
          <div className="container mx-auto px-4 max-w-4xl">
            <WmBanner />
            <FilmfestBanner />
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
