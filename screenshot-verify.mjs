import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary-screenshots');
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

async function shot(url, name, viewport, clip, scrollY = 0) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  if (scrollY) await page.evaluate(y => window.scrollTo(0, y), scrollY);
  await new Promise(r => setTimeout(r, 400));
  const opts = clip ? { path: path.join(outDir, name), clip } : { path: path.join(outDir, name), fullPage: true };
  await page.screenshot(opts);
  console.log(name, 'done');
  await page.close();
}

const ART = 'http://localhost:3000/blog/why-your-morning-routine-isn-t-working';

// Desktop: article top (header + image)
await shot(ART, 'verify-art-top-desk.png', { width: 1280, height: 900, deviceScaleFactor: 1.5 }, { x: 0, y: 0, width: 1280, height: 900 });

// Desktop: article content with bullet/list sections
await shot(ART, 'verify-art-lists-desk.png', { width: 1280, height: 900, deviceScaleFactor: 1.5 }, { x: 0, y: 0, width: 1280, height: 900 }, 1500);

// Mobile: article top
await shot(ART, 'verify-art-top-mob.png', { width: 390, height: 844, deviceScaleFactor: 2 }, { x: 0, y: 0, width: 390, height: 844 });

// Mobile: article content
await shot(ART, 'verify-art-lists-mob.png', { width: 390, height: 844, deviceScaleFactor: 2 }, { x: 0, y: 0, width: 390, height: 844 }, 1000);

// Blog listing - desktop (with search bar)
const BLOG = 'http://localhost:3000/blog';
await shot(BLOG, 'verify-blog-desk.png', { width: 1280, height: 800, deviceScaleFactor: 1.5 }, { x: 0, y: 60, width: 1280, height: 500 }, 0);

await browser.close();
console.log('ALL DONE');
