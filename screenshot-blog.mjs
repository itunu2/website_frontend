import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, 'temporary-screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });

// Desktop
const desk = await browser.newPage();
await desk.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await desk.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2500));
await desk.screenshot({ path: path.join(outDir, 'blog-desktop.png'), fullPage: true });
console.log('blog-desktop done');
await desk.close();

// Mobile
const mobile = await browser.newPage();
await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await mobile.goto('http://localhost:3000/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
await new Promise(r => setTimeout(r, 2000));
await mobile.screenshot({ path: path.join(outDir, 'blog-mobile.png'), fullPage: true });
console.log('blog-mobile done');
await mobile.close();

await browser.close();
console.log('ALL DONE');
