// Tests für die Rechen-Logik. Start: node tests/logic.test.js
const assert = require('assert');
const L = require('../js/logic.js');
const { CONFIG } = require('../js/data.js');
let n = 0;
function t(name, fn) { fn(); n++; console.log('✔', name); }

t('Mainz-Innenstadt liegt in der Zone', () => assert.ok(L.pointInPolygon([49.9929, 8.2473], CONFIG.mainzZone)));
t('Frankfurt liegt NICHT in der Zone', () => assert.ok(!L.pointInPolygon([50.1109, 8.6821], CONFIG.mainzZone)));
t('Augsburg liegt NICHT in der Zone', () => assert.ok(!L.pointInPolygon(CONFIG.stadium.pos, CONFIG.mainzZone)));
t('Entfernung Mainz–Augsburg ~ 270 km Luftlinie', () => {
  const d = L.distanceKm(CONFIG.mainz.pos, CONFIG.stadium.pos); assert.ok(d > 250 && d < 290, d);
});
t('Routen sind 330–450 km lang und enden am Stadion', () => CONFIG.routes.forEach(r => {
  const len = L.pathLengthKm(r.path); assert.ok(len > 330 && len < 450, r.id + ' ' + len);
  assert.ok(L.distanceKm(r.path[r.path.length - 1], CONFIG.stadium.pos) < 1);
}));
t('Zonen-Wechsel wird erkannt', () => {
  assert.strictEqual(L.zoneTransition(null, false), null);
  assert.strictEqual(L.zoneTransition(true, false), 'left');
  assert.strictEqual(L.zoneTransition(false, true), 'entered');
  assert.strictEqual(L.zoneTransition(true, true), null);
});
t('Fahndungs-Sterne', () => {
  assert.strictEqual(L.wantedStars(0), 0); assert.strictEqual(L.wantedStars(7), 2); assert.strictEqual(L.wantedStars(100), 5);
});
t('Countdown', () => {
  const c = L.countdownParts(90061000, 0); assert.deepStrictEqual([c.days, c.hours, c.minutes, c.seconds], [1, 1, 1, 1]);
  assert.ok(L.countdownParts(0, 5).done);
});
t('Tippspiel-Punkte', () => {
  assert.strictEqual(L.tipPoints([2, 1], [2, 1]), 3);
  assert.strictEqual(L.tipPoints([2, 1], [3, 2]), 2);
  assert.strictEqual(L.tipPoints([2, 0], [1, 0]), 1);
  assert.strictEqual(L.tipPoints([0, 1], [1, 0]), 0);
  assert.strictEqual(L.tipPoints([1, 1], [0, 0]), 2);
  assert.strictEqual(L.tipPoints(['', ''], [1, 0]), null);
});
t('Bingo-Reihen', () => {
  const m = Array(16).fill(false); assert.strictEqual(L.bingoLines(m, 4), 0);
  [0, 1, 2, 3].forEach(i => m[i] = true); assert.strictEqual(L.bingoLines(m, 4), 1);
  [5, 10, 15].forEach(i => m[i] = true); assert.strictEqual(L.bingoLines(m, 4), 2);
  assert.strictEqual(L.bingoLines(Array(16).fill(true), 4), 10);
});
t('Kilometer-Marken', () => {
  assert.strictEqual(L.kmMark(null, 120), null);
  assert.strictEqual(L.kmMark(103, 99), 100);
  assert.strictEqual(L.kmMark(99, 103), null);
  assert.strictEqual(L.kmMark(12, 0.5), 1);
});
t('Inhalte: 16 Bingo-Felder, Sprüche für alle km-Marken', () => {
  const { INFO } = require('../js/data.js');
  assert.strictEqual(new Set(INFO.bingo).size, 16);
  [350, 300, 250, 200, 150, 100, 50, 25, 10, 1].forEach(k => assert.ok(INFO.kmLines[k], k));
  assert.ok(INFO.chants.length >= 5);
});
console.log(`\n${n} Logik-Tests bestanden.`);
