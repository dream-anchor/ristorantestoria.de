import { Phone, Mail } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="tel:08951519696" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Phone className="h-4 w-4" />
              <span>Telefon: 089 51519696</span>
            </a>
            <a href="mailto:info@ristorantestoria.de" className="flex items-center gap-2 hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
              <span>E-Mail: info@ristorantestoria.de</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
