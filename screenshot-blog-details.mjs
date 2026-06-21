import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary-screenshots');
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

// Blog listing - close any popups, take clean screenshot
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
await page.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
// Dismiss any overlay by pressing Escape
await page.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 500));
// Close any modals by clicking elsewhere
await page.click('body');
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: path.join(outDir, 'blog-search-top.png'), clip: { x: 0, y: 60, width: 1280, height: 350 } });
console.log('blog-search-top done');

// Article with bullet points
const artPage = await browser.newPage();
await artPage.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1.5 });
await artPage.goto('http://localhost:3000/blog/why-your-morning-routine-isn-t-working', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
// Scroll past featured image to the content with lists
await artPage.evaluate(() => window.scrollTo(0, 1200));
await new Promise(r => setTimeout(r, 400));
await artPage.screenshot({ path: path.join(outDir, 'article-lists.png'), clip: { x: 0, y: 0, width: 1280, height: 900 } });
console.log('article-lists done');

await browser.close();
console.log('ALL DONE');
