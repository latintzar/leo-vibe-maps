/* Offline browser regression: run the actual source renderer functions with hostile model data. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { chromium } = require('playwright');
const file = path.join(__dirname, '../injected-script.js');
const source = fs.readFileSync(file, 'utf8');
const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
const wanted = new Set(['escapeHtml', 'normalizeAreas', 'showInfoCard', 'showVibeInfoCard']);
const functions = {};
function visit(node) {
  if (ts.isFunctionDeclaration(node) && node.name && wanted.has(node.name.text)) {
    assert.equal(functions[node.name.text], undefined, 'Renderer function must be unique');
    functions[node.name.text] = source.slice(node.getStart(tree), node.end);
  }
  ts.forEachChild(node, visit);
}
visit(tree);
assert.equal(Object.keys(functions).length, wanted.size);
(async () => {
  const browser = await chromium.launch({headless: true, ...(process.env.CHROME_EXECUTABLE ? {executablePath: process.env.CHROME_EXECUTABLE} : {})});
  try {
    const page = await browser.newPage();
    await page.route('**/*', route => route.abort()); // Every request remains offline.
    await page.setContent('<main id="map"><div class="gm-style"></div></main>');
    const result = await page.evaluate(({ functions }) => {
      const declarations = Object.values(functions).join('\n');
      const run = new Function('area', `
        let cardPersistent = false, currentInfoCard = null, currentAreaIndex = 0;
        let currentAreasArray = [area], VIBE_AREAS = [area], cardRemovalTimeout = null;
        let currentCardArea = null, currentMapRef = null;
        const findMapContainer = () => document.querySelector('#map');
        const hideInfoCard = () => { currentInfoCard?.remove(); currentInfoCard = null; cardPersistent = false; };
        const hideVibeInfoCard = hideInfoCard;
        const navigateArea = () => {}, navigateToArea = () => {}, cleanupCardListeners = () => {};
        ${declarations}
        const normalized = normalizeAreas([area])[0];
        const captures = [];
        for (const renderer of ['maps-website', 'embedded-map']) {
          hideInfoCard();
          if (renderer === 'maps-website') showInfoCard(area, 0);
          else showVibeInfoCard(area.name, area, null);
          const card = document.querySelector('#leo-vibe-info-card');
          captures.push({renderer, text: card.textContent, injected: card.querySelectorAll('img,script,iframe,style,object,embed').length,
            links: Array.from(card.querySelectorAll('a'), link => link.href), color: card.querySelector('div > div').style.background,
            compromised: window.__vibeCompromised === true});
        }
        return {captures, normalized, rejected: normalizeAreas([{lat: Infinity, lng: 0}, {lat: 91, lng: 1}, {lat: 0, lng: 181}]).length,
          bounded: normalizeAreas(Array(50).fill(area)).length};
      `);
      const payload = '<img src=x onerror="window.__vibeCompromised=true"><style>body{display:none}</style>';
      const malicious = {name: payload, why: payload, lat: 41.38, lng: 2.17, radius: 1e30,
        color: '#123456";background:url(https://attacker.invalid)',
        itinerary: Array(20).fill({purpose: payload, query: '\" onmouseover=\"alert(1) <svg/onload=alert(1)>'}),
        vibes: [payload], places: [payload]};
      const variants = [malicious, {...malicious, why: '', itinerary: []}, {...malicious, itinerary: [], places: [payload]}];
      return {payload, results: variants.map(run)};
    }, {functions});
    for (const resultCase of result.results) {
      assert.equal(resultCase.rejected, 0);
      assert.equal(resultCase.bounded, 10);
      assert.equal(resultCase.normalized.radius, 5000);
      assert.match(resultCase.normalized.color, /^#[\da-f]{6}$/i);
      assert.equal(resultCase.normalized.itinerary.length <= 3, true);
      for (const capture of resultCase.captures) {
        assert.equal(capture.injected, 0, capture.renderer + ' interpreted model markup');
        assert.equal(capture.compromised, false);
        assert.equal(capture.text.includes(result.payload), true, capture.renderer + ' lost literal text');
        for (const link of capture.links) assert.match(link, /^https:\/\/(www\.google\.com\/maps\/search\/|www\.tiktok\.com\/search\?q=)/);
      }
    }
    console.log('Both source renderers preserve hostile data as literal text; CSS, coordinates and counts remain bounded.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
