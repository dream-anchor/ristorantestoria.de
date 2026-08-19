import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { CheckCircle, MapPin, Phone } from "lucide-react";

const Danke = () => {
  const [searchParams] = useSearchParams();
  const name = (searchParams.get("name") || "").trim().slice(0, 80);

  useEffect(() => {
    trackEvent("lead_confirmation_view", { page_type: "danke" });
  }, []);

  return (
    <>
      <SEO
        title="Anfrage erhalten | Ristorante STORIA München"
        description="Vielen Dank für Ihre Anfrage. Unser Team meldet sich in Kürze bei Ihnen."
        canonical="/danke"
        noHreflang
      />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-300" />
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">
              {name
                ? `Vielen Dank für Ihre Anfrage, ${name}!`
                : "Vielen Dank für Ihre Anfrage!"}
            </h1>
            <p className="text-lg opacity-90">
              Unser Team meldet sich in Kürze bei Ihnen.
            </p>
          </div>
        </section>

        <main className="flex-grow py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-xl font-serif font-semibold mb-8">Bis zu Ihrem Besuch:</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button size="lg" asChild>
                <Link to="/speisekarte/">Speisekarte ansehen</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href="tel:+498951519696"
                  onClick={() => trackEvent("phone_click", { method: "tel", page_type: "danke" })}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  089 51519696
                </a>
              </Button>
            </div>

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
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Danke;
