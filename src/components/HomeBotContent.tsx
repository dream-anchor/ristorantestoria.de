import { useLanguage } from '@/contexts/LanguageContext';

/**
 * HomeBotContent renders essential restaurant information for search engine crawlers.
 * Content is semantic HTML only - NO schema.org microdata attributes to avoid
 * duplicate structured data with the JSON-LD in StructuredData.tsx.
 */
const HomeBotContent = () => {
  const { language } = useLanguage();

  const content = (
    <article>
      <h1>STORIA – Ristorante • Pizzeria • Bar</h1>
      
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
        <p>+49 89 51519696</p>
        <p>info@ristorantestoria.de</p>
      </section>

      <section>
        <h2>{language === 'de' ? 'Öffnungszeiten' : 'Opening Hours'}</h2>
        <p>
          {language === 'de' ? 'Montag - Freitag: 09:00 - 01:00 Uhr' : 'Monday - Friday: 9:00 AM - 1:00 AM'}
        </p>
        <p>
          {language === 'de' ? 'Samstag - Sonntag: 12:00 - 01:00 Uhr' : 'Saturday - Sunday: 12:00 PM - 1:00 AM'}
        </p>
      </section>

      <section>
        <h2>{language === 'de' ? 'Unser Angebot' : 'Our Offerings'}</h2>
        <ul>
          <li><a href="/speisekarte">{language === 'de' ? 'Speisekarte' : 'Menu'}</a></li>
          <li><a href="/mittags-menu">{language === 'de' ? 'Mittagsmenü' : 'Lunch Menu'}</a></li>
          <li><a href="/getraenke">{language === 'de' ? 'Getränkekarte' : 'Drinks Menu'}</a></li>
          <li><a href="/besondere-anlaesse">{language === 'de' ? 'Besondere Anlässe' : 'Special Occasions'}</a></li>
          <li><a href="/reservierung">{language === 'de' ? 'Tisch reservieren' : 'Book a Table'}</a></li>
          <li><a href="/kontakt">{language === 'de' ? 'Kontakt & Anfahrt' : 'Contact & Directions'}</a></li>
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
              ? 'Authentische italienische Küche – neapolitanische Pizza aus dem Holzofen, hausgemachte Pasta, klassische italienische Gerichte.'
              : 'Authentic Italian cuisine – Neapolitan wood-fired pizza, homemade pasta, classic Italian dishes.'
            }
          </li>
        </ul>
      </section>

      <section>
        <h2>{language === 'de' ? 'Unsere Spezialitäten' : 'Our Specialties'}</h2>
        <ul>
          <li>{language === 'de' ? 'Neapolitanische Pizza aus dem Holzofen' : 'Neapolitan wood-fired pizza'}</li>
          <li>{language === 'de' ? 'Hausgemachte Pasta' : 'Homemade pasta'}</li>
          <li>{language === 'de' ? 'Frische Meeresfrüchte' : 'Fresh seafood'}</li>
          <li>{language === 'de' ? 'Italienische Weine' : 'Italian wines'}</li>
          <li>{language === 'de' ? 'Hausgemachtes Tiramisu' : 'Homemade tiramisu'}</li>
        </ul>
      </section>
    </article>
  );

  return (
    <>
      {/* For bots without JavaScript execution */}
      <noscript>{content}</noscript>
      
      {/* For JS-enabled crawlers like Googlebot - hidden from users */}
      <div className="sr-only" aria-hidden="true">
        {content}
      </div>
    </>
  );
};

export default HomeBotContent;
