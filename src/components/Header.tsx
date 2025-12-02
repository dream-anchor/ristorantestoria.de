import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import storiaLogo from "@/assets/storia-logo.webp";

const Header = () => {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={storiaLogo} alt="STORIA" className="h-12 md:h-14" />
          </Link>
          <div className="flex items-center gap-4 md:gap-6 text-base text-foreground/80 font-medium">
            <a href="tel:+4989515196" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">089 51519696</span>
            </a>
            <a href="mailto:info@ristorantestoria.de" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">info@ristorantestoria.de</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
