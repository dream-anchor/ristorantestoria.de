import { useLanguage } from '@/contexts/LanguageContext';
import { PhoneText } from "@/lib/linkifyPhone";

/**
 * HomeBotContent renders essential restaurant information for search engine crawlers.
 * Content is semantic HTML only - NO schema.org microdata attributes to avoid
 * duplicate structured data with the JSON-LD in StructuredData.tsx.
 */
const HomeBotContent = () => {
  const { language } = useLanguage();

  const content = (
    <article>
      <h2>STORIA – Ristorante • Pizzeria • Bar</h2>
      
      <p>
        {language === 'de' 
          ? 'Authentisches italienisches Restaurant in München Maxvorstadt. Genießen Sie neapolitanische Pizza, hausgemachte Pasta und klassische italienische Gerichte in eleganter Atmosphäre nahe Königsplatz und Hauptbahnhof.'
          : 'Authentic Italian restaurant in Munich Maxvorstadt. Enjoy Neapolitan pizza, homemade pasta and classic Italian dishes in an elegant atmosphere near Königsplatz and Hauptbahnhof.'
        }
      </p>

      <section>
        <h2>{language === 'de' ? 'Kontakt' : 'Contact'}</h2>
        <address>
          Karlstraße 47a, 80333 München, Deutschland
        </address>
        <p><PhoneText>+49 89 51519696</PhoneText></p>
        <p>info@ristorantestoria.de</p>
      </section>

      <section>
        <h2>{language === 'de' ? 'Öffnungszeiten' : 'Opening Hours'}</h2>
        <p>
          {language === 'de' ? 'Montag - Mittwoch: 09:00 - 00:00 Uhr' : 'Monday - Wednesday: 9:00 AM - 12:00 midnight'}
        </p>
        <p>
          {language === 'de' ? 'Donnerstag - Freitag: 09:00 - 01:00 Uhr' : 'Thursday - Friday: 9:00 AM - 1:00 AM'}
        </p>
        <p>
          {language === 'de' ? 'Samstag: 11:00 - 14:30 & 17:30 - 01:00 Uhr' : 'Saturday: 11:00 AM - 2:30 PM & 5:30 PM - 1:00 AM'}
        </p>
        <p>
          {language === 'de' ? 'Sonntag: 12:00 - 14:30 & 17:30 - 22:30 Uhr' : 'Sunday: 12:00 PM - 2:30 PM & 5:30 PM - 10:30 PM'}
        </p>
      </section>

      <section>
        <h2>{language === 'de' ? 'Unser Angebot' : 'Our Offerings'}</h2>
        <ul>
          <li><a href="/speisekarte/">{language === 'de' ? 'Speisekarte' : 'Menu'}</a></li>
          <li><a href="/mittags-menu/">{language === 'de' ? 'Mittagsmenü' : 'Lunch Menu'}</a></li>
          <li><a href="/getraenke/">{language === 'de' ? 'Getränkekarte' : 'Drinks Menu'}</a></li>
          <li><a href="/besondere-anlaesse/">{language === 'de' ? 'Besondere Anlässe' : 'Special Occasions'}</a></li>
          <li><a href="/reservierung/">{language === 'de' ? 'Tisch reservieren' : 'Book a Table'}</a></li>
          <li><a href="/kontakt/">{language === 'de' ? 'Kontakt & Anfahrt' : 'Contact & Directions'}</a></li>
        </ul>
      </section>

      <section>
        <h2>{language === 'de' ? 'Wichtige Informationen' : 'Key Information'}</h2>
        <ul>
          <li>
            <strong>{language === 'de' ? 'Standort:' : 'Location:'}</strong>{' '}
            {language === 'de' 
              ? 'Karlstraße 47a, München Maxvorstadt – wenige Gehminuten vom Königsplatz und Hauptbahnhof.'
              : 'Karlstraße 47a, Munich Maxvorstadt – a few minutes walk from Königsplatz and the main train station.'
            }
          </li>
          <li>
            <strong>{language === 'de' ? 'Reservierung:' : 'Reservations:'}</strong>{' '}
            {language === 'de'
              ? 'Online über unsere Website oder telefonisch unter +49 89 51519696.'
              : 'Online through our website or by phone at +49 89 51519696.'
            }
          </li>
          <li>
            <strong>{language === 'de' ? 'Catering:' : 'Catering:'}</strong>{' '}
            {language === 'de'
              ? 'Professionelles Catering für Firmenevents, Hochzeiten und private Feiern unter events-storia.de.'
              : 'Professional catering for corporate events, weddings, and private celebrations at events-storia.de.'
            }
          </li>
          <li>
            <strong>{language === 'de' ? 'Küche:' : 'Cuisine:'}</strong>{' '}
            {language === 'de'
              ? 'Authentische italienische Küche – neapolitanische Pizza aus dem Steinofen, hausgemachte Pasta, klassische italienische Gerichte.'
              : 'Authentic Italian cuisine – Neapolitan stone-oven pizza, homemade pasta, classic Italian dishes.'
            }
          </li>
        </ul>
      </section>

      <section>
        <h2>{language === 'de' ? 'Unsere Spezialitäten' : 'Our Specialties'}</h2>
        <ul>
          <li>{language === 'de' ? 'Neapolitanische Pizza aus dem Steinofen' : 'Neapolitan stone-oven pizza'}</li>
          <li>{language === 'de' ? 'Hausgemachte Pasta' : 'Homemade pasta'}</li>
          <li>{language === 'de' ? 'Frische Meeresfrüchte' : 'Fresh seafood'}</li>
          <li>{language === 'de' ? 'Italienische Weine' : 'Italian wines'}</li>
          <li>{language === 'de' ? 'Hausgemachtes Tiramisu' : 'Homemade tiramisu'}</li>
        </ul>
      </section>
    </article>
  );

  return (
    <noscript>{content}</noscript>
  );
};

export default HomeBotContent;
