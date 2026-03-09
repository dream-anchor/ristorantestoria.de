#!/usr/bin/env bash
# ============================================================
# Redirect-Test für ristorantestoria.de
# Prüft alle 301-Redirects aus der .htaccess
# Usage: ./scripts/test-redirects.sh [BASE_URL]
# Beispiel: ./scripts/test-redirects.sh https://www.ristorantestoria.de
# ============================================================

BASE="${1:-https://www.ristorantestoria.de}"
PASS=0
FAIL=0
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check() {
  local label="$1"
  local url="$2"
  local expected_location="$3"

  result=$(curl -s -o /dev/null -w "%{http_code}|%{redirect_url}" -L --max-redirs 0 "$url" 2>/dev/null)
  status=$(echo "$result" | cut -d'|' -f1)
  location=$(echo "$result" | cut -d'|' -f2)

  if [[ "$status" == "301" && "$location" == "$expected_location" ]]; then
    echo -e "${GREEN}✓${NC} $label"
    echo -e "  301 → $location"
    ((PASS++))
  else
    echo -e "${RED}✗${NC} $label"
    echo -e "  Expected: 301 → $expected_location"
    echo -e "  Got:      $status → $location"
    ((FAIL++))
  fi
}

echo ""
echo "========================================================"
echo "  Redirect-Test: $BASE"
echo "========================================================"
echo ""

# ──── Problem 1: Trailing Slash ────────────────────────────
echo -e "${YELLOW}▸ Problem 1: Trailing Slash (ohne → mit)${NC}"
check "speisekarte ohne Slash"    "$BASE/speisekarte"         "$BASE/speisekarte/"
check "reservierung ohne Slash"   "$BASE/reservierung"        "$BASE/reservierung/"
check "getraenke ohne Slash"      "$BASE/getraenke"           "$BASE/getraenke/"
check "kontakt ohne Slash"        "$BASE/kontakt"             "$BASE/kontakt/"
check "ueber-uns ohne Slash"      "$BASE/ueber-uns"           "$BASE/ueber-uns/"
check "mittags-menu ohne Slash"   "$BASE/mittags-menu"        "$BASE/mittags-menu/"
check "firmenfeier ohne Slash"    "$BASE/firmenfeier-muenchen" "$BASE/firmenfeier-muenchen/"
check "aperitivo ohne Slash"      "$BASE/aperitivo-muenchen"  "$BASE/aperitivo-muenchen/"
check "neapolitanisch ohne Slash" "$BASE/neapolitanische-pizza-muenchen" "$BASE/neapolitanische-pizza-muenchen/"
check "catering ohne Slash"       "$BASE/catering"            "$BASE/catering/"
check "geburtstag ohne Slash"     "$BASE/geburtstagsfeier-muenchen" "$BASE/geburtstagsfeier-muenchen/"

# ──── Problem 2: CMS-Redirects ─────────────────────────────
echo ""
echo -e "${YELLOW}▸ Problem 2: Legacy CMS-Redirects${NC}"
check "cms/speisekarte"         "$BASE/cms/speisekarte/"      "$BASE/speisekarte/"
check "cms/reservations"        "$BASE/cms/reservations/"     "$BASE/reservierung/"
check "cms/1753-2"              "$BASE/cms/1753-2/"           "$BASE/kontakt/"
check "cms/events-2"            "$BASE/cms/events-2/"         "$BASE/besondere-anlaesse/"
check "cms/getraenke"           "$BASE/cms/getraenke/"        "$BASE/getraenke/"
check "cms/our-team"            "$BASE/cms/our-team/"         "$BASE/ueber-uns/"
check "cms/menue"               "$BASE/cms/menue/"            "$BASE/mittags-menu/"
check "cms/speisekarte-2"       "$BASE/cms/speisekarte-2/"    "$BASE/speisekarte/"
check "cms/catering"            "$BASE/cms/catering/"         "$BASE/catering/"
check "cms/weihnachtsmenues-2"  "$BASE/cms/weihnachtsmenues-2/" "$BASE/besondere-anlaesse/weihnachtsmenue/"
check "cms/front-page-2"        "$BASE/cms/front-page-2/"     "$BASE/"
check "cms/wp-content/uploads"  "$BASE/cms/wp-content/uploads/test.pdf" "$BASE/mittags-menu/"
check "cms/ catch-all"          "$BASE/cms/irgendwas/"        "$BASE/"

