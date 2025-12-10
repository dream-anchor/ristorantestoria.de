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
// STATISCHE SEITENINHALTE - NUR DEUTSCH, NUR KERNTHEMEN (radikal verschlankt)
// ============================================

const STATIC_PAGES = {
  home: {
    title: "STORIA – Italienisches Restaurant München Maxvorstadt",
    description: "Authentisches Ristorante STORIA in München Maxvorstadt. Hausgemachte Pasta, neapolitanische Pizza, erlesene Weine. Nahe Königsplatz, TU München & Hauptbahnhof.",
    content: "Karlstraße 47a, 80333 München. Mo-Fr 9-1, Sa-So 12-1. Mittagsmenü Mo-Fr 11:30-14:30. Tel: +49 89 51519696"
  },

  ueberUns: {
    title: "STORIA – Authentisch italienisch seit 1995",
    description: "Hausgemachte Pasta, Pizza aus dem Steinofen, erlesene Weine. Ein Stück Italien im Herzen von München Maxvorstadt.",
    content: "Familie Speranza. Nahe Königsplatz, TU München und Pinakotheken."
  },

  kontakt: {
    title: "Kontakt STORIA München",
    description: "Karlstraße 47a, 80333 München. Tel: +49 89 51519696. E-Mail: info@ristorantestoria.de",
    content: "Maxvorstadt, 5 Min. vom Hauptbahnhof. Mo-Fr 9-1, Sa-So 12-1."
  },

  firmenfeier: {
    title: "Firmenfeier München – STORIA",
    description: "Team-Events, Weihnachtsfeiern & Business-Dinner für 6-300 Personen. Überdachte Terrasse. Zentral am Hauptbahnhof.",
    content: "Seit 1995. Individuelle Menüs. Professioneller Service. +49 89 51519696"
  },

  lunch: {
    title: "Lunch München Maxvorstadt – STORIA",
    description: "Italienisches Mittagessen Mo-Fr 11:30-14:30. Frische Pasta & Pizza. Schneller Service für die Mittagspause.",
    content: "5 Min. vom Hauptbahnhof & TU München. Wechselndes Mittagsmenü."
  },

  aperitivo: {
    title: "Aperitivo München – STORIA Notturno",
    description: "Late Night Aperitivo täglich 21-22:30. Aperol Spritz, Negroni, Antipasti in der Maxvorstadt.",
    content: "La Dolce Vita nahe Königsplatz. After-Work & Abende mit Freunden."
  },

  neapolitanischePizza: {
    title: "Neapolitanische Pizza München – STORIA",
    description: "Authentische Pizza aus dem Steinofen. San-Marzano-Tomaten, Fior di Latte, 24-48h Teigruhe.",
    content: "Margherita, Diavola, Quattro Formaggi. Karlstraße 47a, Maxvorstadt."
  }
};

/**
 * Generiert HTML für eine statische Seite (verschlankt)
 */
function generateStaticPageHtml(pageId: string, pageData: { title: string; description: string; content: string }): string {
  return `
  <article id="seo-${escapeHtml(pageId)}">
    <h2>${escapeHtml(pageData.title)}</h2>
    <p>${escapeHtml(pageData.description)}</p>
    <p>${escapeHtml(pageData.content)}</p>
  </article>`;
}

/**
 * Generiert HTML für alle statischen Seiten (nur Deutsch)
 */
function generateAllStaticPagesHtml(): string {
  let html = `
  <!-- DEUTSCHE STATISCHE SEITEN (KERNTHEMEN) -->`;
  
  for (const [pageId, pageData] of Object.entries(STATIC_PAGES)) {
    html += generateStaticPageHtml(pageId, pageData);
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
