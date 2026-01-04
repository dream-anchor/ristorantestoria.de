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
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const GeburtstagsfeierMuenchen = () => {
  const { t } = useLanguage();
  usePrerenderReady(true);

  return (
    <>
      <StaticBotContent
        title={t.seo.birthday.title}
        description={t.seo.birthday.description}
        sections={[
          { heading: t.seo.birthday.packageTitle, content: [
            t.seo.birthday.package1Title,
            t.seo.birthday.package2Title,
            t.seo.birthday.package3Title,
          ]},
          { heading: t.seo.birthday.extrasTitle, content: [
            t.seo.birthday.extra1,
            t.seo.birthday.extra2,
            t.seo.birthday.extra3,
          ]}
        ]}
      />
      <SEO
        title={t.seo.birthday.title}
        description={t.seo.birthday.description}
        canonical="/geburtstagsfeier-muenchen"
      />
      <StructuredData type="restaurant" />
      <StructuredData 
        type="breadcrumb" 
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: t.internalLinks.birthdayParty, url: '/geburtstagsfeier-muenchen' }
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
              {t.seo.birthday.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
              {t.seo.birthday.description}
            </p>

            <div className="bg-card p-8 rounded-lg border border-border mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.birthday.packageTitle}
              </h2>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li>✓ {t.seo.birthday.package1Title} – {t.seo.birthday.package1Desc}</li>
                <li>✓ {t.seo.birthday.package2Title} – {t.seo.birthday.package2Desc}</li>
                <li>✓ {t.seo.birthday.package3Title} – {t.seo.birthday.package3Desc}</li>
              </ul>
            </div>

            <div className="bg-secondary/50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.birthday.extrasTitle}
              </h2>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li>✓ {t.seo.birthday.extra1}</li>
                <li>✓ {t.seo.birthday.extra2}</li>
                <li>✓ {t.seo.birthday.extra3}</li>
                <li>✓ {t.seo.birthday.extra4}</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                <LocalizedLink to="eventlocation-muenchen-maxvorstadt" className="text-primary hover:underline">{t.internalLinks.eventLocation}</LocalizedLink>{' '}
                <LocalizedLink to="firmenfeier-muenchen" className="text-primary hover:underline">{t.internalLinks.corporateEvent}</LocalizedLink>
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Button asChild>
                  <LocalizedLink to="speisekarte">{t.seo.neapolitanPizza.menuButton}</LocalizedLink>
                </Button>
                <Button variant="outline" asChild>
                  <LocalizedLink to="kontakt">{t.nav.contact}</LocalizedLink>
                </Button>
              </div>
            </div>

            <div className="bg-card p-8 rounded-lg border border-border text-center mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">
                {t.seo.birthday.reserveTitle}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="tel:+498951519696">+49 89 51519696</a>
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

export default GeburtstagsfeierMuenchen;
