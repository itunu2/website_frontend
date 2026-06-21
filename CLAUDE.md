@AGENTS.md

## Screenshot Workflow

- If `screenshot.mjs` does not exist in the project root, create it before proceeding.
- Check if Puppeteer is installed by running `node -e "require('puppeteer')"`. 
  - If it fails, run `npm install puppeteer` in the project root before continuing.
- Puppeteer and Chrome cache will be managed automatically by npm — no hardcoded paths needed.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary-screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `./temporary-screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing