import { useLanguage } from "@/contexts/LanguageContext";
import LocalizedLink from "@/components/LocalizedLink";

const HomeIntro = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="bg-white/70 backdrop-blur-[15px] rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white/40 max-w-[800px] mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-6 text-foreground">
            {t.homeIntro.title}
          </h2>
          <p className="leading-[1.8] text-[#444] text-base md:text-lg mb-4">
            {t.homeIntro.p1pre}
            <LocalizedLink
              to="neapolitanische-pizza-muenchen"
              className="font-semibold italic text-foreground hover:text-[#8b0000] transition-colors"
            >
              {t.homeIntro.link1}
            </LocalizedLink>
            {t.homeIntro.p1mid}
            <LocalizedLink
              to="getraenke"
              className="font-semibold italic text-foreground hover:text-[#8b0000] transition-colors"
            >
              {t.homeIntro.link2}
            </LocalizedLink>
            {t.homeIntro.p1post}
          </p>
          <p className="leading-[1.8] text-[#444] text-base md:text-lg">
            {t.homeIntro.p2pre}
            <LocalizedLink
              to="lunch-muenchen-maxvorstadt"
              className="font-semibold italic text-foreground hover:text-[#8b0000] transition-colors"
            >
              {t.homeIntro.link3}
            </LocalizedLink>
            {t.homeIntro.p2mid}
            <LocalizedLink
              to="aperitivo-muenchen"
              className="font-semibold italic text-foreground hover:text-[#8b0000] transition-colors"
            >
              {t.homeIntro.link4}
            </LocalizedLink>
            {t.homeIntro.p2post}
          </p>
          <LocalizedLink
            to="ueber-uns"
            className="inline-block mt-8 px-8 py-3 bg-[#8b0000] text-white rounded-full shadow-[0_4px_15px_rgba(139,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(139,0,0,0.4)] hover:-translate-y-0.5 transition-all text-sm font-medium"
          >
            {t.homeIntro.cta}
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
};

export default HomeIntro;
