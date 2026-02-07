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
    de: "weihnachtsmenues",
    en: "christmas-menus",
    it: "natale-menu",
    fr: "noel-menus",
  },
  silvester: {
    de: "silvesterparty",
    en: "new-years-party",
    it: "capodanno-party",
    fr: "nouvel-an-party",
  },
  ostern: {
    de: "ostern-menue",
    en: "easter-menu",
    it: "pasqua-menu",
    fr: "paques-menu",
  },
  muttertag: {
    de: "muttertag-menue",
    en: "mothers-day-menu",
    it: "festa-mamma-menu",
    fr: "fete-meres-menu",
  },
  vatertag: {
    de: "vatertag-menue",
    en: "fathers-day-menu",
    it: "festa-papa-menu",
    fr: "fete-peres-menu",
  },
};

/** Regex patterns for local (fast) classification */
const THEME_PATTERNS: Record<string, RegExp> = {
  valentinstag: /valentin|valentine|san.?valentino|saint.?valentin/i,
  weihnachten: /weihnacht|christmas|x-?mas|natale|no[eë]l/i,
  silvester: /silvester|sylvester|new.?year|neujahr|capodanno|nouvel.?an|jahreswechsel/i,
  ostern: /ostern|easter|pasqua|p[aâ]ques/i,
  muttertag: /mutter|mother|mamma|m[eè]re/i,
  vatertag: /vater|father|pap[aà]|p[eè]re/i,
};

function detectThemeLocally(title: string): string | null {
  for (const [theme, pattern] of Object.entries(THEME_PATTERNS)) {
    if (pattern.test(title)) return theme;
  }
  return null;
}

/**
 * Fallback: Use Lovable AI to classify an ambiguous title.
 */
async function classifyWithAI(title: string): Promise<string | null> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    console.warn("[classify] LOVABLE_API_KEY not set, skipping AI classification");
    return null;
  }

  const themes = Object.keys(RECURRING_MENU_SLUGS);
  const systemPrompt = `You classify restaurant menu titles into seasonal event categories.
Given a menu title, respond with EXACTLY one of these category keys: ${themes.join(", ")}
If the title does not match any seasonal event, respond with: none
Respond with only the category key, nothing else.`;

  try {
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: title },
        ],
        temperature: 0,
        max_tokens: 20,
      }),
    });

    if (!response.ok) {
      console.error("[classify] AI gateway error:", response.status, await response.text());
      return null;
    }

    const data = await response.json();
    const answer = (data.choices?.[0]?.message?.content ?? "").trim().toLowerCase();
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
