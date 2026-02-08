import { useLanguage } from "@/contexts/LanguageContext";
import LocalizedLink from "@/components/LocalizedLink";
import weinserviceImage from "@/assets/weinservice-italienische-weine-storia-muenchen.webp";
import cocktailsImage from "@/assets/aperitivo-cocktails-bar-storia-muenchen.webp";
import seafoodImage from "@/assets/meeresfruechte-antipasti-storia-muenchen.webp";

const HomeIntro = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 md:py-14 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-xl md:text-2xl font-serif font-semibold mb-6 text-center md:text-left">
          {t.homeIntro.title}
        </h2>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
              {t.homeIntro.p1pre}
              <LocalizedLink
                to="neapolitanische-pizza-muenchen"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                {t.homeIntro.link1}
              </LocalizedLink>
              {t.homeIntro.p1mid}
              <LocalizedLink
                to="getraenke"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                {t.homeIntro.link2}
              </LocalizedLink>
              {t.homeIntro.p1post}
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
              {t.homeIntro.p2pre}
              <LocalizedLink
                to="lunch-muenchen-maxvorstadt"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                {t.homeIntro.link3}
              </LocalizedLink>
              {t.homeIntro.p2mid}
              <LocalizedLink
                to="aperitivo-muenchen"
                className="font-semibold text-foreground hover:text-primary transition-colors"
              >
                {t.homeIntro.link4}
              </LocalizedLink>
              {t.homeIntro.p2post}
            </p>
            <LocalizedLink
              to="ueber-uns"
              className="text-sm font-medium text-primary hover:underline transition-colors"
            >
              {t.homeIntro.cta} →
            </LocalizedLink>
          </div>

          {/* Images */}
          <div className="flex md:flex-col gap-3 w-full md:w-48 lg:w-56 shrink-0">
            <img
              src={weinserviceImage}
              alt={t.imageGrid.altWine}
              width={224}
              height={150}
              loading="lazy"
              className="w-1/3 md:w-full h-28 md:h-36 object-cover rounded"
            />
            <img
              src={cocktailsImage}
              alt={t.imageGrid.altCocktails}
              width={224}
              height={150}
              loading="lazy"
              className="w-1/3 md:w-full h-28 md:h-36 object-cover rounded"
            />
            <img
              src={seafoodImage}
              alt={t.imageGrid.altSeafood}
              width={224}
              height={150}
              loading="lazy"
              className="w-1/3 md:w-full h-28 md:h-36 object-cover rounded"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeIntro;
