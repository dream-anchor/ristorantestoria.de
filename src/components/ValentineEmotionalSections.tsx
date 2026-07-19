import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const MAMMA_IMG = "/mamma-speranza-kueche-storia-muenchen.webp";
const PLATE_IMG_1 = "/valentinstag-teller-1-storia.jpg";
const PLATE_IMG_2 = "/valentinstag-teller-2-storia.jpg";

const content = {
  de: {
    familyTitle: "Bei uns kocht die Familie",
    familyText:
      "Mamma Speranza bringt die Rezepte aus dem Cilento mit \u2013 jeder Gang am Valentinstag wird frisch zubereitet, mit der Ruhe und Sorgfalt einer s\u00fcditalienischen K\u00fcche, in der Liebe keine Floskel ist.",
    familyTextGeneric:
      "Mamma Speranza bringt die Rezepte aus dem Cilento mit \u2013 jeder Gang wird frisch zubereitet, mit der Ruhe und Sorgfalt einer s\u00fcditalienischen K\u00fcche, in der gutes Essen Zeit und Liebe braucht.",
    genericFaqTitle: "H\u00e4ufige Fragen",
    genericFaqs: [
      { q: "Gibt es vegetarische oder vegane Varianten?", a: "Ja, jedes Men\u00fc l\u00e4sst sich vegetarisch oder vegan gestalten. Sagen Sie uns Ihre W\u00fcnsche bei der Reservierung." },
      { q: "Wie weit im Voraus sollte ich reservieren?", a: "F\u00fcr besondere Anl\u00e4sse empfehlen wir, einige Tage im Voraus zu reservieren \u2013 so sichern wir Ihnen den passenden Tisch." },
    ],
    menuTitle: "Ein Vorgeschmack auf Ihren Abend",
    menuIntro: "So k\u00f6nnte Ihr Valentinsmen\u00fc aussehen \u2013 Gang f\u00fcr Gang, in Ruhe genossen.",
    courses: [
      { label: "Aperitivo", text: "[Platzhalter Aperitif \u2013 echtes Valentinstag-Getr\u00e4nk einsetzen]" },
      { label: "Antipasto", text: "[Platzhalter Vorspeise \u2013 echte Valentinstag-Vorspeise einsetzen]" },
      { label: "Primo / Secondo", text: "[Platzhalter Hauptgang \u2013 echten Valentinstag-Hauptgang einsetzen]" },
      { label: "Dolce", text: "[Platzhalter Dessert \u2013 echtes Valentinstag-Dessert einsetzen]" },
    ],
    menuNote: "Beispiel \u2013 jedes Men\u00fc passen wir gern an Ihre W\u00fcnsche, vegetarisch oder vegan, an.",
    momentTitle: "Der perfekte Moment",
    momentText:
      "Sie planen einen Heiratsantrag? Wir koordinieren den Moment diskret mit Ihnen \u2013 vom richtigen Zeitpunkt \u00fcber Blumen bis zum Lieblingswein. Sagen Sie uns einfach, wie der Abend werden soll.",
    momentCta: "Abend planen",
    quoteText: "Sehr sch\u00f6ne Location, gutes Essen, angenehmes Ambiente.",
    quoteAuthor: "Gast auf Google",
    quoteRating: "4,5 \u2605 aus \u00fcber 800 Bewertungen auf Google",
    scarcity: "Begrenzte Anzahl an Tischen am 14.2. \u2013 fr\u00fchzeitige Reservierung empfohlen.",
    romanticFaqTitle: "H\u00e4ufige Fragen f\u00fcr Ihren romantischen Abend",
    romanticFaqs: [
      { q: "Gibt es vegetarische oder vegane Varianten?", a: "Ja, jedes Men\u00fc l\u00e4sst sich vegetarisch oder vegan gestalten. Sagen Sie uns Ihre W\u00fcnsche bei der Reservierung." },
      { q: "Wie weit im Voraus sollte ich reservieren?", a: "Der Valentinstag ist unser meistgebuchter Abend \u2013 wir empfehlen, einige Wochen im Voraus zu reservieren." },
      { q: "Wie lange dauert der Abend / gibt es feste Sitzzeiten?", a: "[BITTE BEST\u00c4TIGEN: Dauer des Abends und ob es feste Sitzzeiten gibt]" },
      { q: "Gibt es Parkm\u00f6glichkeiten in der N\u00e4he?", a: "[BITTE BEST\u00c4TIGEN: z. B. Parkhaus K\u00f6nigsplatz / Anbindung]" },
    ],
    mammaAlt: "Mamma Speranza in der K\u00fcche des Ristorante STORIA M\u00fcnchen",
    plate1Alt: "Appetitlich angerichteter Gang des Valentinsmen\u00fcs im Ristorante STORIA M\u00fcnchen",
    plate2Alt: "Italienisches Dessert zum Valentinstag im Ristorante STORIA M\u00fcnchen",
  },
  en: {
    familyTitle: "Here, the family cooks",
    familyText:
      "Mamma Speranza brings the recipes from Cilento \u2013 every Valentine\u2019s course is freshly prepared, with the calm and care of a southern Italian kitchen where love is no empty word.",
    familyTextGeneric:
      "Mamma Speranza brings the recipes from Cilento \u2013 every course is freshly prepared, with the calm and care of a southern Italian kitchen where good food takes time and love.",
    genericFaqTitle: "Frequently asked questions",
    genericFaqs: [
      { q: "Are there vegetarian or vegan options?", a: "Yes, every menu can be made vegetarian or vegan. Just let us know your wishes when you reserve." },
      { q: "How far in advance should I reserve?", a: "For special occasions we recommend reserving a few days ahead \u2013 so we can secure the right table for you." },
    ],
    menuTitle: "A taste of your evening",
    menuIntro: "This is how your Valentine\u2019s menu could look \u2013 course by course, savoured slowly.",
    courses: [
      { label: "Aperitivo", text: "[Placeholder aperitif \u2013 insert real Valentine\u2019s drink]" },
      { label: "Antipasto", text: "[Placeholder starter \u2013 insert real Valentine\u2019s starter]" },
      { label: "Primo / Secondo", text: "[Placeholder main \u2013 insert real Valentine\u2019s main course]" },
      { label: "Dolce", text: "[Placeholder dessert \u2013 insert real Valentine\u2019s dessert]" },
    ],
    menuNote: "Example \u2013 we gladly adapt every menu to your wishes, vegetarian or vegan.",
    momentTitle: "The perfect moment",
    momentText:
      "Planning a proposal? We discreetly coordinate the moment with you \u2013 from the right timing to flowers and your favourite wine. Just tell us how the evening should be.",
    momentCta: "Plan the evening",
    quoteText: "Very beautiful location, great food, pleasant ambiance.",
    quoteAuthor: "Guest on Google",
    quoteRating: "4.5 \u2605 from over 800 reviews on Google",
    scarcity: "Limited number of tables on Feb 14 \u2013 early reservation recommended.",
    romanticFaqTitle: "Frequently asked questions for your romantic evening",
    romanticFaqs: [
      { q: "Are there vegetarian or vegan options?", a: "Yes, every menu can be made vegetarian or vegan. Just let us know your wishes when you reserve." },
      { q: "How far in advance should I reserve?", a: "Valentine\u2019s Day is our most booked evening \u2013 we recommend reserving a few weeks ahead." },
      { q: "How long does the evening last / are there fixed seating times?", a: "[PLEASE CONFIRM: length of the evening and whether there are fixed seating times]" },
      { q: "Is there parking nearby?", a: "[PLEASE CONFIRM: e.g. K\u00f6nigsplatz car park / public transport]" },
    ],
    mammaAlt: "Mamma Speranza in the kitchen of Ristorante STORIA Munich",
    plate1Alt: "Beautifully plated Valentine\u2019s course at Ristorante STORIA Munich",
    plate2Alt: "Italian Valentine\u2019s dessert at Ristorante STORIA Munich",
  },
  it: {
    familyTitle: "Da noi cucina la famiglia",
    familyText:
      "Mamma Speranza porta le ricette del Cilento \u2013 ogni portata di San Valentino \u00e8 preparata al momento, con la calma e la cura di una cucina del Sud Italia in cui l\u2019amore non \u00e8 una parola vuota.",
    familyTextGeneric:
      "Mamma Speranza porta le ricette del Cilento \u2013 ogni portata \u00e8 preparata al momento, con la calma e la cura di una cucina del Sud Italia in cui il buon cibo richiede tempo e amore.",
    genericFaqTitle: "Domande frequenti",
    genericFaqs: [
      { q: "Ci sono varianti vegetariane o vegane?", a: "S\u00ec, ogni men\u00f9 pu\u00f2 essere vegetariano o vegano. Comunicateci i vostri desideri al momento della prenotazione." },
      { q: "Con quanto anticipo conviene prenotare?", a: "Per le occasioni speciali consigliamo di prenotare con qualche giorno di anticipo \u2013 cos\u00ec possiamo riservarvi il tavolo giusto." },
    ],
    menuTitle: "Un assaggio della vostra serata",
    menuIntro: "Ecco come potrebbe essere il vostro men\u00f9 di San Valentino \u2013 portata dopo portata, con calma.",
    courses: [
      { label: "Aperitivo", text: "[Segnaposto aperitivo \u2013 inserire la bevanda reale di San Valentino]" },
      { label: "Antipasto", text: "[Segnaposto antipasto \u2013 inserire l\u2019antipasto reale di San Valentino]" },
      { label: "Primo / Secondo", text: "[Segnaposto piatto principale \u2013 inserire il piatto reale]" },
      { label: "Dolce", text: "[Segnaposto dolce \u2013 inserire il dolce reale]" },
    ],
    menuNote: "Esempio \u2013 adattiamo volentieri ogni men\u00f9 ai vostri desideri, vegetariano o vegano.",
    momentTitle: "Il momento perfetto",
    momentText:
      "State organizzando una proposta di matrimonio? Coordiniamo il momento con voi in modo discreto \u2013 dal momento giusto ai fiori fino al vino preferito. Diteci semplicemente come immaginate la serata.",
    momentCta: "Organizza la serata",
    quoteText: "Location molto bella, ottimo cibo, ambiente piacevole.",
    quoteAuthor: "Ospite su Google",
    quoteRating: "4,5 \u2605 da oltre 800 recensioni su Google",
    scarcity: "Numero limitato di tavoli il 14/2 \u2013 si consiglia di prenotare per tempo.",
    romanticFaqTitle: "Domande frequenti per la vostra serata romantica",
    romanticFaqs: [
      { q: "Ci sono varianti vegetariane o vegane?", a: "S\u00ec, ogni men\u00f9 pu\u00f2 essere vegetariano o vegano. Comunicateci i vostri desideri al momento della prenotazione." },
      { q: "Con quanto anticipo conviene prenotare?", a: "San Valentino \u00e8 la nostra serata pi\u00f9 prenotata \u2013 consigliamo di prenotare con qualche settimana di anticipo." },
      { q: "Quanto dura la serata / ci sono orari fissi al tavolo?", a: "[DA CONFERMARE: durata della serata ed eventuali orari fissi]" },
      { q: "Ci sono parcheggi nelle vicinanze?", a: "[DA CONFERMARE: es. parcheggio K\u00f6nigsplatz / collegamenti]" },
    ],
    mammaAlt: "Mamma Speranza nella cucina del Ristorante STORIA Monaco",
    plate1Alt: "Portata del men\u00f9 di San Valentino impiattata con cura al Ristorante STORIA Monaco",
    plate2Alt: "Dolce italiano di San Valentino al Ristorante STORIA Monaco",
  },
  fr: {
    familyTitle: "Ici, c\u2019est la famille qui cuisine",
    familyText:
      "Mamma Speranza apporte les recettes du Cilento \u2013 chaque plat de la Saint-Valentin est pr\u00e9par\u00e9 minute, avec le calme et le soin d\u2019une cuisine du sud de l\u2019Italie o\u00f9 l\u2019amour n\u2019est pas un vain mot.",
    familyTextGeneric:
      "Mamma Speranza apporte les recettes du Cilento \u2013 chaque plat est pr\u00e9par\u00e9 minute, avec le calme et le soin d\u2019une cuisine du sud de l\u2019Italie o\u00f9 la bonne cuisine demande du temps et de l\u2019amour.",
    genericFaqTitle: "Questions fr\u00e9quentes",
    genericFaqs: [
      { q: "Existe-t-il des variantes v\u00e9g\u00e9tariennes ou v\u00e9ganes ?", a: "Oui, chaque menu peut \u00eatre v\u00e9g\u00e9tarien ou v\u00e9gan. Indiquez-nous vos souhaits lors de la r\u00e9servation." },
      { q: "Combien de temps \u00e0 l\u2019avance dois-je r\u00e9server ?", a: "Pour les occasions sp\u00e9ciales, nous recommandons de r\u00e9server quelques jours \u00e0 l\u2019avance \u2013 afin de vous garantir la table qui convient." },
    ],
    menuTitle: "Un avant-go\u00fbt de votre soir\u00e9e",
    menuIntro: "Voici \u00e0 quoi pourrait ressembler votre menu de la Saint-Valentin \u2013 plat apr\u00e8s plat, savour\u00e9 tranquillement.",
    courses: [
      { label: "Aperitivo", text: "[Espace r\u00e9serv\u00e9 ap\u00e9ritif \u2013 ins\u00e9rer la vraie boisson de la Saint-Valentin]" },
      { label: "Antipasto", text: "[Espace r\u00e9serv\u00e9 entr\u00e9e \u2013 ins\u00e9rer la vraie entr\u00e9e]" },
      { label: "Primo / Secondo", text: "[Espace r\u00e9serv\u00e9 plat \u2013 ins\u00e9rer le vrai plat principal]" },
      { label: "Dolce", text: "[Espace r\u00e9serv\u00e9 dessert \u2013 ins\u00e9rer le vrai dessert]" },
    ],
    menuNote: "Exemple \u2013 nous adaptons volontiers chaque menu \u00e0 vos envies, v\u00e9g\u00e9tarien ou v\u00e9gan.",
    momentTitle: "Le moment parfait",
    momentText:
      "Vous pr\u00e9parez une demande en mariage ? Nous coordonnons le moment avec vous en toute discr\u00e9tion \u2013 du bon timing aux fleurs jusqu\u2019\u00e0 votre vin pr\u00e9f\u00e9r\u00e9. Dites-nous simplement comment vous imaginez la soir\u00e9e.",
    momentCta: "Planifier la soir\u00e9e",
    quoteText: "Tr\u00e8s bel endroit, bonne cuisine, ambiance agr\u00e9able.",
    quoteAuthor: "Client sur Google",
    quoteRating: "4,5 \u2605 sur plus de 800 avis sur Google",
    scarcity: "Nombre limit\u00e9 de tables le 14/2 \u2013 r\u00e9servation anticip\u00e9e recommand\u00e9e.",
    romanticFaqTitle: "Questions fr\u00e9quentes pour votre soir\u00e9e romantique",
    romanticFaqs: [
      { q: "Existe-t-il des variantes v\u00e9g\u00e9tariennes ou v\u00e9ganes ?", a: "Oui, chaque menu peut \u00eatre v\u00e9g\u00e9tarien ou v\u00e9gan. Indiquez-nous vos souhaits lors de la r\u00e9servation." },
      { q: "Combien de temps \u00e0 l\u2019avance dois-je r\u00e9server ?", a: "La Saint-Valentin est notre soir\u00e9e la plus r\u00e9serv\u00e9e \u2013 nous recommandons de r\u00e9server quelques semaines \u00e0 l\u2019avance." },
      { q: "Combien de temps dure la soir\u00e9e / y a-t-il des cr\u00e9neaux fixes ?", a: "[\u00c0 CONFIRMER : dur\u00e9e de la soir\u00e9e et cr\u00e9neaux \u00e9ventuels]" },
      { q: "Y a-t-il des possibilit\u00e9s de stationnement \u00e0 proximit\u00e9 ?", a: "[\u00c0 CONFIRMER : ex. parking K\u00f6nigsplatz / transports]" },
    ],
    mammaAlt: "Mamma Speranza dans la cuisine du Ristorante STORIA Munich",
    plate1Alt: "Plat du menu de la Saint-Valentin joliment dress\u00e9 au Ristorante STORIA Munich",
    plate2Alt: "Dessert italien de la Saint-Valentin au Ristorante STORIA Munich",
  },
} as const;

