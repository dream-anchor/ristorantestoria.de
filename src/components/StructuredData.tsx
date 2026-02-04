import { Helmet } from '@/lib/helmetAsync';
import { useLanguage } from '@/contexts/LanguageContext';

interface StructuredDataProps {
  type?: 'restaurant' | 'menu' | 'faq' | 'breadcrumb' | 'event';
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqItems?: Array<{ question: string; answer: string }>;
  eventData?: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  };
}

const StructuredData = ({ type = 'restaurant', breadcrumbs, faqItems, eventData }: StructuredDataProps) => {
  const { t } = useLanguage();

  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://ristorantestoria.de/#restaurant',
    name: 'STORIA - Ristorante • Pizzeria • Bar',
    alternateName: 'Ristorante STORIA',
    description: t.pages.index.description,
    url: 'https://ristorantestoria.de',
    telephone: '+49 89 51519696',
    email: 'info@ristorantestoria.de',
    image: [
      'https://iieethejhwfsyzhbweps.supabase.co/storage/v1/object/public/menu-pdfs/og-image.jpg',
    ],
    logo: 'https://ristorantestoria.de/storia-logo.webp',
    priceRange: '€€',
    servesCuisine: ['Italian', 'Pizza', 'Pasta', 'Mediterranean'],
    acceptsReservations: true,
    hasMenu: 'https://ristorantestoria.de/speisekarte',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Karlstraße 47a',
      addressLocality: 'München',
      postalCode: '80333',
      addressRegion: 'Bayern',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.1456,
      longitude: 11.5656,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '01:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '12:00',
        closes: '01:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/ristorante_storia/',
      'https://www.opentable.de/r/storia-ristorante-pizzeria-bar-munchen',
      'https://maps.google.com/?cid=3761590175870856939',
    ],
    founder: [
      {
        '@type': 'Person',
        name: 'Domenico Speranza',
        alternateName: 'Mimmo',
      },
      {
        '@type': 'Person',
        name: 'Nicola Speranza',
      },
    ],
    // Ausstattung & Features für Rich Snippets
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Terrasse', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Barrierefrei', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'WLAN', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Klimaanlage', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Privaträume für Events', value: true },
    ],
    // Zahlungsmethoden
    paymentAccepted: 'Cash, Credit Card, EC Card, Visa, Mastercard, American Express',
    currenciesAccepted: 'EUR',
    // Service-Gebiet für Local SEO (erweitert für bessere lokale Abdeckung)
    areaServed: [
      { '@type': 'City', name: 'München' },
      { '@type': 'AdministrativeArea', name: 'Maxvorstadt' },
      { '@type': 'AdministrativeArea', name: 'Schwabing' },
      { '@type': 'AdministrativeArea', name: 'Schwabing-West' },
      { '@type': 'AdministrativeArea', name: 'Neuhausen' },
      { '@type': 'AdministrativeArea', name: 'Nymphenburg' },
      { '@type': 'AdministrativeArea', name: 'Altstadt-Lehel' },
      { '@type': 'AdministrativeArea', name: 'Ludwigsvorstadt-Isarvorstadt' },
      { '@type': 'AdministrativeArea', name: 'Schwanthalerhöhe' },
      { '@type': 'AdministrativeArea', name: 'Sendling' },
      { '@type': 'AdministrativeArea', name: 'Au-Haidhausen' },
    ],
    // Öffentlich zugänglich & Raucher-Policy
    publicAccess: true,
    smokingAllowed: false,
    // Aktionen für Google Rich Results
    potentialAction: [
      {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://ristorantestoria.de/reservierung',
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform',
          ],
        },
        result: {
          '@type': 'Reservation',
          name: 'Tischreservierung',
        },
      },
      {
        '@type': 'OrderAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'tel:+498951519696',
          actionPlatform: 'http://schema.org/MobileWebPlatform',
        },
      },
    ],
    // aggregateRating entfernt - Google erlaubt dies nur wenn Reviews auf der Seite sichtbar sind
    // (nicht hinter Consent-Banner). Kann wieder aktiviert werden wenn Reviews ohne Consent angezeigt werden.
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://ristorantestoria.de/#website',
    name: 'STORIA - Ristorante • Pizzeria • Bar',
    url: 'https://ristorantestoria.de',
    publisher: {
      '@id': 'https://ristorantestoria.de/#restaurant',
    },
    inLanguage: ['de-DE', 'en-US'],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://ristorantestoria.de/#organization',
    name: 'Speranza GmbH',
    description: t.pages.index.description,
    url: 'https://ristorantestoria.de',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ristorantestoria.de/storia-logo.webp',
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://www.instagram.com/ristorante_storia/',
      'https://www.opentable.de/r/storia-ristorante-pizzeria-bar-munchen',
      'https://maps.google.com/?cid=3761590175870856939',
    ],
    foundingDate: '1995-01-01',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+49 89 51519696',
      contactType: 'reservations',
      availableLanguage: ['German', 'English', 'Italian'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Karlstraße 47a',
      addressLocality: 'München',
      postalCode: '80333',
      addressRegion: 'Bayern',
      addressCountry: 'DE',
    },
  };

  const breadcrumbSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://ristorantestoria.de${item.url}`,
    })),
  } : null;

  const faqSchema = faqItems ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null;

  // LocalBusiness schema removed - Restaurant is already a subtype of LocalBusiness
  // Having both causes duplicate entity warnings in Google Search Console

  const eventSchema = eventData ? {
    '@context': 'https://schema.org',
    '@type': 'FoodEvent',
    name: eventData.name,
    description: eventData.description,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    location: {
      '@type': 'Restaurant',
      name: 'STORIA - Ristorante • Pizzeria • Bar',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Karlstraße 47a',
        addressLocality: 'München',
        postalCode: '80333',
        addressCountry: 'DE',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Speranza GmbH',
      url: 'https://ristorantestoria.de',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://ristorantestoria.de/reservierung',
      availability: 'https://schema.org/InStock',
    },
  } : null;

  return (
    <Helmet>
      {type === 'restaurant' && (
        <>
          <script type="application/ld+json">
            {JSON.stringify(restaurantSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(websiteSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(organizationSchema)}
          </script>
        </>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
      {eventSchema && (
        <script type="application/ld+json">
          {JSON.stringify(eventSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default StructuredData;
