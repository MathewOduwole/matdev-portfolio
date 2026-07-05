import React, { useEffect, useRef, useState } from 'react';
import { Btn, Magnetic, prefersReducedMotion } from '../shared.jsx';
import { useLang, useT } from '../lang/LanguageContext.jsx';

// Quadratic bezier point
const qbez = (p0, p1, p2, t) => {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
};

// Intake diagram — time-based (not scroll-scrubbed): three signal sources
// stream packets into the model core, which feeds a single line straight
// down and out of the panel toward stage 01. The page itself continues it.
const HeroDiagram = () => {
  const t = useT();
  const wrapRef = useRef(null);
  const [time, setTime] = useState(0.42);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let raf;
    let running = false;
    const start = performance.now();
    const tick = (now) => {
      setTime((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    }, { threshold: 0.1 });
    if (wrapRef.current) io.observe(wrapRef.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const CORE = { x: 260, y: 250 };
  const sources = [
    { x: 95,  label: t('RAW DATA', 'DONNÉES BRUTES') },
    { x: 260, label: t('KNOWLEDGE', 'CONNAISSANCES') },
    { x: 425, label: t('FEEDBACK', 'RETOURS') },
  ];
  const paths = sources.map((s) => ({
    p0: { x: s.x, y: 72 },
    p1: { x: (s.x + CORE.x) / 2, y: 150 },
    p2: { x: CORE.x, y: CORE.y - 58 },
  }));

  return (
    <div ref={wrapRef} style={{ position: 'relative', height: '100%' }}>
      <svg viewBox="0 0 520 600" width="100%" height="100%" style={{ overflow: 'visible' }} aria-hidden="true">
        {/* Source labels */}
        {sources.map((s) => (
          <g key={s.label}>
            <text x={s.x} y={52} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="2" fill="var(--muted)">
              {s.label}
            </text>
            <line x1={s.x - 20} y1={60} x2={s.x + 20} y2={60} stroke="var(--line-strong)" strokeWidth="1" />
          </g>
        ))}

        {/* Ingest curves */}
        {paths.map((p, i) => (
          <path
            key={`path-${i}`}
            d={`M ${p.p0.x} ${p.p0.y} Q ${p.p1.x} ${p.p1.y} ${p.p2.x} ${p.p2.y}`}
            fill="none" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="3 4"
          />
        ))}

        {/* Packets along ingest curves */}
        {paths.map((p, i) =>
          Array.from({ length: 5 }).map((_, k) => {
            const prog = ((time * (0.16 + i * 0.025)) + k / 5 + i * 0.13) % 1;
            const pt = qbez(p.p0, p.p1, p.p2, prog);
            const op = Math.sin(prog * Math.PI) * 0.95;
            return <circle key={`pk-${i}-${k}`} cx={pt.x} cy={pt.y} r="2.4" fill="var(--ember)" opacity={op} />;
          })
        )}

        {/* Model core — rotating spokes, breathing center */}
        <g transform={`translate(${CORE.x} ${CORE.y})`}>
          <circle r="72" fill="var(--ember-glow)" opacity={0.5 + Math.sin(time * 1.4) * 0.25} />
          <g transform={`rotate(${(time * 18) % 360})`}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <line
                  key={`spoke-${i}`}
                  x1={0} y1={0}
                  x2={Math.cos(a) * 52} y2={Math.sin(a) * 52}
                  stroke="var(--ink)" strokeWidth="0.8" opacity="0.55"
                />
              );
            })}
          </g>
          <circle r="52" fill="none" stroke="var(--ember)" strokeWidth="1.3" />
          <circle r={36 + Math.sin(time * 2.2) * 2.5} fill="var(--ember)" opacity="0.92" />
          <circle r="27" fill="var(--bg-raised)" />
          <text y="3.5" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="8.5" letterSpacing="1.2" fill="var(--ember)">
            {t('MODEL', 'MODÈLE')}
          </text>
        </g>

        {/* Output line — straight down, off the panel, toward stage 01 */}
        <line x1={CORE.x} y1={CORE.y + 58} x2={CORE.x} y2={568} stroke="var(--line-strong)" strokeWidth="1.2" />
        {Array.from({ length: 4 }).map((_, k) => {
          const prog = ((time * 0.22) + k / 4) % 1;
          const y = (CORE.y + 58) + prog * (568 - CORE.y - 58);
          return <circle key={`out-${k}`} cx={CORE.x} cy={y} r="2.6" fill="var(--ember)" opacity={Math.sin(prog * Math.PI)} />;
        })}
        <path d={`M ${CORE.x - 5} 560 L ${CORE.x} 570 L ${CORE.x + 5} 560`} fill="none" stroke="var(--ember)" strokeWidth="1.2" />
        <text x={CORE.x + 14} y={556} fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" fill="var(--muted)">
          {t('SHIPPED INTELLIGENCE ↓', 'INTELLIGENCE LIVRÉE ↓')}
        </text>

        {/* Drafting annotations */}
        <text x="6" y="596" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2.5" fill="var(--muted)">
          {t('FIG. 00 — WHAT GOES INTO A MODEL', "FIG. 00 — CE QUI ENTRE DANS UN MODÈLE")}
        </text>
        <g stroke="var(--line-strong)" strokeWidth="1">
          <line x1="505" y1="72" x2="505" y2="250" />
          <line x1="500" y1="72" x2="510" y2="72" />
          <line x1="500" y1="250" x2="510" y2="250" />
        </g>
        <text x="516" y="165" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.5" fill="var(--muted)" transform="rotate(90 516 165)">
          {t('INPUTS → INTELLIGENCE', 'ENTRÉES → INTELLIGENCE')}
        </text>
      </svg>
    </div>
  );
};

