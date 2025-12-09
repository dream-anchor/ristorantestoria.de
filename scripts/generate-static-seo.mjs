// scripts/generate-static-seo.mjs
// Wird im GitHub-Workflow VOR `npm run build` ausgeführt
// und ersetzt den NOSCRIPT-Platzhalter in index.html durch
// einen statischen, SEO-/KI-freundlichen Textblock.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const indexPath = path.join(__dirname, "..", "index.html"); // ggf. anpassen, wenn index woanders liegt
  let html = fs.readFileSync(indexPath, "utf-8");

  const startMarker = "<!-- NOSCRIPT_CONTENT_START -->";
  const endMarker = "<!-- NOSCRIPT_CONTENT_END -->";

  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error("NOSCRIPT-Marker in index.html nicht gefunden.");
    process.exit(1);
  }

  const before = html.slice(0, startIdx + startMarker.length);
  const after = html.slice(endIdx);

  const noscriptContent = buildNoscriptHtml();

  const newHtml = `${before}\n${noscriptContent}\n${after}`;
  fs.writeFileSync(indexPath, newHtml, "utf-8");

  console.log("Static SEO noscript content injected into index.html");
}

// Statischer Textblock – hier können wir später noch Menüdaten ergänzen
function buildNoscriptHtml() {
  return `
<article itemscope itemtype="https://schema.org/Restaurant">
  <h1 itemprop="name">STORIA – Ristorante • Pizzeria • Bar in München Maxvorstadt</h1>
  <p itemprop="description">
    Authentisches italienisches Restaurant in der Karlstraße 47a in München Maxvorstadt – nahe Königsplatz,
    Technischer Universität München, den Pinakotheken und dem Hauptbahnhof. Wir servieren Frühstück,
    Business Lunch, hausgemachte Pasta, neapolitanische Pizza und Aperitivo bis spät in die Nacht.
  </p>

  <section aria-label="Adresse und Kontakt">
    <h2>Adresse &amp; Kontakt</h2>
    <div itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
      <p>
        <span itemprop="streetAddress">Karlstraße 47a</span>,
        <span itemprop="postalCode">80333</span>
        <span itemprop="addressLocality">München</span>,
        <span itemprop="addressCountry">Deutschland</span>
      </p>
    </div>
    <p>
      Telefon:
      <a href="tel:+4989515196" itemprop="telephone">+49 89 515196</a><br />
      E-Mail:
      <a href="mailto:info@ristorantestoria.de" itemprop="email">info@ristorantestoria.de</a>
    </p>
    <p itemprop="openingHours">
      Öffnungszeiten: Montag bis Freitag 09:00–01:00 Uhr, Samstag und Sonntag 12:00–01:00 Uhr.
    </p>
  </section>

  <section aria-label="Business Lunch und Mittagsmenü">
    <h2>Business Lunch &amp; Mittagsmenü in München</h2>
    <p>
      Unter der Woche bieten wir ein wechselndes Mittagsmenü für Business-Gäste, Agenturen und Studierende in der
      Maxvorstadt – ideal für die Mittagspause rund um Königsplatz, TU München und die Pinakotheken.
    </p>
    <p>
      Mehr zum aktuellen Mittagsmenü finden Sie auf unserer Seite
      <a href="/mittagsmenu">Mittagsmenü</a>.
    </p>
  </section>

  <section aria-label="Aperitivo und Bar">
    <h2>Aperitivo, Cocktails &amp; Bar</h2>
    <p>
      Am Abend wird das STORIA zur italienischen Bar mit Aperitivo, Cocktails, Wein und kleinen Gerichten –
      perfekt für After-Work-Drinks, Dates und Treffen mit Freunden in der Münchner Innenstadt.
    </p>
  </section>

  <section aria-label="Besondere Anlässe und Events">
    <h2>Firmenfeiern &amp; besondere Anlässe</h2>
    <p>
      Das STORIA kann für Firmenfeiern, Geburtstage und private Events reserviert werden. Wir erstellen individuelle
      Menüs, Fingerfood-Varianten oder Aperitivo-Arrangements – auf Wunsch auch mit exklusiver Nutzung ausgewählter
      Bereiche des Restaurants.
    </p>
    <p>
      Informationen zu besonderen Anlässen finden Sie unter
      <a href="/besondere-anlaesse">Besondere Anlässe</a>
      oder direkt über unsere
      <a href="/kontakt">Kontaktseite</a>.
    </p>
  </section>

  <section aria-label="Reservierung">
    <h2>Tisch reservieren</h2>
    <p>
      Reservierungen für Frühstück, Lunch, Aperitivo und Dinner können Sie bequem online über unsere Seite
      <a href="/reservierung">Reservierung</a> oder telefonisch unter
      <a href="tel:+4989515196">+49 89 515196</a> vornehmen.
    </p>
  </section>

  <section aria-label="Navigation">
    <h2>Übersicht der wichtigsten Seiten</h2>
    <nav>
      <ul>
        <li><a href="/speisekarte">Speisekarte</a></li>
        <li><a href="/mittagsmenu">Mittagsmenü</a></li>
        <li><a href="/getraenke">Getränkekarte</a></li>
        <li><a href="/reservierung">Tisch reservieren</a></li>
        <li><a href="/besondere-anlaesse">Besondere Anlässe &amp; Events</a></li>
        <li><a href="/kontakt">Kontakt &amp; Anfahrt</a></li>
        <li><a href="/ueber-uns">Über uns</a></li>
      </ul>
    </nav>
  </section>

  <p itemprop="servesCuisine">Italienische Küche, Pizza, Pasta &amp; Aperitivo.</p>
  <p itemprop="priceRange">Preisniveau: €€</p>
</article>
`.trim();
}

main();

