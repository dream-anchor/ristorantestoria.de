import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLandingpageContent, LandingpageContent } from "@/hooks/useLandingpageContent";
import { useLanguage } from "@/contexts/LanguageContext";

interface DynamicPackagesSectionProps {
  pageSlug: string;
  title: string;
  subtitle?: string;
  fallbackContent?: React.ReactNode;
}

const formatPrice = (price: number | null, pricePerPerson: boolean, language: string): string => {
  if (price === null) return '';
  const formattedPrice = new Intl.NumberFormat(language === 'de' ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  if (pricePerPerson) {
    return language === 'de' ? `ab ${formattedPrice} p.P.` : `from ${formattedPrice} pp`;
  }
  return formattedPrice;
};

const formatGuestRange = (min: number | null, max: number | null, language: string): string => {
  if (!min && !max) return '';
  if (min && max) {
    return language === 'de' ? `${min}–${max} Gäste` : `${min}–${max} guests`;
  }
  if (min) {
    return language === 'de' ? `ab ${min} Gäste` : `from ${min} guests`;
  }
  return '';
};

export function DynamicPackagesSection({
  pageSlug,
  title,
  subtitle,
  fallbackContent,
}: DynamicPackagesSectionProps) {
  const { data: content, isLoading, error } = useLandingpageContent(pageSlug);
  const { language } = useLanguage();

  // Show fallback if loading, error, or no packages
  if (isLoading) {
    return (
      <section className="mb-16">
        <h2 className="text-3xl font-serif font-bold mb-4 text-center">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-center mb-8">{subtitle}</p>}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-6 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error || !content || content.featuredPackages.length === 0) {
    if (fallbackContent) {
      return <>{fallbackContent}</>;
    }
    return null;
  }

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-serif font-bold mb-4 text-center">{title}</h2>
      {subtitle && <p className="text-muted-foreground text-center mb-8">{subtitle}</p>}
      
      {/* Dynamic AI intro text */}
      {content.intro && (
        <p className="text-lg text-muted-foreground text-center mb-8 max-w-3xl mx-auto">
          {content.intro}
        </p>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        {content.featuredPackages.map((pkg, index) => (
          <Card 
            key={pkg.id} 
            className={index === 0 ? "border-primary bg-primary/5 relative" : "border-border"}
          >
            {index === 0 && (
              <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                {language === 'de' ? 'Beliebt' : 'Popular'}
              </span>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif">{pkg.name}</CardTitle>
              {(pkg.min_guests || pkg.max_guests) && (
                <p className="text-muted-foreground text-sm">
                  {formatGuestRange(pkg.min_guests, pkg.max_guests, language)}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {pkg.includes && pkg.includes.length > 0 && (
                <ul className="text-sm space-y-1 mb-4">
                  {pkg.includes.slice(0, 4).map((item, i) => (
                    <li key={i} className="text-muted-foreground">• {String(item)}</li>
                  ))}
                </ul>
              )}
              {pkg.price !== null && (
                <p className="font-bold text-primary">
                  {formatPrice(pkg.price, pkg.price_per_person, language)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Dynamic highlights text */}
      {content.highlightsText && (
        <div className="mt-8 bg-secondary/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">{content.highlightsText}</p>
        </div>
      )}
      
      {/* Price summary info */}
      {content.pricesSummary && content.pricesSummary.packages_count > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          {language === 'de' 
            ? `${content.pricesSummary.packages_count} Pakete verfügbar • Preise ab ${content.pricesSummary.min_package_price}€`
            : `${content.pricesSummary.packages_count} packages available • Prices from €${content.pricesSummary.min_package_price}`
          }
        </p>
      )}
    </section>
  );
}

export function DynamicCateringHighlights({
  pageSlug,
  title,
}: {
  pageSlug: string;
  title: string;
}) {
  const { data: content, isLoading } = useLandingpageContent(pageSlug);
  const { language } = useLanguage();

  if (isLoading || !content || content.menuHighlights.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-serif font-bold mb-8 text-center">{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {content.menuHighlights.slice(0, 6).map((item, index) => (
          <div key={index} className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-1">{item.name}</h3>
            {item.description && (
              <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{item.category}</span>
              {item.price_display && (
                <span className="text-sm font-medium text-primary">{item.price_display}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
