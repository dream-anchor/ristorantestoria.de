import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface StructuredDataProps {
  type?: 'restaurant' | 'menu' | 'faq' | 'breadcrumb';
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqItems?: Array<{ question: string; answer: string }>;
}

const StructuredData = ({ type = 'restaurant', breadcrumbs, faqItems }: StructuredDataProps) => {
  const { language } = useLanguage();

  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://ristorantestoria.de/#restaurant',
    name: 'STORIA - Ristorante • Pizzeria • Bar',
    alternateName: 'Ristorante STORIA',
    description: language === 'de' 
      ? 'Authentisches italienisches Restaurant in München mit frischer Pasta, Pizza aus dem Holzofen und erlesenen Weinen.'
      : 'Authentic Italian restaurant in Munich with fresh pasta, wood-fired pizza, and fine wines.',
    url: 'https://ristorantestoria.de',
    telephone: '+49-89-515196',
    email: 'info@ristorantestoria.de',
    image: [
      'https://ristorantestoria.de/og-image.jpg',
    ],
    logo: 'https://ristorantestoria.de/storia-logo.webp',
    priceRange: '€€',
    servesCuisine: ['Italian', 'Pizza', 'Pasta', 'Mediterranean'],
    acceptsReservations: 'True',
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
      'https://www.instagram.com/ristorantestoria/',
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '250',
      bestRating: '5',
      worstRating: '1',
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

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://ristorantestoria.de/#localbusiness',
    name: 'STORIA - Ristorante • Pizzeria • Bar',
    image: 'https://ristorantestoria.de/og-image.jpg',
    telephone: '+49-89-515196',
    email: 'info@ristorantestoria.de',
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
    url: 'https://ristorantestoria.de',
    openingHoursSpecification: restaurantSchema.openingHoursSpecification,
    priceRange: '€€',
  };

  return (
    <Helmet>
      {type === 'restaurant' && (
        <>
          <script type="application/ld+json">
            {JSON.stringify(restaurantSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(localBusinessSchema)}
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
    </Helmet>
  );
};

export default StructuredData;
