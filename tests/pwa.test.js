// Test: Ist die App installierbar? (Manifest, Icons, Service Worker, offline)
// Start: node tests/pwa.test.js   (startet selbst einen kleinen Web-Server)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), assert = require('assert');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webmanifest': 'application/manifest+json' };
let marker = 'VERSION-A'; // simuliert eine neue App-Version auf dem Server
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(root, p);
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  // wie GitHub Pages: Browser darf 10 Minuten zwischenspeichern
  const head = { 'Content-Type': types[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'max-age=600' };
  if (p.endsWith('index.html')) { res.writeHead(200, head); return res.end(fs.readFileSync(f, 'utf8').replace('</body>', '<i id="marker">' + marker + '</i></body>')); }
  res.writeHead(200, head); fs.createReadStream(f).pipe(res);
}).listen(0, async () => {
  const url = 'http://localhost:' + server.address().port + '/';
  const browser = await chromium.launch();
  try {
    const m = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
    assert.strictEqual(m.display, 'standalone'); assert.strictEqual(m.short_name, 'Augsburg Away'); assert.ok(m.name && m.short_name && m.start_url);
    for (const i of m.icons) {
      const buf = fs.readFileSync(path.join(root, i.src));
      const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
      assert.strictEqual(w + 'x' + h, i.sizes, i.src);
    }
    assert.ok(m.icons.some(i => i.sizes === '192x192') && m.icons.some(i => i.sizes === '512x512'));
    console.log('✔ Manifest gültig, Icons 192 & 512 mit richtiger Größe');

    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(url);
    assert.ok(await page.evaluate(() => !!document.querySelector('link[rel=manifest]')));
    const sw = await page.evaluate(() => navigator.serviceWorker.ready.then(r => !!r.active));
    assert.ok(sw); console.log('✔ Service Worker läuft');
    await page.reload(); await page.waitForTimeout(500);
    await ctx.setOffline(true);
    await page.reload();
    assert.ok(/Augsburg/.test(await page.textContent('h1'))); console.log('✔ App startet auch offline (Funkloch)');
    await ctx.setOffline(false);
    marker = 'VERSION-B';
    await page.goto(url); // wie: App-Icon antippen (kein Neuladen-Knopf)
    assert.strictEqual(await page.textContent('#marker'), 'VERSION-B'); console.log('✔ Neue Version kommt sofort an (trotz 10-Min-Zwischenspeicher)');
    assert.ok(await page.isVisible('#btn-copy-link') && await page.isVisible('#btn-whatsapp')); console.log('✔ Weiterleiten-Knöpfe sichtbar');
    assert.deepStrictEqual(errors, []); console.log('✔ Keine JavaScript-Fehler');
    console.log('\nAlle PWA-Tests bestanden.');
  } catch (e) { console.error('✘', e.message); process.exitCode = 1; }
  await browser.close(); server.close();
});
