import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

/**
 * Brücke zwischen den externen MAESTRO-Widgets und unserem Tracking/Routing.
 * MAESTRO feuert bei erfolgreichem Absenden ein CustomEvent
 * `MAESTRO_INQUIRY_SUBMITTED` mit `detail.name`.
 */
const MaestroInquiryBridge = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ name?: string }>).detail;

      // a) GA4 Conversion
      trackEvent("generate_lead", {
        form_name: "maestro_widget",
        value: 1500,
        currency: "EUR",
      });

      // b) Weiterleitung auf die Danke-Seite (Name als Parameter)
      const rawName = typeof detail?.name === "string" ? detail.name.trim().slice(0, 80) : "";
      navigate(rawName ? `/danke?name=${encodeURIComponent(rawName)}` : "/danke");
    };

    window.addEventListener("MAESTRO_INQUIRY_SUBMITTED", handler);
    return () => window.removeEventListener("MAESTRO_INQUIRY_SUBMITTED", handler);
  }, [navigate]);

  return null;
};

export default MaestroInquiryBridge;
