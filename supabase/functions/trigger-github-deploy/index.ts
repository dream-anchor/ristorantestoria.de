import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number | null;
  price_display: string | null;
  sort_order: number | null;
}

interface MenuCategory {
  id: string;
  menu_id: string;
  name: string;
  description: string | null;
  sort_order: number | null;
}

interface Menu {
  id: string;
  slug: string | null;
  title: string | null;
  subtitle: string | null;
  menu_type: string;
  is_published: boolean | null;
}

/**
 * Einfaches HTML-Escaping für sichere Textausgabe
 */
function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================
// STATISCHE SEITENINHALTE (DE + EN)
// ============================================

const STATIC_PAGES = {
  home: {
    de: {
      title: "STORIA – Italienisches Restaurant München Maxvorstadt",
      description: "Willkommen im Ristorante STORIA, Ihrem authentischen italienischen Restaurant in München Maxvorstadt. Genießen Sie hausgemachte Pasta, neapolitanische Pizza aus dem Steinofen und erlesene Weine – nur wenige Gehminuten vom Königsplatz, den Pinakotheken und der TU München entfernt, nahe dem Hauptbahnhof.",
      sections: [
        { heading: "Öffnungszeiten", content: ["Montag bis Freitag: 09:00 - 01:00 Uhr", "Samstag & Sonntag: 12:00 - 01:00 Uhr", "Mittagsmenü: Mo-Fr 11:30 - 14:30 Uhr"] },
        { heading: "STORIA Notturno", content: "Late Night Aperitivo täglich von 21:00 bis 22:30 Uhr – Spritz, Negroni & Stuzzichini." },
        { heading: "Kontakt", content: ["Karlstraße 47a, 80333 München", "Telefon: +49 89 51519696", "E-Mail: info@ristorantestoria.de"] }
      ]
    },
    en: {
      title: "STORIA – Italian Restaurant Munich Maxvorstadt",
      description: "Welcome to Ristorante STORIA, your authentic Italian restaurant in Munich Maxvorstadt. Enjoy homemade pasta, Neapolitan stone-oven pizza and fine wines – just a few minutes walk from Königsplatz, the Pinakothek museums and TU Munich, near the main train station.",
      sections: [
        { heading: "Opening Hours", content: ["Monday to Friday: 9am - 1am", "Saturday & Sunday: 12pm - 1am", "Lunch Menu: Mon-Fri 11:30am - 2:30pm"] },
        { heading: "STORIA Notturno", content: "Late Night Aperitivo daily from 9pm to 10:30pm – Spritz, Negroni & Stuzzichini." },
        { heading: "Contact", content: ["Karlstraße 47a, 80333 Munich", "Phone: +49 89 51519696", "Email: info@ristorantestoria.de"] }
      ]
    }
  },

  ueberUns: {
    de: {
      title: "STORIA – Im Herzen von München",
      description: "Liebe Gäste, Im Herzen der Maxvorstadt, nur wenige Schritte vom Königsplatz entfernt, öffnet das STORIA seine Türen für alle, die authentische italienische Lebensart erleben möchten.",
      sections: [
        { content: "Hier vereinen sich die Wärme einer italienischen Trattoria mit der Eleganz eines modernen Ristorante. Unser Haus ist mehr als ein Restaurant – es ist ein Stück Italien mitten in München." },
        { content: "Unsere Küche spricht die Sprache der Tradition: Jedes Gericht erzählt eine Geschichte, jedes Rezept wurde über Generationen weitergegeben und mit Liebe verfeinert." },
        { content: "Von der hausgemachten Pasta bis zur Pizza aus unserem Steinofen, von den frischen Meeresfrüchten bis zu unseren sorgfältig ausgewählten Weinen – wir verwenden nur die besten Zutaten, viele davon direkt aus Italien importiert." },
        { content: "Das STORIA ist der Ort, an dem Sie Freunde treffen, Geschäftsessen planen oder romantische Abende zu zweit verbringen können." },
        { content: "Unser Team empfängt Sie mit der typisch italienischen Herzlichkeit, die das Dolce Vita so besonders macht. Genießen Sie einen Aperitivo auf unserer Terrasse, lassen Sie sich von unseren Antipasti verführen oder tauchen Sie ein in die Welt unserer traditionellen Hauptgerichte." },
        { content: "Bei uns finden Sie die perfekte Kombination aus erstklassiger Küche, warmherzigem Service und einer Atmosphäre, die Sie den Alltag vergessen lässt." },
        { content: "Willkommen in der Familie STORIA. Benvenuti." }
      ]
    },
    en: {
      title: "STORIA – In the Heart of Munich",
      description: "Dear guests, In the heart of Maxvorstadt, just steps from Königsplatz, STORIA opens its doors to all who wish to experience authentic Italian lifestyle.",
      sections: [
        { content: "Here, the warmth of an Italian trattoria meets the elegance of a modern ristorante. Our establishment is more than a restaurant – it is a piece of Italy in the heart of Munich." },
        { content: "Our kitchen speaks the language of tradition: Every dish tells a story, every recipe has been passed down through generations and refined with love." },
        { content: "From homemade pasta to pizza from our stone oven, from fresh seafood to our carefully selected wines – we use only the finest ingredients, many imported directly from Italy." },
        { content: "STORIA is the place where you meet friends, plan business dinners, or spend romantic evenings for two." },
        { content: "Our team welcomes you with the typical Italian warmth that makes la dolce vita so special. Enjoy an aperitivo on our terrace, let yourself be tempted by our antipasti, or immerse yourself in the world of our traditional main courses." },
        { content: "With us, you'll find the perfect combination of first-class cuisine, warm service, and an atmosphere that makes you forget everyday life." },
        { content: "Welcome to the STORIA family. Benvenuti." }
      ]
    }
  },

  kontakt: {
    de: {
      title: "Kontakt & Anfahrt – STORIA München",
      description: "STORIA Kontakt: Karlstraße 47a, 80333 München Maxvorstadt. Telefon: +49 89 51519696, E-Mail: info@ristorantestoria.de. Nähe Hauptbahnhof, Königsplatz & TU München.",
      sections: [
        { heading: "Adresse", content: ["Karlstraße 47a", "80333 München", "Nähe Königsplatz & Hauptbahnhof"] },
        { heading: "Öffnungszeiten", content: ["Montag bis Freitag: 09:00 - 01:00 Uhr", "Samstag & Sonntag: 12:00 - 01:00 Uhr"] },
        { heading: "Anfahrt", content: "Zentral in der Maxvorstadt, wenige Gehminuten vom Hauptbahnhof, Königsplatz und der TU München entfernt." }
      ]
    },
    en: {
      title: "Contact & Directions – STORIA Munich",
      description: "STORIA Contact: Karlstraße 47a, 80333 Munich Maxvorstadt. Phone: +49 89 51519696, Email: info@ristorantestoria.de. Near main station, Königsplatz & TU Munich.",
      sections: [
        { heading: "Address", content: ["Karlstraße 47a", "80333 Munich", "Near Königsplatz & main station"] },
        { heading: "Opening Hours", content: ["Monday to Friday: 9am - 1am", "Saturday & Sunday: 12pm - 1am"] },
        { heading: "Getting here", content: "Centrally located in Maxvorstadt, just a few minutes walk from the main station, Königsplatz and TU Munich." }
      ]
    }
  },

  catering: {
    de: {
      title: "Catering & Events – Eventlocation München Maxvorstadt",
      description: "Italienisches Catering München & Eventlocation Maxvorstadt: Firmenfeiern, Hochzeiten, Geburtstage. STORIA – Ihr Partner für unvergessliche Events!",
      sections: [
        { heading: "Ihre Veranstaltung im STORIA", content: "Ob Firmenfeier, Hochzeit, Geburtstag oder private Feier – wir gestalten Ihr Event nach Ihren Wünschen mit authentischer italienischer Küche." },
        { heading: "Catering-Service", content: ["Antipasti-Platten & Büffets", "Frische Pizza & Pasta", "Italienische Büffets", "Dolci & Desserts"] },
        { heading: "Private Events", content: ["Geburtstagsfeiern", "Firmenfeiern & Team-Events", "Hochzeiten", "Familienfeiern"] }
      ]
    },
    en: {
      title: "Catering & Events – Event Location Munich Maxvorstadt",
      description: "Italian catering Munich & event location Maxvorstadt: Corporate events, weddings, birthdays. STORIA – your partner for unforgettable events!",
      sections: [
        { heading: "Your Event at STORIA", content: "Whether corporate event, wedding, birthday or private celebration – we design your event according to your wishes with authentic Italian cuisine." },
        { heading: "Catering Service", content: ["Antipasti platters & buffets", "Fresh pizza & pasta", "Italian buffets", "Dolci & desserts"] },
        { heading: "Private Events", content: ["Birthday parties", "Corporate events & team events", "Weddings", "Family celebrations"] }
      ]
    }
  },

  // 7 SEO LANDING PAGES

  firmenfeier: {
    de: {
      title: "Firmenfeier München – Team-Event im italienischen Restaurant",
      description: "Firmenfeier im STORIA München: Weihnachtsfeiern, Team-Events & Business-Dinner für 6-300 Personen. Zentrale Lage Maxvorstadt nahe Hauptbahnhof. Überdachte Terrasse, individuelle Menüs.",
      sections: [
        { heading: "Unsere Vorteile", content: ["Zentrale Lage – 5 Min. vom Hauptbahnhof", "Individuelle Menüs auf Ihre Wünsche abgestimmt", "Kapazität für 6–300 Personen", "Überdachte Terrasse für jedes Wetter"] },
        { heading: "Beliebte Event-Formate", content: ["After-Work Events mit Aperitivo & Antipasti", "Weihnachtsfeiern mit festlichem Menü", "Sommerfeste auf der Terrasse", "Business-Dinner & Team-Building"] },
        { heading: "Seit 1995", content: "Über 100 Firmenfeiern in München und Bayern erfolgreich ausgerichtet. Professioneller Service aus einer Hand." },
        { heading: "Kontakt", content: "Jetzt unverbindlich anfragen: +49 89 51519696" }
      ]
    },
    en: {
      title: "Corporate Event Munich – Team Event at Italian Restaurant",
      description: "Corporate event at STORIA Munich: Christmas parties, team events & business dinners for 6-300 guests. Central location Maxvorstadt near main station. Covered terrace, custom menus.",
      sections: [
        { heading: "Our Benefits", content: ["Central location – 5 min from main station", "Custom menus tailored to your needs", "Capacity for 6–300 guests", "Covered terrace for any weather"] },
        { heading: "Popular Event Formats", content: ["After-work events with aperitivo & antipasti", "Christmas parties with festive menu", "Summer parties on the terrace", "Business dinners & team building"] },
        { heading: "Since 1995", content: "Over 100 corporate events successfully hosted in Munich and Bavaria. Professional all-in-one service." },
        { heading: "Contact", content: "Inquire now: +49 89 51519696" }
      ]
    }
  },

  aperitivo: {
    de: {
      title: "Aperitivo München – Italienische After-Work Bar",
      description: "Aperitivo im STORIA München: Spritz, Negroni & italienische Antipasti in der Maxvorstadt. STORIA Notturno – Late Night Aperitivo täglich ab 21:00 Uhr.",
      sections: [
        { heading: "STORIA Notturno – Late Night Aperitivo", content: ["Täglich von 21:00 bis 22:30 Uhr", "Aperol Spritz, Hugo, Negroni & Cocktails", "Italienische Antipasti & kleine Gerichte"] },
        { heading: "La Dolce Vita in München", content: "Ob nach der Arbeit, vor dem Dinner oder als Ausklang eines schönen Abends – unser Aperitivo bringt italienische Lebensfreude in die Maxvorstadt. Nur wenige Schritte vom Königsplatz und den Pinakotheken entfernt." },
        { heading: "Perfekt für", content: "After-Work Drinks mit Kollegen, entspannte Abende mit Freunden oder als Auftakt für einen schönen Abend in München." }
      ]
    },
    en: {
      title: "Aperitivo Munich – Italian After-Work Bar",
      description: "Aperitivo at STORIA Munich: Spritz, Negroni & Italian antipasti in Maxvorstadt. STORIA Notturno – Late Night Aperitivo daily from 9pm.",
      sections: [
        { heading: "STORIA Notturno – Late Night Aperitivo", content: ["Daily from 9pm to 10:30pm", "Aperol Spritz, Hugo, Negroni & cocktails", "Italian antipasti & small dishes"] },
        { heading: "La Dolce Vita in Munich", content: "Whether after work, before dinner or as the end of a wonderful evening – our aperitivo brings Italian joie de vivre to Maxvorstadt. Just steps from Königsplatz and the Pinakothek museums." },
        { heading: "Perfect for", content: "After-work drinks with colleagues, relaxed evenings with friends or as a start to a beautiful evening in Munich." }
      ]
    }
  },

  lunch: {
    de: {
      title: "Lunch München Maxvorstadt – Italienisches Mittagessen",
      description: "Mittagessen im STORIA München Maxvorstadt: Täglich wechselnde italienische Gerichte, frische Pasta & knusprige Pizza. Ideal für Berufstätige nahe Hauptbahnhof & TU München.",
      sections: [
        { heading: "Unser Mittagsangebot", content: ["Wechselndes Mittagsmenü Mo-Fr", "Frische Pasta & Pizza aus dem Steinofen", "Attraktive Mittagspreise", "Schneller Service für Ihre Mittagspause"] },
        { heading: "Mittagszeit", content: "Montag bis Freitag: 11:30 – 14:30 Uhr" },
        { heading: "Lage", content: "Zentral in der Maxvorstadt – nur 5 Minuten vom Hauptbahnhof, Königsplatz und der TU München entfernt." }
      ]
    },
    en: {
      title: "Lunch Munich Maxvorstadt – Italian Lunch",
      description: "Lunch at STORIA Munich Maxvorstadt: Daily changing Italian dishes, fresh pasta & crispy pizza. Ideal for professionals near main station & TU Munich.",
      sections: [
        { heading: "Our Lunch Offer", content: ["Changing lunch menu Mon-Fri", "Fresh pasta & stone-oven pizza", "Attractive lunch prices", "Quick service for your lunch break"] },
        { heading: "Lunch Hours", content: "Monday to Friday: 11:30am – 2:30pm" },
        { heading: "Location", content: "Centrally in Maxvorstadt – just 5 minutes from main station, Königsplatz and TU Munich." }
      ]
    }
  },

  romantischesDinner: {
    de: {
      title: "Romantisches Dinner München – Italienisches Restaurant",
      description: "Romantisches Dinner im STORIA München: Candlelight-Atmosphäre, italienische Spezialitäten & erlesene Weine in der Maxvorstadt. Perfekt für Jahrestage, Valentinstag & besondere Anlässe.",
      sections: [
        { heading: "Ihr romantischer Abend", content: ["Stilvolles italienisches Ambiente", "Ausgewählte Weine aus Italien", "Frische Pasta & Meeresfrüchte", "Hausgemachte Dolci", "Aufmerksamer, diskreter Service"] },
        { heading: "Perfekt für besondere Anlässe", content: ["Jahrestage & Verlobungen", "Valentinstag & Heiratsanträge", "Romantische Abende zu zweit"] },
        { heading: "Lage", content: "Zentral in der Maxvorstadt, nahe den Pinakotheken." }
      ]
    },
    en: {
      title: "Romantic Dinner Munich – Italian Restaurant",
      description: "Romantic dinner at STORIA Munich: Candlelight atmosphere, Italian specialties & fine wines in Maxvorstadt. Perfect for anniversaries, Valentine's Day & special occasions.",
      sections: [
        { heading: "Your Romantic Evening", content: ["Stylish Italian ambiance", "Selected wines from Italy", "Fresh pasta & seafood", "Homemade dolci", "Attentive, discreet service"] },
        { heading: "Perfect for Special Occasions", content: ["Anniversaries & engagements", "Valentine's Day & proposals", "Romantic evenings for two"] },
        { heading: "Location", content: "Central in Maxvorstadt, near the Pinakothek museums." }
      ]
    }
  },

  eventlocation: {
    de: {
      title: "Eventlocation München Maxvorstadt – Italienisches Restaurant",
      description: "Eventlocation im STORIA München: Feiern Sie private Events, Geburtstage & Jubiläen in authentisch italienischem Ambiente. Maxvorstadt nahe Hauptbahnhof, Kapazität 6-80 Personen.",
      sections: [
        { heading: "Ihre Veranstaltung im STORIA", content: ["Platz für Gruppen bis 60 Personen", "Individuelle Menügestaltung", "Authentische italienische Küche", "Professioneller Service", "Zentrale Lage mit guter Anbindung"] },
        { heading: "Ideal für", content: ["Firmenfeiern & Team-Events", "Geburtstage & Jubiläen", "Hochzeitsfeiern", "Familienfeiern"] },
        { heading: "Lage & Erreichbarkeit", content: ["Karlstraße 47a, Maxvorstadt", "5 Min. vom Hauptbahnhof", "Nahe Königsplatz & TU München"] }
      ]
    },
    en: {
      title: "Event Location Munich Maxvorstadt – Italian Restaurant",
      description: "Event location at STORIA Munich: Celebrate private events, birthdays & anniversaries in authentic Italian ambiance. Maxvorstadt near main station, capacity 6-80 guests.",
      sections: [
        { heading: "Your Event at STORIA", content: ["Space for groups up to 60 people", "Individual menu design", "Authentic Italian cuisine", "Professional service", "Central location with good transport links"] },
        { heading: "Ideal for", content: ["Corporate parties & team events", "Birthdays & anniversaries", "Wedding celebrations", "Family celebrations"] },
        { heading: "Location & Accessibility", content: ["Karlstraße 47a, Maxvorstadt", "5 min from main station", "Near Königsplatz & TU Munich"] }
      ]
    }
  },

  geburtstag: {
    de: {
      title: "Geburtstagsfeier München – Italienisches Restaurant",
      description: "Geburtstagsfeier im STORIA München: Feiern Sie Ihren besonderen Tag mit italienischer Küche in der Maxvorstadt. Individuelle Menüs, Torte & Dekoration möglich.",
      sections: [
        { heading: "Ihre Geburtstagsfeier", content: ["Platz für 10 bis 60 Gäste", "Individuelle Menügestaltung", "Geburtstagstorte auf Wunsch", "Dekoration nach Absprache", "Hausgemachtes Tiramisu als Highlight"] },
        { heading: "Tanti Auguri! – Geburtstag auf Italienisch", content: "Im STORIA feiern wir Geburtstage mit italienischer Herzlichkeit. Lassen Sie sich und Ihre Gäste mit exquisiter Küche verwöhnen – von Pizza über Pasta bis zu feinen Dolci." },
        { heading: "Kontakt", content: "Jetzt Geburtstag planen: +49 89 51519696" }
      ]
    },
    en: {
      title: "Birthday Party Munich – Italian Restaurant",
      description: "Birthday party at STORIA Munich: Celebrate your special day with Italian cuisine in Maxvorstadt. Custom menus, cake & decoration possible.",
      sections: [
        { heading: "Your Birthday Party", content: ["Space for 10 to 60 guests", "Individual menu design", "Birthday cake on request", "Decoration by arrangement", "Homemade tiramisu as highlight"] },
        { heading: "Tanti Auguri! – Birthday Italian Style", content: "At STORIA, we celebrate birthdays with Italian warmth. Let yourself and your guests be pampered with exquisite cuisine – from pizza to pasta to fine dolci." },
        { heading: "Contact", content: "Plan your birthday now: +49 89 51519696" }
      ]
    }
  },

  neapolitanischePizza: {
    de: {
      title: "Neapolitanische Pizza München – Pizzeria Maxvorstadt",
      description: "Neapolitanische Pizza im STORIA München: Authentische Pizza nach original Rezept aus dem Steinofen. Pizzeria in der Maxvorstadt nahe Hauptbahnhof & Königsplatz.",
      sections: [
        { heading: "Unsere Pizza-Philosophie", content: ["Traditioneller Steinofen", "San-Marzano-Tomaten aus Kampanien", "Frischer Fior di Latte Mozzarella", "24-48 Stunden Teigruhe", "Italienisches Tipo-00-Mehl"] },
        { heading: "Beliebte Pizzen", content: ["Margherita – Tomaten, Mozzarella, Basilikum", "Diavola – Scharfe Salami, Tomaten, Mozzarella", "Quattro Formaggi – Vier italienische Käsesorten", "Prosciutto e Rucola – Parmaschinken, Rucola, Parmesan"] },
        { heading: "Lage", content: "Besuchen Sie uns in der Karlstraße 47a in der Maxvorstadt – nur wenige Gehminuten vom Königsplatz und dem Hauptbahnhof entfernt." }
      ]
    },
    en: {
      title: "Neapolitan Pizza Munich – Pizzeria Maxvorstadt",
      description: "Neapolitan pizza at STORIA Munich: Authentic pizza according to original recipe from the stone oven. Pizzeria in Maxvorstadt near main station & Königsplatz.",
      sections: [
        { heading: "Our Pizza Philosophy", content: ["Traditional stone oven", "San Marzano tomatoes from Campania", "Fresh Fior di Latte mozzarella", "24-48 hours dough fermentation", "Italian Tipo 00 flour"] },
        { heading: "Popular Pizzas", content: ["Margherita – Tomatoes, mozzarella, basil", "Diavola – Spicy salami, tomatoes, mozzarella", "Quattro Formaggi – Four Italian cheeses", "Prosciutto e Rucola – Parma ham, arugula, parmesan"] },
        { heading: "Location", content: "Visit us at Karlstraße 47a in Maxvorstadt – just a few minutes walk from Königsplatz and the main station." }
      ]
    }
  }
};

