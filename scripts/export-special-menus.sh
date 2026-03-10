#!/usr/bin/env bash
# export-special-menus.sh
# Exportiert alle publizierten Special Menus aus Supabase als JSON-Fallback.
#
# Ausführen (nach .env laden):
#   source .env && bash scripts/export-special-menus.sh
#
# Oder mit direkten Werten:
#   SUPABASE_URL="https://..." SUPABASE_KEY="eyJ..." bash scripts/export-special-menus.sh
#
# Das Ergebnis wird in src/data/special-menus-fallback.json geschrieben.
# Nach dem Ausführen: Datei committen und pushen, damit der Fallback aktuell bleibt.

set -e

SUPABASE_URL="${VITE_SUPABASE_URL:-${SUPABASE_URL}}"
SUPABASE_KEY="${VITE_SUPABASE_PUBLISHABLE_KEY:-${SUPABASE_KEY}}"
OUTPUT="src/data/special-menus-fallback.json"

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
  echo "❌ Fehler: VITE_SUPABASE_URL und VITE_SUPABASE_PUBLISHABLE_KEY müssen gesetzt sein."
  echo "   source .env && bash scripts/export-special-menus.sh"
  exit 1
fi

echo "🔄 Lade Special Menus von Supabase..."

# Lade alle publizierten special-type Menüs
MENUS_JSON=$(curl -sf \
  "${SUPABASE_URL}/rest/v1/menus?select=*&menu_type=eq.special&is_published=eq.true&order=sort_order.asc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Accept: application/json")

if [ -z "$MENUS_JSON" ] || [ "$MENUS_JSON" = "[]" ]; then
  echo "⚠️  Keine publizierten Special Menus gefunden."
  echo "[]" > "$OUTPUT"
  echo "✅ Leere Fallback-Datei geschrieben: $OUTPUT"
  exit 0
fi

MENU_COUNT=$(echo "$MENUS_JSON" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?")
echo "✅ $MENU_COUNT Menü(s) gefunden."

# Für jedes Menü: Kategorien und Items laden und zusammenbauen
RESULT=$(python3 - <<'PYTHON' "$MENUS_JSON" "$SUPABASE_URL" "$SUPABASE_KEY"
import sys, json, urllib.request, urllib.parse

menus = json.loads(sys.argv[1])
base_url = sys.argv[2]
api_key = sys.argv[3]

def fetch(path):
    url = f"{base_url}/rest/v1/{path}"
    req = urllib.request.Request(url, headers={
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json"
    })
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

output = []
for menu in menus:
    menu_id = menu["id"]
    # Kategorien laden
    cats = fetch(f"menu_categories?menu_id=eq.{menu_id}&order=sort_order.asc&select=*")
    cat_ids = [c["id"] for c in cats]

    items_by_cat = {c["id"]: [] for c in cats}
    if cat_ids:
        ids_param = ",".join(cat_ids)
        items = fetch(f"menu_items?category_id=in.({ids_param})&order=sort_order.asc&select=*")
        for item in items:
            cid = item.get("category_id")
            if cid in items_by_cat:
                items_by_cat[cid].append(item)

    categories_with_items = []
    for cat in cats:
        cat_data = dict(cat)
        cat_data["items"] = items_by_cat.get(cat["id"], [])
        categories_with_items.append(cat_data)

    menu_data = dict(menu)
    menu_data["categories"] = categories_with_items
    output.append(menu_data)

print(json.dumps(output, ensure_ascii=False, indent=2))
PYTHON
)

echo "$RESULT" > "$OUTPUT"
echo "✅ Fallback gespeichert: $OUTPUT"
echo ""
echo "📋 Nächster Schritt:"
echo "   git add $OUTPUT && git commit -m 'chore: Special Menus Fallback aktualisiert' && git push"
