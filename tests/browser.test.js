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
  assert.ok(/Tage|ANPFIFF/.test(await page.textContent('#countdown'))); console.log('✔ Countdown läuft');
  await shot('1-start');

  await page.click('[data-tab=beer]');
  await page.click('[data-add="1"]'); await page.click('[data-add="1"]');
  assert.strictEqual((await page.textContent('#beer-people .person:nth-child(2) .count')).trim(), '2'); console.log('✔ Bier zählt');
  await page.click('[data-add="0"]');
  assert.ok(/Spezi/.test(await page.textContent('#beer-people .person:nth-child(1) .title'))); console.log('✔ Fahrer bekommt Spezi');
  await page.reload();
  await page.click('[data-tab=beer]');
  assert.strictEqual((await page.textContent('#beer-people .person:nth-child(2) .count')).trim(), '2'); console.log('✔ Zähler bleibt nach Neuladen');
  await shot('3-bier');

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

  await page.click('[data-tab=info]');
  assert.ok(/Fuggerei/.test(await page.textContent('#info-city'))); console.log('✔ Augsburg-Infos da');
  await shot('4-info');

  assert.deepStrictEqual(errors, []); console.log('✔ Keine JavaScript-Fehler');
  await browser.close();
  console.log('\nAlle Browser-Tests bestanden.');
})().catch(e => { console.error('✘', e.message); process.exit(1); });