interface Props {
  /** Anchor id of the reservation/CTA block to link to from the "perfect moment" button */
  ctaAnchor?: string;
  /** Whether to emit a FAQPage JSON-LD for the FAQs (default true) */
  includeFaqSchema?: boolean;
  /**
   * 'valentine' = full romantic Valentine's page (menu preview, proposal block, 14.2. scarcity).
   * 'generic'   = generic special occasion (default): only family block + generic FAQ.
   */
  variant?: "valentine" | "generic";
}

// Bracketed editor notes that must NEVER render live, in any language.
const isPlaceholder = (text: string) =>
  /\[(?:Platzhalter|Placeholder|Segnaposto|Espace|BITTE BEST|PLEASE CONFIRM|DA CONFERMARE|\u00C0 CONFIRMER)/i.test(text);

const ValentineEmotionalSections = ({ ctaAnchor = "#final-cta", includeFaqSchema = true, variant = "generic" }: Props) => {
  const { language } = useLanguage();
  const vx = content[(language as "de" | "en" | "it" | "fr")] || content.de;
  const isValentine = variant === "valentine";

  // Generic occasions get neutral wording (no "am Valentinstag").
  const familyText = isValentine ? vx.familyText : vx.familyTextGeneric;

  // FAQ: Valentine uses its romantic FAQs, generic uses the neutral ones.
  // Placeholder answers/questions are always dropped so they can never render live.
  const faqTitle = isValentine ? vx.romanticFaqTitle : vx.genericFaqTitle;
  const faqs = (isValentine ? vx.romanticFaqs : vx.genericFaqs).filter(
    (f) => !isPlaceholder(f.q) && !isPlaceholder(f.a)
  );

  // Menu preview courses (Valentine only) \u2014 drop placeholder courses; hide section if none real.
  const courses = isValentine ? vx.courses.filter((c) => !isPlaceholder(c.text)) : [];

  return (
    <>
      {includeFaqSchema && faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": { "@type": "Answer", "text": faq.a },
          })),
        }) }} />
      )}

      {/* Family / senses block \u2014 both variants */}
      <section className="mb-16">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-center bg-secondary/40 rounded-2xl p-6 md:p-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3 text-primary">{vx.familyTitle}</h2>
            <p className="text-muted-foreground leading-relaxed">{familyText}</p>
          </div>
          <img src={MAMMA_IMG} alt={vx.mammaAlt} loading="lazy" width={220} height={220} className="w-40 h-40 md:w-52 md:h-52 object-cover rounded-2xl mx-auto shadow-md" />
        </div>
      </section>

      {/* Example menu + plate photos \u2014 Valentine only, only with real (non-placeholder) courses */}
      {isValentine && courses.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-3 text-center">{vx.menuTitle}</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">{vx.menuIntro}</p>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <ul className="space-y-5">
              {courses.map((c, i) => (
                <li key={i} className="border-l-2 border-primary pl-4">
                  <span className="block text-sm uppercase tracking-wide text-primary font-sans font-medium mb-1">{c.label}</span>
                  <span className="block font-serif text-lg text-foreground/90">{c.text}</span>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-4">
              <img src={PLATE_IMG_1} alt={vx.plate1Alt} loading="lazy" width={400} height={500} className="w-full h-full object-cover rounded-2xl aspect-[4/5] shadow-sm" />
              <img src={PLATE_IMG_2} alt={vx.plate2Alt} loading="lazy" width={400} height={500} className="w-full h-full object-cover rounded-2xl aspect-[4/5] shadow-sm mt-8" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic text-center mt-6">{vx.menuNote}</p>
        </section>
      )}

      {/* Perfect moment highlight \u2014 Valentine only */}
      {isValentine && (
        <section className="mb-16">
          <div className="border-l-4 border-primary bg-primary/5 rounded-r-2xl p-6 md:p-8">
            <h2 className="text-2xl font-serif font-bold mb-3 text-primary">{vx.momentTitle}</h2>
            <p className="text-muted-foreground leading-relaxed mb-5">{vx.momentText}</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <a href={ctaAnchor}><ArrowRight className="w-4 h-4 mr-2" />{vx.momentCta}</a>
            </Button>
          </div>
        </section>
      )}

      {/* FAQ \u2014 both variants */}
      {faqs.length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold mb-8 text-center">{faqTitle}</h2>
          <Accordion type="single" collapsible defaultValue="rfaq-0" className="max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`rfaq-${i}`}>
                <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                <AccordionContent forceMount className="text-muted-foreground data-[state=closed]:hidden">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {/* Guest quote \u2014 Valentine only */}
      {isValentine && (
        <section className="mb-12">
          <figure className="max-w-2xl mx-auto text-center bg-secondary/40 rounded-2xl p-8">
            <div className="flex items-center justify-center gap-1 mb-4 text-primary" aria-label={vx.quoteRating}>
              {[1, 2, 3, 4].map((n) => <span key={n} className="text-xl">{"\u2605"}</span>)}
              <span className="text-xl opacity-50">{"\u2605"}</span>
            </div>
            <blockquote className="font-serif text-xl md:text-2xl text-foreground/90 italic mb-4">{"\u201E"}{vx.quoteText}{"\u201C"}</blockquote>
            <figcaption className="text-sm text-muted-foreground">
              {"\u2013 "}{vx.quoteAuthor}
              <span className="block mt-1">{vx.quoteRating}</span>
            </figcaption>
          </figure>
        </section>
      )}

      {/* Scarcity note (14.2.) \u2014 Valentine only */}
      {isValentine && <p className="text-center text-sm font-medium text-primary mb-12">{vx.scarcity}</p>}
    </>
  );
};

export default ValentineEmotionalSections;
