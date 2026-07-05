import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '../lang/LanguageContext.jsx';
import { scrollToHash } from '../lib/lenis.js';
import { cvFor } from '../lib/cv.js';
import { COLS, KEY_DIRS, ROWS, createSnake, setDir, step } from './arcade/snakeEngine.js';

// Terminal v3 — tilde/backtick toggles a fake shell. Bilingual output,
// ↑/↓ history, tab-completion, and an ASCII build of Packet Snake.
const OPEN_TARGETS = {
  github:   'https://github.com/MathewOduwole',
  linkedin: 'https://www.linkedin.com/in/ayomide-mathew-oduwole/',
  glorea:   'https://gloreaa.com',
  enerex:   'https://enerex.com',
};

const COMPLETIONS = [
  'help', 'whoami', 'ls projects', 'cat about.md', 'stack', 'contact',
  'cv', 'cv ds', 'cv swe', 'open github', 'open linkedin', 'open glorea', 'open enerex',
  'enerex', 'glorea', 'recette', 'kitchen', 'status', 'neofetch',
  'play snake', 'arcade', 'lang en', 'lang fr', 'sudo hire-me', 'history', 'clear', 'exit',
];

const bootAt = Date.now();

const uptimeStr = () => {
  const s = Math.floor((Date.now() - bootAt) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
};

// Command outputs — every entry is (lang) => lines[].
const makeCommands = ({ lang, setLang, closeTerm }) => {
  const fr = lang === 'fr';
  return {
    help: () => (fr ? [
      'Commandes disponibles :',
      '  whoami          — qui je suis',
      '  ls projects     — les projets',
      '  enerex · glorea · recette — détails par projet',
      '  stack           — la stack technique',
      '  cv [ds|swe]     — télécharger un CV',
      '  contact         — me joindre',
      '  open <cible>    — github · linkedin · glorea · enerex',
      '  status          — état du système',
      '  neofetch        — infos système, avec style',
      '  play snake      — Packet Snake, en ASCII',
      '  arcade          — aller aux bornes',
      '  lang en|fr      — changer de langue',
      '  sudo hire-me    — :)',
      '  history · clear · exit',
      'Astuce : Tab complète, ↑/↓ parcourent l\'historique.',
    ] : [
      'Available commands:',
      '  whoami          — who I am',
      '  ls projects     — the projects',
      '  enerex · glorea · recette — per-project detail',
      '  stack           — the tech stack',
      '  cv [ds|swe]     — download a CV',
      '  contact         — reach me',
      '  open <target>   — github · linkedin · glorea · enerex',
      '  status          — system status',
      '  neofetch        — system info, with style',
      '  play snake      — Packet Snake, in ASCII',
      '  arcade          — jump to the cabinets',
      '  lang en|fr      — switch language',
      '  sudo hire-me    — :)',
      '  history · clear · exit',
      'Tip: Tab completes, ↑/↓ walk history.',
    ]),
    whoami: () => (fr ? [
      'Ayomide Mathew Oduwole — Ingénieur IA · Data Scientist.',
      'Enerex le jour, Glorea et LaRecette.ai la nuit.',
      'Trois continents, trois stacks, trois langues.',
    ] : [
      'Ayomide Mathew Oduwole — AI Engineer · Data Scientist.',
      'Enerex by day, Glorea and LaRecette.ai by night.',
      'Three continents, three stacks, three languages.',
    ]),
    'ls projects': () => [
      `drwxr-xr-x  enerex/         # ${fr ? 'agents LLM en production · énergie' : 'production LLM agents · energy'}`,
      `drwxr-xr-x  glorea/         # ${fr ? 'plateforme de recherche · 20M+ articles' : 'research platform · 20M+ papers'}`,
      `drwxr-xr-x  larecette/      # ${fr ? 'studio de conception d\'agents' : 'agent-design studio'}`,
      `drwxr-xr-x  stealth_power/  # ${fr ? 'fine-tuning LLM · agent BDD' : 'LLM fine-tuning · DB agent'}`,
      `drwxr-xr-x  nerds_support/  # ${fr ? 'DevOps · CI/CD · BI' : 'DevOps · CI/CD · BI'}`,
      `drwxr-xr-x  gem_labs/       # ${fr ? 'Python scientifique' : 'scientific Python'}`,
    ],
    enerex: () => (fr ? [
      'Enerex — Ingénieur IA (05/2026 — présent)',
      '· Plateforme multi-agents autonome : e-mails + contrats → données structurées',
      '· Extraction RAG ré-architecturée : minutes → secondes (~10×)',
      '· Serveur MCP : 80+ outils, 9 produits, accès contrôlé',
      '· Cadre d\'évals champ par champ — rien ne part sans feu vert',
      '· Modèle ML de tarification calibré + inférence causale',
      "→ tapez `open enerex` pour le site",
    ] : [
      'Enerex — AI Engineer (05/2026 — present)',
      '· Unattended multi-agent platform: emails + contracts → structured data',
      '· Re-architected RAG extraction: minutes → seconds (~10×)',
      '· MCP server: 80+ tools, 9 products, permission-gated',
      '· Field-level eval framework — nothing ships without the gate',
      '· Calibrated ML pricing model + causal inference',
      '→ try `open enerex` for the site',
    ]),
    glorea: () => (fr ? [
      'Glorea — Co-fondateur (04/2024 — présent)',
      "· L'espace de travail unifié de la recherche",
      '· 20M+ articles traités · 600K+ offres · 100+ premiers utilisateurs',
      '· Migration Azure → Hetzner + Cloudflare + Vercel',
      '→ `open glorea`',
    ] : [
      'Glorea — Co-founder (04/2024 — present)',
      '· The unified research workspace',
      '· 20M+ papers processed · 600K+ jobs · 100+ first users',
      '· Migrated Azure → Hetzner + Cloudflare + Vercel',
      '→ `open glorea`',
    ]),
    recette: () => (fr ? [
      'LaRecette.ai — « The AI Kitchen for Business »',
      '· Le studio de conception d\'agents — l\'étape que tout le monde saute',
      '· Le Chef vous interviewe → Agent Build Book prêt à construire',
      '· Chaque conception livrée avec ses évals : la dégustation',
      '· Stack : Python · LangGraph · OpenAI · Anthropic · Mistral',
    ] : [
      'LaRecette.ai — "The AI Kitchen for Business"',
      '· The agent-design studio — the step everyone skips',
      '· The Chef interviews you → a build-ready Agent Build Book',
      '· Every design ships with its evals: the taste test',
      '· Stack: Python · LangGraph · OpenAI · Anthropic · Mistral',
    ]),
    'cat about.md': () => (fr ? [
      '# À propos',
      'Je construis là où la recherche rencontre la production.',
      'École Centrale de Nantes + Audencia, double diplôme.',
      'Anglais, français, yoruba.',
    ] : [
      '# About',
      'I build where research meets production.',
      'École Centrale de Nantes + Audencia double-degree.',
      'Fluent in English, French, Yoruba.',
    ]),
    stack: () => [
      'Python · TypeScript · SQL · R · C++',
      'OpenAI · Anthropic MCP · RAG · evals · LangChain · Hugging Face',
      'PyTorch · scikit-learn · pandas · Azure ML',
      'React · Next · Node · FastAPI · Prisma · PostgreSQL',
      'Azure · AWS · GCP · Hetzner · Cloudflare · Docker · K8s · CI/CD',
    ],
    contact: () => [
      'email  — ayomidemathew.oduwole@gmail.com',
      'github — github.com/MathewOduwole',
      'linked — linkedin.com/in/ayomide-mathew-oduwole',
      fr ? 'réponse sous 24h.' : 'replies within 24h.',
    ],
    status: () => [
      `● ${fr ? 'opérationnel' : 'operational'} — nte · eu-west-3`,
      `build    ${__COMMIT_SHA__}`,
      `uptime   ${uptimeStr()}`,
      `locale   ${lang === 'fr' ? 'fr_FR' : 'en_US'} (${fr ? 'changez avec `lang en`' : 'switch with `lang fr`'})`,
      `services rail ✓ · arcade ✓ · terminal ✓`,
    ],
    neofetch: () => [
      '   ▄▄▄▄▄▄▄      ayomide@portfolio',
      '  █  ◠   █      ─────────────────',
      '  █  AO  █      host:    portfolio v3 — the living system',
      '  █▄▄▄▄▄▄█      kernel:  react 18.3 + motion + lenis',
      '   ▀▀▀▀▀▀▀      shell:   zsh (emulated, obviously)',
      `                uptime:  ${uptimeStr()}`,
      `                build:   ${__COMMIT_SHA__}`,
      `                locale:  ${lang === 'fr' ? 'fr_FR · en_US' : 'en_US · fr_FR'}`,
      `                theme:   ${fr ? 'papier chaud · encre · braise' : 'warm paper · ink · ember'}`,
    ],
    'sudo hire-me': () => (fr ? [
      '[sudo] mot de passe pour recruteur : ********',
      `→ Accès accordé. Déjà bien occupé chez Enerex — mais`,
      '  une bonne conversation est toujours la bienvenue. Écrivez-moi.',
    ] : [
      '[sudo] password for recruiter: ********',
      '→ Access granted. Happily shipping at Enerex — but a great',
      '  conversation is always welcome. Send an email.',
    ]),
    clear: 'CLEAR',
    exit: () => { closeTerm(); return [fr ? 'à bientôt.' : 'see you.']; },
    'lang en': () => { setLang('en'); return ['locale set to en_US ✓']; },
    'lang fr': () => { setLang('fr'); return ['locale définie sur fr_FR ✓']; },
    arcade: () => {
      closeTerm();
      setTimeout(() => scrollToHash('#arcade'), 150);
      return [fr ? 'direction les bornes…' : 'heading to the cabinets…'];
    },
  };
};

// ASCII frame renderer for terminal snake — two chars per cell.
const renderFrame = (s, fr) => {
  const rows = [];
  rows.push(`┌${'─'.repeat(COLS * 2)}┐`);
  for (let y = 0; y < ROWS; y += 1) {
    let row = '│';
    for (let x = 0; x < COLS; x += 1) {
      const isHead = s.snake[0].x === x && s.snake[0].y === y;
      const isBody = !isHead && s.snake.some((seg) => seg.x === x && seg.y === y);
      const isFood = s.food.x === x && s.food.y === y;
      if (isHead) row += '██';
      else if (isBody) row += '▓▓';
      else if (isFood) row += '◆ ';
      else row += '  ';
    }
    rows.push(`${row}│`);
  }
  rows.push(`└${'─'.repeat(COLS * 2)}┘`);
  rows.push(fr
    ? ` PKT ${String(s.score).padStart(3, '0')} · flèches = diriger · q = quitter`
    : ` PKT ${String(s.score).padStart(3, '0')} · arrows = steer · q = quit`);
  return rows.join('\n');
};

const Terminal = () => {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([
    { type: 'sys', text: 'portfolio.sh v3 — `help` for commands · Tab completes.' },
  ]);
  const [input, setInput] = useState('');
  const [game, setGame] = useState(null); // null | frame string
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const histRef = useRef({ list: [], idx: -1 });
  const gameRef = useRef(null);
  const gameTimer = useRef(null);
  const langRef = useRef(lang);
  langRef.current = lang;

  const closeTerm = () => setOpen(false);

  const push = (arr) => setLines((l) => [...l, ...arr]);

  const endGame = (died) => {
    clearInterval(gameTimer.current);
    const s = gameRef.current;
    setGame(null);
    gameRef.current = null;
    const fr = langRef.current === 'fr';
    if (s) {
      push([
        { type: 'ok', text: died
          ? (fr ? `connexion perdue — ${s.score} paquets livrés.` : `connection lost — ${s.score} packets delivered.`)
          : (fr ? `partie quittée — ${s.score} paquets livrés.` : `game exited — ${s.score} packets delivered.`) },
      ]);
    }
    setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
  };

  const startGame = () => {
    gameRef.current = createSnake();
    setGame(renderFrame(gameRef.current, langRef.current === 'fr'));
    clearInterval(gameTimer.current);
    gameTimer.current = setInterval(() => {
      const s = gameRef.current;
      if (!s) return;
      step(s);
      if (s.dead) { endGame(true); return; }
      setGame(renderFrame(s, langRef.current === 'fr'));
    }, 140);
  };

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const out = [{ type: 'prompt', text: raw }];
    const fr = lang === 'fr';
    if (!cmd) { setLines((l) => [...l, ...out]); return; }

    histRef.current.list.push(raw);
    histRef.current.idx = histRef.current.list.length;

    // open <target>
    if (cmd.startsWith('open ')) {
      const target = cmd.slice(5).trim();
      const url = OPEN_TARGETS[target];
      if (url) {
        out.push({ type: 'ok', text: `${fr ? 'ouverture de' : 'opening'} ${target}… (${url})` });
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        out.push({ type: 'err', text: `open: ${fr ? 'cible inconnue' : 'unknown target'} '${target}' — github · linkedin · glorea · enerex` });
      }
      setLines((l) => [...l, ...out]);
      return;
    }

    // cv [ds|swe] — serves the PDF matching the site language
    if (cmd === 'cv' || cmd.startsWith('cv ')) {
      const which = cmd.slice(2).trim();
      const files = cvFor(lang);
      if (files[which]) {
        out.push({ type: 'ok', text: `⤓ ${files[which].label} — ${fr ? 'téléchargement…' : 'downloading…'}` });
        window.open(files[which].path, '_blank', 'noopener,noreferrer');
      } else {
        out.push({ type: 'out', text: fr ? 'CV disponibles :' : 'Available CVs:' });
        out.push({ type: 'out', text: `  cv ds   — ${files.ds.label} (pdf)` });
        out.push({ type: 'out', text: `  cv swe  — ${files.swe.label} (pdf)` });
        out.push({ type: 'out', text: fr ? '  (version anglaise : `lang en` puis `cv`)' : '  (French version: `lang fr` then `cv`)' });
      }
      setLines((l) => [...l, ...out]);
      return;
    }

    // play snake
    if (cmd === 'play snake' || cmd === 'play') {
      if (cmd === 'play') {
        out.push({ type: 'out', text: fr ? 'usage : play snake — (breakout se trouve dans la section arcade)' : 'usage: play snake — (breakout lives in the arcade section)' });
        setLines((l) => [...l, ...out]);
        return;
      }
      out.push({ type: 'ok', text: fr ? 'lancement de packet snake… (q pour quitter)' : 'launching packet snake… (q to quit)' });
      setLines((l) => [...l, ...out]);
      startGame();
      return;
    }

    if (cmd === 'history') {
      const list = histRef.current.list.slice(0, -1);
      out.push(...(list.length
        ? list.map((h, i) => ({ type: 'out', text: `  ${i + 1}  ${h}` }))
        : [{ type: 'out', text: fr ? '(vide)' : '(empty)' }]));
      setLines((l) => [...l, ...out]);
      return;
    }

    const commands = makeCommands({ lang, setLang, closeTerm });
    const handler = commands[cmd] || (cmd === 'kitchen' ? commands.recette : cmd === 'ls' ? commands['ls projects'] : null);
    if (handler === 'CLEAR' || cmd === 'clear') {
      setLines([]);
      return;
    }
    if (handler) {
      handler().forEach((text) => out.push({ type: 'out', text }));
    } else {
      out.push({ type: 'err', text: `${fr ? 'commande introuvable' : 'command not found'}: ${cmd} — ${fr ? 'essayez' : 'try'} \`help\`` });
    }
    setLines((l) => [...l, ...out]);
  };

  // Global keys: toggle, escape, and snake steering while the game runs.
  useEffect(() => {
    const onKey = (e) => {
      const inField = e.target && e.target.closest && ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      if ((e.key === '~' || e.key === '`') && !inField) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (!open) return;
      if (gameRef.current) {
        if (e.key === 'q' || e.key === 'Q' || e.key === 'Escape') { e.preventDefault(); endGame(false); return; }
        const dir = KEY_DIRS[e.key];
        if (dir) { e.preventDefault(); setDir(gameRef.current, dir); }
        return;
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Status-pill event opens the terminal.
  useEffect(() => {
    const toggle = () => setOpen((o) => !o);
    window.addEventListener('portfolio:toggle-terminal', toggle);
    return () => window.removeEventListener('portfolio:toggle-terminal', toggle);
  }, []);

  // Cleanup interval on unmount; stop the game if the panel closes.
  useEffect(() => () => clearInterval(gameTimer.current), []);
  useEffect(() => {
    if (!open && gameRef.current) {
      clearInterval(gameTimer.current);
      gameRef.current = null;
      setGame(null);
    }
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open, game]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, game]);

  const onInputKey = (e) => {
    const h = histRef.current;
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (h.list.length === 0) return;
      h.idx = Math.max(0, h.idx - 1);
      setInput(h.list[h.idx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      h.idx = Math.min(h.list.length, h.idx + 1);
      setInput(h.list[h.idx] || '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cur = input.toLowerCase();
      if (!cur) return;
      const matches = COMPLETIONS.filter((c) => c.startsWith(cur));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        const shared = matches.reduce((a, b) => {
          let i = 0;
          while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
          return a.slice(0, i);
        });
        if (shared.length > cur.length) setInput(shared);
        else push([{ type: 'out', text: matches.join('   ') }]);
      }
    }
  };

  const lineColor = (type) => {
    if (type === 'err')    return '#FF8B73';
    if (type === 'sys')    return 'rgba(244,239,227,0.55)';
    if (type === 'prompt') return 'var(--ember)';
    if (type === 'ok')     return '#FCD34D';
    return 'var(--bg)';
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        data-cursor="hover"
        aria-label={open ? 'Close terminal' : 'Open terminal'}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 60,
          padding: '10px 16px', borderRadius: 999,
          background: 'var(--bg-raised)', border: '1px solid var(--line-strong)',
          color: 'var(--ink-soft)', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 10,
          transition: 'all 0.3s', boxShadow: '0 8px 24px rgba(20,17,13,0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--ember)';
          e.currentTarget.style.color = 'var(--ember)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--line-strong)';
          e.currentTarget.style.color = 'var(--ink-soft)';
        }}
      >
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--ember)', boxShadow: '0 0 8px var(--ember)',
          }}
        />
        {open ? (lang === 'fr' ? 'Fermer le terminal' : 'Close terminal') : (lang === 'fr' ? 'Terminal  ~' : 'Terminal  ~')}
      </button>

      {open && (
        <div className="term-panel" data-cursor-theme="dark">
          <div
            style={{
              padding: '10px 14px', borderBottom: '1px solid rgba(244,239,227,0.12)',
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 10, color: 'rgba(244,239,227,0.55)', letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
            <span style={{ marginLeft: 12 }}>ayomide@portfolio — zsh {game ? '· packet snake' : ''}</span>
          </div>
          <div
            ref={bodyRef}
            style={{ flex: 1, overflowY: 'auto', padding: 16, fontSize: 13, lineHeight: 1.6 }}
            onClick={() => inputRef.current && inputRef.current.focus()}
          >
            {lines.map((l, i) => (
              <div
                key={`line-${i}`}
                style={{ color: lineColor(l.type), whiteSpace: 'pre-wrap' }}
              >
                {l.type === 'prompt' ? `ayomide@portfolio ~ % ${l.text}` : l.text}
              </div>
            ))}

            {game ? (
              <pre
                style={{
                  margin: '8px 0 0', fontSize: 11.5, lineHeight: 1.25,
                  color: 'var(--bg)', fontFamily: 'var(--font-mono)',
                }}
              >
                {game}
              </pre>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); run(input); setInput(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}
              >
                <span style={{ color: 'var(--ember)' }}>ayomide@portfolio ~ %</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKey}
                  autoFocus
                  aria-label="Terminal input"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    color: 'var(--bg)', fontFamily: 'inherit', fontSize: 13,
                    caretColor: 'var(--ember)',
                  }}
                />
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Terminal;
