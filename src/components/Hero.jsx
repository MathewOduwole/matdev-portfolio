import React, { useRef } from 'react';
import { Btn, Magnetic, useSectionScroll } from '../shared.jsx';
import { useLang, useT } from '../lang/LanguageContext.jsx';

// SVG dataflow diagram driven entirely by `progress` (0..1).
// Four phases: ingest → train → deploy → impact. Phases ramp in/out
// across overlapping windows so the scene is always doing something.
const HeroDiagram = ({ progress }) => {
  const t = useT();
  const p = progress;
  const ingest = Math.max(0, Math.min(1, (p - 0.0)  / 0.30));
  const train  = Math.max(0, Math.min(1, (p - 0.20) / 0.35));
  const deploy = Math.max(0, Math.min(1, (p - 0.50) / 0.30));
  const impact = Math.max(0, Math.min(1, (p - 0.70) / 0.30));
  const PATH_LEN = 320;

  const sources = [
    { x: 80,  y: 80, label: t('PAPERS', 'ARTICLES') },
    { x: 300, y: 60, label: t('JOBS',   'EMPLOIS') },
    { x: 520, y: 80, label: t('LOGS',   'LOGS') },
  ];

  const metrics = [
    { x: 90,  y: 640, v: '28',    l: t('STUDENTS', 'ÉTUDIANTS') },
    { x: 300, y: 640, v: '300K+', l: t('JOBS',     'EMPLOIS') },
    { x: 510, y: 640, v: '100+',  l: t('USERS',    'UTILISATEURS') },
  ];

  const phases = [
    { at: 0.10, label: t('01 · INGEST', '01 · COLLECTE') },
    { at: 0.35, label: t('02 · MODEL',  '02 · MODÈLE') },
    { at: 0.65, label: t('03 · DEPLOY', '03 · DÉPLOIEMENT') },
    { at: 0.90, label: t('04 · IMPACT', '04 · IMPACT') },
  ];

  return (
    <svg viewBox="0 0 600 700" width="100%" height="100%" style={{ overflow: 'visible' }} aria-hidden="true">
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--ember)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--ember)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="300" cy="350" r={80 + train * 60} fill="url(#halo)" opacity={train * 0.9} />

      {sources.map((s, i) => {
        const o = Math.max(0, Math.min(1, ingest - i * 0.12));
        return (
          <g key={s.label} opacity={o} transform={`translate(0, ${(1 - o) * -12})`}>
            <text x={s.x} y={s.y} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="2" fill="var(--muted)">
              {s.label}
            </text>
            <line x1={s.x - 18} y1={s.y + 8} x2={s.x + 18} y2={s.y + 8} stroke="var(--line-strong)" strokeWidth="1" />
          </g>
        );
      })}

      {Array.from({ length: 24 }).map((_, i) => {
        const col = i % 3;
        const sx = [80, 300, 520][col];
        const phaseOffset = i / 24;
        const tt = (p * 2 + phaseOffset) % 1;
        const ex = 300;
        const ey = 340;
        const x = sx + (ex - sx) * tt;
        const y = 90 + (ey - 90) * tt;
        const op = Math.sin(tt * Math.PI) * (1 - deploy * 0.7) * (ingest > 0.05 ? 1 : 0);
        return <circle key={`drop-${i}`} cx={x} cy={y} r="1.5" fill="var(--ember)" opacity={op} />;
      })}

      <g opacity={train}>
        <g transform={`translate(300 350) rotate(${p * 360})`}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const r = 60;
            const x2 = Math.cos(a) * r;
            const y2 = Math.sin(a) * r;
            return <line key={`spoke-${i}`} x1={0} y1={0} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="0.8" opacity="0.6" />;
          })}
          <circle
            cx="0" cy="0" r={60 - train * 5} fill="none"
            stroke="var(--ember)" strokeWidth="1.4"
            strokeDasharray={`${PATH_LEN} ${PATH_LEN}`}
            strokeDashoffset={(1 - train) * PATH_LEN}
            transform="rotate(-90)"
          />
          <circle cx="0" cy="0" r={36 + Math.sin(p * 12) * 2} fill="var(--ember)" opacity={train * 0.92} />
          <circle cx="0" cy="0" r={20} fill="var(--bg-raised)" opacity={train} />
          <text x="0" y="4" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" fill="var(--ember)" opacity={train}>
            {t('MODEL', 'MODÈLE')}
          </text>
        </g>
      </g>

      <g opacity={deploy} transform="translate(300 350)">
        {[110, 150, 195].map((r, i) => (
          <ellipse
            key={`ring-${i}`}
            cx="0" cy="0" rx={r} ry={r * 0.34}
            fill="none" stroke="var(--ember)"
            strokeWidth="0.8" opacity={0.4 - i * 0.08}
            transform={`rotate(${i * 18 + p * 30})`}
          />
        ))}
        {[0, 1, 2].map((i) => {
          const r = [110, 150, 195][i];
          const a = (p * (1 + i * 0.4) + i * 1.2) * Math.PI;
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r * 0.34;
          return <circle key={`sat-${i}`} cx={x} cy={y} r="3.2" fill="var(--ember)" opacity={deploy} />;
        })}
      </g>

      <g opacity={impact} transform="translate(300 350)">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const r1 = 220;
          const r2 = 260 + impact * 30;
          const x1 = Math.cos(a) * r1;
          const y1 = Math.sin(a) * r1;
          const x2 = Math.cos(a) * r2;
          const y2 = Math.sin(a) * r2;
          return <line key={`ray-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ember)" strokeWidth="1" opacity="0.5" />;
        })}
      </g>

      {metrics.map((m, i) => {
        const o = Math.max(0, Math.min(1, impact - i * 0.08));
        return (
          <g key={m.l} opacity={o} transform={`translate(0, ${(1 - o) * 12})`}>
            <text x={m.x} y={m.y} textAnchor="middle" fontFamily="var(--font-display)" fontSize="38" fill="var(--ink)">{m.v}</text>
            <text x={m.x} y={m.y + 18} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" fill="var(--muted)">{m.l}</text>
          </g>
        );
      })}

      <g>
        {phases.map((ph) => {
          const dist = Math.abs(p - ph.at);
          const o = Math.max(0, 1 - dist * 6);
          return (
            <text
              key={ph.label}
              x={300} y={490} textAnchor="middle"
              fontFamily="var(--font-mono)" fontSize="10" letterSpacing="3"
              fill="var(--ember)" opacity={o}
            >
              {ph.label}
            </text>
          );
        })}
      </g>
    </svg>
  );
};

const MARQUEE_ITEMS = [
  'Python', 'PyTorch', 'scikit-learn', 'Hugging Face', 'pandas',
  'SQL', 'FastAPI', 'Docker', 'GitHub Actions', 'AWS', 'GCP',
  'React', 'Node', 'LangChain', 'Tableau',
];

const Hero = () => {
  const t = useT();
  const { lang } = useLang();
  const sectionRef = useRef(null);
  const progress = useSectionScroll(sectionRef);

  return (
    <section ref={sectionRef} data-screen-label="Hero" style={{ position: 'relative', height: '320vh' }}>
      <div
        style={{
          position: 'sticky', top: 0,
          height: '100vh', width: '100%',
          overflow: 'hidden',
          display: 'flex', alignItems: 'center',
        }}
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
            <div className="eyebrow" style={{ marginBottom: 18, color: 'var(--ember)' }}>
              {t('Data Scientist · ML Engineer · Developer', 'Data Scientist · Ingénieur ML · Développeur')}
            </div>

            {lang === 'fr' ? (
              // Tighter clamp for French: "à l'intelligence" is much wider than
              // its English counterpart at the same size and was wrapping into
              // multiple lines, pushing the headline above the viewport.
              <h1
                className="display"
                style={{
                  fontSize: 'clamp(44px, 6.4vw, 96px)', lineHeight: 0.96,
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
                  fontSize: 'clamp(56px, 8.4vw, 132px)', lineHeight: 0.94,
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
                marginTop: 36, color: 'var(--ink-soft)', fontSize: 18, lineHeight: 1.6,
                maxWidth: 480, fontFamily: 'var(--font-sans)',
              }}
            >
              {lang === 'fr' ? (
                <>
                  Data scientist menant des modèles du notebook à la production —
                  à travers <span style={{ color: 'var(--ink)' }}>trois continents</span>,{' '}
                  <span style={{ color: 'var(--ink)' }}>trois stacks</span>,{' '}
                  <span style={{ color: 'var(--ink)' }}>trois langues</span>.
                </>
              ) : (
                <>
                  A data scientist taking models from notebook to production —
                  across <span style={{ color: 'var(--ink)' }}>three continents</span>,{' '}
                  <span style={{ color: 'var(--ink)' }}>three stacks</span>,{' '}
                  <span style={{ color: 'var(--ink)' }}>three languages</span>.
                </>
              )}
            </div>

            <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Magnetic strength={0.25}>
                <Btn href="#work" variant="primary">{t('See selected work →', 'Voir mes projets →')}</Btn>
              </Magnetic>
              <Magnetic strength={0.18}>
                <Btn href="#contact" variant="ghost">{t("Let's talk", 'Parlons-en')}</Btn>
              </Magnetic>
            </div>

            <div
              className="hero-meta-strip"
              style={{
                marginTop: 64, display: 'flex', gap: 36,
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
                color: 'var(--muted)', textTransform: 'uppercase',
              }}
            >
              <div>
                <div style={{ color: 'var(--ember)' }}>{t('● AVAILABLE', '● DISPONIBLE')}</div>
                <div style={{ marginTop: 4 }}>{t('For roles · contracts', 'Postes · missions')}</div>
              </div>
              <div>
                <div>{t('Based in', 'Basé à')}</div>
                <div style={{ color: 'var(--ink)', marginTop: 4 }}>Nantes · FR</div>
              </div>
              <div>
                <div>{t('Worked across', 'A travaillé à')}</div>
                <div style={{ color: 'var(--ink)', marginTop: 4 }}>Austin · Miami · Paris</div>
              </div>
            </div>
          </div>

          {/* Right — animated diagram (decorative; hidden on mobile) */}
          <div className="hero-diagram" style={{ position: 'relative', height: 700, maxHeight: '85vh' }}>
            <HeroDiagram progress={progress} />
            <div
              aria-hidden="true"
              style={{
                position: 'absolute', right: -8, top: 0, bottom: 0,
                width: 1, background: 'var(--line)',
              }}
            >
              <div
                style={{
                  position: 'absolute', left: -3, top: `${progress * 100}%`,
                  width: 7, height: 7, borderRadius: '50%',
                  background: 'var(--ember)', transform: 'translateY(-50%)',
                  boxShadow: '0 0 0 4px var(--ember-glow)',
                  transition: 'top 0.05s linear',
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom marquee — running stack list (tech names, not translated; hidden on mobile) */}
        <div
          className="hero-marquee"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '16px 0',
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
      </div>
    </section>
  );
};

export default Hero;
