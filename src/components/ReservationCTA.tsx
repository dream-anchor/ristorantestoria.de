import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle } from "lucide-react";

const ReservationCTA = () => {
  const { language } = useLanguage();

  return (
    <div className="bg-primary/10 p-8 rounded-lg text-center mt-12">
      <h2 className="text-xl md:text-2xl font-serif font-semibold mb-3">
        {language === 'de' ? 'Jetzt Tisch reservieren' : 'Book Your Table Now'}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {language === 'de' 
          ? 'Sichern Sie sich Ihren Platz im STORIA München Maxvorstadt – Ihr Italiener nahe Königsplatz.' 
          : 'Secure your spot at STORIA Munich Maxvorstadt – your Italian restaurant near Königsplatz.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" asChild>
          <Link to="/reservierung">
            {language === 'de' ? 'Über OpenTable reservieren' : 'Book via OpenTable'}
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="text-[#25D366] border-[#25D366] hover:bg-[#25D366]/10" asChild>
          <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ReservationCTA;
