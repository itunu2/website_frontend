import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary-screenshots');

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

// Get first blog post slug
const listPage = await browser.newPage();
await listPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await listPage.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
const firstSlug = await listPage.evaluate(() => {
  const a = document.querySelector('article a');
  return a ? a.getAttribute('href') : null;
});
await listPage.close();
console.log('First article href:', firstSlug);

if (firstSlug) {
  // Desktop article
  const desk = await browser.newPage();
  await desk.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await desk.goto(`http://localhost:3000${firstSlug}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  await desk.screenshot({ path: path.join(outDir, 'article-desktop.png'), fullPage: true });
  console.log('article-desktop done');
  await desk.close();

  // Mobile article
  const mob = await browser.newPage();
  await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await mob.goto(`http://localhost:3000${firstSlug}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  // Scroll to trigger animations
  await mob.evaluate(async () => {
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += 300) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await new Promise(r => setTimeout(r, 500));
  await mob.screenshot({ path: path.join(outDir, 'article-mobile.png'), fullPage: true });
  console.log('article-mobile done');
  await mob.close();
}

await browser.close();
console.log('ALL DONE');
