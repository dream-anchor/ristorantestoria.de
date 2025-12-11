import { useLanguage } from '@/contexts/LanguageContext';

/**
 * HomeBotContent renders essential restaurant information for search engine crawlers.
 * Content is static but includes all SEO-relevant information.
 */
const HomeBotContent = () => {
  const { language } = useLanguage();

  const content = (
    <article itemScope itemType="https://schema.org/Restaurant">
      <h1 itemProp="name">STORIA – Ristorante • Pizzeria • Bar</h1>
      
      <p itemProp="description">
        {language === 'de' 
          ? 'Authentisches italienisches Restaurant in München Maxvorstadt. Genießen Sie neapolitanische Pizza, hausgemachte Pasta und klassische italienische Gerichte in eleganter Atmosphäre nahe Königsplatz und Hauptbahnhof.'
          : 'Authentic Italian restaurant in Munich Maxvorstadt. Enjoy Neapolitan pizza, homemade pasta and classic Italian dishes in an elegant atmosphere near Königsplatz and Hauptbahnhof.'
        }
      </p>

      <section>
        <h2>{language === 'de' ? 'Kontakt' : 'Contact'}</h2>
        <address itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="streetAddress">Karlstraße 47a</span>,{' '}
          <span itemProp="postalCode">80333</span>{' '}
          <span itemProp="addressLocality">München</span>,{' '}
          <span itemProp="addressCountry">Deutschland</span>
        </address>
        <p>
          <span itemProp="telephone">+49 89 515196</span>
        </p>
        <p>
          <span itemProp="email">info@ristorantestoria.de</span>
        </p>
      </section>

      <section>
        <h2>{language === 'de' ? 'Öffnungszeiten' : 'Opening Hours'}</h2>
        <p itemProp="openingHours" content="Mo-Fr 09:00-01:00">
          {language === 'de' ? 'Montag - Freitag: 09:00 - 01:00 Uhr' : 'Monday - Friday: 9:00 AM - 1:00 AM'}
        </p>
        <p itemProp="openingHours" content="Sa-Su 12:00-01:00">
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
        <h2>{language === 'de' ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions'}</h2>
        <dl>
          <dt>{language === 'de' ? 'Wo befindet sich das Restaurant STORIA?' : 'Where is STORIA restaurant located?'}</dt>
          <dd>{language === 'de' 
            ? 'STORIA befindet sich in der Karlstraße 47a in München Maxvorstadt, nur wenige Gehminuten vom Königsplatz und dem Hauptbahnhof entfernt.'
            : 'STORIA is located at Karlstraße 47a in Munich Maxvorstadt, just a few minutes walk from Königsplatz and the main train station.'
          }</dd>
          
          <dt>{language === 'de' ? 'Kann ich einen Tisch reservieren?' : 'Can I book a table?'}</dt>
          <dd>{language === 'de'
            ? 'Ja, Reservierungen sind online über unsere Website oder telefonisch unter +49 89 515196 möglich.'
            : 'Yes, reservations can be made online through our website or by phone at +49 89 515196.'
          }</dd>
          
          <dt>{language === 'de' ? 'Bietet STORIA Catering an?' : 'Does STORIA offer catering?'}</dt>
          <dd>{language === 'de'
            ? 'Ja, wir bieten professionelles Catering für Firmenevents, Hochzeiten und private Feiern. Besuchen Sie events-storia.de für mehr Informationen.'
            : 'Yes, we offer professional catering for corporate events, weddings, and private celebrations. Visit events-storia.de for more information.'
          }</dd>
          
          <dt>{language === 'de' ? 'Welche Küche bietet STORIA?' : 'What cuisine does STORIA offer?'}</dt>
          <dd>{language === 'de'
            ? 'STORIA serviert authentische italienische Küche mit Fokus auf neapolitanische Pizza aus dem Holzofen, hausgemachte Pasta und klassische italienische Gerichte.'
            : 'STORIA serves authentic Italian cuisine with a focus on Neapolitan wood-fired pizza, homemade pasta, and classic Italian dishes.'
          }</dd>
        </dl>
      </section>

      <section itemProp="servesCuisine" content="Italian">
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
