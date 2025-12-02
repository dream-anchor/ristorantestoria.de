import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MenuDisplay from "@/components/MenuDisplay";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";

const Mittagsmenu = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <Link to="/">
            <img src={storiaLogo} alt="STORIA" className="h-24 md:h-32 mx-auto mb-4 hover:opacity-80 transition-opacity cursor-pointer" />
          </Link>
          <p className="text-lg text-muted-foreground tracking-wide">
            {t.hero.subtitle}
          </p>
        </div>
      </div>
      <Navigation />

      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-serif font-bold mb-6 text-center">{t.lunchMenu.title}</h1>
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <p className="text-xl font-serif italic text-primary mb-4">{t.lunchMenu.greeting}</p>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
            {t.lunchMenu.description}
          </p>
        </div>

        <MenuDisplay menuType="lunch" />
      </main>

      <Footer />
    </div>
  );
};

export default Mittagsmenu;
