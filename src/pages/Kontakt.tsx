import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";
import { useLanguage } from "@/contexts/LanguageContext";

const Kontakt = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <img src={storiaLogo} alt="STORIA" className="h-24 md:h-32 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground tracking-wide">
            {t.hero.subtitle}
          </p>
        </div>
      </div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8">{t.contact.title}</h1>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-serif font-bold mb-6">{t.contact.contactUs}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{t.contact.phone}</p>
                  <a href="tel:+4989515196" className="text-muted-foreground hover:text-primary">
                    089 51519696
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{t.contact.email}</p>
                  <a href="mailto:info@ristorantestoria.de" className="text-muted-foreground hover:text-primary">
                    info@ristorantestoria.de
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{t.contact.address}</p>
                  <p className="text-muted-foreground">
                    Augustenstraße 37<br />
                    80333 München
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-serif font-bold mb-6">{t.contact.openingHours}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{t.contact.monFri}</span>
                    <span className="text-muted-foreground">09:00 - 01:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">{t.contact.satSun}</span>
                    <span className="text-muted-foreground">12:00 - 01:00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">{t.contact.breakfast}</h3>
              <p className="text-sm text-muted-foreground">{t.contact.breakfastHours}</p>
            </div>

            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">{t.contact.notturno}</h3>
              <p className="text-sm text-muted-foreground">{t.contact.notturnoDesc}</p>
              <p className="text-sm text-muted-foreground">{t.contact.notturnoHours}</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Kontakt;
