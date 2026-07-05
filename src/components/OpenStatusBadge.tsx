import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * OpenStatusBadge - Dynamischer Öffnungsstatus für Local SEO
 * Zeigt "Jetzt geöffnet" oder "Geschlossen" basierend auf aktueller Uhrzeit
 * Öffnungszeiten:
 *   Mo–Mi 09:00–00:00
 *   Do–Fr 09:00–01:00
 *   Sa 11:00–14:30 & 17:30–01:00
 *   So 12:00–14:30 & 17:30–22:30
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

      // Offene Intervalle je Wochentag in Minuten seit Mitternacht [start, ende).
      // Die Schließzeit 01:00 (Do–Fr und Sa) läuft in den Folgetag über:
      // der Slot 00:00–01:00 gehört daher zum Morgen von Fr, Sa und So.
      const schedule: Record<number, Array<[number, number]>> = {
        0: [[0, 60], [720, 870], [1050, 1350]],   // So: Überlauf von Sa + 12:00–14:30 + 17:30–22:30
        1: [[540, 1440]],                          // Mo: 09:00–00:00
        2: [[540, 1440]],                          // Di: 09:00–00:00
        3: [[540, 1440]],                          // Mi: 09:00–00:00
        4: [[540, 1440]],                          // Do: 09:00–01:00 (00:00–01:00 zählt zu Fr)
        5: [[0, 60], [540, 1440]],                 // Fr: Überlauf von Do + 09:00–01:00
        6: [[0, 60], [660, 870], [1050, 1440]],    // Sa: Überlauf von Fr + 11:00–14:30 + 17:30–01:00
      };

      const openStatus = (schedule[day] ?? []).some(
        ([start, end]) => currentTime >= start && currentTime < end
      );

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
