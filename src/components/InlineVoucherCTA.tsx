import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Gift } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { VOUCHER_SHOP_URL } from "@/lib/eventsLinks";

interface InlineVoucherCTAProps {
  /** GA4 location parameter, e.g. "speisekarte" | "besondere-anlaesse" */
  location: string;
}

/**
 * Gutschein-Cross-Sell-CTA. Verlinkt auf den externen Gutschein-Shop
 * (events-storia.de) und feuert genau einmal `voucher_click` pro Klick.
 * Kein globaler Handler greift hier (kein tel:/wa.me/Reservierungs-Slug).
 */
const InlineVoucherCTA = ({ location }: InlineVoucherCTAProps) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto my-12 bg-primary/5 border border-primary/20 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
      <p className="text-base font-serif text-foreground sm:flex-1">
        {t.voucherCta.inlineText}
      </p>
      <Button asChild className="flex-shrink-0">
        <a
          href={VOUCHER_SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("voucher_click", { location })}
        >
          <Gift className="w-4 h-4 mr-2" />
          {t.voucherCta.button}
        </a>
      </Button>
    </div>
  );
};

export default InlineVoucherCTA;