import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Known seasonal themes with their predefined SEO-permanent slugs.
 * Duplicated from src/lib/slugTranslations.ts (edge functions can't import from src/).
 */
const RECURRING_MENU_SLUGS: Record<string, Record<string, string>> = {
  valentinstag: {
    de: "valentinstag-menue",
    en: "valentines-menu",
    it: "san-valentino-menu",
    fr: "saint-valentin-menu",
  },
  weihnachten: {
    de: "weihnachtsmenue",
    en: "christmas-menu",
    it: "menu-natale",
    fr: "menu-noel",
  },
  silvester: {
    de: "silvester",
    en: "new-years-eve",
    it: "capodanno",
    fr: "nouvel-an",
  },
};

/** Regex patterns for local (fast) classification */
const THEME_PATTERNS: Record<string, RegExp> = {
  valentinstag: /valentin|valentine|san.?valentino|saint.?valentin/i,
  weihnachten: /weihnacht|christmas|x-?mas|natale|no[eë]l/i,
  silvester: /silvester|sylvester|new.?year|neujahr|capodanno|nouvel.?an|jahreswechsel/i,
};

function detectThemeLocally(title: string): string | null {
  for (const [theme, pattern] of Object.entries(THEME_PATTERNS)) {
    if (pattern.test(title)) return theme;
  }
  return null;
}

/**
 * Fallback: Use Anthropic Claude to classify an ambiguous title.
 */
async function classifyWithAI(title: string): Promise<string | null> {
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    console.warn("[classify] ANTHROPIC_API_KEY not set, skipping AI classification");
    return null;
  }

  const themes = Object.keys(RECURRING_MENU_SLUGS);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 10,
        system: `Du bist ein Klassifikator für Restaurant-Menü-Titel. Ordne den Titel einem saisonalen Event zu. Antworte NUR mit dem Event-Key oder 'none'. Nichts anderes. Events: ${themes.join(", ")}. Der Titel kann in jeder Sprache sein (DE/EN/IT/FR), auch kreativ geschrieben (X-mas, NYE, etc.). Im Zweifel 'none'.`,
        messages: [
          { role: "user", content: title },
        ],
      }),
    });

    if (!response.ok) {
      console.error("[classify] Anthropic API error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const answer = (data.content?.[0]?.text ?? "").trim().toLowerCase();
    console.log("[classify] AI response:", answer);

    if (themes.includes(answer)) return answer;
    return null;
  } catch (err) {
    console.error("[classify] AI call failed:", err);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const record = payload.record;
    const triggerType = payload.type; // INSERT or UPDATE

    if (!record?.id || !record?.title) {
      console.log("[classify] Missing record data, skipping");
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[classify] Processing ${triggerType} for menu "${record.title}" (${record.id})`);

    // Step 1: Try local regex classification
    let classifiedAs = detectThemeLocally(record.title);
    console.log(`[classify] Local detection: ${classifiedAs ?? "no match"}`);

    // Step 2: If no local match, try AI classification
    if (!classifiedAs) {
      classifiedAs = await classifyWithAI(record.title);
      console.log(`[classify] AI classification: ${classifiedAs ?? "no match"}`);
    }

    // Step 3: Create Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 4: Log classification result
    const { error: classError } = await supabase.from("slug_classifications").insert({
      menu_id: record.id,
      original_title: record.title,
      classified_as: classifiedAs,
      slugs_updated: false,
      conflict: false,
    });

    if (classError) {
      console.error("[classify] Error inserting classification:", classError);
    }

    // Step 5: If classified, update slugs on the menu
    if (classifiedAs && RECURRING_MENU_SLUGS[classifiedAs]) {
      const slugs = RECURRING_MENU_SLUGS[classifiedAs];

      // Check for slug conflicts (another menu already using these slugs)
      const { data: existing } = await supabase
        .from("menus")
        .select("id, slug")
        .eq("slug", slugs.de)
        .neq("id", record.id)
        .maybeSingle();

      if (existing) {
        console.warn(`[classify] Slug conflict: "${slugs.de}" already used by menu ${existing.id}`);
        // Update classification to mark conflict
        await supabase
          .from("slug_classifications")
          .update({ conflict: true })
          .eq("menu_id", record.id)
          .eq("original_title", record.title);

        // Create admin notification about conflict
        await supabase.from("admin_notifications").insert({
          type: "slug_conflict",
          message: `Slug-Konflikt: Menü "${record.title}" wurde als "${classifiedAs}" erkannt, aber die Slugs sind bereits vergeben an Menü ${existing.id}.`,
          menu_id: record.id,
        });
      } else {
        // No conflict → update slugs
        const { error: updateError } = await supabase
          .from("menus")
          .update({
            slug: slugs.de,
            slug_en: slugs.en,
            slug_it: slugs.it,
            slug_fr: slugs.fr,
          })
          .eq("id", record.id);

        if (updateError) {
          console.error("[classify] Error updating slugs:", updateError);
        } else {
          console.log(`[classify] Slugs updated to: ${JSON.stringify(slugs)}`);
          // Mark classification as slugs_updated
          await supabase
            .from("slug_classifications")
            .update({ slugs_updated: true })
            .eq("menu_id", record.id)
            .eq("original_title", record.title);

          // Notify admin
          await supabase.from("admin_notifications").insert({
            type: "slug_auto_assigned",
            message: `Menü "${record.title}" wurde automatisch als "${classifiedAs}" klassifiziert. SEO-Slugs wurden zugewiesen.`,
            menu_id: record.id,
          });
        }
      }
    } else {
      console.log(`[classify] No seasonal theme detected for "${record.title}"`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        classified_as: classifiedAs,
        menu_id: record.id,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[classify] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
