import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import domenicoImage from "@/assets/domenico-speranza.webp";
import nicolaImage from "@/assets/nicola-speranza.webp";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Über uns / Die Fratelli */}
      <div className="border-b border-primary-foreground/20">
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-serif font-bold text-center mb-10">Die Fratelli</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Domenico */}
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <img 
                  src={domenicoImage} 
                  alt="Domenico Speranza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-serif font-bold mb-1">Domenico Speranza</h3>
              <p className="text-primary-foreground/60 text-sm italic mb-3">Mimmo</p>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Aufgewachsen in der süditalienischen Provinz Rofrano, entdeckte er früh seine 
                Leidenschaft für die Gastronomie – eine Begeisterung, die ihn bis heute begleitet. 
                Mit Professionalität, Charme und großer Flexibilität versteht er es, Menschen zu 
                begeistern. Sein Gespür für die Wünsche seiner Gäste macht ihn zu einem Gastgeber 
                aus Leidenschaft.
              </p>
            </div>

            {/* Nicola */}
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                <img 
                  src={nicolaImage} 
                  alt="Nicola Speranza" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-serif font-bold mb-1">Nicola Speranza</h3>
              <p className="text-primary-foreground/60 text-sm italic mb-3">Fratello / Bruder</p>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                Ebenfalls in Rofrano aufgewachsen, verbindet er die Liebe zur guten Küche mit 
                großer Sorgfalt im Detail. Mit seinem Können und seinem feinen Gespür unterstützt 
                er das Küchenteam und schafft Gerichte, die durch Kreativität und echte Leidenschaft 
                begeistern. Hochwertige Produkte, klare Aromen und authentische italienische 
                Kochkunst prägen seinen Stil.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link to="/ueber-uns" className="text-primary-foreground/80 hover:text-primary-foreground underline">
              Mehr über uns erfahren
            </Link>
          </div>
        </div>
      </div>

      {/* Kontakt & Info */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Kontakt */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Kontakt</h3>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <a href="tel:+4989515196" className="flex items-center justify-center md:justify-start gap-2 hover:text-primary-foreground">
                <Phone className="h-4 w-4" />
                089 51519696
              </a>
              <a href="mailto:info@ristorantestoria.de" className="flex items-center justify-center md:justify-start gap-2 hover:text-primary-foreground">
                <Mail className="h-4 w-4" />
                info@ristorantestoria.de
              </a>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="h-4 w-4" />
                Augustenstraße 37, 80333 München
              </div>
            </div>
          </div>

          {/* Öffnungszeiten */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Öffnungszeiten</h3>
            <div className="space-y-1 text-sm text-primary-foreground/80">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Clock className="h-4 w-4" />
                <span>Mo - Fr: 09:00 - 01:00</span>
              </div>
              <div className="pl-6">Sa - So: 12:00 - 01:00</div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif font-bold text-lg mb-4">Rechtliches</h3>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <Link to="/impressum" className="block hover:text-primary-foreground">Impressum</Link>
              <Link to="/datenschutz" className="block hover:text-primary-foreground">Datenschutz</Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} STORIA - Ristorante · Pizzeria · Bar · Im Herzen von München</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
