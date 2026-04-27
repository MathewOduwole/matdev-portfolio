import React, { useEffect, useRef, useState } from 'react';

// Terminal easter egg — tilde / backtick toggles a fake shell. Commands
// resolve through COMMANDS map; `open <name>` routes to a known external URL.
const COMMANDS = {
  help: () => [
    'Available commands:',
    '  whoami         — short intro',
    '  ls projects    — list case studies',
    '  cat about.md   — narrative',
    '  stack          — tech stack',
    '  contact        — get in touch',
    '  open <name>    — github · linkedin · glorea',
    '  sudo hire-me   — :)',
    '  clear          — clear screen',
  ],
  whoami: () => [
    'ayomide@portfolio:~$ whoami',
    'Ayomide Mathew Oduwole — Data Scientist · ML Engineer.',
    'Built across 3 continents, 3 stacks, 3 languages.',
  ],
  'ls projects': () => [
    'drwxr-xr-x  glorea/         # flagship · research platform',
    'drwxr-xr-x  stealth_power/  # LLM fine-tuning · AI agent',
    'drwxr-xr-x  nerds_support/  # DevOps · CI/CD · BI',
    'drwxr-xr-x  gem_labs/       # scientific Python',
  ],
  'cat about.md': () => [
    '# About',
    'I build where research meets production.',
    'École Centrale de Nantes + Audencia double-degree.',
    'Fluent in English, French, Yoruba.',
  ],
  stack: () => [
    'Python · R · SQL · JS · TS',
    'PyTorch · scikit-learn · pandas · LLMs · Hugging Face',
    'React · Node · Next · FastAPI',
    'AWS · GCP · Azure · Docker · GitHub Actions',
  ],
  contact: () => [
    'email  — ayomidemathew.oduwole@gmail.com',
    'github — github.com/MathewOduwole',
    'linked — linkedin.com/in/ayomide-mathew-oduwole',
  ],
  'sudo hire-me': () => [
    '[sudo] password for recruiter: ********',
    '→ Permission granted. Send an email — I reply within 24h.',
  ],
  clear: 'CLEAR',
};

const OPEN_TARGETS = {
  github:   'https://github.com/MathewOduwole',
  linkedin: 'https://www.linkedin.com/in/ayomide-mathew-oduwole/',
  glorea:   'https://gloreaa.com',
};

const Terminal = () => {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([
    { type: 'sys', text: 'portfolio.sh v2 (light) — type `help` for commands.' },
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  // ~ (or `) toggles. Escape closes.
  useEffect(() => {
    const onKey = (e) => {
      const inField = e.target && e.target.closest && ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      if ((e.key === '~' || e.key === '`') && !inField) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines]);

  const run = (raw) => {
    const cmd = raw.trim().toLowerCase();
    const out = [{ type: 'prompt', text: raw }];
    if (!cmd) {
      setLines((l) => [...l, ...out]);
      return;
    }
    if (cmd.startsWith('open ')) {
      const target = cmd.slice(5).trim();
      const url = OPEN_TARGETS[target];
      if (url) {
        out.push({ type: 'ok', text: `Opening ${target}… (${url})` });
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        out.push({ type: 'err', text: `open: unknown target '${target}' — try github, linkedin, glorea.` });
      }
      setLines((l) => [...l, ...out]);
      return;
    }
    const handler = COMMANDS[cmd];
    if (handler === 'CLEAR') {
      setLines([]);
      return;
    }
    if (handler) {
      handler().forEach((text) => out.push({ type: 'out', text }));
    } else {
      out.push({ type: 'err', text: `command not found: ${cmd} — try \`help\`.` });
    }
    setLines((l) => [...l, ...out]);
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
          color: 'var(--ink-soft)', cursor: 'none',
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
        {open ? 'Close terminal' : 'Open terminal  ~'}
      </button>

      {open && (
        <div
          data-cursor-theme="dark"
          style={{
            position: 'fixed', bottom: 84, right: 28, zIndex: 60,
            width: 'min(560px, calc(100vw - 56px))', height: 'min(440px, 60vh)',
            background: 'var(--ink)', color: 'var(--bg)',
            border: '1px solid var(--ink)',
            borderRadius: 12, display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(20,17,13,0.25)',
            fontFamily: 'var(--font-mono)',
            animation: 'termIn 0.3s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
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
            <span style={{ marginLeft: 12 }}>ayomide@portfolio — zsh</span>
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
            <form
              onSubmit={(e) => { e.preventDefault(); run(input); setInput(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}
            >
              <span style={{ color: 'var(--ember)' }}>ayomide@portfolio ~ %</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                aria-label="Terminal input"
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--bg)', fontFamily: 'inherit', fontSize: 13,
                  caretColor: 'var(--ember)',
                }}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Terminal;
