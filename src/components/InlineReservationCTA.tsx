import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";

const InlineReservationCTA = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto my-12 bg-primary/5 border border-primary/20 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
      <p className="text-base font-serif text-foreground sm:flex-1">
        {t.reservationCta.inlineText}
      </p>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Button asChild>
          <LocalizedLink to="reservierung">
            {t.reservationCta.reserveButton}
          </LocalizedLink>
        </Button>
        <a
          href="https://wa.me/491636033912"
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp Reservierungsanfrage"
          className="inline-flex items-center gap-1 text-[#25D366] hover:underline font-medium"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
};

export default InlineReservationCTA;