import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * OpenStatusBadge - Dynamischer Öffnungsstatus für Local SEO
 * Zeigt "Jetzt geöffnet" oder "Geschlossen" basierend auf aktueller Uhrzeit
 * Öffnungszeiten: Mo-Fr 09:00-01:00, Sa-So 12:00-01:00
 */
const OpenStatusBadge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  const labels = {
    de: { open: 'Jetzt geöffnet', closed: 'Geschlossen' },
    en: { open: 'Open now', closed: 'Closed' },
    it: { open: 'Aperto ora', closed: 'Chiuso' },
    fr: { open: 'Ouvert maintenant', closed: 'Fermé' },
  };

  const currentLabels = labels[language as keyof typeof labels] || labels.de;

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 = Sunday, 6 = Saturday
      const hour = now.getHours();
      const minute = now.getMinutes();
      const currentTime = hour * 60 + minute; // Zeit in Minuten seit Mitternacht

      // Öffnungszeiten in Minuten:
      // Mo-Fr: 09:00 (540) bis 01:00 nächster Tag (1500 = 25*60, oder 0-60 für nach Mitternacht)
      // Sa-So: 12:00 (720) bis 01:00 nächster Tag

      const isWeekday = day >= 1 && day <= 5; // Montag bis Freitag
      const isWeekend = day === 0 || day === 6; // Samstag oder Sonntag

      let openStatus = false;

      if (isWeekday) {
        // Mo-Fr: 09:00-01:00
        // Geöffnet von 9:00 (540 min) bis Mitternacht (1440 min) ODER von Mitternacht bis 1:00 (60 min)
        openStatus = currentTime >= 540 || currentTime < 60;
      } else if (isWeekend) {
        // Sa-So: 12:00-01:00
        // Geöffnet von 12:00 (720 min) bis Mitternacht (1440 min) ODER von Mitternacht bis 1:00 (60 min)
        openStatus = currentTime >= 720 || currentTime < 60;
      }

      setIsOpen(openStatus);
    };

    // Initial check
    checkOpenStatus();

    // Update every minute
    const interval = setInterval(checkOpenStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        ${isOpen
          ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30'
          : 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/30'
        }`}
      aria-label={isOpen ? currentLabels.open : currentLabels.closed}
    >
      <span
        className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}
        aria-hidden="true"
      />
      {isOpen ? currentLabels.open : currentLabels.closed}
    </span>
  );
};

export default OpenStatusBadge;
