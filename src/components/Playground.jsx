import React, { useMemo, useState } from 'react';
import { Btn, Eyebrow, FadeIn } from '../shared.jsx';
import { useLang, useT } from '../lang/LanguageContext.jsx';

const W = 600;
const H = 320;
const SEED_POINTS = [
  { x: 60,  y: 220 }, { x: 130, y: 180 }, { x: 200, y: 150 },
  { x: 280, y: 130 }, { x: 360, y: 95  }, { x: 440, y: 80 }, { x: 520, y: 60 },
];

// Inline interactive — a tiny linear-regression toy. Click the canvas to add
// points; the line refits via least-squares in real time and R² updates.
const RegressionToy = () => {
  const t = useT();
  const [points, setPoints] = useState(SEED_POINTS);

  const stats = useMemo(() => {
    const n = points.length;
    if (n < 2) return null;
    const sumX = points.reduce((s, p) => s + p.x, 0);
    const sumY = points.reduce((s, p) => s + p.y, 0);
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
    const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);
    const denom = n * sumX2 - sumX * sumX;
    if (Math.abs(denom) < 1e-6) return null;
    const m = (n * sumXY - sumX * sumY) / denom;
    const b = (sumY - m * sumX) / n;
    const meanY = sumY / n;
    const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
    const ssRes = points.reduce((s, p) => {
      const yPred = m * p.x + b;
      return s + (p.y - yPred) ** 2;
    }, 0);
    const r2 = ssTot < 1e-6 ? 1 : 1 - ssRes / ssTot;
    return { m, b, r2 };
  }, [points]);

  const onClick = (e) => {
    const svg = e.currentTarget;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    setPoints((ps) => [...ps, { x, y }]);
  };

  let lineEls = null;
  if (stats) {
    const x1 = 0;
    const x2 = W;
    const y1 = stats.m * x1 + stats.b;
    const y2 = stats.m * x2 + stats.b;
    lineEls = <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ember)" strokeWidth="2" />;
  }

  return (
    <div style={{ marginTop: 36 }}>
      <div
        style={{
          display: 'grid', gridTemplateColumns: '1.5fr 1fr',
          gap: 28, alignItems: 'start',
        }}
      >
        <div
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--line-strong)',
            borderRadius: 12, padding: 16,
          }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%" height={H}
            onClick={onClick}
            style={{ cursor: 'crosshair', display: 'block' }}
            data-cursor="hover"
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2={H} stroke="var(--line)" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 80} x2={W} y2={i * 80} stroke="var(--line)" strokeWidth="0.5" />
            ))}
            {lineEls}
            {stats && points.map((p, i) => {
              const yPred = stats.m * p.x + stats.b;
              return (
                <line
                  key={`r${i}`}
                  x1={p.x} y1={p.y} x2={p.x} y2={yPred}
                  stroke="var(--ember)" strokeWidth="0.6"
                  strokeDasharray="2 2" opacity="0.5"
                />
              );
            })}
            {points.map((p, i) => (
              <circle key={`pt-${i}`} cx={p.x} cy={p.y} r="5" fill="var(--ink)" stroke="var(--bg)" strokeWidth="2" />
            ))}
          </svg>
        </div>

        <div>
          <div
            className="mono"
            style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            {t('Live model', 'Modèle en direct')}
          </div>
          <div className="display" style={{ fontSize: 38, color: 'var(--ink)', marginTop: 8 }}>
            ŷ ={' '}
            <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>{stats ? stats.m.toFixed(3) : '—'}</em>
            {' '}· x +{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--ember)' }}>{stats ? stats.b.toFixed(2) : '—'}</em>
          </div>

          <div style={{ marginTop: 24, display: 'grid', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', paddingBottom: 10 }}>
              <span style={{ color: 'var(--muted)' }}>{t('n (points)', 'n (points)')}</span>
              <span style={{ color: 'var(--ink)' }}>{points.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', paddingBottom: 10 }}>
              <span style={{ color: 'var(--muted)' }}>{t('slope (m)', 'pente (m)')}</span>
              <span style={{ color: 'var(--ink)' }}>{stats ? stats.m.toFixed(4) : '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', paddingBottom: 10 }}>
              <span style={{ color: 'var(--muted)' }}>{t('intercept (b)', 'ordonnée (b)')}</span>
              <span style={{ color: 'var(--ink)' }}>{stats ? stats.b.toFixed(2) : '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--line)', paddingBottom: 10 }}>
              <span style={{ color: 'var(--muted)' }}>{t('R² (fit quality)', 'R² (qualité d\'ajustement)')}</span>
              <span style={{ color: 'var(--ember)' }}>{stats ? stats.r2.toFixed(3) : '—'}</span>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
            <Btn onClick={() => setPoints(SEED_POINTS)} variant="ghost" style={{ fontSize: 12, padding: '10px 18px' }}>
              {t('↻ Reset', '↻ Réinitialiser')}
            </Btn>
            <Btn onClick={() => setPoints([])} variant="ghost" style={{ fontSize: 12, padding: '10px 18px' }}>
              {t('Clear', 'Effacer')}
            </Btn>
          </div>
          <p style={{ marginTop: 18, color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
            {t(
              'Click anywhere on the canvas to add a data point. The line refits via least-squares in real time. The dashed segments are residuals — what your model gets wrong.',
              "Cliquez n'importe où sur le canvas pour ajouter un point. La droite se réajuste par moindres carrés en temps réel. Les segments en pointillés sont les résidus — ce que votre modèle se trompe."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const Playground = () => {
  const t = useT();
  const { lang } = useLang();
  return (
    <section
      id="playground"
      data-screen-label="Playground"
      className="section-pad"
      style={{ background: 'var(--bg)' }}
    >
      <div className="container">
        <FadeIn><Eyebrow>{t('04 — Playground', '04 — Playground')}</Eyebrow></FadeIn>
        <FadeIn delay={0.1}>
          <div
            style={{
              display: 'grid', gridTemplateColumns: '1.4fr 1fr',
              gap: 60, marginTop: 24, alignItems: 'end',
            }}
          >
            <h2
              className="display"
              style={{ fontSize: 'clamp(40px, 5.5vw, 76px)', lineHeight: 0.98, maxWidth: 700 }}
            >
              {lang === 'fr' ? (
                <>Le modèle le plus simple<br />en apprend le plus.</>
              ) : (
                <>The simplest model<br />still teaches the most.</>
              )}
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 16, lineHeight: 1.6, maxWidth: 380 }}>
              {t(
                "A live linear regression — plot points, watch the line refit. It's the smallest meaningful demo of what every ML system does underneath: fit, evaluate, iterate.",
                "Une régression linéaire en direct — placez des points, regardez la droite se réajuster. La plus petite démo significative de ce que tout système ML fait sous le capot : ajuster, évaluer, itérer."
              )}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}><RegressionToy /></FadeIn>
      </div>
    </section>
  );
};

export default Playground;
