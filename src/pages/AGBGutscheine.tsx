import Header from "@/components/Header";
import { PhoneText } from "@/lib/linkifyPhone";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Link } from "react-router-dom";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const AGBGutscheine = () => {
  usePrerenderReady(true);
  return (
    <>
      <SEO
        title="AGB Gutscheine"
        description="Allgemeine Geschäftsbedingungen für Gutscheine bei STORIA Restaurant München. Informationen zu Kauf, Einlösung und Gültigkeit von STORIA-Gutscheinen."
        canonical="/agb-gutscheine"
        noHreflang
      />
      <StructuredData type="restaurant" includeReviews={false} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'AGB Gutscheine', url: '/agb-gutscheine' }
        ]}
      />
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">AGB Gutscheine</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-12 text-center">
            AGB für Gutscheine
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-8 text-foreground/90">
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                1. Vertragspartner
              </h2>
              <p>
                Vertragspartner für den Kauf von Gutscheinen ist die:<br /><br />
                Speranza GmbH<br />
                Karlstraße 47a<br />
                80333 München<br />
                Telefon: <PhoneText>+49 89 51519696</PhoneText><br />
                E-Mail: info@ristorantestoria.de
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                2. Vertragsschluss
              </h2>
              <p>
                Der Kaufvertrag über einen Gutschein kommt mit Eingang der Zahlung zustande. 
                Mit der Zahlung wird der Gutschein aktiviert und ist ab diesem Zeitpunkt einlösbar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                3. Einlösung
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Gültigkeit:</strong> Gutscheine sind bis zum 31. Dezember des dritten
                  Jahres nach dem Kauf gültig (regelmäßige Verjährungsfrist, §§ 195, 199 BGB).
                  Beispiel: Ein im Jahr 2026 gekaufter Gutschein ist bis 31. Dezember 2029 einlösbar.
                </li>
                <li>
                  <strong>Keine Barauszahlung:</strong> Eine Auszahlung des Gutscheinwertes in bar 
                  ist nicht möglich.
                </li>
                <li>
                  <strong>Übertragbarkeit:</strong> Gutscheine sind frei übertragbar.
                </li>
                <li>
                  <strong>Restwert:</strong> Wird der Gutschein nicht vollständig eingelöst, 
                  bleibt der Restwert erhalten und kann bei einem späteren Besuch eingelöst werden.
                </li>
                <li>
                  <strong>Einlöseort:</strong> Gutscheine können ausschließlich im Restaurant 
                  STORIA in München eingelöst werden.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                4. Versand
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gutscheine werden ausschließlich digital als PDF-Datei per E-Mail an die bei der
                  Bestellung angegebene Adresse versendet.</li>
                <li>Der Versand erfolgt automatisch unmittelbar nach erfolgreicher Zahlung, in der
                  Regel innerhalb weniger Minuten.</li>
                <li>Es fallen keine Versandkosten an. Einen postalischen Versand bieten wir nicht an.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                5. Preise & Zahlungsarten
              </h2>
              <p>
                Gutscheine verkaufen wir über unseren Gutschein-Shop auf{" "}
                <a href="https://www.events-storia.de/gutschein/" className="text-primary hover:underline">
                  events-storia.de/gutschein
                </a>
                . Es gilt der bei der Bestellung gewählte Gutscheinbetrag; Preise verstehen sich
                inklusive der gesetzlichen Mehrwertsteuer.
              </p>
              <p className="mt-4">
                Die Zahlung erfolgt ausschließlich über die im Bestellprozess angebotenen
                Online-Zahlungsarten. Die Zahlungsabwicklung übernimmt der Zahlungsdienstleister
                Stripe Payments Europe Ltd.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                6. Widerrufsrecht
              </h2>
              <p>
                Für digitale Gutscheine gilt ein 14-tägiges Widerrufsrecht. Weitere Informationen 
                finden Sie in unserer{" "}
                <Link to="/widerrufsbelehrung/" className="text-primary hover:underline">
                  Widerrufsbelehrung
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                7. Verlust des Gutscheins
              </h2>
              <p>
                Bei Verlust eines Gutscheins kann kein Ersatz ausgestellt werden.
                Wir empfehlen, die Gutschein-PDF und die Bestätigungs-E-Mail sicher aufzubewahren.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                8. Schlussbestimmungen
              </h2>
              <p>
                Es gilt deutsches Recht. Die Unwirksamkeit einzelner Bestimmungen berührt 
                nicht die Gültigkeit der übrigen Bedingungen.
              </p>
            </section>

            <section className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Stand: 28. September 2026
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
};

export default AGBGutscheine;
