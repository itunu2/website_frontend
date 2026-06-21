#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

const [, , urlArg, labelArg] = process.argv;

if (!urlArg) {
	console.error("Usage: node screenshot.mjs <url> [label]");
	process.exit(1);
}

const outputDir = path.resolve(process.cwd(), "temporary-screenshots");
fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(outputDir);
const nextIndex =
	files
		.map((name) => {
			const match = name.match(/^screenshot-(\d+)(?:-[\w-]+)*\.png$/);
			return match ? Number(match[1]) : 0;
		})
		.reduce((max, value) => Math.max(max, value), 0) + 1;

const safeLabel = labelArg ? `-${labelArg.replace(/[^a-zA-Z0-9-_]/g, "-")}` : "";
const makePath = (suffix = "") =>
	path.join(outputDir, `screenshot-${nextIndex}${safeLabel}${suffix}.png`);

const browser = await puppeteer.launch({
	headless: true,
	defaultViewport: {
		width: 1512,
		height: 982,
		deviceScaleFactor: 2,
	},
});

try {
	const page = await browser.newPage();
	await page.goto(urlArg, { waitUntil: "networkidle2", timeout: 60000 });
	await new Promise((resolve) => setTimeout(resolve, 400));
	await page.evaluate(() => {
		document.documentElement.style.scrollBehavior = "auto";
		document.body.style.scrollBehavior = "auto";
	});
	const shotPaths = [];

	// Trigger in-view animations before full-page capture.
	await page.evaluate(async () => {
		const step = Math.max(180, Math.floor(window.innerHeight * 0.7));
		const maxY = Math.max(0, document.body.scrollHeight - window.innerHeight);

		for (let y = 0; y <= maxY; y += step) {
			window.scrollTo({ top: y, behavior: "instant" });
			await new Promise((resolve) => setTimeout(resolve, 120));
		}

		window.scrollTo({ top: maxY, behavior: "instant" });
		await new Promise((resolve) => setTimeout(resolve, 220));

		window.scrollTo({ top: 0, behavior: "instant" });
		await new Promise((resolve) => setTimeout(resolve, 220));
	});

	const fullPath = makePath();
	await page.screenshot({ path: fullPath, fullPage: true });
	shotPaths.push(fullPath);

	const viewport = page.viewport() ?? { width: 1512, height: 982 };
	const detailTargets = [
		{ selector: ".logo-strip", name: "logos" },
		{ selector: "#value-cards", name: "value" },
		{ selector: "#services", name: "services" },
	];

	for (const target of detailTargets) {
		const handle = await page.$(target.selector);
		if (!handle) continue;

		const targetY = await page.evaluate((selector) => {
			const node = document.querySelector(selector);
			if (!node) return 0;
			const top = node.getBoundingClientRect().top + window.scrollY;
			return Math.max(0, Math.round(top - 12));
		}, target.selector);

		await page.evaluate((y) => {
			window.scrollTo(0, y);
		}, targetY);
		await page.waitForFunction(
			(expectedY) => Math.abs(window.scrollY - expectedY) < 2,
			{ timeout: 2500 },
			targetY,
		).catch(() => null);
		await new Promise((resolve) => setTimeout(resolve, 320));

		const rect = await page.evaluate((selector) => {
			const node = document.querySelector(selector);
			if (!node) return null;
			const r = node.getBoundingClientRect();
			return {
				x: r.x + window.scrollX,
				y: r.y + window.scrollY,
				width: r.width,
				height: r.height,
			};
		}, target.selector);
		if (!rect) continue;

		for (let i = 0; i < 2; i += 1) {
			const offset = i * 120;
			const clipY = Math.max(0, rect.y + offset - 18);
			const clipHeight = Math.max(
				300,
				Math.min(viewport.height - 12, rect.height + 92 - i * 24),
			);
			if (clipHeight < 120) continue;

			const detailPath = makePath(`-${target.name}-${i + 1}`);
			await page.screenshot({
				path: detailPath,
				clip: {
					x: 0,
					y: clipY,
					width: viewport.width,
					height: clipHeight,
				},
			});
			shotPaths.push(detailPath);
		}
	}

	console.log(shotPaths.join("\n"));
} finally {
	await browser.close();
}
