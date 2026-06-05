301-Redirect /busreisen → /reisegruppen/

**Begründung:** /busreisen war zwar nie ein interner Slug der Website, aber der Nutzer möchte trotzdem eine Weiterleitung einrichten (z. B. für externe Altlinks).

**Umsetzung:**
In `public/.htaccess` im Block "3. Legacy URL Redirects" folgende Zeile einfügen:
```
RewriteRule ^busreisen/?$ /reisegruppen/ [R=301,L]
```

**Checkliste nach Build:**
- [ ] `npm run build` erfolgreich
- [ ] `.htaccess` im `dist/`-Ordner vorhanden
- [ ] Keine weiteren Änderungen nötig