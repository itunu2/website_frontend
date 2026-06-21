import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary-screenshots');
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

const art = await browser.newPage();
await art.setViewport({ width: 1000, height: 800, deviceScaleFactor: 2 });
await art.goto('http://localhost:3000/blog/why-your-morning-routine-isn-t-working', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2500));
// scroll to trigger all animations
await art.evaluate(async () => {
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y < total; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
});
await new Promise(r => setTimeout(r, 500));

// Find the ul element and scroll to it
const listTop = await art.evaluate(() => {
  const ul = document.querySelector('ul');
  if (!ul) return null;
  return ul.getBoundingClientRect().top + window.scrollY - 100;
});
console.log('First ul top:', listTop);
if (listTop) {
  await art.evaluate(y => window.scrollTo(0, y), listTop);
  await new Promise(r => setTimeout(r, 400));
  await art.screenshot({ path: path.join(outDir, 'bullets-check.png'), clip: { x: 0, y: 0, width: 1000, height: 800 } });
  console.log('bullets-check done');
}

await browser.close();
console.log('ALL DONE');
