import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary-screenshots');
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

// Blog listing — dismiss newsletter popup then grab just the listing area
const blog = await browser.newPage();
await blog.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
await blog.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
await blog.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 500));
await blog.screenshot({ path: path.join(outDir, 'final-blog-desk.png'), clip: { x: 0, y: 100, width: 1280, height: 700 } });
console.log('final-blog-desk done');
await blog.close();

// Article — scroll to list section (after featured image)
const art = await browser.newPage();
await art.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
await art.goto('http://localhost:3000/blog/why-your-morning-routine-isn-t-working', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2500));
// scroll animation
await art.evaluate(async () => {
  const total = document.documentElement.scrollHeight;
  for (let y = 0; y < total; y += 200) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)); }
  window.scrollTo(0, 800);
});
await new Promise(r => setTimeout(r, 500));
await art.screenshot({ path: path.join(outDir, 'final-art-lists.png'), clip: { x: 0, y: 0, width: 1280, height: 900 } });
console.log('final-art-lists done');
await art.close();

await browser.close();
console.log('ALL DONE');
