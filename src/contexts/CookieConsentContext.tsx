import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// TypeScript Declaration für Google Analytics
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

interface CookieConsent {
  necessary: boolean;
  statistics: boolean;
  marketing: boolean;
  external: boolean;
  timestamp: string;
  version: string;
}

interface CookieConsentContextType {
  consent: CookieConsent | null;
  showBanner: boolean;
  showSettings: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: Partial<CookieConsent>) => void;
  openSettings: () => void;
  closeSettings: () => void;
  closeBanner: () => void;
  hasConsent: (category: keyof Omit<CookieConsent, 'timestamp' | 'version'>) => boolean;
}

const CONSENT_VERSION = "1.0";
const CONSENT_KEY = "storia_cookie_consent";
const CONSENT_DURATION_DAYS = 365;

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

// Funktion zum Aktualisieren des Google Consent Mode
const updateGoogleConsent = (consentData: CookieConsent) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      'analytics_storage': consentData.statistics ? 'granted' : 'denied',
      'ad_storage': consentData.marketing ? 'granted' : 'denied',
      'ad_user_data': consentData.marketing ? 'granted' : 'denied',
      'ad_personalization': consentData.marketing ? 'granted' : 'denied',
    });
  }
};

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookieConsent;
        const consentDate = new Date(parsed.timestamp);
        const now = new Date();
        const daysDiff = (now.getTime() - consentDate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysDiff < CONSENT_DURATION_DAYS && parsed.version === CONSENT_VERSION) {
          setConsent(parsed);
          updateGoogleConsent(parsed); // Google über gespeicherte Einwilligung informieren
          setShowBanner(false);
        } else {
          localStorage.removeItem(CONSENT_KEY);
          setShowBanner(true);
        }
      } catch {
        localStorage.removeItem(CONSENT_KEY);
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    // Prüfen ob externe oder Statistik-Cookies von granted zu denied wechseln
    const wasExternalOrStatsGranted = consent?.external === true || consent?.statistics === true;
    const isNowDenied = newConsent.external === false && newConsent.statistics === false;
    
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
    setShowBanner(false);
    setShowSettings(false);
    
    // Google Consent aktualisieren
    updateGoogleConsent(newConsent);
    
    // Page Reload wenn Cookies widerrufen wurden (um geladene Scripts zu entfernen)
    if (wasExternalOrStatsGranted && isNowDenied) {
      window.location.reload();
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      statistics: true,
      marketing: true,
      external: true,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true,
      statistics: false,
      marketing: false,
      external: false,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
  };

  const savePreferences = (preferences: Partial<CookieConsent>) => {
    saveConsent({
      necessary: true,
      statistics: preferences.statistics ?? false,
      marketing: preferences.marketing ?? false,
      external: preferences.external ?? false,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    });
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  const hasConsent = (category: keyof Omit<CookieConsent, 'timestamp' | 'version'>) => {
    if (!consent) return category === 'necessary';
    return consent[category];
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        showBanner,
        showSettings,
        acceptAll,
        rejectAll,
        savePreferences,
        openSettings,
        closeSettings,
        closeBanner,
        hasConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
};
