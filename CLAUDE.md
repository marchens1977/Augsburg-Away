# Projekt-Tagebuch: Grand Tour Augsburg 🚘⚽

## Zweck
Kleine Spaß-Web-App für die Auswärtsfahrt zum Spiel **FC Augsburg – 1. FSV Mainz 05** am **Sonntag, 22.11.2026**.
3 Leute, 1 Mercedes. Läuft im Handy-Browser (GitHub Pages), wird per WhatsApp-Link geteilt.

## Aktueller Stand (20.11.2026)
- **Start**: Retro-/Vice-Look (Sonnenuntergang, Palmen, schräge Schrift), 3 Crew-Karten mit Comic-Fotos,
  Countdown bis Anpfiff, „Fahndungs-Sterne“ (alle 3 abgehakten Bingo-Felder ein Stern).
- **Anfahrt**: Karte (Leaflet + OpenStreetMap) mit 2 Routen (über Stuttgart / über Würzburg), Stadion- und Mainz-Marker,
  rote Mainz-Zone, GPS-Tracker (eigene Position, gefahrene Spur, km bis Augsburg, Tempo),
  **Mainz-Alarm** beim Verlassen der Zone (Blinken, Vibration, Sirene) + „Willkommen daheim“ beim Zurückkommen,
  „Zone bearbeiten“ (Punkte auf der Karte antippen → Text an Claude schicken).
- **Augsburg**: Infos zum FCA, zur Stadt und Tipps für Sonntag.
- **Spiele** (neu 20.11.): Fangesang-Knopf (zufälliger Schlachtruf, Handy spricht ihn per Sprachausgabe),
  Tippspiel mit Siegerehrung (3/2/1 Punkte), Raststätten-Bingo 4×4 (erkennt Reihen, Spalten, Diagonalen).
- **Kilometer-Sprüche** (neu): Bei GPS-Fahrt kommt bei „Noch 350/300/…/10/1 km“ ein Spruch.
- **Crew-Fotos** (neu): 3 echte Fotos als Comic-Porträts (`img/crew1-3.jpg`), Startseite mit gezeichnetem Auto.

## Dateien
- `index.html` – Seitengerüst · `css/style.css` – Aussehen · `js/app.js` – Bedienung
- `js/data.js` – **alle Inhalte & Einstellungen** (Anstoßzeit, Crew-Namen/Fotos, Mainz-Zone, Routen, Infotexte)
- `js/logic.js` – reine Rechenfunktionen (Zone, Entfernung, Titel …)
- `vendor/leaflet/` – Kartenbibliothek (lokal kopiert, Version 1.9.4)
- `img/` – Crew-Porträts (`crew1.jpg` Sonnenbrille/gestreiftes Hemd, `crew2.jpg` orange Sportbrille, `crew3.jpg` lange Locken)
- `tools/comic.py` – Hilfsprogramm: macht aus einem Foto ein Comic-Porträt
  (`python3 tools/comic.py foto.jpg img/crewX.jpg links oben rechts unten`). Originalfotos liegen NICHT im Repository.

## Wichtige Entscheidungen
- Kein Server: Alles (Tipps, Bingo, GPS-Spur, eigene Zone) wird **nur auf dem jeweiligen Handy** gespeichert.
  Folge: Jeder sieht nur seinen eigenen Standort und seine eigenen Eingaben. Gemeinsames Live-Teilen bräuchte einen
  Online-Dienst (z. B. kostenlose Datenbank) – bewusst erstmal weggelassen.
- Routen sind ungefähre Linien, für echte Navigation gibt es „In Google Maps öffnen“.
- Kein „GTA“-Logo/Originalgrafik, nur ein eigener Retro-Stil im ähnlichen Look.
- Stadtplan mit Kneipen: vom Nutzer gestrichen.
- Bierzähler: am 20.11. auf Wunsch entfernt („macht für die Fahrt keinen Sinn“).

## Tests (nach jeder Änderung laufen lassen)
```
node tests/logic.test.js      # 12 Rechen-Tests (Zone, Entfernungen, Sterne, Countdown, Tippspiel, Bingo, km-Marken …)
node tests/browser.test.js    # Klick-Test im Browser in Handy-Größe, inkl. simulierter GPS-Fahrt aus Mainz raus
SCREENSHOTS=/pfad node tests/browser.test.js   # zusätzlich Bildschirmfotos
```
Letzter Lauf: alle bestanden (20.11.2026, nach Entfernen des Bierzählers).

## Offene Punkte
- [x] Fotos der 3 Mitfahrer → Startseite (Comic-Filter)
- [x] Namen: links Marc, Mitte Jens (Sportbrille), rechts Jens (Locken). Im Tippspiel mit Zusatz, damit man die zwei Jens unterscheidet.
- [ ] **Anstoßzeit bestätigen** (Platzhalter: 15:30 Uhr)
- [ ] Mainz-Zone genau festlegen
- [ ] Alarm-Text / Sound nach Wunsch anpassen
- [x] Tippspiel, Fangesang-Knopf, Raststätten-Bingo, km-Sprüche
- [ ] Optional: gemaltes KI-Startbild (kostet ElevenLabs-Guthaben – nur mit OK)
- [ ] GitHub Pages einschalten (Branch `main` wurde von Claude befüllt; Einschalten unter Settings → Pages macht Marc)
- Hinweis Datenschutz: GitHub Pages ist öffentlich – wer den Link hat, sieht auch die Fotos.

## Test-Liste für Marc (am Handy abhaken)
- [ ] App-Link öffnet sich im Handy-Browser
- [ ] Karte lädt mit Straßen (im Test-Container war die Karte ohne Hintergrund, weil das Internet dort gesperrt ist)
- [ ] „GPS starten“ fragt nach Standort, blauer Punkt erscheint an der richtigen Stelle
- [ ] „Alarm testen“: rotes Blinken, Vibration, Sirenen-Ton
- [ ] Nach Schließen und Neuöffnen sind Tipps und Bingo-Kreuze noch da
- [ ] Fotos auf der Startseite sehen gut aus
- [ ] Fangesang-Knopf: Handy spricht den Spruch (Ton an!)
- [ ] Tippspiel: Tipps eintragen, nach dem Spiel Endergebnis → Siegerehrung
- [ ] Bingo: Felder antippen, bei voller Reihe kommt „BINGO!“
- [ ] Sonntag live: Alarm kommt beim Verlassen von Mainz
- [ ] Sonntag live: Kilometer-Sprüche erscheinen unterwegs