# ──── Problem 3: HTTP → HTTPS ──────────────────────────────
echo ""
echo -e "${YELLOW}▸ Problem 3: HTTP → HTTPS${NC}"
HTTP_BASE="${BASE/https:/http:}"
check "HTTP → HTTPS (root)"      "$HTTP_BASE/"                "$BASE/"
check "HTTP → HTTPS (speisekarte)" "$HTTP_BASE/speisekarte/"  "$BASE/speisekarte/"

# ──── Problem 4: non-www → www ─────────────────────────────
echo ""
echo -e "${YELLOW}▸ Problem 4: non-www → www${NC}"
NOWWW_BASE="${BASE/www./}"
check "non-www → www (root)"     "$NOWWW_BASE/"               "$BASE/"
# Hinweis: 2-Hop (non-www→www DANN silvesterparty→silvester) — final destination check
FINAL_SILVESTER=$(curl -s -o /dev/null -w "%{url_effective}" -L "$NOWWW_BASE/silvesterparty" 2>/dev/null)
if [[ "$FINAL_SILVESTER" == "$BASE/besondere-anlaesse/silvester/" ]]; then
  echo -e "${GREEN}✓${NC} non-www → www (silvester, 2-hop)"
  echo -e "  Final → $FINAL_SILVESTER"
  ((PASS++))
else
  echo -e "${RED}✗${NC} non-www → www (silvester, 2-hop)"
  echo -e "  Expected final: $BASE/besondere-anlaesse/silvester/"
  echo -e "  Got final:      $FINAL_SILVESTER"
  ((FAIL++))
fi

# ──── Problem 5: Phantom-URL ───────────────────────────────
echo ""
echo -e "${YELLOW}▸ Problem 5: Phantom-URL /besondere-anlaesse/neuer-anlass${NC}"
check "DE neuer-anlass"  "$BASE/besondere-anlaesse/neuer-anlass/"  "$BASE/besondere-anlaesse/"
check "IT neuer-anlass"  "$BASE/it/occasioni-speciali/neuer-anlass/" "$BASE/it/occasioni-speciali/"
check "EN neuer-anlass"  "$BASE/en/special-occasions/neuer-anlass/" "$BASE/en/special-occasions/"

# ──── Problem 6: /silvesterparty ───────────────────────────
echo ""
echo -e "${YELLOW}▸ Problem 6: /silvesterparty${NC}"
check "silvesterparty"   "$BASE/silvesterparty/"  "$BASE/besondere-anlaesse/silvester/"

# ──── Problem 7: Query-String ──────────────────────────────
echo ""
echo -e "${YELLOW}▸ Problem 7: WordPress ?page_id= Redirects${NC}"
check "page_id=2881"     "$BASE/?page_id=2881"     "$BASE/impressum/"
check "page_id=3539"     "$BASE/?page_id=3539"     "$BASE/"
check "page_id=2505"     "$BASE/?page_id=2505"     "$BASE/"

# ──── Zusammenfassung ──────────────────────────────────────
echo ""
echo "========================================================"
TOTAL=$((PASS + FAIL))
echo "  Ergebnis: $PASS/$TOTAL Tests bestanden"
if [[ $FAIL -gt 0 ]]; then
  echo -e "  ${RED}$FAIL Tests fehlgeschlagen!${NC}"
  echo "========================================================"
  exit 1
else
  echo -e "  ${GREEN}Alle Redirects korrekt!${NC}"
  echo "========================================================"
fi
