# UVA Engineering — 2026 Impact Report

The Folio client preview: a static, responsive report with a fixed section title, scroll-driven chapter transitions, and hover/tap chapter navigation.

## Preview

Open `index.html` locally or serve the project folder with any static HTTP server. Enter **uva** on the client-preview screen. The viewing session lasts for the current browser tab; **Lock preview** in the footer returns to the password screen.

This is a courtesy password gate, not secure authentication. GitHub Pages serves static files, so direct image/PDF URLs and JavaScript source remain accessible. The page is labeled **Client preview**, has `noindex` metadata, and includes a crawler-disallowing `robots.txt`. These indexing preferences are not access controls.

## Build and check

Requires Node.js 22 or newer. No production dependencies or package installation are needed.

```sh
npm run check
npm run build
```

`dist/` contains only the website and its assets. All URLs are relative, so the same output works under a GitHub Pages repository path.

For the optional browser smoke check, install Playwright locally (`npm install --no-save --package-lock=false playwright` and `npx playwright install chromium`), then run `node scripts/smoke.cjs`. The test serves `dist/` under `/uva-engineering/` and checks the password entrance, deep links, navigation, interactive content, image loading and responsive widths. An existing Playwright installation can be supplied through `PLAYWRIGHT_MODULE`.

## GitHub Pages

Repository: `Ben-Keller/uva-engineering`.

- Pushes and pull requests run **Check site**.
- **Launch client preview** is manual; a source push does not deploy the website.
- Before launch, select **Settings → Pages → Source → GitHub Actions** in the repository.
- Run **Actions → Launch client preview → Run workflow** on `main` when ready to publish.
- The successful deployment reports the actual site URL. The expected project URL is `https://ben-keller.github.io/uva-engineering/`.

GitHub Pages eligibility depends on repository visibility and account plan. Private repositories require a plan supporting private-repository Pages. Publishing through Pages generally makes the website publicly reachable, even when the repository is private.

Workflow reference: [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Images and source

The site uses 59 WebP images extracted directly from the supplied PDF, at native resolution and quality 84. No image is upscaled. The graduate hero is restored to 2555 × 973 pixels; most other used images were already at the PDF's maximum resolution. `docs/image-audit.json` records native dimensions and output sizes.

To regenerate the image exports, install PyMuPDF and Pillow, then run `python3 scripts/extract-images.py`. The complete report remains at `assets/ImpactReport26_Complete.pdf`, linked in Contents.

`SOURCE_AUDIT.md` maps website content to the supplied report. Earlier design variants, scanned-page thumbnails, unused photos and historical screenshots are excluded from this repository and deployment.

## Files

- `index.html`, `preview.js` — client preview entrance and tab-session handling
- `app.js`, `data.js`, `styles.css` — Folio report, content, interactions and responsive styles
- `assets/media/` — optimized native-resolution WebP images
- `assets/ImpactReport26_Complete.pdf` — complete source report
- `scripts/` — validation, static packaging, browser smoke test and image extraction
- `.github/workflows/` — source checks and manual Pages deployment
- `QA.md`, `SOURCE_AUDIT.md`, `docs/image-audit.json` — verification and source records
