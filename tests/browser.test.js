// Klick-Test im echten Browser (Handy-Größe). Start: node tests/browser.test.js
// Optional: SCREENSHOTS=ordner node tests/browser.test.js  -> speichert Bilder
const { chromium, devices } = require('playwright');
const path = require('path');
const assert = require('assert');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['Pixel 7'], permissions: ['geolocation'], geolocation: { latitude: 49.9929, longitude: 8.2473 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + path.resolve(__dirname, '../index.html'));
  const shot = async n => process.env.SCREENSHOTS && page.screenshot({ path: path.join(process.env.SCREENSHOTS, n + '.png'), fullPage: true });

  assert.strictEqual(await page.locator('.crew-card').count(), 3); console.log('✔ Startseite: 3 Crew-Karten');
  await page.waitForFunction(() => [...document.querySelectorAll('.crew-card img')].every(i => i.complete && i.naturalWidth > 0));
  assert.strictEqual(await page.locator('.crew-card img').count(), 3); console.log('✔ 3 Crew-Fotos geladen');
  assert.deepStrictEqual(await page.$$eval('.crew-card .name', e => e.map(x => x.textContent)), ['Marc', 'Jens B.', 'Jens L.']); console.log('✔ Namen Marc, Jens B., Jens L.');
  if (require('fs').existsSync(path.resolve(__dirname, '../img/hero.jpg'))) {
    await page.waitForSelector('.hero.has-img'); console.log('✔ Startbild wird angezeigt');
  } else {
    assert.strictEqual(await page.locator('#hero-img').count(), 0); console.log('✔ Kein Startbild da → Fotokarten werden gezeigt');
  }
  assert.ok(/Tage|ANPFIFF/.test(await page.textContent('#countdown'))); console.log('✔ Countdown läuft');
  const wa = await page.getAttribute('#btn-whatsapp', 'href');
  assert.ok(wa.startsWith('https://wa.me/?text=') && decodeURIComponent(wa).includes('https://marchens1977.github.io/Augsburg-Away/'), wa);
  assert.ok(!decodeURIComponent(wa).includes('?zone')); console.log('✔ WhatsApp-Weiterleiten-Link (ohne ?zone)');
  assert.ok(await page.isVisible('#btn-copy-link')); console.log('✔ Link-kopieren-Knopf da');
  await shot('1-start');

  assert.strictEqual(await page.locator('[data-tab=beer]').count(), 0); console.log('✔ Kein Bierzähler mehr');
  await page.click('[data-tab=route]');
  await page.click('#btn-gps');
  await page.waitForFunction(() => /Live/.test(document.getElementById('gps-status').textContent));
  console.log('✔ GPS-Position in Mainz empfangen');
  assert.ok(await page.locator('#alarm.hidden').count() === 1);
  await ctx.setGeolocation({ latitude: 49.87, longitude: 8.65 }); // Darmstadt
  await page.waitForSelector('#alarm:not(.hidden)', { timeout: 10000 });
  assert.ok(/Mainz-Gebiet/.test(await page.textContent('#alarm-text'))); console.log('✔ Alarm beim Verlassen von Mainz');
  await shot('2-alarm');
  await page.click('#alarm-ok');
  await ctx.setGeolocation({ latitude: 49.99, longitude: 8.25 });
  await page.waitForSelector('#alarm.ok:not(.hidden)', { timeout: 10000 }); console.log('✔ Willkommen-zurück-Meldung');
  await page.click('#alarm-ok');
  await shot('2-karte');

  // Zone neu zeichnen: Karte verschieben + "Punkt setzen"
  assert.ok(!(await page.isVisible('#btn-edit-zone'))); console.log('✔ Zone bearbeiten normal ausgeblendet');
  await page.goto('file://' + path.resolve(__dirname, '../index.html') + '?zone');
  await page.click('[data-tab=route]');
  await page.click('#btn-edit-zone');
  await page.waitForSelector('#zone-fs:not(.hidden)');
  const box = await page.locator('#zone-map').boundingBox();
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  for (const [dx, dy] of [[0, 0], [-120, 0], [0, -120], [120, 0]]) {
    if (dx || dy) { await page.mouse.move(cx, cy); await page.mouse.down(); await page.mouse.move(cx + dx, cy + dy, { steps: 8 }); await page.mouse.up(); }
    await page.click('#zfs-add');
    }
  assert.strictEqual(await page.textContent('#zone-count'), '4 Punkte'); console.log('✔ Zone: 4 Punkte per Fadenkreuz gesetzt');
  await page.click('#zfs-undo');
  assert.strictEqual(await page.textContent('#zone-count'), '3 Punkte'); console.log('✔ Zone: Rückgängig');
  await shot('6-zone-editor');
  await page.click('#zfs-save');
  await page.waitForSelector('#zone-done:not(.hidden)');
  const code = await page.inputValue('#zone-code');
  const pts = JSON.parse(code.replace('MAINZ-ZONE: ', ''));
  assert.strictEqual(pts.length, 3);
  assert.ok(pts.every(p => p[0] > 49 && p[0] < 51 && p[1] > 7 && p[1] < 10), code); console.log('✔ Zone gespeichert, Code: ' + code);
  await page.click('#zone-done-ok');
  await page.click('#btn-show-zone');
  assert.strictEqual(await page.inputValue('#zone-code'), code); console.log('✔ „Zone als Text“ zeigt die gespeicherte Zone');
  await page.click('#zone-done-ok');
  await page.reload();
  assert.ok(/MAINZ|\[/.test(JSON.stringify(await page.evaluate(() => localStorage.getItem('gta05_zone'))))); console.log('✔ Zone bleibt nach Neuladen');

  await page.click('[data-tab=games]');
  assert.strictEqual(await page.locator('#btn-chant').count(), 0); console.log('✔ Kein Fangesang mehr');
  await page.fill('[data-tip="1"][data-side="0"]', '2'); await page.fill('[data-tip="1"][data-side="1"]', '1');
  await page.fill('[data-tip="2"][data-side="0"]', '0'); await page.fill('[data-tip="2"][data-side="1"]', '1');
  await page.fill('#res-0', '2'); await page.fill('#res-1', '1');
  const rank = await page.textContent('#tip-ranking');
  assert.ok(/🥇 Jens B\. – 3 Punkte/.test(rank), rank); console.log('✔ Tippspiel-Siegerehrung');
  for (const i of [0, 1, 2, 3]) await page.click(`[data-b="${i}"]`);
  await page.waitForSelector('#toast:not(.hidden)');
  assert.ok(/BINGO/.test(await page.textContent('#toast'))); console.log('✔ Bingo erkannt');
  await page.reload(); await page.click('[data-tab=games]');
  assert.strictEqual(await page.inputValue('#res-0'), '2'); assert.strictEqual(await page.locator('#bingo button.on').count(), 4);
  console.log('✔ Tipps & Bingo bleiben nach Neuladen');
  await page.click('[data-tab=start]');
  assert.strictEqual(await page.textContent('#stars'), '★☆☆☆☆'); console.log('✔ Fahndungs-Stern durch Bingo');
  await shot('5-spiele');

  await page.click('[data-tab=info]');
  assert.ok(/Fuggerei/.test(await page.textContent('#info-city'))); console.log('✔ Augsburg-Infos da');
  await shot('4-info');

  const html = require('fs').readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
  assert.ok(/style\.css\?v=\d+/.test(html) && /app\.js\?v=\d+/.test(html) && /data\.js\?v=\d+/.test(html)); console.log('✔ Versionsnummer an CSS/JS (gegen alten Zwischenspeicher)');
  assert.deepStrictEqual(errors, []); console.log('✔ Keine JavaScript-Fehler');
  await browser.close();
  console.log('\nAlle Browser-Tests bestanden.');
})().catch(e => { console.error('✘', e.message); process.exit(1); });
