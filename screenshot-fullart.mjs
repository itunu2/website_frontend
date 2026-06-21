import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary-screenshots');
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

// Full-page desktop article
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000/blog/why-your-morning-routine-isn-t-working', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2500));
// Scroll to trigger any animations
await page.evaluate(async () => {
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y < total; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: path.join(outDir, 'fullart-desk.png'), fullPage: true });
console.log('fullart-desk done');

// Full-page mobile article  
const mob = await browser.newPage();
await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await mob.goto('http://localhost:3000/blog/why-your-morning-routine-isn-t-working', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2500));
await mob.evaluate(async () => {
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y < total; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 500));
await mob.screenshot({ path: path.join(outDir, 'fullart-mob.png'), fullPage: true });
console.log('fullart-mob done');

await browser.close();
console.log('ALL DONE');
