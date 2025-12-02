import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import storiaLogo from "@/assets/storia-logo.webp";

const Kontakt = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <img src={storiaLogo} alt="STORIA" className="h-24 md:h-32 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground tracking-wide">
            RISTORANTE · PIZZERIA · BAR
          </p>
        </div>
      </div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-8">Kontakt</h1>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-serif font-bold mb-6">Kontaktieren Sie uns</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Telefon</p>
                  <a href="tel:+4989515196" className="text-muted-foreground hover:text-primary">
                    089 51519696
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">E-Mail</p>
                  <a href="mailto:info@ristorantestoria.de" className="text-muted-foreground hover:text-primary">
                    info@ristorantestoria.de
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-muted-foreground">
                    Augustenstraße 37<br />
                    80333 München
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-serif font-bold mb-6">Öffnungszeiten</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Montag - Freitag</span>
                    <span className="text-muted-foreground">09:00 - 01:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Samstag - Sonntag</span>
                    <span className="text-muted-foreground">12:00 - 01:00</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">Frühstück</h3>
              <p className="text-sm text-muted-foreground">Mo-So ab 9.00 Uhr</p>
            </div>

            <div className="mt-4 p-4 bg-secondary rounded-lg">
              <h3 className="font-semibold mb-2">STORIA Notturno</h3>
              <p className="text-sm text-muted-foreground">Late Night Aperitivo</p>
              <p className="text-sm text-muted-foreground">21:00 - 22:30 Uhr</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Kontakt;
