# docs/baseline — Pre-refactor baseline artifacts

## Purpose

This folder holds before-refactor snapshots for the Movito landing page CRO simplification (task A0). Artifacts here serve two purposes:

1. **Anchor audit** — machine-readable inventory of every `href="#..."` in `index.html`, classified as KEEP / DELETE_ORPHAN / REDIRECT. Used by task B1b (nav/footer/success-button cleanup) as its definitive checklist.
2. **Visual baselines** — screenshots at desktop / tablet / mobile viewport widths for visual regression comparison after A1 (section deletion), B1b (anchor cleanup), and C1 (Czech copy) are applied.

## Contents

| File | Status | Description |
|------|--------|-------------|
| `anchor-audit.md` | CREATED | Full `href="#..."` inventory — 19 entries, all classified |
| `desktop-1440.png` | NOT CAPTURED | See manual capture instructions below |
| `tablet-768.png` | NOT CAPTURED | See manual capture instructions below |
| `mobile-390.png` | NOT CAPTURED | See manual capture instructions below |

## Screenshot status — manual capture required

Automated screenshot capture was attempted via Playwright (`npx playwright screenshot`) but failed because the Playwright browser binaries are not installed in this environment (`npx playwright install` was not run and no new packages are to be installed per task constraints).

Puppeteer was also checked — not available globally or locally.

### How to take baseline screenshots manually

1. Open `index.html` in Chrome or Edge (drag the file into the browser, or use a local dev server).
2. Open DevTools (`F12`) and switch to **Responsive / Device Toolbar** mode (`Ctrl+Shift+M`).
3. Set the viewport to each size listed below, scroll to the top, then use the DevTools "Capture full size screenshot" option (three-dot menu in the device toolbar).
4. Save the file with the exact name shown and place it in this folder.

| Target file | Viewport width | Viewport height |
|-------------|---------------|-----------------|
| `desktop-1440.png` | 1440 px | 900 px |
| `tablet-768.png` | 768 px | 1024 px |
| `mobile-390.png` | 390 px | 844 px |

Alternatively, if Node.js and a Chromium-based browser are available in CI, run:

```bash
npx playwright install chromium
npx playwright screenshot "file:///absolute/path/to/index.html" docs/baseline/desktop-1440.png --viewport-size=1440,900 --full-page
npx playwright screenshot "file:///absolute/path/to/index.html" docs/baseline/tablet-768.png --viewport-size=768,1024 --full-page
npx playwright screenshot "file:///absolute/path/to/index.html" docs/baseline/mobile-390.png --viewport-size=390,844 --full-page
```

## Reference

- Anchor audit: [anchor-audit.md](./anchor-audit.md)
- Refactor plan: [../v2-rework.md](../v2-rework.md)
