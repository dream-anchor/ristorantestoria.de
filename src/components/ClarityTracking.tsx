import { useEffect } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

const CLARITY_PROJECT_ID = "vfoqzxmbn1";

const ClarityTracking = () => {
  const { hasConsent } = useCookieConsent();
  const hasExternalConsent = hasConsent("external");

  useEffect(() => {
    if (!hasExternalConsent) return;

    // Bereits geladen? Nicht nochmal laden
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== "undefined" && (window as any).clarity) return;

    // Clarity Script dynamisch laden (nur nach Consent)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    w.clarity = w.clarity || function (...args: unknown[]) {
      ((w.clarity as Record<string, unknown[]>).q = (w.clarity as Record<string, unknown[]>).q || []).push(args);
    };
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
    document.head.appendChild(script);
  }, [hasExternalConsent]);

  return null;
};

export default ClarityTracking;
