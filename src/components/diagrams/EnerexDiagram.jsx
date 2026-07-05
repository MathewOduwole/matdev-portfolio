import React from 'react';
import { useT } from '../../lang/LanguageContext.jsx';
import { FlowDots, Node, Wire, useClock } from './useClock.jsx';

// Enerex — the unattended AI platform, at portfolio altitude:
// emails/contracts → queue → LLM agent fleet (RAG + MCP tools) →
// confidence-gated validation → products. Packets run the happy path;
// one in a while takes the human-review branch.
const EnerexDiagram = () => {
  const t = useT();
  const [ref, time] = useClock(0.6);

  const MID = 118; // main flow centerline
  const activeAgent = Math.floor(time * 0.9) % 3;

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg viewBox="0 0 560 400" width="100%" style={{ display: 'block', overflow: 'visible' }} aria-hidden="true">
        {/* Inputs */}
        <Node x={22} y={64}  w={92} h={32} label={t('EMAILS', 'E-MAILS')} />
        <Node x={22} y={140} w={92} h={32} label={t('CONTRACTS', 'CONTRATS')} />

        {/* Queue */}
        <g>
          <rect x={152} y={78} width={54} height={80} rx="6" fill="var(--bg-raised)" stroke="var(--ink)" strokeWidth="1" />
          {[0, 1, 2].map((i) => {
            const on = Math.floor(time * 2 + i) % 3 !== 0;
            return (
              <rect
                key={i}
                x={161} y={90 + i * 20} width={36} height={10} rx="2"
                fill={on ? 'var(--ember)' : 'var(--line-strong)'}
                opacity={on ? 0.85 : 0.6}
              />
            );
          })}
          <text x={179} y={174} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.5" letterSpacing="1.5" fill="var(--muted)">
            {t('QUEUE', "FILE D'ATTENTE")}
          </text>
        </g>

        {/* Agent fleet */}
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect
                x={244} y={70 + i * 33} width={110} height={26} rx="6"
                fill={i === activeAgent ? 'var(--ember-glow)' : 'var(--bg-raised)'}
                stroke={i === activeAgent ? 'var(--ember)' : 'var(--ink)'}
                strokeWidth="1"
              />
              <circle cx={256} cy={83 + i * 33} r="2.5" fill={i === activeAgent ? 'var(--ember)' : 'var(--line-strong)'} />
              <text x={266} y={86.5 + i * 33} fontFamily="var(--font-mono)" fontSize="8" letterSpacing="1.2" fill="var(--ink)">
                {t('AGENT', 'AGENT')} 0{i + 1}
              </text>
            </g>
          ))}
          <text x={299} y={182} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.5" letterSpacing="1.5" fill="var(--muted)">
            {t('LLM AGENT FLEET', "FLOTTE D'AGENTS LLM")}
          </text>
        </g>

        {/* Validation gate (diamond) */}
        <g transform="translate(424 118)">
          <path d="M 0 -30 L 30 0 L 0 30 L -30 0 Z" fill="var(--bg-raised)" stroke="var(--ink)" strokeWidth="1" />
          <text y="3" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1" fill="var(--ink)">
            {t('CONF.', 'CONF.')}
          </text>
          <text y="48" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6.5" letterSpacing="1" fill="var(--muted)">
            {t('AUTO · FLAG · BLOCK', 'AUTO · ALERTE · BLOCAGE')}
          </text>
        </g>

        {/* Output */}
        <Node x={492} y={102} w={62} h={32} label={t('CRM', 'CRM')} sub={t('PRODUCTS', 'PRODUITS')} />

        {/* Human-review branch off the gate */}
        <Wire x1={424} y1={148} x2={424} y2={196} />
        <g>
          <rect x={394} y={196} width={60} height={24} rx="12" fill="var(--bg-raised)" stroke="var(--amber)" strokeWidth="1" />
          <text x={424} y={211} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1" fill="var(--amber)">
            {t('HUMAN', 'HUMAIN')}
          </text>
        </g>

        {/* Main wires */}
        <Wire x1={114} y1={80}  x2={152} y2={100} />
        <Wire x1={114} y1={156} x2={152} y2={136} />
        <Wire x1={206} y1={MID} x2={244} y2={MID} />
        <Wire x1={354} y1={MID} x2={394} y2={MID} />
        <Wire x1={454} y1={MID} x2={492} y2={MID} />

        {/* Support systems below the agents */}
        <g>
          {/* RAG index cylinder */}
          <g transform="translate(250 248)">
            <ellipse cx="30" cy="8" rx="30" ry="8" fill="var(--bg-raised)" stroke="var(--ink)" strokeWidth="1" />
            <path d="M 0 8 L 0 46 A 30 8 0 0 0 60 46 L 60 8" fill="var(--bg-raised)" stroke="var(--ink)" strokeWidth="1" />
            <text x="30" y="34" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="1" fill="var(--ink)">RAG</text>
            <text x="30" y="72" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6.5" letterSpacing="1" fill="var(--muted)">
              {t('VECTOR INDEX', 'INDEX VECTORIEL')}
            </text>
          </g>
          <Wire x1={288} y1={168} x2={281} y2={248} />

          {/* MCP tool server */}
          <rect x={344} y={252} width={92} height={40} rx="6" fill="var(--bg-raised)" stroke="var(--teal)" strokeWidth="1" />
          <text x={390} y={269} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.5" letterSpacing="1" fill="var(--teal)">MCP SERVER</text>
          <text x={390} y={281} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6.5" letterSpacing="1" fill="var(--muted)">
            {t('80+ TOOLS · 9 PRODUCTS', '80+ OUTILS · 9 PRODUITS')}
          </text>
          <Wire x1={330} y1={168} x2={382} y2={252} />

          {/* Eval gate note */}
          <rect x={462} y={252} width={84} height={40} rx="6" fill="none" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="4 3" />
          <text x={504} y={269} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.5" letterSpacing="1" fill="var(--ink-soft)">
            {t('EVALS', 'ÉVALS')}
          </text>
          <text x={504} y={281} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6.5" letterSpacing="1" fill="var(--muted)">
            {t('SHIP GATE', 'FEU VERT')}
          </text>
        </g>

        {/* Packet traffic */}
        <FlowDots x1={114} y1={80}  x2={152} y2={100} time={time} count={2} speed={0.5} />
        <FlowDots x1={114} y1={156} x2={152} y2={136} time={time} count={2} speed={0.42} offset={0.3} />
        <FlowDots x1={206} y1={MID} x2={244} y2={MID} time={time} count={2} speed={0.55} offset={0.15} />
        <FlowDots x1={354} y1={MID} x2={394} y2={MID} time={time} count={2} speed={0.55} offset={0.4} />
        <FlowDots x1={454} y1={MID} x2={492} y2={MID} time={time} count={2} speed={0.5}  offset={0.2} />
        {/* RAG + MCP chatter */}
        <FlowDots x1={288} y1={168} x2={281} y2={248} time={time} count={1} speed={0.32} color="var(--muted)" r={1.8} />
        <FlowDots x1={382} y1={252} x2={330} y2={168} time={time} count={1} speed={0.36} offset={0.5} color="var(--teal)" r={1.8} />
        {/* Occasional human-review packet */}
        <FlowDots x1={424} y1={148} x2={424} y2={196} time={time} count={1} speed={0.12} color="var(--amber)" r={2} />

        {/* Latency annotation */}
        <g fontFamily="var(--font-mono)" fill="var(--muted)">
          <line x1={22} y1={352} x2={554} y2={352} stroke="var(--line-strong)" strokeWidth="1" />
          <line x1={22} y1={347} x2={22} y2={357} stroke="var(--line-strong)" strokeWidth="1" />
          <line x1={554} y1={347} x2={554} y2={357} stroke="var(--line-strong)" strokeWidth="1" />
          <text x={288} y={344} textAnchor="middle" fontSize="7.5" letterSpacing="2">
            {t('END-TO-END: MINUTES → SECONDS (~10×)', 'DE BOUT EN BOUT : MINUTES → SECONDES (~10×)')}
          </text>
        </g>
      </svg>
    </div>
  );
};

export default EnerexDiagram;
