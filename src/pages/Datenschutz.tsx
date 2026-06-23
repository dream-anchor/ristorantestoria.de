import { Link } from "react-router-dom";
import { PhoneText } from "@/lib/linkifyPhone";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";

const Datenschutz = () => {
  usePrerenderReady(true);
  return (
    <>
      <SEO
        title="Datenschutzerklärung"
        description="Datenschutzerklärung der Speranza GmbH (STORIA Restaurant München). Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO."
        canonical="/datenschutz"
        noHreflang
      />
      <StructuredData type="restaurant" includeReviews={false} />
      <StructuredData
        type="breadcrumb"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Datenschutz', url: '/datenschutz' }
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
              <li className="text-foreground font-medium">Datenschutz</li>
            </ol>
          </nav>

          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-12 text-center">
            Datenschutzerklärung
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-8 text-foreground/90">
            
            {/* 1. Verantwortlicher */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">
                1. Verantwortlicher
              </h2>
              <p>
                <strong>Speranza GmbH</strong><br />
                Karlstraße 47a<br />
                80333 München<br />
              Telefon:{" "}
                <a href="tel:+498951519696" className="text-primary hover:underline">
                  <PhoneText>+49 89 51519696</PhoneText>
                </a><br />
                E-Mail:{" "}
                <a href="mailto:info@ristorantestoria.de" className="text-primary hover:underline">
                  info@ristorantestoria.de
                </a>
              </p>
              <p className="mt-2">
                <strong>Vertreten durch die Geschäftsführerin:</strong> Agnese Lettieri
              </p>
            </section>

            {/* 2. Erhebung und Speicherung */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                2. Erhebung und Speicherung personenbezogener Daten
              </h2>
              <p>
                Wir verarbeiten personenbezogene Daten nur, soweit dies für die Bereitstellung 
                unserer Website, zur Kommunikation oder zur Durchführung von Reservierungen erforderlich ist.
              </p>
              <p className="mt-4">
                <strong>Verarbeitet werden u. a.:</strong>
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>IP-Adresse</li>
                <li>Datum und Uhrzeit der Anfrage</li>
                <li>Name, E-Mail-Adresse, Telefonnummer (z. B. über Kontaktformular oder Reservierung)</li>
                <li>Technische Browserdaten</li>
              </ul>
              <p className="mt-4">
                <strong>Rechtsgrundlagen:</strong> Art. 6 Abs. 1 lit. a, b, f DSGVO
              </p>
            </section>

            {/* 3. Kontaktformular & Reservierungen */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                3. Kontaktformular & Reservierungen
              </h2>
              <p>
                Bei Anfragen oder Reservierungen verarbeiten wir die Daten ausschließlich zur 
                Bearbeitung der Anfrage. Speicherung: bis Zweck erledigt ist, anschließend Löschung.
              </p>
              <p className="mt-2">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
              </p>
              <p className="mt-2">
                <strong>Gruppen- und Veranstaltungsanfragen:</strong> Anfragen über unsere
                Gruppen- bzw. Veranstaltungsformulare werden zur Bearbeitung an unseren
                Veranstaltungs-Dienst (events-storia.de) übermittelt und dort verarbeitet. Die
                Verarbeitung erfolgt ausschließlich zur Bearbeitung Ihrer Anfrage; die Daten
                werden gelöscht, sobald die Anfrage abschließend bearbeitet ist. Rechtsgrundlage:
                Art. 6 Abs. 1 lit. b und lit. f DSGVO.
              </p>
            </section>

            {/* 4. Cookies */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                4. Cookies
              </h2>
              <p>
                Unsere Website verwendet technisch notwendige Cookies. Sofern Analyse- oder 
                Marketing-Cookies eingesetzt werden, holen wir vorher eine Einwilligung (Consent Banner) ein.
              </p>
              <p className="mt-2">
                Für die Steuerung von Analyse- und Marketing-Diensten setzen wir den Google
                Consent Mode v2 im Basic-Modus ein: Alle Einwilligungen sind standardmäßig auf
                „denied" gesetzt. Entsprechende Dienste werden erst geladen und erheben erst
                Daten, nachdem Sie über das Cookie-Banner aktiv eingewilligt haben. Ihre
                Einwilligung können Sie jederzeit über das Cookie-Symbol unten links auf jeder
                Seite („Cookie-Einstellungen") mit Wirkung für die Zukunft widerrufen.
              </p>
            </section>

            {/* 5. Server-Logfiles */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                5. Server-Logfiles
              </h2>
              <p>
                Der Hosting-Anbieter erhebt automatisch Daten (IP, Datum, Browser etc.). 
                Dies ist technisch erforderlich, um die Website bereitzustellen.
              </p>
              <p className="mt-2">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
              </p>
            </section>

            {/* 6. Weitergabe an Dritte */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                6. Weitergabe an Dritte
              </h2>
              <p>Eine Weitergabe erfolgt nur, wenn:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>dies zur Vertragserfüllung erforderlich ist (z. B. Reservierungssystem)</li>
                <li>eine gesetzliche Verpflichtung besteht</li>
                <li>eine Einwilligung vorliegt</li>
              </ul>
            </section>

            {/* 7. Externe Dienste */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                7. Einsatz externer Dienste
              </h2>

              <h3 className="text-lg font-semibold mt-4 mb-2">Hosting (IONOS)</h3>
              <p>
                Unsere Website wird bei der IONOS SE, Elgendorfer Straße 57, 56410 Montabaur,
                Deutschland, gehostet. Wenn Sie unsere Website aufrufen, verarbeitet IONOS in
                unserem Auftrag die technisch anfallenden Zugriffsdaten – insbesondere
                IP-Adresse, Datum und Uhrzeit des Zugriffs, die aufgerufenen Seiten, die
                übertragene Datenmenge sowie Browser- und Betriebssysteminformationen.
                Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren, stabilen
                und effizienten Betrieb unserer Website (Art. 6 Abs. 1 lit. f DSGVO). Mit IONOS
                besteht ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO. Die Daten werden
                ausschließlich auf Servern in Deutschland bzw. der Europäischen Union
                verarbeitet; eine Übermittlung in ein Drittland findet nicht statt.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">OpenTable (Reservierung)</h3>
              <p>
                Für Online-Reservierungen nutzen wir den Dienst OpenTable. Bei einer Reservierung
                werden die von Ihnen eingegebenen Daten (u. a. Name, Kontaktdaten,
                Reservierungsdetails) an OpenTable übermittelt. OpenTable ist hinsichtlich dieser
                Daten eigenständig Verantwortlicher.
              </p>
              <p className="mt-2">
                <strong>Drittlandübermittlung:</strong> Soweit dabei Daten in die USA übermittelt
                werden, ist OpenTable unter dem EU-US Data Privacy Framework zertifiziert; die
                Übermittlung erfolgt auf Grundlage des Angemessenheitsbeschlusses der
                EU-Kommission gemäß Art. 45 DSGVO.
              </p>
              <p className="mt-2">
                Die Datenschutzerklärung von OpenTable finden Sie unter:{" "}
                <a 
                  href="https://www.opentable.de/legal/privacy-policy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://www.opentable.de/legal/privacy-policy
                </a>
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Google Maps</h3>
              <p>
                Wir nutzen Google Maps zur Darstellung unseres Standorts. Beim Laden der Karte 
                werden Daten an Google übertragen. Die Datenschutzerklärung von Google finden Sie unter:{" "}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://policies.google.com/privacy
                </a>
              </p>
              <p className="mt-2">
                <strong>Rechtsgrundlage:</strong> Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO,
                § 25 Abs. 1 TDDDG). Die Karte wird erst nach Ihrer Einwilligung über das
                Cookie-Banner geladen.
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Google Analytics 4 (GA4)</h3>
              <p>
                Wir nutzen Google Analytics 4 der Google Ireland Limited, Gordon House, Barrow
                Street, Dublin 4, Irland; Empfänger bei Drittlandtransfer: Google LLC, USA.
              </p>
              <p className="mt-2">
                <strong>Zweck:</strong> Analyse des Nutzungsverhaltens zur Verbesserung unseres
                Angebots.
              </p>
              <p className="mt-2">
                <strong>Verarbeitete Daten:</strong> pseudonyme Kennung (Client-ID),
                Geräte-/Browserinformationen, ungefährer Standort (Land/Region), Referrer,
                Interaktions- und Event-Daten. Ihre IP-Adresse wird nur vorübergehend zur groben
                Standortbestimmung verwendet und nicht dauerhaft gespeichert.
              </p>
              <p className="mt-2">
                <strong>Keine Werbenutzung:</strong> Google-Signale sind deaktiviert, es besteht
                keine Verknüpfung mit Google Ads, und es werden keine Daten zu Werbezwecken
                verarbeitet.
              </p>
              <p className="mt-2">
                <strong>Rechtsgrundlage:</strong> Einwilligung (Art. 6 Abs. 1 lit. a DSGVO,
                § 25 Abs. 1 TDDDG).
              </p>
              <p className="mt-2">
                <strong>Consent Mode v2 (Basic):</strong> Standard „denied"; GA4 lädt und misst
                erst nach aktiver Einwilligung. Ohne Einwilligung kein Tracking, keine
                Datenübertragung an Google.
              </p>
              <p className="mt-2">
                <strong>Drittlandtransfer:</strong> Google LLC ist unter dem EU-US Data Privacy
                Framework zertifiziert.
              </p>
              <p className="mt-2">
                <strong>Speicherdauer:</strong> Auf Ereignisebene erhobene Daten werden nach
                2 Monaten automatisch gelöscht.
              </p>
              <p className="mt-2">
                <strong>Widerruf:</strong> jederzeit über das Cookie-Symbol unten links
                („Cookie-Einstellungen").
              </p>
              <p className="mt-2">
                Weitere Informationen:{" "}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://policies.google.com/privacy
                </a>
              </p>

              <h3 className="text-lg font-semibold mt-4 mb-2">Supabase (Menüdaten)</h3>
              <p>
                Für die Bereitstellung von Menüdaten nutzen wir Supabase (Supabase Inc., San Francisco, USA). Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen:{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  supabase.com/privacy
                </a>
              </p>
            </section>

            {/* 8. Speicherdauer */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                8. Dauer der Speicherung
              </h2>
              <p>
                Personenbezogene Daten werden gelöscht, sobald der Zweck entfällt, oder 
                gesetzliche Aufbewahrungsfristen abgelaufen sind.
              </p>
            </section>

            {/* 9. Betroffenenrechte */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                9. Betroffenenrechte (DSGVO)
              </h2>
              <p>Nutzer haben das Recht auf:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Auskunft</li>
                <li>Berichtigung</li>
                <li>Löschung</li>
                <li>Einschränkung der Verarbeitung</li>
                <li>Datenübertragbarkeit</li>
                <li>Widerruf von Einwilligungen</li>
                <li>Beschwerde bei einer Aufsichtsbehörde</li>
              </ul>
            </section>

            {/* 10. Sicherheit */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                10. Sicherheit
              </h2>
              <p>
                Wir verwenden SSL/TLS-Verschlüsselung zum Schutz der übertragenen Daten.
              </p>
            </section>

            {/* 11. Aktualität */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
                11. Aktualität
              </h2>
              <p>
                Diese Datenschutzerklärung wird regelmäßig aktualisiert.
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

export default Datenschutz;
