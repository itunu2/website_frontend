import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary-screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await page.evaluateOnNewDocument(() => {
  localStorage.setItem('newsletter-popup-dismissed', Date.now().toString());
});

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));

// Scroll to footer
await page.evaluate(() => {
  const footer = document.querySelector('footer');
  if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'start' });
});
await new Promise(r => setTimeout(r, 800));
await page.screenshot({ path: path.join(outDir, 'v3-mobile-footer.png'), fullPage: false });
console.log('v3-mobile-footer done');

await browser.close();
console.log('DONE');
