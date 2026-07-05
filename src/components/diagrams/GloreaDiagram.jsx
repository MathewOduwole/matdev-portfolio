import React from 'react';
import { useT } from '../../lang/LanguageContext.jsx';
import { FlowDots, Node, Wire, useClock } from './useClock.jsx';

// Glorea — the hybrid-cloud research platform: sources → ingestion pipelines
// → database → API → web, laid over the three infrastructure zones the stack
// actually runs on (Hetzner / Cloudflare / Vercel), with the Azure exodus
// noted below. The point of the drawing IS the migration story.
const GloreaDiagram = () => {
  const t = useT();
  const [ref, time] = useClock(0.3);

  const MID = 110;
  const pulse = (i) => 0.5 + Math.sin(time * 2.2 + i) * 0.4;

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg viewBox="0 0 560 400" width="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
        {/* Sources */}
        <Node x={20} y={62}  w={86} h={30} label={t('PAPERS', 'ARTICLES')} sub="20M+" />
        <Node x={20} y={128} w={86} h={30} label={t('JOBS', 'EMPLOIS')} sub="600K+" />

        {/* Ingestion pipelines — pulsing bars */}
        <g>
          <rect x={146} y={78} width={92} height={64} rx="6" fill="var(--bg-raised)" stroke="var(--ink)" strokeWidth="1" />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={158} y={90 + i * 15} width={68} height={7} rx="2"
              fill="var(--ember)" opacity={pulse(i)}
            />
          ))}
          <text x={192} y={158} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.5" letterSpacing="1.5" fill="var(--muted)">
            {t('PIPELINES', 'PIPELINES')}
          </text>
        </g>

        {/* Database cylinder */}
        <g transform="translate(278 82)">
          <ellipse cx="32" cy="8" rx="32" ry="8" fill="var(--bg-raised)" stroke="var(--ink)" strokeWidth="1" />
          <path d="M 0 8 L 0 48 A 32 8 0 0 0 64 48 L 64 8" fill="var(--bg-raised)" stroke="var(--ink)" strokeWidth="1" />
          <text x="32" y="35" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.5" letterSpacing="1" fill="var(--ink)">PG</text>
          <text x="32" y="76" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6.5" letterSpacing="1" fill="var(--muted)">POSTGRES</text>
        </g>

        {/* API + Web */}
        <Node x={392} y={95} w={62} h={30} label="API" />
        <Node x={492} y={95} w={62} h={30} label="WEB" sub={t('100+ USERS', '100+ UTIL.')} />

        {/* Wires */}
        <Wire x1={106} y1={77}  x2={146} y2={95} />
        <Wire x1={106} y1={143} x2={146} y2={125} />
        <Wire x1={238} y1={MID} x2={278} y2={MID} />
        <Wire x1={342} y1={MID} x2={392} y2={MID} />
        <Wire x1={454} y1={MID} x2={492} y2={MID} />

        {/* Traffic */}
        <FlowDots x1={106} y1={77}  x2={146} y2={95}  time={time} count={2} speed={0.5} />
        <FlowDots x1={106} y1={143} x2={146} y2={125} time={time} count={2} speed={0.44} offset={0.3} />
        <FlowDots x1={238} y1={MID} x2={278} y2={MID} time={time} count={2} speed={0.55} offset={0.1} />
        <FlowDots x1={342} y1={MID} x2={392} y2={MID} time={time} count={2} speed={0.5}  offset={0.35} />
        <FlowDots x1={454} y1={MID} x2={492} y2={MID} time={time} count={3} speed={0.62} offset={0.2} />

        {/* Infrastructure zones */}
        <g fontFamily="var(--font-mono)">
          <rect x={140} y={210} width={210} height={54} rx="8" fill="none" stroke="var(--crimson)" strokeWidth="1" strokeDasharray="5 4" opacity="0.75" />
          <text x={245} y={232} textAnchor="middle" fontSize="8" letterSpacing="1.5" fill="var(--crimson)">HETZNER</text>
          <text x={245} y={246} textAnchor="middle" fontSize="6.5" letterSpacing="1" fill="var(--muted)">
            {t('SERVICES · DATABASES', 'SERVICES · BASES DE DONNÉES')}
          </text>

          <rect x={366} y={210} width={110} height={54} rx="8" fill="none" stroke="var(--amber)" strokeWidth="1" strokeDasharray="5 4" opacity="0.8" />
          <text x={421} y={232} textAnchor="middle" fontSize="8" letterSpacing="1.5" fill="var(--amber)">CLOUDFLARE</text>
          <text x={421} y={246} textAnchor="middle" fontSize="6.5" letterSpacing="1" fill="var(--muted)">
            {t('EDGE · CACHE · R2', 'EDGE · CACHE · R2')}
          </text>

          <rect x={490} y={210} width={64} height={54} rx="8" fill="none" stroke="var(--teal)" strokeWidth="1" strokeDasharray="5 4" opacity="0.8" />
          <text x={522} y={232} textAnchor="middle" fontSize="8" letterSpacing="1.5" fill="var(--teal)">VERCEL</text>
          <text x={522} y={246} textAnchor="middle" fontSize="6.5" letterSpacing="1" fill="var(--muted)">FRONT</text>

          {/* Zone anchors */}
          <Wire x1={192} y1={142} x2={192} y2={210} />
          <Wire x1={310} y1={138} x2={280} y2={210} />
          <Wire x1={423} y1={125} x2={421} y2={210} />
          <Wire x1={523} y1={125} x2={522} y2={210} />
        </g>

        {/* Azure exodus note */}
        <g fontFamily="var(--font-mono)">
          <rect x={20} y={218} width={64} height={38} rx="6" fill="none" stroke="var(--line-strong)" strokeWidth="1" />
          <text x={52} y={240} textAnchor="middle" fontSize="8" letterSpacing="1.5" fill="var(--muted)" style={{ textDecoration: 'line-through' }}>AZURE</text>
          <line x1={84} y1={237} x2={140} y2={237} stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="3 4" />
          <path d="M 134 233 L 142 237 L 134 241" fill="none" stroke="var(--line-strong)" strokeWidth="1" />
          <text x={20} y={284} fontSize="7" letterSpacing="1.5" fill="var(--muted)">
            {t('MIGRATED 2024 — COST ↓, CONTROL ↑', 'MIGRÉ EN 2024 — COÛTS ↓, CONTRÔLE ↑')}
          </text>
        </g>

        {/* Dimension annotation */}
        <g fontFamily="var(--font-mono)" fill="var(--muted)">
          <line x1={20} y1={352} x2={554} y2={352} stroke="var(--line-strong)" strokeWidth="1" />
          <line x1={20} y1={347} x2={20} y2={357} stroke="var(--line-strong)" strokeWidth="1" />
          <line x1={554} y1={347} x2={554} y2={357} stroke="var(--line-strong)" strokeWidth="1" />
          <text x={287} y={344} textAnchor="middle" fontSize="7.5" letterSpacing="2">
            {t('DESIGN → PIPELINES → PROD, BUILT FROM ZERO', 'DESIGN → PIPELINES → PROD — PARTI DE ZÉRO')}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default GloreaDiagram;
