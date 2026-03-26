#!/bin/bash
# Test-Script für .htaccess-root Änderungen
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HTACCESS_ROOT="$ROOT/public/.htaccess-root"
HTACCESS_INNER="$ROOT/public/.htaccess"

echo "=== Test 1: .htaccess-root Syntax (alle RewriteRules) ==="
grep -n 'RewriteRule' "$HTACCESS_ROOT"
echo ""

echo "=== Test 2: Trailing-Slash-Regel vorhanden ==="
if grep -q 'Trailing Slash erzwingen' "$HTACCESS_ROOT"; then
  echo "OK: Trailing-Slash 301 Redirect gefunden"
else
  echo "FEHLER: Keine Trailing-Slash-Regel in .htaccess-root"
  exit 1
fi
echo ""

echo "=== Test 3: -d Check vorhanden ==="
if grep -q 'ristorantestoria-de.*-d' "$HTACCESS_ROOT"; then
  echo "OK: Directory-Check (-d) gefunden"
else
  echo "FEHLER: Kein -d Check in .htaccess-root"
  exit 1
fi
echo ""

echo "=== Test 4: Inner .htaccess hat KEINE Regel 1/2/3 mehr ==="
if grep -q 'Regel 3' "$HTACCESS_INNER"; then
  echo "FEHLER: Regel 3 existiert noch in inner .htaccess"
  exit 1
else
  echo "OK: Regel 1/2/3 entfernt"
fi
echo ""

echo "=== Test 5: Legacy-Redirects mit Trailing Slash ==="
echo "--- mittagsmenu ---"
grep 'mittagsmenu' "$HTACCESS_ROOT"
echo "--- weihnachtsmenues ---"
grep 'weihnachtsmenues' "$HTACCESS_ROOT"
echo "--- silvesterparty ---"
grep 'silvesterparty' "$HTACCESS_ROOT"
echo ""

echo "=== Test 6: Legacy-Redirects haben /?$ Pattern ==="
LEGACY_COUNT=$(grep -c '/?\$' "$HTACCESS_ROOT" || true)
if [ "$LEGACY_COUNT" -ge 3 ]; then
  echo "OK: $LEGACY_COUNT Regeln mit /?$ Pattern"
else
  echo "FEHLER: Nur $LEGACY_COUNT Regeln mit /?$ (erwartet >= 3)"
  exit 1
fi
echo ""

echo "=== Test 7: Deploy-Workflow hat .htaccess-root Upload ==="
WORKFLOW="$ROOT/.github/workflows/deploy-ionos.yml"
if grep -q 'htaccess-root' "$WORKFLOW"; then
  echo "OK: .htaccess-root in Deploy-Workflow referenziert"
else
  echo "FEHLER: .htaccess-root nicht im Deploy-Workflow"
  exit 1
fi
echo ""

echo "=== Test 8: CMS-Redirects im Root ==="
CMS_COUNT=$(grep -c '^RewriteRule.*cms/' "$HTACCESS_ROOT" || true)
echo "CMS-Redirect-Regeln im Root: $CMS_COUNT"
if [ "$CMS_COUNT" -ge 10 ]; then
  echo "OK: CMS-Redirects im Root vorhanden"
else
  echo "FEHLER: Weniger als 10 CMS-Redirect-Regeln im Root"
  exit 1
fi
echo ""

echo "=== Test 9: CMS-Redirects NICHT mehr im Inner ==="
INNER_CMS=$(grep -c '^RewriteRule.*cms/' "$HTACCESS_INNER" || true)
if [ "$INNER_CMS" -eq 0 ]; then
  echo "OK: Keine CMS-Redirects mehr im inneren .htaccess"
else
  echo "FEHLER: $INNER_CMS CMS-Redirect-Regeln noch im inneren .htaccess"
  exit 1
fi
echo ""

echo "=== Test 10: Query-String Redirects im Root ==="
QS_COUNT=$(grep -c 'page_id=' "$HTACCESS_ROOT" || true)
if [ "$QS_COUNT" -ge 3 ]; then
  echo "OK: $QS_COUNT Query-String-Redirects im Root"
else
  echo "FEHLER: Nur $QS_COUNT Query-String-Redirects (erwartet >= 3)"
  exit 1
fi
echo ""

echo "✅ Alle Tests bestanden!"
