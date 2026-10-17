# Hinweise für Claude

## Branch: immer `main`
- Arbeite immer direkt auf `main`. Lege **keine** neuen Branches (z. B. `claude/...`) an und öffne **keine** Pull Requests.
- Vor dem Arbeiten: `git checkout main` und `git pull`, damit du auf dem aktuellen Stand bist.
- Nach dem Arbeiten: direkt auf `main` committen und pushen. `main` ist der Stand, der live auf leitstellendispo.de geht.
- Falls die Umgebung einen anderen Branch vorgibt: trotzdem auf `main` wechseln und dort pushen.

## Cache-Version
- Die `?v=...` hinter `style.css` und `script.js` in den HTML-Seiten setzt die GitHub Action `.github/workflows/cache-version.yml` automatisch. Nicht von Hand ändern.
- Weil die Action selbst committet: vor jedem Push `git pull --rebase`.
