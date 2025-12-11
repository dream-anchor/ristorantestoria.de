import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle } from "lucide-react";

const ReservationCTA = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-primary/10 p-8 rounded-lg text-center mt-12">
      <h2 className="text-xl md:text-2xl font-serif font-semibold mb-3">
        {t.reservationCta.title}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {t.reservationCta.description}{' '}
        {t.reservationCta.descriptionWhatsapp}{' '}
        <a href="https://wa.me/491636033912" target="_blank" rel="noopener noreferrer" className="text-[#25D366] hover:underline font-medium">WhatsApp →</a>
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" asChild>
          <Link to="/reservierung">
            {t.reservationCta.reserveButton}
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