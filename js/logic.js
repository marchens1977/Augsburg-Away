/* Reine Rechen-Funktionen (ohne Bildschirm) – werden von der App UND von den Tests benutzt. */
(function (root) {
  // Liegt ein Punkt [lat, lng] in einem Vieleck (Liste von [lat, lng])?
  function pointInPolygon(point, polygon) {
    var x = point[1], y = point[0], inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var xi = polygon[i][1], yi = polygon[i][0];
      var xj = polygon[j][1], yj = polygon[j][0];
      var hit = (yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (hit) inside = !inside;
    }
    return inside;
  }

  // Luftlinie in km zwischen zwei Punkten [lat, lng]
  function distanceKm(a, b) {
    var R = 6371, toRad = Math.PI / 180;
    var dLat = (b[0] - a[0]) * toRad, dLng = (b[1] - a[1]) * toRad;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a[0] * toRad) * Math.cos(b[0] * toRad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // Länge einer Strecke (Liste von Punkten) in km
  function pathLengthKm(path) {
    var sum = 0;
    for (var i = 1; i < path.length; i++) sum += distanceKm(path[i - 1], path[i]);
    return sum;
  }

  // Erkennt, ob man die Zone gerade verlassen oder betreten hat.
  // previous: true/false/null (null = noch unbekannt). Gibt 'left', 'entered' oder null zurück.
  function zoneTransition(previous, nowInside) {
    if (previous === null || previous === undefined) return null;
    if (previous && !nowInside) return 'left';
    if (!previous && nowInside) return 'entered';
    return null;
  }

  var BEER_TITLES = [
    [0, 'Nüchterner Langweiler', '🥛'],
    [1, 'Warmduscher', '🚿'],
    [2, 'Aufgewärmt', '🔥'],
    [3, 'Gut dabei', '🙂'],
    [4, 'Stimmungskanone', '🎉'],
    [5, 'Nullfünfer-Ehrenmann', '❤️'],
    [6, 'Vorsänger der Kurve', '📣'],
    [8, 'Legende vom Bruchweg', '🏟️'],
    [10, 'Ab hier zählt Mama mit', '👵'],
    [13, 'Bitte Wasser trinken!', '💧']
  ];

  function beerTitle(count) {
    var t = BEER_TITLES[0];
    for (var i = 0; i < BEER_TITLES.length; i++) if (count >= BEER_TITLES[i][0]) t = BEER_TITLES[i];
    return { title: t[1], emoji: t[2] };
  }

  // Witz-Prognose: alle 2 Bier eine Pinkelpause (gesamt über alle Mitfahrer)
  function peeStops(totalBeers) {
    return Math.floor(totalBeers / 2);
  }

  // Sonder-Meldungen, wenn jemand eine bestimmte Zahl erreicht
  function milestone(count) {
    var m = {
      1: 'Das erste Bier! Die Auswärtssaison ist eröffnet. 🍺',
      5: '05! Wie der Verein! Nullfünf, Nullfünf! ❤️🤍',
      7: 'Sieben Bier – mehr als Augsburg Tore schießt. 😏',
      10: 'Zweistellig! Ab jetzt nur noch mit Begleitperson.',
      13: 'Unglückszahl 13 – jetzt ist ein Wasser dran. 💧'
    };
    return m[count] || null;
  }

  // Countdown-Text bis zu einem Zeitpunkt
  function countdownParts(targetMs, nowMs) {
    var diff = Math.max(0, targetMs - nowMs);
    var s = Math.floor(diff / 1000);
    return {
      done: diff === 0,
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60
    };
  }

  // "Fahndungs-Sterne" (0–5) aus der Gesamtzahl Bier
  function wantedStars(totalBeers) {
    return Math.min(5, Math.floor(totalBeers / 3));
  }

  var api = {
    pointInPolygon: pointInPolygon,
    distanceKm: distanceKm,
    pathLengthKm: pathLengthKm,
    zoneTransition: zoneTransition,
    beerTitle: beerTitle,
    peeStops: peeStops,
    milestone: milestone,
    countdownParts: countdownParts,
    wantedStars: wantedStars
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Logic = api;
})(this);
