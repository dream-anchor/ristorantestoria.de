#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
H="$ROOT/public/.htaccess"
HR="$ROOT/public/.htaccess-root"
ERRORS=0

echo "=== ristorantestoria.de .htaccess Validator ==="
echo ""

# Test 1: Inner .htaccess hat alle Abschnitte
for section in "Trailing Slash" "Legacy URL" "CMS Redirects" "Multi-Language" "Seasonal Slugs" "Legal Pages" "Query-String" "SPA-Routing" "Security Headers" "Sitemap"; do
  if grep -q "$section" "$H"; then
    echo "✓ $section"
  else
    echo "✗ FEHLT: $section"
    ERRORS=$((ERRORS+1))
  fi
done
echo ""

# Test 2: Root .htaccess-root ist minimal
ROOT_LINES=$(wc -l < "$HR" | tr -d ' ')
if [ "$ROOT_LINES" -lt 40 ]; then
  echo "✓ Root .htaccess-root ist minimal ($ROOT_LINES Zeilen)"
else
  echo "✗ Root .htaccess-root zu groß ($ROOT_LINES Zeilen, max 40)"
  ERRORS=$((ERRORS+1))
fi

# Test 3: Keine .htaccess.bak mehr
if [ ! -f "$ROOT/public/.htaccess.bak" ]; then
  echo "✓ .htaccess.bak gelöscht"
else
  echo "✗ .htaccess.bak existiert noch"
  ERRORS=$((ERRORS+1))
fi

# Test 4: CMS-Redirects im Inner
CMS=$(grep -c '^RewriteRule.*cms/' "$H" || true)
echo "✓ $CMS CMS-Redirect-Regeln"

# Test 5: Trailing Slash im Inner
if grep -q 'Trailing Slash' "$H"; then
  echo "✓ Trailing-Slash-Regel vorhanden"
else
  echo "✗ Trailing-Slash-Regel FEHLT"
  ERRORS=$((ERRORS+1))
fi

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ Alle Tests bestanden"
else
  echo "❌ $ERRORS Fehler gefunden"
  exit 1
fi
