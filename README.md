# Bundesliga Live-Ergebnisse

Ein Portal für die Ergebnisse der 1. Fußball-Bundesliga. Spieltage anzeigen, Torschützen analysieren und Statistiken als PDF exportieren.

## Datenquelle

Daten werden von der kostenlosen [OpenLigaDB API](https://www.openligadb.de/) geladen – keine API-Keys erforderlich.

## Lokal starten

**Voraussetzung:** Node.js

```bash
npm install
npm run dev
```

## Deployment

Dieses Projekt kann einfach auf Netlify deployt werden. Stellen Sie sicher, dass Ihre Build-Einstellungen wie folgt konfiguriert sind:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
