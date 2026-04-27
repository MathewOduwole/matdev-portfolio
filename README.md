# matdev-portfolio

Personal portfolio for Ayomide Mathew Oduwole — Data Scientist & ML Engineer.

## Stack
- Vite + React 18 (plain JavaScript, no TypeScript)
- Vanilla CSS (no framework) — single `src/styles.css`
- No backend; static deploy

## Local development

```sh
npm install
npm run dev
```
Serves on `http://localhost:5173`.

## Production build

```sh
npm run build       # outputs to dist/
npm run preview     # serves the production build locally
```

## Deploy to Vercel

```sh
# one-time
npm i -g vercel
vercel login

# from this directory:
vercel              # preview deploy
vercel --prod       # production deploy
```

Or connect this repo to Vercel via the dashboard — `vercel.json` already declares the framework + build command, so it auto-detects.

## Sections
1. **Hero** — split editorial: giant typography on the left, scroll-scrubbed SVG ML pipeline diagram on the right (Ingest → Model → Deploy → Impact)
2. **About** — narrative + animated SVG portrait (cursor parallax + idle bob + eye tracking + blinks) + tools chips
3. **Work** — sticky horizontal-scroll deck of project cards, each flippable for detail
4. **Playground** — live linear-regression toy: click to add points, line refits in real time, R² updates
5. **Stack** — skills grouped + experience timeline + education + certifications
6. **Contact** — large editorial CTA, email + LinkedIn + GitHub buttons
7. **Terminal** — easter-egg shell at bottom-right (toggle with `~` key) — supports `whoami`, `ls projects`, `cat about.md`, `stack`, `contact`, `open <name>`, `sudo hire-me`, `clear`, `help`

## Source design
Ported from a Claude Design HTML/JSX prototype (`portfolio/portfolio2.html` — the "v2 light" edition).
The Tweaks panel from the prototype was editor-only (parent-window postMessage protocol) and is intentionally not ported.