/**
 * Generiert HTML für eine statische Seite
 */
function generateStaticPageHtml(pageId: string, pageData: { title: string; description: string; sections: Array<{ heading?: string; content: string | string[] }> }): string {
  let html = `
  <article id="seo-${escapeHtml(pageId)}">
    <h2>${escapeHtml(pageData.title)}</h2>
    <p>${escapeHtml(pageData.description)}</p>`;

  for (const section of pageData.sections) {
    if (section.heading) {
      html += `
    <section>
      <h3>${escapeHtml(section.heading)}</h3>`;
    }

    if (Array.isArray(section.content)) {
      html += `
      <ul>`;
      for (const item of section.content) {
        html += `
        <li>${escapeHtml(item)}</li>`;
      }
      html += `
      </ul>`;
    } else {
      html += `
      <p>${escapeHtml(section.content)}</p>`;
    }

    if (section.heading) {
      html += `
    </section>`;
    }
  }

  html += `
  </article>`;

  return html;
}

/**
 * Generiert HTML für alle statischen Seiten (DE + EN)
 */
function generateAllStaticPagesHtml(): string {
  let html = "";

  // Deutsche Inhalte
  html += `
  <!-- DEUTSCHE STATISCHE SEITEN -->`;
  
  for (const [pageId, pageData] of Object.entries(STATIC_PAGES)) {
    html += generateStaticPageHtml(`${pageId}-de`, pageData.de);
  }

  // Englische Inhalte
  html += `
  
  <!-- ENGLISH STATIC PAGES -->`;
  
  for (const [pageId, pageData] of Object.entries(STATIC_PAGES)) {
    html += generateStaticPageHtml(`${pageId}-en`, pageData.en);
  }

  return html;
}

