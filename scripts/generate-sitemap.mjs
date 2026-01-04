import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, "..", p);

const BASE_URL = "https://www.ristorantestoria.de";
const LANGUAGES = ["de", "en", "it", "fr"];

// Slug translations (same as prerender.js)
const slugMaps = {
  de: {
    home: "",
    reservierung: "reservierung",
    menu: "menu",
    "mittags-menu": "mittags-menu",
    speisekarte: "speisekarte",
    getraenke: "getraenke",
    "besondere-anlaesse": "besondere-anlaesse",
    kontakt: "kontakt",
    catering: "catering",
    "ueber-uns": "ueber-uns",
    impressum: "impressum",
    datenschutz: "datenschutz",
    "cookie-richtlinie": "cookie-richtlinie",
    "agb-restaurant": "agb-restaurant",
    "agb-gutscheine": "agb-gutscheine",
    widerrufsbelehrung: "widerrufsbelehrung",
    zahlungsinformationen: "zahlungsinformationen",
    lebensmittelhinweise: "lebensmittelhinweise",
    haftungsausschluss: "haftungsausschluss",
    "lunch-muenchen-maxvorstadt": "lunch-muenchen-maxvorstadt",
    "aperitivo-muenchen": "aperitivo-muenchen",
    "romantisches-dinner-muenchen": "romantisches-dinner-muenchen",
    "eventlocation-muenchen-maxvorstadt": "eventlocation-muenchen-maxvorstadt",
    "firmenfeier-muenchen": "firmenfeier-muenchen",
    "geburtstagsfeier-muenchen": "geburtstagsfeier-muenchen",
    "neapolitanische-pizza-muenchen": "neapolitanische-pizza-muenchen",
  },
  en: {
    home: "",
    reservierung: "reservation",
    menu: "menu",
    "mittags-menu": "lunch-menu",
    speisekarte: "food-menu",
    getraenke: "drinks",
    "besondere-anlaesse": "special-occasions",
    kontakt: "contact",
    catering: "catering",
    "ueber-uns": "about-us",
    impressum: "imprint",
    datenschutz: "privacy-policy",
    "cookie-richtlinie": "cookie-policy",
    "agb-restaurant": "terms-restaurant",
    "agb-gutscheine": "terms-vouchers",
    widerrufsbelehrung: "cancellation-policy",
    zahlungsinformationen: "payment-info",
    lebensmittelhinweise: "food-info",
    haftungsausschluss: "disclaimer",
    "lunch-muenchen-maxvorstadt": "lunch-munich",
    "aperitivo-muenchen": "aperitivo-munich",
    "romantisches-dinner-muenchen": "romantic-dinner-munich",
    "eventlocation-muenchen-maxvorstadt": "event-venue-munich",
    "firmenfeier-muenchen": "corporate-event-munich",
    "geburtstagsfeier-muenchen": "birthday-party-munich",
    "neapolitanische-pizza-muenchen": "neapolitan-pizza-munich",
  },
  it: {
    home: "",
    reservierung: "prenotazione",
    menu: "menu",
    "mittags-menu": "menu-pranzo",
    speisekarte: "menu-cibo",
    getraenke: "bevande",
    "besondere-anlaesse": "occasioni-speciali",
    kontakt: "contatto",
    catering: "catering",
    "ueber-uns": "chi-siamo",
    impressum: "note-legali",
    datenschutz: "privacy",
    "cookie-richtlinie": "cookie-policy",
    "agb-restaurant": "termini-ristorante",
    "agb-gutscheine": "termini-buoni",
    widerrufsbelehrung: "diritto-recesso",
    zahlungsinformationen: "info-pagamento",
    lebensmittelhinweise: "info-alimenti",
    haftungsausschluss: "disclaimer",
    "lunch-muenchen-maxvorstadt": "pranzo-monaco",
    "aperitivo-muenchen": "aperitivo-monaco",
    "romantisches-dinner-muenchen": "cena-romantica-monaco",
    "eventlocation-muenchen-maxvorstadt": "location-eventi-monaco",
    "firmenfeier-muenchen": "evento-aziendale-monaco",
    "geburtstagsfeier-muenchen": "festa-compleanno-monaco",
    "neapolitanische-pizza-muenchen": "pizza-napoletana-monaco",
  },
  fr: {
    home: "",
    reservierung: "reservation",
    menu: "menu",
    "mittags-menu": "menu-dejeuner",
    speisekarte: "carte",
    getraenke: "boissons",
    "besondere-anlaesse": "occasions-speciales",
    kontakt: "contact",
    catering: "traiteur",
    "ueber-uns": "a-propos",
    impressum: "mentions-legales",
    datenschutz: "confidentialite",
    "cookie-richtlinie": "politique-cookies",
    "agb-restaurant": "cgv-restaurant",
    "agb-gutscheine": "cgv-bons",
    widerrufsbelehrung: "droit-retractation",
    zahlungsinformationen: "infos-paiement",
    lebensmittelhinweise: "infos-alimentaires",
    haftungsausschluss: "avertissement",
    "lunch-muenchen-maxvorstadt": "dejeuner-munich",
    "aperitivo-muenchen": "aperitivo-munich",
    "romantisches-dinner-muenchen": "diner-romantique-munich",
    "eventlocation-muenchen-maxvorstadt": "lieu-evenement-munich",
    "firmenfeier-muenchen": "evenement-entreprise-munich",
    "geburtstagsfeier-muenchen": "fete-anniversaire-munich",
    "neapolitanische-pizza-muenchen": "pizza-napolitaine-munich",
  },
};

