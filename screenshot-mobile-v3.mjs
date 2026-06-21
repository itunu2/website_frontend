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
await new Promise(r => setTimeout(r, 2500));

// Hero close-up
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: path.join(outDir, 'v3-hero.png'), fullPage: false });
console.log('v3-hero done');

// Logo strip
await page.evaluate(() => {
  const el = document.querySelector('.logo-strip') || document.querySelector('[class*="logo"]');
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
});
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: path.join(outDir, 'v3-logos.png'), fullPage: false });
console.log('v3-logos done');

// Open hamburger menu
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 300));
const toggleBtn = await page.$('button[aria-label="Toggle menu"]');
if (toggleBtn) {
  await toggleBtn.click();
  await new Promise(r => setTimeout(r, 600));
}
await page.screenshot({ path: path.join(outDir, 'v3-mobile-menu.png'), fullPage: false });
console.log('v3-mobile-menu done');

// Full page desktop check
const desktop = await browser.newPage();
await desktop.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await desktop.evaluateOnNewDocument(() => {
  localStorage.setItem('newsletter-popup-dismissed', Date.now().toString());
});
await desktop.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
await desktop.screenshot({ path: path.join(outDir, 'v3-desktop-full.png'), fullPage: true });
console.log('v3-desktop-full done');
await desktop.close();

await browser.close();
console.log('ALL DONE');
