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

  // HTML generieren
  let html = `
<article itemscope itemtype="https://schema.org/Restaurant">
  <h1 itemprop="name">Ristorante STORIA – Italienisches Restaurant München Maxvorstadt</h1>
  <p itemprop="description">
    Willkommen im Ristorante STORIA, Ihrem authentischen italienischen Restaurant in München Maxvorstadt.
    Genießen Sie unsere hausgemachte Pasta, neapolitanische Pizza und erlesene Weine in gemütlicher Atmosphäre.
    Hier finden Sie unsere aktuellen Speise- und Getränkekarten, damit Sie und Suchmaschinen
    alle aktuellen Menüs textbasiert lesen können.
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

    for (const cat of menuCats) {
      const catItems = itemsByCategoryId.get(cat.id) || [];
      if (!catItems.length) continue;

      const catTitle = cat.name || "";
      const catDesc = cat.description || "";

      html += `
    <section aria-label="${escapeHtml(catTitle)}">
      <h3>${escapeHtml(catTitle)}</h3>`;

      if (catDesc) {
        html += `
      <p>${escapeHtml(catDesc)}</p>`;
      }

      html += `
      <ul>`;

      for (const item of catItems) {
        const title = escapeHtml(item.name || "");
        const desc = item.description ? ` – ${escapeHtml(item.description)}` : "";
        const priceStr = item.price_display || item.price || "";
        const price = priceStr ? ` (${escapeHtml(String(priceStr))})` : "";

        html += `
        <li><strong>${title}</strong>${desc}${price}</li>`;
      }

      html += `
      </ul>
    </section>`;
    }

    html += `
  </section>`;
  }

  html += `
</article>`;

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

    // SEO-HTML generieren
    console.log("Generiere SEO-HTML aus Menüdaten...");
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