const MARQUEE_ITEMS = [
  'Python', 'TypeScript', 'PyTorch', 'OpenAI', 'Anthropic MCP', 'LangChain',
  'Hugging Face', 'FastAPI', 'Node', 'React', 'Next.js', 'PostgreSQL',
  'Docker', 'Kubernetes', 'GitHub Actions', 'Azure', 'AWS', 'GCP', 'Cloudflare',
];

const Hero = () => {
  const t = useT();
  const { lang } = useLang();

  return (
    <section
      data-stage-label={t('00 · INIT', '00 · INIT')}
      style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 90, paddingBottom: 90 }}
    >
      <div
        className="container hero-grid"
        style={{
          width: '100%', display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: 40, alignItems: 'center',
        }}
      >
        {/* Left — editorial typography */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            {t('AI Engineer · Data Scientist · Builder', 'Ingénieur IA · Data Scientist · Créateur')}
          </div>

          {lang === 'fr' ? (
            <h1
              className="display"
              style={{
                fontSize: 'clamp(44px, 6.2vw, 94px)', lineHeight: 0.96,
                letterSpacing: '-0.025em', maxWidth: 880,
              }}
            >
              Du <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>signal brut</em>
              <br />
              à l'intelligence
              <br />
              en production.
            </h1>
          ) : (
            <h1
              className="display"
              style={{
                fontSize: 'clamp(54px, 8vw, 126px)', lineHeight: 0.94,
                letterSpacing: '-0.025em', maxWidth: 880,
              }}
            >
              Turning <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>raw signal</em>
              <br />
              into shipped
              <br />
              intelligence.
            </h1>
          )}

          <div
            style={{
              marginTop: 34, color: 'var(--ink-soft)', fontSize: 18, lineHeight: 1.6,
              maxWidth: 520, fontFamily: 'var(--font-sans)',
            }}
          >
            {lang === 'fr' ? (
              <>
                Ingénieur IA chez <span style={{ color: 'var(--ink)' }}>Enerex</span>, co-fondateur
                de <span style={{ color: 'var(--ink)' }}>Glorea</span>, créateur
                de <span style={{ color: 'var(--ink)' }}>LaRecette.ai</span> — je fais passer les systèmes LLM
                du prompt à la production, sur{' '}
                <span style={{ color: 'var(--ink)' }}>trois continents</span>,{' '}
                <span style={{ color: 'var(--ink)' }}>trois stacks</span>,{' '}
                <span style={{ color: 'var(--ink)' }}>trois langues</span>.
              </>
            ) : (
              <>
                AI engineer at <span style={{ color: 'var(--ink)' }}>Enerex</span>, co-founder
                of <span style={{ color: 'var(--ink)' }}>Glorea</span>, chef behind{' '}
                <span style={{ color: 'var(--ink)' }}>LaRecette.ai</span> — I take LLM systems
                from prompt to production, across{' '}
                <span style={{ color: 'var(--ink)' }}>three continents</span>,{' '}
                <span style={{ color: 'var(--ink)' }}>three stacks</span>,{' '}
                <span style={{ color: 'var(--ink)' }}>three languages</span>.
              </>
            )}
          </div>

          <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Magnetic strength={0.25}>
              <Btn href="#work" variant="primary">{t('See the work →', 'Voir les projets →')}</Btn>
            </Magnetic>
            <Magnetic strength={0.18}>
              <Btn href="#contact" variant="ghost">{t("Let's talk", 'Parlons-en')}</Btn>
            </Magnetic>
          </div>

          <div
            className="hero-meta-strip"
            style={{
              marginTop: 60, display: 'flex', gap: 36,
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
              color: 'var(--muted)', textTransform: 'uppercase',
            }}
          >
            <div>
              <div style={{ color: 'var(--ember)' }}>{t('● Shipping at', '● En prod chez')}</div>
              <div style={{ color: 'var(--ink)', marginTop: 4 }}>Enerex · {t('since 05/2026', 'depuis 05/2026')}</div>
            </div>
            <div>
              <div>{t('Based in', 'Basé à')}</div>
              <div style={{ color: 'var(--ink)', marginTop: 4 }}>Nantes · FR</div>
            </div>
            <div>
              <div>{t('Now building', 'Projet en cours')}</div>
              <div style={{ color: 'var(--ink)', marginTop: 4 }}>Glorea</div>
            </div>
          </div>
        </div>

        {/* Right — animated intake diagram (hidden ≤1024px) */}
        <div className="hero-diagram" style={{ position: 'relative', height: 620, maxHeight: '82vh' }}>
          <HeroDiagram />
        </div>
      </div>

      {/* Bottom marquee — running stack list */}
      <div
        className="hero-marquee"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '15px 0',
          borderTop: '1px solid var(--line)',
          background: 'var(--bg-deep)',
          overflow: 'hidden',
        }}
      >
        <div className="marquee">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={`marquee-${k}`} style={{ display: 'flex', gap: 56, paddingLeft: 56 }}>
              {MARQUEE_ITEMS.map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em',
                    color: 'var(--ink-soft)', textTransform: 'uppercase',
                    display: 'inline-flex', alignItems: 'center', gap: 12,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s}
                  <span style={{ color: 'var(--ember)', opacity: 0.6 }}>✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