// Dynamic routes for special occasions subpages (fetched from database)
const dynamicRoutes = [
  {
    id: "weihnachtsmenues",
    translations: {
      de: "besondere-anlaesse/weihnachtsmenues",
      en: "special-occasions/christmas-menus",
      it: "occasioni-speciali/menu-natale",
      fr: "occasions-speciales/menus-noel",
    },
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    id: "silvesterparty",
    translations: {
      de: "besondere-anlaesse/silvesterparty",
      en: "special-occasions/new-years-eve",
      it: "occasioni-speciali/capodanno",
      fr: "occasions-speciales/reveillon",
    },
    priority: "0.7",
    changefreq: "monthly",
  },
];

// Get localized URL for a base slug
const getLocalizedUrl = (baseSlug, lang) => {
  const slugMap = slugMaps[lang];
  const localizedSlug = slugMap[baseSlug] ?? baseSlug;
  
  if (lang === "de") {
    return localizedSlug ? `${BASE_URL}/${localizedSlug}` : BASE_URL;
  }
  return localizedSlug ? `${BASE_URL}/${lang}/${localizedSlug}` : `${BASE_URL}/${lang}`;
};

// Generate sitemap XML
const generateSitemap = () => {
  const today = new Date().toISOString().split("T")[0];
  const baseSlugs = Object.keys(slugMaps.de);
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Generate URLs for static pages
  for (const baseSlug of baseSlugs) {
    const urls = LANGUAGES.map(lang => ({
      lang,
      url: getLocalizedUrl(baseSlug, lang)
    }));
    
    for (const { lang, url } of urls) {
      let priority = "0.5";
      let changefreq = "monthly";
      
      if (baseSlug === "home") {
        priority = "1.0";
        changefreq = "weekly";
      } else if (["reservierung", "speisekarte", "mittags-menu", "getraenke"].includes(baseSlug)) {
        priority = "0.9";
        changefreq = "weekly";
      } else if (["kontakt", "ueber-uns", "besondere-anlaesse"].includes(baseSlug)) {
        priority = "0.8";
        changefreq = "monthly";
      } else if (baseSlug.includes("muenchen")) {
        priority = "0.7";
        changefreq = "monthly";
      } else if (["impressum", "datenschutz", "agb-restaurant", "agb-gutscheine"].includes(baseSlug)) {
        priority = "0.3";
        changefreq = "yearly";
      }
      
      xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
`;
      
      for (const alternate of urls) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${alternate.url}" />
`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${getLocalizedUrl(baseSlug, "de")}" />
`;
      
      xml += `  </url>
`;
    }
  }

  // Generate URLs for dynamic routes (special occasions subpages)
  for (const route of dynamicRoutes) {
    const urls = LANGUAGES.map(lang => {
      const slug = route.translations[lang];
      if (lang === "de") {
        return { lang, url: `${BASE_URL}/${slug}` };
      }
      return { lang, url: `${BASE_URL}/${lang}/${slug}` };
    });

    for (const { lang, url } of urls) {
      xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
`;
      
      for (const alternate of urls) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${alternate.url}" />
`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/${route.translations.de}" />
`;
      
      xml += `  </url>
`;
    }
  }
  
  xml += `</urlset>`;
  
  return xml;
};

// Main
const sitemap = generateSitemap();
const outputPath = toAbsolute("dist/sitemap.xml");

// Ensure dist directory exists
if (!fs.existsSync(toAbsolute("dist"))) {
  fs.mkdirSync(toAbsolute("dist"), { recursive: true });
}

fs.writeFileSync(outputPath, sitemap);
const staticUrls = Object.keys(slugMaps.de).length * LANGUAGES.length;
const dynamicUrls = dynamicRoutes.length * LANGUAGES.length;
console.log(`Sitemap generated at ${outputPath}`);
console.log(`Total URLs: ${staticUrls + dynamicUrls} (${staticUrls} static + ${dynamicUrls} dynamic)`);