/**
 * Generiert SEO-HTML aus den Menüdaten
 */
async function generateSeoHtml(supabaseUrl: string, serviceRoleKey: string): Promise<string> {
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  
  // Menüs laden
  const { data: menus, error: menusError } = await supabase
    .from("menus")
    .select("id, slug, title, subtitle, menu_type, is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (menusError) {
    console.error("Fehler beim Laden der Menüs:", menusError);
    throw new Error("Menüs konnten nicht geladen werden");
  }

  const typedMenus = (menus || []) as Menu[];

  // Kategorien laden
  const { data: categories, error: catError } = await supabase
    .from("menu_categories")
    .select("id, menu_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (catError) {
    console.error("Fehler beim Laden der Kategorien:", catError);
    throw new Error("Kategorien konnten nicht geladen werden");
  }

  const typedCategories = (categories || []) as MenuCategory[];

  // Items laden
  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("id, category_id, name, description, price, price_display, sort_order")
    .order("sort_order", { ascending: true });

  if (itemsError) {
    console.error("Fehler beim Laden der Gerichte:", itemsError);
    throw new Error("Gerichte konnten nicht geladen werden");
  }

  const typedItems = (items || []) as MenuItem[];

  // Daten gruppieren
  const categoriesByMenuId = new Map<string, MenuCategory[]>();
  for (const cat of typedCategories) {
    const arr = categoriesByMenuId.get(cat.menu_id) || [];
    arr.push(cat);
    categoriesByMenuId.set(cat.menu_id, arr);
  }

  const itemsByCategoryId = new Map<string, MenuItem[]>();
  for (const item of typedItems) {
    const arr = itemsByCategoryId.get(item.category_id) || [];
    arr.push(item);
    itemsByCategoryId.set(item.category_id, arr);
  }

  // HTML generieren - mit sr-only Inline-Styles für unsichtbare aber crawler-lesbare Inhalte
  let html = `
<div style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">

<!-- DYNAMISCHE MENÜS AUS DATENBANK -->
<article itemscope itemtype="https://schema.org/Restaurant">
  <h1 itemprop="name">Ristorante STORIA – Italienisches Restaurant München Maxvorstadt</h1>
  <p itemprop="description">
    Willkommen im Ristorante STORIA, Ihrem authentischen italienischen Restaurant in München Maxvorstadt.
    Genießen Sie unsere hausgemachte Pasta, neapolitanische Pizza und erlesene Weine in gemütlicher Atmosphäre.
    Hier finden Sie unsere aktuellen Speise- und Getränkekarten.
  </p>`;

  // Menüs sinnvoll sortieren
  const orderedMenus = [...typedMenus].sort((a, b) => {
    const order: Record<string, number> = { food: 1, lunch: 2, drinks: 3, special: 4 };
    const oa = order[a.menu_type] ?? 99;
    const ob = order[b.menu_type] ?? 99;
    return oa - ob;
  });

  for (const menu of orderedMenus) {
    const menuCats = categoriesByMenuId.get(menu.id) || [];
    if (!menuCats.length) continue;

    html += `
  <section aria-label="Speisekarte – ${escapeHtml(menu.title || "")}">
    <h2>${escapeHtml(menu.title || "")}</h2>`;

    const menuDesc = menu.subtitle || "";
    if (menuDesc) {
      html += `
    <p>${escapeHtml(menuDesc)}</p>`;
    }

    // Max. 3 Beispiel-Gerichte pro Kategorie (SEO-Optimierung: kein Hidden Text Spam)
    const MAX_ITEMS_PER_CATEGORY = 3;

    for (const cat of menuCats) {
      const catItems = itemsByCategoryId.get(cat.id) || [];
      if (!catItems.length) continue;

      const catTitle = cat.name || "";
      const displayItems = catItems.slice(0, MAX_ITEMS_PER_CATEGORY);

      html += `
    <section aria-label="${escapeHtml(catTitle)}">
      <h3>${escapeHtml(catTitle)}</h3>
      <ul>`;

      for (const item of displayItems) {
        // Nur Namen, keine Beschreibung/Preis
        html += `
        <li>${escapeHtml(item.name || "")}</li>`;
      }

      html += `
      </ul>`;

      // Hinweis wenn mehr Gerichte existieren
      if (catItems.length > MAX_ITEMS_PER_CATEGORY) {
        html += `
      <p>Weitere Gerichte in dieser Kategorie verfügbar</p>`;
      }

      html += `
    </section>`;
    }

    html += `
  </section>`;
  }

  html += `
</article>`;

  // Statische Seiteninhalte hinzufügen
  html += generateAllStaticPagesHtml();

  html += `
</div>`;

  return html;
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const githubPat = Deno.env.get("GITHUB_PAT");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Supabase-Konfiguration fehlt");
    }

    if (!githubPat) {
      throw new Error("GITHUB_PAT Secret nicht konfiguriert");
    }

    // SEO-HTML generieren (Menüs + statische Seiten)
    console.log("Generiere SEO-HTML aus Menüdaten und statischen Seiten...");
    const seoHtml = await generateSeoHtml(supabaseUrl, serviceRoleKey);
    console.log(`SEO-HTML generiert: ${seoHtml.length} Zeichen`);

    // GitHub repository_dispatch Event auslösen
    const githubRepo = "dream-anchor/ristorantestoria.de";
    const githubApiUrl = `https://api.github.com/repos/${githubRepo}/dispatches`;

    console.log(`Löse GitHub Deploy aus: ${githubApiUrl}`);

    const response = await fetch(githubApiUrl, {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${githubPat}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_type: "menu_updated",
        client_payload: {
          seo_html: seoHtml,
          triggered_at: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GitHub API Fehler:", response.status, errorText);
      throw new Error(`GitHub API Fehler: ${response.status} - ${errorText}`);
    }

    console.log("GitHub Deploy erfolgreich ausgelöst!");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Deploy erfolgreich ausgelöst",
        seo_html_length: seoHtml.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler";
    console.error("Fehler in trigger-github-deploy:", errorMessage);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
