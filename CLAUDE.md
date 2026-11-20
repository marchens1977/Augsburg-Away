# Projekt-Tagebuch: Grand Tour Augsburg 🚘⚽

## Zweck
Kleine Spaß-Web-App für die Auswärtsfahrt zum Spiel **FC Augsburg – 1. FSV Mainz 05** am **Sonntag, 22.11.2026**.
3 Leute, 1 Mercedes. Läuft im Handy-Browser (GitHub Pages), wird per WhatsApp-Link geteilt.

## Aktueller Stand (20.11.2026)
- **Start**: Retro-/Vice-Look (Sonnenuntergang, Palmen, schräge Schrift), 3 Crew-Karten (noch Emoji-Platzhalter),
  Countdown bis Anpfiff, „Fahndungs-Sterne“ (steigen mit der Bierzahl).
- **Anfahrt**: Karte (Leaflet + OpenStreetMap) mit 2 Routen (über Stuttgart / über Würzburg), Stadion- und Mainz-Marker,
  rote Mainz-Zone, GPS-Tracker (eigene Position, gefahrene Spur, km bis Augsburg, Tempo),
  **Mainz-Alarm** beim Verlassen der Zone (Blinken, Vibration, Sirene) + „Willkommen daheim“ beim Zurückkommen,
  „Zone bearbeiten“ (Punkte auf der Karte antippen → Text an Claude schicken).
- **Bier**: Zähler pro Person, lustige Titel, Meilenstein-Sprüche (z. B. bei 5: „05! Wie der Verein!“),
  Pinkelpausen-Prognose, Tabellenführer, Protokoll. Fahrer-Häkchen: Fahrer zählt nur Spezi;
  wer schon Bier hatte, kann nicht Fahrer werden.
- **Augsburg**: Infos zum FCA, zur Stadt und Tipps für Sonntag.

## Dateien
- `index.html` – Seitengerüst · `css/style.css` – Aussehen · `js/app.js` – Bedienung
- `js/data.js` – **alle Inhalte & Einstellungen** (Anstoßzeit, Crew-Namen/Fotos, Mainz-Zone, Routen, Infotexte)
- `js/logic.js` – reine Rechenfunktionen (Zone, Entfernung, Titel …)
- `vendor/leaflet/` – Kartenbibliothek (lokal kopiert, Version 1.9.4)
- `img/` – hier kommen die Fotos hin (`crew1.jpg`, `crew2.jpg`, `crew3.jpg`)

## Wichtige Entscheidungen
- Kein Server: Alles (Bierzähler, GPS-Spur, eigene Zone) wird **nur auf dem jeweiligen Handy** gespeichert.
  Folge: Jeder sieht nur seinen eigenen Standort und seine eigene Zählung. Gemeinsames Live-Teilen bräuchte einen
  Online-Dienst (z. B. kostenlose Datenbank) – bewusst erstmal weggelassen.
- Routen sind ungefähre Linien, für echte Navigation gibt es „In Google Maps öffnen“.
- Kein „GTA“-Logo/Originalgrafik, nur ein eigener Retro-Stil im ähnlichen Look.
- Stadtplan mit Kneipen: vom Nutzer gestrichen.

## Tests (nach jeder Änderung laufen lassen)
```
node tests/logic.test.js      # 10 Rechen-Tests (Zone, Entfernungen, Titel, Countdown …)
node tests/browser.test.js    # Klick-Test im Browser in Handy-Größe, inkl. simulierter GPS-Fahrt aus Mainz raus
SCREENSHOTS=/pfad node tests/browser.test.js   # zusätzlich Bildschirmfotos
```
Letzter Lauf: alle bestanden (20.11.2026).

## Offene Punkte
- [ ] Fotos der 3 Mitfahrer → Startseite (evtl. als gezeichnete Comic-Figuren)
- [ ] Namen der Crew eintragen
- [ ] **Anstoßzeit bestätigen** (Platzhalter: 15:30 Uhr)
- [ ] Mainz-Zone genau festlegen
- [ ] Alarm-Text / Sound nach Wunsch anpassen
- [ ] Ideen: Tipp-Spiel fürs Ergebnis, Fangesang-Knopf, Raststätten-Bingo, Spiel-Ticker-Knopf
- [ ] GitHub Pages einschalten
- Hinweis Datenschutz: GitHub Pages ist öffentlich – wer den Link hat, sieht auch die Fotos.

## Test-Liste für Marc (am Handy abhaken)
- [ ] App-Link öffnet sich im Handy-Browser
- [ ] Karte lädt mit Straßen (im Test-Container war die Karte ohne Hintergrund, weil das Internet dort gesperrt ist)
- [ ] „GPS starten“ fragt nach Standort, blauer Punkt erscheint an der richtigen Stelle
- [ ] „Alarm testen“: rotes Blinken, Vibration, Sirenen-Ton
- [ ] Bierzähler: Plus/Minus, Namen ändern, Fahrer-Häkchen
- [ ] Nach Schließen und Neuöffnen sind die Bierzahlen noch da
- [ ] Sonntag live: Alarm kommt beim Verlassen von Mainz
