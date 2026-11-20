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
t('Bier-Titel', () => {
  assert.strictEqual(L.beerTitle(0).title, 'Nüchterner Langweiler');
  assert.strictEqual(L.beerTitle(5).title, 'Nullfünfer-Ehrenmann');
  assert.strictEqual(L.beerTitle(7).title, 'Vorsänger der Kurve');
  assert.strictEqual(L.beerTitle(99).title, 'Bitte Wasser trinken!');
});
t('Pinkelpausen & Sterne', () => {
  assert.strictEqual(L.peeStops(5), 2); assert.strictEqual(L.wantedStars(0), 0); assert.strictEqual(L.wantedStars(100), 5);
});
t('Meilenstein bei 5', () => assert.ok(/05/.test(L.milestone(5))));
t('Countdown', () => {
  const c = L.countdownParts(90061000, 0); assert.deepStrictEqual([c.days, c.hours, c.minutes, c.seconds], [1, 1, 1, 1]);
  assert.ok(L.countdownParts(0, 5).done);
});
console.log(`\n${n} Logik-Tests bestanden.`);
