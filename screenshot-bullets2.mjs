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
// Trigger animations
await art.evaluate(async () => {
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y < total; y += 300) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
  window.scrollTo(0, 0);
});
await new Promise(r => setTimeout(r, 300));

// Find first ul and scroll to just above it
const found = await art.evaluate(() => {
  const uls = document.querySelectorAll('.prose-content ul, .prose-content ol');
  if (!uls.length) return { count: 0, top: null };
  const rect = uls[0].getBoundingClientRect();
  const absTop = rect.top + window.scrollY;
  window.scrollTo(0, Math.max(0, absTop - 150));
  return { count: uls.length, top: absTop };
});
console.log('Lists found:', found.count, 'first at:', found.top);
await new Promise(r => setTimeout(r, 400));

// No clip — just capture current viewport
await art.screenshot({ path: path.join(outDir, 'bullets-viewport.png'), fullPage: false });
console.log('bullets-viewport done');

await browser.close();
console.log('ALL DONE');
