import { Helmet } from '@/lib/helmetAsync';
import { useLanguage } from '@/contexts/LanguageContext';
import reviewsData from '@/data/google-reviews-de.json';
import { STORIA } from '@/config/storia-entity';

interface StructuredDataProps {
  type?: 'restaurant' | 'menu' | 'faq' | 'breadcrumb' | 'event';
  includeReviews?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqItems?: Array<{ question: string; answer: string }>;
  eventData?: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  };
}

const addressSchema = {
  '@type': 'PostalAddress' as const,
  streetAddress: STORIA.address.street,
  addressLocality: STORIA.address.city,
  postalCode: STORIA.address.zip,
  addressRegion: STORIA.address.state,
  addressCountry: STORIA.address.country,
};

const geoSchema = {
  '@type': 'GeoCoordinates' as const,
  latitude: STORIA.geo.lat,
  longitude: STORIA.geo.lng,
};

const StructuredData = ({ type = 'restaurant', includeReviews = true, breadcrumbs, faqItems, eventData }: StructuredDataProps) => {
  const { t } = useLanguage();

  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${STORIA.url}/#restaurant`,
    name: STORIA.schemaName,
    alternateName: STORIA.alternateName[0],
    description: t.pages.index.description,
    url: STORIA.url,
    telephone: STORIA.phone,
    email: STORIA.email,
    image: [
      'https://iieethejhwfsyzhbweps.supabase.co/storage/v1/object/public/menu-pdfs/og-image.jpg',
    ],
    logo: `${STORIA.url}/storia-logo.webp`,
    priceRange: STORIA.priceRange,
    servesCuisine: STORIA.cuisine,
    acceptsReservations: true,
    hasMenu: `${STORIA.url}/speisekarte`,
    address: addressSchema,
    geo: geoSchema,
    foundingDate: STORIA.foundedISO,
    openingHoursSpecification: STORIA.openingHoursSpec.map(spec => ({
      '@type': 'OpeningHoursSpecification',
      ...spec,
    })),
    sameAs: STORIA.sameAs,
    founder: STORIA.founders.map(f => ({
      '@type': 'Person',
      name: f.name,
      ...(f.alternateName ? { alternateName: f.alternateName } : {}),
      jobTitle: f.role,
    })),
    amenityFeature: STORIA.amenities.map(a => ({
      '@type': 'LocationFeatureSpecification',
      name: a.name,
      value: a.value,
    })),
    paymentAccepted: STORIA.paymentAccepted.join(', '),
    currenciesAccepted: 'EUR',
    areaServed: [
      { '@type': 'City', name: 'München' },
      { '@type': 'AdministrativeArea', name: STORIA.address.neighborhood },
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
    publicTransportNearby: 'U-Bahn Königsplatz (U2, U8) 3 Min., Hauptbahnhof 7 Min., Tram 20/21 Karlstraße 3 Min., Bus 68 Karlstraße',
    parking: {
      '@type': 'ParkingFacility',
      name: STORIA.parking.name,
      address: `${STORIA.parking.address}, 80335 München`,
    },
    publicAccess: true,
    smokingAllowed: false,
    potentialAction: [
      {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${STORIA.url}/reservierung`,
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
          urlTemplate: `tel:${STORIA.phoneTel}`,
          actionPlatform: 'http://schema.org/MobileWebPlatform',
        },
      },
    ],
    ...(reviewsData.rating > 0 && reviewsData.totalReviews > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: reviewsData.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: reviewsData.totalReviews,
      },
    } : {}),
    ...(includeReviews && reviewsData.reviews?.length > 0 ? {
      review: reviewsData.reviews.slice(0, 5).map((r: { authorName: string; rating: number; text: string }) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.authorName },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: r.text,
      })),
    } : {}),
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${STORIA.url}/#website`,
    name: STORIA.schemaName,
    url: STORIA.url,
    publisher: {
      '@id': `${STORIA.url}/#restaurant`,
    },
    inLanguage: ['de-DE', 'en-US'],
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${STORIA.url}/#organization`,
    name: STORIA.companyName,
    description: t.pages.index.description,
    url: STORIA.url,
    logo: {
      '@type': 'ImageObject',
      url: `${STORIA.url}/storia-logo.webp`,
      width: 512,
      height: 512,
    },
    sameAs: STORIA.sameAs,
    foundingDate: STORIA.foundedISO,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: STORIA.phone,
      contactType: 'reservations',
      availableLanguage: ['German', 'English', 'Italian'],
    },
    address: addressSchema,
  };

  const breadcrumbSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${STORIA.url}${item.url}`,
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

  const eventSchema = eventData ? {
    '@context': 'https://schema.org',
    '@type': 'FoodEvent',
    name: eventData.name,
    description: eventData.description,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    location: {
      '@type': 'Restaurant',
      name: STORIA.schemaName,
      address: addressSchema,
    },
    organizer: {
      '@type': 'Organization',
      name: STORIA.companyName,
      url: STORIA.url,
    },
    offers: {
      '@type': 'Offer',
      url: `${STORIA.url}/reservierung`,
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
