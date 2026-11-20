/* Alle Einstellungen und Inhalte an einem Ort – hier kann man leicht etwas ändern. */
(function (root) {
  var CONFIG = {
    // Öffentliche Adresse der App (zum Weiterleiten)
    appUrl: 'https://marchens1977.github.io/Augsburg-Away/',
    shareText: 'Augsburg Away 🚘⚽ Unsere App für die Auswärtsfahrt am Sonntag! Link öffnen und oben „Jetzt installieren“ tippen:',
    // Anstoß: Sonntag, 22.11.2026, 15:30 Uhr (10. Spieltag, live auf DAZN) – im Internet geprüft am 20.11.
    kickoff: '2026-11-22T15:30:00+01:00',
    stadium: { name: 'WWK Arena, Augsburg', pos: [48.3232, 10.8863] },
    mainz: { name: 'MEWA Arena, Mainz', pos: [49.9839, 8.2244] },

    // Die Crew – Fotos kommen später in den Ordner img/ (crew1.jpg, crew2.jpg, crew3.jpg)
    crew: [
      // name = auf der Fotokarte, short = im Tippspiel
      { name: 'Marc', short: 'Marc', photo: 'img/crew1.jpg', emoji: '😎' },
      { name: 'Jens B.', short: 'Jens B.', photo: 'img/crew2.jpg', emoji: '🤠' },
      { name: 'Jens L.', short: 'Jens L.', photo: 'img/crew3.jpg', emoji: '🥸' }
    ],

    // 🔴 Mainz-Gebiet – von Marc am 20.11.2026 in der App gezeichnet (12 Punkte).
    // Punkte als [Breitengrad, Längengrad]. Neu zeichnen: ...github.io/Augsburg-Away/?zone → Anfahrt → Zone bearbeiten.
    mainzZone: [
      [50.04536, 8.20408], [50.03854, 8.24196], [50.07353, 8.29089], [50.03399, 8.39029],
      [49.98423, 8.37193], [49.86161, 8.38934], [49.72523, 8.44025], [49.74967, 8.14763],
      [49.81561, 7.80145], [50.03950, 7.69867], [50.06246, 7.94586], [50.01544, 7.94391]
    ],

    // Ungefähre Strecken (Wegpunkte entlang der Autobahnen, keine exakte Navigation)
    routes: [
      {
        id: 'stuttgart',
        name: 'Route 1: über Mannheim & Stuttgart (A6/A81/A8)',
        color: '#ff2d95',
        hint: 'Klassiker. Achtung: Stau-Gefahr am Albaufstieg (Drackensteiner Hang).',
        path: [
          [49.990, 8.270], [49.880, 8.500], [49.600, 8.560], [49.300, 8.640],
          [49.200, 8.900], [49.150, 9.280], [48.880, 9.170], [48.800, 9.020],
          [48.690, 9.200], [48.630, 9.560], [48.540, 9.800], [48.450, 10.080],
          [48.450, 10.280], [48.400, 10.600], [48.400, 10.830], [48.323, 10.886]
        ],
        gmaps: 'https://www.google.com/maps/dir/?api=1&origin=Mainz&destination=WWK+Arena+Augsburg&waypoints=Heilbronn|Stuttgart+Flughafen&travelmode=driving'
      },
      {
        id: 'wuerzburg',
        name: 'Route 2: über Frankfurt & Würzburg (A3/A7/A8)',
        color: '#00e5ff',
        hint: 'Oft etwas entspannter, dafür das Frankfurter Kreuz am Anfang.',
        path: [
          [49.990, 8.270], [50.050, 8.570], [49.980, 9.140], [49.800, 9.600],
          [49.750, 9.970], [49.740, 10.070], [49.370, 10.170], [49.170, 10.320],
          [48.960, 10.170], [48.680, 10.150], [48.450, 10.080], [48.450, 10.280],
          [48.400, 10.600], [48.400, 10.830], [48.323, 10.886]
        ],
        gmaps: 'https://www.google.com/maps/dir/?api=1&origin=Mainz&destination=WWK+Arena+Augsburg&waypoints=W%C3%BCrzburg|Ulm&travelmode=driving'
      }
    ]
  };

  var INFO = {
    club: [
      ['Verein', 'FC Augsburg 1907 – Spitzname: „Fuggerstädter“'],
      ['Farben', 'Rot – Grün – Weiß'],
      ['Stadion', 'WWK Arena (seit 2009), gut 30.000 Plätze'],
      ['Bundesliga', 'Seit 2011 ununterbrochen erstklassig'],
      ['Mainz-Fazit', 'Sympathischer Gegner – aber Sonntag gibt’s nix geschenkt! 😤']
    ],
    city: [
      ['Alter', 'Gegründet 15 v. Chr. von den Römern als „Augusta Vindelicorum“ – eine der ältesten Städte Deutschlands.'],
      ['Fuggerei', 'Älteste Sozialsiedlung der Welt (1521). Jahresmiete bis heute: 0,88 € – plus drei Gebete am Tag.'],
      ['Puppenkiste', 'Die Augsburger Puppenkiste: Jim Knopf, Urmel & Co. kommen von hier.'],
      ['Feiertag', 'Am 8. August hat nur Augsburg frei: das Hohe Friedensfest. Einziger Stadt-Feiertag Deutschlands.'],
      ['Erfinder', 'Rudolf Diesel entwickelte seinen Motor in Augsburg (bei der heutigen MAN).'],
      ['Promis', 'Bertolt Brecht wurde hier geboren, ebenso Leopold Mozart (Papa von Wolfgang Amadeus).'],
      ['Wahrzeichen', 'Die Zirbelnuss (ein Pinienzapfen) – steht auf Brunnen, Wappen und überall.'],
      ['UNESCO', 'Das historische Wassermanagement-System ist seit 2019 Welterbe.']
    ],
    tips: [
      'Stadion liegt im Süden der Stadt, direkt an der B17.',
      'An Spieltagen fährt die Straßenbahn bis zum Stadion (Linie bitte vorher prüfen).',
      'Gästeparkplatz & Gästeblock-Infos: kurz vor der Fahrt auf fcaugsburg.de bzw. mainz05.de checken.'
    ]
  };

  // Raststätten-Bingo: 16 Felder (4×4)
  var BINGO = [
    'Stau am Frankfurter Kreuz', 'Bayern-Fan an der Tanke', 'Würstchen über 6 €', 'WC kostet 1 €',
    'Wohnmobil-Kolonne', 'Andere 05er überholen', 'Jemand schläft ein', 'Blitzer!',
    'Falsche Ausfahrt', '„Sind wir bald da?“', 'Augsburg-Schal gesichtet', 'Baustelle mit 60',
    'Hupen für 05-Fans', 'Kaffee verschüttet', 'Navi will umleiten', 'Sprit über 2 € pro Liter'
  ];

  // Sprüche für die "Noch X km"-Marken unterwegs
  var KM_LINES = {
    350: 'Noch 350 km. Die Reise hat gerade erst begonnen. 🚘',
    300: 'Noch 300 km. Erste Pinkelpause schon geplant?',
    250: 'Noch 250 km. Mainz ist weg, die Stimmung ist da!',
    200: 'Noch 200 km. Halbzeit der Hinfahrt – Getränkecheck!',
    150: 'Noch 150 km. Bayern rückt bedrohlich näher. 😬',
    100: 'Noch 100 km! Schals raus, Fenster runter (kurz).',
    50: 'Noch 50 km! Augsburg zittert schon.',
    25: 'Noch 25 km! Stimme ölen!',
    10: 'Noch 10 km! NULLFÜNF! NULLFÜNF!',
    1: 'Ziel erreicht! Mission „Auswärtssieg“ startet jetzt. 🏟️'
  };

  INFO.bingo = BINGO; INFO.kmLines = KM_LINES;
  root.CONFIG = CONFIG;
  root.INFO = INFO;
  if (typeof module !== 'undefined' && module.exports) module.exports = { CONFIG: CONFIG, INFO: INFO };
})(this);
