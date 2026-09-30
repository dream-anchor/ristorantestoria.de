import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

interface Props {
  label: string;
  targetId: string;
}

/**
 * Fester Knopf „Gruppe anfragen“, nur auf dem Handy (< 768 px, md:hidden).
 * Springt zum Anker und verschwindet, sobald das Formular sichtbar ist.
 * Sitzt über der MobileActionBar (z-40, ca. 56 px hoch) und unter dem Cookie-Banner.
 */
const StickyGroupInquiryButton = ({ label, targetId }: Props) => {
  const { showBanner } = useCookieConsent();
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [targetId]);

  if (formVisible || showBanner) return null;

  return (
    <div
      className="fixed inset-x-0 z-30 flex justify-center px-4 pointer-events-none md:hidden"
      style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
    >
      <Button size="lg" className="pointer-events-auto shadow-lg" asChild>
        <a href={`#${targetId}`}>
          <Send className="w-4 h-4 mr-2" />
          {label}
        </a>
      </Button>
    </div>
  );
};

export default StickyGroupInquiryButton;
