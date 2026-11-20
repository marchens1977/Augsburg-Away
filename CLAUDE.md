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
  „Zone bearbeiten“ = Vollbild-Editor: Karte verschieben, ✚-Fadenkreuz in der Mitte, Knopf „Punkt setzen“,
  Punkte werden automatisch verbunden; „Fertig“ speichert und zeigt einen Text „MAINZ-ZONE: [...]“ zum Kopieren
  (an Claude schicken → wird in `js/data.js` fest für alle eingebaut).
  **Seit 20.11. ausgeblendet.** Nur sichtbar über https://marchens1977.github.io/Augsburg-Away/?zone
  (dann auch Knopf „📋 Zone als Text“, zeigt die auf diesem Handy gespeicherte Zone zum Kopieren).
- **Augsburg**: Infos zum FCA, zur Stadt und Tipps für Sonntag.
- **Spiele**: Tippspiel mit Siegerehrung (3/2/1 Punkte), Raststätten-Bingo 4×4 (erkennt Reihen, Spalten, Diagonalen).
- **Kilometer-Sprüche** (neu): Bei GPS-Fahrt kommt bei „Noch 350/300/…/10/1 km“ ein Spruch.
- **Crew-Fotos** (neu): 3 echte Fotos als Comic-Porträts (`img/crew1-3.jpg`), Startseite mit gezeichnetem Auto.

## Dateien
- `index.html` – Seitengerüst · `css/style.css` – Aussehen · `js/app.js` – Bedienung
- `js/data.js` – **alle Inhalte & Einstellungen** (Anstoßzeit, Crew-Namen/Fotos, Mainz-Zone, Routen, Infotexte)
- `js/logic.js` – reine Rechenfunktionen (Zone, Entfernung, Titel …)
- `vendor/leaflet/` – Kartenbibliothek (lokal kopiert, Version 1.9.4)
- `img/` – Crew-Porträts (`crew1.jpg` Sonnenbrille/gestreiftes Hemd, `crew2.jpg` orange Sportbrille, `crew3.jpg` lange Locken)
- `docs/bild-auftrag.md` – Text für eine Bild-KI (Startbild)
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
- Fangesang-Knopf: am 20.11. entfernt (Computerstimme klang schlecht).
- Zonen-Editor: Antippen der Karte setzt KEINE Punkte mehr (am Handy hat sich nur die Karte verschoben) –
  nur noch Fadenkreuz + Knopf. Fehler behoben: erster Punkt ging verloren, wenn man sofort nach dem Öffnen tippte.

## Vor jedem Hochladen
`sh tools/bump-version.sh` ausführen – setzt `?v=...` an CSS/JS in `index.html`, sonst zeigen Handys bis zu
10 Minuten (oder länger) die alte Version aus dem Zwischenspeicher. (Problem trat am 20.11. beim Knopf „Zone als Text“ auf.)

## Tests (nach jeder Änderung laufen lassen)
```
node tests/logic.test.js      # 12 Rechen-Tests (Zone, Entfernungen, Sterne, Countdown, Tippspiel, Bingo, km-Marken …)
node tests/browser.test.js    # Klick-Test im Browser in Handy-Größe, inkl. simulierter GPS-Fahrt aus Mainz raus
SCREENSHOTS=/pfad node tests/browser.test.js   # zusätzlich Bildschirmfotos
```
Letzter Lauf: alle bestanden (20.11.2026, neuer Zonen-Editor, Fangesang entfernt; Zonen-Test 8× hintereinander grün).

## Offene Punkte
- [x] Fotos der 3 Mitfahrer → Startseite (Comic-Filter)
- [x] Namen: links Marc, Mitte Jens (Sportbrille), rechts Jens (Locken). Im Tippspiel mit Zusatz, damit man die zwei Jens unterscheidet.
- [x] Anstoßzeit: So, 22.11.2026, 15:30 Uhr, 10. Spieltag, live auf DAZN (im Internet geprüft: DAZN, buli-tipphilfe.de)
- [x] Mainz-Zone: von Marc gezeichnet (12 Punkte, Rheinhessen-Gebiet inkl. Bingen, bis südlich Nierstein), fest in `js/data.js` für alle.
- [ ] Alarm-Text / Sound nach Wunsch anpassen
- [x] Tippspiel, Raststätten-Bingo, km-Sprüche
- [x] Startbild `img/hero.jpg` (von Marc mit ChatGPT erstellt, 20.11.): alle drei im Mercedes-SUV, GTA-VI-Look.
  Ersetzt automatisch Fotokarten + gezeichnetes Auto (die bleiben als Ersatz, falls das Bild fehlt).
- [ ] GitHub Pages einschalten (Branch `main` wurde von Claude befüllt; Einschalten unter Settings → Pages macht Marc)
- Hinweis Datenschutz: GitHub Pages ist öffentlich – wer den Link hat, sieht auch die Fotos.

## Test-Liste für Marc (am Handy abhaken)
- [ ] App-Link öffnet sich im Handy-Browser
- [ ] Karte lädt mit Straßen (im Test-Container war die Karte ohne Hintergrund, weil das Internet dort gesperrt ist)
- [ ] „GPS starten“ fragt nach Standort, blauer Punkt erscheint an der richtigen Stelle
- [ ] „Alarm testen“: rotes Blinken, Vibration, Sirenen-Ton
- [ ] Nach Schließen und Neuöffnen sind Tipps und Bingo-Kreuze noch da
- [ ] Startbild auf der Startseite sieht gut aus
- [ ] Zone bearbeiten: Punkte setzen, Fertig, Text kopieren klappt am Handy
- [ ] Tippspiel: Tipps eintragen, nach dem Spiel Endergebnis → Siegerehrung
- [ ] Bingo: Felder antippen, bei voller Reihe kommt „BINGO!“
- [ ] Sonntag live: Alarm kommt beim Verlassen von Mainz
- [ ] Sonntag live: Kilometer-Sprüche erscheinen unterwegs
