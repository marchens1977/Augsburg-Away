/* Die eigentliche App: Reiter, Karte, GPS, Mainz-Alarm, Bierzähler, Infos. */
(function () {
  var L_ = window.Logic, C = window.CONFIG, I = window.INFO;
  var $ = function (id) { return document.getElementById(id); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('gta05_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('gta05_' + k, JSON.stringify(v)); } catch (e) {} }
  };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }

  // ---------- Reiter ----------
  var map = null;
  document.querySelectorAll('.tabs button').forEach(function (b) {
    b.addEventListener('click', function () { showTab(b.dataset.tab); });
  });
  function showTab(name) {
    document.querySelectorAll('.tabs button').forEach(function (b) { b.classList.toggle('active', b.dataset.tab === name); });
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.id === 'tab-' + name); });
    if (name === 'route') { initMap(); setTimeout(function () { map.invalidateSize(); }, 50); }
    window.scrollTo(0, 0);
  }

  // ---------- Kleine Meldungen ----------
  var toastTimer;
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.classList.remove('hidden');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.add('hidden'); }, 3500);
  }

  // ---------- Startseite ----------
  function renderCrew() {
    $('crew').innerHTML = C.crew.map(function (p) {
      return '<div class="crew-card"><div class="ph">' + p.emoji + '</div>' +
        '<img src="' + esc(p.photo) + '" alt="" onerror="this.remove()">' +
        '<div class="name">' + esc(p.name) + '</div></div>';
    }).join('');
  }
  function renderCountdown() {
    var c = L_.countdownParts(new Date(C.kickoff).getTime(), Date.now());
    $('countdown').innerHTML = c.done
      ? '<div><b>ANPFIFF!</b><span>Nullfünf olé!</span></div>'
      : [[c.days, 'Tage'], [c.hours, 'Std'], [c.minutes, 'Min'], [c.seconds, 'Sek']].map(function (x) {
        return '<div><b>' + x[0] + '</b><span>' + x[1] + '</span></div>';
      }).join('');
  }
  function renderStars() {
    var n = L_.wantedStars(totalBeers());
    $('stars').textContent = '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
  }

  // ---------- Karte ----------
  var zone = store.get('zone', C.mainzZone), zoneLayer, meMarker, trail, follow = true, watchId = null;
  var editing = false, editPoints = [], editLayer, editFresh = false;

  function initMap() {
    if (map) return;
    map = L.map('map', { zoomControl: true }).setView([49.2, 9.5], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18, attribution: '© OpenStreetMap'
    }).addTo(map);
    zoneLayer = L.polygon(zone, { color: '#e3001b', fillOpacity: 0.3, weight: 2 }).addTo(map)
      .bindPopup('🔴 Mainz-Gebiet – Heimat!');
    C.routes.forEach(function (r) {
      L.polyline(r.path, { color: r.color, weight: 5, opacity: 0.85 }).addTo(map).bindPopup(r.name);
    });
    L.marker(C.stadium.pos).addTo(map).bindPopup('🏟️ ' + C.stadium.name + '<br>Hier holen wir die 3 Punkte!');
    L.marker(C.mainz.pos).addTo(map).bindPopup('❤️ ' + C.mainz.name);
    trail = L.polyline([], { color: '#fff', weight: 3, dashArray: '4 6' }).addTo(map);
    map.on('click', onMapClick);
    map.on('dragstart', function () { if (follow) setFollow(false); });
  }

  function renderRoutes() {
    $('route-list').innerHTML = '<h3>🛣️ Mögliche Wege</h3>' + C.routes.map(function (r) {
      return '<div class="route-item"><div class="swatch" style="background:' + r.color + '"></div><div>' +
        '<b>' + esc(r.name) + '</b><br><span class="muted">ca. ' + Math.round(L_.pathLengthKm(r.path)) +
        ' km · ' + esc(r.hint) + '</span><br><a href="' + r.gmaps + '" target="_blank" rel="noopener">In Google Maps öffnen →</a></div></div>';
    }).join('') + '<small class="muted">Linien sind ungefähr eingezeichnet. Für Stau & genaue Navigation: Google Maps.</small>';
  }

  function setFollow(on) { follow = on; $('btn-follow').textContent = '🎯 Folgen: ' + (on ? 'an' : 'aus'); }
  $('btn-follow').addEventListener('click', function () { setFollow(!follow); });

  // ---------- GPS ----------
  var lastInside = null, track = store.get('track', []);
  $('btn-gps').addEventListener('click', function () {
    if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null; $('btn-gps').textContent = '📍 GPS starten'; $('gps-status').textContent = 'GPS aus.'; return; }
    if (!navigator.geolocation) { $('gps-status').textContent = 'Dieses Handy kann kein GPS im Browser. 😢'; return; }
    initMap();
    $('gps-status').textContent = 'Suche Satelliten … 🛰️';
    $('btn-gps').textContent = '⏹️ GPS stoppen';
    watchId = navigator.geolocation.watchPosition(onPosition, function (err) {
      $('gps-status').textContent = 'GPS-Fehler: ' + (err.code === 1 ? 'Bitte Standort erlauben.' : err.message);
    }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 });
  });

  function onPosition(p) {
    var pos = [p.coords.latitude, p.coords.longitude];
    var speed = p.coords.speed ? p.coords.speed * 3.6 : null;
    if (!meMarker) meMarker = L.marker(pos, { icon: L.divIcon({ className: '', html: '<div class="me-dot"></div>', iconSize: [22, 22] }) }).addTo(map).bindPopup('🚘 Wir!');
    meMarker.setLatLng(pos);
    var last = track[track.length - 1];
    if (!last || L_.distanceKm(last, pos) > 0.2) { track.push(pos); store.set('track', track.slice(-2000)); }
    trail.setLatLngs(track);
    if (follow) map.setView(pos, Math.max(map.getZoom(), 11));

    var left = L_.distanceKm(pos, C.stadium.pos);
    var home = L_.distanceKm(pos, C.mainz.pos);
    $('gps-status').textContent = 'Live · Genauigkeit ±' + Math.round(p.coords.accuracy) + ' m · ' + new Date().toLocaleTimeString('de-DE');
    $('gps-stats').innerHTML = stat(Math.round(left) + ' km', 'bis Augsburg (Luftlinie)') +
      stat(Math.round(home) + ' km', 'weg von Mainz') +
      stat(speed !== null ? Math.round(speed) + ' km/h' : '–', 'Tempo') +
      stat(L_.pathLengthKm(track).toFixed(0) + ' km', 'gefahren');

    var inside = L_.pointInPolygon(pos, zone);
    var change = L_.zoneTransition(lastInside, inside);
    if (change === 'left') showAlarm(false);
    if (change === 'entered') showAlarm(true);
    lastInside = inside;
  }
  function stat(v, l) { return '<div class="stat"><b>' + v + '</b><span>' + l + '</span></div>'; }

  // ---------- Mainz-Alarm ----------
  function showAlarm(welcomeBack) {
    var a = $('alarm');
    a.classList.toggle('ok', !!welcomeBack);
    $('alarm-title').textContent = welcomeBack ? 'Willkommen daheim!' : 'ACHTUNG!';
    $('alarm-text').innerHTML = welcomeBack
      ? 'Ihr betretet wieder <b>Mainzer Gebiet</b>. Helau und gute Nacht! 🏠❤️'
      : 'Sie verlassen das <b>Mainz-Gebiet</b>!<br>Ab hier gibt es kein ordentliches Weck, Worscht und Woi mehr. 🥨🌭🍷<br>Viel Glück da draußen.';
    a.classList.remove('hidden');
    if (navigator.vibrate) navigator.vibrate(welcomeBack ? [200, 100, 200] : [500, 200, 500, 200, 800]);
    siren(welcomeBack);
  }
  $('alarm-ok').addEventListener('click', function () { $('alarm').classList.add('hidden'); });
  $('btn-test-alarm').addEventListener('click', function () { showAlarm(false); });

  function siren(soft) {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = soft ? 'sine' : 'sawtooth'; o.connect(g); g.connect(ctx.destination); g.gain.value = 0.15;
      var t = ctx.currentTime;
      for (var i = 0; i < (soft ? 2 : 6); i++) {
        o.frequency.setValueAtTime(soft ? 660 : 600, t + i * 0.5);
        o.frequency.linearRampToValueAtTime(soft ? 880 : 1200, t + i * 0.5 + 0.25);
      }
      o.start(t); o.stop(t + (soft ? 1 : 3));
    } catch (e) {}
  }

  // ---------- Zone bearbeiten ----------
  $('btn-edit-zone').addEventListener('click', function () {
    editing = !editing;
    $('zone-editor').classList.toggle('hidden', !editing);
    $('btn-edit-zone').textContent = editing ? '✖️ Bearbeiten beenden' : '✏️ Zone bearbeiten';
    if (editing) { editPoints = zone.slice(); editFresh = true; drawEdit(); setFollow(false); map.fitBounds(L.polygon(zone).getBounds().pad(0.5)); toast('Tippe auf die Karte, um Punkte zu setzen.'); }
    else if (editLayer) { map.removeLayer(editLayer); editLayer = null; }
  });
  function onMapClick(e) {
    if (!editing) return;
    if (editFresh) { editPoints = []; editFresh = false; }
    editPoints.push([+e.latlng.lat.toFixed(4), +e.latlng.lng.toFixed(4)]);
    drawEdit();
  }
  function drawEdit() {
    if (editLayer) map.removeLayer(editLayer);
    editLayer = L.polygon(editPoints, { color: '#ffcf5c', dashArray: '5 5', fillOpacity: 0.1 }).addTo(map);
    $('zone-code').value = JSON.stringify(editPoints);
  }
  $('btn-zone-undo').addEventListener('click', function () { editPoints.pop(); drawEdit(); });
  $('btn-zone-save').addEventListener('click', function () {
    if (editPoints.length < 3) { toast('Mindestens 3 Punkte nötig.'); return; }
    zone = editPoints.slice(); store.set('zone', zone); zoneLayer.setLatLngs(zone); lastInside = null;
    toast('Zone gespeichert (auf diesem Handy). ✅');
  });
  $('btn-zone-reset').addEventListener('click', function () {
    if (!confirm('Zone auf Standard zurücksetzen?')) return;
    zone = C.mainzZone; try { localStorage.removeItem('gta05_zone'); } catch (e) {}
    editPoints = zone.slice(); editFresh = true; zoneLayer.setLatLngs(zone); drawEdit(); lastInside = null;
  });

  // ---------- Bierzähler ----------
  var beer = store.get('beer', null) || {
    people: C.crew.map(function (p, i) { return { name: p.name, count: 0, spezi: 0, driver: i === 0 }; }),
    log: []
  };
  function saveBeer() { store.set('beer', beer); renderBeer(); renderStars(); }
  function totalBeers() { return beer.people.reduce(function (s, p) { return s + p.count; }, 0); }

  function renderBeer() {
    var total = totalBeers();
    var leader = beer.people.slice().sort(function (a, b) { return b.count - a.count; })[0];
    var stops = L_.peeStops(total);
    $('beer-summary').innerHTML = stat(total, 'Bier gesamt') +
      stat(total * 0.5 + ' l', 'Liter vernichtet') +
      stat(stops, 'Pinkelpausen (Prognose)') +
      stat(leader && leader.count ? esc(leader.name) : '–', 'Tabellenführer');

    $('beer-people').innerHTML = beer.people.map(function (p, i) {
      var t = L_.beerTitle(p.count);
      return '<div class="card person">' +
        '<input value="' + esc(p.name) + '" data-i="' + i + '" class="pname" aria-label="Name">' +
        '<div class="count">' + (p.driver ? p.spezi : p.count) + '</div>' +
        '<div class="title">' + (p.driver ? '🚗 Fahrer – nur Spezi & Wasser (' + p.spezi + ')' : t.emoji + ' ' + t.title) + '</div>' +
        '<div class="glasses">' + (p.driver ? '🥤'.repeat(Math.min(p.spezi, 30)) : '🍺'.repeat(Math.min(p.count, 30))) + '</div>' +
        '<div class="row"><button class="btn big primary" data-add="' + i + '">' + (p.driver ? '+ 🥤 Spezi' : '+ 🍺 Prost!') + '</button>' +
        '<button class="btn big" data-sub="' + i + '">−</button></div>' +
        '<label class="driver-toggle"><input type="checkbox" data-drv="' + i + '"' + (p.driver ? ' checked' : '') + '> ist Fahrer</label>' +
        '</div>';
    }).join('');

    $('beer-log').innerHTML = beer.log.slice().reverse().slice(0, 50).map(function (l) {
      return '<li>' + esc(l.t) + ' – ' + esc(l.msg) + '</li>';
    }).join('') || '<li class="muted">Noch nix getrunken. Skandal!</li>';
  }

  $('beer-people').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var now = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    if (b.dataset.add !== undefined) {
      var p = beer.people[+b.dataset.add];
      if (p.driver) { p.spezi++; beer.log.push({ t: now, msg: p.name + ' trinkt brav Spezi 🥤' }); toast('Vorbildlich! 👏 Der Fahrer ist der wahre Held.'); }
      else {
        p.count++;
        beer.log.push({ t: now, msg: p.name + ' trinkt Bier Nr. ' + p.count + ' 🍺' });
        var m = L_.milestone(p.count);
        toast(m ? p.name + ': ' + m : 'Prost, ' + p.name + '! 🍻');
        if (navigator.vibrate) navigator.vibrate(60);
      }
    }
    if (b.dataset.sub !== undefined) {
      var q = beer.people[+b.dataset.sub];
      if (q.driver && q.spezi > 0) q.spezi--;
      else if (!q.driver && q.count > 0) { q.count--; beer.log.push({ t: now, msg: q.name + ' schummelt: −1 🙄' }); }
    }
    saveBeer();
  });
  $('beer-people').addEventListener('change', function (e) {
    if (e.target.classList.contains('pname')) { beer.people[+e.target.dataset.i].name = e.target.value.trim() || 'Namenlos'; saveBeer(); }
    if (e.target.dataset.drv !== undefined) {
      var p = beer.people[+e.target.dataset.drv];
      if (e.target.checked && p.count > 0) {
        e.target.checked = false;
        toast('🚨 Wer schon ' + p.count + ' Bier hatte, fährt heute nicht mehr!');
        return;
      }
      p.driver = e.target.checked; saveBeer();
    }
  });
  $('btn-beer-reset').addEventListener('click', function () {
    if (!confirm('Wirklich alle Zähler löschen?')) return;
    beer.people.forEach(function (p) { p.count = 0; p.spezi = 0; }); beer.log = []; saveBeer();
  });

  // ---------- Infos ----------
  function renderInfo() {
    var dl = function (rows) { return rows.map(function (r) { return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>'; }).join(''); };
    $('info-club').innerHTML = dl(I.club);
    $('info-city').innerHTML = dl(I.city);
    $('info-tips').innerHTML = I.tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
  }

  // ---------- Start ----------
  renderCrew(); renderCountdown(); setInterval(renderCountdown, 1000);
  renderRoutes(); renderBeer(); renderStars(); renderInfo();
})();
