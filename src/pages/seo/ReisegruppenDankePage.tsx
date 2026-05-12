import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Users, Languages, MapPin, Phone, ArrowLeft } from "lucide-react";

const ReisegruppenDankePage = () => {
  useEffect(() => {
    trackEvent("lead_confirmation_view", { page_type: "reisegruppen_danke" });
  }, []);

  return (
    <>
      <SEO
        title="Anfrage erhalten | Ristorante STORIA München"
        description="Vielen Dank für Ihre Gruppenanfrage. Wir melden uns innerhalb von 24 Stunden (Mo–Sa)."
        canonical="/reisegruppen/danke"
        noHreflang
      />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-300" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">
              Anfrage erhalten — wir melden uns binnen 24&nbsp;Stunden.
            </h1>
            <p className="text-lg opacity-90">
              Domenico Speranza und sein Team freuen sich auf Ihre Reisegruppe.
            </p>
          </div>
        </section>

        <main className="flex-grow">
          {/* Trust-Signale */}
          <section className="py-12 md:py-16 bg-secondary/30">
            <div className="container mx-auto px-4 max-w-3xl">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Star className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Google-Bewertung</p>
                  <p className="font-bold text-lg">4,5 / 5</p>
                  <p className="text-sm text-muted-foreground">aus 810 Bewertungen</p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Reisegruppen seit 2015</p>
                  <p className="font-bold text-lg">Über 100 Gruppen</p>
                  <p className="text-sm text-muted-foreground">aus ganz Europa bewirtet</p>
                </div>
                <div className="bg-card p-6 rounded-lg border border-border text-center">
                  <Languages className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Service-Sprachen</p>
                  <p className="font-bold text-base">DE · EN · IT · FR</p>
                  <p className="text-sm text-muted-foreground">Vier Sprachen gesprochen</p>
                </div>
              </div>
            </div>
          </section>

          {/* Sekundäre CTAs */}
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4 max-w-2xl text-center">
              <h2 className="text-xl font-serif font-semibold mb-8">
                Bis zu Ihrem Besuch:
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button size="lg" asChild>
                  <Link to="/speisekarte/">Speisekarte ansehen</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:+498951519696" onClick={() => trackEvent("phone_click", { method: "tel", page_type: "reisegruppen_danke" })}>
                    <Phone className="w-5 h-5 mr-2" />
                    089 51519696
                  </a>
                </Button>
              </div>

              {/* Anschrift */}
              <div className="bg-secondary/40 rounded-lg p-6 text-left max-w-sm mx-auto">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Anschrift &amp; Anfahrt</p>
                    <p className="text-sm text-muted-foreground">Karlstraße 47a · 80333 München</p>
                    <p className="text-sm text-muted-foreground">Tram 20 / 21, Haltestelle Karlstraße</p>
                    <p className="text-sm text-muted-foreground">5 Min. zu Fuß vom Hauptbahnhof</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Back link */}
        <div className="container mx-auto px-4 pb-8">
          <Link
            to="/reisegruppen/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Reisegruppen-Seite
          </Link>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ReisegruppenDankePage;
