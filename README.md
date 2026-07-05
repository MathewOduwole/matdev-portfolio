# matdev-portfolio

Personal portfolio for Ayomide Mathew Oduwole — AI Engineer · Data Scientist.

**v3 — "The Living System."** The page presents itself as a production system:
one continuous pipeline (the rail) threads every section, and scrolling runs it
end-to-end — `00 INIT → 01 INGEST → 02 TRAIN → 03 SERVE → 04 OBSERVE →
05 SCALE → 06 COOLDOWN → 07 CONNECT`.

## Stack
- Vite + React 18 (plain JavaScript, no TypeScript)
- `motion` (scroll reveals / boot exit) + `lenis` (smooth scroll)
- Vanilla CSS — single `src/styles.css`, warm paper / ink / ember tokens
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
vercel              # preview deploy
vercel --prod       # production deploy
```

The status pill shows the deployed commit — on Vercel, enable
"Automatically expose System Environment Variables" so
`VERCEL_GIT_COMMIT_SHA` is present at build time (falls back to `dev`).

## Map

| Stage | Section | File |
| --- | --- | --- |
| — | Boot intro (first visit deploy sequence) | `components/BootIntro.jsx` |
| — | Pipeline rail + stage nodes | `components/Rail.jsx` |
| — | Status pill (region · commit · uptime) | `components/StatusPill.jsx` |
| 00 INIT | Hero + animated intake diagram | `components/Hero.jsx` |
| 01 INGEST | Story + animated avatar | `components/Story.jsx` |
| 02 TRAIN | Stack, trajectory, education, certs | `components/Stack.jsx` |
| 03 SERVE | Enerex + Glorea case studies (animated architecture diagrams), earlier roles | `components/Work.jsx`, `components/diagrams/` |
| 04 OBSERVE | Live linear-regression lab | `components/Lab.jsx` |
| 05 SCALE | LaRecette.ai (guest palette) | `components/Recette.jsx` |
| 06 COOLDOWN | Arcade — Packet Snake + Stack Breaker | `components/Arcade.jsx`, `components/arcade/` |
| 07 CONNECT | Contact + CV downloads | `components/Contact.jsx` |
| — | Terminal v3 (`~` to toggle) | `components/Terminal.jsx` |

## Terminal
`~` (or the button) toggles a bilingual fake shell: `help`, `whoami`,
`ls projects`, `enerex`, `glorea`, `recette`, `stack`, `cv ds|swe`,
`open github|linkedin|glorea|enerex`, `status`, `neofetch`, `lang en|fr`,
`play snake` (ASCII, in-terminal), `arcade`, `sudo hire-me`, `history`,
`clear`, `exit`. Tab completes; ↑/↓ walk history.

## i18n
Two languages (EN/FR), no dictionary files — every call site passes both:
`t('Hello', 'Bonjour')` via `src/lang/LanguageContext.jsx`. Persisted in
localStorage; the terminal and games are bilingual too.
