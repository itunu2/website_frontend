import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary-screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('newsletter-popup-dismissed', Date.now().toString());
});

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

const sections = [
  { id: 'hero', selector: null, yOffset: 0 },
  { id: 'stats', selector: null, yOffset: 800 },
  { id: 'values', selector: null, yOffset: 1600 },
  { id: 'services', selector: '#services', yOffset: 0 },
  { id: 'about', selector: '#about', yOffset: 0 },
  { id: 'contact', selector: '#contact', yOffset: 0 },
  { id: 'footer', selector: 'footer', yOffset: 0 },
];

for (const { id, selector, yOffset } of sections) {
  if (selector) {
    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, selector);
  } else {
    await page.evaluate((y) => window.scrollTo(0, y), yOffset);
  }
  // Wait for animations to settle
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, `v3-desk-${id}.png`), fullPage: false });
  console.log(`v3-desk-${id} done`);
}

await browser.close();
console.log('ALL DONE');
